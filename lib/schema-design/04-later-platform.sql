-- REVIEW DRAFT ONLY. Creates objects in plato_draft; not a migration for public.
-- See README.md for unresolved decisions and the explicit tenant-model selector.

-- loyalty_accounts (restaurant scope).
CREATE TABLE plato_draft.loyalty_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  customer_id uuid NOT NULL,
  points_balance bigint NOT NULL DEFAULT 0 CHECK (points_balance >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,id),
  UNIQUE (tenant_id,restaurant_id,customer_id)
);

-- Order relation carries an explicit order_branch_id column.
CREATE TABLE plato_draft.loyalty_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  account_id uuid NOT NULL,
  order_id uuid,
  delta bigint NOT NULL CHECK (delta <> 0),
  operation_key text NOT NULL,
  order_branch_id uuid,
  CHECK ((order_id IS NULL) = (order_branch_id IS NULL)),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,id),
  UNIQUE (tenant_id,restaurant_id,operation_key)
);

-- customer_segments (restaurant scope).
CREATE TABLE plato_draft.customer_segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  name text NOT NULL,
  criteria jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,id),
  UNIQUE (tenant_id,restaurant_id,name)
);

-- customer_segment_members (restaurant scope).
CREATE TABLE plato_draft.customer_segment_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  segment_id uuid NOT NULL,
  customer_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,id),
  UNIQUE (tenant_id,restaurant_id,segment_id,customer_id)
);

-- campaigns (restaurant scope).
CREATE TABLE plato_draft.campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  segment_id uuid,
  name text NOT NULL,
  channel text NOT NULL CHECK (channel IN ('email','sms','whatsapp')),
  content jsonb NOT NULL,
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,id)
);

-- campaign_recipients (restaurant scope).
CREATE TABLE plato_draft.campaign_recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  campaign_id uuid NOT NULL,
  customer_id uuid NOT NULL,
  recipient_snapshot jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,id),
  UNIQUE (tenant_id,restaurant_id,campaign_id,customer_id)
);

-- forecast_runs (branch scope).
CREATE TABLE plato_draft.forecast_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  model_kind text NOT NULL CHECK (model_kind IN ('lstm','arima')),
  training_start date NOT NULL,
  training_end date NOT NULL,
  model_version text NOT NULL,
  status text NOT NULL,
  CHECK (training_end >= training_start),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id)
);

-- demand_forecasts (branch scope).
CREATE TABLE plato_draft.demand_forecasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  run_id uuid NOT NULL,
  item_id uuid NOT NULL,
  forecast_date date NOT NULL,
  quantity numeric(18,6) NOT NULL CHECK (quantity >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,branch_id,run_id,item_id,forecast_date)
);

-- forecast_evaluations (branch scope).
CREATE TABLE plato_draft.forecast_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  run_id uuid NOT NULL,
  metric text NOT NULL,
  value numeric NOT NULL,
  evaluation_start date NOT NULL,
  evaluation_end date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id)
);

-- ai_recommendations (branch scope).
CREATE TABLE plato_draft.ai_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  run_id uuid,
  item_id uuid,
  ingredient_id uuid,
  kind text NOT NULL,
  recommendation jsonb NOT NULL,
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id)
);

-- recommendation_decisions (branch scope).
CREATE TABLE plato_draft.recommendation_decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  recommendation_id uuid NOT NULL,
  manager_membership_id uuid,
  owner_user_id uuid,
  decision text NOT NULL CHECK (decision IN ('approved','rejected')),
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id)
);

-- plans (global scope).
CREATE TABLE plato_draft.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- plan_limits (global scope).
CREATE TABLE plato_draft.plan_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL,
  resource text NOT NULL,
  limit_value bigint CHECK (limit_value >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (plan_id,resource)
);

-- tenant_subscriptions (tenant scope).
CREATE TABLE plato_draft.tenant_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  plan_id uuid NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,id)
);

-- tenant_usage (tenant scope).
CREATE TABLE plato_draft.tenant_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  resource text NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  quantity bigint NOT NULL CHECK (quantity >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,id),
  UNIQUE (tenant_id,resource,period_start,period_end)
);

-- sync_devices (branch scope).
CREATE TABLE plato_draft.sync_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  name text NOT NULL,
  last_synced_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id)
);

-- entity_type/entity_id are polymorphic sync metadata, not a pretend SQL FK; adapter validates allowlist and scope.
CREATE TABLE plato_draft.sync_operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  device_id uuid NOT NULL,
  operation_key text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  base_revision bigint,
  payload jsonb NOT NULL,
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id),
  UNIQUE (tenant_id,restaurant_id,branch_id,device_id,operation_key)
);

-- sync_conflicts (branch scope).
CREATE TABLE plato_draft.sync_conflicts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  operation_id uuid NOT NULL,
  server_snapshot jsonb NOT NULL,
  client_snapshot jsonb NOT NULL,
  resolved_by_membership_id uuid,
  resolution jsonb,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,branch_id,id)
);

-- integration_connections (restaurant scope).
CREATE TABLE plato_draft.integration_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  provider text NOT NULL,
  secret_reference text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,id),
  UNIQUE (tenant_id,restaurant_id,provider)
);

-- integration_events (restaurant scope).
CREATE TABLE plato_draft.integration_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  connection_id uuid NOT NULL,
  external_event_id text NOT NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,id),
  UNIQUE (tenant_id,restaurant_id,connection_id,external_event_id)
);

-- notification_deliveries (restaurant scope).
CREATE TABLE plato_draft.notification_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  restaurant_id uuid NOT NULL,
  connection_id uuid,
  campaign_recipient_id uuid,
  order_id uuid,
  customer_id uuid,
  channel text NOT NULL,
  recipient_snapshot jsonb NOT NULL,
  status text NOT NULL,
  provider_message_id text,
  order_branch_id uuid,
  CHECK ((order_id IS NULL) = (order_branch_id IS NULL)),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id,restaurant_id,id)
);
