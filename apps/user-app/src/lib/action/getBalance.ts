"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import {prisma} from "@repo/db";


export async function getBalance(){
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);
    if(!userId){
        return {amount:0, locked:0}
    }
    const balance = await prisma.balance.findUnique({
        where:{userId},
    })
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0,
    }

}
