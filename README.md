```text
███████╗████████╗ ██████╗  ██████╗██╗  ██╗███████╗██╗      ██████╗ ██╗    ██╗
██╔════╝╚══██╔══╝██╔═══██╗██╔════╝██║ ██╔╝██╔════╝██║     ██╔═══██╗██║    ██║
███████╗   ██║   ██║   ██║██║     █████╔╝ █████╗  ██║     ██║   ██║██║ █╗ ██║
╚════██║   ██║   ██║   ██║██║     ██╔═██╗ ██╔══╝  ██║     ██║   ██║██║███╗██║
███████║   ██║   ╚██████╔╝╚██████╗██║  ██╗██║     ███████╗╚██████╔╝╚███╔███╔╝
╚══════╝   ╚═╝    ╚═════╝  ╚═════╝╚═╝  ╚═╝╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝
````

**Full-stack inventory & procurement management platform**

[![Java](https://img.shields.io/badge/Java_17-ED8B00?style=flat-square\&logo=openjdk\&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot_3.5-6DB33F?style=flat-square\&logo=springboot\&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React_18-20232A?style=flat-square\&logo=react\&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square\&logo=typescript\&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL_15-4169E1?style=flat-square\&logo=postgresql\&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square\&logo=docker\&logoColor=white)](https://www.docker.com/)

> 🚧 Actively developed as a portfolio project targeting full-stack roles in Singapore.

</div>

---

## What is StockFlow?

StockFlow is a business-oriented inventory and procurement platform built to feel like a real internal operations tool, not a tutorial clone. It is designed around the actual workflows teams need to manage products, suppliers, purchasing, and stock visibility in one place.

The project focuses on production-minded full-stack engineering:

* clean REST API design
* layered Spring Boot architecture
* relational data modeling with PostgreSQL
* typed frontend development with React + TypeScript
* reusable CRUD patterns across modules
* a UI that feels like an internal business system rather than a demo

---

## Current Progress

StockFlow currently supports full product and supplier management across both backend and frontend.

### Completed

* Product CRUD
* Supplier CRUD
* Modal-based create/edit flows on the frontend
* Auto-refreshing data tables without page reload
* Layered backend structure with controller/service/repository separation
* DTO + mapper + exception handling structure for supplier module

### In progress

* Product-to-supplier relationship
* Search, filtering, and pagination
* Purchase order domain modeling

### Planned

* JWT authentication
* Role-based access control
* Dashboard analytics
* Audit logging
* Dockerized deployment and CI/CD pipeline

---

## Architecture

```text
┌─────────────────────┐         ┌──────────────────────────┐         ┌─────────────┐
│   React Frontend    │──HTTP──▶│   Spring Boot Backend    │──JPA───▶│  PostgreSQL │
│  TypeScript/Tailwind│◀──JSON──│  REST API + Spring Sec.  │         │  Database   │
└─────────────────────┘         └──────────────────────────┘         └─────────────┘
```

### Backend layers

```text
Controller  →  Service  →  Repository  →  Entity  →  PostgreSQL
(HTTP/JSON)    (Logic)     (Data access)  (DB map)
```

### Frontend layers

```text
Page  →  Modal/Form  →  Service  →  API
(UI)     (State)        (HTTP)      (Backend)
```

This pattern is intentionally repeated across modules so new business entities can be added consistently.

---

## Tech Stack

| Layer    | Technology                                                   |
| -------- | ------------------------------------------------------------ |
| Frontend | React 18, TypeScript, Tailwind CSS, Vite                     |
| Backend  | Java 17, Spring Boot 3.5, Spring Data JPA, Spring Validation |
| Database | PostgreSQL 15                                                |
| Security | Spring Security, JWT (planned)                               |
| Build    | Maven, npm, Vite                                             |
| DevOps   | Docker, Docker Compose, GitHub Actions (planned)             |
| Testing  | JUnit 5, Postman                                             |

---

## Features

| Module                                      | Status         |
| ------------------------------------------- | -------------- |
| Product management (CRUD)                   | ✅ Done         |
| Supplier management (CRUD)                  | ✅ Done         |
| Product-supplier relationships              | 🔨 In progress |
| Search, filter, pagination                  | 📋 Planned     |
| JWT authentication                          | 📋 Planned     |
| Role-based access (Admin / Manager / Staff) | 📋 Planned     |
| Purchase order workflow                     | 📋 Planned     |
| Stock updates & inventory history           | 📋 Planned     |
| Dashboard analytics                         | 📋 Planned     |
| Audit logs                                  | 📋 Planned     |
| Docker + CI/CD pipeline                     | 📋 Planned     |

---

## Product Module

The Product module is the first complete end-to-end feature and serves as the template for the rest of the system.

### Implemented

* Backend CRUD endpoints
* Frontend data table
* Add product modal
* Edit product modal with pre-filled values
* Delete product flow
* Automatic table refresh after save/delete

### Why it matters

This module established the reusable full-stack pattern used by the rest of the project:

```text
Entity → Repository → Service → Controller → Page → Modal
```

That pattern is now being reused for Suppliers and future modules like Purchase Orders.

---

## Supplier Module

The Supplier module is the second complete CRUD feature and expands the project toward procurement workflows.

### Implemented

* Supplier entity and repository
* Service layer with business logic
* Request/response DTOs
* Mapper layer
* Custom not-found exception
* Global exception handling
* Frontend supplier table
* Modal-based create/edit supplier form
* Delete supplier flow
* Automatic UI refresh after changes

### Supplier fields

* Name
* Contact person
* Email
* Phone
* Address

This module is the foundation for the upcoming product-supplier relationship and purchase order workflow.

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

| Action                    | Admin | Manager | Staff |
| ------------------------- | :---: | :-----: | :---: |
| View products & suppliers |   ✅   |    ✅    |   ✅   |
| Create / edit products    |   ✅   |    ✅    |   ❌   |
| Manage suppliers          |   ✅   |    ✅    |   ❌   |
| Create purchase orders    |   ✅   |    ✅    |   ✅   |
| Approve / reject orders   |   ✅   |    ✅    |   ❌   |
| View audit logs           |   ✅   |    ❌    |   ❌   |
| Manage users              |   ✅   |    ❌    |   ❌   |

---

## Project Structure

```text
stockflow/
├── backend/
│   ├── src/main/java/com/stockflow/
│   │   ├── controller/        # REST endpoints
│   │   ├── dto/               # Request/response DTOs
│   │   ├── entity/            # JPA entities
│   │   ├── exception/         # Custom exceptions + global handler
│   │   ├── mapper/            # DTO/entity mapping
│   │   ├── repository/        # Spring Data JPA repositories
│   │   ├── service/           # Service contracts
│   │   ├── service/impl/      # Service implementations
│   │   └── security/          # JWT + Spring Security (planned)
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components and modals
│   │   ├── pages/             # Route-level pages
│   │   ├── services/          # API service layer
│   │   ├── types/             # TypeScript models
│   │   └── App.tsx
│   └── package.json
│
├── docs/                      # Architecture notes and diagrams
├── docker-compose.yml
└── README.md
```

---

## API Endpoints

### Products

| Method   | Endpoint             | Description       |
| -------- | -------------------- | ----------------- |
| `GET`    | `/api/products`      | Get all products  |
| `GET`    | `/api/products/{id}` | Get product by ID |
| `POST`   | `/api/products`      | Create a product  |
| `PUT`    | `/api/products/{id}` | Update a product  |
| `DELETE` | `/api/products/{id}` | Delete a product  |

### Suppliers

| Method   | Endpoint              | Description        |
| -------- | --------------------- | ------------------ |
| `GET`    | `/api/suppliers`      | Get all suppliers  |
| `GET`    | `/api/suppliers/{id}` | Get supplier by ID |
| `POST`   | `/api/suppliers`      | Create a supplier  |
| `PUT`    | `/api/suppliers/{id}` | Update a supplier  |
| `DELETE` | `/api/suppliers/{id}` | Delete a supplier  |

---

## Getting Started

### Prerequisites

* Java 17+
* Node.js 18+
* Maven
* Docker & Docker Compose

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/stockflow.git
cd stockflow
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

### 3. Start the backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend runs at `http://localhost:8080`

### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## Development Roadmap

### Phase 1 — Core CRUD

* [x] Products
* [x] Suppliers
* [ ] Product-supplier relationship

### Phase 2 — Usability

* [ ] Search
* [ ] Filtering
* [ ] Pagination
* [ ] Better validation feedback

### Phase 3 — Security

* [ ] JWT login
* [ ] Route protection
* [ ] Role-based permissions

### Phase 4 — Procurement

* [ ] Purchase orders
* [ ] Order line items
* [ ] Approval workflow
* [ ] Stock updates on receive

### Phase 5 — Production polish

* [ ] Dashboard analytics
* [ ] Audit logs
* [ ] Dockerized deployment
* [ ] GitHub Actions pipeline
* [ ] README/screenshots/demo polish

---

## Why this project exists

This project is being built as a portfolio-quality system to demonstrate the difference between knowing a framework and being able to design a real application with it.

It is intentionally structured to show:

* full-stack consistency
* scalable feature organization
* reusable CRUD patterns
* enterprise-leaning backend design
* thoughtful frontend state management

---

## Author

Built by **YetAnotherFactsEnjoyer**

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square\&logo=github\&logoColor=white)](https://github.com/YetAnotherFactsEnjoyer)

---

<div align="center">
<sub>Built with Java, Spring Boot, React, TypeScript, PostgreSQL, and Docker</sub>
</div>
```

A good commit for this would be:

```text
docs(readme): update project status and add supplier module details
```
