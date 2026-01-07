```markdown
# Secure Content Management Workspace - Backend API

This is the server-side application for the **Content Management Workspace**. It provides a secure, scalable REST API designed with a modular architecture, featuring JWT authentication, OTP verification, and strict Role-Based Access Control (RBAC).

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Key Features & Security](#-key-features--security)
- [Setup & Run Instructions](#-setup--run-instructions)
- [API Endpoints](#-api-endpoints)

## 🛠️ Tech Stack

* **Runtime:** Node.js & Express
* **Language:** TypeScript
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Authentication:** JWT (Access + Refresh Tokens), Bcrypt
* **Email Service:** Nodemailer (for OTP)
* **Validation:** Zod
* **Logging:** Custom Logger

## 🏗️ Architecture

The backend follows a **Modular Layered Architecture** to ensure separation of concerns and scalability.

```text
src/
├── modules/           # Feature-based separation
│   └── article/
│       ├── controller/  # Handles HTTP requests/responses
│       ├── service/     # Business logic & permissions
│       ├── validation/  # Zod schemas
│       └── routes/      # Endpoint definitions
├── repository/        # Data Access Layer (Direct Prisma/DB calls)
├── middlewares/       # Auth guards & Request validation
├── config/            # Database & Prisma configuration
└── constants/         # Environment variables and Enums

```

> **Core Principle:** `Controller` → `Service` → `Repository`
> Controllers never interact with the database directly; they rely on Services for business logic, which in turn use Repositories for data access.

## 🛡️ Key Features & Security

### 1. RBAC (Role-Based Access Control)

| Role | Permissions |
| --- | --- |
| **Admin** | Full access to all resources (Create, Read, Update, Delete). |
| **Editor** | Can create articles and edit *only* their own articles. |
| **Viewer** | Read-only access to published articles. |

### 2. Dual Token System

* **Access Tokens:** Short-lived (15 min) JWTs for authorized API requests.
* **Refresh Tokens:** Long-lived (7 days), database-backed tokens for secure session maintenance and revocation capabilities.

### 3. OTP Verification

* **Flow:** User Register → Email Sent → Verify OTP → Active Account.
* **Security:** OTP codes are hashed in the database (never stored in plain text).

## 🚀 Setup & Run Instructions

### 1. Prerequisites

* **Node.js** (v18+)
* **PostgreSQL Database** (Local instance or Cloud provider like Neon/Supabase)

### 2. Installation

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install

```

### 3. Environment Configuration

Create a `.env` file in the root directory and populate it with your secrets:

```env
PORT=3000
NODE_ENV=development

# Database Connection
DATABASE_URL="postgresql://user:pass@host:port/db?schema=public"
# If using Supabase Transaction pooler, add DIRECT_URL for migrations
DIRECT_URL="postgresql://user:pass@host:port/db?schema=public"

# Security Secrets (Use strong, random strings)
JWT_SECRET="your_jwt_secret_key"
JWT_REFRESH_SECRET="your_refresh_secret_key"

# Email Configuration (Nodemailer)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your_email@gmail.com"
SMTP_PASS="your_app_password" 
FROM_EMAIL="noreply@workspace.com"

# Frontend URL (for email links)
FRONTEND_URL="http://localhost:5173"

```

### 4. Database Setup

Run the Prisma migrations to create the tables in your database:

```bash
npx prisma migrate dev --name init

```

### 5. Start Server

* **Development (with Hot Reload):**
```bash
npm run dev

```


* **Production Build:**
```bash
npm run build
npm start

```



## 📚 API Endpoints

### Auth

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/v1/auth/register` | Register new user (triggers OTP email) |
| `POST` | `/api/v1/auth/verify-email` | Verify OTP code |
| `POST` | `/api/v1/auth/login` | Login (Returns Access + Refresh Token) |
| `POST` | `/api/v1/auth/refresh` | Obtain new Access Token using Refresh Token |

### Articles

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `GET` | `/api/v1/articles` | List all articles | Public |
| `POST` | `/api/v1/articles` | Create article | Admin, Editor |
| `PUT` | `/api/v1/articles/:id` | Update article | Admin, Owner |
| `DELETE` | `/api/v1/articles/:id` | Delete article | Admin |

*Developed for the Bxtrack Interview Assessment.*

```

```
