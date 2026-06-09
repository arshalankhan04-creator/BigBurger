-- ============================================================
-- Fix: Admin RLS circular reference + add admin navbar access
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Create a security definer function to check admin role
--    This bypasses RLS so no circular reference occurs
create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
stable
as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$;

grant execute on function public.is_admin() to authenticated;

-- 2. Drop old circular policies
drop policy if exists "Admin can insert products"       on public.products;
drop policy if exists "Admin can update products"       on public.products;
drop policy if exists "Admin can delete products"       on public.products;
drop policy if exists "Admin can view all orders"       on public.orders;
drop policy if exists "Admin can update order status"   on public.orders;
drop policy if exists "Admin can view all profiles"     on public.profiles;
drop policy if exists "Admin can manage coupons"        on public.coupons;
drop policy if exists "Users can view own profile"      on public.profiles;

-- 3. Recreate using is_admin() — no circular reference
create policy "Admin can insert products" on public.products
  for insert with check (public.is_admin());

create policy "Admin can update products" on public.products
  for update using (public.is_admin());

create policy "Admin can delete products" on public.products
  for delete using (public.is_admin());

create policy "Admin can view all orders" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());

create policy "Admin can update order status" on public.orders
  for update using (public.is_admin());

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

create policy "Admin can manage coupons" on public.coupons
  for all using (public.is_admin());
