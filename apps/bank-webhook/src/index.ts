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


    const { token, user_identifier, amount } = req.body;

    if (!token || !user_identifier || !amount) {
        // ❗ ACK bad payloads to avoid retries
        return res.status(200).json({ message: "Invalid payload ignored" });
    }

    try {
        await prisma.$transaction(async (tx) => {

            // 1️⃣ Lock the on-ramp transaction row
            const rows = await tx.$queryRaw<any[]>`
            SELECT * FROM "OnRampTransaction" 
            WHERE "token" = ${token} 
            FOR UPDATE
        `;
            const txn = rows[0];

            // 2️⃣ Unknown token → ignore safely
            if (!txn) {
                return;
            }

            // 3️⃣ REPLAY PROTECTION
            if (txn.status === "Success") return;
            if (txn.status !== "Processing") return;

            // 4️⃣ Credit balance
            await tx.balance.upsert({
                where: { userId: (txn.userId) },
                update: {
                    amount: { increment: Number(amount) }
                },
                create: {
                    userId: (txn.userId),
                    amount: Number(amount),
                    locked: 0
                }
            });

            // 5️⃣ Mark transaction as completed
            await tx.onRampTransaction.update({
                where: { token },
                data: { status: "Success" }
            });
        });

        // 6️⃣ ALWAYS ACK (even duplicates)
        return res.status(200).json({ message: "Webhook processed" });

    } catch (e) {
        console.error(e);
        // ❗ STILL ACK — never cause retries
        return res.status(200).json({ message: "Ignored" });
    }
})

app.listen(3003, () => {
    console.log("Bank webhook server running on port 3003");
});