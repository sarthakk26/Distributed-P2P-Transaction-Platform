"use server"

import { PrismaClient } from "@repo/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { generateToken } from "../token";

const db = new PrismaClient();

export async function createOnRampTransaction(provider:string, amount:number){
    const session = await getServerSession(authOptions);
    if(!session?.user?.id){
        return {
            
            message:"Unauthenticated request"
        }
    }
    const token = generateToken();
    await db.onRampTransaction.create({
        data:{
            provider,
            status: "Processing",
            startTime: new Date(),
            token: token,
            userId: Number(session?.user?.id),
            amount: amount
        }
    });

    return {
        message:"Done"
    }
}