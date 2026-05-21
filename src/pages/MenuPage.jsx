import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingBag } from 'lucide-react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { allProducts } from '@/data/products'
import { staggerContainer, staggerItem, fadeUp, viewportOnce } from '@/animations/motion'
import { useCart } from '@/context/CartContext'

const CATEGORIES = [
  { id: 'all',     label: 'All' },
  { id: 'burgers', label: 'Burgers' },
  { id: 'sides',   label: 'Sides' },
  { id: 'salads',  label: 'Salads' },
  { id: 'drinks',  label: 'Drinks' },
]

// ── Single product card ───────────────────────────────────────────
function MenuCard({ product }) {
  const navigate = useNavigate()
  const { addItem, openCart } = useCart()

  const handleQuickAdd = (e) => {
    e.stopPropagation()
    addItem(product, 1)
    openCart()
  }
  return (
    <motion.div
      layout
      variants={staggerItem}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white rounded-xl border-2 border-espresso
                 overflow-hidden cursor-pointer group
                 flex flex-col shadow-card"
      role="button"
      tabIndex={0}
      aria-label={`View ${product.name} details`}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/product/${product.id}`)}
    >
      {/* Image */}
      <div className="relative bg-soft-sand aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300
                     group-hover:scale-105"
          loading="lazy"
        />
        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-flame-orange text-white
                           font-sans font-bold text-xs px-2.5 py-1
                           rounded-sm tracking-wide">
            {product.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-sans font-extrabold text-sm uppercase tracking-wide
                       text-espresso leading-snug">
          {product.name}
        </h3>
        <p className="font-sans text-xs text-muted-taupe leading-relaxed line-clamp-2 flex-1">
          {product.ingredients}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-sans font-black text-xl text-flame-orange">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={handleQuickAdd}
            className="w-8 h-8 rounded-sm bg-espresso text-white
                       flex items-center justify-center
                       hover:bg-flame-orange transition-colors duration-150
                       focus-visible:outline-none"
            aria-label={`Quick add ${product.name} to cart`}
          >
            <ShoppingBag size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function MenuPage() {
  const [searchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || 'all'

  const [activeCategory, setActiveCategory] = useState(
    CATEGORIES.find((c) => c.id === initialCategory) ? initialCategory : 'all'
  )
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return allProducts.filter((p) => {
      const matchCat    = activeCategory === 'all' || p.category === activeCategory
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.ingredients.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [activeCategory, search])

  return (
    /* Page wrapper */
    <div className="min-h-screen bg-warm-cream pt-16">

        {/* ── Page header ── */}
        <div className="bg-espresso py-16 md:py-20">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-container mx-auto px-6 flex flex-col items-center
                       text-center gap-4"
          >
            <motion.p variants={staggerItem} className="eyebrow text-mustard/80">
              Explore Our Menu
            </motion.p>
            <motion.h1
              variants={staggerItem}
              className="font-display font-black text-white
                         text-display-xl leading-tight"
            >
              Our Full Menu
            </motion.h1>
            <motion.p
              variants={staggerItem}
              className="font-sans text-base text-white/60 max-w-md leading-relaxed"
            >
              From flame-grilled burgers to fresh salads — something for everyone.
            </motion.p>
          </motion.div>
        </div>

        {/* ── Wave divider ── */}
        <div aria-hidden="true">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none"
            className="w-full h-10 md:h-14 block">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="#3D1B11" />
          </svg>
        </div>

        <div className="max-w-container mx-auto px-6 py-12">

          {/* ── Search + Filter bar ── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-4 mb-10"
          >
            {/* Search input */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-taupe"
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Search menu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-sm
                           border-2 border-espresso bg-white
                           font-sans text-sm text-espresso placeholder:text-muted-taupe
                           focus:outline-none focus:border-flame-orange
                           transition-colors duration-150"
                aria-label="Search menu items"
              />
            </div>

            {/* Category filter tabs */}
            <div
              className="flex items-center gap-2 flex-wrap"
              role="tablist"
              aria-label="Filter by category"
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={activeCategory === cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-sm font-sans font-semibold text-sm
                              border-2 transition-all duration-150
                              focus-visible:outline-none focus-visible:ring-2
                              focus-visible:ring-flame-orange
                              ${activeCategory === cat.id
                                ? 'bg-espresso text-white border-espresso'
                                : 'bg-white text-espresso border-espresso hover:bg-soft-sand'
                              }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* ── Results count ── */}
          <motion.p
            key={filtered.length}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-sans text-sm text-muted-taupe mb-6"
          >
            {filtered.length} item{filtered.length !== 1 ? 's' : ''} found
          </motion.p>

          {/* ── Product grid ── */}
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div
                key={activeCategory + search}
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
              >
                {filtered.map((product) => (
                  <MenuCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 py-24 text-center"
              >
                <span className="text-5xl">🍔</span>
                <p className="font-display font-black text-display-md text-espresso">
                  Nothing found
                </p>
                <p className="font-sans text-sm text-muted-taupe">
                  Try a different search or category
                </p>
                <button
                  onClick={() => { setSearch(''); setActiveCategory('all') }}
                  className="btn-outline text-sm mt-2"
                >
                  Clear filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
  )
}
