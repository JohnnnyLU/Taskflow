# TaskFlow

Fullstack MVP for managing projects and tasks.

## Stack

- Frontend: Next.js, React, TypeScript, TailwindCSS, Zustand, TanStack Query, axios, react-hook-form, zod.
- Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL, JWT, bcrypt, zod.

## MVP Features

- Register, login, logout.
- JWT protected routes.
- `GET /auth/me`.
- Create, list, open and delete projects.
- Create, list and delete project tasks.
- Update task status.
- Filter tasks by status.
- Basic form validation.
- Loading, error and empty states.

## Setup

Install dependencies:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Create backend environment:

```bash
cp backend/.env.example backend/.env
```

The backend `.env` should contain:

```env
PORT=4000
DATABASE_URL="postgresql://taskflow:taskflow@localhost:5433/taskflow?schema=public"
JWT_SECRET="your_jwt_secret"
```

Create frontend environment:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Database

Start PostgreSQL:

```bash
docker compose up -d postgres
```

Run Prisma migrations from the backend directory:

```bash
cd backend
npm run prisma:migrate
```

## Docker

Detailed Docker usage is documented in [docs/docker.md](docs/docker.md).
Production deployment is documented in [docs/deployment.md](docs/deployment.md).

Start PostgreSQL, backend and frontend:

```bash
docker compose up --build -d
```

Apply Prisma migrations inside the backend container:

```bash
docker compose exec backend npm run prisma:deploy
```

Check backend health:

```bash
curl http://localhost:4000/health
```

Open the frontend:

```text
http://localhost:3000
```

Stop services:

```bash
docker compose down
```

## Development

Start backend:

```bash
cd backend
npm run dev
```

Start frontend:

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:3000`.
Backend runs on `http://localhost:4000`.

## Checks

Backend:

```bash
cd backend
npm run build
```

Frontend:

```bash
cd frontend
npm run check
```
