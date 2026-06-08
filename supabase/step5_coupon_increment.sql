-- ============================================================
-- Step 5: Coupon used_count increment function
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

create or replace function public.increment_coupon_used_count(p_coupon_id int)
returns void
language plpgsql
security definer
as $$
begin
  update public.coupons
  set used_count = used_count + 1
  where id = p_coupon_id;
end;
$$;

grant execute on function public.increment_coupon_used_count(int) to authenticated;
