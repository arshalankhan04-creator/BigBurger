-- ============================================================
-- BigBurger Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── 1. PROFILES ─────────────────────────────────────────────
-- Auto-created when a user signs in via Google Auth
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz default now()
);

-- Auto-populate profile on first sign-in
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── 2. CATEGORIES ────────────────────────────────────────────
create table if not exists public.categories (
  id    serial primary key,
  label text    not null,
  slug  text    not null unique,
  image text
);

-- ── 3. PRODUCTS ──────────────────────────────────────────────
create table if not exists public.products (
  id          serial primary key,
  name        text           not null,
  description text,
  ingredients text,
  price       numeric(10,2)  not null,
  image       text,
  category    text           not null references public.categories(slug),
  badge       text,
  calories    int
);

-- ── 4. WISHLIST ITEMS ────────────────────────────────────────
create table if not exists public.wishlist_items (
  id          serial primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  product_id  int  not null references public.products(id) on delete cascade,
  created_at  timestamptz default now(),
  unique(user_id, product_id)
);

-- ── 5. ORDERS ────────────────────────────────────────────────
create table if not exists public.orders (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  status      text not null default 'placed'
                check (status in ('placed','preparing','on_the_way','ready','delivered')),
  order_type  text not null default 'delivery'
                check (order_type in ('delivery','pickup')),
  total       numeric(10,2) not null,
  created_at  timestamptz default now()
);

-- ── 6. ORDER ITEMS ───────────────────────────────────────────
create table if not exists public.order_items (
  id          serial primary key,
  order_id    uuid not null references public.orders(id) on delete cascade,
  product_id  int  not null references public.products(id),
  name        text not null,
  price       numeric(10,2) not null,
  qty         int  not null,
  image       text
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Each user can only see/edit their own data
-- ============================================================

alter table public.profiles      enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.orders         enable row level security;
alter table public.order_items    enable row level security;

-- Products & categories are public (read-only for everyone)
alter table public.products   enable row level security;
alter table public.categories enable row level security;

create policy "Public read products"   on public.products   for select using (true);
create policy "Public read categories" on public.categories for select using (true);

-- Profiles
create policy "Users can view own profile"   on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Wishlist
create policy "Users can view own wishlist"   on public.wishlist_items for select using (auth.uid() = user_id);
create policy "Users can insert own wishlist" on public.wishlist_items for insert with check (auth.uid() = user_id);
create policy "Users can delete own wishlist" on public.wishlist_items for delete using (auth.uid() = user_id);

-- Orders
create policy "Users can view own orders"   on public.orders for select using (auth.uid() = user_id);
create policy "Users can insert own orders" on public.orders for insert with check (auth.uid() = user_id);

-- Order items
create policy "Users can view own order items" on public.order_items for select
  using (exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid()));
create policy "Users can insert own order items" on public.order_items for insert
  with check (exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid()));
