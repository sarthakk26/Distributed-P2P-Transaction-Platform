import express from "express";
import { prisma } from "@repo/db"
import crypto from "crypto";
import { logTransition } from "./monitoring/transitionLogger";

const app = express();

app.use(express.json());

app.get("health", (_req, res) => {
    res.status(200).json({ status: "ok" });
})

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


    if (!signature) {
        return res.status(200).json({ message: "Missing signature Ignored" });
    }

    if (!verifySignature(req.body, signature)) {
        return res.status(200).json({ message: "Invalid signature ignored" });
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

            // 3️⃣ REPLAY / invalid state protection
            if (txn.status !== "PROCESSING") {
                // SUCCESS / FAILED / INITIATED → ignore safely
                return;
            }

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

            // 5️⃣ PROCESSING → SUCCESS (guarded)
            const updated = await tx.onRampTransaction.updateMany({
                where: {
                    id: txn.id,
                    status: "PROCESSING"
                },
                data: {
                    status: "SUCCESS"
                }
            });
            if (updated.count !== 1) {
                throw new Error("INVALID_STATE_TRANSITION");
            }
            await logTransition(tx, {
                domain: "ONRAMP",
                entityId: txn.id,
                from: "PROCESSING",
                to: "SUCCESS",
                meta: { amount }
            });
        });

        // 6️⃣ ALWAYS ACK (even duplicates)
        return res.status(200).json({ message: "Webhook processed" });

    } catch (err) {
        console.error("Webhook processing error:", err);
        // ❗ STILL ACK — never cause retries
        return res.status(200).json({ message: "Ignored" });
    }
})

app.listen(3003, () => {
    console.log("Bank webhook server running on port 3003");
});