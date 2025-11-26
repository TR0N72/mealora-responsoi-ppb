create or replace function create_order_and_update_stock(
  user_id uuid,
  total_price numeric,
  delivery_window_start timestamp with time zone,
  delivery_window_end timestamp with time zone,
  items jsonb
)
returns uuid as $$
declare
  order_id uuid;
  item record;
  menu_item record;
begin
  -- Create the order
  insert into orders (user_id, status, total_price, delivery_window_start, delivery_window_end)
  values (user_id, 'confirmed', total_price, delivery_window_start, delivery_window_end)
  returning id into order_id;

  -- Loop through items and update stock
  for item in select * from jsonb_to_recordset(items) as x(menu_id uuid, quantity int)
  loop
    -- Lock the menu item row
    select * from menus where id = item.menu_id into menu_item for update;

    -- Check stock
    if menu_item.stock_quantity < item.quantity then
      raise exception 'Not enough stock for menu item %', menu_item.name;
    end if;

    -- Update stock
    update menus set stock_quantity = stock_quantity - item.quantity where id = item.menu_id;

    -- Create order item
    insert into order_items (order_id, menu_id, quantity, unit_price)
    values (order_id, item.menu_id, item.quantity, menu_item.price);
  end loop;

  return order_id;
end;
$$ language plpgsql;

create or replace function replenish_stock(
  order_id_to_cancel uuid
)
returns void as $$
declare
  item record;
begin
  -- Loop through items and update stock
  for item in select * from order_items where order_id = order_id_to_cancel
  loop
    update menus set stock_quantity = stock_quantity + item.quantity where id = item.menu_id;
  end loop;
end;
$$ language plpgsql;
