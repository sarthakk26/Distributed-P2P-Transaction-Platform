/**
 * integration/onramp/onramp.test.ts
 *
 * Tests for the On-Ramp (deposit) flow.
 *
 * Strategy:
 *  - We seed OnRampTransaction rows directly in the DB (bypassing the
 *    Next.js /api/onramp/start route which requires a session + bank call).
 *  - We then fire signed webhooks at the running bank-webhook service
 *    (apps/bank-webhook) and assert on DB state.
 *
 * This means the webhook service must be running on port 3003 before
 * these tests execute. See README for the startup command.
 *
 * Flows covered:
 *  ✅ PROCESSING → SUCCESS (happy path)
 *  ✅ Balance created when none exists (upsert)
 *  ✅ Balance incremented when one already exists
 *  ✅ Duplicate webhook ignored (idempotency / replay protection)
 *  ✅ INITIATED token ignored (not yet PROCESSING)
 *  ✅ SUCCESS token ignored (already done)
 *  ✅ Unknown token ignored safely
 *  ✅ Missing signature → 200 + ignored
 *  ✅ Bad signature → 200 + ignored
 *  ✅ Missing fields → 200 + ignored
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { db, seedUser, seedOnRamp, cleanupUsers, SeededUser } from "../../helpers/db";
import { sendWebhook } from "../../helpers/webhook";


// Suite setup

let user: SeededUser;

beforeEach(async () => {
  // Fresh user for every test — no shared state between tests
  user = await seedUser({
    number: `09${Date.now()}`,   // unique phone number
    balance: 0,
  });
});

afterEach(async () => {
  await cleanupUsers([user.id]);
});


// Helper — unique token per test so rows never clash
const token = () => `tok_${Date.now()}_${Math.random().toString(36).slice(2)}`;


// Happy path

describe("On-Ramp: happy path", () => {
  it("credits balance when webhook arrives for a PROCESSING transaction", async () => {
    const t = token();
    await seedOnRamp({ userId: user.id, token: t, amount: 500, status: "PROCESSING" });

    const res = await sendWebhook({ token: t, user_identifier: user.id, amount: 500 });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Webhook processed");

    const txn = await db.onRampTransaction.findUnique({ where: { token: t } });
    expect(txn?.status).toBe("SUCCESS");

    const bal = await db.balance.findUnique({ where: { userId: user.id } });
    expect(bal?.amount).toBe(500);
  });

  it("increments an existing balance rather than overwriting it", async () => {
    // Give the user a pre-existing balance of 1000
    await db.balance.update({
      where: { userId: user.id },
      data: { amount: 1000 },
    });

    const t = token();
    await seedOnRamp({ userId: user.id, token: t, amount: 250, status: "PROCESSING" });

    await sendWebhook({ token: t, user_identifier: user.id, amount: 250 });

    const bal = await db.balance.findUnique({ where: { userId: user.id } });
    expect(bal?.amount).toBe(1250); // 1000 + 250
  });

  it("creates a TransitionLog entry PROCESSING → SUCCESS", async () => {
    const t = token();
    const onramp = await seedOnRamp({ userId: user.id, token: t, amount: 100, status: "PROCESSING" });

    await sendWebhook({ token: t, user_identifier: user.id, amount: 100 });

    const log = await db.transitionLog.findFirst({
      where: { domain: "ONRAMP", entityId: onramp.id, toState: "SUCCESS" },
    });
    expect(log).not.toBeNull();
    expect(log?.fromState).toBe("PROCESSING");
  });
});


// Idempotency / replay protection

describe("On-Ramp: idempotency", () => {
  it("ignores a duplicate webhook for an already-SUCCESS transaction", async () => {
    const t = token();
    // Seed as SUCCESS (already processed)
    await seedOnRamp({ userId: user.id, token: t, amount: 300, status: "SUCCESS" });
    await db.balance.update({ where: { userId: user.id }, data: { amount: 300 } });

    // Replay the same webhook
    const res = await sendWebhook({ token: t, user_identifier: user.id, amount: 300 });

    // Still 200 — we always ACK
    expect(res.status).toBe(200);

    // Balance must NOT have been credited again
    const bal = await db.balance.findUnique({ where: { userId: user.id } });
    expect(bal?.amount).toBe(300); // unchanged
  });

  it("sending the webhook 3× only credits once", async () => {
    const t = token();
    await seedOnRamp({ userId: user.id, token: t, amount: 100, status: "PROCESSING" });

    await sendWebhook({ token: t, user_identifier: user.id, amount: 100 });
    await sendWebhook({ token: t, user_identifier: user.id, amount: 100 });
    await sendWebhook({ token: t, user_identifier: user.id, amount: 100 });

    const bal = await db.balance.findUnique({ where: { userId: user.id } });
    expect(bal?.amount).toBe(100); // credited exactly once
  });
});


// State machine integrity

describe("On-Ramp: state machine", () => {
  it("ignores webhook for an INITIATED transaction (not yet PROCESSING)", async () => {
    const t = token();
    await seedOnRamp({ userId: user.id, token: t, amount: 200, status: "INITIATED" });

    await sendWebhook({ token: t, user_identifier: user.id, amount: 200 });

    // Status must remain INITIATED — no jump to SUCCESS
    const txn = await db.onRampTransaction.findUnique({ where: { token: t } });
    expect(txn?.status).toBe("INITIATED");

    // No balance credited
    const bal = await db.balance.findUnique({ where: { userId: user.id } });
    expect(bal?.amount).toBe(0);
  });

  it("ignores webhook for a FAILED transaction", async () => {
    const t = token();
    await seedOnRamp({ userId: user.id, token: t, amount: 200, status: "FAILED" });

    await sendWebhook({ token: t, user_identifier: user.id, amount: 200 });

    const txn = await db.onRampTransaction.findUnique({ where: { token: t } });
    expect(txn?.status).toBe("FAILED");

    const bal = await db.balance.findUnique({ where: { userId: user.id } });
    expect(bal?.amount).toBe(0);
  });
});


// Security / bad payloads

describe("On-Ramp: security", () => {
  it("returns 200 and ignores a webhook with no signature", async () => {
    const t = token();
    await seedOnRamp({ userId: user.id, token: t, amount: 100, status: "PROCESSING" });

    const res = await sendWebhook(
      { token: t, user_identifier: user.id, amount: 100 },
      { omitSignature: true }
    );

    expect(res.status).toBe(200);
    const txn = await db.onRampTransaction.findUnique({ where: { token: t } });
    expect(txn?.status).toBe("PROCESSING"); // unchanged
  });

  it("returns 200 and ignores a webhook with an invalid signature", async () => {
    const t = token();
    await seedOnRamp({ userId: user.id, token: t, amount: 100, status: "PROCESSING" });

    const res = await sendWebhook(
      { token: t, user_identifier: user.id, amount: 100 },
      { signature: "bad-signature-value" }
    );

    expect(res.status).toBe(200);
    const txn = await db.onRampTransaction.findUnique({ where: { token: t } });
    expect(txn?.status).toBe("PROCESSING"); // unchanged
  });

  it("returns 200 and ignores an unknown token", async () => {
    const res = await sendWebhook({
      token: "this-token-does-not-exist",
      user_identifier: user.id,
      amount: 100,
    });

    expect(res.status).toBe(200);
    // No DB side effects — just confirming no crash
    const bal = await db.balance.findUnique({ where: { userId: user.id } });
    expect(bal?.amount).toBe(0);
  });

  it("returns 200 and ignores a payload missing required fields", async () => {
    // @ts-expect-error — intentionally malformed
    const res = await sendWebhook({ token: "tok_abc" }); // missing user_identifier + amount

    expect(res.status).toBe(200);
  });
});
