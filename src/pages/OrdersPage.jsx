import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { staggerContainer, staggerItem } from '@/animations/motion'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { usePendingAction } from '@/context/PendingActionContext'
import {
  Package, ChevronRight, Bike, Store,
  CheckCircle, ArrowRight, ShoppingBag, Trash2, LogIn,
} from 'lucide-react'

// ─── Status config ────────────────────────────────────────────────
const STATUS_CONFIG = {
  placed:    { label: 'Order Placed',       color: 'bg-blue-100 text-blue-700',   icon: Package },
  preparing: { label: 'Preparing',          color: 'bg-mustard/20 text-mustard-dark', icon: Package },
  on_the_way:{ label: 'Out for Delivery',   color: 'bg-flame-orange/10 text-flame-orange', icon: Bike },
  ready:     { label: 'Ready for Pickup',   color: 'bg-green-100 text-green-700', icon: Store },
  delivered: { label: 'Delivered',          color: 'bg-green-100 text-green-700', icon: CheckCircle },
}

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

// ─── Single Order Card ────────────────────────────────────────────
function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false)
  const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.placed
  const StatusIcon = statusCfg.icon

  return (
    <motion.div
      variants={staggerItem}
      className="bg-white rounded-2xl border-2 border-espresso/10 overflow-hidden
                 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-start justify-between gap-4 p-5 text-left
                   hover:bg-soft-sand/50 transition-colors duration-150"
        aria-expanded={expanded}
      >
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-black text-base text-espresso tracking-wide">
              #{order.id}
            </span>
            <span className={`font-sans font-bold text-xs px-2.5 py-1 rounded-full ${statusCfg.color}`}>
              <StatusIcon size={11} className="inline mr-1" />
              {statusCfg.label}
            </span>
            <span className="font-sans text-xs text-muted-taupe capitalize bg-soft-sand px-2 py-0.5 rounded-full">
              {order.orderType}
            </span>
          </div>
          <p className="font-sans text-xs text-muted-taupe">{formatDate(order.date)}</p>
          <p className="font-sans text-sm text-espresso font-semibold">
            {order.items.length} item{order.items.length !== 1 ? 's' : ''} · ₹{order.total.toFixed(0)}
          </p>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 mt-1"
        >
          <ChevronRight size={18} className="text-muted-taupe rotate-90" />
        </motion.div>
      </button>

      {/* Expanded items */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-espresso/10 px-5 py-4 flex flex-col gap-4">
              {/* Items list */}
              <div className="flex flex-col gap-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-soft-sand shrink-0 border border-espresso/10">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans font-semibold text-sm text-espresso truncate">{item.name}</p>
                      <p className="font-sans text-xs text-muted-taupe">x{item.qty}</p>
                    </div>
                    <span className="font-sans font-bold text-sm text-espresso shrink-0">
                      ₹{(item.price * item.qty).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-espresso/10 pt-3 flex justify-between items-center">
                <span className="font-sans font-bold text-sm text-espresso">Total Paid</span>
                <span className="font-display font-black text-flame-orange text-lg">₹{order.total.toFixed(0)}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                <Link
                  to="/menu"
                  className="btn-primary text-xs px-4 py-2 gap-1.5"
                >
                  <ArrowRight size={13} /> Reorder
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────
export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const { requireAuth } = usePendingAction()
  const location = useLocation()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // Clean up ?resume= from URL if present (orders load automatically via useEffect)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('resume') === 'orders') {
      params.delete('resume')
      const clean = location.pathname + (params.toString() ? `?${params.toString()}` : '')
      navigate(clean, { replace: true })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Wait for auth to resolve before doing anything
    if (authLoading) return

    if (user) {
      supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          if (data) {
            setOrders(data.map((o) => ({
              id:        o.id.slice(0, 8).toUpperCase(),
              date:      o.created_at,
              orderType: o.order_type,
              status:    o.status,
              total:     o.total,
              items:     o.order_items.map((i) => ({
                id:    i.product_id,
                name:  i.name,
                price: i.price,
                qty:   i.qty,
                image: i.image,
              })),
            })))
          }
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [user, authLoading])

  const clearHistory = async () => {
    if (user) {
      await supabase.from('orders').delete().eq('user_id', user.id)
    }
    setOrders([])
  }

  // Still resolving auth — show spinner
  const isLoading = authLoading || (!!user && loading)

  return (
    <div className="min-h-screen bg-warm-cream pt-16">

      {/* ── Hero ── */}
      <div className="bg-espresso py-14">
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
            <ShoppingBag size={28} className="text-flame-orange" />
          </motion.div>
          <motion.p variants={staggerItem} className="eyebrow text-mustard/80">Your History</motion.p>
          <motion.h1
            variants={staggerItem}
            className="font-display font-black text-white text-display-xl leading-tight"
          >
            My Orders
          </motion.h1>
          {user && orders.length > 0 && (
            <motion.p variants={staggerItem} className="font-sans text-white/60 text-sm">
              {orders.length} order{orders.length !== 1 ? 's' : ''} placed
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
      <div className="max-w-container mx-auto px-6 py-10">
        <AnimatePresence mode="wait">

          {/* Loading */}
          {isLoading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex justify-center py-24">
              <svg className="animate-spin w-8 h-8 text-flame-orange" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
            </motion.div>

          ) : !user ? (
            /* ── Guest: sign-in prompt ── */
            <motion.div
              key="guest"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-6 py-20 text-center max-w-sm mx-auto"
            >
              <div className="w-24 h-24 rounded-full bg-soft-sand flex items-center justify-center">
                <ShoppingBag size={40} className="text-espresso/20" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="font-display font-black text-display-md text-espresso">
                  Sign in to see your orders
                </h2>
                <p className="font-sans text-sm text-muted-taupe leading-relaxed">
                  Your full order history is saved to your account. Sign in to view it.
                </p>
              </div>
              <button
                onClick={() => requireAuth(() => {}, 'orders')}
                className="btn-primary gap-2"
              >
                <LogIn size={16} />
                Sign In
              </button>
              <Link to="/menu" className="font-sans text-sm text-muted-taupe hover:text-flame-orange transition-colors">
                Browse Menu instead
              </Link>
            </motion.div>

          ) : orders.length === 0 ? (
            /* ── Logged in, no orders ── */
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-6 py-20 text-center"
            >
              <div className="w-24 h-24 rounded-full bg-soft-sand flex items-center justify-center">
                <ShoppingBag size={40} className="text-espresso/20" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="font-display font-black text-display-md text-espresso">No orders yet</h2>
                <p className="font-sans text-sm text-muted-taupe mt-2 max-w-xs">
                  Your order history will appear here after you place your first order.
                </p>
              </div>
              <Link to="/menu" className="btn-primary gap-2">
                Browse Menu <ArrowRight size={16} />
              </Link>
            </motion.div>

          ) : (
            /* ── Order list ── */
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <p className="font-sans font-semibold text-sm text-muted-taupe">
                  {orders.length} order{orders.length !== 1 ? 's' : ''}
                </p>
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-1.5 font-sans text-xs font-semibold
                             text-muted-taupe hover:text-red-500 transition-colors duration-150"
                >
                  <Trash2 size={13} /> Clear History
                </button>
              </div>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-4 max-w-2xl"
              >
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
