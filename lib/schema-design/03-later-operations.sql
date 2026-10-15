-- REVIEW DRAFT ONLY. Creates objects in plato_draft; not a migration for public.
-- See README.md for unresolved decisions and the explicit tenant-model selector.

-- pos_registers (branch scope).
CREATE TABLE plato_draft.pos_registers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,branch_id,name)
);

-- cash_sessions (branch scope).
CREATE TABLE plato_draft.cash_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  register_id uuid NOT NULL,
  cashier_membership_id uuid NOT NULL,
  opened_at timestamptz NOT NULL,
  closed_at timestamptz,
  opening_amount numeric(14,2) NOT NULL CHECK (opening_amount >= 0),
  closing_amount numeric(14,2) CHECK (closing_amount >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id)
);

-- cash_movements (branch scope).
CREATE TABLE plato_draft.cash_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  session_id uuid NOT NULL,
  payment_id uuid,
  amount numeric(14,2) NOT NULL CHECK (amount <> 0),
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id)
);

-- receipts (branch scope).
CREATE TABLE plato_draft.receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  order_id uuid NOT NULL,
  receipt_number text NOT NULL,
  receipt_snapshot jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,branch_id,receipt_number)
);

-- dining_tables (branch scope).
CREATE TABLE plato_draft.dining_tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  name text NOT NULL,
  qr_token_hash text,
  capacity integer CHECK (capacity > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,branch_id,name)
);

-- table_sessions (branch scope).
CREATE TABLE plato_draft.table_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  table_id uuid NOT NULL,
  customer_id uuid,
  opened_at timestamptz NOT NULL,
  closed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id)
);

-- kitchen_stations (branch scope).
CREATE TABLE plato_draft.kitchen_stations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,branch_id,name)
);

-- item_kitchen_stations (branch scope).
CREATE TABLE plato_draft.item_kitchen_stations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  item_id uuid NOT NULL,
  station_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,branch_id,item_id,station_id)
);

-- kitchen_tickets (branch scope).
CREATE TABLE plato_draft.kitchen_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  order_id uuid NOT NULL,
  station_id uuid NOT NULL,
  status text NOT NULL,
  started_at timestamptz,
  ready_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id)
);

-- Same-order match is included as an additional relationship constraint.
CREATE TABLE plato_draft.kitchen_ticket_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  ticket_id uuid NOT NULL,
  order_item_id uuid NOT NULL,
  status text NOT NULL,
  order_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,branch_id,ticket_id,order_item_id)
);

-- ingredients (restaurant scope).
CREATE TABLE plato_draft.ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  name text NOT NULL,
  base_unit text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,id),
  UNIQUE (tenant_id,restaurant_id,name)
);

-- ingredient_stock (branch scope).
CREATE TABLE plato_draft.ingredient_stock (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  ingredient_id uuid NOT NULL,
  quantity numeric(18,6) NOT NULL CHECK (quantity >= 0),
  low_stock_threshold numeric(18,6) CHECK (low_stock_threshold >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,branch_id,ingredient_id)
);

-- Ingredient consumption records need recipe version snapshots; do not recompute past movements.
CREATE TABLE plato_draft.recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  item_id uuid NOT NULL,
  variant_id uuid,
  version integer NOT NULL CHECK (version > 0),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id)
);

-- recipe_ingredients (branch scope).
CREATE TABLE plato_draft.recipe_ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  recipe_id uuid NOT NULL,
  ingredient_id uuid NOT NULL,
  quantity numeric(18,6) NOT NULL CHECK (quantity > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,branch_id,recipe_id,ingredient_id)
);

-- stock_movements (branch scope).
CREATE TABLE plato_draft.stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  stock_id uuid NOT NULL,
  order_item_id uuid,
  receipt_item_id uuid,
  delta numeric(18,6) NOT NULL CHECK (delta <> 0),
  reason text NOT NULL,
  operation_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,branch_id,operation_key)
);

-- stock_batches (branch scope).
CREATE TABLE plato_draft.stock_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  stock_id uuid NOT NULL,
  batch_code text NOT NULL,
  quantity numeric(18,6) NOT NULL CHECK (quantity >= 0),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,branch_id,stock_id,batch_code)
);

-- waste_records (branch scope).
CREATE TABLE plato_draft.waste_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  stock_id uuid NOT NULL,
  batch_id uuid,
  quantity numeric(18,6) NOT NULL CHECK (quantity > 0),
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id)
);

-- suppliers (restaurant scope).
CREATE TABLE plato_draft.suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  name text NOT NULL,
  contact jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,id)
);

-- purchase_orders (branch scope).
CREATE TABLE plato_draft.purchase_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  supplier_id uuid NOT NULL,
  number text NOT NULL,
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,branch_id,number)
);

-- purchase_order_items (branch scope).
CREATE TABLE plato_draft.purchase_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  purchase_order_id uuid NOT NULL,
  ingredient_id uuid NOT NULL,
  quantity numeric(18,6) NOT NULL CHECK (quantity > 0),
  unit_cost numeric(14,4) NOT NULL CHECK (unit_cost >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id)
);

-- goods_receipts (branch scope).
CREATE TABLE plato_draft.goods_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  purchase_order_id uuid NOT NULL,
  received_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id)
);

-- Receipt and purchase-order line must point at the same purchase order.
CREATE TABLE plato_draft.goods_receipt_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  receipt_id uuid NOT NULL,
  purchase_order_item_id uuid NOT NULL,
  quantity numeric(18,6) NOT NULL CHECK (quantity > 0),
  purchase_order_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id)
);

-- staff_shifts (branch scope).
CREATE TABLE plato_draft.staff_shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  membership_id uuid NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  CHECK (ends_at > starts_at),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id)
);

-- attendance_records (branch scope).
CREATE TABLE plato_draft.attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  membership_id uuid NOT NULL,
  shift_id uuid,
  clocked_in_at timestamptz NOT NULL,
  clocked_out_at timestamptz,
  CHECK (clocked_out_at IS NULL OR clocked_out_at > clocked_in_at),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id)
);
