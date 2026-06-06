-- ============================================================
-- BigBurger Seed Data
-- Run AFTER schema.sql in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── CATEGORIES ───────────────────────────────────────────────
insert into public.categories (id, label, slug, image) values
  (1, 'Burgers',  'burgers',  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop&crop=center&auto=format'),
  (2, 'Sides',    'sides',    'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop&crop=center&auto=format'),
  (3, 'Salads',   'salads',   'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop&crop=center&auto=format'),
  (4, 'Drinks',   'drinks',   'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop&crop=center&auto=format'),
  (5, 'Desserts', 'desserts', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop&crop=center&auto=format')
on conflict (id) do nothing;

-- ── PRODUCTS ─────────────────────────────────────────────────
insert into public.products (id, name, description, ingredients, price, image, category, badge, calories) values

  -- Burgers
  (1,  'Regular Beef Burger',
       'Our classic flame-grilled beef patty stacked with crisp lettuce, ripe tomato, crunchy pickles and tangy mustard on a toasted sesame bun.',
       'Beef patty, lettuce, tomato, pickles, mustard',
       45.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop&auto=format',
       'burgers', null, 540),

  (2,  'Beef Cheese Burger',
       'Double flame-grilled beef patties loaded with melted cheddar, sweet caramelized onions and our secret house sauce.',
       'Double beef, cheddar, caramelized onion, special sauce',
       55.00, 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&h=600&fit=crop&auto=format',
       'burgers', 'Popular', 720),

  (3,  'Chicken Burger',
       'Golden crispy fried chicken breast with creamy coleslaw, spicy sriracha mayo and crunchy pickles on a brioche bun.',
       'Crispy chicken, coleslaw, sriracha mayo, pickles',
       48.00, 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&h=600&fit=crop&auto=format',
       'burgers', null, 610),

  (4,  'Black Beef Burger',
       'Premium wagyu beef patty on a dramatic charcoal bun with earthy truffle aioli and peppery arugula. Our most indulgent burger.',
       'Charcoal bun, wagyu beef, truffle aioli, arugula',
       75.00, 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&h=600&fit=crop&auto=format',
       'burgers', 'Premium', 780),

  (5,  'Mushroom Swiss Burger',
       'Juicy beef patty topped with melted swiss cheese, earthy sautéed mushrooms and creamy garlic aioli.',
       'Beef patty, swiss cheese, sautéed mushrooms, garlic aioli',
       52.00, 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&h=600&fit=crop&auto=format',
       'burgers', null, 650),

  (6,  'Spicy Jalapeño Burger',
       'For the heat seekers. Flame-grilled beef with fresh jalapeños, melted pepper jack and smoky chipotle mayo.',
       'Beef patty, jalapeños, pepper jack, chipotle mayo',
       50.00, 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&h=600&fit=crop&auto=format',
       'burgers', '🌶 Hot', 630),

  -- Sides
  (7,  'Classic Fries',
       'Hand-cut russet potato fries fried to golden perfection and seasoned with flaky sea salt.',
       'Russet potatoes, sea salt, vegetable oil',
       18.00, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=600&fit=crop&auto=format',
       'sides', null, 320),

  (8,  'Loaded Cheese Fries',
       'Our crispy fries smothered in warm cheddar sauce, crispy bacon bits, pickled jalapeños and cool sour cream.',
       'Fries, cheddar sauce, bacon bits, jalapeños, sour cream',
       28.00, 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&h=600&fit=crop&auto=format',
       'sides', 'Popular', 580),

  (9,  'Onion Rings',
       'Thick-cut sweet onion rings in a crispy seasoned batter, served with our signature dipping sauce.',
       'Sweet onions, seasoned batter, dipping sauce',
       22.00, 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=600&h=600&fit=crop&auto=format',
       'sides', null, 410),

  -- Salads
  (10, 'Fresh Caesar Salad',
       'Crisp romaine lettuce tossed in classic caesar dressing with shaved parmesan and house-made croutons.',
       'Romaine, parmesan, croutons, caesar dressing',
       35.00, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=600&fit=crop&auto=format',
       'salads', null, 280),

  (11, 'Grilled Chicken Salad',
       'Tender grilled chicken breast over a bed of mixed greens, cherry tomatoes and cucumber with balsamic vinaigrette.',
       'Grilled chicken, mixed greens, cherry tomatoes, balsamic',
       42.00, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop&auto=format',
       'salads', 'Healthy', 320),

  -- Drinks
  (12, 'Cookies & Cream Shake',
       'Thick and creamy vanilla milkshake blended with crushed Oreo cookies, topped with whipped cream and chocolate drizzle.',
       'Vanilla ice cream, oreo, whipped cream, chocolate drizzle',
       32.00, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&h=600&fit=crop&auto=format',
       'drinks', null, 680),

  (13, 'Strawberry Lemonade',
       'House-made lemonade blended with fresh strawberries and topped with sparkling water. Refreshing and vibrant.',
       'Fresh strawberries, lemon juice, cane sugar, sparkling water',
       22.00, 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=600&fit=crop&auto=format',
       'drinks', null, 180),

  (14, 'Chocolate Fudge Shake',
       'Rich chocolate ice cream blended with warm fudge sauce and topped with a mountain of whipped cream.',
       'Chocolate ice cream, fudge sauce, whipped cream',
       32.00, 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=600&h=600&fit=crop&auto=format',
       'drinks', 'Popular', 720),

  -- Desserts
  (15, 'Classic Brownie',
       'Dense, fudgy dark chocolate brownie loaded with crunchy walnuts. Served warm with a dusting of powdered sugar.',
       'Dark chocolate, butter, eggs, flour, walnuts',
       28.00, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=600&fit=crop&auto=format',
       'desserts', null, 420),

  (16, 'Vanilla Soft Serve',
       'Creamy soft-serve vanilla ice cream swirled high in a crispy waffle cone. Simple, classic, and irresistible.',
       'Vanilla ice cream, waffle cone, sprinkles',
       18.00, 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=600&fit=crop&auto=format',
       'desserts', 'Popular', 280),

  (17, 'Molten Lava Cake',
       'Warm chocolate cake with a gooey molten center, served with a scoop of vanilla ice cream. Pure indulgence.',
       'Dark chocolate, butter, eggs, sugar, vanilla ice cream',
       45.00, 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&h=600&fit=crop&auto=format',
       'desserts', '🔥 Hot', 580),

  (18, 'Churros with Dip',
       'Golden crispy churros rolled in cinnamon sugar, served with a rich warm chocolate dipping sauce.',
       'Fried dough, cinnamon sugar, chocolate dipping sauce',
       32.00, 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&h=600&fit=crop&auto=format',
       'desserts', null, 390),

  (19, 'Strawberry Cheesecake',
       'Velvety New York-style cheesecake on a buttery graham cracker base, topped with fresh strawberry compote.',
       'Cream cheese, graham cracker crust, fresh strawberries, whipped cream',
       52.00, 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=600&fit=crop&auto=format',
       'desserts', 'Premium', 490)

on conflict (id) do nothing;
