# Biblioteca API — Parcial 1 (Programación Web 2)

API REST para la gestión de préstamos de biblioteca construida con **Express 5**, **Prisma 7** y **PostgreSQL**.

## Requisitos previos

- Node.js 20+
- Docker (para la base de datos PostgreSQL)

## Configuración del entorno

1. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
DATABASE_URL="postgresql://campuseats:campuseats123@localhost:5433/biblioteca"
PORT=4000
JWT_SECRET="secreto_super_seguro"
```

> Si creas un contenedor nuevo para la biblioteca:
> ```bash
> docker run --name biblioteca-db -e POSTGRES_USER=biblio -e POSTGRES_PASSWORD=secreto123 -e POSTGRES_DB=biblioteca -p 5433:5432 -d postgres:16
> ```
> Usa la URL: `postgresql://biblio:secreto123@localhost:5433/biblioteca`

2. Instala las dependencias:

```bash
npm install
```

3. Ejecuta las migraciones y genera el cliente de Prisma 7:

```bash
npx prisma migrate dev --config prisma7.config.ts
npx prisma generate --config prisma7.config.ts
```

4. (Opcional) Poblar la base de datos con datos de prueba (seed):

```bash
npx prisma db seed --config prisma7.config.ts
```

## Ejecución

- **Modo desarrollo** (con recarga automática):
  ```bash
  npm run dev
  ```
- **Modo producción**:
  ```bash
  npm start
  ```

El servidor quedará disponible en `http://localhost:4000`.

## Estructura del proyecto

```text
Parcial-1/
├── prisma/
│   ├── schema.prisma       # Esquema de base de datos
│   └── seed.js             # Datos iniciales
├── src/
│   ├── controllers/        # Controladores HTTP
│   ├── middlewares/        # Validación y manejo centralizado de errores
│   ├── routes/             # Definición de endpoints y reglas de express-validator
│   ├── services/           # Lógica de negocio y consultas con Prisma
│   ├── app.js              # Configuración de Express
│   ├── db.js               # Instancia de PrismaClient con @prisma/adapter-pg
│   ├── errores.js          # Clases y helpers de errores HTTP
│   └── server.js           # Punto de entrada del servidor
├── prisma7.config.ts       # Configuración de Prisma 7
└── package.json
```
