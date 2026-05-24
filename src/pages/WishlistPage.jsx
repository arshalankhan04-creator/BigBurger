import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react'
import { staggerContainer, staggerItem, fadeUp } from '@/animations/motion'
import { useWishlist } from '@/context/WishlistContext'
import { useCart } from '@/context/CartContext'
import { allProducts } from '@/data/products'

function WishlistCard({ product }) {
  const { toggle } = useWishlist()
  const { addItem, openCart } = useCart()

  const handleAddToCart = () => {
    addItem(product)
    openCart()
  }

  return (
    <motion.div
      layout
      variants={staggerItem}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl border-2 border-espresso overflow-hidden
                 flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-soft-sand">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-flame-orange text-white
                           font-sans font-bold text-xs px-2.5 py-1 rounded-full">
            {product.badge}
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex-1">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-sans font-extrabold text-sm text-espresso leading-snug
                           hover:text-flame-orange transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="font-sans text-xs text-muted-taupe mt-1 line-clamp-1">
            {product.ingredients}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-display font-black text-xl text-flame-orange">
            ₹{product.price.toFixed(0)}
          </span>
          <div className="flex items-center gap-2">
            {/* Remove from wishlist */}
            <button
              onClick={() => toggle(product.id)}
              className="w-8 h-8 rounded-full flex items-center justify-center
                         text-muted-taupe hover:text-red-500 hover:bg-red-50
                         transition-colors duration-150"
              aria-label="Remove from wishlist"
            >
              <Trash2 size={15} />
            </button>
            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              className="w-8 h-8 rounded-sm bg-espresso text-white
                         flex items-center justify-center
                         hover:bg-flame-orange transition-colors duration-150"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function WishlistPage() {
  const { ids, clear, count } = useWishlist()
  const { addItem, openCart } = useCart()

  const wishlistProducts = ids
    .map((id) => allProducts.find((p) => p.id === id))
    .filter(Boolean)

  const handleAddAll = () => {
    wishlistProducts.forEach((p) => addItem(p))
    openCart()
  }

  return (
    <div className="min-h-screen bg-warm-cream pt-16">

      {/* ── Hero ── */}
      <div className="bg-espresso py-14 md:py-18">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-container mx-auto px-6 flex flex-col items-center text-center gap-3"
        >
          <motion.div
            variants={staggerItem}
            className="w-14 h-14 rounded-2xl bg-flame-orange/20 border-2 border-flame-orange/30
                       flex items-center justify-center"
          >
            <Heart size={28} className="text-flame-orange fill-flame-orange/30" />
          </motion.div>
          <motion.p variants={staggerItem} className="eyebrow text-mustard/80">
            Your Favorites
          </motion.p>
          <motion.h1
            variants={staggerItem}
            className="font-display font-black text-white text-display-xl leading-tight"
          >
            Wishlist
          </motion.h1>
          {count > 0 && (
            <motion.p variants={staggerItem} className="font-sans text-white/60 text-sm">
              {count} item{count !== 1 ? 's' : ''} saved
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Wave */}
      <div aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-10 block">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="#3D1B11" />
        </svg>
      </div>

      {/* ── Content ── */}
      <div className="max-w-container mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {wishlistProducts.length === 0 ? (
            /* Empty state */
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-6 py-20 text-center"
            >
              <div className="w-24 h-24 rounded-full bg-soft-sand flex items-center justify-center">
                <Heart size={40} className="text-espresso/20" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="font-display font-black text-display-md text-espresso">
                  Nothing saved yet
                </h2>
                <p className="font-sans text-sm text-muted-taupe mt-2 max-w-xs">
                  Tap the heart icon on any product to save it here for later.
                </p>
              </div>
              <Link to="/menu" className="btn-primary gap-2">
                Browse Menu <ArrowRight size={16} />
              </Link>
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Actions bar */}
              <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
                <p className="font-sans font-semibold text-sm text-muted-taupe">
                  {count} saved item{count !== 1 ? 's' : ''}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAddAll}
                    className="btn-primary text-sm gap-2"
                  >
                    <ShoppingCart size={15} />
                    Add All to Cart
                  </button>
                  <button
                    onClick={clear}
                    className="btn-outline text-sm gap-2 text-red-500 border-red-200
                               hover:bg-red-500 hover:text-white hover:border-red-500"
                  >
                    <Trash2 size={15} />
                    Clear All
                  </button>
                </div>
              </div>

              {/* Grid */}
              <motion.div
                layout
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
              >
                <AnimatePresence>
                  {wishlistProducts.map((product) => (
                    <WishlistCard key={product.id} product={product} />
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Continue shopping */}
              <div className="mt-12 text-center">
                <Link to="/menu" className="btn-outline gap-2">
                  Continue Shopping <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
