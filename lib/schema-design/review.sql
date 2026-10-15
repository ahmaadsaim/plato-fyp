-- REVIEW ONLY: use a new disposable database, never your local source/Neon production.
-- psql -v tenant_model=restaurant -f lib/schema-design/review.sql <scratch connection>
-- Alternatively: tenant_model=group. This does NOT choose an approved project model.
\set ON_ERROR_STOP on
\if :{?tenant_model}
\else
\echo 'tenant_model is required: restaurant or group'
\quit 3
\endif
BEGIN;
SELECT set_config('plato.tenant_model', :'tenant_model', true);
\ir 00-foundation.sql
\ir 01-storefront.sql
\ir 02-orders-payments.sql
\ir 03-later-operations.sql
\ir 04-later-platform.sql
\ir 05-conditional.sql
\ir 06-relationships.sql
\ir 07-relationship-guards.sql
\ir 08-context-isolation.sql
COMMENT ON SCHEMA plato_draft IS 'Review-only PLATO draft. Not a production migration.';
COMMIT;
