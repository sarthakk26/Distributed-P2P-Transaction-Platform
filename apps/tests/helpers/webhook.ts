/**
 * helpers/webhook.ts
 *
 * Utilities for hitting the bank-webhook service in tests.
 *
 * The webhook service reads BANK_WEBHOOK_SECRET to verify HMAC signatures.
 * We use the same secret from .env.test so signatures are always valid
 * unless a test deliberately wants to send a bad one.
 */

import crypto from "crypto";
import { fetch } from "undici";

const WEBHOOK_URL =
  process.env.WEBHOOK_URL ?? "http://localhost:3003/hdfcWebhook";

const SECRET = process.env.BANK_WEBHOOK_SECRET!;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WebhookPayload {
  token: string;
  user_identifier: string | number;
  amount: number | string;
}

export interface WebhookResponse {
  status: number;
  body: { message: string };
}

// ---------------------------------------------------------------------------
// Core helper
// ---------------------------------------------------------------------------

/**
 * Fire a signed (or deliberately unsigned/bad-signed) webhook at the service.
 *
 * @param payload   - The JSON body to send
 * @param options   - Override the signature for negative tests
 */
export async function sendWebhook(
  payload: WebhookPayload,
  options: { signature?: string; omitSignature?: boolean } = {}
): Promise<WebhookResponse> {
  const bodyStr = JSON.stringify(payload);

  // Compute correct HMAC unless the test overrides it
  const signature =
    options.signature ??
    (options.omitSignature
      ? undefined
      : crypto.createHmac("sha256", SECRET).update(bodyStr).digest("hex"));

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(signature ? { "x-bank-signature": signature } : {}),
  };

  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers,
    body: bodyStr,
  });

  const body = (await res.json()) as { message: string };
  return { status: res.status, body };
}
