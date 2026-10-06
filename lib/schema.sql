-- Multi-tenant foundation schema
-- ONLY 2 tables: users and tenants

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  theme_id TEXT NOT NULL DEFAULT 'modern',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Ensure theme_id column exists on existing databases
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS theme_id TEXT NOT NULL DEFAULT 'modern';

-- Index for fast tenant lookup by slug
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);
-- Index for fast tenant lookup by user_id
CREATE INDEX IF NOT EXISTS idx_tenants_user_id ON tenants(user_id);
-- Index for fast tenant lookup by theme_id
CREATE INDEX IF NOT EXISTS idx_tenants_theme_id ON tenants(theme_id);
