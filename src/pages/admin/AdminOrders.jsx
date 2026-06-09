import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'
import { supabase } from '@/lib/supabase'

// ── Status config ─────────────────────────────────────────────────
const STATUS_FLOW = ['placed', 'preparing', 'ready', 'on_the_way', 'delivered']

const STATUS_CONFIG = {
  placed:     { label: 'Order Placed',      color: 'bg-blue-100 text-blue-700'        },
  preparing:  { label: 'Preparing',         color: 'bg-amber-100 text-amber-700'      },
  ready:      { label: 'Ready',             color: 'bg-purple-100 text-purple-700'    },
  on_the_way: { label: 'Out for Delivery',  color: 'bg-orange-100 text-orange-700'    },
  delivered:  { label: 'Delivered',         color: 'bg-green-100 text-green-700'      },
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.placed
  return (
    <span className={`font-sans font-bold text-xs px-2.5 py-1 rounded-full ${cfg.color}`}>
      {cfg.label}
    </span>
  )
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  }) + ' · ' + new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit',
  })
}

// ── Status stepper dropdown ───────────────────────────────────────
function StatusStepper({ orderId, currentStatus, onUpdated }) {
  const [updating, setUpdating] = useState(false)

  const currentIdx = STATUS_FLOW.indexOf(currentStatus)
  const nextStatus = STATUS_FLOW[currentIdx + 1] ?? null
  const prevStatus = STATUS_FLOW[currentIdx - 1] ?? null

  const update = async (newStatus) => {
    setUpdating(true)
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
    setUpdating(false)
    onUpdated()
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Progress dots */}
      <div className="flex items-center gap-1">
        {STATUS_FLOW.map((s, i) => (
          <div key={s} className="flex items-center gap-1">
            <div className={`w-2.5 h-2.5 rounded-full transition-colors
              ${i <= currentIdx ? 'bg-flame-orange' : 'bg-espresso/20'}`} />
            {i < STATUS_FLOW.length - 1 && (
              <div className={`w-4 h-0.5 transition-colors
                ${i < currentIdx ? 'bg-flame-orange' : 'bg-espresso/20'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap">
        {prevStatus && currentStatus !== 'placed' && (
          <button
            onClick={() => update(prevStatus)}
            disabled={updating}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border-2 border-espresso/20
                       font-sans text-xs font-semibold text-espresso hover:bg-soft-sand
                       transition-colors disabled:opacity-50"
          >
            <ChevronUp size={12} />
            Back to {STATUS_CONFIG[prevStatus]?.label}
          </button>
        )}
        {nextStatus && (
          <button
            onClick={() => update(nextStatus)}
            disabled={updating}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-flame-orange text-white
                       font-sans text-xs font-semibold hover:bg-flame-dark
                       transition-colors disabled:opacity-50"
          >
            {updating
              ? <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              : <ChevronDown size={12} />
            }
            Mark as {STATUS_CONFIG[nextStatus]?.label}
          </button>
        )}
        {currentStatus === 'delivered' && (
          <span className="font-sans text-xs text-green-600 font-semibold px-3 py-1.5">
            ✓ Completed
          </span>
        )}
      </div>
    </div>
  )
}

// ── Order row (expandable) ────────────────────────────────────────
function OrderRow({ order, onUpdated }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border-b border-espresso/5 last:border-0">
      {/* Header row */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-3 px-4 py-4 hover:bg-soft-sand/30
                   transition-colors text-left"
        aria-expanded={expanded}
      >
        <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-4 gap-2 items-center">
          {/* Order ID */}
          <p className="font-sans font-bold text-sm text-espresso">
            #{order.id.slice(0, 8).toUpperCase()}
          </p>
          {/* Status */}
          <StatusBadge status={order.status} />
          {/* Date — hidden on mobile */}
          <p className="hidden md:block font-sans text-xs text-muted-taupe">
            {formatDate(order.created_at)}
          </p>
          {/* Total */}
          <p className="font-sans font-black text-sm text-flame-orange text-right md:text-left">
            ₹{Number(order.total).toFixed(0)}
          </p>
        </div>
        <div className={`shrink-0 text-muted-taupe transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
          <ChevronDown size={16} />
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 flex flex-col gap-4 border-t border-espresso/5 pt-3">
              {/* Order meta */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <p className="font-sans text-xs text-muted-taupe">Order Type</p>
                  <p className="font-sans font-semibold text-espresso capitalize">{order.order_type}</p>
                </div>
                <div>
                  <p className="font-sans text-xs text-muted-taupe">Placed</p>
                  <p className="font-sans font-semibold text-espresso">{formatDate(order.created_at)}</p>
                </div>
                {order.coupon_code && (
                  <div>
                    <p className="font-sans text-xs text-muted-taupe">Coupon</p>
                    <p className="font-sans font-semibold text-green-600">{order.coupon_code}</p>
                  </div>
                )}
              </div>

              {/* Items */}
              {order.order_items?.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="font-sans text-xs font-bold text-espresso uppercase tracking-wider">Items</p>
                  {order.order_items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {item.image && (
                        <img src={item.image} alt={item.name}
                          className="w-9 h-9 rounded-lg object-cover border border-espresso/10 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-sm text-espresso font-semibold truncate">{item.name}</p>
                        <p className="font-sans text-xs text-muted-taupe">x{item.qty}</p>
                      </div>
                      <p className="font-sans text-sm font-bold text-espresso shrink-0">
                        ₹{(Number(item.price) * item.qty).toFixed(0)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Status stepper */}
              <div className="pt-2 border-t border-espresso/5">
                <p className="font-sans text-xs font-bold text-espresso uppercase tracking-wider mb-2">
                  Update Status
                </p>
                <StatusStepper
                  orderId={order.id}
                  currentStatus={order.status}
                  onUpdated={onUpdated}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────
export default function AdminOrders() {
  const [orders, setOrders]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchOrders = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
    setOrders(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [])

  const filtered = statusFilter === 'all'
    ? orders
    : orders.filter((o) => o.status === statusFilter)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-black text-3xl text-espresso">Orders</h1>
          <p className="font-sans text-sm text-muted-taupe mt-1">
            {orders.length} total order{orders.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-espresso/20
                     font-sans font-semibold text-sm text-espresso hover:bg-soft-sand
                     transition-colors"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap">
        {['all', ...STATUS_FLOW].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-2 rounded-lg font-sans font-semibold text-xs border-2
                        transition-all duration-150 capitalize
                        ${statusFilter === s
                          ? 'bg-espresso text-white border-espresso'
                          : 'bg-white text-espresso border-espresso/20 hover:border-espresso'
                        }`}
          >
            {s === 'all' ? 'All' : STATUS_CONFIG[s]?.label}
            {s !== 'all' && (
              <span className="ml-1 opacity-60">
                ({orders.filter((o) => o.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 rounded-full border-4 border-flame-orange border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-espresso/10 overflow-hidden shadow-sm">
          {/* Column headers — desktop */}
          <div className="hidden md:grid grid-cols-4 gap-2 px-4 py-3 bg-soft-sand
                          border-b-2 border-espresso/10">
            {['Order ID', 'Status', 'Date', 'Total'].map((h) => (
              <p key={h} className="font-sans font-bold text-xs text-espresso uppercase tracking-wider">
                {h}
              </p>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="px-4 py-12 text-center font-sans text-sm text-muted-taupe">
              No orders found.
            </p>
          ) : (
            filtered.map((order) => (
              <OrderRow key={order.id} order={order} onUpdated={fetchOrders} />
            ))
          )}
        </div>
      )}
    </div>
  )
}
