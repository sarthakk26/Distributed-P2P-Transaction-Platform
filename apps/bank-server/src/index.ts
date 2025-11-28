import express from "express";
import cors from "cors";
import axios from "axios";
import crypto from "crypto";
import "dotenv/config";


const app = express();
app.use(express.json());
app.use(cors());


const WEBHOOK_URL = "http://localhost:3003/hdfcWebhook";
const SECRET = process.env.BANK_WEBHOOK_SECRET!;

app.post("/bank/pay", async (req, res) => {
    const { token, userId, amount } = req.body;
    if (!token || !userId || !amount) {
        return res.status(400).json({ message: "Missing fields" });
    }
    const payload = {
        token,
        user_identifier: userId,
        amount
    };
    //Now GENERATING HMAC SIGNATURE
    const signature = crypto
    .createHmac("sha256",SECRET)
    .update(JSON.stringify(payload))
    .digest("hex");

    console.log("Signature at bank:", signature)
    
    try {
        await axios.post(WEBHOOK_URL, payload, {
            headers:{
                "x-bank-signature": signature
            }
        });
        res.json({message:"Webhook delivered"});
    }catch(err: any){
        console.error("Webhook Failed:",err.message);
        res.status(500).json({message:"Failed to send webhook"})
    }
});

app.listen(8000, ()=>{
    console.log("Dummy Bank Server running on port 8000")
})
