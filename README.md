# Noviq API — Comprehensive Project Documentation

> **Project Codename:** `lin-v2`  
> **Version:** `0.0.1`  
> **License:** UNLICENSED (Private)  
> **Last Updated:** 2026-07-23

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Architecture & Design Philosophy](#3-architecture--design-philosophy)
4. [Complete Folder Structure](#4-complete-folder-structure)
5. [Core Layer (`src/core`)](#5-core-layer-srccore)
6. [Common Layer (`src/common`)](#6-common-layer-srccommon)
7. [Infrastructure Layer (`src/infrastructure`)](#7-infrastructure-layer-srcinfrastructure)
8. [Business Modules (`src/modules`)](#8-business-modules-srcmodules)
9. [Shared Layer (`src/shared`)](#9-shared-layer-srcshared)
10. [Application Bootstrap & Entry Point](#10-application-bootstrap--entry-point)
11. [API Routing & Endpoints](#11-api-routing--endpoints)
12. [Configuration & Environment](#12-configuration--environment)
13. [Authentication & Authorization](#13-authentication--authorization)
14. [Database Schema](#14-database-schema)
15. [Caching Strategy](#15-caching-strategy)
16. [Job Queue System](#16-job-queue-system)
17. [File Storage (S3)](#17-file-storage-s3)
18. [Logging System](#18-logging-system)
19. [Error Handling](#19-error-handling)
20. [Rate Limiting & Security](#20-rate-limiting--security)
21. [Swagger API Documentation](#21-swagger-api-documentation)
22. [Testing Strategy](#22-testing-strategy)
23. [DevOps & Deployment](#23-devops--deployment)
24. [Development Roadmap (Todo)](#24-development-roadmap-todo)
25. [Quick Reference — All Environment Variables](#25-quick-reference--all-environment-variables)

---

## 1. Project Overview

**Noviq** is a comprehensive educational platform designed to connect students and teachers. The platform enables users to share notes and learning materials, enroll in courses, study collaboratively, and enhance their overall learning experience. This repository (`noviq-api`) is the **backend API** that powers the entire Noviq ecosystem.

### Core Purpose

- Provide a secure, scalable REST API for the Noviq learning platform.
- Manage user identities, authentication, and authorization.
- Serve as the central hub for course management, content delivery, and communication.
- Handle background processing (emails, notifications) via job queues.
- Store and serve user-uploaded content (notes, materials, media) via cloud storage.

### Key Design Goals

- **Modular Architecture**: clear separation of concerns — each feature module owns its full vertical slice (domain, application, infrastructure, presentation).
- **Infrastructure Abstraction**: technical adapters (database, cache, queue, storage) are isolated in the infrastructure layer so business modules don't couple to specific implementations.
- **Production-Ready**: structured logging, health checks, rate limiting, global error handling, and environment-based configuration from day one.
- **Testable**: Jest-based unit and e2e testing with testcontainers for real infrastructure verification.

---

## 2. Technology Stack

### Runtime & Language

| Category        | Technology | Version |
| --------------- | ---------- | ------- |
| Runtime         | Node.js    | 22.x    |
| Language        | TypeScript | 5.7.3   |
| Framework       | NestJS     | 11.x    |
| Package Manager | npm        | —       |

### Email

| Package       | Purpose                    |
| ------------- | -------------------------- |
| `nodemailer`  | SMTP email sending         |

### Core Framework Dependencies

| Package                      | Purpose                                 |
| ---------------------------- | --------------------------------------- |
| `@nestjs/core`               | NestJS runtime core                     |
| `@nestjs/common`             | Decorators, pipes, guards, interceptors |
| `@nestjs/config`             | Environment-based configuration         |
| `@nestjs/platform-express`   | HTTP server (Express adapter)           |
| `@nestjs/swagger`            | OpenAPI / Swagger documentation         |
| `@nestjs/terminus`           | Health check endpoints                  |
| `@nestjs/throttler`          | Rate limiting                           |
| `@nestjs/schedule`           | Cron job scheduling                     |
| `@nestjs/passport`           | Authentication strategy integration     |
| `@nestjs/jwt`                | JWT token generation & verification     |
| `@nestjs/typeorm`            | TypeORM integration for NestJS          |
| `@nestjs/bullmq`             | BullMQ job queue integration            |
| `@nestjs/platform-socket.io` | WebSocket support                       |
| `@nestjs/websockets`         | WebSocket gateway decorators            |

### Database & Caching

| Package            | Purpose                              |
| ------------------ | ------------------------------------ |
| `typeorm` (0.3.30) | ORM for database operations          |
| `pg`               | PostgreSQL driver                    |
| `ioredis`          | Redis client (cache + queue backend) |
| `bullmq`           | Job queue library (backed by Redis)  |

### Security

| Package                                                 | Purpose                   |
| ------------------------------------------------------- | ------------------------- |
| `bcrypt`                                                | Password hashing          |
| `passport` + `passport-jwt` + `passport-google-oauth20` | Authentication strategies |
| `helmet`                                                | HTTP security headers     |
| `cookie-parser`                                         | Cookie parsing middleware |

### Storage & Cloud

| Package                         | Purpose                    |
| ------------------------------- | -------------------------- |
| `@aws-sdk/client-s3`            | AWS S3 client SDK          |
| `@aws-sdk/lib-storage`          | Multipart S3 uploads       |
| `@aws-sdk/s3-request-presigner` | Signed URL generation      |
| `google-auth-library`           | Google OAuth2 verification |

### Logging & Observability

| Package                     | Purpose                      |
| --------------------------- | ---------------------------- |
| `winston`                   | Structured logging framework |
| `winston-daily-rotate-file` | Log rotation by date         |
| `nest-winston`              | NestJS-Winston integration   |

### Validation & Transformation

| Package             | Purpose                       |
| ------------------- | ----------------------------- |
| `class-validator`   | DTO validation decorators     |
| `class-transformer` | Plain-to-class transformation |
| `multer`            | File upload handling          |

### Development Tools

| Package                                                | Purpose                             |
| ------------------------------------------------------ | ----------------------------------- |
| `@nestjs/cli`                                          | NestJS project scaffolding          |
| `@swc/core` + `@swc/cli`                               | Fast TypeScript compilation         |
| `eslint` (9.x)                                         | Linting (flat config)               |
| `prettier`                                             | Code formatting                     |
| `jest`                                                 | Test runner                         |
| `ts-jest`                                              | TypeScript transformation for Jest  |
| `supertest`                                            | HTTP assertion for e2e tests        |
| `@testcontainers/postgresql` + `@testcontainers/redis` | Real DB/Redis for integration tests |
| `jest-mock-extended`                                   | Type-safe mocking                   |
| `nock`                                                 | HTTP request interception           |
| `@faker-js/faker`                                      | Test data generation                |

---

## 3. Architecture & Design Philosophy

### Layered Modular Architecture

The codebase follows a **layered modular monolith** pattern. Each layer has a specific responsibility, and modules within layers own their full vertical slice.

```
                    ┌──────────────────────────┐
                    │       src/main.ts        │  ← Entry point
                    └────────────┬─────────────┘
                                 │
                    ┌────────────▼─────────────┐
                    │   src/app.module.ts      │  ← Root module (wires everything)
                    └────────────┬─────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
   ┌──────▼──────┐     ┌────────▼────────┐     ┌───────▼───────┐
   │    core/    │     │ infrastructure/ │     │   modules/    │
   │  (config,   │     │  (technical     │     │  (business    │
   │  bootstrap, │     │   adapters)     │     │   features)   │
   │  swagger)   │     │                 │     │               │
   └──────┬──────┘     └────────┬────────┘     └───────┬───────┘
          │                      │                      │
   ┌──────▼──────┐              │              ┌───────▼───────┐
   │   common/   │              │              │   shared/     │
   │ (reusable   │◄─────────────┼──────────────► (cross-       │
   │  artifacts) │              │              │  module)      │
   └─────────────┘              │              └───────────────┘
                                │
         ┌──────────────────────┼──────────────────────┐
         │                      │                      │
   ┌─────▼─────┐    ┌──────────▼──────────┐    ┌──────▼──────┐
   │ Database  │    │  Cache / Redis       │    │  Storage    │
   │ (Postgres)│    │                      │    │  (AWS S3)   │
   └───────────┘    └─────────────────────┘    └─────────────┘
```

### Module Internal Structure

Each feature module inside `src/modules/` follows a **DDD-inspired** folder structure:

```
modules/<feature>/
  ├── application/      # Use cases, application services
  ├── domain/           # Entities, value objects, domain services
  ├── infrastructure/   # Feature-specific technical adapters
  └── presentation/     # Controllers, DTOs (the HTTP layer)
```

### Key Architectural Principles

1. **Separation of Concerns**: Infrastructure adapters are isolated from business logic. A business module never imports an S3 client directly — it goes through `S3StorageService`.

2. **Global-by-Default for Cross-Cutting Concerns**: `CoreModule` registers global filters, guards, and pipes so every module gets them automatically.

3. **Convention over Configuration**: Environment variables follow a naming convention (e.g., `DATABASE_HOST`, `REDIS_HOST`), and sensible defaults exist for development.

4. **Fail-Fast on Misconfiguration**: Production environments require explicit secrets (JWT keys, AWS credentials) — the app refuses to start without them.

5. **Token Type Safety**: JWT tokens carry a `type` claim (`access` or `refresh`) and the verifier rejects mismatches — a refresh token cannot be used where an access token is expected.

---

## 4. Complete Folder Structure

```
noviq-api/
│
├── .claude/                          # Claude Code configuration
│   └── settings.local.json           #   Local permission allowlists
│
├── .git/                             # Git repository metadata
│
├── coverage/                         # Test coverage reports (generated)
│   ├── clover.xml
│   ├── coverage-final.json
│   ├── lcov.info
│   └── lcov-report/                  #   HTML coverage report
│
├── dist/                             # Compiled output (generated by build)
│
├── docs/                             # Project documentation
│   └── PROJECT_DOCUMENTATION.md      #   This file
│
├── logs/                             # Runtime log files (generated)
│   ├── application-YYYY-MM-DD.log    #   Application-level logs
│   ├── error-YYYY-MM-DD.log          #   Error-level logs
│   └── .*-audit.json                 #   Audit trail files
│
├── node_modules/                     # Installed dependencies (generated)
│
├── src/                              # █████████ SOURCE CODE █████████
│   │
│   ├── main.ts                       #   Application entry point
│   ├── app.module.ts                 #   Root NestJS module
│   ├── README.md                     #   Source layout documentation
│   │
│   ├── core/                         #   ── CORE LAYER ──
│   │   ├── core.module.ts            #     Process-wide setup module
│   │   ├── bootstrap/
│   │   │   └── app.bootstrap.ts      #     App-wide middleware & pipes
│   │   ├── config/
│   │   │   └── env.utils.ts          #     Env parsing helpers
│   │   └── swagger/
│   │       └── swagger.config.ts     #     Swagger/OpenAPI setup
│   │
│   ├── common/                       #   ── COMMON LAYER ──
│   │   ├── constants/
│   │   │   └── app.constants.ts      #     App-wide constant values
│   │   ├── decorators/               #     Custom decorators (stub)
│   │   ├── dto/
│   │   │   └── pagination-query.dto.ts  # Reusable pagination DTO
│   │   ├── exceptions/               #     Custom exceptions (stub)
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts # Global exception filter
│   │   ├── guards/                   #     Shared guards (stub)
│   │   ├── interceptors/             #     Shared interceptors (stub)
│   │   ├── middleware/               #     Shared middleware (stub)
│   │   ├── pipes/                    #     Shared pipes (stub)
│   │   ├── types/                    #     Shared TypeScript types (stub)
│   │   └── utils/                    #     Shared utility functions (stub)
│   │
│   ├── infrastructure/               #   ── INFRASTRUCTURE LAYER ──
│   │   ├── infrastructure.module.ts  #     Aggregator module
│   │   │
│   │   ├── database/                 #     PostgreSQL / TypeORM
│   │   │   ├── database.module.ts
│   │   │   └── services/
│   │   │       └── database.service.ts
│   │   │
│   │   ├── cache/                    #     Redis caching
│   │   │   ├── cache.module.ts
│   │   │   ├── constants/
│   │   │   │   └── cache.constants.ts
│   │   │   ├── redis/
│   │   │   │   └── redis.ts          #     Redis connection provider
│   │   │   └── services/
│   │   │       ├── cache.service.ts
│   │   │       └── cache-key.service.ts
│   │   │
│   │   ├── logging/                  #     Winston logging
│   │   │   ├── logging.module.ts
│   │   │   ├── config/
│   │   │   │   ├── logging.config.ts
│   │   │   │   └── logging.config.spec.ts
│   │   │   └── constants/
│   │   │       └── logging.constants.ts
│   │   │
│   │   ├── queue/                    #     BullMQ job queue
│   │   │   ├── queue.module.ts
│   │   │   ├── config/
│   │   │   │   ├── queue.config.ts
│   │   │   │   └── queue.config.spec.ts
│   │   │   ├── constants/
│   │   │   │   └── queue.constants.ts
│   │   │   ├── services/
│   │   │   │   ├── queue.service.ts
│   │   │   │   └── queue.service.spec.ts
│   │   │   └── types/
│   │   │       └── queue-job.type.ts
│   │   │
│   │   ├── security/                 #     Authentication & tokens
│   │   │   ├── index.ts              #       Barrel export
│   │   │   └── jwt/
│   │   │       ├── jwt.module.ts
│   │   │       ├── config/
│   │   │       │   └── jwt.config.ts
│   │   │       ├── constants/
│   │   │       │   └── jwt.constants.ts
│   │   │       ├── services/
│   │   │       │   ├── token.service.ts
│   │   │       │   └── token.service.spec.ts
│   │   │       └── types/
│   │   │           ├── jwt-config.type.ts
│   │   │           ├── jwt-payload.type.ts
│   │   │           ├── jwt-token-type.type.ts
│   │   │           └── token-pair.type.ts
│   │   │
│   │   ├── storage/                  #     AWS S3 file storage
│   │   │   ├── storage.module.ts
│   │   │   ├── config/
│   │   │   │   ├── s3.config.ts
│   │   │   │   └── s3.config.spec.ts
│   │   │   ├── constants/
│   │   │   │   └── storage.constants.ts
│   │   │   ├── providers/
│   │   │   │   └── s3.provider.ts
│   │   │   ├── services/
│   │   │   │   ├── s3-storage.service.ts
│   │   │   │   └── s3-storage.service.spec.ts
│   │   │   └── types/
│   │   │       ├── s3-storage-config.type.ts
│   │   │       ├── storage-object.type.ts
│   │   │       └── upload-options.type.ts
│   │   │
│   │   ├── mail/                     #     Email sending & templates
│   │   │   ├── mail.module.ts
│   │   │   ├── config/
│   │   │   │   └── mail.config.ts
│   │   │   ├── constants/
│   │   │   │   └── mail.constants.ts
│   │   │   ├── processors/
│   │   │   │   └── email.processor.ts
│   │   │   ├── services/
│   │   │   │   ├── email-sender.service.ts
│   │   │   │   └── mail-template.service.ts
│   │   │   ├── templates/
│   │   │   │   ├── index.ts
│   │   │   │   ├── base.template.ts
│   │   │   │   ├── welcome.template.ts
│   │   │   │   ├── password-reset.template.ts
│   │   │   │   └── email-verification.template.ts
│   │   │   └── types/
│   │   │       ├── email-names.type.ts
│   │   │       ├── mail-config.type.ts
│   │   │       ├── mail-template.type.ts
│   │   │       └── send-email-options.type.ts
│   │   └── telemetry/                #     Observability (stub)
│   │
│   ├── modules/                      #   ── BUSINESS MODULES ──
│   │   │
│   │   ├── auth/                     #     Authentication
│   │   │   ├── auth.module.ts
│   │   │   ├── application/          #       Use cases (stub)
│   │   │   ├── domain/               #       Domain models (stub)
│   │   │   ├── infrastructure/       #       Adapters (stub)
│   │   │   ├── presentation/         #       Controllers/DTOs (stub)
│   │   │   ├── guards/
│   │   │   │   └── jwt-auth.guard.ts
│   │   │   └── strategies/
│   │   │       └── jwt.strategy.ts
│   │   │
│   │   ├── users/                    #     User management
│   │   │   ├── users.module.ts
│   │   │   ├── application/          #       Use cases (stub)
│   │   │   ├── domain/
│   │   │   │   ├── index.ts          #         Barrel export
│   │   │   │   └── entities/
│   │   │   │       └── user.entity.ts
│   │   │   ├── infrastructure/       #       Adapters (stub)
│   │   │   └── presentation/
│   │   │       └── controller/
│   │   │           └── users.controller.ts
│   │   │
│   │   └── health/                   #     Health monitoring
│   │       ├── health.module.ts
│   │       └── presentation/
│   │           ├── controllers/
│   │           │   └── health.controller.ts
│   │           └── dto/
│   │               └── health-check.response.ts
│   │
│   └── shared/                       #   ── SHARED LAYER ──
│       └── .gitkeep                  #     Cross-module providers (stub)
│
├── storage/                          # Alternative log storage location
│   └── logs/                         #   Rotated log files
│
├── test/                             # End-to-end tests
│   ├── app.e2e-spec.ts               #   Health check e2e test
│   └── jest-e2e.json                 #   Jest config for e2e
│
├── .dockerignore                     # Docker build exclusions (empty)
├── .env                              # Default environment variables
├── .env.development.local            # Development overrides (empty)
├── .env.local                        # Local overrides (empty)
├── .env.production.local             # Production overrides (empty)
├── .env.test.local                   # Test overrides (empty)
├── .gitignore                        # Git exclusion rules
├── .prettierrc                       # Prettier formatting config
├── docker-compose.yml                # Docker Compose config (empty)
├── Dockerfile                        # Container build definition (empty)
├── eslint.config.mjs                 # ESLint flat config
├── nest-cli.json                     # NestJS CLI configuration
├── package.json                      # Project metadata & dependencies
├── package-lock.json                 # Locked dependency tree
├── README.md                         # Project README
├── todo.md                           # Development roadmap
├── tsconfig.json                     # TypeScript compiler config
└── tsconfig.build.json               # TypeScript build config (excludes tests)
```

---

## 5. Core Layer (`src/core`)

The **Core Layer** is responsible for process-wide, cross-cutting configuration that applies to the entire application regardless of which business module is being accessed.

### 5.1 `CoreModule` (`core.module.ts`)

This is the foundation module that sets up three critical systems:

#### ConfigModule

- **Global**: Available to all modules without importing.
- **Cached**: Prevents repeated file reads for the same config key.
- **Environment File Loading**: Uses `getEnvFilePaths()` which loads files in this order:
  1. `.env.{NODE_ENV}` (e.g., `.env.development`)
  2. `.env` (fallback)
- Later files override earlier ones.

#### ScheduleModule

- Enables `@Cron()` and `@Interval()` decorators.
- Used for periodic background tasks (health checks, cleanup jobs, etc.).

#### ThrottlerModule

- **Rate Limiter**: Protects against brute force and DoS.
- **Default TTL**: `60,000 ms` (1 minute window).
- **Default Limit**: `100` requests per window.
- Configured via `THROTTLE_TTL` and `THROTTLE_LIMIT` environment variables.

#### Global Providers

| Provider              | Scope        | Purpose                            |
| --------------------- | ------------ | ---------------------------------- |
| `AllExceptionsFilter` | `APP_FILTER` | Catches every unhandled exception  |
| `ThrottlerGuard`      | `APP_GUARD`  | Enforces rate limits on all routes |

> **Note**: A global `AuthGuard` is commented out and ready to be activated once auth is fully implemented.

### 5.2 Bootstrap Helpers (`bootstrap/app.bootstrap.ts`)

The `configureApplication()` function applies middleware and pipes globally:

```typescript
function configureApplication(app: INestApplication): void;
```

**What it does:**

| Setting                 | Value                                                          | Rationale                                                   |
| ----------------------- | -------------------------------------------------------------- | ----------------------------------------------------------- |
| `enableShutdownHooks()` | —                                                              | Graceful shutdown on SIGTERM/SIGINT                         |
| `helmet()`              | CSP disabled                                                   | Security headers without breaking Swagger UI                |
| `cookieParser()`        | —                                                              | Parse cookies for auth flows                                |
| `enableCors()`          | `credentials: true, origin: true`                              | Allow credentialed cross-origin requests                    |
| `ValidationPipe`        | `whitelist: true, forbidNonWhitelisted: true, transform: true` | Strip unknown properties, reject them, auto-transform types |

### 5.3 Environment Utilities (`config/env.utils.ts`)

Three pure helper functions used throughout the codebase:

| Function            | Signature                      | Behavior                                             |
| ------------------- | ------------------------------ | ---------------------------------------------------- |
| `getEnvFilePaths()` | `() => string[]`               | Returns `[.env.{NODE_ENV}, .env]`                    |
| `toNumber()`        | `(value, fallback) => number`  | Parses numeric env var, returns fallback if invalid  |
| `toBoolean()`       | `(value, fallback) => boolean` | Parses `"true"/"1"/true`, returns fallback otherwise |

### 5.4 Swagger Configuration (`swagger/swagger.config.ts`)

Sets up OpenAPI documentation at the `/docs` endpoint.

**Configuration:**

- **Title**: "Noviq-api"
- **Description**: "Noviq single place to manage your entire life"
- **Version**: "1.0"
- **Auth**: Bearer JWT scheme named `access-token`
- **URL**: `/docs`

**Features:**

- Custom dark theme (12 CSS rules for full dark-mode Swagger UI)
- Request duration display
- Methods sorted alphabetically (GET, POST, PUT, DELETE...)
- Tags sorted alphabetically
- Persistent authorization (token saved across page reloads)

**Conditional Activation:** Swagger is enabled when:

- `ENABLE_SWAGGER=true` is explicitly set, **OR**
- `NODE_ENV` is not `production` (enabled by default in development)

---

## 6. Common Layer (`src/common`)

The **Common Layer** contains reusable artifacts that can be used by any module.

### 6.1 Constants (`constants/app.constants.ts`)

```typescript
DEFAULT_THROTTLE_LIMIT = 100; // Max requests per window
DEFAULT_THROTTLE_TTL_MS = 60_000; // Window: 1 minute
```

### 6.2 Global Exception Filter (`filters/http-exception.filter.ts`)

The `AllExceptionsFilter` catches **every** exception thrown during HTTP request processing.

**Error Response Shape:**

```json
{
  "success": false,
  "statusCode": 500,
  "timestamp": "2026-07-15T12:00:00.000Z",
  "path": "/api/users",
  "correlationId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Internal server error",
  "stack": "Error: ..." // Only in development
}
```

**Key Behaviors:**

- Each error gets a unique `correlationId` (UUID v4) for tracing.
- `HttpException` messages are extracted, including class-validator array messages.
- Unknown exceptions get HTTP 500 with "Internal server error".
- Stack traces appear **only** in `NODE_ENV=development`.
- Errors are logged via Winston with correlation ID.

### 6.3 Pagination DTO (`dto/pagination-query.dto.ts`)

Reusable pagination query parameters:

```typescript
class PaginationQueryDto {
  page: number; // Default: 1, Min: 1
  limit: number; // Default: 20, Min: 1, Max: 100
}
```

Uses `class-transformer` for type coercion (query strings arrive as strings).

### 6.4 Stub Directories (Reserved for Future Use)

| Directory       | Intended Purpose                                       |
| --------------- | ------------------------------------------------------ |
| `decorators/`   | Custom decorators (e.g., `@CurrentUser()`, `@Roles()`) |
| `exceptions/`   | Domain-specific exception classes                      |
| `guards/`       | Shared authorization guards                            |
| `interceptors/` | Response transformation, logging interceptors          |
| `middleware/`   | Request preprocessing middleware                       |
| `pipes/`        | Custom validation/transformation pipes                 |
| `types/`        | Shared TypeScript type definitions                     |
| `utils/`        | General-purpose utility functions                      |

---

## 7. Infrastructure Layer (`src/infrastructure`)

The **Infrastructure Layer** contains technical adapters that abstract away third-party services and frameworks. Each sub-module is self-contained with its own config, constants, types, and services.

### 7.1 `InfrastructureModule` (`infrastructure.module.ts`)

Aggregates and re-exports all infrastructure sub-modules:

```
InfrastructureModule
  ├── DatabaseModule        (PostgreSQL via TypeORM)
  ├── CacheModule           (Redis via ioredis)          ★ @Global()
  ├── LoggingModule         (Winston via nest-winston)
  ├── SecurityJwtModule     (JWT via @nestjs/jwt)
  ├── SecurityPasswordModule (bcrypt)
  ├── QueueModule           (BullMQ via @nestjs/bullmq)
  ├── StorageModule         (AWS S3 via @aws-sdk)
  └── MailModule            (Nodemailer + templates)
```

### 7.2 Database Module (`database/`)

#### Configuration

Uses `TypeOrmModule.forRootAsync()` with environment-driven config:

| Env Variable        | Default    | Description       |
| ------------------- | ---------- | ----------------- |
| `DATABASE_HOST`     | (required) | PostgreSQL host   |
| `DATABASE_PORT`     | (required) | PostgreSQL port   |
| `DATABASE_USER`     | (required) | Database username |
| `DATABASE_PASSWORD` | (required) | Database password |
| `DATABASE_NAME`     | (required) | Database name     |

#### Behavior

- `synchronize: true` in **development only** — auto-creates/alters tables.
- `autoLoadEntities: true` — entities registered via `TypeOrmModule.forFeature()` are automatically picked up.
- `logging: true` in **development only** — SQL queries are logged.
- `maxQueryExecutionTime: 1000` — queries taking >1s are logged as warnings.

#### `DatabaseService`

- Implements `OnModuleInit` to log connection status on startup.
- Injects `DataSource` for direct database access (raw queries, transactions).

### 7.3 Cache Module (`cache/`)

**Marked `@Global()`** — available everywhere without re-importing.

#### Redis Connection Provider (`redis/redis.ts`)

Creates an ioredis client with:

| Feature     | Setting                            |
| ----------- | ---------------------------------- |
| Connection  | Lazy (`lazyConnect: true`)         |
| Ready Check | Enabled                            |
| Retries     | Max 2 per request                  |
| Backoff     | `Math.min(attempt × 100, 2000)` ms |
| Key Prefix  | `noviq:` (default)                 |

#### `CacheService` (`services/cache.service.ts`)

Implements `OnModuleInit` and `OnModuleDestroy` for lifecycle management.

**Available Operations:**

| Method                | Signature                      | Description                                    |
| --------------------- | ------------------------------ | ---------------------------------------------- |
| `get<T>()`            | `(key) => T \| null`           | JSON-parsed value or null                      |
| `set<T>()`            | `(key, value, ttlMs?) => void` | JSON-stringified with PX expiry                |
| `del()`               | `(key) => void`                | Delete single key                              |
| `delMany()`           | `(keys) => number`             | Delete multiple keys, returns count            |
| `remember<T>()`       | `(key, ttlMs, loader) => T`    | Cache-aside pattern (get → miss → fetch → set) |
| `invalidatePattern()` | `(pattern) => number`          | SCAN + delete matching keys                    |
| `increment()`         | `(key, ttlMs?) => number`      | Atomic increment, optional PEXPIRE             |

**Error Handling:** All methods catch Redis errors and log warnings — they never throw, ensuring the app remains operational if Redis is down.

#### `CacheKeyService` (`services/cache-key.service.ts`)

Centralizes cache key naming conventions:

| Method                    | Key Pattern                  |
| ------------------------- | ---------------------------- |
| `userProfile(userId)`     | `users:profile:{userId}`     |
| `userPermissions(userId)` | `users:permissions:{userId}` |
| `courseDetails(courseId)` | `courses:details:{courseId}` |
| `courseList(filtersHash)` | `courses:list:{filtersHash}` |
| `authSession(sessionId)`  | `auth:sessions:{sessionId}`  |

#### Constants (`constants/cache.constants.ts`)

| Constant               | Value                    | Description             |
| ---------------------- | ------------------------ | ----------------------- |
| `REDIS_CLIENT`         | `Symbol('REDIS_CLIENT')` | DI injection token      |
| `CACHE_DEFAULT_TTL_MS` | `60_000`                 | 1 minute default TTL    |
| `CACHE_SCAN_COUNT`     | `100`                    | Keys per SCAN iteration |
| `CACHE_KEY_PREFIX`     | `'noviq:'`               | Global key namespace    |

### 7.4 Logging Module (`logging/`)

Uses `nest-winston` (WinstonModule) for structured logging.

#### Configuration (`config/logging.config.ts`)

Creates three Winston transports:

| Transport       | Destination                       | Format                        | Level        |
| --------------- | --------------------------------- | ----------------------------- | ------------ |
| Console         | stdout                            | Nest-like (dev) / JSON (prod) | Configurable |
| DailyRotateFile | `{logDir}/application-%DATE%.log` | JSON                          | Configurable |
| DailyRotateFile | `{logDir}/error-%DATE%.log`       | JSON                          | `error` only |

**Development Console Format:** Colorized, pretty-printed with timestamps and module names.

**Production Console Format:** JSON (structured, machine-readable).

#### Constants (`constants/logging.constants.ts`)

| Constant                   | Default                  | Description                       |
| -------------------------- | ------------------------ | --------------------------------- |
| `DEFAULT_LOG_LEVEL`        | `info`                   | Default logging level             |
| `DEFAULT_LOG_DIR`          | `logs`                   | Log output directory              |
| `DEFAULT_LOG_MAX_SIZE`     | `20m`                    | Max size per file before rotation |
| `DEFAULT_LOG_MAX_FILES`    | `14d`                    | Retention period                  |
| `APPLICATION_LOG_FILENAME` | `application-%DATE%.log` | App-level log pattern             |
| `ERROR_LOG_FILENAME`       | `error-%DATE%.log`       | Error log pattern                 |

**Test Coverage:** The logging config has a unit test verifying all three transports are created with correct paths.

### 7.5 JWT Security Module (`security/jwt/`)

The most sophisticated infrastructure module — provides dual-token authentication.

#### Token Types

| Token   | Default TTL | Secret (Env)         | Purpose                                      |
| ------- | ----------- | -------------------- | -------------------------------------------- |
| Access  | `15m`       | `JWT_ACCESS_SECRET`  | Short-lived, used for API authorization      |
| Refresh | `7d`        | `JWT_REFRESH_SECRET` | Long-lived, used to obtain new access tokens |

#### Configuration (`config/jwt.config.ts`)

Two factory functions:

- **`createJwtInfrastructureConfig()`** — builds `JwtInfrastructureConfig` from env, validates production requires real secrets (refuses to start with dev defaults).
- **`createJwtModuleOptions()`** — wraps config for `@nestjs/jwt` module registration.

**TTL Validation:** Accepts values like `15m`, `7d`, `1h`, `30s`, `500ms` — rejects invalid formats.

#### `TokenService` (`services/token.service.ts`)

**Core Operations:**

| Method                        | Input        | Output                     | Notes                                                     |
| ----------------------------- | ------------ | -------------------------- | --------------------------------------------------------- |
| `issueAccessToken()`          | `JwtPayload` | `string`                   | Signs with access secret, adds `type: "access"`           |
| `issueRefreshToken()`         | `JwtPayload` | `string`                   | Signs with refresh secret, adds `jti` + `type: "refresh"` |
| `issueTokenPair()`            | `JwtPayload` | `TokenPair`                | Returns both tokens + `expiresIn` in seconds              |
| `verifyAccessToken()`         | `string`     | `VerifiedJwtPayload`       | Validates audience, issuer, secret, and token type        |
| `verifyRefreshToken()`        | `string`     | `VerifiedJwtPayload`       | Same as above but with refresh secret                     |
| `decode()`                    | `string`     | `object \| string \| null` | Decode without verification                               |
| `getAccessExpiresInSeconds()` | —            | `number`                   | Converts TTL string to seconds                            |

**Token Type Protection:** The verifier checks `payload.type` — a refresh token (`type: "refresh"`) will be rejected by `verifyAccessToken()` with `"Invalid access token type"`.

#### `JwtPayload` Types

```typescript
type JwtPayload = {
  sub: string; // Subject (user ID)
  type?: JwtTokenType; // "access" | "refresh"
  jti?: string; // JWT ID (unique per refresh token)
  roles?: string[]; // User roles for authorization
};

type JwtTokenType = 'access' | 'refresh';
```

#### `TokenPair` Type

```typescript
type TokenPair = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // Access token TTL in seconds
};
```

#### Constants (`constants/jwt.constants.ts`)

| Constant                  | Value                                        | Description                   |
| ------------------------- | -------------------------------------------- | ----------------------------- |
| `JWT_CONFIG`              | `Symbol.for('JWT_CONFIG')`                   | DI injection token            |
| `JWT_ACCESS_TOKEN_TYPE`   | `'access'`                                   | Access token type identifier  |
| `JWT_REFRESH_TOKEN_TYPE`  | `'refresh'`                                  | Refresh token type identifier |
| `JWT_DEFAULT_ACCESS_TTL`  | `'15m'`                                      | 15 minutes                    |
| `JWT_DEFAULT_REFRESH_TTL` | `'7d'`                                       | 7 days                        |
| `JWT_DEFAULT_ISSUER`      | `'noviq-api'`                                | Issuer claim                  |
| `JWT_DEFAULT_AUDIENCE`    | `'noviq-client'`                             | Audience claim                |
| `JWT_DEV_ACCESS_SECRET`   | `'noviq-dev-access-token-secret-change-me'`  | Dev-only fallback             |
| `JWT_DEV_REFRESH_SECRET`  | `'noviq-dev-refresh-token-secret-change-me'` | Dev-only fallback             |

### 7.6 Queue Module (`queue/`)

BullMQ-based job queue system backed by Redis (separate DB from cache).

#### Architecture

Three named queues registered at startup:

| Queue Name     | Purpose                         |
| -------------- | ------------------------------- |
| `default`      | General-purpose background jobs |
| `email`        | Email sending jobs              |
| `notification` | Push/in-app notification jobs   |

#### Configuration (`config/queue.config.ts`)

Uses a **separate Redis DB** (DB 1 by default) from the cache (DB 0):

| Env Variable               | Default     | Description                 |
| -------------------------- | ----------- | --------------------------- |
| `QUEUE_REDIS_HOST`         | `localhost` | Redis host                  |
| `QUEUE_REDIS_PORT`         | `6379`      | Redis port                  |
| `QUEUE_REDIS_PASSWORD`     | (none)      | Redis password              |
| `QUEUE_REDIS_DB`           | `1`         | Redis database number       |
| `QUEUE_PREFIX`             | `noviq`     | BullMQ key prefix           |
| `QUEUE_DEFAULT_ATTEMPTS`   | `3`         | Job retry attempts          |
| `QUEUE_BACKOFF_DELAY_MS`   | `5000`      | Backoff delay (exponential) |
| `QUEUE_REMOVE_ON_COMPLETE` | `1000`      | Keep last N completed jobs  |
| `QUEUE_REMOVE_ON_FAIL`     | `5000`      | Keep last N failed jobs     |

**Key:** `maxRetriesPerRequest: null` — required for BullMQ workers.

#### `QueueService` (`services/queue.service.ts`)

| Method                                                    | Description                                     |
| --------------------------------------------------------- | ----------------------------------------------- |
| `add(queueName, jobName, data, options?)`                 | Enqueue a single job                            |
| `addDelayed(queueName, jobName, data, delayMs, options?)` | Schedule a job for future execution             |
| `addBulk(queueName, jobs[])`                              | Enqueue multiple jobs atomically                |
| `getQueue(queueName)`                                     | Get a Queue instance (throws for unknown names) |

#### `QueueJob` Type

```typescript
type QueueJob<Data> = {
  name: string;
  data: Data;
  opts?: JobsOptions;
};
```

### 7.7 Storage Module (`storage/`)

AWS S3-compatible file storage with support for alternative endpoints (MinIO, LocalStack).

#### Configuration (`config/s3.config.ts`)

**Required** environment variables (refuses to start if missing):

| Variable                | Description                    |
| ----------------------- | ------------------------------ |
| `AWS_REGION`            | AWS region (e.g., `us-east-1`) |
| `AWS_ACCESS_KEY_ID`     | AWS access key                 |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key                 |
| `S3_BUCKET_NAME`        | Target bucket name             |

**Optional** variables:

| Variable                        | Default   | Description                          |
| ------------------------------- | --------- | ------------------------------------ |
| `S3_ENDPOINT`                   | (none)    | Custom endpoint for MinIO/LocalStack |
| `S3_FORCE_PATH_STYLE`           | `false`   | Path-style addressing                |
| `S3_PUBLIC_BASE_URL`            | (none)    | CDN / public URL base                |
| `S3_SIGNED_URL_EXPIRES_SECONDS` | `900`     | Signed URL lifetime (15 min)         |
| `S3_KEY_PREFIX`                 | `uploads` | Object key prefix                    |

**Value Normalization:** Trailing slashes stripped from endpoints and base URLs. Key prefix normalized (no leading/trailing slashes).

#### Providers (`providers/s3.provider.ts`)

Two DI providers:

- **`s3StorageConfigProvider`** → creates `S3StorageConfig` from environment.
- **`s3ClientProvider`** → creates `S3Client` instance using the config.

#### `S3StorageService` (`services/s3-storage.service.ts`)

Comprehensive S3 operation service:

| Operation               | Method                   | Description                                  |
| ----------------------- | ------------------------ | -------------------------------------------- |
| **Upload (multipart)**  | `uploadBuffer()`         | Multipart upload via `@aws-sdk/lib-storage`  |
| **Upload (stream)**     | `uploadStream()`         | Same as above (delegates to `uploadManaged`) |
| **Upload (direct)**     | `putObject()`            | Single `PutObjectCommand` for small objects  |
| **Retrieve**            | `getObject()`            | Fetch object from S3                         |
| **Metadata**            | `headObject()`           | Get object metadata without body             |
| **Exists**              | `objectExists()`         | Check if object exists (returns boolean)     |
| **Delete one**          | `deleteObject()`         | Single object deletion                       |
| **Delete many**         | `deleteObjects()`        | Batch deletion (accepts string or string[])  |
| **Copy**                | `copyObject()`           | Server-side copy between keys                |
| **Signed upload URL**   | `getSignedUploadUrl()`   | Pre-signed URL for client-side upload        |
| **Signed download URL** | `getSignedDownloadUrl()` | Pre-signed URL for temporary access          |
| **Public URL**          | `getPublicUrl()`         | Construct public CDN URL                     |
| **Key building**        | `buildKey()`             | Prefix-aware key construction                |

**Key Prefix Logic:** All keys are automatically prefixed with `S3_KEY_PREFIX` (default: `uploads/`). Passing `"avatar.png"` results in key `"uploads/avatar.png"`. Already-prefixed keys are not double-prefixed.

**Storage Object Shape:**

```typescript
type StorageObject = {
  bucket: string;
  key: string;
  url?: string; // Only if publicBaseUrl is configured
};
```

**Upload Options:**

```typescript
type UploadOptions = {
  key: string;
  body: Buffer | Uint8Array | string | Readable;
  acl?: ObjectCannedACL;
  contentType?: string;
  contentLength?: number;
  contentDisposition?: string;
  contentEncoding?: string;
  cacheControl?: string;
  metadata?: Record<string, string>;
};
```

### 7.8 Mail Module (`mail/`)

Nodemailer-based email service with BullMQ-backed reliable delivery and an HTML template engine.

#### Architecture

```
Caller (e.g., AuthService)
      │
      │  queueService.add('email', EmailName.WELCOME, { to, subject, emailName, templateData })
      │
      ▼
BullMQ 'email' queue ──── retries (3 attempts, exponential backoff)
      │
      ▼
EmailProcessor.process(job)
      │
      ├── html set? → use as-is
      │   else → MailTemplateService.render(emailName, templateData)
      │
      ▼
EmailSenderService.send({ ...job.data, html })
      │
      ▼
Nodemailer → SMTP
```

#### Configuration (`config/mail.config.ts`)

Builds a nodemailer `Transporter` from environment variables:

| Env Variable     | Default            | Description                  |
| ---------------- | ------------------ | ---------------------------- |
| `EMAIL_HOST`     | `localhost`        | SMTP server host             |
| `EMAIL_PORT`     | `587`              | SMTP server port             |
| `EMAIL_USER`     | —                  | SMTP auth username           |
| `EMAIL_PASSWORD` | —                  | SMTP auth password           |
| `EMAIL_FROM`     | `noreply@noviq.com` | Default sender address      |
| `EMAIL_SECURE`   | `false`            | Use TLS (set `true` for 465) |

Supports both authenticated and unauthenticated SMTP connections.

#### `EmailSenderService` (`services/email-sender.service.ts`)

| Method                   | Description                        |
| ------------------------ | ---------------------------------- |
| `send(options)`          | Send a single email via nodemailer |
| `sendMany(emails)`       | Send multiple emails in sequence   |

**`SendEmailOptions`:**

| Field         | Type                           | Description                         |
| ------------- | ------------------------------ | ----------------------------------- |
| `to`          | `string \| string[]`           | Recipient(s)                        |
| `subject`     | `string`                       | Email subject line                  |
| `html`        | `string` (optional)            | Pre-rendered HTML body              |
| `text`        | `string` (optional)            | Plain-text fallback                 |
| `from`        | `string` (optional)            | Override default sender             |
| `cc`          | `string \| string[]` (opt)     | Carbon copy                          |
| `bcc`         | `string \| string[]` (opt)     | Blind carbon copy                    |
| `attachments` | `array` (optional)             | File attachments                    |
| `emailName`   | `EmailName`                    | Which email template to render      |
| `templateData`| `TemplateDataMap[EmailName]`   | Data injected into the template     |

#### `EmailProcessor` (`processors/email.processor.ts`)

BullMQ worker consumer bound to the `email` queue via `@Processor(EMAIL_QUEUE_NAME)`. On each job:

1. Checks if `html` is already set — uses it directly
2. Otherwise calls `MailTemplateService.render()` with `emailName` + `templateData`
3. Passes the resolved HTML to `EmailSenderService.send()`
4. If sending fails, BullMQ retries automatically (3 attempts, exponential backoff)

#### `MailTemplateService` (`services/mail-template.service.ts`)

Renders email templates by name. Template names are typed via the `EmailName` enum:

| `EmailName`            | Template file                     | Data interface                    |
| ---------------------- | --------------------------------- | --------------------------------- |
| `WELCOME`              | `welcome.template.ts`             | `WelcomeTemplateData`             |
| `PASSWORD_RESET`       | `password-reset.template.ts`      | `PasswordResetTemplateData`       |
| `EMAIL_VERIFICATION`   | `email-verification.template.ts`  | `EmailVerificationTemplateData`   |

To add a new template: add to `EmailName` enum → create `*.template.ts` file → register in `templates/index.ts`.

#### Template System (`templates/`)

Each template is a pure function that takes typed data and returns an HTML string. All templates share a common `baseTemplate()` layout with:

- Gradient brand accent bar (`#6366f1` → `#a855f7`)
- Responsive card layout (560px max-width)
- Inter font family with system fallbacks
- Mobile breakpoint at 480px
- App name and copyright year derived automatically from constants

#### Constants (`constants/mail.constants.ts`)

| Constant            | Value                    | Description            |
| ------------------- | ------------------------ | ---------------------- |
| `MAIL_APP_NAME`     | `'Noviq'`                | Brand name in emails   |
| `MAIL_DEFAULT_HOST` | `'localhost'`            | Default SMTP host      |
| `MAIL_DEFAULT_PORT` | `587`                    | Default SMTP port      |
| `MAIL_DEFAULT_FROM` | `'noreply@noviq.com'`    | Default sender address |
| `MAIL_TRANSPORTER`  | `'MAIL_TRANSPORTER'`     | DI injection token     |

### 7.9 Future Infrastructure (Stubs)

| Directory    | Intended Purpose                          |
| ------------ | ----------------------------------------- |
| `telemetry/` | OpenTelemetry / metrics / tracing         |

---

## 8. Business Modules (`src/modules`)

### 8.1 Auth Module (`modules/auth/`)

**Purpose:** Handle user authentication via JWT and OAuth2 providers.

#### Current Implementation

| Component    | File                         | Status                                       |
| ------------ | ---------------------------- | -------------------------------------------- |
| **Module**   | `auth.module.ts`             | Imports PassportModule, provides JwtStrategy |
| **Guard**    | `guards/jwt-auth.guard.ts`   | `AuthGuard('jwt')` wrapper                   |
| **Strategy** | `strategies/jwt.strategy.ts` | Passport JWT strategy                        |

#### JWT Strategy (`jwt.strategy.ts`)

- Extends `PassportStrategy(Strategy)` (passport-jwt).
- Extracts JWT from `Authorization: Bearer <token>` header.
- Uses the same `JwtInfrastructureConfig` as the infrastructure layer.
- `validate()` extracts `userId` (from `sub`) and `roles` from the decoded JWT payload.
- The returned object is attached to `request.user`.

#### DDD Layer Stubs

All four layers (`application/`, `domain/`, `infrastructure/`, `presentation/`) are scaffolded with `.gitkeep` files, ready for implementation:

- **Presentation**: Auth controller (login, register, refresh, logout endpoints).
- **Application**: Use cases (register user, authenticate, refresh session).
- **Domain**: Auth-related entities (session, credentials).
- **Infrastructure**: OAuth adapters (Google, Microsoft, Facebook).

### 8.2 Users Module (`modules/users/`)

**Purpose:** User profile management and CRUD operations.

#### User Entity (`domain/entities/user.entity.ts`)

The core user model mapped to the `users` table:

| Column            | Type           | Constraints               | Notes                                     |
| ----------------- | -------------- | ------------------------- | ----------------------------------------- |
| `id`              | `uuid`         | `PRIMARY KEY`             | Auto-generated via `gen_random_uuid()`    |
| `name`            | `varchar(100)` | `NOT NULL`                | Display name                              |
| `email`           | `varchar(255)` | `UNIQUE, NOT NULL`        | Login identifier                          |
| `passwordHash`    | `varchar(255)` | `NOT NULL, SELECT: false` | Hidden from queries by default            |
| `isActive`        | `boolean`      | `DEFAULT true, INDEXED`   | Soft disable                              |
| `createdAt`       | `timestamp`    | `NOT NULL`                | Auto-set on insert                        |
| `updatedAt`       | `timestamp`    | `NOT NULL`                | Auto-set on insert (needs update trigger) |
| `termsAcceptedAt` | `timestamp`    | `NULLABLE`                | Tracks TOS acceptance timestamp           |
| `termsVersion`    | `varchar(20)`  | `NULLABLE`                | Tracks accepted TOS version               |

**Key Design Decisions:**

- `passwordHash` uses `select: false` — never returned in queries unless explicitly selected.
- UUID primary key with database-level generation (no application-level UUID dependency).
- `isActive` is indexed for fast filtering on active users.

#### Users Controller (`presentation/controller/users.controller.ts`)

Currently **stub endpoints** returning placeholder strings:

| Method | Route        | Status                              |
| ------ | ------------ | ----------------------------------- |
| `GET`  | `/users`     | Returns "List of users"             |
| `GET`  | `/users/:id` | Returns "User details"              |
| `POST` | `/users`     | Returns "User created successfully" |

#### Module Registration

- Uses `TypeOrmModule.forFeature([User])` to register the entity.
- Exports `TypeOrmModule` so other modules can use the User repository.

### 8.3 Health Module (`modules/health/`)

**Purpose:** Kubernetes/load-balancer compatible health check endpoint.

#### Endpoint

```
GET /health
```

**Response (200):**

```json
{
  "status": "ok",
  "info": {
    "memory_heap": { "status": "up" }
  },
  "error": {},
  "details": {
    "memory_heap": { "status": "up" }
  }
}
```

#### Checks Performed

| Check       | Indicator               | Threshold                  |
| ----------- | ----------------------- | -------------------------- |
| Memory Heap | `MemoryHealthIndicator` | 300 MB (314,572,800 bytes) |

#### Swagger DTO (`dto/health-check.response.ts`)

Fully documented with `@ApiProperty` decorators for the OpenAPI schema.

---

## 9. Shared Layer (`src/shared`)

The **Shared Layer** is a stub directory intended for cross-module providers that are stable and intentionally shared (e.g., a `DateTimeService`, `IdGenerator`, or `EventBus`).

Currently contains only a `.gitkeep` file — reserved for future use.

---

## 10. Application Bootstrap & Entry Point

### `main.ts` — Complete Startup Sequence

```
1. NestFactory.create(AppModule, { bufferLogs: true })
      ↓
2. Replace logger with Winston (app.useLogger)
      ↓
3. configureApplication(app)
   ├── Helmet (security headers)
   ├── Cookie Parser
   ├── CORS (credentialed, all origins)
   ├── Global ValidationPipe (whitelist + transform)
   └── Shutdown Hooks
      ↓
4. Conditional Swagger Setup
   ├── Check ENABLE_SWAGGER or NODE_ENV !== 'production'
   └── setupSwagger(app) → /docs
      ↓
5. app.listen(PORT || 3000)
```

### `AppModule` — Root Module Wiring

```typescript
@Module({
  imports: [
    RouterModule.register([
      { path: 'users', module: UsersModule },
      { path: 'auth', module: AuthModule },
    ]),
    CoreModule, // Config, rate limiting, scheduling
    InfrastructureModule, // DB, cache, JWT, queue, storage, logging
    HealthModule, // /health endpoint
    AuthModule, // Authentication
    UsersModule, // User management
  ],
})
export class AppModule {}
```

**Routing:** `RouterModule.register()` sets up path prefixes:

- Requests to `/users/*` → `UsersModule`
- Requests to `/auth/*` → `AuthModule`
- Requests to `/health` → directly handled by `HealthModule` (no prefix)

---

## 11. API Routing & Endpoints

### Current Endpoint Map

| Method | Path         | Module    | Controller         | Status         |
| ------ | ------------ | --------- | ------------------ | -------------- |
| `GET`  | `/health`    | Health    | `HealthController` | ✅ Implemented |
| `GET`  | `/users`     | Users     | `UsersController`  | 🚧 Stub        |
| `GET`  | `/users/:id` | Users     | `UsersController`  | 🚧 Stub        |
| `POST` | `/users`     | Users     | `UsersController`  | 🚧 Stub        |
| `GET`  | `/docs`      | (Swagger) | —                  | ✅ Implemented |

### Planned Endpoints (from todo.md)

| Method | Path              | Purpose               |
| ------ | ----------------- | --------------------- |
| `POST` | `/auth/register`  | User registration     |
| `POST` | `/auth/login`     | Email/password login  |
| `POST` | `/auth/refresh`   | Refresh access token  |
| `POST` | `/auth/logout`    | Invalidate session    |
| `POST` | `/auth/google`    | Google OAuth login    |
| `POST` | `/auth/microsoft` | Microsoft OAuth login |
| `POST` | `/auth/facebook`  | Facebook OAuth login  |

---

## 12. Configuration & Environment

### Environment File Loading Order

```
1. .env.{NODE_ENV}    (e.g., .env.development)
2. .env                (fallback)
```

Later files override earlier ones. For production (`NODE_ENV=production`), the app loads:

```
1. .env.production
2. .env
```

### All Environment Variables

See [Section 25](#25-quick-reference--all-environment-variables) for the complete reference table.

### Development Defaults

The `.env` file provides sensible defaults for local development:

- **Database**: `localhost:5432`, database `noviq_dev`, user `myuser`
- **Redis**: `localhost:6379`, DB 0
- **Queue Redis**: `localhost:6379`, DB 1
- **JWT**: Dev-only secrets with 15m access / 7d refresh TTLs
- **Logging**: `debug` level, `./logs` directory
- **Swagger**: Enabled by default
- **S3**: Points to `fanousebucket` in `us-east-1`

---

## 13. Authentication & Authorization

### Authentication Flow (Designed, Partially Implemented)

```
1. User logs in → receives Access Token (15m) + Refresh Token (7d)
                     ↓
2. Client stores tokens (httpOnly cookie recommended)
                     ↓
3. Each API request → Authorization: Bearer <access_token>
                     ↓
4. JwtStrategy validates → request.user = { userId, roles }
                     ↓
5. (Future) RolesGuard checks @Roles() decorator
                     ↓
6. When access token expires → POST /auth/refresh with refresh token
                     ↓
7. New access token issued (refresh token rotation supported via jti)
```

### JWT Token Structure

**Access Token Payload:**

```json
{
  "sub": "user-uuid",
  "roles": ["student"],
  "type": "access",
  "iat": 1740000000,
  "exp": 1740000900,
  "iss": "noviq-api",
  "aud": "noviq-client"
}
```

**Refresh Token Payload:**

```json
{
  "sub": "user-uuid",
  "roles": ["student"],
  "type": "refresh",
  "jti": "unique-token-id",
  "iat": 1740000000,
  "exp": 1740604800,
  "iss": "noviq-api",
  "aud": "noviq-client"
}
```

### Security Features

| Feature                   | Implementation                                                               |
| ------------------------- | ---------------------------------------------------------------------------- |
| **Token type validation** | Verifier checks `type` claim — refresh tokens can't be used as access tokens |
| **Separate secrets**      | Access and refresh tokens use independent signing keys                       |
| **Token ID (jti)**        | Each refresh token has a unique ID for revocation tracking                   |
| **Short-lived access**    | 15-minute access tokens limit exposure window                                |
| **Helmet**                | Security headers (CSP disabled for Swagger compatibility)                    |
| **CORS**                  | Credentialed requests from any origin                                        |
| **Rate limiting**         | 100 req/min globally                                                         |

---

## 14. Database Schema

### Current Table: `users`

```sql
CREATE TABLE users (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             VARCHAR(100) NOT NULL,
  email            VARCHAR(255) NOT NULL UNIQUE,
  "passwordHash"   VARCHAR(255) NOT NULL,
  "isActive"       BOOLEAN DEFAULT true,
  "createdAt"      TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt"      TIMESTAMP NOT NULL DEFAULT now(),
  "termsAcceptedAt" TIMESTAMP,
  "termsVersion"   VARCHAR(20)
);

CREATE INDEX IDX_users_isActive ON users ("isActive");
```

### ORM Configuration

- **Type**: PostgreSQL
- **Synchronize**: Auto in development (not safe for production).
- **Auto-load entities**: Yes — entities from `TypeOrmModule.forFeature()` are discovered.
- **Logging**: SQL queries logged in development.

---

## 15. Caching Strategy

### Architecture

```
Application Code
      ↓
CacheService (cache-aside pattern)
      ↓
Redis (ioredis client)
      ↓
Key prefix: "noviq:" (namespace isolation)
```

### Cache-Aside Pattern (`remember()`)

```typescript
// Instead of:
let data = await cache.get(key);
if (!data) {
  data = await fetchFromDB();
  await cache.set(key, data, ttl);
}

// Use:
const data = await cache.remember(key, ttl, () => fetchFromDB());
```

### Invalidation Patterns

| Pattern       | Method                         | Use Case                   |
| ------------- | ------------------------------ | -------------------------- |
| Single key    | `del(key)`                     | Update a specific entity   |
| Multiple keys | `delMany(keys)`                | Bulk operations            |
| Pattern-based | `invalidatePattern("users:*")` | Invalidate all user caches |

### Key Naming Convention

All keys follow the pattern: `{domain}:{resource}:{identifier}`

```
noviq:users:profile:<userId>
noviq:users:permissions:<userId>
noviq:courses:details:<courseId>
noviq:courses:list:<filtersHash>
noviq:auth:sessions:<sessionId>
```

### Resilience

- All cache operations catch errors — Redis being down never crashes the app.
- `get()` returns `null` on failure (triggers DB fetch in cache-aside pattern).
- `set()` and `del()` log warnings and continue silently.

---

## 16. Job Queue System

### Queue Architecture

```
Application
    ↓
QueueService.add(queueName, jobName, data)
    ↓
BullMQ (Redis DB 1)
    ↓
Worker processes
    ├── EmailProcessor (MailModule) — consumes 'email' queue
    └── Notification (future)
    ↓
Job handlers (email, notifications, etc.)
```

### Queue Names & Purposes

| Queue        | BullMQ Name    | Env Reference               |
| ------------ | -------------- | --------------------------- |
| Default      | `default`      | General background work     |
| Email        | `email`        | Outbound email delivery     |
| Notification | `notification` | Push & in-app notifications |

### Job Lifecycle

```
Enqueue → Wait → Active → Completed
                    ↓
                  Failed → Retry (exponential backoff) → Active
                                ↓ (after N attempts)
                              Failed → Dead Letter
```

### Default Job Options

| Option             | Value         | Description                     |
| ------------------ | ------------- | ------------------------------- |
| `attempts`         | `3`           | Max retry attempts              |
| `backoff.type`     | `exponential` | Exponential backoff strategy    |
| `backoff.delay`    | `5000` ms     | Initial backoff delay           |
| `removeOnComplete` | `1000`        | Retain last 1000 completed jobs |
| `removeOnFail`     | `5000`        | Retain last 5000 failed jobs    |

---

## 17. File Storage (S3)

### Operations Summary

```
Client App                                S3StorageService
    │                                           │
    ├─ GET /files/:key ───────────────────→ getSignedDownloadUrl() → S3
    │                                           │
    ├─ POST /upload ──→ presigned URL ←─── getSignedUploadUrl()  → S3
    │                                           │
    ├─ (server upload) ───────────────────→ uploadBuffer()/putObject() → S3
    │                                           │
    ├─ DELETE /files/:key ────────────────→ deleteObject()       → S3
    │                                           │
    └─ GET /files/:key/public ────────────→ getPublicUrl()       → CDN
```

### Supported S3 Operations

| Category | Operation                 | Method                              |
| -------- | ------------------------- | ----------------------------------- |
| Upload   | Small object              | `putObject()`                       |
| Upload   | Large/multipart           | `uploadBuffer()` / `uploadStream()` |
| Download | Via pre-signed URL        | `getSignedDownloadUrl()`            |
| Upload   | Pre-signed URL for client | `getSignedUploadUrl()`              |
| Retrieve | Get object                | `getObject()`                       |
| Metadata | Head object               | `headObject()`                      |
| Check    | Object exists             | `objectExists()`                    |
| Delete   | Single object             | `deleteObject()`                    |
| Delete   | Multiple objects          | `deleteObjects(keys)`               |
| Copy     | Server-side               | `copyObject(source, target)`        |
| URL      | Public CDN URL            | `getPublicUrl()`                    |

### Key Construction

All keys are automatically prefixed:

```
Input key: "avatar.png"
Built key: "uploads/avatar.png"   (with keyPrefix = "uploads")

Input key: "uploads/avatar.png"   (already prefixed)
Built key: "uploads/avatar.png"   (no double-prefix)

Input key: "  reports /2024  /summary .pdf"
Built key: "uploads/reports/2024/summary.pdf"  (normalized)
```

---

## 18. Logging System

### Transport Configuration

```
                    ┌──────────────┐
                    │  Application │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
         ┌────▼────┐ ┌────▼────┐ ┌─────▼──────┐
         │ Console │ │   App   │ │   Error    │
         │ stdout  │ │  File   │ │   File     │
         └─────────┘ └─────────┘ └────────────┘
         Nest-like     JSON          JSON
         (dev)         Daily         Daily
         JSON          Rotate        Rotate
         (prod)
```

### Log File Organization

```
logs/
├── application-2026-07-15.log    ← All log levels
├── application-2026-07-14.log
├── error-2026-07-15.log          ← Error level only
├── error-2026-07-14.log
└── .*-audit.json                 ← Security audit trail
```

### Log Levels (RFC 5424)

```
error: 0   — System errors, exceptions
warn:  1   — Degraded operation (Redis down, cache miss)
info:  2   — Normal operations (server start, DB connected)
debug: 3   — Detailed diagnostic info
```

### Using the Logger in Code

```typescript
// Inject Winston logger
constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

// Use it
this.logger.log('User registered', { userId: '...' });
this.logger.error('Database connection failed', error);
```

---

## 19. Error Handling

### Global Exception Filter Flow

```
Exception thrown
      │
      ▼
AllExceptionsFilter.catch()
      │
      ├── Extract HTTP status (or 500 for unknown)
      ├── Generate correlationId (UUID)
      ├── Extract message (from HttpException, Error, or fallback)
      ├── Log via Winston with correlationId + stack trace
      │
      ▼
HTTP Response
      │
      └── JSON body with:
          ├── success: false
          ├── statusCode
          ├── timestamp (ISO 8601)
          ├── path (request URL)
          ├── correlationId (for log tracing)
          ├── message (user-facing)
          └── stack (development only)
```

### Error Response Example

**Development:**

```json
{
  "success": false,
  "statusCode": 400,
  "timestamp": "2026-07-15T14:30:00.000Z",
  "path": "/users/123",
  "correlationId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "message": ["email must be a valid email", "name must be a string"],
  "stack": "ValidationError: ...\n    at ..."
}
```

**Production:**

```json
{
  "success": false,
  "statusCode": 500,
  "timestamp": "2026-07-15T14:30:00.000Z",
  "path": "/users",
  "correlationId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "message": "Internal server error"
}
```

### Validation Errors

The `ValidationPipe` automatically returns structured validation errors through the exception filter. The `message` field will contain an array of validation failure strings from `class-validator`.

---

## 20. Rate Limiting & Security

### Rate Limiting

| Parameter    | Default              | Env Variable     |
| ------------ | -------------------- | ---------------- |
| Time window  | 60,000 ms (1 minute) | `THROTTLE_TTL`   |
| Max requests | 100                  | `THROTTLE_LIMIT` |
| Guard scope  | Global (all routes)  | `APP_GUARD`      |

### Security Headers (Helmet)

All standard security headers are applied. Content Security Policy is **disabled** to allow Swagger UI to function correctly.

### CORS

```typescript
{
  credentials: true,  // Allow cookies/auth headers
  origin: true         // Reflect request origin
}
```

> **Note:** `origin: true` reflects all origins. In production, this should be restricted to specific domains.

### Validation Pipe

| Setting                      | Effect                                      |
| ---------------------------- | ------------------------------------------- |
| `whitelist: true`            | Strips properties not defined in DTO        |
| `forbidNonWhitelisted: true` | Returns 400 if unknown properties are sent  |
| `transform: true`            | Auto-converts types (string → number, etc.) |

---

## 21. Swagger API Documentation

### Access

- **URL**: `http://localhost:3000/docs`
- **Title**: "Noviq API Docs"
- **Authentication**: Bearer JWT (enter token via "Authorize" button)

### Visual Theme

A custom dark theme is applied via `customCss`:

- Dark background (`#0b1120` / `#111827` / `#030712`)
- Light text (`#e5e7eb` / `#f9fafb`)
- Dark form inputs
- Styled buttons and code blocks

### Interactive Features

- **Try it out**: Execute API calls directly from the browser.
- **Request duration**: Shows how long each request took.
- **Persistent auth**: Token saved in browser — no need to re-enter after page reload.
- **Sorted**: Tags alphabetically, operations by HTTP method.

---

## 22. Testing Strategy

### Test Configuration

| Aspect         | Unit Tests                 | E2E Tests            |
| -------------- | -------------------------- | -------------------- |
| Config file    | `jest` (in `package.json`) | `test/jest-e2e.json` |
| Root directory | `src/`                     | `.`                  |
| File pattern   | `*.spec.ts`                | `*.e2e-spec.ts`      |
| Transform      | `ts-jest`                  | `ts-jest`            |
| Environment    | `node`                     | `node`               |

### Test Coverage

Coverage collected from all `.ts` and `.js` files in `src/`, output to `coverage/` directory.

### Testing Tools

| Tool                         | Purpose                               |
| ---------------------------- | ------------------------------------- |
| `jest-mock-extended`         | Type-safe mocks for DI                |
| `nock`                       | HTTP request interception             |
| `@testcontainers/postgresql` | Real PostgreSQL for integration tests |
| `@testcontainers/redis`      | Real Redis for integration tests      |
| `supertest`                  | HTTP assertion library for e2e        |
| `@faker-js/faker`            | Realistic test data generation        |

### What's Currently Tested

| Module             | Test File                    | Coverage                               |
| ------------------ | ---------------------------- | -------------------------------------- |
| Logging Config     | `logging.config.spec.ts`     | Transport creation, directory/filename |
| Queue Config       | `queue.config.spec.ts`       | Redis connection, job options          |
| Queue Service      | `queue.service.spec.ts`      | Add, delay, bulk, unknown queue        |
| S3 Config          | `s3.config.spec.ts`          | Config creation, missing values        |
| S3 Storage Service | `s3-storage.service.spec.ts` | Upload, put, signed URLs, commands     |
| Token Service      | `token.service.spec.ts`      | Issue, verify, type protection, jti    |
| Health (E2E)       | `app.e2e-spec.ts`            | GET /health returns 200 with status    |

### Running Tests

```bash
npm test                # Unit tests
npm run test:watch      # Watch mode
npm run test:cov        # With coverage
npm run test:e2e        # End-to-end tests
```

---

## 23. DevOps & Deployment

### Build Process

```bash
npm run build           # nest build (with SWC)
```

Compiled output goes to `dist/`. TypeScript is compiled with:

- CommonJS modules (Node.js compatible)
- ES2023 target
- Decorator metadata enabled
- Source maps generated
- Declarations generated

### Docker

`Dockerfile` and `docker-compose.yml` exist but are currently empty — containerization is planned but not yet implemented.

### Node.js Scripts

| Script        | Command                      | Description                     |
| ------------- | ---------------------------- | ------------------------------- |
| `start`       | `nest start`                 | Start the app (dev)             |
| `start:dev`   | `nest start --watch`         | Start with hot reload           |
| `start:debug` | `nest start --debug --watch` | Start with debugger             |
| `start:prod`  | `node dist/main`             | Start compiled production build |
| `build`       | `nest build`                 | Compile TypeScript              |
| `lint`        | `eslint ... --fix`           | Lint and auto-fix               |
| `format`      | `prettier --write ...`       | Format code                     |

---

## 24. Development Roadmap (Todo)

From `todo.md`:

| Priority  | Feature                                                  | Status         |
| --------- | -------------------------------------------------------- | -------------- |
| 🔴 High   | Authentication system (register, login, refresh, logout) | 🚧 In Progress |
| 🔴 High   | User CRUD operations                                     | 🚧 Stub only   |
| 🟡 Medium | Email & SMS via Twilio                                   | ⬜ Not started |
| 🟡 Medium | Stripe payment integration                               | ⬜ Not started |
| 🟡 Medium | OAuth: Google, Microsoft, Facebook                       | ⬜ Not started |
| 🟢 Low    | Two-factor authentication                                | ⬜ Not started |

---

## 25. Quick Reference — All Environment Variables

### Application

| Variable         | Default           | Description                                       |
| ---------------- | ----------------- | ------------------------------------------------- |
| `NODE_ENV`       | `development`     | Environment (`development`, `production`, `test`) |
| `PORT`           | `3000`            | HTTP server port                                  |
| `ENABLE_SWAGGER` | `true` (non-prod) | Enable Swagger at `/docs`                         |

### Database (PostgreSQL)

| Variable            | Default | Description       |
| ------------------- | ------- | ----------------- |
| `DATABASE_HOST`     | —       | PostgreSQL host   |
| `DATABASE_PORT`     | —       | PostgreSQL port   |
| `DATABASE_NAME`     | —       | Database name     |
| `DATABASE_USER`     | —       | Database username |
| `DATABASE_PASSWORD` | —       | Database password |

### Redis (Cache)

| Variable           | Default     | Description                |
| ------------------ | ----------- | -------------------------- |
| `REDIS_HOST`       | `localhost` | Redis host                 |
| `REDIS_PORT`       | `6379`      | Redis port                 |
| `REDIS_PASSWORD`   | —           | Redis password             |
| `REDIS_DB`         | `0`         | Redis database number      |
| `REDIS_KEY_PREFIX` | `noviq:`    | Key prefix for namespacing |

### Redis (Queue)

| Variable                   | Default     | Description           |
| -------------------------- | ----------- | --------------------- |
| `QUEUE_REDIS_HOST`         | `localhost` | Queue Redis host      |
| `QUEUE_REDIS_PORT`         | `6379`      | Queue Redis port      |
| `QUEUE_REDIS_PASSWORD`     | —           | Queue Redis password  |
| `QUEUE_REDIS_DB`           | `1`         | Queue Redis database  |
| `QUEUE_PREFIX`             | `noviq`     | BullMQ key prefix     |
| `QUEUE_DEFAULT_ATTEMPTS`   | `3`         | Job retry attempts    |
| `QUEUE_BACKOFF_DELAY_MS`   | `5000`      | Backoff delay (ms)    |
| `QUEUE_REMOVE_ON_COMPLETE` | `1000`      | Retain completed jobs |
| `QUEUE_REMOVE_ON_FAIL`     | `5000`      | Retain failed jobs    |

### JWT

| Variable             | Default        | Description               |
| -------------------- | -------------- | ------------------------- |
| `JWT_ACCESS_SECRET`  | Dev secret     | Access token signing key  |
| `JWT_REFRESH_SECRET` | Dev secret     | Refresh token signing key |
| `JWT_ACCESS_TTL`     | `15m`          | Access token lifetime     |
| `JWT_REFRESH_TTL`    | `7d`           | Refresh token lifetime    |
| `JWT_ISSUER`         | `noviq-api`    | JWT issuer claim          |
| `JWT_AUDIENCE`       | `noviq-client` | JWT audience claim        |

### Email (Nodemailer)

| Variable         | Default              | Description            |
| ---------------- | -------------------- | ---------------------- |
| `EMAIL_HOST`     | `localhost`          | SMTP server host       |
| `EMAIL_PORT`     | `587`                | SMTP server port       |
| `EMAIL_USER`     | —                    | SMTP auth username     |
| `EMAIL_PASSWORD` | —                    | SMTP auth password     |
| `EMAIL_FROM`     | `noreply@noviq.com`  | Default sender address |
| `EMAIL_SECURE`   | `false`              | Use TLS (`true` for 465) |

### Logging

| Variable        | Default | Description          |
| --------------- | ------- | -------------------- |
| `LOG_LEVEL`     | `info`  | Winston log level    |
| `LOG_DIR`       | `logs`  | Log output directory |
| `LOG_MAX_SIZE`  | `20m`   | Max log file size    |
| `LOG_MAX_FILES` | `14d`   | Log retention period |

### Rate Limiting

| Variable         | Default | Description             |
| ---------------- | ------- | ----------------------- |
| `THROTTLE_TTL`   | `60000` | Rate limit window (ms)  |
| `THROTTLE_LIMIT` | `100`   | Max requests per window |

### AWS S3

| Variable                        | Default   | Description         |
| ------------------------------- | --------- | ------------------- |
| `AWS_REGION`                    | —         | AWS region          |
| `AWS_ACCESS_KEY_ID`             | —         | AWS access key      |
| `AWS_SECRET_ACCESS_KEY`         | —         | AWS secret key      |
| `S3_BUCKET_NAME`                | —         | S3 bucket name      |
| `S3_ENDPOINT`                   | —         | Custom S3 endpoint  |
| `S3_FORCE_PATH_STYLE`           | `false`   | Use path-style URLs |
| `S3_PUBLIC_BASE_URL`            | —         | CDN base URL        |
| `S3_SIGNED_URL_EXPIRES_SECONDS` | `900`     | Signed URL lifetime |
| `S3_KEY_PREFIX`                 | `uploads` | Object key prefix   |

---

## Appendix A: Dependency Injection Tokens

| Token               | Value                             | Module       |
| ------------------- | --------------------------------- | ------------ |
| `REDIS_CLIENT`      | `Symbol('REDIS_CLIENT')`          | Cache        |
| `JWT_CONFIG`        | `Symbol.for('JWT_CONFIG')`        | Security/JWT |
| `S3_CLIENT`         | `Symbol.for('S3_CLIENT')`         | Storage      |
| `S3_STORAGE_CONFIG` | `Symbol.for('S3_STORAGE_CONFIG')` | Storage      |
| `MAIL_TRANSPORTER`  | `'MAIL_TRANSPORTER'`              | Mail         |

## Appendix B: Git Workflow

- **Main Branch**: `master`
- **Current Branch**: `auth` (authentication feature development)
- **Commit Convention**: Informal (short messages like "updated.", "Update.")

## Appendix C: Code Quality Tools

| Tool     | Config                            | Description                    |
| -------- | --------------------------------- | ------------------------------ |
| ESLint   | `eslint.config.mjs` (flat config) | TypeScript-aware linting       |
| Prettier | `.prettierrc`                     | Single quotes, trailing commas |

> **ESLint Rules:**
>
> - `@typescript-eslint/no-explicit-any`: **off** (allowed)
> - `@typescript-eslint/no-floating-promises`: **warn**
> - `@typescript-eslint/no-unsafe-argument`: **warn**

---

> **Document Version:** 1.0  
> **Generated:** 2026-07-15  
> **Repository:** `noviq-api` — The backend powering the Noviq learning platform.
