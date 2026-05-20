# 🍔 Big Burger — Modern QSR Web App

A modern, cinematic QSR (Quick Service Restaurant) web app built with React, Vite, Tailwind CSS, and Framer Motion. Inspired by McDonald's, Burger King, and KFC — with a retro-craft artisanal twist.

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
| clsx + tailwind-merge | latest | Class merging utility |

---

## 🎨 Design System

**Theme:** Retro-Modern QSR / Flat Color-Blocking / Light Mode only

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

**Border system:** Unified 2px solid `espresso` on all interactive cards

---

## 📁 Project Structure

```
src/
├── assets/
│   └── images/                  # Local image assets (hero burgers)
├── animations/
│   └── motion.js                # All Framer Motion variants
├── components/
│   ├── common/
│   │   ├── BurgerReveal.jsx     # Cinematic intro animation
│   │   ├── CartDrawer.jsx       # Slide-in cart drawer
│   │   └── ProductModal.jsx     # Product detail modal
│   └── layout/
│       └── Navbar.jsx           # Fixed navbar with cart badge
├── context/
│   └── CartContext.jsx          # Global cart state (useReducer)
├── data/
│   ├── categories.js            # Menu category data
│   ├── locations.js             # Store location data
│   └── products.js              # Full menu + testimonials data
├── hooks/
│   └── useScrollToTop.js        # Scroll to top on route change
├── layouts/
│   └── MainLayout.jsx           # Navbar + Footer wrapper
├── lib/
│   └── utils.js                 # cn() Tailwind class merge utility
├── pages/
│   ├── Home.jsx                 # Landing page
│   ├── MenuPage.jsx             # Full menu with filters + modal
│   ├── AboutPage.jsx            # Brand story, timeline, team
│   ├── LocationPage.jsx         # Store locations + map
│   ├── ContactPage.jsx          # Contact form + info
│   ├── CheckoutPage.jsx         # 3-step checkout flow
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
├── styles/
│   └── globals.css              # CSS variables, base styles, utilities
├── App.jsx                      # Router + CartProvider + BurgerReveal
└── main.jsx                     # React root
```

---

## 📄 Pages

| Route | Page | Description |
|---|---|---|
| `/` | Home | Full landing page with all sections |
| `/menu` | Menu | Full menu with category filters, search, product modal |
| `/about` | About Us | Brand story, stats, timeline, team, values |
| `/location` | Locations | 3 store locations with interactive map |
| `/contact` | Contact | Contact form with validation + social links |
| `/checkout` | Checkout | 3-step order flow (delivery → payment → review) |
| `*` | 404 | Custom branded not found page |

---

## ✨ Features

### Animations
- **Cinematic burger reveal** — circular clip-path expand intro on every page load
- **Page transitions** — smooth fade + y-shift between all routes
- **Scroll animations** — fadeUp + stagger on all section content
- **Floating hero assets** — continuous y-axis float on burger images
- **Spring cart badge** — bounces in when first item added

### Cart System
- Global cart state via React Context + useReducer
- Add to cart from product modal (with qty selector)
- Quick-add button on every menu card
- Cart drawer slides in from right with spring animation
- Qty stepper, remove item, clear all
- Subtotal + delivery fee + total calculation
- Persists during session

### Checkout Flow (3 steps)
- **Step 1 — Delivery:** Delivery/Pickup toggle, contact info, address, special instructions
- **Step 2 — Payment:** Cash on delivery or card (with card form)
- **Step 3 — Review:** Full order summary before confirming
- Success screen with estimated time + cart cleared

### UX Polish
- Active nav link highlighting (React Router NavLink)
- Scroll to top on every route change
- Footer on all pages
- Empty cart guard on checkout
- Form validation with inline errors
- Keyboard accessible (Escape closes modals/drawer)
- Mobile responsive — all pages work on small screens

---

## 🛠️ Getting Started

### Prerequisites
- Node.js v18+
- npm

### Installation

```bash
# Navigate to project folder
cd project

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

---

## 🖼️ Images

Currently using Unsplash CDN URLs for development. Before production:

1. Download food images (transparent PNG cutouts recommended for product cards)
2. Place in `public/images/` or `src/assets/images/`
3. Update image paths in:
   - `src/data/products.js` — product + testimonial images
   - `src/data/categories.js` — category card images
   - `src/sections/offers/Offers.jsx` — offer card images
   - `src/sections/about/About.jsx` — kitchen photo
   - `src/sections/instagram/InstagramGrid.jsx` — gram photos

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

All 3 locations are in **Ahmedabad, Gujarat, India**:
- SG Highway, Bodakdev (Main Branch)
- CG Road, Navrangpura
- Prahlad Nagar, Satellite

---

## 🔮 Roadmap

- [x] Landing page (9 sections)
- [x] Menu page with filters + product modal
- [x] About Us page
- [x] Location page with map
- [x] Contact page with form
- [x] Cart system (global state + drawer)
- [x] Checkout page (3-step flow)
- [x] 404 page
- [x] Page transitions
- [x] Cinematic burger reveal intro
- [ ] Franchising page
- [ ] Order history page
- [ ] User authentication
- [ ] Backend integration

---

## 📝 License

This project is for portfolio/demo purposes.
