import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { staggerContainer, staggerItem, fadeUp, viewportOnce } from '@/animations/motion'
import { Tag, Copy, Check, Clock, Flame, Gift, Percent, ArrowRight, AlertCircle, ShoppingBag } from 'lucide-react'

// ─── Data ─────────────────────────────────────────────────────────

const deals = [
  {
    id: 1,
    code: 'BIGBITE20',
    title: '20% Off Your First Order',
    description: 'New to Big Burger? Welcome! Get 20% off your entire first order — no minimum required.',
    discount: '20% OFF',
    discountType: 'percent',
    minOrder: null,
    validUntil: '31 Dec 2025',
    category: 'New Customer',
    color: 'bg-flame-orange',
    featured: true,
  },
  {
    id: 2,
    code: 'BURGERFEST',
    title: 'Buy 2 Burgers, Get 1 Free',
    description: 'Add any 3 burgers to your cart and the cheapest one is on us. Mix and match freely.',
    discount: 'B2G1',
    discountType: 'bogo',
    minOrder: '₹150',
    validUntil: '15 Jan 2026',
    category: 'Bundle Deal',
    color: 'bg-espresso',
    featured: true,
  },
  {
    id: 3,
    code: 'FREEDELIVERY',
    title: 'Free Delivery This Weekend',
    description: 'Order on Saturday or Sunday and enjoy free delivery on orders above ₹200.',
    discount: 'FREE DELIVERY',
    discountType: 'delivery',
    minOrder: '₹200',
    validUntil: 'Every Weekend',
    category: 'Delivery',
    color: 'bg-mustard',
    featured: false,
  },
  {
    id: 4,
    code: 'SIDEKICK',
    title: 'Free Side with Any Burger',
    description: 'Order any burger and add a Classic Fries or Onion Rings for free. Because every hero needs a sidekick.',
    discount: 'FREE SIDE',
    discountType: 'freeitem',
    minOrder: '₹100',
    validUntil: '28 Feb 2026',
    category: 'Free Item',
    color: 'bg-green-600',
    featured: false,
  },
  {
    id: 5,
    code: 'LUNCHTIME',
    title: '15% Off Lunch Orders',
    description: 'Order between 12 PM – 3 PM on weekdays and save 15% on your entire order.',
    discount: '15% OFF',
    discountType: 'percent',
    minOrder: '₹120',
    validUntil: 'Ongoing',
    category: 'Happy Hours',
    color: 'bg-blue-600',
    featured: false,
  },
  {
    id: 6,
    code: 'ROYALE500',
    title: '₹500 Off on Orders Above ₹2000',
    description: 'Planning a big order? Use this code and save flat ₹500 on orders above ₹2000.',
    discount: '₹500 OFF',
    discountType: 'flat',
    minOrder: '₹2000',
    validUntil: '31 Mar 2026',
    category: 'Big Order',
    color: 'bg-purple-600',
    featured: false,
  },
]

const categories = ['All', 'New Customer', 'Bundle Deal', 'Delivery', 'Free Item', 'Happy Hours', 'Big Order']

// ─── Coupon Card ──────────────────────────────────────────────────

function CouponCard({ deal }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(deal.code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl border-2 border-espresso overflow-hidden
                 flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      {/* Top color band */}
      <div className={`${deal.color} px-6 py-5 flex items-start justify-between gap-4`}>
        <div className="flex flex-col gap-1">
          <span className="font-sans font-bold text-xs text-white/70 uppercase tracking-wider">
            {deal.category}
          </span>
          <span className="font-display font-black text-2xl text-white leading-none">
            {deal.discount}
          </span>
        </div>
        {deal.featured && (
          <span className="bg-white/20 text-white font-sans font-bold text-xs
                           px-2.5 py-1 rounded-full shrink-0">
            🔥 Hot Deal
          </span>
        )}
      </div>

      {/* Dashed divider */}
      <div className="relative h-0 border-t-2 border-dashed border-espresso/20 mx-0">
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full
                        bg-warm-cream border-2 border-espresso/20" />
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full
                        bg-warm-cream border-2 border-espresso/20" />
      </div>

      {/* Content */}
      <div className="px-6 py-5 flex flex-col gap-3 flex-1">
        <h3 className="font-sans font-extrabold text-base text-espresso leading-snug">
          {deal.title}
        </h3>
        <p className="font-sans text-sm text-muted-taupe leading-relaxed flex-1">
          {deal.description}
        </p>

        {/* Meta info */}
        <div className="flex items-center gap-4 flex-wrap">
          {deal.minOrder && (
            <span className="flex items-center gap-1 font-sans text-xs text-muted-taupe">
              <AlertCircle size={12} />
              Min. {deal.minOrder}
            </span>
          )}
          <span className="flex items-center gap-1 font-sans text-xs text-muted-taupe">
            <Clock size={12} />
            Valid: {deal.validUntil}
          </span>
        </div>

        {/* Code + copy */}
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 bg-soft-sand border-2 border-dashed border-espresso/30
                          rounded-lg px-4 py-2.5 flex items-center justify-between gap-2">
            <span className="font-sans font-black text-sm text-espresso tracking-widest">
              {deal.code}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-sans font-semibold
                         text-flame-orange hover:text-flame-dark transition-colors duration-150
                         focus-visible:outline-none shrink-0"
              aria-label={`Copy code ${deal.code}`}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="copied"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1 text-green-600"
                  >
                    <Check size={13} /> Copied!
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1"
                  >
                    <Copy size={13} /> Copy
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
          <Link
            to="/menu"
            className="btn-primary text-xs px-4 py-2.5 shrink-0 gap-1"
          >
            Use <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────

export default function DealsPage() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? deals
    : deals.filter((d) => d.category === activeCategory)

  return (
    <div className="min-h-screen bg-warm-cream pt-16">

      {/* ── Hero ── */}
      <div className="bg-espresso py-16 md:py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-container mx-auto px-6 flex flex-col items-center text-center gap-4"
        >
          <motion.div
            variants={staggerItem}
            className="w-14 h-14 rounded-2xl bg-flame-orange/20 border-2 border-flame-orange/30
                       flex items-center justify-center"
          >
            <Tag size={28} className="text-flame-orange" />
          </motion.div>
          <motion.p variants={staggerItem} className="eyebrow text-mustard/80">
            Save More, Eat More
          </motion.p>
          <motion.h1
            variants={staggerItem}
            className="font-display font-black text-white text-display-xl leading-tight"
          >
            Deals & Coupons
          </motion.h1>
          <motion.p
            variants={staggerItem}
            className="font-sans text-base text-white/60 max-w-md leading-relaxed"
          >
            Fresh deals every week. Copy a code, apply at checkout, and enjoy the savings.
          </motion.p>
        </motion.div>
      </div>

      {/* Wave */}
      <div aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-10 md:h-14 block">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="#3D1B11" />
        </svg>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-container mx-auto px-6 py-12">

        {/* Category filter */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-2 flex-wrap mb-10"
          role="tablist"
          aria-label="Filter deals by category"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full font-sans font-semibold text-sm
                          border-2 transition-all duration-150
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame-orange
                          ${activeCategory === cat
                            ? 'bg-espresso text-white border-espresso'
                            : 'bg-white text-espresso border-espresso hover:bg-soft-sand'
                          }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Deals grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((deal) => (
              <CouponCard key={deal.id} deal={deal} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <span className="text-5xl">🏷️</span>
            <p className="font-display font-black text-display-md text-espresso">No deals here</p>
            <button onClick={() => setActiveCategory('All')} className="btn-outline text-sm">
              View All Deals
            </button>
          </div>
        )}
      </div>

      {/* ── How to use ── */}
      <section className="bg-soft-sand border-t-2 border-espresso/10 py-14">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="max-w-container mx-auto px-6"
        >
          <motion.h2
            variants={staggerItem}
            className="font-display font-black text-espresso text-display-md mb-8 text-center"
          >
            How to Use a Coupon
          </motion.h2>
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: Copy,        step: '1', title: 'Copy the Code',     desc: 'Click "Copy" on any deal card to copy the promo code to your clipboard.' },
              { icon: ShoppingBag, step: '2', title: 'Add Items to Cart', desc: 'Browse the menu and add your favourite burgers, sides, and drinks.' },
              { icon: Percent,     step: '3', title: 'Apply at Checkout', desc: 'Paste the code in the promo field at checkout and watch the discount apply.' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <motion.div key={item.step} variants={staggerItem} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-flame-orange text-white
                                  font-display font-black text-lg flex items-center justify-center shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-sans font-extrabold text-sm text-espresso mb-1">{item.title}</h3>
                    <p className="font-sans text-sm text-muted-taupe leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </section>

    </div>
  )
}
