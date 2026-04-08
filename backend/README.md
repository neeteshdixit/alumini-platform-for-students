# AlumniConnect Backend (PostgreSQL + Prisma)

## Setup

1. Install dependencies

```bash
npm install
```

2. Configure env

Copy `.env.example` to `.env` and set your PostgreSQL credentials.

```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
DATABASE_URL=postgresql://postgres:<password>@localhost:5432/alumini-platform?schema=public
JWT_ACCESS_SECRET=change-me-access-secret
JWT_REFRESH_SECRET=change-me-refresh-secret
```

3. Push schema + seed data

```bash
npm run prisma:push
npm run db:seed
```

4. Start backend

```bash
npm run dev
```

## Core APIs

- `GET /api/health`
- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh-token`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/logout-all`
- `GET /api/v1/auth/me`

Legacy auth alias is also available: `/api/auth/*`.
