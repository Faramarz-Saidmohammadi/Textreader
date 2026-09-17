# Voxora

**Multi-tenant voice accessibility SaaS built as a senior-level full-stack portfolio project.**

Voxora is a workspace-based platform for teams that need governed reusable communication phrases, browser-native text-to-speech, role-aware collaboration, auditability, usage tracking, and an API/billing-ready domain model.

> This repository is a complete architectural replacement of an earlier browser text-to-speech demo. The current product is intentionally structured as a SaaS system rather than a UI exercise.

## Product capabilities

- Multi-tenant workspaces and memberships
- OWNER / ADMIN / EDITOR / VIEWER RBAC
- Secure password authentication with Node.js `scrypt`
- Signed HttpOnly eight-hour sessions using HMAC-SHA256
- Workspace-scoped phrase library
- Browser-native text-to-speech playback
- Searchable phrase operations UI
- Server-side input validation with Zod
- Transactional audit logging for mutations
- Usage-event, API-key, and subscription domain boundaries
- Health endpoint for runtime dependency checks
- PostgreSQL constraints and tenant-aware indexes
- Docker/Compose local environment
- GitHub Actions CI for type checking, tests, and production build
- Architecture, API, and security documentation

## Stack

| Layer | Technology |
| --- | --- |
| Web | Next.js 16.3, React 19.2, App Router |
| Language | TypeScript (strict) |
| Data | PostgreSQL 17 + `postgres` client |
| Validation | Zod |
| Authentication | scrypt password hashing + signed HttpOnly cookie |
| Authorization | Explicit server-side RBAC permissions |
| Voice | Browser Web Speech API |
| Testing | Vitest |
| Operations | Docker, Docker Compose, GitHub Actions |

Next.js 16 is used deliberately: the project follows the current App Router generation and avoids legacy `pages/` or deprecated `next lint` patterns.

## Architecture

```text
Browser
  ├─ Marketing / Login / Dashboard (Next.js App Router)
  ├─ Web Speech API (speech remains browser-side)
  └─ Route Handlers
       ├─ Session verification
       ├─ RBAC authorization
       ├─ Zod validation
       ├─ Domain services
       └─ PostgreSQL
            ├─ users / memberships / workspaces
            ├─ phrases / collections
            ├─ usage_events
            ├─ audit_logs
            ├─ api_keys
            └─ subscriptions
```

The central tenancy rule is simple: **tenant identity comes from the verified server session, never from client-controlled request data.** See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Local setup

### 1. Configure environment

```bash
cp .env.example .env.local
```

Use a random production-grade `SESSION_SECRET` outside local development.

### 2. Start PostgreSQL

```bash
docker compose up -d db
```

The container automatically applies `db/001_init.sql` on first initialization.

### 3. Install and seed

```bash
npm install
npm run db:seed
```

### 4. Run the application

```bash
npm run dev
```

Open `http://localhost:3000`.

Demo credentials after seeding:

```text
Email: owner@voxora.dev
Password: VoxoraDemo!2026
```

These credentials are development seed data only.

## Quality gates

```bash
npm run typecheck
npm test
npm run build
```

The CI workflow runs the same checks against PostgreSQL on pull requests and pushes to `main`.

## Security choices

- No plaintext passwords are stored.
- Session cookies are HttpOnly and signed.
- Mutating routes authorize on the server even if the UI already hides restricted controls.
- All tenant queries derive `workspaceId` from the verified session.
- SQL values are parameterized.
- Phrase creation and its audit record are transactional.
- Environment configuration is validated before database use.

See [`SECURITY.md`](SECURITY.md) for production-hardening requirements.

## Why this is a senior portfolio project

The repository demonstrates more than CRUD screens. It includes tenant boundaries, authentication design, authorization policy, relational modeling, transactional writes, auditability, API contracts, validation, infrastructure, CI, security documentation, and a credible scale path. Product and engineering boundaries are explicit so additional features can be added without rewriting the core.

## Planned product extensions

- Workspace invitations and multi-workspace switching
- Phrase publishing workflow and version history
- External API-key issuance, scopes, rotation, and rate limits
- Stripe customer/subscription synchronization and signed webhooks
- Usage dashboards with aggregated metrics
- Export/import workflows
- MFA and verified-email flows
- Playwright end-to-end coverage
- Localization and RTL support

## Repository structure

```text
app/            Next.js routes, dashboard, and API handlers
components/     Interactive client components
lib/            database, session, RBAC, and domain helpers
db/             PostgreSQL schema
scripts/        local seed tooling
tests/          unit tests
docs/           architecture and API documentation
.github/        CI workflow
```

## License

MIT — see [`LICENSE`](LICENSE).
