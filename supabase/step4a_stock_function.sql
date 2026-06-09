-- ============================================================
-- Step 4A: Atomic stock decrement function
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Decrements stock for a single product by qty.
-- Raises an exception if stock would go below 0.
-- Called once per order item from the app.

create or replace function public.decrement_stock(p_product_id int, p_qty int)
returns void
language plpgsql
security definer
as $$
declare
  current_stock int;
  product_name  text;
begin
  -- Lock the row to prevent race conditions
  select stock, name
  into current_stock, product_name
  from public.products
  where id = p_product_id
  for update;

  if not found then
    raise exception 'Product % not found', p_product_id;
  end if;

  if current_stock < p_qty then
    raise exception 'OUT_OF_STOCK:%', product_name;
  end if;

  update public.products
  set stock = stock - p_qty
  where id = p_product_id;
end;
$$;

-- Grant execute to authenticated users
grant execute on function public.decrement_stock(int, int) to authenticated;
