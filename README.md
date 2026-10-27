# Biblioteca API — Parcial 1 (Programación Web 2)

API REST para la gestión de catálogo y préstamos de una biblioteca universitaria, construida con **Express 5**, **Prisma 7** y **PostgreSQL 16** bajo una arquitectura en capas (`routes` → `controllers` → `services`).

## 1. Levantar el proyecto desde cero

### Base de datos (Docker)
```bash
docker run --name biblioteca-db -e POSTGRES_USER=biblio -e POSTGRES_PASSWORD=secreto123 -e POSTGRES_DB=biblioteca -p 5433:5432 -d postgres:16
```

### Variables de entorno e instalación
Copia `.env.example` a `.env` y ejecuta:

```bash
cp .env.example .env
npm install
npx prisma migrate dev --config prisma7.config.ts
npx prisma generate --config prisma7.config.ts
npx prisma db seed --config prisma7.config.ts
```

### Ejecución
```bash
npm run dev   # Desarrollo (nodemon) en http://localhost:4000
npm start     # Producción
```

## 2. Base de datos y Seed

El esquema (`prisma/schema.prisma`) define tres modelos y un enum:
- **`Socio`**: `id`, `nombre`, `email` (único), `creadoEn`.
- **`Libro`**: `id`, `titulo`, `autor`, `isbn` (único), `ejemplaresTotales`, `ejemplaresDisponibles`.
- **`Prestamo`**: `id`, `socioId`, `libroId`, `estado` (`EstadoPrestamo`: `ACTIVO` | `DEVUELTO`), `fechaPrestamo`, `fechaLimite`, `fechaDevolucion` (opcional).

El seed (`prisma/seed.js`) carga **3 socios**, **5 libros** y **3 préstamos activos** del socio 3 con fecha límite a 14 días.

## 3. Endpoints

| Código | Método y Ruta | Descripción | Parámetros / Body | Respuestas |
| :--- | :--- | :--- | :--- | :--- |
| **L1** | `GET /api/libros` | Lista libros ordenados por título (`asc`) con filtros y paginación | Query: `buscar`, `disponibles` (`true`\|`false`), `pagina` ($\ge 1$), `porPagina` ($1..20$) | `200`, `400` |
| **L2** | `GET /api/libros/:id` | Obtiene el detalle de un libro por su `id` | Param: `id` (entero positivo) | `200`, `400`, `404` |
| **L3** | `POST /api/libros` | Registra un nuevo libro | Body: `{ titulo, autor, isbn, ejemplares (1..50) }` | `201`, `400`, `409` |
| **P1** | `POST /api/prestamos` | Crea un préstamo a 14 días (transaccional y resistente a carrera) | Body: `{ socioId, libroId }` | `201`, `400`, `404`, `409` |
| **P2** | `PATCH /api/prestamos/:id/devolucion` | Devuelve un préstamo y repone 1 ejemplar disponible | Param: `id` (sin body) | `200`, `400`, `404`, `409` |
| **P3** | `GET /api/socios/:id/prestamos` | Historial de préstamos de un socio (más reciente a más antiguo, sin N+1) | Param: `id`, Query: `estado` (`ACTIVO`\|`DEVUELTO`) | `200`, `400`, `404` |

## 4. Arquitectura

- `src/routes/`: Validación de formato de entrada con `express-validator` y `validar.js`.
- `src/controllers/`: Traducción entre HTTP (`req`, `res`, `next`) y la capa de negocio.
- `src/services/`: Reglas de negocio, transacciones (`$transaction`) y errores semánticos (`noEncontrado`, `conflicto`).
- `src/middlewares/`: Validación (`validar.js`) y manejador único de errores (`errores.js`).
