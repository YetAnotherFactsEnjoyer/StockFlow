# Database safety and migration policy

- The starter contains **only** `V1__create_users.sql`. It creates a fresh users table on a fresh StockFlow database.
- The ZIP deliberately contains no legacy `product`, `supplier`, or `customer` tables or old seed SQL.
- The old StockFlow database may contain valuable schema/data. **Do not** point this backend at it: old tables plus a new Flyway history is not a clean baseline.
- The new DB publishes host port `5434`; old StockFlow can continue on its own port/Compose project.
- Migrate existing data only after first backing up and explicitly mapping old tables and browser `localStorage` data to the new schema.
- **Never** `docker compose down -v` on a database containing data to keep. New migrations should be `V2__...` onward and reviewed before application.
- Flyway owns table creation/updates, Hibernate validates mappings (`ddl-auto: validate`). Avoid `create`, `create-drop`, or automatic update.
- Run integration tests against disposable Testcontainers PostgreSQL, not a real existing user database.

Read: [PostgreSQL pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html), [Flyway migration concepts](https://documentation.red-gate.com/fd/migrations-184127470.html), [Spring Boot database initialization](https://docs.spring.io/spring-boot/reference/how-to/data-initialization.html).
