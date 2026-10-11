# Document ID: DOC-OPS-001
# DevOps, Cloud Infrastructure & Operational Runbooks

> **Document Version:** 1.0.0  
> **Classification:** DevOps Engineering & Operational Blueprint  
> **Status:** APPROVED  
> **Authoring Lead:** DevOps & Release Engineer & Principal Software Architect  
> **Review Date:** October 2026  
> **Target Deployments:** Docker Compose (Local/Staging) & Kubernetes (Production Cloud)  

---

## 1. Containerization & Multi-Stage Docker Builds

The platform is fully containerized into lightweight, secure OCI-compliant container images with zero local root execution privileges.

### 1.1 Backend Multi-Stage Dockerfile (`backend/Dockerfile`)
```dockerfile
# Stage 1: Build & Dependencies
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
RUN npx prisma generate
COPY . .

# Stage 2: Production Minimal Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S nodejs && adduser -S appuser -G nodejs
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/src ./src
USER appuser
EXPOSE 5000
CMD ["node", "src/server.js"]
```

### 1.2 Frontend Multi-Stage Dockerfile (`frontend/Dockerfile`)
```dockerfile
# Stage 1: Compile Vite Production Bundle
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Nginx High-Performance Static Web Server
FROM nginx:1.25-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 2. Local & Staging Orchestration (`docker-compose.yml`)

The platform provides a complete one-command orchestration setup spinning up all services, database engines, and cache relays:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: alumniconnect-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: alumniconnect_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secure_local_dev_password
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: alumniconnect-redis
    restart: unless-stopped
    ports:
      - "6379:6379"

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: alumniconnect-backend
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    environment:
      NODE_ENV: production
      PORT: 5000
      CLIENT_ORIGIN: http://localhost:5173,http://localhost:80
      DATABASE_URL: postgresql://postgres:secure_local_dev_password@postgres:5432/alumniconnect_db?schema=public
      JWT_ACCESS_SECRET: dev_jwt_access_secret_entropy_key_32_chars
      JWT_REFRESH_SECRET: dev_jwt_refresh_secret_entropy_key_32_chars
      MESSAGE_ENCRYPTION_SECRET: dev_message_crypto_secret_32_chars
    ports:
      - "5000:5000"

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: alumniconnect-frontend
    restart: unless-stopped
    depends_on:
      - backend
    ports:
      - "80:80"

volumes:
  pgdata:
```

---

## 3. Environment Variable Standards & Configuration

| Variable Key | Required | Expected Type / Value | Sensitivity | Purpose & Description |
| :--- | :---: | :--- | :--- | :--- |
| `NODE_ENV` | Yes | `production` \| `development` | Public | Node.js execution environment mode. |
| `PORT` | Yes | Integer (e.g. `5000`) | Public | TCP port for Express HTTP/WSS server. |
| `CLIENT_ORIGIN` | Yes | Comma-delimited URLs | Public | Whitelisted origins permitted by CORS middleware. |
| `DATABASE_URL` | Yes | PostgreSQL connection URI | **RESTRICTED** | Database host, credentials, port, and database name. |
| `JWT_ACCESS_SECRET` | Yes | Min 256-bit random string | **CRITICAL** | HMAC secret used to sign 15-minute access tokens. |
| `JWT_REFRESH_SECRET`| Yes | Min 256-bit random string | **CRITICAL** | HMAC secret used for refresh token operations. |
| `MESSAGE_ENCRYPTION_SECRET`| Yes | 256-bit random string | **CRITICAL** | Symmetric key used for AES-256-GCM chat encryption. |
| `RESEND_API_KEY` | No | API Key (`re_...`) | **RESTRICTED** | Transactional email provider token for OTPs. |
| `OTP_FROM_EMAIL` | No | Verified Email address | Public | Sender identity on transactional emails. |
| `TURN_SECRET` | No | Alphanumeric secret | **RESTRICTED** | Secret for minting dynamic Coturn STUN/TURN credentials. |

---

## 4. Monitoring, Health Checks & Observability

### 4.1 Health Check Endpoints
- **HTTP Health Probe:** `GET /api/health`
  - Returns HTTP `200 OK` with JSON payload `{ success: true, status: 'ok', service: 'alumniconnect-backend' }`.
  - Used by Kubernetes Liveness and Readiness probes.
- **Deep Database Health Probe:** `GET /api/health/db`
  - Executes lightweight `prisma.$queryRaw`SELECT 1``.
  - Returns HTTP 200 if connected; returns HTTP `503 Service Unavailable` if database is down.

### 4.2 Logging Standards
- All logs formatted in JSON via Morgan and Winston:
  `{"timestamp": "2026-10-11T12:00:00Z", "level": "info", "method": "POST", "path": "/api/v1/auth/login", "statusCode": 200, "durationMs": 42, "ip": "192.168.1.1"}`
- Sensitive data filtering: Passwords, OTPs, auth headers, and full credit card/PII strings are stripped before writing to log sinks.
