// ─── Full menu data ───────────────────────────────────────────────
// Images: Unsplash CDN URLs (swap with local assets before production)

export const allProducts = [
  // Burgers
  {
    id: 1,
    name: 'Regular Beef Burger',
    ingredients: 'Beef patty, lettuce, tomato, pickles, mustard',
    description:
      'Our classic flame-grilled beef patty stacked with crisp lettuce, ripe tomato, crunchy pickles and tangy mustard on a toasted sesame bun.',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop&auto=format',
    category: 'burgers',
    badge: null,
    calories: 540,
  },
  {
    id: 2,
    name: 'Beef Cheese Burger',
    ingredients: 'Double beef, cheddar, caramelized onion, special sauce',
    description:
      'Double flame-grilled beef patties loaded with melted cheddar, sweet caramelized onions and our secret house sauce.',
    price: 55.00,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&h=600&fit=crop&auto=format',
    category: 'burgers',
    badge: 'Popular',
    calories: 720,
  },
  {
    id: 3,
    name: 'Chicken Burger',
    ingredients: 'Crispy chicken, coleslaw, sriracha mayo, pickles',
    description:
      'Golden crispy fried chicken breast with creamy coleslaw, spicy sriracha mayo and crunchy pickles on a brioche bun.',
    price: 48.00,
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&h=600&fit=crop&auto=format',
    category: 'burgers',
    badge: null,
    calories: 610,
  },
  {
    id: 4,
    name: 'Black Beef Burger',
    ingredients: 'Charcoal bun, wagyu beef, truffle aioli, arugula',
    description:
      'Premium wagyu beef patty on a dramatic charcoal bun with earthy truffle aioli and peppery arugula. Our most indulgent burger.',
    price: 75.00,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&h=600&fit=crop&auto=format',
    category: 'burgers',
    badge: 'Premium',
    calories: 780,
  },
  {
    id: 5,
    name: 'Mushroom Swiss Burger',
    ingredients: 'Beef patty, swiss cheese, sautéed mushrooms, garlic aioli',
    description:
      'Juicy beef patty topped with melted swiss cheese, earthy sautéed mushrooms and creamy garlic aioli.',
    price: 52.00,
    image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&h=600&fit=crop&auto=format',
    category: 'burgers',
    badge: null,
    calories: 650,
  },
  {
    id: 6,
    name: 'Spicy Jalapeño Burger',
    ingredients: 'Beef patty, jalapeños, pepper jack, chipotle mayo',
    description:
      'For the heat seekers. Flame-grilled beef with fresh jalapeños, melted pepper jack and smoky chipotle mayo.',
    price: 50.00,
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&h=600&fit=crop&auto=format',
    category: 'burgers',
    badge: '🌶 Hot',
    calories: 630,
  },

  // Sides
  {
    id: 7,
    name: 'Classic Fries',
    ingredients: 'Russet potatoes, sea salt, vegetable oil',
    description:
      'Hand-cut russet potato fries fried to golden perfection and seasoned with flaky sea salt.',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=600&fit=crop&auto=format',
    category: 'sides',
    badge: null,
    calories: 320,
  },
  {
    id: 8,
    name: 'Loaded Cheese Fries',
    ingredients: 'Fries, cheddar sauce, bacon bits, jalapeños, sour cream',
    description:
      'Our crispy fries smothered in warm cheddar sauce, crispy bacon bits, pickled jalapeños and cool sour cream.',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&h=600&fit=crop&auto=format',
    category: 'sides',
    badge: 'Popular',
    calories: 580,
  },
  {
    id: 9,
    name: 'Onion Rings',
    ingredients: 'Sweet onions, seasoned batter, dipping sauce',
    description:
      'Thick-cut sweet onion rings in a crispy seasoned batter, served with our signature dipping sauce.',
    price: 22.00,
    image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=600&h=600&fit=crop&auto=format',
    category: 'sides',
    badge: null,
    calories: 410,
  },

  // Salads
  {
    id: 10,
    name: 'Fresh Caesar Salad',
    ingredients: 'Romaine, parmesan, croutons, caesar dressing',
    description:
      'Crisp romaine lettuce tossed in classic caesar dressing with shaved parmesan and house-made croutons.',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=600&fit=crop&auto=format',
    category: 'salads',
    badge: null,
    calories: 280,
  },
  {
    id: 11,
    name: 'Grilled Chicken Salad',
    ingredients: 'Grilled chicken, mixed greens, cherry tomatoes, balsamic',
    description:
      'Tender grilled chicken breast over a bed of mixed greens, cherry tomatoes and cucumber with balsamic vinaigrette.',
    price: 42.00,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop&auto=format',
    category: 'salads',
    badge: 'Healthy',
    calories: 320,
  },

  // Drinks
  {
    id: 12,
    name: 'Cookies & Cream Shake',
    ingredients: 'Vanilla ice cream, oreo, whipped cream, chocolate drizzle',
    description:
      'Thick and creamy vanilla milkshake blended with crushed Oreo cookies, topped with whipped cream and chocolate drizzle.',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&h=600&fit=crop&auto=format',
    category: 'drinks',
    badge: null,
    calories: 680,
  },
  {
    id: 13,
    name: 'Strawberry Lemonade',
    ingredients: 'Fresh strawberries, lemon juice, cane sugar, sparkling water',
    description:
      'House-made lemonade blended with fresh strawberries and topped with sparkling water. Refreshing and vibrant.',
    price: 22.00,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=600&fit=crop&auto=format',
    category: 'drinks',
    badge: null,
    calories: 180,
  },
  {
    id: 14,
    name: 'Chocolate Fudge Shake',
    ingredients: 'Chocolate ice cream, fudge sauce, whipped cream',
    description:
      'Rich chocolate ice cream blended with warm fudge sauce and topped with a mountain of whipped cream.',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=600&h=600&fit=crop&auto=format',
    category: 'drinks',
    badge: 'Popular',
    calories: 720,
  },

  // Desserts
  {
    id: 15,
    name: 'Classic Brownie',
    ingredients: 'Dark chocolate, butter, eggs, flour, walnuts',
    description:
      'Dense, fudgy dark chocolate brownie loaded with crunchy walnuts. Served warm with a dusting of powdered sugar.',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=600&fit=crop&auto=format',
    category: 'desserts',
    badge: null,
    calories: 420,
  },
  {
    id: 16,
    name: 'Vanilla Soft Serve',
    ingredients: 'Vanilla ice cream, waffle cone, sprinkles',
    description:
      'Creamy soft-serve vanilla ice cream swirled high in a crispy waffle cone. Simple, classic, and irresistible.',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=600&fit=crop&auto=format',
    category: 'desserts',
    badge: 'Popular',
    calories: 280,
  },
  {
    id: 17,
    name: 'Molten Lava Cake',
    ingredients: 'Dark chocolate, butter, eggs, sugar, vanilla ice cream',
    description:
      'Warm chocolate cake with a gooey molten center, served with a scoop of vanilla ice cream. Pure indulgence.',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&h=600&fit=crop&auto=format',
    category: 'desserts',
    badge: '🔥 Hot',
    calories: 580,
  },
  {
    id: 18,
    name: 'Churros with Dip',
    ingredients: 'Fried dough, cinnamon sugar, chocolate dipping sauce',
    description:
      'Golden crispy churros rolled in cinnamon sugar, served with a rich warm chocolate dipping sauce.',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&h=600&fit=crop&auto=format',
    category: 'desserts',
    badge: null,
    calories: 390,
  },
  {
    id: 19,
    name: 'Strawberry Cheesecake',
    ingredients: 'Cream cheese, graham cracker crust, fresh strawberries, whipped cream',
    description:
      'Velvety New York-style cheesecake on a buttery graham cracker base, topped with fresh strawberry compote.',
    price: 52.00,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=600&fit=crop&auto=format',
    category: 'desserts',
    badge: 'Premium',
    calories: 490,
  },
]

// Featured 6 for landing page
export const featuredProducts = allProducts.slice(0, 6)

// Testimonials data
export const testimonials = [
  {
    id: 1,
    name: 'James Spence',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format',
    rating: 5,
    review: 'I will recommend you to my colleagues. Burger did exactly what you said it does.',
  },
  {
    id: 2,
    name: 'Natalie Barry',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format',
    rating: 5,
    review: 'I am so pleased with this product. Not able to tell you how happy I am with this.',
  },
  {
    id: 3,
    name: 'Avery Davis',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&auto=format',
    rating: 5,
    review: 'I will recommend you to my friends. Burger did exactly what you said it does.',
  },
  {
    id: 4,
    name: 'Lara Pearson',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&auto=format',
    rating: 5,
    review: 'I am so pleased with this product. Not able to tell you how happy I am with this.',
  },
]
