# PLATO database table inventory

Identification only; no SQL, columns, keys, migrations or table creation. Working names may be combined or renamed after requirements are resolved. Listing a table does not approve its feature or fix the physical database design.

The separate [SQL and relationship review draft](lib/schema-design/README.md) develops these candidates without choosing the unresolved tenant boundary. It adds a provisional `restaurants` entity to compare the two tenant models; it does not modify the application's current schema.

The initial storefront/online-order scope is based on confirmed decisions. Later groups come from the FYP draft and remain subject to review, including its MUST tags. Conditional groups depend on unresolved or additional requirements. These are logical table candidates, not a minimum table count.

## Existing schema and live target

`lib/schema.sql` defines three existing application tables:

| Table | Current purpose |
| --- | --- |
| `users` | Merchant accounts and password hashes. |
| `tenants` | Restaurant tenants, owner reference, slug and selected theme. |
| `theme_overrides` | Current persisted theme overrides; existing behavior differs from the agreed future customization-file approach. |

On 2026-10-09, `npm run db:migrate` successfully applied these three tables to the configured Neon database. The running app uses this working schema. Setup starts fresh without importing local records. A separate post-migration live verification was not run. The proposed tables below remain a review draft, not existing cloud tables.

## Whole-FYP candidate inventory

| Scope/module | Candidate tables | Responsibility and qualification |
| --- | --- | --- |
| Initial scope — tenancy and access | `users`, `tenants`, `branches`, `staff_memberships`, `staff_branch_access` | Merchant/staff identities, restaurant tenants, branches and assigned staff access. |
| Initial scope — branch operations | `branch_operating_hours`, `delivery_areas`, `branch_tax_settings` | Opening schedules, branch delivery areas/fees and branch tax settings. Tax settings may ultimately live on branches. |
| Initial scope — customers | `customers`, `customer_addresses` | Optional customer profiles and saved addresses. Account scope and reuse of users remain undecided; guest details can be snapshotted on orders. |
| Initial scope — branch menus | `menu_categories`, `menu_items`, `item_variants`, `addons`, `item_addons` | Independent menus per branch, priced variants and optional paid add-ons. |
| Initial scope — item quantities | `item_stock`, `item_stock_movements` | Sellable quantities and their changes. Item-versus-variant quantity tracking remains open; these are separate from ingredient inventory. |
| Initial scope — ordering | `orders`, `order_items`, `order_item_addons`, `order_status_history` | Order headers, line snapshots, chosen add-ons and lifecycle changes. Historical customer/address/prices/tax belong to order snapshots. |
| Initial scope — payments | `payments`, `payment_events`, `refunds`, `refund_events` | Cash/gateway payment records, provider callbacks, manual full refunds and processing history. |
| Initial scope — promotions | `promotions`, `promotion_redemptions` | Restaurant promo codes and branch offers, with recorded usage. Only one promotion per order was selected. |
| Later draft — POS | `pos_registers`, `cash_sessions`, `cash_movements`, `receipts` | Register/cash operations and issued receipts; orders and payments are reused rather than duplicated for POS. |
| Later draft — dine-in and QR | `dining_tables`, `table_sessions` | Physical dining tables and customer table sessions; QR identifiers can be stored on dining_tables. |
| Later draft — kitchen/KDS | `kitchen_stations`, `item_kitchen_stations`, `kitchen_tickets`, `kitchen_ticket_items` | Station routing and kitchen work. Ticket tables may be unnecessary if order lines support the final workflow. |
| Later draft — ingredient inventory | `ingredients`, `ingredient_stock`, `recipes`, `recipe_ingredients`, `stock_movements`, `stock_batches`, `waste_records` | Ingredients/base quantities, recipes, consumption, batches/expiry and recorded waste. |
| Later draft — purchasing | `suppliers`, `purchase_orders`, `purchase_order_items`, `goods_receipts`, `goods_receipt_items` | Suppliers, purchasing and received inventory; receipt separation is a supporting candidate, not a confirmed workflow. |
| Later draft — staff HR | `staff_shifts`, `attendance_records` | Branch shift scheduling and clock-in/clock-out. |
| Later draft — loyalty | `loyalty_accounts`, `loyalty_transactions` | Point balances and earning/redemption history. |
| Later draft — segmentation/campaigns | `customer_segments`, `customer_segment_members`, `campaigns`, `campaign_recipients` | Customer segmentation, campaign definitions and intended recipients. |
| Later draft — AI | `forecast_runs`, `demand_forecasts`, `forecast_evaluations`, `ai_recommendations`, `recommendation_decisions` | Model runs, predicted demand, accuracy results and recommendations with manager decisions; covers waste/menu/pricing suggestions without separate tables for every algorithm. |
| Later draft — plans | `plans`, `plan_limits`, `tenant_subscriptions`, `tenant_usage` | Plan definitions, limits, assignments and measured usage. Paid subscription billing is not implied by this group. |
| Later draft — offline sync | `sync_devices`, `sync_operations`, `sync_conflicts` | Registered offline clients, operation tracking/idempotency and conflicts for review. Local SQLite is distinct from these server-side candidates. |
| Later draft — integrations/notifications | `integration_connections`, `integration_events`, `notification_deliveries` | Provider connection metadata, exchange events and email/SMS/WhatsApp delivery attempts. Credentials need secure storage, not plaintext table fields. |
| Conditional — configurable access/auth | `roles`, `permissions`, `role_permissions`, `auth_sessions` | Only if configurable permissions or stored/revocable sessions are selected. Fixed roles and the current JWT design do not require these tables. |
| Conditional — schedules/reservations | `branch_schedule_exceptions`, `delivery_time_slots`, `stock_reservations` | Only if schedule exceptions, scheduled delivery or stock reservation workflows are approved; their rules remain unresolved. |
| Conditional — grouped add-ons | `addon_groups`, `addon_group_options`, `item_addon_groups` | Only if grouped minimum/maximum add-on selection is approved (question 37 remains undecided). |
| Conditional — promotion targeting | `promotion_branches`, `promotion_items` | Only if the chosen eligibility/cardinality needs separate target mappings; a branch identifier may otherwise live on promotions. |
| Conditional — template/media metadata | `template_catalog`, `media_assets` | Optional database indexes/references for template JSON and stored image files. Does not move base/customization JSON into PostgreSQL. |
| Conditional — reports/jobs/auditing | `report_exports`, `background_jobs`, `audit_logs` | Only if durable exports, a PostgreSQL-backed job tracker or auditable actions are needed. Live reports can be queries/views; queues/log stores may be external. |
| Conditional — paid platform billing | `billing_invoices`, `billing_invoice_items`, `billing_payments` | Only if paid SaaS invoicing/collection is approved; separate from restaurant customer payments. |

## Boundaries still to resolve

- The existing tenant represents a restaurant. Restaurant-versus-business-group tenancy and owner cardinality remain open; a second `restaurants` table is not assumed automatically.
- Staff belong to one restaurant with assigned branch access; owners have access across their restaurant's branches. Exact per-branch role assignment still needs clarification.
- Menus are independent by branch. Customer-account scope, variants/add-on constraints, stock timing and tax/discount calculations remain open.
- Base template JSON and per-restaurant customization-delta JSON remain files rendered by the renderer. `theme_overrides` is recorded as an existing table, not an instruction to retain database-based appearance storage in the future. File hosting/merging/version behavior remains unresolved.
- Data isolation is required. This inventory does not select shared-versus-separate physical database topology or define RLS/foreign keys yet.
- Standard sales/financial reports and enterprise dashboards may use queries/views over operational data. Forecasts use historical orders; no duplicate sales-history table is required solely for AI.
- Carts may remain client-side. QR ordering, waiter PWA and kiosks can reuse orders/payments; they do not automatically require separate databases or table sets.
- Ingredient/supplier operations, POS/KDS, offline sync, loyalty/campaigns and AI remain later review scope; delivery fleet coordination stays outside the draft's scope.

No application code or database structure was changed for this inventory.
