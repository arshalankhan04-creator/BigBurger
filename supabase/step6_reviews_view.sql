-- ============================================================
-- Step 6: Reviews view with profile data
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- View that joins reviews with profiles so we get
-- full_name and avatar_url alongside each review
create or replace view public.reviews_with_profiles as
  select
    r.id,
    r.product_id,
    r.user_id,
    r.rating,
    r.text,
    r.created_at,
    p.full_name,
    p.avatar_url
  from public.reviews r
  left join public.profiles p on p.id = r.user_id;

-- Grant read access to everyone (reviews are public)
grant select on public.reviews_with_profiles to anon, authenticated;
