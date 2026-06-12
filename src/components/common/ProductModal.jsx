import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag, Flame } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'

function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 16 16"
          fill="#F3C641" aria-hidden="true">
          <path d="M8 1l1.85 3.75L14 5.5l-3 2.92.71 4.13L8 10.4l-3.71 2.15L5 8.42 2 5.5l4.15-.75L8 1z" />
        </svg>
      ))}
    </div>
  )
}

export default function ProductModal({ product, onClose }) {
  const [qty, setQty] = useState(1)
  const { addItem, openCart } = useCart()

  const handleAddToCart = () => {
    addItem(product, qty)
    onClose()
    openCart()
  }

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!product) return null

  const total = (product.price * qty).toFixed(2)

  return (
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        className="fixed inset-0 z-[999] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-espresso/70 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal card */}
        <motion.div
          key="modal-card"
          role="dialog"
          aria-modal="true"
          aria-label={product.name}
          className="relative z-10 bg-warm-cream rounded-xl border-2 border-espresso
                     w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ duration: 0.3, ease: [0.34, 1.2, 0.64, 1] }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-sm
                       bg-espresso text-white flex items-center justify-center
                       hover:bg-flame-orange transition-colors duration-150
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame-orange"
            aria-label="Close"
          >
            <X size={16} strokeWidth={2.5} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image */}
            <div className="bg-soft-sand rounded-tl-xl rounded-bl-none rounded-tr-xl
                            md:rounded-tr-none md:rounded-bl-xl
                            flex items-center justify-center p-8 min-h-[260px]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full max-w-[240px] object-cover rounded-lg
                           drop-shadow-xl"
              />
            </div>

            {/* Content */}
            <div className="p-7 flex flex-col gap-5">
              {/* Badge */}
              {product.badge && (
                <span className="self-start bg-flame-orange text-white
                                 font-sans font-bold text-xs px-3 py-1
                                 rounded-sm tracking-wide">
                  {product.badge}
                </span>
              )}

              {/* Name */}
              <div className="flex flex-col gap-1">
                <h2 className="font-display font-black text-espresso
                               text-display-md leading-tight">
                  {product.name}
                </h2>
                <div className="flex items-center gap-2">
                  <Stars />
                  <span className="font-sans text-xs text-muted-taupe">(4.8)</span>
                </div>
              </div>

              {/* Description */}
              <p className="font-sans text-sm text-muted-taupe leading-relaxed">
                {product.description}
              </p>

              {/* Ingredients */}
              <div className="flex flex-col gap-1.5">
                <span className="font-sans font-bold text-xs text-espresso uppercase tracking-wider">
                  Ingredients
                </span>
                <p className="font-sans text-sm text-muted-taupe">
                  {product.ingredients}
                </p>
              </div>

              {/* Calories */}
              <div className="flex items-center gap-2">
                <Flame size={14} className="text-flame-orange" />
                <span className="font-sans text-sm text-muted-taupe">
                  {product.calories} cal
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1">
                <span className="font-sans font-black text-3xl text-flame-orange">
                  ${total}
                </span>
                {qty > 1 && (
                  <span className="font-sans text-sm text-muted-taupe">
                    (${product.price.toFixed(2)} each)
                  </span>
                )}
              </div>

              {/* Qty + Add to cart */}
              <div className="flex items-center gap-3 mt-auto">
                {/* Qty stepper */}
                <div className="flex items-center border-2 border-espresso rounded-sm overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-9 h-10 flex items-center justify-center
                               bg-white hover:bg-soft-sand transition-colors duration-150
                               focus-visible:outline-none"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} strokeWidth={2.5} />
                  </button>
                  <span className="w-10 text-center font-sans font-bold text-sm text-espresso">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-9 h-10 flex items-center justify-center
                               bg-white hover:bg-soft-sand transition-colors duration-150
                               focus-visible:outline-none"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Add to cart */}
                <button
                  className="btn-primary flex-1 gap-2"
                  onClick={handleAddToCart}
                  aria-label={`Add ${qty} ${product.name} to cart`}
                >
                  <ShoppingBag size={16} />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
