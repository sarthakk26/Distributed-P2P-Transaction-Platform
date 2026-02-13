# Distributed P2P Transaction Platform

A production-grade distributed payment platform built with a microservices architecture. Supports peer-to-peer transfers and bank on-ramp deposits with strong consistency guarantees — idempotency, atomic transactions, row-level locking, and a guarded state machine on every financial operation.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                     │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   user-app  (Next.js 15)                    │
│                                                             │
│   ┌─────────────────┐        ┌─────────────────────────┐    │
│   │  Auth (NextAuth)│        │  Server Actions / API   │    │
│   │  Session Mgmt   │        │  P2P Transfer           │    │
│   └─────────────────┘        │  On-Ramp Initiation     │    │
│                              └────────────┬────────────┘    │
└───────────────────────────────────────────┼─────────────────┘
                                            │
                    ┌───────────────────────┼────────────────────┐
                    │                       │                    │
                    ▼                       ▼                    ▼
     ┌──────────────────────┐  ┌─────────────────────┐  ┌──────────────┐
     │   bank-server        │  │   bank-webhook      │  │  PostgreSQL  │
     │   (Express)          │  │   (Express)         │  │  (Prisma)    │
     │                      │  │                     │  │              │
     │  Simulates external  │  │  Receives signed    │  │  Users       │
     │  bank — triggers     │  │  webhook callbacks  │  │  Balances    │
     │  webhook on deposit  │  │  from bank-server   │  │  Transfers   │
     │                      │  │  HMAC-SHA256 verify │  │  OnRamp Txns │
     └──────────────────────┘  └─────────────────────┘  │  Idempotency │
                                                        │  Transition  │
                                                        │  Logs        │
                                                        └──────────────┘
```

---

## Key Technical Decisions

### 1. Guarded State Machines

Every financial entity transitions through an explicit state machine. Transitions are enforced at the DB layer using conditional `updateMany` — not just application logic.

**On-Ramp flow:**
```
INITIATED → PROCESSING → SUCCESS
                      └→ FAILED
```

**P2P Transfer flow:**
```
INITIATED → LOCKED → COMPLETED
                  └→ FAILED
```

A transition is only applied if the current status matches the expected state. If `updateMany` returns `count !== 1`, the transaction aborts immediately — preventing any invalid state jump.

```typescript
const result = await tx.p2pTransfer.updateMany({
  where: { id: transfer.id, status: "INITIATED" },  // guard
  data: { status: "LOCKED" }
});
if (result.count !== 1) throw new Error("INVALID_STATE_TRANSITION");
```

### 2. Row-Level Locking (No Double Spend)

Before reading a sender's balance, a `SELECT ... FOR UPDATE` acquires a row-level lock on the balance row. This means concurrent transfers from the same account are serialised at the DB level — not at the application level.

```typescript
await tx.$queryRaw`
  SELECT * FROM "Balance"
  WHERE "userId" = ${from}
  FOR UPDATE
`;
```

This prevents the classic double-spend race condition where two concurrent transfers both pass the balance check before either deducts.

### 3. Idempotency Table

Every P2P transfer requires a client-supplied idempotency key. The key is stored in a dedicated `IdempotencyKey` table with a `PROCESSING → COMPLETED/FAILED` lifecycle. Duplicate requests with the same key return the cached response without re-executing the transfer.

This makes the API safe for client retries and network failures.

### 4. Webhook Replay Protection

The bank-webhook service always returns HTTP 200 — even for invalid, duplicate, or malformed webhooks. This prevents the bank from retrying infinitely. Replays are silently ignored at the DB layer: the webhook handler only processes transactions in `PROCESSING` state. A `SUCCESS` or `FAILED` token is a no-op.

### 5. Observability via Transition Logs

Every state transition — across both P2P and On-Ramp flows — writes an immutable `TransitionLog` entry with domain, entity ID, from/state, to/state, and metadata. This creates a full audit trail for every financial operation and powers the admin reconciliation dashboard.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Monorepo | Turborepo |
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend services | Node.js, Express, TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | NextAuth.js |
| Testing | Vitest |
| CI/CD | GitHub Actions |

---

## Project Structure

```
.
├── apps/
│   ├── user-app/          # Next.js frontend + API routes + server actions
│   ├── bank-server/       # Simulated external bank (triggers webhook on deposit)
│   ├── bank-webhook/      # Webhook receiver — credits balance on successful deposit
│   └── tests/             # Integration test suite (Vitest + real Postgres)
│       ├── integration/
│       │   ├── onramp/    # On-ramp webhook flow tests
│       │   └── p2p/       # P2P transfer tests
│       └── helpers/       # DB seeding and webhook signing utilities
├── packages/
│   ├── db/                # Shared Prisma client + schema
│   ├── ui/                # Shared React component library
│   └── typescript-config/ # Shared tsconfig
└── .github/
    └── workflows/
        └── test.yml       # CI pipeline — runs on every push
```

---

## Database Schema (Key Models)

```prisma
model Balance {
  userId  Int  @unique
  amount  Int           # available balance
  locked  Int           # funds reserved during a transfer
}

model p2pTransfer {
  fromUserId  Int
  toUserId    Int
  amount      Int
  status      P2PStatus   # INITIATED | LOCKED | COMPLETED | FAILED
}

model OnRampTransaction {
  token   String       @unique
  userId  Int
  amount  Int
  status  OnRampStatus # INITIATED | PROCESSING | SUCCESS | FAILED
}

model IdempotencyKey {
  userId    Int
  key       String
  status    IdempotencyStatus  # PROCESSING | COMPLETED | FAILED
  response  Json?
  @@unique([userId, key])
}

model TransitionLog {
  domain     String   # "P2P" | "ONRAMP"
  entityId   Int
  fromState  String
  toState    String
  meta       Json?
}
```

---

## Integration Tests

29 tests across two suites, running against a real isolated Postgres in Docker.

```
✅ P2P Transfer      18 tests
  - Happy path — correct debit/credit
  - State machine — NONE→INITIATED→LOCKED→COMPLETED logged
  - Insufficient funds — atomic rollback, no partial state
  - Idempotency — duplicate key returns cached result, no double debit
  - Concurrency — two simultaneous transfers, only one succeeds
  - Edge cases — exact balance, boundary conditions, unknown receiver

✅ On-Ramp Webhook   11 tests
  - PROCESSING → SUCCESS — balance credited correctly
  - Balance incremented on existing account
  - Duplicate webhook ignored — balance credited exactly once
  - State machine — INITIATED/FAILED tokens silently ignored
  - Security — missing signature, invalid signature, unknown token all ACK'd safely
```

### Running Tests Locally

```bash
# 1. Start the test database
cd apps/tests
npm run db:up && npm run db:migrate

# 2. Run P2P tests (no service needed)
npx dotenv -e .env.test -- npx vitest run integration/p2p/p2p.test.ts

# 3. Start bank-webhook service for on-ramp tests
cd apps/bank-webhook
BANK_WEBHOOK_SECRET=test-secret-do-not-use-in-prod \
DATABASE_URL="postgresql://testuser:testpassword@localhost:5433/paytm_test" \
npx tsx src/index.ts

# 4. Run on-ramp tests
cd apps/tests
npx dotenv -e .env.test -- npx vitest run integration/onramp/onramp.test.ts
```

---

## CI/CD Pipeline

GitHub Actions runs two parallel jobs on every push to any branch and on every PR to `main`.

```
Push / PR
    │
    ├── Job 1: P2P Transfer Tests
    │     Spins up Postgres → migrates → runs 18 tests
    │
    └── Job 2: On-Ramp Webhook Tests
          Spins up Postgres → migrates → starts bank-webhook → runs 11 tests
```

Both jobs must pass before a PR can be merged into `main`. Branch protection is enforced via GitHub rulesets.

---

## Running Locally

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in DATABASE_URL, NEXTAUTH_SECRET, DUMMY_BANK_URL, BANK_WEBHOOK_SECRET

# Run database migrations
npx prisma migrate deploy --schema=packages/db/prisma/schema.prisma

# Start all services
npm run dev
```

Services will start on:
- `user-app` → http://localhost:3000
- `bank-server` → http://localhost:3001
- `bank-webhook` → http://localhost:3003

---

## Admin Dashboard

An admin dashboard at `/admin` provides real-time reconciliation views for both On-Ramp and P2P flows — surfacing stuck transactions, invalid locked states, negative balances, and the full transition log history.