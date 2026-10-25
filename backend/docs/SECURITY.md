# Security status and non-production limitations

Inherited from the saved backend starter:

- BCrypt password hashes, explicit rejection of passwords over 72 UTF-8 bytes.
- HS256 JWT issued only with an externally supplied secret (minimum 32 UTF-8 bytes).
- JWT issuer and expiry checks, UUID subject checks, stateless security filter chain.
- Register/login are public; other routes require authentication by default.
- CORS permitted origins are explicit; no permissive wildcard by default.
- Authentication/validation failures use JSON errors and appropriate status codes.
- `.env` is ignored and generated locally with independent random secrets.
- Hibernate validates DB schema; Flyway owns migrations.

## Required before production

- Implement **workspace membership and per-resource authorization**. JWT authentication is not access control for products/suppliers.
- Add rate limiting and anti-enumeration / brute-force protection for registration/login.
- Define refresh/revocation/logout requirements; JWTs currently remain valid until expiry.
- HTTPS, appropriate reverse proxy, secrets/rotation plan and secure client token storage.
- Email verification/recovery, backup/restore drills, sensitive-logging review, monitoring and incident response.
- Security integration tests with different users and independent workspaces.

The included Docker defaults bind ports to localhost for development only. Do not publish them as-is to the Internet.

Official docs: [Spring Security](https://docs.spring.io/spring-security/reference/index.html), [OWASP REST Security](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html).
