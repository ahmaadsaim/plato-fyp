-- REVIEW DRAFT ONLY. Creates objects in plato_draft; not a migration for public.
-- See README.md for unresolved decisions and the explicit tenant-model selector.
DO $$ BEGIN
  IF current_setting('plato.tenant_model', true) IS NULL
     OR current_setting('plato.tenant_model', true) NOT IN ('restaurant','group') THEN
    RAISE EXCEPTION 'Select restaurant or group tenant_model explicitly before reviewing this draft';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'plato_draft') THEN
    RAISE EXCEPTION 'plato_draft already exists; use a fresh disposable database';
  END IF;
END $$;
CREATE SCHEMA plato_draft;
SET search_path = plato_draft, public;

-- users (global scope).
CREATE TABLE plato_draft.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- tenants (global scope).
CREATE TABLE plato_draft.tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Business entity kept separate in this draft so both tenant models can be compared; restaurant mode adds UNIQUE(tenant_id).
CREATE TABLE plato_draft.restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  owner_user_id uuid NOT NULL,
  name text NOT NULL,
  template_key text NOT NULL,
  customization_file_key text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,id)
);

-- branches (restaurant scope).
CREATE TABLE plato_draft.branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  name text NOT NULL,
  code text NOT NULL,
  contact_phone text,
  address jsonb NOT NULL DEFAULT '{}',
  timezone text NOT NULL,
  minimum_order_amount numeric(14,2) NOT NULL DEFAULT 0 CHECK (minimum_order_amount >= 0),
  free_delivery_threshold numeric(14,2) CHECK (free_delivery_threshold >= 0),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,id),
  UNIQUE (tenant_id,restaurant_id,code)
);

-- UNIQUE(user_id) enforces one restaurant per staff account; owners use restaurant.owner_user_id.
CREATE TABLE plato_draft.staff_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('manager','cashier','kitchen','waiter')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,id),
  UNIQUE (user_id)
);

-- staff_branch_access (branch scope).
CREATE TABLE plato_draft.staff_branch_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  membership_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,branch_id,membership_id)
);

-- No default tenant boundary: only the explicitly selected alternative is enforced.
DO $$ BEGIN
  IF current_setting('plato.tenant_model') = 'restaurant' THEN
    ALTER TABLE plato_draft.restaurants ADD CONSTRAINT restaurants_one_per_tenant UNIQUE (tenant_id);
  END IF;
END $$;
