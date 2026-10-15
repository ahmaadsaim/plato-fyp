# PLATO schema design (review draft)

This folder contains the requested whole-FYP SQL schema and relationship design. It is a review artifact, not a production migration. The executable application still uses `lib/schema.sql`; no app query or Neon schema was changed by this design.

## Tenant boundary is deliberately unresolved

Muaz selected SQL files plus diagrams and explicitly left restaurant-versus-group tenancy unresolved. The review runner has **no default model** and refuses to run without `tenant_model=restaurant` or `tenant_model=group`.

| Review alternative | Tenant/restaurant relationship | Meaning |
| --- | --- | --- |
| restaurant | One tenant has at most one restaurant | Tenant is the restaurant isolation unit; onboarding creates both records atomically. The restaurant profile could later be merged into tenants after the choice is approved. |
| group | One tenant has multiple restaurants | Tenant is the group isolation unit; each restaurant still owns its branding, branches and staff memberships. Group-owner authorization is still open. |

`restaurants` is the additional provisional entity needed to compare these alternatives. Thus this draft contains **93 domain tables**, compared with the inventory's 92 working candidates. This does not approve a business-group model, a final 93-table architecture or every later feature. Neither alternative has been selected for PLATO. More than one restaurant per owner is structurally possible; its business rule remains unapproved.

## Files

| File | Content |
| --- | --- |
| [00-foundation.sql](00-foundation.sql) | Identity, tenant/restaurant alternatives, branches and staff access. |
| [01-storefront.sql](01-storefront.sql) | Branch settings, customer profiles, independent menus and item quantity records. |
| [02-orders-payments.sql](02-orders-payments.sql) | Orders and snapshots, promotions, payment attempts and manual-refund records. |
| [03-later-operations.sql](03-later-operations.sql) | POS, tables/QR, KDS, ingredients, purchasing and staff scheduling. |
| [04-later-platform.sql](04-later-platform.sql) | Loyalty/campaigns, forecasting, plans, offline synchronization and integrations. |
| [05-conditional.sql](05-conditional.sql) | Optional permissions, stored sessions, delivery slots/reservations, grouped add-ons, metadata, jobs and paid SaaS billing. |
| [06-relationships.sql](06-relationships.sql) | Primary-parent FKs, composite scope constraints, join uniqueness and reference indexes. |
| [07-relationship-guards.sql](07-relationship-guards.sql) | Branch-offer, stock-mode and reservation/item consistency guards. |
| [08-context-isolation.sql](08-context-isolation.sql) | RLS context-isolation baseline; no runtime role provisioning or grants. |
| [relationships.md](relationships.md) | Module ER diagrams and a relationship matrix covering every table. |
| [review.sql](review.sql) | Transactional psql runner that builds all draft modules in a new `plato_draft` namespace. |

The complete review runner includes later/conditional tables to validate the whole design. This is not the initial product rollout or a module-enable decision. A production migration must be written separately after reviewing scope and open requirements; applying a selected module alone without its dependencies is not supported by this review runner.

## Relationships and data rules

1. Each entity has a UUID primary key. A tenant/restaurant/branch entity also has a unique scoped key. Its child references the **whole parent scope**, preventing same-group cross-restaurant or same-restaurant cross-branch references. These are database foreign keys, not just application filters. [PostgreSQL constraints](https://www.postgresql.org/docs/18/ddl-constraints.html)
2. One staff account has one restaurant membership (`UNIQUE(user_id)`). A membership has many assigned branches through `staff_branch_access`. This draft carries one fixed role on the membership; differing roles per branch, configurable roles and global email namespaces still require decisions. Managers' staff-management authority and branch assignment restrictions must be enforced by services.
3. Owners are referenced by `restaurants.owner_user_id` and can access that restaurant's branches. Optional owner-versus-staff actor references in refunds/AI decisions require exactly one actor. The owner FK checks the actual restaurant owner, not merely any user.
4. Menus are branch-owned. Item variants belong to their item; allowed add-ons are linked through `item_addons`. An order line's variant cannot belong to another item, and chosen add-ons must be linked to that line's item. Later grouped-add-on behavior still needs minimum/maximum selection validation.
5. Stock supports either item or variant mode, with no chosen default. The item must have a mode explicitly set before stock can be inserted; incompatible positions and duplicate null-variant positions are rejected. A mode cannot be switched while positions exist. This expresses both unresolved options; it does not select question 41 or when to reserve/deduct/restock stock.
6. Guest orders have no customer FK and keep submitted name/phone/address snapshots on the order. Registered customer profiles are restaurant-scoped; they may optionally link to the same global `users` identity. This permits a shared identity with separate restaurant profiles without deciding whether customer login is platform-wide. Authentication namespace, registration and cross-restaurant customer access remain unresolved. No customer credential design is finalized by this draft.
7. Orders own lines, selected add-ons, status history and payment attempts. Names, prices, tax and discount amounts are stored as snapshots; referential integrity retains source links. Amounts use exact numeric values. Totals have an arithmetic CHECK; line summation, discount allocation, tax policy and rounding remain service/design decisions.
8. One order has at most one promotion. A branch offer must match the order's branch. A redemption references both the order and its selected promotion; duplicate redemptions are rejected. Eligibility, caps, time windows and optional item/branch target maps need final business rules.
9. Payments belong to orders; refunds belong to payments; provider events belong to the relevant attempt. Provider callbacks require signature verification and replay protection. SQL FK/CHECK constraints do not enforce accepted-before-payment, successful-payment-before-preparation, cash-on-delivery collection, full-refund amount, economic refund uniqueness or a user's branch authority. Those require transactional services and provider verification.
10. Kitchen ticket lines carry order provenance so a ticket cannot contain a line from another order. Goods-receipt lines carry purchase-order provenance; batch-waste and shift-attendance relationships similarly preserve their specific parent identity.
11. All FKs use RESTRICT rather than cascading away orders, money or stock history. Archive referenced master records. Tenant deletion/retention, anonymization, append-only ledgers and deletion jobs remain unresolved. `updated_at` must be maintained by future write services; no application writer was changed here.
12. Templates and customized appearance stay in files. The draft stores only file references/optional catalog metadata. `template_key` remains a renderer-resolved file identity. File merge, version inheritance, durable hosting and publish rollback are still open; the current `theme_overrides` table is legacy and is not deleted by these files.

## Isolation baseline and authorization limits

The scoped-table RLS policies match `app.tenant_id` and, for business records, `app.restaurant_id`. Missing context exposes no business rows. RLS is enabled and forced. A trusted server must validate identity/membership **before** setting context, using transaction-local settings on the same checked-out connection. Arbitrary client-controlled context values are not authentication. [PostgreSQL row security](https://www.postgresql.org/docs/18/ddl-rowsecurity.html)

This baseline is **not complete branch/role authorization**: same-restaurant branches remain visible in the context policy. The API and a reviewed role-specific policy must enforce `staff_branch_access`, owner/manager permissions and customer self-access. API roles must not own tables or have BYPASSRLS/superuser privileges; privileges and separate authentication/platform administration roles have not been provisioned. Current authentication would need a controlled auth role before it could query draft users by email. This review schema is not wired into the app.

In particular, tenant-scoped audit/billing/usage records are for a controlled platform/group admin path, not automatically all restaurant staff. A group tenant never implies that staff of one restaurant may browse its other restaurants.

## Remaining requirements before production migration

- Tenant model; owner cardinality and group-owner privileges.
- Customer identity scope and privacy/access policy; staff email namespace and per-branch role cardinality.
- Variant and add-on rules (question 37); item-versus-variant quantity and reservation timing (41/42).
- Delivery threshold basis and tax calculation/delivery-tax rules (43–45); promotion limits and order/payment state machine.
- Branch hours exceptions, scheduled delivery, guest verification and cancellation/payment/preparation races.
- Which later and conditional modules are approved; queue/provider decisions; exact role/RLS grants and integration idempotency.
- Template JSON hosting/versioning/merge and legacy override migration; retention/deletion and offline conflict policy. The current three-table app setup starts fresh on Neon without importing local records.

## How to review SQL

Use an explicitly disposable database, not the local source or Neon production. This design never adds itself to `npm run db:migrate`.

```powershell
psql "<SCRATCH_DATABASE_URL>" -v tenant_model=restaurant -f lib/schema-design/review.sql
# For a separate fresh database, compare the other alternative:
psql "<ANOTHER_SCRATCH_DATABASE_URL>" -v tenant_model=group -f lib/schema-design/review.sql
```

The runner aborts if no valid tenant model is supplied or if `plato_draft` already exists. It runs within a transaction. Choosing a value for a scratch review does not approve that value for the application.

## Validation completed

Both review alternatives compiled successfully on PostgreSQL 18.6 in disposable databases in an isolated temporary local cluster. Each produced 93 domain tables and 217 foreign keys. Checks rejected cross-tenant/cross-branch references, wrong-item variants, duplicate null-variant stock positions, incompatible stock modes, wrong-branch offers, wrong-order kitchen lines, deletion of referenced items and staff membership in two restaurants. The group alternative also rejected a reference to another restaurant inside the same tenant. Historical price snapshots survived menu price updates. A nonprivileged test role saw no branch rows without context and only the selected restaurant's rows with context.

These checks verify the drafted constraints and context isolation, not a complete role/branch/customer authorization matrix, production migrations or end-to-end business workflows. Every table is represented in the relationship matrix. No existing local or Neon database was used for schema creation or test data. The temporary test server was stopped afterward.
