import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X, ShoppingBag, Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import { useTheme } from '@/context/ThemeContext'

const navLinks = [
  { label: 'Home',     href: '/' },
  { label: 'Menu',     href: '/menu' },
  { label: 'About',    href: '/about' },
  { label: 'Location', href: '/location' },
  { label: 'Contact',  href: '/contact' },
]

const mobileMenuVariants = {
  hidden:  { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.3, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -16, transition: { duration: 0.2, ease: 'easeIn'  } },
}

const mobileLinkVariants = {
  hidden:  { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: 'easeOut' },
  }),
}

function CartBadge({ count }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key="badge"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="absolute -top-1 -right-1 bg-flame-orange text-white
                     font-sans font-black text-[10px] leading-none
                     w-4 h-4 rounded-full flex items-center justify-center"
        >
          {count > 9 ? '9+' : count}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

export default function Navbar() {
  const [isOpen, setIsOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { totalItems, openCart } = useCart()
  const { isDark, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 bg-espresso transition-shadow duration-300',
          scrolled && 'shadow-[0_2px_16px_rgba(0,0,0,0.25)]',
        )}
      >
        <div className="max-w-container mx-auto px-6">
          <div className="flex items-center justify-between h-16 md:h-18">

            {/* ── Logo ── */}
            <Link
              to="/"
              className="flex items-center gap-2 shrink-0"
              aria-label="Big Burger — go to homepage"
            >
              <div className="w-9 h-9 rounded-sm bg-flame-orange flex items-center justify-center">
                <ShoppingBag size={18} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display font-black text-white text-xl leading-none">
                Big <span className="text-flame-orange">Burger</span>
              </span>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.href}
                  end={link.href === '/'}
                  className={({ isActive }) =>
                    cn(
                      'font-sans font-medium text-sm transition-colors duration-150 focus-visible:outline-none',
                      isActive ? 'text-flame-orange' : 'text-white/80 hover:text-flame-orange'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* ── Desktop: theme + cart + CTA ── */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-10 h-10
                           text-white hover:text-flame-orange transition-colors duration-150
                           focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-flame-orange rounded-sm"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <AnimatePresence mode="wait">
                  {isDark ? (
                    <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Sun size={20} strokeWidth={2} />
                    </motion.div>
                  ) : (
                    <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Moon size={20} strokeWidth={2} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              <button
                onClick={openCart}
                className="relative flex items-center justify-center w-10 h-10
                           text-white hover:text-flame-orange transition-colors duration-150
                           focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-flame-orange rounded-sm"
                aria-label={`Open cart, ${totalItems} items`}
              >
                <ShoppingBag size={20} strokeWidth={2} />
                <CartBadge count={totalItems} />
              </button>

              <Link to="/menu" className="btn-primary text-sm">
                Order Now
              </Link>
            </div>

            {/* ── Mobile: theme + cart + hamburger ── */}
            <div className="md:hidden flex items-center gap-1">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-10 h-10
                           text-white hover:text-flame-orange transition-colors duration-150
                           focus-visible:outline-none rounded-sm"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
              </button>

              <button
                onClick={openCart}
                className="relative flex items-center justify-center w-10 h-10
                           text-white hover:text-flame-orange transition-colors duration-150
                           focus-visible:outline-none rounded-sm"
                aria-label={`Open cart, ${totalItems} items`}
              >
                <ShoppingBag size={20} strokeWidth={2} />
                <CartBadge count={totalItems} />
              </button>

              <button
                className="flex items-center justify-center w-10 h-10
                           text-white hover:text-flame-orange transition-colors duration-150
                           focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-flame-orange rounded-sm"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
              >
                {isOpen ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ── Mobile Menu Overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 bg-espresso flex flex-col pt-20 px-8 pb-10"
          >
            <nav className="flex flex-col gap-2 flex-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  custom={i}
                  variants={mobileLinkVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <NavLink
                    to={link.href}
                    end={link.href === '/'}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'block font-display font-black text-4xl transition-colors duration-150 py-3 border-b border-white/10 last:border-0 focus-visible:outline-none',
                        isActive ? 'text-flame-orange' : 'text-white hover:text-flame-orange'
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.35, duration: 0.3 } }}
            >
              <Link
                to="/menu"
                onClick={() => setIsOpen(false)}
                className="btn-primary w-full justify-center text-base"
              >
                Order Now
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
