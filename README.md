# StockFlow

**StockFlow** is a full-stack inventory and procurement management platform built with **Spring Boot, React, Tailwind CSS, and PostgreSQL**.  
It is designed to help businesses manage products, suppliers, stock levels, and purchase orders through a modern dashboard.

> 🚧 This project is currently in development and is being built progressively as a portfolio project for full-stack roles.

---

## Features

### Current / Planned Features
- Product management
- Supplier management
- Inventory tracking
- Purchase order workflow
- Role-based authentication and authorization
- Dashboard analytics
- Search, filters, and pagination
- Audit logs and activity tracking
- Responsive admin interface

---

## Tech Stack

### Frontend
- React
- Tailwind CSS
- JavaScript / TypeScript

### Backend
- Java
- Spring Boot
- Spring Security
- Spring Data JPA

### Database
- PostgreSQL

### Tools
- Git & GitHub
- Maven
- Docker
- Postman

---

## Project Goal

The goal of StockFlow is to simulate a real-world business application and demonstrate strong full-stack development skills, including:

- REST API design
- relational database modeling
- secure authentication
- clean frontend architecture
- business workflow implementation
- scalable project structure

This project is being built with a portfolio-first mindset to reflect the type of full-stack applications used in real companies.

---

## Core Modules

### 1. Product Management
Manage product records with key inventory details such as:
- name
- SKU
- category
- stock quantity
- reorder threshold
- supplier association

### 2. Supplier Management
Track supplier information and connect suppliers to products.

### 3. Inventory Tracking
Monitor stock levels and manage stock updates through incoming orders.

### 4. Purchase Orders
Create and manage purchase orders with status-based workflows such as:
- Draft
- Submitted
- Approved
- Rejected
- Received

### 5. Authentication & Roles
Secure the application with authentication and role-based access:
- Admin
- Manager
- Staff

### 6. Dashboard & Analytics
Provide business insights through:
- total products
- low-stock items
- pending purchase orders
- recent activity

### 7. Audit Logs
Track important actions performed inside the system for better visibility and accountability.

---

## Architecture Overview

StockFlow follows a classic full-stack architecture:

- **React frontend** for the user interface
- **Spring Boot backend** for business logic and REST APIs
- **PostgreSQL database** for persistent data storage

### High-level flow
`Frontend (React) -> REST API (Spring Boot) -> PostgreSQL`

---

## Project Structure

```bash
stockflow/
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── ...
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
├── docs/
│   ├── er-diagram.png
│   ├── architecture.png
│   └── ...
└── README.md
