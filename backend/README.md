# Debts API (NestJS) — Clean Architecture (Purista) + Feature-based (Screaming)

Backend

- **Auth (JWT)**: register / login / me
- **Debts**: crear, listar, obtener, actualizar, pagar, eliminar + reglas de negocio
- **Postgres (TypeORM)** + **Redis (cache)**
- **Swagger UI** en `/docs` (con candados + schemas completos)
- **Swagger CLI Plugin** (inferencias automáticas desde TS + class-validator + JSDoc)

---

## Tabla de contenidos

- [Stack](#stack)
- [Arquitectura](#arquitectura)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos](#requisitos)
- [Quickstart](#quickstart)
- [Variables de entorno](#variables-de-entorno)
- [Scripts](#scripts)
- [Swagger (OpenAPI)](#swagger-openapi)
- [Endpoints](#endpoints)
- [Cache con Redis](#cache-con-redis)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Checklist “Yo debo” (demo entrevista)](#checklist-yo-debo-demo-entrevista)

---

## Stack

- NestJS + TypeScript
- TypeORM + Postgres
- Redis (cache)
- JWT (passport-jwt)
- class-validator (validación)
- Swagger/OpenAPI (documentación)

---

## Arquitectura

### Clean Architecture

- **Domain**: reglas de negocio puras (sin Nest/TypeORM/Redis).
- **Application**: casos de uso (orquestan dominio) + puertos.
- **Infrastructure**: adapters (DB, JWT, bcrypt, Redis).
- **Presentation**: controllers, DTOs request/response, guards/strategies, Swagger decorators.

### Feature-based (Screaming Architecture)

Todo se organiza por *features*:

- `features/auth/...`
- `features/debts/...`
- `features/health/...`

Dentro de cada feature se respeta la separación Clean:

`domain/ application/ infrastructure/ presentation/`

---

## Estructura del proyecto

```
src/
  main.ts
  app.module.ts
  common/
    presentation/
      swagger/
        api-error.response.ts
        ok.response.ts
  features/
    auth/
      domain/
      application/
      infrastructure/
      presentation/
    debts/
      domain/
      application/
      infrastructure/
      presentation/
    health/
      presentation/
```

---

## Requisitos

- Node.js (LTS recomendado)
- Docker + Docker Compose (para Postgres/Redis, según tu `docker-compose.yml`)

---

## Quickstart

### 1) Instalar dependencias

```bash
cd backend
npm install
```

### 2) Levantar servicios (Postgres/Redis)

En la raíz del repo (donde está `docker-compose.yml`):

```bash
docker compose up -d
```

### 3) Configurar `.env`

Crea un `.env` en `backend/` (ver sección [Variables de entorno](#variables-de-entorno)).

### 4) Correr en desarrollo

```bash
cd backend
npm run start:dev
```

### 5) Abrir Swagger UI

- http://localhost:3000/docs

---

## Variables de entorno

Crea `backend/.env` (ejemplo; ajústalo a tu compose):

```env
# App
PORT=3000
JWT_SECRET=change-me-in-prod

# Postgres (según docker-compose.yml)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=debts
DB_USER=postgres
DB_PASS=postgres

# Redis (según docker-compose.yml)
REDIS_URL=redis://localhost:6379

# Cache
CACHE_TTL_SECONDS=30
```

> Tip: usa `@nestjs/config` para cargar `.env` (ConfigModule/ConfigService) y evitar hardcode.

---

## Scripts

En `backend/package.json`:

```bash
# dev (watch)
npm run start:dev

# build
npm run build

# prod
npm run start:prod

# tests
npm run test
npm run test:e2e
npm run test:cov
```

---

## Swagger (OpenAPI)

### UI

- Swagger UI: `GET /docs`

Incluye:

- **Bearer JWT** (candados) y autorización persistente en UI
- Schemas correctos para requests/responses
- Endpoints documentados con `@ApiOkResponse`, `@ApiCreatedResponse`, etc.

### Swagger CLI Plugin (inferencias automáticas)

Este repo usa el **CLI Plugin** en `nest-cli.json` para:

- Reutilizar validaciones de `class-validator` como metadata de schema (`classValidatorShim`)
- Inferir `description` + `example` desde comentarios JSDoc (`introspectComments`)
- Soportar sufijos custom: `.request.ts`, `.response.ts`, `.command.ts`, `.query.ts`, etc.

### Responses tipadas (consistencia)

Se centralizaron modelos de respuesta:

- `src/common/presentation/swagger/api-error.response.ts`
- `src/common/presentation/swagger/ok.response.ts`
- `features/auth/presentation/dto/auth.responses.ts`
- `features/debts/presentation/dto/debt.responses.ts`

Los controllers usan responses tipo:

- `@ApiOkResponse({ type: ... })`
- `@ApiCreatedResponse({ type: ... })`
- `@ApiBadRequestResponse({ type: ApiErrorResponse })`
- etc.

### Cómo probar en Swagger (flujo)

1) **Yo debo** ir a `/docs`.
2) **Yo debo** ejecutar `POST /auth/register` (si el usuario no existe).
3) **Yo debo** ejecutar `POST /auth/login` y copiar `accessToken`.
4) **Yo debo** presionar **Authorize** y pegar:

   - `Bearer <token>`

5) **Yo debo** probar endpoints de `debts` (candado).

---

## Endpoints

### Health

- `GET /health` → status simple (smoke test)

### Auth

- `POST /auth/register`
  - body: `{ email, password }`
  - response: `{ id, email }`

- `POST /auth/login`
  - body: `{ email, password }`
  - response: `{ accessToken }`

- `GET /auth/me` (JWT)
  - header: `Authorization: Bearer <token>`
  - response: `{ userId, email }`

### Debts (JWT)

- `POST /debts` → crea deuda `PENDING`
- `GET /debts?status=PENDING|PAID` → lista deudas del usuario
- `GET /debts/:id` → obtiene deuda (si pertenece al usuario)
- `PATCH /debts/:id` → actualiza (solo si `PENDING`)
- `POST /debts/:id/pay` → marca como `PAID`
- `DELETE /debts/:id` → elimina (típicamente solo `PENDING`)

---

## Cache con Redis

Patrón utilizado: **cache-aside**:

- Lecturas frecuentes (ej. listados) pueden cachearse por usuario/estado.
- Operaciones de escritura (**create/update/pay/delete**) invalidan las claves de lista del usuario.

Ubicación:

- Puerto: `features/debts/application/ports/cache.port.ts`
- Adapter: `features/debts/infrastructure/cache/redis-cache.adapter.ts`
- Keys: `features/debts/application/cache-keys.ts`

---

## Testing

- Unit tests: `npm run test`
- E2E tests: `npm run test:e2e`
- Coverage: `npm run test:cov`

---

## Troubleshooting

### Swagger no refleja cambios

El Swagger CLI Plugin corre en build-time:

```bash
rm -rf dist
npm run start:dev
```

### 401 en endpoints protegidos

- Haz login y pega el token en Swagger (Authorize):
  - `Bearer <token>`

### TypeORM no conecta

- Verifica:
  - `docker compose` arriba
  - `.env` con credenciales correctas
  - host/puerto según `docker-compose.yml`

---
