# Source Layout

This backend uses a module-first NestJS layout designed for growth.

- `core`: process-wide setup such as config, rate limiting, bootstrap helpers, and Swagger.
- `common`: reusable DTOs, decorators, guards, filters, interceptors, pipes, and utilities.
- `infrastructure`: technical adapters such as database, cache, queue, storage, mail, and telemetry.
- `modules`: business capabilities. Each feature can own its application, domain, infrastructure, and presentation layers.
- `shared`: cross-module providers that are stable and intentionally shared.

Feature modules should keep business logic close to the feature and expose only their Nest module boundary.
