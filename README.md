# Shared Calendar Backend

A robust backend API for a shared calendar application, built with Node.js, Express, and TypeScript. This project uses Hexagonal Architecture to ensure modularity, testability, and maintainability.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication (Login, Register, Profile).
- **Calendar Management**: Create, read, update, and delete calendars.
- **Sharing Capabilities**: Logic to handle shared calendars between users.
- **Architecture**: Clean separation of concerns using Hexagonal/Layered architecture.
- **Fail-Fast**: Server startup validation for database connectivity.

## 🛠️ Technologies

- **Runtime**: [Node.js](https://nodejs.org/) (v24.13.0)
- **Framework**: [Express.js](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: JWT & BCrypt

## 📋 Prerequisites

Ensure you have the following installed:
- **Node.js**: Version 24 or higher (check `.nvmrc`).
- **npm**: Comes with Node.js.
- **PostgreSQL**: Local or cloud instance.

## ⚙️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd shared-calendar-backend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory. You can copy the structure:
    ```bash
    cp .env.example .env
    ```
    Ensure you define the following:
    ```env
    PORT=4000
    DATABASE_URL="postgresql://user:password@localhost:5432/shared_calendar_db?schema=public"
    JWT_SECRET="your_very_secure_secret_key"
    ```

4.  **Database Setup**
    Run Prisma migrations to create the database schema:
    ```bash
    npx prisma migrate dev
    ```

## 🏃‍♂️ Usage Scripts

- **Development Server**: Runs the server with hot-reload.
    ```bash
    npm run dev
    ```
- **Build**: Compiles TypeScript to JavaScript in `dist/`.
    ```bash
    npm run build
    ```
- **Start Production**: Runs the compiled code.
    ```bash
    npm start
    ```
- **Tests**: Run the test suite.
    ```bash
    npm test
    ```

## 🏗️ Project Structure

The project follows a Hexagonal (Ports & Adapters) architectural style to separate core business logic from external frameworks.

```
src/
├── api/             # Primary Adapters (Entry points)
│   ├── controllers/ # Request handlers
│   ├── middleware/  # Express middlewares
│   └── routes/      # API definitions
├── core/            # Hexagon (Business Logic)
│   ├── dto/         # Data Transfer Objects
│   ├── entities/    # Domain Objects
│   ├── interfaces/  # Ports (Repository interfaces)
│   └── services/    # Business rules (Use cases)
├── infrastructure/  # Secondary Adapters (Implementations)
│   └── repositories/# Prisma implementations of interfaces
├── utils/           # Shared utilities
└── server.ts        # Application entry point
```

## 🩺 System Health

- **Health Check**: `GET /health` - Verifies API and Database status.
- **Startup Protection**: The server will fail to start if the database connection cannot be established.
