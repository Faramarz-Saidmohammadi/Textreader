# API Surface

All authenticated routes use the signed `voxora_session` HttpOnly cookie.

## `POST /api/auth/login`

Body: `{ "email": string, "password": string }`

Verifies credentials, resolves the first workspace membership, sets the signed session cookie, and writes an `auth.login` audit event.

## `POST /api/auth/logout`

Clears the session and writes an `auth.logout` event when a session exists.

## `GET /api/phrases`

Requires `phrase:read`. Returns up to 100 phrases scoped to the workspace stored in the server session.

## `POST /api/phrases`

Requires `phrase:create`.

Body: `{ "title": string, "body": string, "category": string }`

The input is validated with Zod. Phrase creation and audit insertion run in one PostgreSQL transaction.

## `GET /api/health`

Returns `200` when the application can reach PostgreSQL and `503` when the dependency check fails.

## Future external API

The database already contains an `api_keys` boundary, but external API-key authentication is intentionally not presented as complete until key generation, one-way hashing, scopes, rotation, rate limiting, and revocation endpoints are implemented.
