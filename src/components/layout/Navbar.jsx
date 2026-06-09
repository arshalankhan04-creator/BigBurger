import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ShoppingBag, LogOut, User, Heart, ClipboardList, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'

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

// ── User Avatar + Dropdown ────────────────────────────────────────
function UserMenu({ user, signOut, isAdmin }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const initials = user.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user.email?.[0].toUpperCase() ?? 'U'

  const avatar = user.user_metadata?.avatar_url

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 focus-visible:outline-none group"
        aria-label="User menu"
        aria-expanded={open}
      >
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/30
                        group-hover:border-flame-orange transition-colors duration-150 shrink-0">
          {avatar ? (
            <img src={avatar} alt="avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full bg-flame-orange flex items-center justify-center
                            font-sans font-black text-xs text-white">
              {initials}
            </div>
          )}
        </div>
        {/* Name — desktop only */}
        <span className="hidden lg:block font-sans font-semibold text-sm text-white/80
                         group-hover:text-flame-orange transition-colors duration-150 max-w-[100px] truncate">
          {user.user_metadata?.full_name?.split(' ')[0] ?? 'Account'}
        </span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl
                       border-2 border-espresso shadow-xl overflow-hidden z-50"
          >
            {/* User info */}
            <div className="px-4 py-3 border-b border-espresso/10">
              <p className="font-sans font-bold text-sm text-espresso truncate">
                {user.user_metadata?.full_name ?? 'User'}
              </p>
              <p className="font-sans text-xs text-muted-taupe truncate">{user.email}</p>
            </div>

            {/* Links */}
            {[
              ...(isAdmin ? [{ to: '/admin', icon: LayoutDashboard, label: 'Admin Panel' }] : []),
              { to: '/orders',   icon: ClipboardList, label: 'My Orders'  },
              { to: '/wishlist', icon: Heart,         label: 'Wishlist'   },
            ].map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 font-sans text-sm text-espresso
                           hover:bg-soft-sand hover:text-flame-orange transition-colors duration-150"
              >
                <Icon size={15} className="shrink-0" />
                {label}
              </Link>
            ))}

            {/* Sign out */}
            <button
              onClick={() => { signOut(); setOpen(false) }}
              className="w-full flex items-center gap-3 px-4 py-3 font-sans text-sm
                         text-red-500 hover:bg-red-50 transition-colors duration-150
                         border-t border-espresso/10"
            >
              <LogOut size={15} className="shrink-0" />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar() {
  const [isOpen, setIsOpen]         = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const { totalItems, openCart }    = useCart()
  const { user, signOut, isAdmin }  = useAuth()
  const location                    = useLocation()
  const navigate                    = useNavigate()

  // Build /login?from=currentPath
  const loginHref = `/login?from=${encodeURIComponent(location.pathname + location.search)}`

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

            {/* ── Desktop: cart + auth ── */}
            <div className="hidden md:flex items-center gap-3">
              {/* Cart */}
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

              {/* Auth */}
              {user ? (
                <UserMenu user={user} signOut={signOut} isAdmin={isAdmin} />
              ) : (
                <Link
                  to={loginHref}
                  className="flex items-center gap-2 font-sans font-semibold text-sm
                             bg-white/10 hover:bg-flame-orange text-white
                             px-4 py-2 rounded-sm border border-white/20 hover:border-flame-orange
                             transition-all duration-150"
                >
                  <User size={15} />
                  Sign In
                </Link>
              )}
            </div>

            {/* ── Mobile: cart + hamburger ── */}
            <div className="md:hidden flex items-center gap-1">
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
              className="flex flex-col gap-3"
            >
              {user ? (
                <>
                  {/* Logged-in user info */}
                  <div className="flex items-center gap-3 py-3 border-t border-white/10">
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="avatar"
                        className="w-10 h-10 rounded-full border-2 border-flame-orange"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-flame-orange flex items-center justify-center
                                      font-sans font-black text-sm text-white">
                        {user.email?.[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-sans font-bold text-sm text-white">
                        {user.user_metadata?.full_name ?? 'User'}
                      </span>
                      <span className="font-sans text-xs text-white/50">{user.email}</span>
                    </div>
                  </div>
                  <Link to="/orders"   onClick={() => setIsOpen(false)} className="btn-outline text-white border-white/30 text-sm">My Orders</Link>
                  <Link to="/wishlist" onClick={() => setIsOpen(false)} className="btn-outline text-white border-white/30 text-sm">Wishlist</Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setIsOpen(false)}
                      className="btn-outline text-flame-orange border-flame-orange/50 text-sm">
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={() => { signOut(); setIsOpen(false) }}
                    className="w-full py-3 font-sans font-semibold text-sm text-red-400 border border-red-400/30 rounded-sm">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={loginHref}
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center justify-center gap-2 font-sans font-semibold
                               text-sm bg-white text-espresso py-3.5 rounded-sm"
                  >
                    <User size={15} /> Sign In with Google
                  </Link>
                  <Link
                    to="/menu"
                    onClick={() => setIsOpen(false)}
                    className="btn-primary w-full justify-center text-base"
                  >
                    Order Now
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Auth Modal ── */}
    </>
  )
}
