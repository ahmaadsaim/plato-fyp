-- REVIEW DRAFT ONLY. Creates objects in plato_draft; not a migration for public.
-- See README.md for unresolved decisions and the explicit tenant-model selector.

-- Multiple opening intervals and explicit overnight flag; timezone is on branch.
CREATE TABLE plato_draft.branch_operating_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  weekday smallint NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  opens_at time NOT NULL,
  closes_at time NOT NULL,
  ends_next_day boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,branch_id,weekday,opens_at)
);

-- Area boundaries/eligibility validation remain unresolved; no unsupported polygon assumption.
CREATE TABLE plato_draft.delivery_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  name text NOT NULL,
  fee numeric(14,2) NOT NULL CHECK (fee >= 0),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,branch_id,name)
);

-- No legal rate or unresolved delivery-tax/calculation default.
CREATE TABLE plato_draft.branch_tax_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  rate numeric(9,6) NOT NULL CHECK (rate >= 0 AND rate <= 1),
  delivery_taxable boolean,
  calculation_policy text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,branch_id)
);

-- Business-scoped profile; optional shared user identity can link profiles. Customer login namespace/access/verification remain unresolved.
CREATE TABLE plato_draft.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  user_id uuid,
  display_name text,
  phone text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,id),
  UNIQUE (tenant_id,restaurant_id,user_id)
);

-- customer_addresses (restaurant scope).
CREATE TABLE plato_draft.customer_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  customer_id uuid NOT NULL,
  label text,
  address jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,id)
);

-- menu_categories (branch scope).
CREATE TABLE plato_draft.menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  name text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,branch_id,name)
);

-- menu_items (branch scope).
CREATE TABLE plato_draft.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  category_id uuid NOT NULL,
  name text NOT NULL,
  base_price numeric(14,2) NOT NULL CHECK (base_price >= 0),
  cost numeric(14,2) CHECK (cost >= 0),
  is_tax_exempt boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  extra_fields jsonb NOT NULL DEFAULT '{}',
  stock_mode text CHECK (stock_mode IN ('item','variant')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id)
);

-- item_variants (branch scope).
CREATE TABLE plato_draft.item_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  item_id uuid NOT NULL,
  name text NOT NULL,
  price numeric(14,2) NOT NULL CHECK (price >= 0),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,branch_id,item_id,name)
);

-- addons (branch scope).
CREATE TABLE plato_draft.addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  name text NOT NULL,
  price numeric(14,2) NOT NULL CHECK (price >= 0),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id)
);

-- item_addons (branch scope).
CREATE TABLE plato_draft.item_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  item_id uuid NOT NULL,
  addon_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,branch_id,item_id,addon_id)
);

-- Variant must belong to item; nullable uniqueness and no mixed item/variant policy described in constraints/design.
CREATE TABLE plato_draft.item_stock (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  item_id uuid NOT NULL,
  variant_id uuid,
  quantity numeric(14,3) NOT NULL CHECK (quantity >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id)
);

-- item_stock_movements (branch scope).
CREATE TABLE plato_draft.item_stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  stock_id uuid NOT NULL,
  delta numeric(14,3) NOT NULL CHECK (delta <> 0),
  reason text NOT NULL,
  order_id uuid,
  actor_membership_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id)
);
