import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, UtensilsCrossed, ShoppingCart, Heart } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'

const navItems = [
  { label: 'Home',     href: '/',         icon: Home },
  { label: 'Menu',     href: '/menu',      icon: UtensilsCrossed },
  { label: 'Cart',     href: null,         icon: ShoppingCart, isCart: true },
  { label: 'Wishlist', href: '/wishlist',  icon: Heart },
]

export default function BottomNav() {
  const { totalItems, toggleCart } = useCart()
  const { count: wishlistCount } = useWishlist()

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-[970]
                 bg-espresso border-t-2 border-white/10
                 flex items-center justify-around
                 px-2 py-2 safe-area-pb"
      aria-label="Mobile navigation"
    >
      {navItems.map((item) => {
        const Icon = item.icon

        // Cart button — opens drawer
        if (item.isCart) {
          return (
            <button
              key="cart"
              onClick={toggleCart}
              className="flex flex-col items-center gap-1 px-4 py-1.5 relative
                         text-white/60 hover:text-flame-orange transition-colors duration-150
                         focus-visible:outline-none"
              aria-label={`Open cart, ${totalItems} items`}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={2} />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className="absolute -top-1.5 -right-1.5 bg-flame-orange text-white
                                 font-sans font-black text-[9px] leading-none
                                 w-4 h-4 rounded-full flex items-center justify-center"
                    >
                      {totalItems > 9 ? '9+' : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <span className="font-sans text-[10px] font-semibold">{item.label}</span>
            </button>
          )
        }

        // Wishlist — show count badge
        if (item.href === '/wishlist') {
          return (
            <NavLink
              key={item.href}
              to={item.href}
              end
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-1.5 relative
                 transition-colors duration-150 focus-visible:outline-none
                 ${isActive ? 'text-flame-orange' : 'text-white/60 hover:text-flame-orange'}`
              }
              aria-label={item.label}
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon
                      size={22}
                      strokeWidth={2}
                      className={isActive ? 'fill-flame-orange/30' : ''}
                    />
                    <AnimatePresence>
                      {wishlistCount > 0 && (
                        <motion.span
                          key="wbadge"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          className="absolute -top-1.5 -right-1.5 bg-mustard text-espresso
                                     font-sans font-black text-[9px] leading-none
                                     w-4 h-4 rounded-full flex items-center justify-center"
                        >
                          {wishlistCount > 9 ? '9+' : wishlistCount}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <span className="font-sans text-[10px] font-semibold">{item.label}</span>
                </>
              )}
            </NavLink>
          )
        }

        // Regular nav link
        return (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-1.5
               transition-colors duration-150 focus-visible:outline-none
               ${isActive ? 'text-flame-orange' : 'text-white/60 hover:text-flame-orange'}`
            }
            aria-label={item.label}
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={22}
                  strokeWidth={2}
                  className={isActive ? 'fill-flame-orange/20' : ''}
                />
                <span className="font-sans text-[10px] font-semibold">{item.label}</span>
              </>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}
