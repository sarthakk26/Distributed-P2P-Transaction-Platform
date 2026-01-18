"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { prisma } from "@repo/db";
import { redis } from "@repo/redis"; // Import your redis instance
import { log } from "console";

export async function getBalance() {
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);

    if (!userId) {
        return { amount: 0, locked: 0 };
    }

    const cacheKey = `balance:${userId}`;

    try {
        console.log("redis disabled");
        
        // // 1. Try to get data from Redis
        // const cachedBalance = await redis.get(cacheKey);

        // if (cachedBalance) {
        //     console.log("Redis Cache Hit!");
        //     return JSON.parse(cachedBalance);
        // }

        // // 2. If not in Redis, get from Prisma
        // console.log("Redis Cache Miss - Fetching from DB");
        // const balance = await prisma.balance.findUnique({
        //     where: { userId },
        // });

        // const result = {
        //     amount: balance?.amount || 0,
        //     locked: balance?.locked || 0,
        // };

        // // 3. Store in Redis for 1 hour (3600 seconds)
        // await redis.set(cacheKey, JSON.stringify(result), "EX", 3600);

        // return result;
    } catch (error) {
        console.error("Redis Error:", error);
        // Fallback to DB if Redis fails
        const balance = await prisma.balance.findUnique({ where: { userId } });
        return { amount: balance?.amount || 0, locked: balance?.locked || 0 };
    }
}