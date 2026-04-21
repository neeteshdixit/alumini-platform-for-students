-- Alumni engagement upgrade: location hierarchy, graduation tracking, notifications, and reset tokens.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  CREATE TYPE "AuthProvider" AS ENUM ('LOCAL', 'GOOGLE', 'FIREBASE');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'CONNECTION_REQUEST';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'CONNECTION_ACCEPTED';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'CONNECTION_REJECTED';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'FEED_BROADCAST';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'CERTIFICATE';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'ACHIEVEMENT';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'WELCOME';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'PASSWORD_RESET';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'GRADUATION_COMPLETE';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'REMINDER';

CREATE TABLE IF NOT EXISTS "location_states" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "code" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "location_states_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "location_states_name_key" ON "location_states"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "location_states_code_key" ON "location_states"("code");
CREATE INDEX IF NOT EXISTS "location_states_name_idx" ON "location_states"("name");

CREATE TABLE IF NOT EXISTS "location_districts" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "state_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "code" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "location_districts_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "location_districts_state_id_name_key" ON "location_districts"("state_id", "name");
CREATE INDEX IF NOT EXISTS "location_districts_state_id_name_idx" ON "location_districts"("state_id", "name");

ALTER TABLE "location_districts"
  ADD CONSTRAINT "location_districts_state_id_fkey"
  FOREIGN KEY ("state_id") REFERENCES "location_states"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "colleges"
  ADD COLUMN IF NOT EXISTS "state_id" TEXT,
  ADD COLUMN IF NOT EXISTS "district_id" TEXT,
  ADD COLUMN IF NOT EXISTS "state" TEXT,
  ADD COLUMN IF NOT EXISTS "district" TEXT;

ALTER TABLE "colleges"
  ADD CONSTRAINT "colleges_state_id_fkey"
  FOREIGN KEY ("state_id") REFERENCES "location_states"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "colleges"
  ADD CONSTRAINT "colleges_district_id_fkey"
  FOREIGN KEY ("district_id") REFERENCES "location_districts"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "colleges_state_district_name_idx" ON "colleges"("state", "district", "name");
CREATE INDEX IF NOT EXISTS "colleges_state_id_district_id_name_idx" ON "colleges"("state_id", "district_id", "name");

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "auth_provider" "AuthProvider" NOT NULL DEFAULT 'LOCAL',
  ADD COLUMN IF NOT EXISTS "is_first_login" BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS "last_login_at" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "graduation_mail_sent_at" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "graduation_reminder_sent_at" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "users_role_is_first_login_idx" ON "users"("role", "is_first_login");
CREATE INDEX IF NOT EXISTS "users_last_login_at_idx" ON "users"("last_login_at");

ALTER TABLE "profiles"
  ADD COLUMN IF NOT EXISTS "graduation_month" INTEGER;

ALTER TABLE "posts"
  ADD COLUMN IF NOT EXISTS "file_url" TEXT,
  ADD COLUMN IF NOT EXISTS "file_type" TEXT;

CREATE INDEX IF NOT EXISTS "posts_created_at_idx" ON "posts"("created_at");
CREATE INDEX IF NOT EXISTS "posts_author_id_created_at_idx" ON "posts"("author_id", "created_at");

ALTER TABLE "notifications"
  ADD COLUMN IF NOT EXISTS "read_at" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "notifications_user_id_read_created_at_idx" ON "notifications"("user_id", "read", "created_at");

CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "user_id" TEXT NOT NULL,
  "token_hash" TEXT NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "consumed_at" TIMESTAMP(3),
  "sent_via" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "password_reset_tokens_token_hash_key" ON "password_reset_tokens"("token_hash");
CREATE INDEX IF NOT EXISTS "password_reset_tokens_user_id_expires_at_idx" ON "password_reset_tokens"("user_id", "expires_at");

ALTER TABLE "password_reset_tokens"
  ADD CONSTRAINT "password_reset_tokens_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
