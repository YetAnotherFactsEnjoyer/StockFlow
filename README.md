<div align="center">

```text
███████╗████████╗ ██████╗  ██████╗██╗  ██╗███████╗██╗      ██████╗ ██╗    ██╗
██╔════╝╚══██╔══╝██╔═══██╗██╔════╝██║ ██╔╝██╔════╝██║     ██╔═══██╗██║    ██║
███████╗   ██║   ██║   ██║██║     █████╔╝ █████╗  ██║     ██║   ██║██║ █╗ ██║
╚════██║   ██║   ██║   ██║██║     ██╔═██╗ ██╔══╝  ██║     ██║   ██║██║███╗██║
███████║   ██║   ╚██████╔╝╚██████╗██║  ██╗██║     ███████╗╚██████╔╝╚███╔███╔╝
╚══════╝   ╚═╝    ╚═════╝  ╚═════╝╚═╝  ╚═╝╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝
```

**Full-stack inventory & procurement management platform**

[![Java](https://img.shields.io/badge/Java_17-ED8B00?style=flat-square&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot_3.5-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL_15-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

> 🚧 Actively developed as a portfolio project targeting full-stack roles in Singapore.

</div>

---

## What is StockFlow?

StockFlow is a business-oriented inventory and procurement management platform built to feel like a real internal operations tool, not a tutorial clone. It helps teams manage products, suppliers, stock visibility, and the procurement workflows that connect them.

The project focuses on production-minded full-stack engineering:

- clean REST API design
- layered Spring Boot architecture
- relational data modeling with PostgreSQL
- typed frontend development with React + TypeScript
- reusable CRUD patterns across modules
- DTO-based API boundaries instead of exposing entities directly
- a polished internal-tool UI with modals, detail views, search, and summary cards

---

## Current Progress

StockFlow currently supports product and supplier management across both backend and frontend.

### Completed

- Product CRUD
- Supplier CRUD
- Product-to-supplier relationship
- Product create/edit form with supplier dropdown
- Supplier and product detail modals
- Frontend summary cards for products and suppliers
- Modal-based create/edit flows
- Delete flows with immediate UI updates
- Backend request/response DTOs for product and supplier APIs
- Mapper layer for converting entities to API responses
- Layered backend structure with controller/service/repository separation
- Supplier service interface + implementation structure
- Custom supplier not-found exception
- Global exception handling
- Product backend search endpoint
- Supplier backend search endpoint
- Frontend search UI for products and suppliers

### In progress

- Wiring product page search fully to backend query search
- Pagination for product and supplier tables
- Better validation feedback in the frontend
- Purchase order domain modeling

### Planned

- JWT authentication
- Role-based access control
- Purchase order workflow
- Stock updates and inventory history
- Dashboard analytics
- Audit logging
- Dockerized production deployment
- CI/CD pipeline

---

## Architecture

```text
┌─────────────────────┐         ┌──────────────────────────┐         ┌─────────────┐
│   React Frontend    │──HTTP──▶│   Spring Boot Backend    │──JPA───▶│  PostgreSQL │
│  TypeScript/Tailwind│◀──JSON──│      REST API            │         │  Database   │
└─────────────────────┘         └──────────────────────────┘         └─────────────┘
```

### Backend layers

```text
Controller  →  Service  →  Repository  →  Entity  →  PostgreSQL
(HTTP/JSON)    (Logic)     (Data access)  (DB map)
```

### Frontend layers

```text
Page  →  Modal/Details  →  Service  →  API
(UI)     (State/Form)      (HTTP)      (Backend)
```

This pattern is intentionally repeated across modules so new business entities can be added consistently.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, TypeScript, Tailwind CSS, Vite, React Icons |
| Backend | Java 17, Spring Boot 3.5, Spring Data JPA, Spring Validation |
| Database | PostgreSQL 15 |
| API Client | Axios |
| Build | Maven, npm, Vite |
| DevOps | Docker Compose for local PostgreSQL |
| Testing | Spring Boot Test, Postman/manual API testing |
| Security | JWT + role-based access control planned |

---

## Features

| Module | Status |
| --- | --- |
| Product management CRUD | ✅ Done |
| Supplier management CRUD | ✅ Done |
| Product-supplier relationship | ✅ Done |
| Product detail modal | ✅ Done |
| Supplier detail modal | ✅ Done |
| Product search endpoint | ✅ Done |
| Supplier search endpoint | ✅ Done |
| Frontend search UI | ✅ Done |
| Pagination | 🔨 Next |
| Better validation feedback | 🔨 Next |
| JWT authentication | 📋 Planned |
| Role-based access | 📋 Planned |
| Purchase order workflow | 📋 Planned |
| Stock updates & inventory history | 📋 Planned |
| Dashboard analytics | 📋 Planned |
| Audit logs | 📋 Planned |
| Docker + CI/CD pipeline | 📋 Planned |

---

## Product Module

The Product module manages the inventory catalog and serves as the main template for full-stack feature development.

### Implemented

- Product entity mapped to the `products` table
- Product request and response DTOs
- Product mapper
- Product repository with database search support
- Product service with supplier lookup logic
- Product controller with REST endpoints
- Product table on the frontend
- Add product modal
- Edit product modal with pre-filled values
- Supplier dropdown inside the product form
- Delete product flow
- Product detail modal
- Product summary cards for total, low-stock, and out-of-stock counts
- Search UI by product name, SKU, description, and supplier name

### Product-supplier relationship

Products are connected to suppliers through a many-to-one relationship:

```text
Supplier 1 ──▶ Product many
```

In database terms:

```text
products.supplier_id → suppliers.id
```

The frontend sends a simple `supplierId` when creating or updating a product. The backend looks up the supplier entity and returns clean response fields such as `supplierId` and `supplierName`.

---

## Supplier Module

The Supplier module manages the procurement partners that provide products.

### Implemented

- Supplier entity mapped to the `suppliers` table
- Supplier repository with exact lookup methods and search support
- Supplier service interface
- Supplier service implementation
- Request/response DTOs
- Mapper layer
- Custom not-found exception
- Global exception handling
- Supplier table on the frontend
- Add supplier modal
- Edit supplier modal with pre-filled values
- Delete supplier flow
- Supplier detail modal
- Supplier summary cards for total suppliers, email contacts, and phone contacts
- Debounced supplier search from the frontend API service

### Supplier fields

- Name
- Contact person
- Email
- Phone
- Address

---

## Search

StockFlow supports backend search through optional query parameters.

```http
GET /api/products?search=laptop
GET /api/suppliers?search=dell
```

Product search currently supports:

- name
- SKU
- description

Supplier search currently supports:

- name
- contact person
- email
- phone
- address

---

## Purchase Order Workflow

Planned workflow:

```text
DRAFT  ──▶  SUBMITTED  ──▶  APPROVED  ──▶  RECEIVED
                │
                └──▶  REJECTED
```

This module will eventually connect suppliers, products, order lines, approval states, and stock updates.

---

## Roles & Permissions

Planned authorization model:

| Action | Admin | Manager | Staff |
| --- | :---: | :---: | :---: |
| View products & suppliers | ✅ | ✅ | ✅ |
| Create / edit products | ✅ | ✅ | ❌ |
| Manage suppliers | ✅ | ✅ | ❌ |
| Create purchase orders | ✅ | ✅ | ✅ |
| Approve / reject orders | ✅ | ✅ | ❌ |
| View audit logs | ✅ | ❌ | ❌ |
| Manage users | ✅ | ❌ | ❌ |

---

## Project Structure

```text
StockFlow/
├── backend/
│   ├── src/main/java/com/stockflow/
│   │   ├── StockflowApplication.java
│   │   ├── common/
│   │   │   └── exception/
│   │   ├── product/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   ├── entity/
│   │   │   ├── mapper/
│   │   │   ├── repository/
│   │   │   └── service/
│   │   └── supplier/
│   │       ├── controller/
│   │       ├── dto/
│   │       ├── entity/
│   │       ├── mapper/
│   │       ├── repository/
│   │       └── service/
│   │           └── impl/
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductDetailsModal.tsx
│   │   │   ├── ProductModal.tsx
│   │   │   ├── SupplierDetailsModal.tsx
│   │   │   └── SupplierModal.tsx
│   │   ├── pages/
│   │   │   ├── ProductsPage.tsx
│   │   │   └── SupplierPage.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── productService.ts
│   │   │   └── supplierService.ts
│   │   ├── types/
│   │   │   ├── product.ts
│   │   │   └── supplier.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── database/
│   └── seed-test-products.sql
├── docs/
├── docker-compose.yml
└── README.md
```

---

## API Endpoints

### Products

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/products` | Get all products |
| `GET` | `/api/products?search={term}` | Search products |
| `GET` | `/api/products/{id}` | Get product by ID |
| `POST` | `/api/products` | Create a product |
| `PUT` | `/api/products/{id}` | Update a product |
| `DELETE` | `/api/products/{id}` | Delete a product |

Example create/update payload:

```json
{
  "name": "Laptop",
  "description": "Business laptop",
  "sku": "LAP-001",
  "price": 999.99,
  "stockQuantity": 20,
  "supplierId": 1
}
```

Example response:

```json
{
  "id": 1,
  "name": "Laptop",
  "description": "Business laptop",
  "sku": "LAP-001",
  "price": 999.99,
  "stockQuantity": 20,
  "supplierId": 1,
  "supplierName": "Dell Wholesale",
  "createdAt": "2026-05-18T22:00:00",
  "updatedAt": "2026-05-18T22:00:00"
}
```

### Suppliers

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/suppliers` | Get all suppliers |
| `GET` | `/api/suppliers?search={term}` | Search suppliers |
| `GET` | `/api/suppliers/{id}` | Get supplier by ID |
| `POST` | `/api/suppliers` | Create a supplier |
| `PUT` | `/api/suppliers/{id}` | Update a supplier |
| `DELETE` | `/api/suppliers/{id}` | Delete a supplier |

Example create/update payload:

```json
{
  "name": "Dell Wholesale",
  "contactPerson": "Sarah Lee",
  "email": "sarah@example.com",
  "phone": "+65 1234 5678",
  "address": "Singapore"
}
```

---

## Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- Maven
- Docker & Docker Compose

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/stockflow.git
cd stockflow
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

PostgreSQL runs on port `5432` with the local database configured in `docker-compose.yml`.

### 3. Start the backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend runs at:

```text
http://localhost:8080
```

### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

## Development Roadmap

### Phase 1 — Core CRUD

- [x] Products
- [x] Suppliers
- [x] Product-supplier relationship

### Phase 2 — Usability

- [x] Search UI
- [x] Backend product search endpoint
- [x] Backend supplier search endpoint
- [ ] Wire product page search fully to backend query search
- [ ] Pagination
- [ ] Better validation feedback

### Phase 3 — Security

- [ ] JWT login
- [ ] Route protection
- [ ] Role-based permissions

### Phase 4 — Procurement

- [ ] Purchase orders
- [ ] Order line items
- [ ] Approval workflow
- [ ] Stock updates on receive

### Phase 5 — Production polish

- [ ] Dashboard analytics
- [ ] Audit logs
- [ ] Dockerized deployment
- [ ] GitHub Actions pipeline
- [ ] README screenshots and demo polish

---

## Why this project exists

This project is being built as a portfolio-quality system to demonstrate the difference between knowing a framework and being able to design a real application with it.

It is intentionally structured to show:

- full-stack consistency
- scalable feature organization
- reusable CRUD patterns
- enterprise-leaning backend design
- relational database modeling
- thoughtful frontend state management

---

## Author

Built by **YetAnotherFactsEnjoyer**

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/YetAnotherFactsEnjoyer)

---

<div align="center">
<sub>Built with Java, Spring Boot, React, TypeScript, PostgreSQL, and Docker</sub>
</div>
