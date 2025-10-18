# WAEM API

A minimal NestJS + Prisma REST API for managing users and shifts with PostgreSQL. Validation is powered by Zod and passwords are stored using bcrypt hashes. The project keeps only the essential files so you can focus on CRUD logic.

## Prerequisites

- Node.js 20+
- PostgreSQL database
- `DATABASE_URL` environment variable pointing to your PostgreSQL instance

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Generate the Prisma client and apply migrations:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The API runs on `http://localhost:3000` by default.

## Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start NestJS in watch mode using `ts-node-dev`. |
| `npm run build` | Compile TypeScript to JavaScript into the `dist` folder. |
| `npm start` | Run the compiled application from the `dist` folder. |
| `npm run prisma:generate` | Generate the Prisma client. |
| `npm run prisma:migrate` | Run Prisma migrations in development. |
| `npm run prisma:studio` | Open Prisma Studio for inspecting your data. |

## API overview

### Users

- `POST /users` – Create a user (name, email, password).
- `GET /users` – List users.
- `GET /users/:id` – Get a single user.
- `PATCH /users/:id` – Update user information or password.
- `DELETE /users/:id` – Remove a user.

### Shifts

- `POST /shifts` – Create a shift (optionally link to a user by `ownerId`).
- `GET /shifts` – List all shifts with owner info.
- `GET /shifts/:id` – Get a specific shift.
- `PATCH /shifts/:id` – Update shift details.
- `DELETE /shifts/:id` – Remove a shift.

## Validation and security

- Requests are validated with global Zod pipes.
- Passwords are hashed with bcrypt before being stored.
- Responses omit password hashes by default.

## Testing the API quickly

You can use `curl` or any REST client. Example for creating a user:

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"P@ssw0rd1"}'
```

## License

MIT
