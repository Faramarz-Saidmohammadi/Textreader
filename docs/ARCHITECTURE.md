# Voxora Architecture

## System context

Voxora is a multi-tenant accessibility operations SaaS. A user belongs to one or more workspaces through memberships. Every business record that can contain tenant data is scoped by `workspace_id`.

## Boundaries

1. **Web application** — Next.js App Router renders marketing and authenticated workspace surfaces.
2. **Identity/session** — password verification uses scrypt; the server signs a short session payload and stores it in an HttpOnly cookie.
3. **Authorization** — roles map to explicit permissions. UI visibility is convenience only; API routes re-check permissions.
4. **Domain/data** — PostgreSQL stores users, memberships, phrases, usage events, audit records, API keys, and subscriptions.
5. **Speech** — voice playback uses the browser Web Speech API. Phrase text is not sent to a Voxora speech server.
6. **Operations** — health route, CI, Docker build, deterministic database schema, environment validation.

## Tenant isolation rule

Client-controlled input must never determine tenant scope. The `workspaceId` used in SQL queries is always derived from the verified server session. New services should preserve this invariant.

## Domain model

`users -> memberships -> workspaces` establishes identity and tenancy. `phrases`, `phrase_collections`, `usage_events`, `audit_logs`, `api_keys`, and `subscriptions` belong to workspaces. Foreign keys use cascading or nullifying deletes deliberately based on whether historical references should remain valid.

## Scale path

The current single application can scale horizontally because the session is stateless and PostgreSQL is external. At higher volume, add connection pooling, a durable queue for analytics/audit fan-out, Redis for rate limiting, object storage for exports, and a warehouse pipeline for aggregated product analytics.
