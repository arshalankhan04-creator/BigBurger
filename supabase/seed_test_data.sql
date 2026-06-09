-- ============================================================
-- BigBurger Test Data Seed
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================
-- Creates 5 fake users, orders, reviews, and edge-case stock data.
-- Safe to run multiple times (uses ON CONFLICT DO NOTHING).
-- ============================================================

-- ── 1. FAKE USERS in auth.users ──────────────────────────────
-- These are test accounts. They cannot log in (no password hash set).
-- They exist purely for relational data (orders, reviews).

insert into auth.users (
  id, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_user_meta_data, role, aud
) values
  (
    'aaaaaaaa-0001-0001-0001-000000000001',
    'aryan.mehta@test.com', '', now(), now(), now(),
    '{"full_name":"Aryan Mehta","avatar_url":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop"}',
    'authenticated', 'authenticated'
  ),
  (
    'aaaaaaaa-0002-0002-0002-000000000002',
    'priya.shah@test.com', '', now(), now(), now(),
    '{"full_name":"Priya Shah","avatar_url":"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop"}',
    'authenticated', 'authenticated'
  ),
  (
    'aaaaaaaa-0003-0003-0003-000000000003',
    'rohan.desai@test.com', '', now(), now(), now(),
    '{"full_name":"Rohan Desai","avatar_url":"https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop"}',
    'authenticated', 'authenticated'
  ),
  (
    'aaaaaaaa-0004-0004-0004-000000000004',
    'nisha.patel@test.com', '', now(), now(), now(),
    '{"full_name":"Nisha Patel","avatar_url":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop"}',
    'authenticated', 'authenticated'
  ),
  (
    'aaaaaaaa-0005-0005-0005-000000000005',
    'karan.joshi@test.com', '', now(), now(), now(),
    '{"full_name":"Karan Joshi","avatar_url":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop"}',
    'authenticated', 'authenticated'
  )
on conflict (id) do nothing;

-- ── 2. PROFILES ───────────────────────────────────────────────
insert into public.profiles (id, email, full_name, avatar_url, role) values
  ('aaaaaaaa-0001-0001-0001-000000000001', 'aryan.mehta@test.com',  'Aryan Mehta',  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop', 'user'),
  ('aaaaaaaa-0002-0002-0002-000000000002', 'priya.shah@test.com',   'Priya Shah',   'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop', 'user'),
  ('aaaaaaaa-0003-0003-0003-000000000003', 'rohan.desai@test.com',  'Rohan Desai',  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop', 'user'),
  ('aaaaaaaa-0004-0004-0004-000000000004', 'nisha.patel@test.com',  'Nisha Patel',  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop', 'user'),
  ('aaaaaaaa-0005-0005-0005-000000000005', 'karan.joshi@test.com',  'Karan Joshi',  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop', 'user')
on conflict (id) do nothing;

-- ── 3. ORDERS ─────────────────────────────────────────────────
-- Mix of statuses, order types, and amounts for dashboard realism

insert into public.orders (id, user_id, status, order_type, total, coupon_code, discount, created_at) values
  -- Delivered orders (revenue contributors)
  ('bbbbbbbb-0001-0001-0001-000000000001', 'aaaaaaaa-0001-0001-0001-000000000001', 'delivered',  'delivery', 163.00, null,        0,  now() - interval '10 days'),
  ('bbbbbbbb-0002-0002-0002-000000000002', 'aaaaaaaa-0002-0002-0002-000000000002', 'delivered',  'delivery', 220.00, 'LUNCHTIME', 33, now() - interval '8 days'),
  ('bbbbbbbb-0003-0003-0003-000000000003', 'aaaaaaaa-0003-0003-0003-000000000003', 'delivered',  'pickup',   100.00, null,        0,  now() - interval '6 days'),
  ('bbbbbbbb-0004-0004-0004-000000000004', 'aaaaaaaa-0004-0004-0004-000000000004', 'delivered',  'delivery', 540.00, 'BIGBITE20', 108,now() - interval '5 days'),
  ('bbbbbbbb-0005-0005-0005-000000000005', 'aaaaaaaa-0001-0001-0001-000000000001', 'delivered',  'delivery', 103.00, null,        0,  now() - interval '4 days'),
  -- Active orders (various statuses)
  ('bbbbbbbb-0006-0006-0006-000000000006', 'aaaaaaaa-0002-0002-0002-000000000002', 'preparing',  'delivery', 145.00, null,        0,  now() - interval '30 minutes'),
  ('bbbbbbbb-0007-0007-0007-000000000007', 'aaaaaaaa-0003-0003-0003-000000000003', 'ready',      'pickup',   75.00,  null,        0,  now() - interval '15 minutes'),
  ('bbbbbbbb-0008-0008-0008-000000000008', 'aaaaaaaa-0005-0005-0005-000000000005', 'on_the_way', 'delivery', 183.00, null,        0,  now() - interval '45 minutes'),
  ('bbbbbbbb-0009-0009-0009-000000000009', 'aaaaaaaa-0004-0004-0004-000000000004', 'placed',     'delivery', 68.00,  null,        0,  now() - interval '5 minutes'),
  -- Edge case: high-value order with coupon
  ('bbbbbbbb-0010-0010-0010-000000000010', 'aaaaaaaa-0005-0005-0005-000000000005', 'delivered',  'delivery', 1500.00,'ROYALE500', 500,now() - interval '3 days')
on conflict (id) do nothing;

-- ── 4. ORDER ITEMS ────────────────────────────────────────────
insert into public.order_items (order_id, product_id, name, price, qty, image) values
  -- Order 1: Regular Beef Burger x2 + Classic Fries
  ('bbbbbbbb-0001-0001-0001-000000000001', 1,  'Regular Beef Burger', 45.00, 2, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop&auto=format'),
  ('bbbbbbbb-0001-0001-0001-000000000001', 7,  'Classic Fries',       18.00, 1, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=600&fit=crop&auto=format'),
  -- Order 2: Beef Cheese Burger + Strawberry Lemonade x2
  ('bbbbbbbb-0002-0002-0002-000000000002', 2,  'Beef Cheese Burger',  55.00, 2, 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&h=600&fit=crop&auto=format'),
  ('bbbbbbbb-0002-0002-0002-000000000002', 13, 'Strawberry Lemonade', 22.00, 2, 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=600&fit=crop&auto=format'),
  -- Order 3: Chicken Burger + Onion Rings
  ('bbbbbbbb-0003-0003-0003-000000000003', 3,  'Chicken Burger',      48.00, 1, 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&h=600&fit=crop&auto=format'),
  ('bbbbbbbb-0003-0003-0003-000000000003', 9,  'Onion Rings',         22.00, 1, 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=600&h=600&fit=crop&auto=format'),
  -- Order 4: Black Beef Burger x3 + Chocolate Fudge Shake x3
  ('bbbbbbbb-0004-0004-0004-000000000004', 4,  'Black Beef Burger',       75.00, 3, 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&h=600&fit=crop&auto=format'),
  ('bbbbbbbb-0004-0004-0004-000000000004', 14, 'Chocolate Fudge Shake',   32.00, 3, 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=600&h=600&fit=crop&auto=format'),
  -- Order 5: Mushroom Swiss + Classic Fries
  ('bbbbbbbb-0005-0005-0005-000000000005', 5,  'Mushroom Swiss Burger',   52.00, 1, 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&h=600&fit=crop&auto=format'),
  ('bbbbbbbb-0005-0005-0005-000000000005', 7,  'Classic Fries',           18.00, 1, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=600&fit=crop&auto=format'),
  -- Order 6: Spicy Jalapeño + Loaded Cheese Fries
  ('bbbbbbbb-0006-0006-0006-000000000006', 6,  'Spicy Jalapeño Burger',   50.00, 1, 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&h=600&fit=crop&auto=format'),
  ('bbbbbbbb-0006-0006-0006-000000000006', 8,  'Loaded Cheese Fries',     28.00, 1, 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&h=600&fit=crop&auto=format'),
  -- Order 7: Black Beef Burger pickup
  ('bbbbbbbb-0007-0007-0007-000000000007', 4,  'Black Beef Burger',       75.00, 1, 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&h=600&fit=crop&auto=format'),
  -- Order 8: Beef Cheese + Salad + Lemonade
  ('bbbbbbbb-0008-0008-0008-000000000008', 2,  'Beef Cheese Burger',      55.00, 1, 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&h=600&fit=crop&auto=format'),
  ('bbbbbbbb-0008-0008-0008-000000000008', 11, 'Grilled Chicken Salad',   42.00, 1, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop&auto=format'),
  ('bbbbbbbb-0008-0008-0008-000000000008', 13, 'Strawberry Lemonade',     22.00, 1, 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=600&fit=crop&auto=format'),
  -- Order 9: Quick placed order
  ('bbbbbbbb-0009-0009-0009-000000000009', 1,  'Regular Beef Burger',     45.00, 1, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop&auto=format'),
  -- Order 10: Large party order (edge case — high value)
  ('bbbbbbbb-0010-0010-0010-000000000010', 4,  'Black Beef Burger',       75.00, 10, 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&h=600&fit=crop&auto=format'),
  ('bbbbbbbb-0010-0010-0010-000000000010', 2,  'Beef Cheese Burger',      55.00, 10, 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&h=600&fit=crop&auto=format'),
  ('bbbbbbbb-0010-0010-0010-000000000010', 14, 'Chocolate Fudge Shake',   32.00, 5,  'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=600&h=600&fit=crop&auto=format')
on conflict do nothing;

-- ── 5. REVIEWS ────────────────────────────────────────────────
insert into public.reviews (product_id, user_id, rating, text, created_at) values
  -- Regular Beef Burger reviews
  (1, 'aaaaaaaa-0001-0001-0001-000000000001', 5, 'Absolutely incredible! The patty was perfectly charred and juicy. Best burger I''ve had by far.',            now() - interval '9 days'),
  (1, 'aaaaaaaa-0002-0002-0002-000000000002', 4, 'Really good quality. The bun was fresh and the patty was cooked just right. Highly recommend.',             now() - interval '7 days'),
  (1, 'aaaaaaaa-0003-0003-0003-000000000003', 3, 'Decent burger but I expected a bit more flavor. The fries on the side were great though.',                  now() - interval '5 days'),
  -- Beef Cheese Burger reviews
  (2, 'aaaaaaaa-0004-0004-0004-000000000004', 5, 'This is my go-to order every weekend. Never disappoints. The ingredients taste so fresh every single time.', now() - interval '8 days'),
  (2, 'aaaaaaaa-0001-0001-0001-000000000001', 5, 'Wow. Just wow. The char on the patty is unreal. You can actually taste the flame-grilling. Worth every rupee.', now() - interval '4 days'),
  -- Black Beef Burger — premium product reviews
  (4, 'aaaaaaaa-0005-0005-0005-000000000005', 5, 'The wagyu beef is on another level. Truffle aioli is perfect. Worth every rupee.',                         now() - interval '3 days'),
  (4, 'aaaaaaaa-0002-0002-0002-000000000002', 4, 'Expensive but worth it for a special occasion. The charcoal bun is dramatic and delicious.',               now() - interval '2 days'),
  -- Edge case: multiple reviews from same user on same product (allowed)
  (2, 'aaaaaaaa-0002-0002-0002-000000000002', 5, 'Ordered again and it''s even better! Consistent quality every time.',                                      now() - interval '1 day'),
  -- 1-star review (edge case — low rating)
  (6, 'aaaaaaaa-0003-0003-0003-000000000003', 1, 'Way too spicy for me. I should have checked the description. Not the restaurant''s fault but not for me.', now() - interval '6 days'),
  -- Dessert reviews
  (17, 'aaaaaaaa-0004-0004-0004-000000000004', 5, 'The molten lava cake is PERFECT. Gooey center, warm, with the ice cream on the side. Absolute heaven.',   now() - interval '2 days'),
  (15, 'aaaaaaaa-0005-0005-0005-000000000005', 4, 'Classic brownie done right. Dense and fudgy. The walnuts add a great crunch.',                             now() - interval '1 day')
on conflict do nothing;

-- ── 6. EDGE CASE: STOCK UPDATES ───────────────────────────────
-- Set some products to low/zero stock for testing out-of-stock UI

-- Out of stock (stock = 0)
update public.products set stock = 0 where id = 9;   -- Onion Rings

-- Very low stock (stock = 2) — edge case
update public.products set stock = 2 where id = 4;   -- Black Beef Burger

-- Normal stock for others (already set at 50–100 from initial seed)

-- ── 7. VERIFY ─────────────────────────────────────────────────
select 'Users'    as table_name, count(*) from public.profiles   where email like '%@test.com'
union all
select 'Orders',   count(*) from public.orders
union all
select 'Items',    count(*) from public.order_items
union all
select 'Reviews',  count(*) from public.reviews;
