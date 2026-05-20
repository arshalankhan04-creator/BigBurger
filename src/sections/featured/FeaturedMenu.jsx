import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { staggerContainer, staggerItem, viewportOnce } from '@/animations/motion'
import { featuredProducts } from '@/data/products'
import { useCart } from '@/context/CartContext'
import ProductModal from '@/components/common/ProductModal'

function ProductCard({ product, onSelect }) {
  const { addItem, openCart } = useCart()

  const handleQuickAdd = (e) => {
    e.stopPropagation()
    addItem(product, 1)
    openCart()
  }

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(product)}
      className="flex flex-col items-center text-center gap-3 group cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label={`View ${product.name} details`}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(product)}
    >
      {/* Food image */}
      <div className="w-full aspect-square flex items-center justify-center p-4 relative">
        <div
          className="absolute inset-4 rounded-full bg-soft-sand
                     opacity-0 group-hover:opacity-100
                     transition-opacity duration-300"
          aria-hidden="true"
        />
        <img
          src={product.image}
          alt={product.name}
          className="relative w-full h-full object-cover rounded-lg drop-shadow-lg
                     transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Name */}
      <h3 className="font-sans font-extrabold text-sm uppercase tracking-wide
                     text-espresso leading-snug px-2">
        {product.name}
      </h3>

      {/* Ingredients */}
      <p className="font-sans text-xs text-muted-taupe leading-relaxed px-2 line-clamp-2">
        {product.ingredients}
      </p>

      {/* Price + quick add */}
      <div className="flex items-center gap-3">
        <span className="font-sans font-black text-xl text-flame-orange">
          ${product.price.toFixed(2)}
        </span>
        <button
          onClick={handleQuickAdd}
          className="w-8 h-8 rounded-sm bg-espresso text-white
                     flex items-center justify-center
                     hover:bg-flame-orange transition-colors duration-150
                     opacity-0 group-hover:opacity-100
                     focus-visible:outline-none focus-visible:opacity-100"
          aria-label={`Quick add ${product.name} to cart`}
        >
          <ShoppingBag size={14} strokeWidth={2.5} />
        </button>
      </div>
    </motion.div>
  )
}

export default function FeaturedMenu() {
  const [selectedProduct, setSelectedProduct] = useState(null)

  return (
    <>
      <section
        id="menu"
        className="bg-warm-cream py-16 md:py-20"
        aria-label="Featured menu"
      >
        <div className="max-w-container mx-auto px-6">

          {/* ── Section header ── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex items-start justify-between mb-12"
          >
            <div className="flex flex-col gap-2">
              <motion.p variants={staggerItem} className="eyebrow">
                Hand-Picked For You
              </motion.p>
              <motion.h2
                variants={staggerItem}
                className="font-display font-black text-espresso
                           text-display-lg leading-tight"
              >
                Featured Menu
              </motion.h2>
            </div>

            <motion.div variants={staggerItem}>
              <Link
                to="/menu"
                className="btn-outline text-sm self-end mb-1 shrink-0"
              >
                View All
              </Link>
            </motion.div>
          </motion.div>

          {/* ── 3-column product grid ── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8"
          >
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={setSelectedProduct}
              />
            ))}
          </motion.div>

        </div>

        {/* ── Wave divider into Testimonials ── */}
        <div className="relative mt-16 md:mt-20 pointer-events-none" aria-hidden="true">
          <svg
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-12 md:h-20"
          >
            <path
              d="M0,60 C480,0 960,80 1440,20 L1440,80 L0,80 Z"
              fill="#F3C641"
            />
          </svg>
        </div>
      </section>

      {/* ── Product detail modal ── */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  )
}
