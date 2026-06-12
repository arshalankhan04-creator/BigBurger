import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Package, ShoppingBag,
  LogOut, Menu, X, ChevronRight, MessageSquare,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const navItems = [
  { label: 'Dashboard', href: '/admin',           icon: LayoutDashboard, end: true },
  { label: 'Products',  href: '/admin/products',  icon: Package },
  { label: 'Orders',    href: '/admin/orders',    icon: ShoppingBag },
  { label: 'Messages',  href: '/admin/messages',  icon: MessageSquare },
]

function SidebarContent({ onClose }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-sm bg-flame-orange flex items-center justify-center">
            <ShoppingBag size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-black text-white text-lg leading-none">
            Big<span className="text-flame-orange">Burger</span>
          </span>
        </Link>
        {/* Close button — mobile only */}
        {onClose && (
          <button onClick={onClose} className="md:hidden text-white/60 hover:text-white">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Admin badge */}
      <div className="px-6 py-3 border-b border-white/10">
        <span className="font-sans text-xs font-bold text-flame-orange uppercase tracking-widest">
          Admin Panel
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map(({ label, href, icon: Icon, end }) => (
          <NavLink
            key={href}
            to={href}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-sans font-semibold text-sm
               transition-all duration-150
               ${isActive
                 ? 'bg-flame-orange text-white'
                 : 'text-white/70 hover:bg-white/10 hover:text-white'
               }`
            }
          >
            <Icon size={18} className="shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + sign out */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 mb-3">
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="avatar"
              className="w-8 h-8 rounded-full border border-white/20 shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-flame-orange/30 flex items-center justify-center
                            font-sans font-black text-xs text-flame-orange shrink-0">
              {user?.email?.[0]?.toUpperCase()}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="font-sans font-semibold text-xs text-white truncate">
              {user?.user_metadata?.full_name ?? 'Admin'}
            </span>
            <span className="font-sans text-xs text-white/40 truncate">{user?.email}</span>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl
                     font-sans font-semibold text-sm text-red-400
                     hover:bg-red-500/10 transition-colors duration-150"
        >
          <LogOut size={16} className="shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Desktop sidebar (always visible) ── */}
      <aside className="hidden md:flex flex-col w-64 bg-espresso shrink-0 fixed top-0 left-0 h-screen z-40">
        <SidebarContent />
      </aside>

      {/* ── Mobile sidebar overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              key="sidebar"
              className="fixed top-0 left-0 h-screen w-64 bg-espresso z-50 md:hidden flex flex-col"
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content area ── */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">

        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3
                        bg-espresso border-b border-white/10 sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-white p-1"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <span className="font-display font-black text-white text-base">
            Big<span className="text-flame-orange">Burger</span> Admin
          </span>
          <div className="w-8" /> {/* spacer */}
        </div>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
