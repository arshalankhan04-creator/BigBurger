import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useEffect } from 'react'

// ── Single cart item row ──────────────────────────────────────────
function CartItem({ item }) {
  const { updateQty, removeItem } = useCart()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
      className="flex items-center gap-3 py-4 border-b border-espresso/10 last:border-0"
    >
      {/* Image */}
      <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-espresso/10 shrink-0 bg-soft-sand">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-sans font-bold text-sm text-espresso leading-snug truncate">
          {item.name}
        </p>
        <p className="font-sans font-black text-base text-flame-orange mt-0.5">
          ₹{(item.price * item.qty).toFixed(2)}
        </p>

        {/* Qty stepper */}
        <div className="flex items-center gap-1 mt-2">
          <button
            onClick={() => updateQty(item.id, item.qty - 1)}
            className="w-7 h-7 rounded-sm border-2 border-espresso
                       flex items-center justify-center text-espresso
                       hover:bg-espresso hover:text-white
                       transition-colors duration-150
                       focus-visible:outline-none"
            aria-label="Decrease quantity"
          >
            <Minus size={11} strokeWidth={2.5} />
          </button>
          <span className="w-7 text-center font-sans font-bold text-sm text-espresso">
            {item.qty}
          </span>
          <button
            onClick={() => updateQty(item.id, item.qty + 1)}
            className="w-7 h-7 rounded-sm border-2 border-espresso
                       flex items-center justify-center text-espresso
                       hover:bg-espresso hover:text-white
                       transition-colors duration-150
                       focus-visible:outline-none"
            aria-label="Increase quantity"
          >
            <Plus size={11} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeItem(item.id)}
        className="w-8 h-8 rounded-sm flex items-center justify-center
                   text-muted-taupe hover:text-flame-orange hover:bg-flame-orange/10
                   transition-colors duration-150 shrink-0
                   focus-visible:outline-none"
        aria-label={`Remove ${item.name}`}
      >
        <Trash2 size={15} />
      </button>
    </motion.div>
  )
}

// ── Cart Drawer ───────────────────────────────────────────────────
export default function CartDrawer() {
  const { items, isOpen, closeCart, subtotal, totalItems, clearCart } = useCart()

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeCart() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [closeCart])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const deliveryFee = subtotal > 0 ? 5.00 : 0
  const total = subtotal + deliveryFee

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            className="fixed inset-0 z-[998] bg-espresso/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            key="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="fixed top-0 right-0 bottom-0 z-[999]
                       w-full max-w-sm bg-warm-cream
                       flex flex-col
                       border-l-2 border-espresso
                       shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-6 py-5
                            border-b-2 border-espresso/10 shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-espresso" />
                <h2 className="font-display font-black text-xl text-espresso">
                  Your Cart
                </h2>
                {totalItems > 0 && (
                  <span className="bg-flame-orange text-white font-sans font-bold
                                   text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="font-sans text-xs text-muted-taupe hover:text-flame-orange
                               transition-colors duration-150 focus-visible:outline-none"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={closeCart}
                  className="w-9 h-9 rounded-sm bg-espresso text-white
                             flex items-center justify-center
                             hover:bg-flame-orange transition-colors duration-150
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame-orange"
                  aria-label="Close cart"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* ── Items ── */}
            <div className="flex-1 overflow-y-auto px-6">
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center gap-4
                               h-full py-20 text-center"
                  >
                    <ShoppingBag size={48} className="text-espresso/20" strokeWidth={1} />
                    <p className="font-display font-black text-xl text-espresso/40">
                      Your cart is empty
                    </p>
                    <p className="font-sans text-sm text-muted-taupe">
                      Add some items from the menu
                    </p>
                    <Link
                      to="/menu"
                      onClick={closeCart}
                      className="btn-primary text-sm mt-2"
                    >
                      Browse Menu
                    </Link>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* ── Footer: totals + checkout ── */}
            <AnimatePresence>
              {items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="border-t-2 border-espresso/10 px-6 py-5 shrink-0
                             flex flex-col gap-4 bg-white"
                >
                  {/* Price breakdown */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="font-sans text-sm text-muted-taupe">Subtotal</span>
                      <span className="font-sans font-semibold text-sm text-espresso">
                        ₹{subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-sans text-sm text-muted-taupe">Delivery</span>
                      <span className="font-sans font-semibold text-sm text-espresso">
                        ₹{deliveryFee.toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t border-espresso/10 pt-2 flex justify-between">
                      <span className="font-sans font-bold text-base text-espresso">Total</span>
                      <span className="font-sans font-black text-xl text-flame-orange">
                        ₹{total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout button */}
                  <Link
                    to="/checkout"
                    onClick={closeCart}
                    className="btn-primary w-full justify-center gap-2 text-base"
                  >
                    Proceed to Checkout
                    <ArrowRight size={16} />
                  </Link>

                  <Link
                    to="/menu"
                    onClick={closeCart}
                    className="text-center font-sans text-sm text-muted-taupe
                               hover:text-flame-orange transition-colors duration-150"
                  >
                    Continue Shopping
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
