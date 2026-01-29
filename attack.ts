import axios from "axios";
import { prisma } from "./packages/db/src/index";

const SENDER_ID = 18;
const RECEIVER_ID = 19; 
const INITIAL_BALANCE = 50;

async function resetBalances() {
  // Reset Sender to 50 and Receiver to 0
  await prisma.balance.updateMany({
    where: { userId: SENDER_ID },
    data: { amount: INITIAL_BALANCE, locked: 0 }
  });
  await prisma.balance.updateMany({
    where: { userId: RECEIVER_ID },
    data: { amount: 0, locked: 0 }
  });
  console.log(`♻️  Balances Reset: Sender=$${INITIAL_BALANCE}, Receiver=$0`);
}

async function sendRequest() {
  try {
    await axios.get("http://localhost:3000/api/test-load");
    return "SUCCESS";
  } catch (e) {
    return "BLOCKED";
  }
}

async function main() {
  console.log("🚀 Starting Double-Spend Attack...");

  // 1. Start Fresh
  await resetBalances();

  // 2. Prepare the attack (50 requests)
  const requests = [];
  for (let i = 0; i < 50; i++) {
    requests.push(sendRequest());
  }

  console.log(`🔫 Firing ${requests.length} requests simultaneously...`);

  // 3. Execute Attack
  const results = await Promise.all(requests);

  // 4. Analyze Results
  const successCount = results.filter((r) => r === "SUCCESS").length;
  const blockedCount = results.filter((r) => r === "BLOCKED").length;

  console.log("-----------------------------------");
  console.log(`✅ Successful Transactions: ${successCount}`);
  console.log(`🛡️  Blocked Transactions:    ${blockedCount}`);
  console.log("-----------------------------------");

  if (successCount > 1) {
    console.log("❌ CRITICAL FAILURE: Double spend detected!");
  } else {
    console.log("✅ SYSTEM SECURE: Database locks prevented race condition.");
  }

  // 5. Cleanup (Revert balances for next run)
  await resetBalances();
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());