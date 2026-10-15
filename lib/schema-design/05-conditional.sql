-- REVIEW DRAFT ONLY. Creates objects in plato_draft; not a migration for public.
-- See README.md for unresolved decisions and the explicit tenant-model selector.

-- roles (restaurant scope).
CREATE TABLE plato_draft.roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,id),
  UNIQUE (tenant_id,restaurant_id,name)
);



-- permissions (global scope).
CREATE TABLE plato_draft.permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  description text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Role definitions are not assigned automatically; staff.role remains the selected fixed-role model.
CREATE TABLE plato_draft.role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  role_id uuid NOT NULL,
  permission_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,id),
  UNIQUE (tenant_id,restaurant_id,role_id,permission_id)
);

-- Optional only; no plaintext JWT or refresh token stored.
CREATE TABLE plato_draft.auth_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- branch_schedule_exceptions (branch scope).
CREATE TABLE plato_draft.branch_schedule_exceptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  date date NOT NULL,
  is_closed boolean NOT NULL,
  opens_at time,
  closes_at time,
  CHECK (is_closed OR (opens_at IS NOT NULL AND closes_at IS NOT NULL)),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,branch_id,date)
);

-- delivery_time_slots (branch scope).
CREATE TABLE plato_draft.delivery_time_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  capacity integer CHECK (capacity > 0),
  CHECK (ends_at > starts_at),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id)
);

-- No automatic expiry/timing chosen; optional expiration column does not change accepted unpaid-order behavior.
CREATE TABLE plato_draft.stock_reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  stock_id uuid NOT NULL,
  order_item_id uuid NOT NULL,
  quantity numeric(14,3) NOT NULL CHECK (quantity > 0),
  status text NOT NULL,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,branch_id,stock_id,order_item_id)
);

-- addon_groups (branch scope).
CREATE TABLE plato_draft.addon_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  name text NOT NULL,
  min_selections integer NOT NULL CHECK (min_selections >= 0),
  max_selections integer NOT NULL CHECK (max_selections >= min_selections),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id)
);

-- addon_group_options (branch scope).
CREATE TABLE plato_draft.addon_group_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  group_id uuid NOT NULL,
  addon_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,branch_id,group_id,addon_id)
);

-- item_addon_groups (branch scope).
CREATE TABLE plato_draft.item_addon_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  item_id uuid NOT NULL,
  group_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,branch_id,item_id,group_id)
);

-- promotion_branches (branch scope).
CREATE TABLE plato_draft.promotion_branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  promotion_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,branch_id,promotion_id)
);

-- promotion_items (branch scope).
CREATE TABLE plato_draft.promotion_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  promotion_id uuid NOT NULL,
  item_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,branch_id,promotion_id,item_id)
);

-- Metadata only; renderer reads template/customization JSON files, not appearance blobs in this table.
CREATE TABLE plato_draft.template_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key text NOT NULL,
  version text NOT NULL,
  base_file_key text NOT NULL,
  content_checksum text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (template_key,version)
);

-- media_assets (restaurant scope).
CREATE TABLE plato_draft.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  storage_key text NOT NULL,
  media_type text NOT NULL,
  content_checksum text,
  created_by_membership_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,id),
  UNIQUE (tenant_id,restaurant_id,storage_key)
);

-- report_exports (restaurant scope).
CREATE TABLE plato_draft.report_exports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  requested_by_membership_id uuid,
  report_type text NOT NULL,
  parameters jsonb NOT NULL,
  status text NOT NULL,
  result_storage_key text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,id)
);

-- background_jobs (restaurant scope).
CREATE TABLE plato_draft.background_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  job_type text NOT NULL,
  idempotency_key text NOT NULL,
  payload jsonb NOT NULL,
  status text NOT NULL,
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  available_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,id),
  UNIQUE (tenant_id,restaurant_id,idempotency_key)
);

-- Optional restaurant scope must still be from this tenant; entity references are typed metadata validated by the service.
CREATE TABLE plato_draft.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid,
  actor_user_id uuid,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,id)
);

-- billing_invoices (tenant scope).
CREATE TABLE plato_draft.billing_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  subscription_id uuid NOT NULL,
  number text NOT NULL,
  currency text NOT NULL,
  total numeric(14,2) NOT NULL CHECK (total >= 0),
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,id),
  UNIQUE (tenant_id,number)
);

-- billing_invoice_items (tenant scope).
CREATE TABLE plato_draft.billing_invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  invoice_id uuid NOT NULL,
  description text NOT NULL,
  quantity numeric(14,3) NOT NULL CHECK (quantity > 0),
  unit_amount numeric(14,2) NOT NULL CHECK (unit_amount >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,id)
);

-- billing_payments (tenant scope).
CREATE TABLE plato_draft.billing_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  invoice_id uuid NOT NULL,
  amount numeric(14,2) NOT NULL CHECK (amount > 0),
  currency text NOT NULL,
  provider_reference text,
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,id)
);

-- Optional links used only in the conditional review module.
ALTER TABLE plato_draft.staff_memberships ADD COLUMN configured_role_id uuid;
ALTER TABLE plato_draft.restaurants ADD COLUMN template_catalog_id uuid;
ALTER TABLE plato_draft.menu_items ADD COLUMN media_asset_id uuid;
