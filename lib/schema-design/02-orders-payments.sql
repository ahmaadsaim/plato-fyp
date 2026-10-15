-- REVIEW DRAFT ONLY. Creates objects in plato_draft; not a migration for public.
-- See README.md for unresolved decisions and the explicit tenant-model selector.

-- Only online delivery initially; later values are draft expansion. Status transitions, discount/tax calculation and cancellation races require transactional services.
CREATE TABLE plato_draft.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  customer_id uuid,
  delivery_area_id uuid,
  promotion_id uuid,
  order_number text NOT NULL,
  channel text NOT NULL CHECK (channel IN ('online','pos','waiter','qr','kiosk')),
  fulfillment text NOT NULL CHECK (fulfillment IN ('delivery','pickup','dine_in')),
  status text NOT NULL,
  currency text NOT NULL DEFAULT 'PKR' CHECK (currency = 'PKR'),
  customer_snapshot jsonb NOT NULL,
  address_snapshot jsonb,
  subtotal numeric(14,2) NOT NULL CHECK (subtotal >= 0),
  discount_amount numeric(14,2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  tax_amount numeric(14,2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  delivery_fee numeric(14,2) NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
  total numeric(14,2) NOT NULL CHECK (total >= 0),
  submitted_at timestamptz NOT NULL DEFAULT now(),
  preparation_started_at timestamptz,
  CHECK (total = subtotal - discount_amount + tax_amount + delivery_fee),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,branch_id,order_number)
);

-- order_items (branch scope).
CREATE TABLE plato_draft.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  order_id uuid NOT NULL,
  item_id uuid NOT NULL,
  variant_id uuid,
  quantity integer NOT NULL CHECK (quantity > 0),
  item_name_snapshot text NOT NULL,
  variant_name_snapshot text,
  unit_price_snapshot numeric(14,2) NOT NULL CHECK (unit_price_snapshot >= 0),
  discount_snapshot numeric(14,2) NOT NULL CHECK (discount_snapshot >= 0),
  tax_rate_snapshot numeric(9,6) NOT NULL CHECK (tax_rate_snapshot BETWEEN 0 AND 1),
  tax_amount_snapshot numeric(14,2) NOT NULL CHECK (tax_amount_snapshot >= 0),
  line_total numeric(14,2) NOT NULL CHECK (line_total >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id)
);

-- Allowed addon/item selection requires a service check against item_addons or optional addon groups.
CREATE TABLE plato_draft.order_item_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  order_item_id uuid NOT NULL,
  addon_id uuid NOT NULL,
  name_snapshot text NOT NULL,
  unit_price_snapshot numeric(14,2) NOT NULL CHECK (unit_price_snapshot >= 0),
  quantity integer NOT NULL CHECK (quantity > 0),
  item_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,branch_id,order_item_id,addon_id)
);

-- order_status_history (branch scope).
CREATE TABLE plato_draft.order_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  order_id uuid NOT NULL,
  from_status text,
  to_status text NOT NULL,
  actor_membership_id uuid,
  reason text,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id)
);

-- One order may have several attempts; at most one successful full settlement is a service rule. Never store card PAN/CVV.
CREATE TABLE plato_draft.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  order_id uuid NOT NULL,
  method text NOT NULL CHECK (method IN ('cash','gateway','recorded_card')),
  provider text,
  provider_payment_id text,
  idempotency_key text NOT NULL,
  status text NOT NULL,
  amount numeric(14,2) NOT NULL CHECK (amount > 0),
  currency text NOT NULL CHECK (currency = 'PKR'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,idempotency_key)
);

-- Signature verification and provider-wide replay keys belong to gateway adapter.
CREATE TABLE plato_draft.payment_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  payment_id uuid NOT NULL,
  provider_event_id text NOT NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,payment_id,provider_event_id)
);

-- Manual full refund must equal settled payment and occur only once economically; transactional authorization/provider logic required.
CREATE TABLE plato_draft.refunds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  payment_id uuid NOT NULL,
  requested_by_membership_id uuid,
  requested_by_owner_user_id uuid,
  amount numeric(14,2) NOT NULL CHECK (amount > 0),
  status text NOT NULL,
  idempotency_key text NOT NULL,
  provider_refund_id text,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,idempotency_key)
);

-- refund_events (branch scope).
CREATE TABLE plato_draft.refund_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  refund_id uuid NOT NULL,
  provider_event_id text NOT NULL,
  status text NOT NULL,
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,refund_id,provider_event_id)
);

-- Nullable branch_id limits an offer to a branch; add scoped branch FK in constraints. Stacking forbidden by one orders.promotion_id.
CREATE TABLE plato_draft.promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid,
  kind text NOT NULL CHECK (kind IN ('promo_code','branch_offer')),
  code text,
  name text NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('fixed','percent')),
  discount_value numeric(14,4) NOT NULL CHECK (discount_value > 0),
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  CHECK ((kind = 'promo_code' AND branch_id IS NULL) OR (kind = 'branch_offer' AND branch_id IS NOT NULL)),
  CHECK (ends_at IS NULL OR starts_at IS NULL OR ends_at > starts_at),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,id),
  UNIQUE (tenant_id,restaurant_id,code)
);

-- Redemption must match orders.promotion_id; conditional triggers and service timing discussed in design.
CREATE TABLE plato_draft.promotion_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  promotion_id uuid NOT NULL,
  order_id uuid NOT NULL,
  customer_id uuid,
  discount_snapshot numeric(14,2) NOT NULL CHECK (discount_snapshot >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,branch_id,order_id)
);
