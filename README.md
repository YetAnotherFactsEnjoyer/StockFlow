<div align="center">

```
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
[![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL_15-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

> 🚧 Actively developed as a portfolio project targeting full-stack roles in Singapore.

</div>

---

## What is StockFlow?

StockFlow is a business-grade inventory and procurement platform — built to feel like a real internal tool, not a tutorial project. It handles the full lifecycle of stock management: from tracking products and suppliers to raising purchase orders and monitoring inventory levels through a clean, role-aware dashboard.

The goal is to demonstrate production-level full-stack thinking: clean REST API design, relational data modeling, secure authentication, business workflow implementation, and a professional frontend — all in one cohesive codebase.

---

## Architecture

```
┌─────────────────────┐         ┌──────────────────────────┐         ┌─────────────┐
│   React Frontend    │──HTTP──▶│   Spring Boot Backend    │──JPA───▶│  PostgreSQL │
│  TypeScript/Tailwind│◀──JSON──│  REST API + Spring Sec.  │         │  Database   │
└─────────────────────┘         └──────────────────────────┘         └─────────────┘
```

**Backend layers:**
```
Controller  →  Service  →  Repository  →  Entity  →  PostgreSQL
(HTTP/JSON)    (Logic)     (Data access)  (DB map)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS, Vite |
| Backend | Java 17, Spring Boot 3.5, Spring Security, Spring Data JPA |
| Database | PostgreSQL 15 |
| Auth | JWT (JSON Web Tokens) |
| Build | Maven |
| DevOps | Docker, Docker Compose, GitHub Actions |
| Testing | JUnit 5, Postman |

---

## Features

| Module | Status |
|---|---|
| Product management (CRUD) | ✅ Done |
| Supplier management | 🔨 In progress |
| Product-supplier relationships | 🔨 In progress |
| Search, filter, pagination | 📋 Planned |
| JWT authentication | 📋 Planned |
| Role-based access (Admin / Manager / Staff) | 📋 Planned |
| Purchase order workflow | 📋 Planned |
| Stock updates & inventory history | 📋 Planned |
| Dashboard analytics | 📋 Planned |
| Audit logs | 📋 Planned |
| Docker + CI/CD pipeline | 📋 Planned |

---

## Purchase Order Workflow

```
DRAFT  ──▶  SUBMITTED  ──▶  APPROVED  ──▶  RECEIVED
                │
                └──▶  REJECTED
```

---

## Roles & Permissions

| Action | Admin | Manager | Staff |
|---|:---:|:---:|:---:|
| View products & suppliers | ✅ | ✅ | ✅ |
| Create / edit products | ✅ | ✅ | ❌ |
| Manage suppliers | ✅ | ✅ | ❌ |
| Create purchase orders | ✅ | ✅ | ✅ |
| Approve / reject orders | ✅ | ✅ | ❌ |
| View audit logs | ✅ | ❌ | ❌ |
| Manage users | ✅ | ❌ | ❌ |

---

## Project Structure

```
stockflow/
├── backend/
│   └── src/main/java/com/stockflow/
│       ├── controller/        # REST endpoints
│       ├── service/           # Business logic
│       ├── repository/        # Data access (Spring Data JPA)
│       ├── entity/            # Database models
│       ├── dto/               # Request/response shapes
│       └── security/          # JWT + Spring Security (planned)
├── frontend/
│   └── src/
│       ├── pages/             # Route-level components
│       ├── components/        # Reusable UI components
│       ├── services/          # API calls (axios)
│       └── types/             # TypeScript interfaces
├── docs/                      # Architecture diagrams
├── docker-compose.yml
└── README.md
```

---

## Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- Docker & Docker Compose
- Maven

### 1. Clone the repo

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

## API Endpoints

### Products

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Get all products |
| `GET` | `/api/products/{id}` | Get product by ID |
| `POST` | `/api/products` | Create a product |
| `PUT` | `/api/products/{id}` | Update a product |
| `DELETE` | `/api/products/{id}` | Delete a product |

---

## Author

Built by **YetAnotherFactsEnjoyer** —

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/YetAnotherFactsEnjoyer)
---

<div align="center">
<sub>Built with Java, Spring Boot, React, TypeScript, PostgreSQL, and Docker</sub>
</div>
