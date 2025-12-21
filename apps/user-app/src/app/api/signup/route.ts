import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import {prisma} from "@repo/db";


export async function POST(req:Request){
    try{
        const {phone, password, name} = await req.json();

        if(!phone || !password || !name){
            return NextResponse.json({
                message:"Missing Fields"
            },{status:400})
        }

        const existing = await prisma.user.findUnique({
            where:{
                number:phone
            }
        });

        if(existing){
            return NextResponse.json({message:"User already exists"},{status:400})
        }

        const hashed = await bcrypt.hash(password,10);

        const user = await prisma.user.create({
            data:{
                number:phone,
                password:hashed,
                name: name,
                Balance:{
                    create:{
                        amount:0,
                        locked:0
                    }
                }
            }
        });
        return NextResponse.json({message:"User Created" , userId: user.id},
            {status:201}
        );
    }catch(err: any){
        console.error("Signup error:", err);
        return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
    }
}