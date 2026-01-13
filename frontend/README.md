# Debts — Fullstack (Frontend)

Aplicación para gestionar deudas personales con autenticación, listado por estado, detalle, edición, marcación como pagada y exportación.

---

## Requisitos

- Node.js (LTS recomendado)
- npm / pnpm / yarn (usa el que tengas configurado)

---

## Funcionalidades

### Autenticación
- Registro
- Login
- Persistencia del token (storage)
- Protección de rutas (guard)
- Interceptores HTTP para adjuntar token y manejar errores de auth

### Deudas
- Listado por estado (PENDING / PAID)
- Resumen (conteos y totales)
- Detalle de deuda
- Crear deuda
- Editar deuda (restricciones si está pagada, según reglas del backend)
- Marcar como pagada
- Eliminar
- Exportación (CSV / JSON)

---

## Quick start

### 1) Frontend (Angular)

```bash
cd frontend
npm install
npm start
# o: ng serve
```

Por defecto el front queda en:

- `http://localhost:4200`

#### Configuración de API Base URL

El frontend usa un `API_BASE_URL` / token de configuración (por ejemplo `api-base-url.token.ts`)
y/o `environments/environment*.ts`.

Verifica que apunte al backend:

- `http://localhost:3000`

---

## Comandos útiles

### Frontend
```bash
npm start             # dev server
npm run build         # build producción
npm run test          # tests
npm run lint          # lint
```

> Los scripts exactos dependen del `package.json` de cada carpeta.

---

## Frontend: organización y convenciones

### Arquitectura
- **Feature-first**: `features/auth`, `features/debts`
- **Core**: auth, http, tokens, interceptores
- **Shared UI**: componentes visuales reutilizables

### UI / Atomic Design
Los estilos y componentes reutilizables viven en:

`src/app/shared/ui/`

- `atoms/`: button, input, card, badge, alert, skeleton, textarea
- `molecules/`: form-field, page-header
- `organisms/`: top-nav
- `templates/`: shell, home

**Regla práctica:**
- Las páginas (`features/**/pages`) componen UI usando `<ui-*>` y layout con Tailwind.
- Los componentes `ui-*` son la “fuente de verdad” visual (consistencia).

### Tailwind
- Estilos globales mínimos en `src/styles.css` (tokens/primitivas: `.page`, `.section-title`, `.muted`, etc.)
- Evitar “clases utilitarias” duplicadas en muchas páginas si ya existe un `ui-*` que resuelve el patrón.

---

## API / Contratos

Los modelos de frontend viven en:

- `features/auth/models`
- `features/debts/models`

Estos contratos se alinean con los DTOs/respuestas del backend:
- `Debt`, `DebtStatus`, `DebtSummary`, requests de create/update, etc.

---

## Troubleshooting

### `ERR_CONNECTION_REFUSED` al hacer login
- Backend apagado o puerto distinto al configurado en el frontend.
- Solución típica: reiniciar backend y verificar `API_BASE_URL`.

### Tailwind: `Cannot apply unknown utility class ...`
- Ocurre si se intenta `@apply` sobre una clase que Tailwind no conoce o si se aplica una clase custom dentro de otra con `@apply`.
- Mantén `styles.css` con utilidades conocidas o estilos propios simples, y evita “encadenar” custom classes con `@apply` si tu configuración no lo soporta.

---
