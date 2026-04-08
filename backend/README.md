# Backend Setup

## 1) Install dependencies

```bash
npm install
```

## 2) Configure environment

Use `.env` (already created) or update from `.env.example`.

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=Neet2006@
DB_NAME=alumini-platform
```

## 3) Run server

```bash
npm run dev
```

## API

- `GET /api/health`
- `POST /api/auth/signup`
- `POST /api/auth/login`
