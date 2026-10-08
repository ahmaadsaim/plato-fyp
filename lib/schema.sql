-- Multi-tenant foundation schema
-- Users, tenants, and tenant theme overrides live in PostgreSQL.

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
  theme_source TEXT NOT NULL DEFAULT 'LOCAL' CHECK (theme_source IN ('LOCAL', 'DATABASE')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS theme_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID UNIQUE NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  tokens_override JSONB NOT NULL DEFAULT '{}'::jsonb,
  layout_override JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Ensure core tenant metadata exists on older databases.
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS theme_id TEXT NOT NULL DEFAULT 'modern';
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS theme_source TEXT NOT NULL DEFAULT 'LOCAL';
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE tenants ALTER COLUMN theme_id SET DEFAULT 'modern';
ALTER TABLE tenants ALTER COLUMN theme_source SET DEFAULT 'LOCAL';
ALTER TABLE tenants ALTER COLUMN theme_source SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.tenants'::regclass
      AND conname = 'tenants_theme_source_check'
  ) THEN
    ALTER TABLE tenants
      ADD CONSTRAINT tenants_theme_source_check
      CHECK (theme_source IN ('LOCAL', 'DATABASE')) NOT VALID;
  END IF;
END $$;

ALTER TABLE theme_overrides
  ADD COLUMN IF NOT EXISTS tokens_override JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS layout_override JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Backfill missing values where rows were created before the theme fields existed.
UPDATE tenants SET theme_id = 'modern' WHERE theme_id IS NULL;
UPDATE tenants SET theme_source = 'LOCAL' WHERE theme_source IS NULL;

-- Indexes for fast tenant lookup and ownership checks.
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenants_user_id ON tenants(user_id);
CREATE INDEX IF NOT EXISTS idx_tenants_theme_id ON tenants(theme_id);
CREATE INDEX IF NOT EXISTS idx_tenants_theme_source ON tenants(theme_source);
CREATE INDEX IF NOT EXISTS idx_theme_overrides_tenant_id ON theme_overrides(tenant_id);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_tenant_updated_at ON tenants;
CREATE TRIGGER set_tenant_updated_at
BEFORE UPDATE ON tenants
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS set_theme_override_updated_at ON theme_overrides;
CREATE TRIGGER set_theme_override_updated_at
BEFORE UPDATE ON theme_overrides
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
