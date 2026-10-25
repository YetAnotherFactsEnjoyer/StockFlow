# Step 1 — Verify the clean StockFlow backend foundation

**Objective:** Prove that the renamed template runs independently, uses an empty database, and passes its existing tests before adding business code.

**Current state:** Identity/shared infrastructure exists. `workspace`, `membership`, `product`, `supplier`, `customer`, `inventory`, `procurement`, and `audit` are deliberately empty.

**Why:** Without a verified baseline, later migration or security failures cannot be attributed to the change that caused them. Isolating databases also prevents accidental damage to legacy StockFlow data.

## Files to read (do not rewrite yet)

| Path | Why |
| --- | --- |
| `build.gradle` | Java version, Spring Boot version, dependencies and testing |
| `src/main/resources/application.yaml` | Environment configuration, JPA `validate`, Flyway |
| `src/main/resources/db/migration/V1__create_users.sql` | Initial schema, only the users table |
| `src/main/java/com/stockflow/shared/security/SecurityConfig.java` | Public vs authenticated routes, CORS |
| `src/main/java/com/stockflow/identity/api/AuthController.java` | Thin HTTP boundary for register/login |
| `src/test/java/com/stockflow/shared/security/SecurityIntegrationTest.java` | Expected HTTP/security behavior |
| `docker-compose.yml` | Isolated database, ports, volumes |

## Instructions

1. `java -version` should report Java 21.
2. `python3 scripts/init_env.py` should create ignored `.env` exactly once; do not display/publish the secrets.
3. `docker compose up -d db` should bring up fresh PostgreSQL on host port 5434.
4. `./gradlew test --tests '*JwtConfigTest' --tests '*GlobalExceptionHandlerTest'` should run without Docker-based integration tests.
5. `./gradlew clean test build` should pass when Docker is running (Testcontainers).
6. `./gradlew bootRun` starts the API on port 8082; `curl -i http://localhost:8082/actuator/health` should return 200.
7. Test register/login/account/me. `/api/v1/account/me` without a valid token should return 401.
8. Record results in a personal `docs/BASELINE_RESULTS.md` (not included here).

**Common mistakes:** running the old and new backend against the same DB, modifying V1 after Flyway applies it, committing `.env`, assuming successful compilation proves security/authorization, and assuming a JWT implies workspace access.

**Definition of done:** basic endpoints work, tests pass, schema is isolated, and no legacy product/supplier data was changed.

When complete, share Gradle output, `docker compose ps`, and health/registration/login results. We will then design the workspace/membership schema together — you write the implementation.

## Official docs to read

- [Gradle Java testing](https://docs.gradle.org/current/userguide/java_testing.html) — how tests are selected and run
- [Spring Boot SQL initialization](https://docs.spring.io/spring-boot/reference/how-to/data-initialization.html) — migrations and Hibernate responsibility
- [Spring Security servlet architecture](https://docs.spring.io/spring-security/reference/servlet/architecture.html) — filter chain fundamentals
- [Testcontainers](https://java.testcontainers.org/modules/databases/postgres/) — disposable test databases
