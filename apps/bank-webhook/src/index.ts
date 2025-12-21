import express from "express";
import { prisma } from "@repo/db"
import crypto from "crypto";

const app = express();

app.use(express.json());

const SECRET = process.env.BANK_WEBHOOK_SECRET!;

function verifySignature(reqBody: any, signature: string) {
    const computed = crypto
        .createHmac("sha256", SECRET)
        .update(JSON.stringify(reqBody))
        .digest("hex")

    return computed === signature;
}

app.post("/hdfcWebhook", async (req, res) => {

    const signature = req.headers["x-bank-signature"] as string;
    console.log("Signature at WebHook:", signature)

    if (!signature) {
        return res.status(401).json({ message: "Missing signature" });
    }

    if (!verifySignature(req.body, signature)) {
        return res.status(401).json({ message: "Invalid signature" });
    }

    const paymentInformation: {
        token: string;
        userId: string;
        amount: string
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    }

    try {
        await prisma.$transaction(async (tx) => {
            
            const transaction = await tx.$queryRaw<any[]>`
            SELECT * FROM "OnRampTransaction" 
            WHERE "token" = ${paymentInformation.token} 
            FOR UPDATE
        `;

            const transactionData = transaction[0];

            // 2. Check if this has already been processed (Idempotency)
            if (!transactionData || transactionData.status !== "Processing") {
                return;
            }

            // 3. Update the Balance (Upsert is fine here since we are inside a lock)
            await tx.balance.upsert({
                where: { userId: Number(paymentInformation.userId) },
                update: {
                    amount: { increment: Number(paymentInformation.amount) }
                },
                create: {
                    userId: Number(paymentInformation.userId),
                    amount: Number(paymentInformation.amount),
                    locked: 0
                }
            });

            // 4. Update the OnRampTransaction status
            await tx.onRampTransaction.update({
                where: { token: paymentInformation.token },
                data: { status: "Success" }
            });
        });

        res.json({ message: "Captured" });

    } catch (e) {
        console.error(e);
        res.status(411).json({ message: "Error while processing Webhook" });
    }
})

app.listen(3003, () => {
    console.log("Bank webhook server running on port 3003");
});