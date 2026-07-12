<div align="center">

```text
███████╗████████╗ ██████╗  ██████╗██╗  ██╗███████╗██╗      ██████╗ ██╗    ██╗
██╔════╝╚══██╔══╝██╔═══██╗██╔════╝██║ ██╔╝██╔════╝██║     ██╔═══██╗██║    ██║
███████╗   ██║   ██║   ██║██║     █████╔╝ █████╗  ██║     ██║   ██║██║ █╗ ██║
╚════██║   ██║   ██║   ██║██║     ██╔═██╗ ██╔══╝  ██║     ██║   ██║██║███╗██║
███████║   ██║   ╚██████╔╝╚██████╗██║  ██╗██║     ███████╗╚██████╔╝╚███╔███╔╝
╚══════╝   ╚═╝    ╚═════╝  ╚═════╝╚═╝  ╚═╝╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝
```

**Workspace-based inventory and procurement management platform**

[![Java](https://img.shields.io/badge/Java_17-ED8B00?style=flat-square&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot_3.5-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript_6-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL_15-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

> Actively developed as a portfolio-quality full-stack product with a strong focus on architecture, UX, and evolutive business workflows.

</div>

---

## What is StockFlow?

StockFlow is a business-oriented inventory and procurement platform designed for brands, retailers, manufacturers, wholesalers, and other organizations that need clear control over products, suppliers, stock levels, and purchasing operations.

The product is being designed as a real internal operations tool rather than a tutorial CRUD application. Its objective is to combine:

- a structured Spring Boot backend;
- a typed and feature-based React frontend;
- workspace-specific inventory rules;
- an onboarding experience that configures the application before first use;
- an action-oriented dashboard focused on operational decisions;
- an evolutive architecture that can later support authentication, multi-user collaboration, purchase orders, audit logs, and multiple stock locations.

---

## Product Objectives

StockFlow is moving toward a **workspace-first inventory platform**.

Each organization creates and configures its own workspace through a guided setup flow. The selected preferences then affect the application instead of remaining decorative onboarding answers.

The main objectives are:

1. **Fast first-time setup**  
   A new organization should be able to configure its workspace without technical knowledge.

2. **Operational clarity**  
   The dashboard should immediately show what requires attention, what changed recently, and what action the user should take next.

3. **Consistent and accessible UX**  
   The interface uses solid surfaces, clear hierarchy, restrained animation, strong contrast, and predictable navigation.

4. **Configurable inventory behavior**  
   Currency, valuation method, low-stock alerts, barcode actions, purchase-price tracking, and import mode influence application behavior.

5. **Evolutive architecture**  
   Frontend pages consume repositories and prepared view models so mock data can later be replaced by backend APIs without rewriting the UI.

6. **Complete procurement lifecycle**  
   The long-term product connects products, suppliers, purchase orders, stock receipts, inventory movements, approval workflows, and audit history.

---

## Current Project Status

The project currently contains a stable backend foundation and a redesigned frontend foundation.

### Backend completed

- Product CRUD REST API
- Supplier CRUD REST API
- Product-to-supplier relationship
- Product and supplier request/response DTOs
- Entity-to-response mapper layer
- Controller, service, repository, and entity separation
- Supplier service interface and implementation
- Product and supplier search endpoints
- Custom not-found exceptions
- Global API exception handling
- PostgreSQL persistence

### Frontend foundation completed

- React 19 and TypeScript application shell
- Tailwind CSS v4 design-token system
- TanStack Router file-based routes
- Root-level onboarding context provider
- Persistent onboarding draft stored locally during frontend development
- First-launch route protection
- Completed-workspace route protection
- Seven-step workspace setup flow
- Runtime workspace branding and light/dark/system appearance
- Responsive application layout with a left navigation sidebar
- Dashboard repository contract
- Mock dashboard repository
- Dashboard raw-data types
- Dashboard view-model layer
- State-aware dashboard interface
- Empty and populated dashboard states
- Setup-driven dashboard metrics and quick actions

### Frontend currently in progress

- Final responsive sidebar and application-shell polish
- Connecting dashboard actions to real routes and workflows
- Rebuilding the Products page inside the new feature architecture
- Rebuilding the Suppliers page inside the new feature architecture
- Connecting the redesigned frontend to the existing backend APIs
- Moving workspace setup persistence from local storage to the backend
- Loading real dashboard data instead of mock repository data

### Planned

- Product and supplier pagination
- Improved frontend validation and API feedback
- Authentication with JWT
- Role-based authorization
- Real invitation tokens and email delivery
- Purchase-order lifecycle
- Stock receipts and inventory movement history
- Multi-location inventory
- Audit logs
- Dockerized deployment
- CI/CD pipeline

---

## Frontend Experience

### First launch and workspace setup

A user who has not completed setup is redirected to the saved onboarding step.

```text
Open application
      │
      ├── setup incomplete ──▶ /setup or last saved setup step
      │
      └── setup complete ────▶ main application
```

The setup contains seven steps:

```text
Welcome
  → Organization
  → Branding
  → Inventory
  → Team
  → Import
  → Review
```

The flow collects:

- organization name and workspace identifier;
- industry and base currency;
- application name and brand colors;
- light, dark, or system appearance;
- valuation method;
- low-stock alert preference;
- purchase-price tracking preference;
- barcode-scanning preference;
- initial team invitations;
- manual, CSV, or demonstration-data initialization.

After completion, setup routes are no longer accessible unless the workspace state is reset.

### Application shell

The main application uses a persistent left sidebar and a flexible content area.

```text
┌──────────────────┬─────────────────────────────────────────────┐
│ Workspace        │                                             │
│ Search           │               Page content                  │
│                  │                                             │
│ Overview         │                                             │
│ Products         │                                             │
│ Suppliers        │                                             │
│                  │                                             │
│ Workspace info   │                                             │
│ Account          │                                             │
└──────────────────┴─────────────────────────────────────────────┘
```

The sidebar reads workspace data from onboarding state and currently displays:

- workspace/application name;
- dynamic initials;
- active route state;
- inventory location mode;
- current team size;
- responsive mobile navigation.

### Runtime branding

The selected workspace appearance is applied globally by `WorkspaceTheme`.

It updates:

- the root light/dark theme;
- the browser color scheme;
- `--workspace-primary`;
- `--workspace-accent`.

This allows runtime user-selected colors to affect buttons, active navigation, focus states, and future visualizations without dynamically generating Tailwind classes.

---

## How Setup Changes the Application

| Setup preference | Application effect |
| --- | --- |
| Organization name | Workspace labels, dashboard context, invitations, and future reports |
| Workspace identifier | Workspace URLs and future invitation/API identifiers |
| Base currency | Inventory value, prices, purchase orders, and financial formatting |
| Application name | Sidebar branding and application identity |
| Primary color | Main actions, active navigation, selected controls, and focus states |
| Accent color | Secondary highlights and future charts/status details |
| Color mode | Light, dark, or system-driven application appearance |
| Valuation method | Future backend calculation of FIFO, LIFO, or weighted-average stock value |
| Low-stock alerts | Low-stock summary metric and dashboard attention section |
| Track purchase price | Shows inventory value when enabled, total units when disabled |
| Barcode scanning | Adds barcode-related quick actions and future scanning workflows |
| Team members | Pending invitations and future activity attribution |
| Import mode | Controls the first dashboard experience and initial data workflow |

The setup should change defaults and available functionality without creating completely separate applications for each industry.

---

## Dashboard UX

The dashboard is designed around user questions rather than decorative analytics.

It should answer:

1. Does anything require attention?
2. What is the overall inventory state?
3. What changed recently?
4. What can the user do next?

### Current dashboard organization

```text
Header and primary action

Summary metrics

Needs attention                 Quick actions

Recent stock activity
```

The dashboard supports two main states.

### Empty workspace

A new workspace does not display a page full of zero-value statistics. It presents a focused next action such as adding the first product or continuing an import.

### Active workspace

A workspace with data displays:

- total products;
- low-stock count when alerts are enabled;
- inventory value or total units depending on setup;
- active suppliers;
- products requiring attention;
- recent inventory movements;
- setup-dependent quick actions.

The current dashboard reads mock data, but its components do not depend directly on that mock implementation.

---

## Frontend Architecture

The new frontend is organized by features rather than by generic global folders.

```text
Route
  → repository
  → raw domain data
  → view-model builder
  → display-ready view model
  → page components
```

### Route layer

TanStack Router controls navigation, loaders, and access rules.

```text
src/routes/
├── __root.tsx
├── _app.tsx
├── _app/
│   ├── index.tsx
│   ├── products.tsx
│   └── suppliers.tsx
└── setup/
    ├── route.tsx
    ├── index.tsx
    ├── organization.tsx
    ├── branding.tsx
    ├── inventory.tsx
    ├── team.tsx
    ├── import.tsx
    └── review.tsx
```

`_app.tsx` is a pathless layout route. It protects the application and renders the shared `AppLayout` around its child pages.

`setup/route.tsx` protects the onboarding branch and redirects completed workspaces to the application.

### Onboarding state flow

```text
Setup component
      ↓ dispatch
OnboardingProvider
      ↓
Onboarding repository
      ↓
Local persistence during frontend development
```

The provider is mounted above the router, so both setup pages and the main application can access the same workspace state.

The repository contract makes it possible to replace local persistence with a backend API later.

### Dashboard data flow

```text
Dashboard route loader
        │
        ├── DashboardRepository.getOverview()
        └── OnboardingRepository.getState()
                    │
                    ▼
          buildDashboardViewModel()
                    │
                    ▼
             DashboardPage
```

The raw dashboard model contains business data:

- counts;
- inventory value;
- stock levels;
- attention statuses;
- movement types;
- timestamps.

The dashboard view model contains display-ready data:

- formatted currency;
- formatted quantities;
- human-readable movement labels;
- warning severity;
- conditional summary metrics;
- setup-dependent quick actions;
- empty or ready page state.

This keeps formatting and setup rules out of the React presentation components.

### Repository pattern

The dashboard currently exports a mock repository:

```text
DashboardRepository
└── mockDashboardRepository
```

A future HTTP implementation can use the same contract:

```text
DashboardRepository
└── httpDashboardRepository
        └── GET /api/dashboard
```

The route and visual components will not need to be rewritten when the implementation changes.

---

## UX and Visual Principles

The frontend intentionally avoids the common generic dashboard appearance.

The design direction prioritizes:

- solid colors instead of glassmorphism;
- clear hierarchy instead of decorative density;
- restrained corner radius;
- limited shadows;
- action-oriented empty states;
- responsive layouts;
- visible labels and accessible controls;
- semantic status colors;
- motion used only to reinforce transitions or selection;
- progressive disclosure instead of showing every feature at once.

The dashboard is an overview and action surface. Complete product, supplier, procurement, and administrative workflows remain on dedicated pages.

---

## System Architecture

```text
┌────────────────────────┐       HTTP/JSON       ┌──────────────────────────┐
│ React + TypeScript     │ ────────────────────▶ │ Spring Boot REST API     │
│ TanStack Router        │ ◀──────────────────── │ Controllers / DTOs       │
│ Tailwind / Motion      │                       │ Services / Repositories  │
└────────────────────────┘                       └─────────────┬────────────┘
                                                            │ JPA
                                                            ▼
                                                   ┌───────────────────┐
                                                   │ PostgreSQL        │
                                                   └───────────────────┘
```

### Backend layers

```text
Controller
    → Service
        → Repository
            → Entity
                → PostgreSQL
```

Responsibilities:

- **Controller:** HTTP routes and request/response handling
- **DTO:** public API contract and validation boundary
- **Service:** business logic and entity relationships
- **Repository:** persistence queries
- **Mapper:** entity-to-response conversion
- **Entity:** relational database mapping

### Frontend layers

```text
Route
    → Feature repository
        → Domain types
            → View-model builder
                → Feature page/components
```

Shared application concerns such as buttons, inputs, logos, layout, and routing remain outside individual business features.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend framework | React 19 |
| Frontend language | TypeScript 6 |
| Routing | TanStack Router |
| Styling | Tailwind CSS v4 with application design tokens |
| Animation | Motion for React |
| Icons | React Icons |
| Frontend build | Vite 8 |
| Backend | Java 17, Spring Boot 3.5 |
| Persistence | Spring Data JPA, PostgreSQL 15 |
| Validation | Spring Validation |
| Local development | Docker Compose |
| Backend build | Maven |
| Frontend quality | TypeScript compiler and ESLint |
| Security | JWT and role-based authorization planned |

---

## Feature Status

| Module | Status |
| --- | --- |
| Backend Product CRUD | Done |
| Backend Supplier CRUD | Done |
| Product-supplier relationship | Done |
| Backend product search | Done |
| Backend supplier search | Done |
| Workspace onboarding UI | Done |
| Onboarding persistence abstraction | Done |
| Setup/application route protection | Done |
| Runtime branding and theme | Done |
| Responsive application shell | Done |
| Dashboard repository and domain model | Done |
| Dashboard view-model layer | Done |
| Dashboard UI with mock data | Done |
| New Products frontend | In progress |
| New Suppliers frontend | In progress |
| Dashboard backend endpoint | Planned |
| Backend workspace persistence | Planned |
| Authentication and roles | Planned |
| Purchase-order workflow | Planned |
| Stock movement workflow | Planned |
| Multi-location inventory | Planned |
| Audit logs | Planned |

---

## Product Module

The backend Product module manages the inventory catalogue and acts as the principal template for full-stack business features.

### Backend implemented

- product entity;
- product request and response DTOs;
- product mapper;
- product repository;
- product service;
- supplier lookup during product creation and update;
- product controller;
- search by product data;
- product-to-supplier relationship;
- create, read, update, and delete endpoints.

### Frontend objective

The redesigned Product page will be rebuilt inside:

```text
src/features/products/
```

It will eventually include:

- searchable and paginated product table;
- clear stock status;
- create and edit workflows;
- supplier assignment;
- low-stock threshold configuration;
- purchase-price fields based on workspace settings;
- barcode actions when enabled;
- product detail and inventory-movement history.

### Product-supplier relationship

```text
Supplier 1 ──▶ many Products
```

Database relation:

```text
products.supplier_id → suppliers.id
```

The frontend sends `supplierId`. The backend resolves the entity and returns clean response properties such as `supplierId` and `supplierName`.

---

## Supplier Module

The backend Supplier module manages procurement partners.

### Backend implemented

- supplier entity;
- repository search methods;
- supplier service interface;
- service implementation;
- request and response DTOs;
- mapper layer;
- not-found exception;
- REST controller;
- create, read, update, delete, and search endpoints.

### Frontend objective

The redesigned Supplier page will eventually include:

- searchable and paginated supplier table;
- supplier details;
- contact information;
- connected products;
- open purchase orders;
- delivery and performance indicators;
- create and edit workflows.

---

## API Endpoints

### Products

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/products` | Get products |
| `GET` | `/api/products?search={term}` | Search products |
| `GET` | `/api/products/{id}` | Get one product |
| `POST` | `/api/products` | Create a product |
| `PUT` | `/api/products/{id}` | Update a product |
| `DELETE` | `/api/products/{id}` | Delete a product |

Example payload:

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

### Suppliers

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/suppliers` | Get suppliers |
| `GET` | `/api/suppliers?search={term}` | Search suppliers |
| `GET` | `/api/suppliers/{id}` | Get one supplier |
| `POST` | `/api/suppliers` | Create a supplier |
| `PUT` | `/api/suppliers/{id}` | Update a supplier |
| `DELETE` | `/api/suppliers/{id}` | Delete a supplier |

Example payload:

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

## Purchase Order Objective

The planned purchase-order lifecycle is:

```text
DRAFT
  → SUBMITTED
      ├── APPROVED
      │      └── RECEIVED
      └── REJECTED
```

This module will connect:

- suppliers;
- products;
- line items;
- expected delivery dates;
- approval rules;
- stock receipts;
- inventory movements;
- audit events.

---

## Planned Roles and Permissions

| Action | Admin | Manager | Staff | Viewer |
| --- | :---: | :---: | :---: | :---: |
| View inventory | Yes | Yes | Yes | Yes |
| Create or edit products | Yes | Yes | Limited | No |
| Manage suppliers | Yes | Yes | No | No |
| Create purchase orders | Yes | Yes | Yes | No |
| Approve or reject orders | Yes | Yes | No | No |
| View audit logs | Yes | Limited | No | No |
| Manage workspace users | Yes | No | No | No |

The exact permission model will be refined when authentication and the purchase-order domain are implemented.

---

## Project Structure

```text
StockFlow/
├── backend/
│   ├── src/main/java/com/stockflow/
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
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── router/
│   │   ├── features/
│   │   │   ├── dashboard/
│   │   │   │   ├── api/
│   │   │   │   ├── components/
│   │   │   │   ├── types/
│   │   │   │   └── utils/
│   │   │   └── onboarding/
│   │   │       ├── api/
│   │   │       ├── components/
│   │   │       ├── config/
│   │   │       ├── context/
│   │   │       ├── types/
│   │   │       └── utils/
│   │   ├── layouts/
│   │   │   ├── AppLayout.tsx
│   │   │   └── AppSidebar.tsx
│   │   ├── routes/
│   │   │   ├── _app/
│   │   │   └── setup/
│   │   ├── shared/
│   │   │   └── components/
│   │   ├── index.css
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── database/
├── docs/
├── docker-compose.yml
└── README.md
```

---

## Getting Started

### Prerequisites

- Java 17 or newer
- Maven or the included Maven wrapper
- Node.js `20.19+` or `22.12+`
- Docker and Docker Compose

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/stockflow.git
cd stockflow
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

The local PostgreSQL instance uses the configuration defined in `docker-compose.yml`.

### 3. Start the backend

```bash
cd backend
./mvnw spring-boot:run
```

Default backend address:

```text
http://localhost:8080
```

### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Default frontend address:

```text
http://localhost:5173
```

### Frontend quality checks

```bash
npm run lint
npm run build
```

### Reset the local frontend workspace

During frontend-only development, onboarding state is stored under `stockflow.onboarding`.

To restart setup, run this in the browser console:

```js
localStorage.removeItem('stockflow.onboarding');
location.reload();
```

This local persistence is temporary and will be replaced by backend workspace persistence.

---

## Development Roadmap

### Phase 1 — Backend catalogue foundation

- [x] Product CRUD
- [x] Supplier CRUD
- [x] Product-supplier relationship
- [x] Product and supplier search
- [x] DTO and mapper boundaries
- [x] Global API exception handling

### Phase 2 — Frontend workspace foundation

- [x] Feature-based frontend structure
- [x] TanStack Router integration
- [x] Workspace onboarding
- [x] Setup persistence abstraction
- [x] Setup and application route guards
- [x] Runtime branding and color mode
- [x] Responsive application shell
- [x] Dashboard repository and view-model architecture
- [x] Dashboard mock interface

### Phase 3 — Reconnect core frontend modules

- [ ] Product feature architecture
- [ ] Product table, forms, details, and backend integration
- [ ] Supplier feature architecture
- [ ] Supplier table, forms, details, and backend integration
- [ ] Search and pagination
- [ ] Shared API error and validation UX
- [ ] Dashboard real-data endpoint

### Phase 4 — Backend workspace and security

- [ ] Workspace and organization entities
- [ ] Persist onboarding configuration in PostgreSQL
- [ ] Authentication
- [ ] JWT access and refresh flow
- [ ] Protected API endpoints
- [ ] Roles and permissions
- [ ] Real team invitation tokens

### Phase 5 — Inventory operations

- [ ] Stock receipt workflow
- [ ] Stock removal workflow
- [ ] Manual adjustment workflow
- [ ] Movement history
- [ ] Barcode workflows
- [ ] Low-stock thresholds and alerts
- [ ] Multi-location inventory

### Phase 6 — Procurement

- [ ] Purchase orders
- [ ] Purchase-order line items
- [ ] Submission and approval workflow
- [ ] Order receiving
- [ ] Supplier performance indicators

### Phase 7 — Production readiness

- [ ] Audit logging
- [ ] Automated backend tests
- [ ] Frontend component and integration tests
- [ ] Dockerized production environment
- [ ] GitHub Actions CI/CD
- [ ] Deployment documentation
- [ ] Screenshots and product demo

---

## Why This Project Exists

StockFlow is being built to demonstrate more than framework syntax.

The project is intended to show the ability to:

- define and evolve a real product direction;
- design backend boundaries and relational models;
- organize a frontend around business features;
- separate raw data from presentation logic;
- build setup-driven application behavior;
- design usable empty, loading, ready, and error states;
- make architecture choices that remain replaceable as the project grows;
- create a coherent user experience across onboarding, navigation, dashboards, and operational workflows.

---

## Author

Built by **YetAnotherFactsEnjoyer**

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/YetAnotherFactsEnjoyer)

---

<div align="center">
<sub>Built with Java, Spring Boot, React, TypeScript, PostgreSQL, Tailwind CSS, TanStack Router, and Docker</sub>
</div>

