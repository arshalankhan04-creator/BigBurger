# 🍔 Big Burger — Modern QSR Web App

A modern, cinematic QSR (Quick Service Restaurant) web app built with React, Vite, Tailwind CSS, and Framer Motion. Inspired by Zomato/Swiggy-style product UX with a retro-craft artisanal design twist.

---

## 🚀 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18.3 | UI framework |
| Vite | 5.3 | Build tool & dev server |
| Tailwind CSS | 3.4 | Utility-first styling |
| Framer Motion | 11.3 | Animations & page transitions |
| React Router | 6.26 | Client-side routing |
| Lucide React | 0.400 | Icons |
| vite-plugin-pwa | 0.20 | PWA support |
| clsx + tailwind-merge | latest | Class merging utility |

---

## 🎨 Design System

**Theme:** Retro-Modern QSR / Flat Color-Blocking / Light + Dark Mode

| Token | Color | Usage |
|---|---|---|
| `espresso` | `#3D1B11` | Navbar, headers, borders |
| `flame-orange` | `#E25222` | CTAs, prices, accents |
| `warm-cream` | `#FBF7F2` | Page background |
| `mustard` | `#F3C641` | Testimonials, highlights |
| `soft-sand` | `#F3EDE2` | Alternate section backgrounds |
| `muted-taupe` | `#756A63` | Body text, subtitles |

**Fonts (Google Fonts):**
- Display: `Fraunces` 900 Black — all H1/H2 headings
- Body/UI: `Plus Jakarta Sans` 400–800 — all other text

**Currency:** ₹ (Indian Rupee)

---

## 📁 Project Structure

```
src/
├── assets/images/               # Local image assets (hero burgers)
├── animations/motion.js         # All Framer Motion variants
├── components/
│   ├── common/
│   │   ├── BurgerReveal.jsx     # Cinematic intro animation (session-guarded)
│   │   ├── CartDrawer.jsx       # Slide-in cart drawer
│   │   ├── ScrollToTopButton.jsx # Floating scroll-to-top button
│   │   └── BottomNav.jsx        # Mobile bottom navigation bar
│   └── layout/
│       └── Navbar.jsx           # Fixed navbar with cart badge + dark mode toggle
├── context/
│   ├── CartContext.jsx          # Global cart state (useReducer + localStorage)
│   ├── ThemeContext.jsx         # Dark mode toggle (localStorage persistent)
│   └── WishlistContext.jsx      # Wishlist/favorites (localStorage persistent)
├── data/
│   ├── categories.js            # Menu category data
│   ├── locations.js             # Store location data
│   ├── products.js              # Full menu + testimonials data
│   └── reviews.js               # Fake product reviews pool
├── hooks/
│   ├── useScrollToTop.js        # Scroll to top on route change
│   └── useRecentlyViewed.js     # Recently viewed products (localStorage)
├── layouts/
│   └── MainLayout.jsx           # Navbar + Footer + BottomNav + ScrollToTop
├── lib/utils.js                 # cn() Tailwind class merge utility
├── pages/
│   ├── Home.jsx                 # Landing page
│   ├── MenuPage.jsx             # Full menu with filters
│   ├── ProductDetailPage.jsx    # Product detail page (/product/:id)
│   ├── AboutPage.jsx            # Brand story, timeline, team
│   ├── LocationPage.jsx         # Store locations + map
│   ├── ContactPage.jsx          # Contact form + info
│   ├── CheckoutPage.jsx         # 3-step checkout with promo codes
│   ├── RewardsPage.jsx          # Loyalty rewards program page
│   ├── DealsPage.jsx            # Deals & coupons page
│   ├── OrderTrackingPage.jsx    # Real-time order tracking (simulated)
│   ├── WishlistPage.jsx         # Saved/favorited products
│   └── NotFoundPage.jsx         # 404 page
├── sections/                    # Landing page sections
│   ├── hero/Hero.jsx
│   ├── categories/Categories.jsx
│   ├── offers/Offers.jsx
│   ├── featured/FeaturedMenu.jsx
│   ├── testimonials/Testimonials.jsx
│   ├── about/About.jsx
│   ├── features/Features.jsx
│   ├── instagram/InstagramGrid.jsx
│   └── footer/Footer.jsx
├── styles/globals.css           # CSS variables, base styles, dark mode vars
├── App.jsx                      # Router + all providers + BurgerReveal
└── main.jsx                     # React root
```

---

## 📄 Pages

| Route | Page | Description |
|---|---|---|
| `/` | Home | Full landing page with 8 sections |
| `/menu` | Menu | Full menu with category filters + search |
| `/product/:id` | Product Detail | Zomato-style product page with reviews, wishlist, recently viewed |
| `/about` | About Us | Brand story, stats, timeline, team, values |
| `/location` | Locations | 3 store locations with interactive map |
| `/contact` | Contact | Contact form with validation + social links |
| `/checkout` | Checkout | 3-step order flow with promo code support |
| `/rewards` | Rewards | Loyalty program — tiers, how it works, FAQ |
| `/deals` | Deals | Promo codes & seasonal offers with copy-to-clipboard |
| `/track-order` | Order Tracking | Simulated real-time order status tracker |
| `/wishlist` | Wishlist | Saved/favorited products |
| `*` | 404 | Custom branded not found page |

---

## ✨ Features

### 🎬 Animations
- **Cinematic burger reveal** — circular clip-path expand intro (plays once per session)
- **Page transitions** — smooth fade + y-shift between all routes
- **Scroll animations** — fadeUp + stagger on all section content
- **Floating hero assets** — continuous y-axis float on burger images
- **Spring cart badge** — bounces in when first item added

### 🛒 Cart System
- Global cart state via React Context + useReducer
- **localStorage persistence** — cart survives page refresh
- Add to cart from product page (with qty selector)
- Quick-add button on every menu card
- Cart drawer slides in from right with spring animation
- Qty stepper, remove item, clear all
- Subtotal + delivery fee + total calculation

### 🏷️ Promo Codes
Valid codes (synced with Deals page):
| Code | Discount |
|---|---|
| `BIGBITE20` | 20% off first order |
| `BURGERFEST` | Buy 2 Get 1 Free |
| `FREEDELIVERY` | Free delivery |
| `SIDEKICK` | Free side with burger |
| `LUNCHTIME` | 15% off (12–3 PM) |
| `ROYALE500` | ₹500 off on orders above ₹2000 |

### 🛍️ Product Detail Page
- Large image with wishlist + share buttons
- Breadcrumb navigation
- Rating, price with discount badge
- Ingredients tags
- Qty stepper + Add to Cart
- Nutrition strip (calories, prep time, category)
- **Mobile sticky Add to Cart bar** (Zomato/Swiggy style)
- Related products section
- **Recently Viewed** products (localStorage)
- **Customer Reviews** with rating distribution, filter by stars, helpful votes

### ❤️ Wishlist
- Heart button on every product page
- localStorage persistent across sessions
- `/wishlist` page with Add All to Cart + Clear All

### 🌙 Dark Mode
- Sun/Moon toggle in Navbar (desktop + mobile)
- CSS variable-based theming
- localStorage persistent preference
- System preference detection on first visit

### 📱 Mobile
- **Bottom navigation bar** — Home, Menu, Cart, Wishlist with badges
- **Mobile sticky Add to Cart** on product pages
- Fully responsive all pages

### 📦 PWA
- `vite-plugin-pwa` configured
- Service worker with offline caching (Workbox)
- Unsplash images cached for 30 days
- Google Fonts cached for 1 year
- "Add to Home Screen" support (production build)

### 🔍 Order Tracking
- `/track-order` — enter order ID or try demo
- 4 stages: Placed → Preparing → Out for Delivery → Delivered
- Auto-advances with realistic timing
- Live pulse animation on active stage

---

## 🛠️ Getting Started

### Prerequisites
- Node.js v18+
- npm

### Installation

```bash
# Navigate to project folder
cd BigBurger

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

> **Note:** PWA service worker only activates in production build (`npm run build`), not in dev mode.

---

## 🖼️ Images

Currently using Unsplash CDN URLs for development. Before production:

1. Download food images (transparent PNG cutouts recommended)
2. Place in `src/assets/images/`
3. Update image paths in:
   - `src/data/products.js` — product + testimonial images
   - `src/data/categories.js` — category card images

**Already local:** `hero-burger-left.png` and `hero-burger-right.png` in `src/assets/images/`

---

## 🗺️ Location Maps

Replace placeholder Google Maps embed URLs in `src/data/locations.js`:

1. Go to [Google Maps](https://maps.google.com)
2. Search your location → Share → Embed a map → Copy HTML
3. Extract the `src` URL from the iframe
4. Replace the `mapUrl` value for each location

---

## 🏪 Store Locations

All 3 locations in **Ahmedabad, Gujarat, India**:
- SG Highway, Bodakdev (Main Branch)
- CG Road, Navrangpura
- Prahlad Nagar, Satellite

---

## ✅ Completed Features

- [x] Landing page (8 sections)
- [x] Full menu page with category filters
- [x] Product detail page (Zomato/Swiggy style)
- [x] About Us page
- [x] Location page with map
- [x] Contact page with form validation
- [x] Cart system (global state + localStorage)
- [x] Checkout page (3-step flow + promo codes)
- [x] Rewards/Loyalty program page
- [x] Deals & Coupons page
- [x] Order tracking page (simulated)
- [x] Wishlist / Favorites
- [x] Recently Viewed products
- [x] Customer Reviews with ratings
- [x] Dark mode toggle
- [x] Mobile bottom navigation
- [x] Mobile sticky Add to Cart bar
- [x] Scroll to top button
- [x] BurgerReveal session guard
- [x] Cart localStorage persistence
- [x] PWA support
- [x] Favicon
- [x] 404 page
- [x] Page transitions

---

## 📝 License

This project is for portfolio/demo purposes.
