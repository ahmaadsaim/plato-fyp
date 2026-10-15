-- Relationship guards that cannot be represented by a simple row CHECK.
SET search_path = plato_draft, public;

CREATE FUNCTION plato_draft.check_order_offer_branch() RETURNS trigger
LANGUAGE plpgsql SET search_path = plato_draft, pg_temp AS $$
DECLARE offer_branch uuid;
BEGIN
  IF NEW.promotion_id IS NOT NULL THEN
    SELECT branch_id INTO offer_branch FROM plato_draft.promotions
      WHERE tenant_id=NEW.tenant_id AND restaurant_id=NEW.restaurant_id AND id=NEW.promotion_id
      FOR SHARE;
    IF offer_branch IS NOT NULL AND offer_branch <> NEW.branch_id THEN
      RAISE EXCEPTION 'Promotion belongs to another branch' USING ERRCODE='23514';
    END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER orders_offer_scope BEFORE INSERT OR UPDATE OF promotion_id,branch_id,restaurant_id,tenant_id
  ON plato_draft.orders FOR EACH ROW EXECUTE FUNCTION plato_draft.check_order_offer_branch();

-- Do not retarget promotions that have already been referenced by orders.
CREATE FUNCTION plato_draft.protect_used_offer_scope() RETURNS trigger
LANGUAGE plpgsql SET search_path = plato_draft, pg_temp AS $$
BEGIN
  IF NEW.branch_id IS DISTINCT FROM OLD.branch_id AND EXISTS (
    SELECT 1 FROM plato_draft.orders WHERE tenant_id=OLD.tenant_id
      AND restaurant_id=OLD.restaurant_id AND promotion_id=OLD.id
  ) THEN
    RAISE EXCEPTION 'Archive the used promotion and create a new one instead of changing its branch' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER promotions_preserve_scope BEFORE UPDATE OF branch_id ON plato_draft.promotions
  FOR EACH ROW EXECUTE FUNCTION plato_draft.protect_used_offer_scope();

CREATE FUNCTION plato_draft.check_stock_mode() RETURNS trigger
LANGUAGE plpgsql SET search_path = plato_draft, pg_temp AS $$
DECLARE mode text;
BEGIN
  SELECT stock_mode INTO mode FROM plato_draft.menu_items
    WHERE tenant_id=NEW.tenant_id AND restaurant_id=NEW.restaurant_id
      AND branch_id=NEW.branch_id AND id=NEW.item_id FOR SHARE;
  IF mode IS NULL THEN
    RAISE EXCEPTION 'Item stock mode must be explicitly selected before creating stock' USING ERRCODE='23514';
  END IF;
  IF (mode='item' AND NEW.variant_id IS NOT NULL) OR (mode='variant' AND NEW.variant_id IS NULL) THEN
    RAISE EXCEPTION 'Stock position does not match the selected item/variant stock mode' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER item_stock_mode BEFORE INSERT OR UPDATE ON plato_draft.item_stock
  FOR EACH ROW EXECUTE FUNCTION plato_draft.check_stock_mode();

CREATE FUNCTION plato_draft.protect_stock_mode() RETURNS trigger
LANGUAGE plpgsql SET search_path = plato_draft, pg_temp AS $$
BEGIN
  IF NEW.stock_mode IS DISTINCT FROM OLD.stock_mode AND EXISTS (
    SELECT 1 FROM plato_draft.item_stock WHERE tenant_id=OLD.tenant_id
      AND restaurant_id=OLD.restaurant_id AND branch_id=OLD.branch_id AND item_id=OLD.id
  ) THEN
    RAISE EXCEPTION 'Stock mode changes require an explicit stock migration' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER menu_items_preserve_stock_mode BEFORE UPDATE OF stock_mode ON plato_draft.menu_items
  FOR EACH ROW EXECUTE FUNCTION plato_draft.protect_stock_mode();

CREATE FUNCTION plato_draft.check_reservation_line() RETURNS trigger
LANGUAGE plpgsql SET search_path = plato_draft, pg_temp AS $$
DECLARE stock_item uuid; stock_variant uuid; line_item uuid; line_variant uuid;
BEGIN
  SELECT item_id,variant_id INTO stock_item,stock_variant FROM plato_draft.item_stock
    WHERE tenant_id=NEW.tenant_id AND restaurant_id=NEW.restaurant_id AND branch_id=NEW.branch_id AND id=NEW.stock_id;
  SELECT item_id,variant_id INTO line_item,line_variant FROM plato_draft.order_items
    WHERE tenant_id=NEW.tenant_id AND restaurant_id=NEW.restaurant_id AND branch_id=NEW.branch_id AND id=NEW.order_item_id;
  IF stock_item IS DISTINCT FROM line_item OR (stock_variant IS NOT NULL AND stock_variant IS DISTINCT FROM line_variant) THEN
    RAISE EXCEPTION 'Reservation stock does not belong to the ordered item/variant' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER stock_reservations_line BEFORE INSERT OR UPDATE ON plato_draft.stock_reservations
  FOR EACH ROW EXECUTE FUNCTION plato_draft.check_reservation_line();
