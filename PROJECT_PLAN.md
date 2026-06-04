# TaskFlow — 4-дневный MVP

## Цель проекта

**TaskFlow** — fullstack-приложение для управления проектами и задачами.

Главная цель — за короткий срок закрепить стек:

- Next.js

- React

- TypeScript

- TailwindCSS

- Zustand

- TanStack Query

- axios

- JWT auth

- react-hook-form

- zod

- @hookform/resolvers

- ESLint

- Prettier

- Node.js

- Express

- Prisma

- SQLite


Проект не должен быть идеальным production-приложением. Цель — сделать рабочий MVP, где каждая технология используется по делу.

---
# 1. Идея проекта

Пользователь может:

- зарегистрироваться;

- войти в аккаунт;

- открыть protected dashboard;

- создавать проекты;

- открывать конкретный проект;

- создавать задачи внутри проекта;

- менять статус задач;

- удалять задачи;

- фильтровать задачи по статусу;

- выйти из аккаунта.


---
# 2. MVP scope

## Обязательно сделать

-  Register

-  Login

-  Logout

-  Protected routes

-  JWT Authorization

-  `GET /auth/me`

-  Создание проекта

-  Получение списка проектов

-  Получение одного проекта

-  Удаление проекта

-  Создание задачи внутри проекта

-  Получение задач проекта

-  Изменение status задачи

-  Удаление задачи

-  Фильтр задач по status

-  Базовая validation форм

-  Loading / error / empty states

-  README


## Не делать в MVP

- Google Auth

- refresh token

- cookies

- roles / permissions

- teams

- comments

- notifications

- file upload

- WebSocket

- Docker

- CI/CD

- drag and drop

- pagination

- сложную дизайн-систему


---
# 3. Стек

## Frontend

- **Next.js** — frontend framework, routing, pages, layouts.

- **React** — UI.

- **TypeScript** — типизация.

- **TailwindCSS** — стили.

- **Zustand** — client state.

- **TanStack Query** — server state.

- **axios** — HTTP client.

- **react-hook-form** — формы.

- **zod** — validation schema.

- **@hookform/resolvers** — связка `react-hook-form` и `zod`.

- **ESLint + Prettier** — качество и форматирование кода.


## Backend

- **Node.js**

- **Express**

- **TypeScript**

- **Prisma**

- **SQLite**

- **JWT**

- **bcrypt**

- **zod**


---
# 4. Страницы

```txt
/login
/register
/dashboard
/projects
/projects/[projectId]
```

## `/login`

Форма входа.

Поля:

- email

- password


Используется:

- `react-hook-form`

- `zod`

- `axios`

- `Zustand`

- `JWT`


---

## `/register`

Форма регистрации.

Поля:

- name

- email

- password


Используется:

- `react-hook-form`

- `zod`

- `@hookform/resolvers`


---

## `/dashboard`

Protected page.

Показывает:

- приветствие пользователя;

- количество проектов;

- ссылку на projects.


---

## `/projects`

Страница проектов.

Фичи:

- список проектов;

- создание проекта;

- удаление проекта;

- переход на страницу проекта.


---

## `/projects/[projectId]`

Страница конкретного проекта.

Фичи:

- информация о проекте;

- список задач;

- создание задачи;

- изменение статуса задачи;

- удаление задачи;

- фильтр задач по status.


---
# 5. Сущности

## User

```ts
type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};
```

## Project

```ts
type Project = {
  id: string;
  title: string;
  description?: string;
  ownerId: string;
  createdAt: string;
};
```

## Task

```ts
type Task = {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  projectId: string;
  userId: string;
  createdAt: string;
};
```

---
# 6. Backend endpoints

## Auth

```txt
POST /auth/register
POST /auth/login
GET  /auth/me
```

### `POST /auth/register`

Request:

```json
{
  "name": "Steve",
  "email": "steve@example.com",
  "password": "123456"
}
```

Response:

```json
{
  "user": {
    "id": "user_id",
    "name": "Steve",
    "email": "steve@example.com"
  },
  "accessToken": "jwt_token"
}
```

---
### `POST /auth/login`

Request:

```json
{
  "email": "steve@example.com",
  "password": "123456"
}
```

Response:

```json
{
  "user": {
    "id": "user_id",
    "name": "Steve",
    "email": "steve@example.com"
  },
  "accessToken": "jwt_token"
}
```

---
### `GET /auth/me`

Headers:

```txt
Authorization: Bearer <accessToken>
```

Response:

```json
{
  "id": "user_id",
  "name": "Steve",
  "email": "steve@example.com"
}
```

---
## Projects

```txt
GET    /projects
POST   /projects
GET    /projects/:projectId
DELETE /projects/:projectId
```

### `POST /projects`

Request:

```json
{
  "title": "Frontend Learning",
  "description": "Project for learning Next.js stack"
}
```

Response:

```json
{
  "id": "project_id",
  "title": "Frontend Learning",
  "description": "Project for learning Next.js stack",
  "ownerId": "user_id",
  "createdAt": "2026-06-02T10:00:00.000Z"
}
```

---
## Tasks

```txt
GET    /projects/:projectId/tasks
POST   /projects/:projectId/tasks
PATCH  /tasks/:taskId/status
DELETE /tasks/:taskId
```

### `POST /projects/:projectId/tasks`

Request:

```json
{
  "title": "Setup Next.js",
  "description": "Create frontend project",
  "priority": "high"
}
```

Response:

```json
{
  "id": "task_id",
  "title": "Setup Next.js",
  "description": "Create frontend project",
  "status": "todo",
  "priority": "high",
  "projectId": "project_id",
  "userId": "user_id",
  "createdAt": "2026-06-02T10:00:00.000Z"
}
```

---
### `PATCH /tasks/:taskId/status`

Request:

```json
{
  "status": "done"
}
```

Response:

```json
{
  "id": "task_id",
  "title": "Setup Next.js",
  "status": "done",
  "priority": "high"
}
```

---
# 7. Frontend структура

```txt
frontend/
  src/
    app/
      login/
        page.tsx
      register/
        page.tsx
      dashboard/
        page.tsx
      projects/
        page.tsx
        [projectId]/
          page.tsx

    shared/
      api/
        axios-instance.ts
      ui/
        button.tsx
        input.tsx
        textarea.tsx
        select.tsx

    entities/
      user/
        types.ts
      project/
        types.ts
        api.ts
      task/
        types.ts
        api.ts

    features/
      auth/
        login-form.tsx
        register-form.tsx
      project/
        create-project-form.tsx
      task/
        create-task-form.tsx
        task-status-select.tsx

    widgets/
      header.tsx
      project-list.tsx
      task-list.tsx

    store/
      auth-store.ts
      task-filters-store.ts

    providers/
      query-provider.tsx
```

---
# 8. Backend структура

```txt
backend/
  src/
    app.ts
    server.ts

    config/
      env.ts

    modules/
      auth/
        auth.routes.ts
        auth.controller.ts
        auth.service.ts
        auth.schemas.ts

      projects/
        projects.routes.ts
        projects.controller.ts
        projects.service.ts
        projects.schemas.ts

      tasks/
        tasks.routes.ts
        tasks.controller.ts
        tasks.service.ts
        tasks.schemas.ts

    middlewares/
      auth.middleware.ts
      error.middleware.ts
      validate.middleware.ts

    lib/
      prisma.ts
      jwt.ts
      password.ts

  prisma/
    schema.prisma
```

---
# 9. Где используется каждая технология

## Next.js

Используется для:

- routing;

- pages;

- layouts;

- dynamic routes;

- protected pages.


---
## Zustand

Используется для client state:

- access token;

- auth state;

- sidebar/modal state, если будет;

- task filters.


Важно:

> Projects и tasks лучше хранить не в Zustand, а в TanStack Query.

---
## TanStack Query

Используется для server state:

- current user;

- projects;

- single project;

- tasks;

- create/update/delete mutations.


Основные темы:

- `useQuery`

- `useMutation`

- `queryKey`

- `invalidateQueries`

- `loading`

- `error`

- `cache`


---
## axios

Используется для:

- общего API client;

- `baseURL`;

- добавления `Authorization: Bearer <token>`;

- обработки `401`.


---
## react-hook-form + zod

Используется для форм:

- login;

- register;

- create project;

- create task.


---
## JWT

Flow:

```txt
User logs in
↓
Backend returns accessToken
↓
Frontend saves token
↓
axios adds Authorization header
↓
Backend checks token in auth middleware
↓
Protected endpoints return user data
```

---
# 10. План разработки на 4 дня

# День 1 — Backend foundation + Auth

## Цель

Поднять backend и сделать JWT auth.

## Задачи

-  Создать структуру проекта:


```txt
taskflow/
  backend/
  frontend/
  README.md
```

-  Инициализировать backend.

-  Настроить TypeScript.

-  Настроить Express.

-  Подключить Prisma.

-  Подключить SQLite.

-  Создать Prisma models:

    - User

    - Project

    - Task

-  Сделать migration.

-  Настроить `.env`.

-  Настроить error middleware.

-  Настроить validate middleware.

-  Сделать auth routes:

    - register

    - login

    - me

-  Добавить bcrypt.

-  Добавить JWT utils.

-  Добавить auth middleware.


## Результат дня

Должно работать:

```txt
POST /auth/register
POST /auth/login
GET /auth/me
```

Проверить через Postman / Insomnia / Thunder Client.

---
# День 2 — Frontend foundation + Auth

## Цель

Поднять Next.js frontend и подключить авторизацию.

## Задачи

-  Создать Next.js project.

-  Настроить TypeScript.

-  Настроить TailwindCSS.

-  Настроить ESLint + Prettier.

-  Установить зависимости:


```bash
npm install axios zustand @tanstack/react-query react-hook-form zod @hookform/resolvers
```

-  Создать axios instance.

-  Создать auth store через Zustand.

-  Добавить TanStack Query Provider.

-  Сделать `/login`.

-  Сделать `/register`.

-  Сделать logout.

-  Сделать protected wrapper/layout.

-  Сделать `/dashboard`.

-  Подключить `GET /auth/me`.


## Результат дня

Должно работать:

```txt
User can register
User can login
User can open dashboard
User can logout
Unauthorized user cannot open protected pages
```

---
# День 3 — Projects + Tasks

## Цель

Сделать основной функционал приложения.

## Backend задачи

-  `GET /projects`

-  `POST /projects`

-  `GET /projects/:projectId`

-  `DELETE /projects/:projectId`

-  `GET /projects/:projectId/tasks`

-  `POST /projects/:projectId/tasks`

-  `PATCH /tasks/:taskId/status`

-  `DELETE /tasks/:taskId`


## Frontend задачи

-  Создать `/projects`.

-  Сделать `useProjectsQuery`.

-  Сделать `useCreateProjectMutation`.

-  Сделать `useDeleteProjectMutation`.

-  Сделать create project form.

-  Сделать project cards.

-  Создать `/projects/[projectId]`.

-  Сделать `useProjectQuery`.

-  Сделать `useTasksQuery`.

-  Сделать create task form.

-  Сделать task list.

-  Сделать update task status.

-  Сделать delete task.


## Результат дня

Должно работать:

```txt
User can create project
User can see own projects
User can open project
User can create task
User can change task status
User can delete task
```

---
# День 4 — Polish + README + минимальные tests

## Цель

Довести проект до состояния, которое можно показать и объяснить.

## Задачи

-  Добавить Zustand store для task filters.

-  Добавить фильтр задач по status.

-  Добавить loading states.

-  Добавить error states.

-  Добавить empty states.

-  Причесать UI через TailwindCSS.

-  Проверить auth flow.

-  Проверить protected routes.

-  Проверить обработку `401`.

-  Проверить validation errors.

-  Добавить минимальные tests, если останется время.

-  Написать README.


## Минимальные frontend tests

-  LoginForm validation.

-  CreateTaskForm validation.


## Минимальные backend tests

-  Register endpoint.

-  Login endpoint.

-  `GET /auth/me` без token.

-  `GET /auth/me` с token.


---
# 11. Priority rules

## Must have

-  Auth backend

-  Auth frontend

-  Protected dashboard

-  Create/list/delete projects

-  Create/list/update status/delete tasks

-  Forms validation

-  JWT Authorization

-  README


## Should have

-  Task filters

-  Nice UI

-  Loading states

-  Error states

-  Empty states

-  Backend tests


## Could have

-  Frontend tests

-  Better layout

-  Project edit

-  Priority filter


## Не трогать

-  Refresh token

-  Cookies

-  Google Auth

-  Drag and drop

-  Docker

-  Deployment

-  WebSocket


---
# 12. Главное правило разработки

Каждый день должен заканчиваться рабочим состоянием проекта.

Правильный порядок:

1. Сначала endpoint работает.

2. Потом frontend вызывает endpoint.

3. Потом форма.

4. Потом validation.

5. Потом UI.

6. Потом refactoring.


Не нужно заранее создавать много файлов без работающей логики.

---
# 13. Что нужно уметь объяснить после проекта

## Next.js

- зачем нужен App Router;

- чем `page.tsx` отличается от `layout.tsx`;

- где нужен `"use client"`;

- как работают dynamic routes;

- как делать protected pages.


## Zustand

- что такое client state;

- почему filters/auth можно хранить в Zustand;

- почему projects/tasks лучше хранить в TanStack Query.


## TanStack Query

- что такое server state;

- что такое `queryKey`;

- зачем нужен `invalidateQueries`;

- чем `query` отличается от `mutation`.


## axios

- зачем нужен axios instance;

- как добавляется `Authorization` header;

- как обрабатывать `401`.


## JWT

- что такое access token;

- как backend проверяет token;

- что значит `Authorization: Bearer`;

- почему localStorage проще, но cookies безопаснее.


## react-hook-form + zod

- зачем нужна schema validation;

- как `zodResolver` связывает zod и react-hook-form;

- как TypeScript типы выводятся из zod schema.


## Backend

- routes;

- controllers;

- services;

- middleware;

- password hashing;

- error handling;

- validation;

- relation User → Project → Task.


---
# 14. README checklist

В README добавить:

-  название проекта;

-  краткое описание;

-  стек;

-  как запустить backend;

-  как запустить frontend;

-  `.env.example`;

-  endpoints;

-  реализованные фичи;

-  planned improvements.


---
# 15. Planned improvements

Если останется время или после дедлайна:

- refresh token;

- переход с localStorage на httpOnly cookies;

- edit project;

- edit task;

- priority filter;

- search по задачам;

- optimistic updates;

- frontend tests;

- backend tests;

- Docker;

- deploy.