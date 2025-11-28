import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(express.json());
app.use(cors());

const WEBHOOK_URL = "http://localhost:3003/hdfcWebhook";

app.post("/bank/pay", async (req, res) => {
    const { token, userId, amount } = req.body;
    if (!token || !userId || !amount) {
        return res.status(400).json({ message: "Missing fields" });
    }
    console.log("Dummy Bank: Sending webhook ->", {
        token,
        user_identifier: userId,
        amount
    });

    try {
        await axios.post(WEBHOOK_URL, {
            token,
            user_identifier: userId,
            amount
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
