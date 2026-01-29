import { NextResponse } from "next/server";
import { transferMoney } from "../../../lib/transfer"; // Import the SAME logic

export async function GET(req: Request) {
    // Hardcoded for testing
    const SENDER_ID = 18; 
    const RECIPIENT_NUMBER = "9034567891"; // Ensure this number exists!
    const AMOUNT = 50;

    const result = await transferMoney(SENDER_ID, RECIPIENT_NUMBER, AMOUNT);

    if (result.message === "Transfer successful") {
        return NextResponse.json({ message: "Success" });
    } else {
        return NextResponse.json({ message: "Failed" }, { status: 400 });
    }
}