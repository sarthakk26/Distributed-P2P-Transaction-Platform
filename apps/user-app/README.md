# Distributed P2P Transaction Platform

A production-grade distributed payment platform built with a microservices architecture. Supports peer-to-peer transfers and bank on-ramp deposits with strong consistency guarantees — idempotency, atomic transactions, row-level locking, and a guarded state machine on every financial operation.

**🚀 Live Demo:** http://3.84.111.89

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
     │   (Express)          │  │   (Express)         │  │  (Neon)      │
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
| Database | PostgreSQL (Neon serverless) |
| ORM | Prisma |
| Auth | NextAuth.js |
| Testing | Vitest |
| CI/CD | GitHub Actions |
| Deployment | Docker, Docker Compose, AWS EC2, Nginx |
| Email | Resend |

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
├── docker/
│   ├── Dockerfile.user-app       # Next.js container
│   ├── Dockerfile.bank-webhook   # Webhook service container
│   └── Dockerfile.bank-server    # Bank simulator container
├── docker-compose.prod.yml       # Production orchestration
└── .github/
    └── workflows/
        ├── test.yml       # CI pipeline — runs on every push
        └── deploy.yml     # CD pipeline — deploys on push to main
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
DATABASE_URL="postgresql://testuser:testpassword@localhost:5433/wallet_test" \
npx tsx src/index.ts

# 4. Run on-ramp tests
cd apps/tests
npx dotenv -e .env.test -- npx vitest run integration/onramp/onramp.test.ts
```

---

## CI/CD Pipeline

### Continuous Integration

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

### Continuous Deployment

On every push to `main`, the CD pipeline automatically:

1. **Builds** three Docker images (user-app, bank-webhook, bank-server)
2. **Pushes** images to Docker Hub (`sarth0x/cosmos-*`)
3. **SSHes** into the EC2 server
4. **Pulls** latest images
5. **Restarts** all services with `docker compose up -d --remove-orphans`

Zero-downtime deployments — the app is live within 2-3 minutes of merging to main.

---

## Running Locally

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Required vars:
# - DATABASE_URL=postgresql://...         (Neon connection string)
# - NEXTAUTH_URL=http://localhost:3000
# - NEXTAUTH_SECRET=<random_string>
# - JWT_SECRET=<random_string>
# - RESEND_API_KEY=re_...
# - BANK_WEBHOOK_SECRET=<random_string>
# - WEBHOOK_URL=http://localhost:3003/hdfcWebhook
# - DUMMY_BANK_URL=http://localhost:8000/bank/pay

# Run database migrations
npx prisma migrate deploy --schema=packages/db/prisma/schema.prisma

# Start all services
npm run dev
```

Services will start on:
- `user-app` → http://localhost:3000
- `bank-server` → http://localhost:8000
- `bank-webhook` → http://localhost:3003

---

## Deployment

The application is deployed on AWS EC2 with Docker Compose orchestrating all services.

**Live URL:** http://3.84.111.89

### Production Architecture

```
Internet
    │
    ▼
Nginx (port 80) — reverse proxy
    │
    ├── /          → user-app container (port 3000)
    └── /webhook   → bank-webhook container (port 3003)

Docker Containers (orchestrated by docker-compose):
    ├── cosmos-user-app        (Next.js)
    ├── cosmos-bank-webhook    (Express + Prisma)
    └── cosmos-bank-server     (Express)

PostgreSQL — Neon serverless (external)
```

### Docker Images

All services are containerized and available on Docker Hub:
- `sarth0x/cosmos-user-app:latest`
- `sarth0x/cosmos-bank-webhook:latest`
- `sarth0x/cosmos-bank-server:latest`

Built with multi-stage Dockerfiles optimized for production — Alpine base images, layer caching, and minimal final image sizes.

### Manual Deployment

If needed, you can deploy manually:

```bash
# SSH into the server
ssh -i cosmos-key.pem ubuntu@3.84.111.89

# Pull latest images
cd ~/app
docker compose -f docker-compose.prod.yml pull

# Restart services
docker compose -f docker-compose.prod.yml up -d --remove-orphans

# Check logs
docker compose -f docker-compose.prod.yml logs --tail=50
```

---

## Admin Dashboard

An admin dashboard at `/admin` provides real-time reconciliation views for both On-Ramp and P2P flows — surfacing stuck transactions, invalid locked states, negative balances, and the full transition log history.

**Features:**
- System health overview with critical issue counts
- On-ramp reconciliation (stuck PROCESSING, invalid states)
- P2P reconciliation (locked balance mismatches, negative balances)
- Full transition log with state change audit trail
- Admin-only access with role-based authentication

---

## Environment Variables

### Required for all environments:

```bash
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=<random_32char_string>
JWT_SECRET=<random_32char_string>
BANK_WEBHOOK_SECRET=<random_32char_string>
```

### Development-specific:

```bash
NEXTAUTH_URL=http://localhost:3000
WEBHOOK_URL=http://localhost:3003/hdfcWebhook
DUMMY_BANK_URL=http://localhost:8000/bank/pay
```

### Production-specific:

```bash
NEXTAUTH_URL=http://3.84.111.89
WEBHOOK_URL=http://cosmos-bank-webhook:3003/hdfcWebhook
DUMMY_BANK_URL=http://cosmos-bank-server:8000/bank/pay
RESEND_API_KEY=re_...
PRISMA_QUERY_ENGINE_LIBRARY=/app/packages/db/src/generated/libquery_engine-linux-musl-openssl-3.0.x.so.node
```

Note: In production, Docker service names (`cosmos-bank-webhook`, `cosmos-bank-server`) are used for inter-container communication.

---

## License

MIT