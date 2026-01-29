import { p2pTransfer } from "@/lib/action/p2pTransfer";
import { prisma } from "@repo/db";
import { getServerSession } from "next-auth";

jest.mock("next-auth", () => ({
    getServerSession: jest.fn(),
}))

describe("P2P Transfer Logic", () => {
    // Variables to hold the IDs of our test users
    let senderId: number;
    let receiverId: number;

    beforeAll(async () => {
        // 1.Create a SENDER with $100
        const user1 = await prisma.user.create({
            data: {
                number: "11111111111", // Unique string to avoid collision
                password: "pass",
                Balance: { create: { amount: 100, locked: 0 } }
            }
        });
        // 2. Create a RECEIVER with $0
        const user2 = await prisma.user.create({
            data: {
                number: "22222222222",
                password: "pass",
                Balance: {
                    create: {
                        amount: 0,
                        locked: 0
                    }
                }
            }
        });
    senderId = user1.id;
    receiverId = user2.id;
    });

    afterAll(async () => {
    // 1. Delete transactions first (Foreign Key constraint)
    await prisma.p2pTransfer.deleteMany({
        where: {
            OR: [
                { fromUserId: senderId },
                { toUserId: receiverId },
                { fromUserId: receiverId },
                { toUserId: senderId }
            ]
        }
    });

    // 2. Delete balances next
    await prisma.balance.deleteMany({
        where: {
            userId: { in: [senderId, receiverId] }
        }
    });

    // 3. Delete users last
    await prisma.user.deleteMany({
        where: {
            id: { in: [senderId, receiverId] }
        }
    });
  });

  it("should transfer money successfully (Happy Path)", async () => {
    // Mock the session to be User 1 (The Sender)
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: senderId }
    });

    // ACT: Run the transfer function
    const result = await p2pTransfer("22222222222", 50);

    // ASSERT: Check the return message
    expect(result.message).toBe("Transfer successful");

    // VERIFY: Check Database Balances
    const senderBalance = await prisma.balance.findUnique({ where: { userId: senderId } });
    const receiverBalance = await prisma.balance.findUnique({ where: { userId: receiverId } });

    expect(senderBalance?.amount).toBe(50);  // 100 - 50
    expect(receiverBalance?.amount).toBe(50); // 0 + 50
  });

  it("should fail if sender has insufficient funds (Sad Path)", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: senderId } });
    
    // Attempt transfer
    const result = await p2pTransfer("22222222222", 1000);

    // Expect the message we returned in the catch block
    expect(result.message).toBe("Error while processing transfer"); 

    const senderBalance = await prisma.balance.findUnique({ where: { userId: senderId } });
    expect(senderBalance?.amount).toBe(50); 
  });
})