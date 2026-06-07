-- ============================================================
-- Step 1: Schema Updates
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── 1. Add role to profiles ───────────────────────────────────
alter table public.profiles
  add column if not exists role text not null default 'user'
  check (role in ('user', 'admin'));

-- Update trigger to include role = 'user' on new sign-ups
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    'user'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- ── 2. Add stock to products ──────────────────────────────────
alter table public.products
  add column if not exists stock int not null default 100;

-- Set realistic stock values
update public.products set stock = 50  where category = 'burgers';
update public.products set stock = 80  where category = 'sides';
update public.products set stock = 60  where category = 'salads';
update public.products set stock = 100 where category = 'drinks';
update public.products set stock = 70  where category = 'desserts';

-- ── 3. Coupons table ─────────────────────────────────────────
create table if not exists public.coupons (
  id            serial primary key,
  code          text          not null unique,
  type          text          not null check (type in ('percent','flat','delivery','bogo','freeitem')),
  value         numeric(10,2) not null default 0,
  min_order     numeric(10,2) not null default 0,
  usage_limit   int           not null default 100,  -- total uses allowed
  used_count    int           not null default 0,
  expires_at    timestamptz,                          -- null = never expires
  is_active     boolean       not null default true,
  label         text,
  created_at    timestamptz   default now()
);

-- RLS: anyone can read active coupons (to validate), only service role can write
alter table public.coupons enable row level security;
create policy "Public read coupons" on public.coupons for select using (true);

-- ── 4. Coupon uses (one-time per user tracking) ───────────────
create table if not exists public.coupon_uses (
  id          serial primary key,
  coupon_id   int  not null references public.coupons(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  order_id    uuid references public.orders(id) on delete set null,
  used_at     timestamptz default now(),
  unique(coupon_id, user_id)   -- one use per user per coupon
);

alter table public.coupon_uses enable row level security;
create policy "Users can view own coupon uses" on public.coupon_uses
  for select using (auth.uid() = user_id);
create policy "Users can insert own coupon uses" on public.coupon_uses
  for insert with check (auth.uid() = user_id);

-- ── 5. Seed coupons ───────────────────────────────────────────
insert into public.coupons (code, type, value, min_order, usage_limit, expires_at, label) values
  ('WELCOME20',    'percent',  20,  0,    500, now() + interval '90 days', '20% off your first order'),
  ('BURGER50',     'flat',     50,  200,  200, now() + interval '30 days', '₹50 off on orders above ₹200'),
  ('BIGBITE20',    'percent',  20,  0,    500, now() + interval '60 days', '20% off your order'),
  ('FREEDELIVERY', 'delivery', 0,   100,  300, now() + interval '7 days',  'Free delivery on orders above ₹100'),
  ('LUNCHTIME',    'percent',  15,  0,    400, now() + interval '45 days', '15% off your order'),
  ('ROYALE500',    'flat',     500, 2000, 50,  now() + interval '30 days', '₹500 off on orders above ₹2000')
on conflict (code) do nothing;

-- ── 6. Reviews table ─────────────────────────────────────────
create table if not exists public.reviews (
  id          serial primary key,
  product_id  int  not null references public.products(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  rating      int  not null check (rating between 1 and 5),
  text        text not null,
  created_at  timestamptz default now()
  -- no unique constraint — users can review multiple times
);

alter table public.reviews enable row level security;
create policy "Public read reviews"    on public.reviews for select using (true);
create policy "Users can add reviews"  on public.reviews for insert with check (auth.uid() = user_id);
create policy "Users can delete own reviews" on public.reviews for delete using (auth.uid() = user_id);

-- ── 7. Add coupon_code to orders ─────────────────────────────
alter table public.orders
  add column if not exists coupon_code text,
  add column if not exists discount    numeric(10,2) not null default 0;

-- ── 8. RLS policy for admin full access ──────────────────────
-- Products: admin can insert/update/delete
create policy "Admin can insert products" on public.products
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
create policy "Admin can update products" on public.products
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
create policy "Admin can delete products" on public.products
  for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Orders: admin can view and update all orders
create policy "Admin can view all orders" on public.orders
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
create policy "Admin can update order status" on public.orders
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Profiles: admin can view all profiles
create policy "Admin can view all profiles" on public.profiles
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Coupons: admin can manage coupons
create policy "Admin can manage coupons" on public.coupons
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
