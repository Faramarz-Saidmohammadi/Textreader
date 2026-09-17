# Security Policy

## Supported version

The `main` branch is the supported portfolio release.

## Security design

- Authentication cookies are `HttpOnly`, `SameSite=Lax`, signed with HMAC-SHA256, and expire after eight hours.
- Passwords are derived with Node.js `scrypt` and unique random salts; plaintext passwords are never stored.
- Workspace identity is taken from the verified server session, not from request bodies or query strings.
- Authorization is checked server-side with explicit RBAC permissions before mutations.
- PostgreSQL writes are parameterized through the `postgres` tagged-template client.
- Administrative writes emit audit records.
- `.env*` files are excluded from source control and the example secret is not suitable for production.

## Production hardening checklist

Before public production use: rotate a cryptographically random session secret, enforce TLS, use a managed PostgreSQL service with backups, add rate limiting at the edge/API gateway, configure CSP/security headers, add email verification and MFA, hash API keys before persistence, connect billing webhooks with signature verification, and run dependency/security scanning in CI.

## Reporting

For a real deployment, configure a private security contact rather than opening public vulnerability issues.
