import express from "express";
import cors from "cors";
import axios from "axios";
import crypto from "crypto";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(cors());

const WEBHOOK_URL = "http://localhost:3003/hdfcWebhook"; // Ensure this port matches your running User App
const SECRET = process.env.BANK_WEBHOOK_SECRET || "fallback_secret"; // Ensure this matches user-app

app.post("/bank/pay", async (req, res) => {
    const { token, userId, amount } = req.body;

    if (!token || !userId || !amount) {
        return res.status(400).json({ message: "Missing fields" });
    }

    const payload = {
        token,
        user_identifier: userId,
        amount: String(amount) // CAST TO STRING: standard fix for Zod schema issues (see below)
    };

    // GENERATING HMAC SIGNATURE
    const signature = crypto
        .createHmac("sha256", SECRET)
        .update(JSON.stringify(payload))
        .digest("hex");

    console.log("Signature at bank:", signature);

    // 1. Respond to the user IMMEDIATELY.
    const delay = Math.floor(Math.random() * 4000) + 1000;
    res.json({ message: "Payment processing started", delay });

    // 2. Process webhook in background (Independent of the user's request)
    setTimeout(async () => {
        try {
            await axios.post(WEBHOOK_URL, payload, {
                headers: {
                    "x-bank-signature": signature
                }
            });
            console.log("Webhook delivered after delay:", delay);
        } catch (err: any) {
            console.error("Webhook Failed:", err.message);
        }
    }, delay);
});

app.listen(8000, () => {
    console.log("Dummy Bank Server running on port 8000");
});