# Docker

This project can run the full local stack with Docker Compose:

- PostgreSQL on `localhost:5433`
- Backend on `http://localhost:4000`
- Frontend on `http://localhost:3000`

## Start The Stack

```bash
docker compose up --build -d
```

The `--build` flag rebuilds local backend and frontend images when Dockerfiles or source files change.

## Apply Database Migrations

Run Prisma migrations after PostgreSQL and backend are up:

```bash
docker compose exec backend npm run prisma:deploy
```

Use `prisma:deploy` for Docker/production-like environments. Use `prisma:migrate` only during local schema development.

## Check Services

Check running containers:

```bash
docker compose ps
```

Check backend health:

```bash
curl http://localhost:4000/health
```

Open frontend:

```text
http://localhost:3000
```

## Logs

Show logs for all services:

```bash
docker compose logs -f
```

Show logs for one service:

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

## Stop The Stack

```bash
docker compose down
```

This stops containers but keeps the PostgreSQL volume.

## Reset Local Database

Use this only when you want to delete local Docker database data:

```bash
docker compose down -v
docker compose up --build -d
docker compose exec backend npm run prisma:deploy
```

## Rebuild One Service

```bash
docker compose build backend
docker compose build frontend
```

Then restart:

```bash
docker compose up -d
```

## Common Issues

If port `4000` is already in use, stop the old backend container or local backend process:

```bash
docker ps
docker stop <container-name>
```

If port `3000` is already in use, stop the old frontend container or local frontend process.

Inside Docker, backend connects to PostgreSQL through:

```text
postgres:5432
```

From the host machine, PostgreSQL is available at:

```text
localhost:5433
```
