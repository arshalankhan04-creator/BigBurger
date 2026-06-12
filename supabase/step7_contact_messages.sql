-- ============================================================
-- Step 7: Contact Messages
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── 1. Contact messages table ────────────────────────────────
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text          not null,
  email      text          not null,
  phone      text,
  subject    text          not null,
  message    text          not null,
  is_read    boolean       not null default false,
  created_at timestamptz   default now()
);

-- ── 2. RLS ───────────────────────────────────────────────────
alter table public.contact_messages enable row level security;

-- Anyone (including anon) can insert — guests can submit the form
create policy "Anyone can submit contact form"
  on public.contact_messages for insert
  with check (true);

-- Only admins can read / update messages
create policy "Admin can view messages"
  on public.contact_messages for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admin can update messages"
  on public.contact_messages for update
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admin can delete messages"
  on public.contact_messages for delete
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
