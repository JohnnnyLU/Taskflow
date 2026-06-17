# Production Deployment

The production setup uses three managed services:

- Frontend: Netlify
- Backend: Render
- Database: Neon PostgreSQL

## URLs

Production URLs should be stored in the hosting dashboards, not committed to the repository.

- Frontend URL: Netlify site URL
- Backend URL: Render web service URL
- Database URL: Neon connection string

## Backend: Render

Render deploys the backend from the GitHub repository using Docker.

Recommended service settings:

```text
Runtime: Docker
Branch: main
Root Directory: backend
Docker Build Context Directory: backend/
Dockerfile Path: backend/Dockerfile
Health Check Path: /health
Auto-Deploy: On Commit
```

Leave these empty unless there is a specific reason to override them:

```text
Docker Command
Pre-Deploy Command
```

The free Render plan does not support pre-deploy commands, so Prisma migrations are applied manually from a local machine.

## Backend Environment Variables

Set these in the Render service environment:

```env
PORT=4000
NODE_ENV=production
DATABASE_URL=<Neon pooled connection string>
DIRECT_URL=<Neon direct connection string>
JWT_SECRET=<strong random secret>
```

Use a generated secret for `JWT_SECRET`, for example:

```bash
openssl rand -base64 32
```

Do not use local development secrets in production.

## Database: Neon

Neon provides two useful connection strings:

- Pooled URL: use as `DATABASE_URL`
- Direct URL: use as `DIRECT_URL`

`DATABASE_URL` is used by the running backend application.
`DIRECT_URL` is used by Prisma for migrations.

Both URLs should include SSL settings from Neon, for example:

```text
sslmode=require
```

Do not commit Neon URLs to the repository.

## Apply Production Migrations

Because Render free instances do not support pre-deploy commands, apply migrations manually from the backend package.

Temporarily set `backend/.env` to the Neon production URLs:

```env
PORT=4000
DATABASE_URL=<Neon pooled connection string>
DIRECT_URL=<Neon direct connection string>
JWT_SECRET=local_migration_secret
```

Run migrations:

```bash
cd backend
npm run prisma:deploy
```

Expected result:

```text
No pending migrations to apply.
```

or Prisma applies the pending migration.

After migrations, restore `backend/.env` to local development values:

```env
PORT=4000
DATABASE_URL="postgresql://taskflow:taskflow@localhost:5433/taskflow?schema=public"
DIRECT_URL="postgresql://taskflow:taskflow@localhost:5433/taskflow?schema=public"
JWT_SECRET="your_jwt_secret"
```

## Frontend: Netlify

Netlify deploys the frontend from the same GitHub repository.

The repository includes `netlify.toml`, which defines the build:

```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = ".next"
```

The project also uses `@netlify/plugin-nextjs` so Netlify handles Next.js routing and runtime correctly.

## Frontend Environment Variables

Set this in Netlify:

```env
NEXT_PUBLIC_API_URL=<Render backend URL>
```

Example:

```env
NEXT_PUBLIC_API_URL=https://taskflow-backend.onrender.com
```

Do not add a trailing slash.

Set it for production deploys. If preview deploys should talk to the same backend, set it for preview deploys too.

## Deployment Order

For ordinary frontend or backend code changes:

1. Push to `main`.
2. GitHub Actions should pass.
3. Render auto-deploys backend changes.
4. Netlify auto-deploys frontend changes.

For database schema changes:

1. Create and commit a Prisma migration locally.
2. Push to `main`.
3. Wait for CI to pass.
4. Run `npm run prisma:deploy` against Neon.
5. Confirm Render backend is healthy.

## Production Checks

Check backend health:

```bash
curl https://<render-backend-url>/health
```

Expected response:

```json
{ "status": "ok" }
```

Check the frontend:

```text
https://<netlify-site-url>
```

End-to-end smoke test:

1. Open the Netlify site.
2. Register a new user.
3. Confirm the app redirects to the dashboard.
4. Create or load projects/tasks.

## Common Issues

If the frontend shows a 404 on Netlify, check the deploy logs for the Next.js plugin/OpenNext runtime. A healthy deploy should not publish `.next` as a plain static directory without Next runtime support.

If backend requests fail from the browser, confirm `NEXT_PUBLIC_API_URL` points to the Render backend URL and does not include a trailing slash.

If Prisma fails with `DIRECT_URL` missing, add `DIRECT_URL` to the environment where Prisma is running.

If registration fails while `/health` works, check Render logs and confirm Neon migrations were applied.
