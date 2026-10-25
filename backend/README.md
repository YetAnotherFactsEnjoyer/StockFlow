# StockFlow Backend — learning-first foundation

A **clean StockFlow backend**, derived from the owner's saved Java backend starter (itself developed from the GhostPay identity/JWT foundation). The previous StockFlow backend's inventory, supplier, customer and product implementations have **not** been copied here.

**Purpose:** retain a runnable identity/security/data foundation while you implement each business feature yourself, step by step. This is **not** a complete StockFlow application or a production-certified authentication service.

## Technology

- Java 21, Spring Boot 4.1.1, Gradle 9.8.1 wrapper
- Spring Security, stateless Bearer JWT with HS256, BCrypt
- PostgreSQL 17 (a **separate fresh database**)
- Flyway SQL migrations; Hibernate `ddl-auto: validate`
- JUnit-based unit tests, Testcontainers PostgreSQL integration tests
- Docker Compose, Dockerfile, GitHub Actions workflow

## What works in the starter (subject to successful local build/test)

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/api/v1/auth/register` | Public | Create account (validated request) |
| POST | `/api/v1/auth/login` | Public | Authenticate and obtain Bearer JWT |
| GET | `/api/v1/account/me` | Bearer JWT | Resolve persisted current user |
| GET | `/actuator/health` | Public | Minimal health endpoint |

No workspace, membership, product, supplier, customer, stock or purchase-order endpoints have been implemented. All future routes are authenticated by default; **authentication alone is NOT workspace authorization**.

## Get started (Arch Linux / Linux)

Prerequisites: Java 21, Docker + Docker Compose, Python 3. Internet access is needed for Gradle to fetch distributions/dependencies for the first build.

```bash
cd stockflow-backend
java -version
python3 scripts/init_env.py  # creates an ignored .env with random dev secrets
# Choose ONE way to start:
# (A) database in Docker, API on host:
docker compose up -d db
./gradlew bootRun
# OR (B) backend + database in Docker:
docker compose up -d --build
```

API: `http://localhost:8082` · PostgreSQL host port: `5434` (internal Compose port: 5432). Ports were chosen to avoid overwriting/conflicting with the older StockFlow database and server.

`docker compose` reads `.env`; Spring Boot `bootRun` reads `.env` via `spring.config.import`. Do **not** commit `.env`. Do not run a host backend and Compose backend simultaneously on port 8082.

If you have no Docker, configure your own **empty** PostgreSQL database with matching `.env` values before running the application. Do not point this project to a populated old StockFlow database.

### Quick HTTP check

```bash
curl -i http://localhost:8082/actuator/health
curl -i -X POST http://localhost:8082/api/v1/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"sample-password-123"}'
curl -s -X POST http://localhost:8082/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"sample-password-123"}'
# Copy the accessToken returned by login:
curl -i http://localhost:8082/api/v1/account/me \
  -H 'Authorization: Bearer REPLACE_WITH_ACCESS_TOKEN'
```

### Tests

```bash
# No Docker needed:
./gradlew test --tests '*JwtConfigTest' --tests '*GlobalExceptionHandlerTest'
# Docker required; disposable PostgreSQL containers (Testcontainers):
./gradlew clean test build
```

## Modules

```text
src/main/java/com/stockflow/
├── StockFlowApplication.java
├── identity/                    # WORKING TEMPLATE: authentication and users
│   ├── api/
│   ├── application/
│   ├── domain/
│   └── persistence/
├── shared/                      # WORKING TEMPLATE: security and API errors
│   ├── exception/
│   └── security/
├── workspace/                   # EMPTY: for you to implement
├── membership/                  # EMPTY
├── product/                     # EMPTY
├── supplier/                    # EMPTY
├── customer/                    # EMPTY
├── inventory/                   # EMPTY
├── procurement/                 # EMPTY
└── audit/                       # EMPTY
```

Each empty feature already contains `api`, `application`, `domain`, and `persistence` directories with `.gitkeep` markers; **no classes, endpoints, entities, or migrations are generated** for them. Use only the layers a feature actually needs. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Important data warning

This ZIP is **backend-only** and has its **own new PostgreSQL database**. It does not delete the old StockFlow code or database, and it does not migrate legacy PostgreSQL data or browser localStorage. Preserve/backup both until you intentionally migrate. Never run `docker compose down -v` against valuable data. New SQL migrations should start at `V2__...`; don't edit V1 after it has been applied.

## Next task

Read [docs/NEXT_STEP.md](docs/NEXT_STEP.md). We'll implement one small, reviewable step at a time and explain each file before coding. Also see [docs/DATABASE_SAFETY.md](docs/DATABASE_SAFETY.md), [docs/SECURITY.md](docs/SECURITY.md), [docs/VERIFICATION.md](docs/VERIFICATION.md), and [docs/SOURCE.md](docs/SOURCE.md).

## Code style

Use **2-space indentation** for Java, Gradle, Python, SQL, and YAML.
The repository `.editorconfig` configures editors to use this convention.
Do not manually edit the generated Gradle wrapper scripts.
