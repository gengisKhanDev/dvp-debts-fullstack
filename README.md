# Debts — Fullstack (Angular + NestJS) + Postgres + Redis

Repo fullstack para gestionar deudas personales con autenticación (JWT), reglas de negocio y UI consistente basada en componentes `ui-*` (Atomic Design).

- **Frontend:** `frontend/` (Angular)
- **Backend:** `backend/` (NestJS, Clean Architecture)
- **Infra local:** `docker-compose.yml` (Postgres + Redis)

> Dentro de `frontend/` y `backend/` hay un **README propio** con detalles de arquitectura, scripts y troubleshooting.

---

## Tabla de contenidos

- [Servicios y puertos](#servicios-y-puertos)
- [Requisitos](#requisitos)
- [Quickstart (orden recomendado)](#quickstart-orden-recomendado)
- [Docker (Postgres + Redis)](#docker-postgres--redis)
- [Cómo iniciar Backend](#cómo-iniciar-backend)
- [Cómo iniciar Frontend](#cómo-iniciar-frontend)
- [Estructura del repo](#estructura-del-repo)
- [Notas rápidas](#notas-rápidas)

---

## Servicios y puertos

- **Postgres:** `localhost:5432`
- **Redis:** `localhost:6379`
- **Backend (NestJS):** `http://localhost:3000`
- **Frontend (Angular):** `http://localhost:4200`

---

## Requisitos

- Docker + Docker Compose
- Node.js (LTS recomendado) + npm (o pnpm/yarn si el proyecto lo usa)

---

## Quickstart (orden recomendado)

1) **Levantar infraestructura (DB + Redis)**
2) **Levantar Backend**
3) **Levantar Frontend**

---

## Docker (Postgres + Redis)

En la **raíz del repo** (donde está `docker-compose.yml`):

### Levantar servicios

```bash
docker compose up -d
```

### Ver estado

```bash
docker compose ps
```

### Ver logs

```bash
docker compose logs -f
```

### Apagar servicios

```bash
docker compose down
```

### Apagar y borrar volúmenes (⚠️ borra datos locales)

```bash
docker compose down -v
```

### Credenciales por defecto (según `docker-compose.yml`)

**Postgres**
- User: `debts`
- Password: `debts`
- DB: `debtsdb`
- Host: `localhost`
- Port: `5432`

**Redis**
- URL típica: `redis://localhost:6379`

> Importante: asegura que el `.env` del backend use estas mismas credenciales (o ajusta el compose).

---

## Cómo iniciar Backend

1) Entra a `backend/` y sigue su README:

```bash
cd backend
```

2) Instala y corre (los comandos exactos están en `backend/README.md`):

```bash
npm install
npm run start:dev
```

3) Swagger (si aplica) normalmente queda en:

- `http://localhost:3000/docs`

---

## Cómo iniciar Frontend

1) Entra a `frontend/` y sigue su README:

```bash
cd frontend
```

2) Instala y corre (los comandos exactos están en `frontend/README.md`):

```bash
npm install
npm start
```

3) Abre la app en:

- `http://localhost:4200`

> Si el frontend usa `API_BASE_URL` en `environments/*` o un token, verifica que apunte a `http://localhost:3000`.

---

## Estructura del repo

```text
.
├── docker-compose.yml
├── backend/
│   └── README.md
├── frontend/
│   └── README.md
└── README.md  ← (este archivo)
```

---

## Notas rápidas

- Si el backend no conecta a DB: revisa que `docker compose` esté arriba y que el `.env` coincida con el compose.
- Si el frontend falla por CORS o `ERR_CONNECTION_REFUSED`: verifica backend encendido y `API_BASE_URL`.
- Para una guía más profunda:
  - **Backend:** Clean Architecture + Swagger + Redis cache-aside → `backend/README.md`
  - **Frontend:** feature-first + shared UI (atoms/molecules/organisms/templates) → `frontend/README.md`
