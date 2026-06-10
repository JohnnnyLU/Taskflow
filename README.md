# TaskFlow

Fullstack MVP for managing projects and tasks.

## Stack

- Frontend: Next.js, React, TypeScript, TailwindCSS, Zustand, TanStack Query, axios, react-hook-form, zod.
- Backend: Node.js, Express, TypeScript, Prisma, SQLite, JWT, bcrypt, zod.

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
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_jwt_secret"
```

Create frontend environment:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Database

Run Prisma migrations from the backend directory:

```bash
cd backend
npm run prisma:migrate
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
