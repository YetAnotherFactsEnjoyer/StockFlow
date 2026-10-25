# Architecture — StockFlow modular monolith

One Spring Boot process, one PostgreSQL database, and **feature-oriented modules**. No microservices, generated CRUD scaffolding, event bus, or premature generic repository/service abstractions.

## Module ownership

| Module | Owns | Current state |
| --- | --- | --- |
| `identity` | User credentials, registration, login, current user | Starter implementation retained |
| `shared` | JWT and Spring Security, cross-cutting API error handling | Starter implementation retained |
| `workspace` | Workspace identity and persistent settings | Empty placeholder |
| `membership` | User-to-workspace association and workspace roles | Empty placeholder |
| `product` | Workspace catalog, SKU uniqueness, product state | Empty placeholder |
| `supplier` | Workspace suppliers and supplier associations | Empty placeholder |
| `customer` | Workspace customers and relationships | Empty placeholder |
| `inventory` | Auditable stock movement, balances and locking | Empty placeholder |
| `procurement` | Purchase orders, order items, receiving workflows | Empty placeholder |
| `audit` | Non-secret business/audit history | Empty placeholder |

## Typical layers (when useful)

- `api`: controllers, request/response DTOs, HTTP validation and status mapping. No entity serialization or business decisions.
- `application`: use cases, orchestration, role/ownership checks, clear transactional boundaries.
- `domain`: entity/model and domain invariants; depends as little as possible on HTTP details.
- `persistence`: Spring Data repositories and persistence-specific queries.

**Within a feature**, `api` -> `application` -> `domain/persistence` is a useful default. Keep domain rules independent of controllers. Avoid layer interfaces unless there are real independent implementations/testing needs.

## Core invariants to design before coding

1. **Ownership:** workspace owns business records, not a global user or JWT claim alone.
2. **Authorization:** each operation validates active membership and permissions in the requested workspace; reject cross-workspace IDs regardless of request path.
3. **Uniqueness:** e.g. `(workspace_id, normalized_sku)` should have a DB-enforced unique constraint, with carefully defined case folding.
4. **Stock ledger:** balance changes go through transactional movements, not editable product quantity fields. Plan policies for negative stock, reversals, and optimistic/pessimistic locking.
5. **Procurement:** partial receiving produces inventory receipt movements and is idempotent/retry-safe.
6. **Audit:** store who/what/when without logging tokens or password hashes.
7. **Data boundaries:** API DTOs differ from JPA entities; frontend IDs and enums must match API contracts.

## Dependency rules

`shared` must never depend on business modules. `identity` must not depend on `product`, `inventory`, or `procurement`. Cross-feature reads/commands should go through clear application boundaries, not shared mutable entities. Later we can check dependencies with tests if the code grows enough to justify it.

## Architectural sequence

1. Verify existing template build/authentication and separate database.
2. Design workspace + membership domain (and role authorization) before multi-tenant business endpoints.
3. Implement workspace-scoped product and supplier features with database constraints and tests.
4. Integrate frontend API adapters carefully; plan browser-data migration if data matters.
5. Implement stock ledger/concurrency, followed by procurement and truthful dashboards.
6. Harden deployments, monitoring, backups, CI and operational security.

## References

- [Spring Boot code structuring](https://docs.spring.io/spring-boot/reference/using/structuring-your-code.html)
- [Spring Data JPA transactions](https://docs.spring.io/spring-data/jpa/reference/jpa/transactions.html)
- [Spring Security authorization](https://docs.spring.io/spring-security/reference/servlet/authorization/index.html)
- [Flyway migrations](https://documentation.red-gate.com/fd/migrations-184127470.html)
