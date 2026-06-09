import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, IndianRupee, Package, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'

// ── Stat card ─────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border-2 border-espresso/10 p-6 flex items-start gap-4 shadow-sm"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={22} className="text-white" strokeWidth={2} />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="font-sans text-xs font-semibold text-muted-taupe uppercase tracking-wider">
          {label}
        </span>
        {loading ? (
          <div className="h-8 w-24 bg-soft-sand animate-pulse rounded-lg mt-1" />
        ) : (
          <span className="font-display font-black text-3xl text-espresso leading-tight">
            {value}
          </span>
        )}
        {sub && !loading && (
          <span className="font-sans text-xs text-muted-taupe mt-0.5">{sub}</span>
        )}
      </div>
    </motion.div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      // Run all queries in parallel
      const [ordersRes, productsRes, itemsRes] = await Promise.all([

        // All orders with total
        supabase.from('orders').select('id, total, status'),

        // Total products count
        supabase.from('products').select('id', { count: 'exact', head: true }),

        // Order items for top selling product
        supabase.from('order_items').select('product_id, name, qty'),
      ])

      const orders   = ordersRes.data   ?? []
      const items    = itemsRes.data    ?? []

      // Total orders
      const totalOrders = orders.length

      // Revenue — sum of all order totals
      const revenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0)

      // Total products
      const totalProducts = productsRes.count ?? 0

      // Top selling product — group by product_id, sum qty
      const qtyMap = {}
      items.forEach(({ product_id, name, qty }) => {
        if (!qtyMap[product_id]) qtyMap[product_id] = { name, qty: 0 }
        qtyMap[product_id].qty += qty
      })
      const topProduct = Object.values(qtyMap).sort((a, b) => b.qty - a.qty)[0] ?? null

      setStats({ totalOrders, revenue, totalProducts, topProduct })
      setLoading(false)
    }

    fetchStats()
  }, [])

  const cards = [
    {
      icon:  ShoppingBag,
      label: 'Total Orders',
      value: stats?.totalOrders ?? 0,
      sub:   'All time',
      color: 'bg-flame-orange',
    },
    {
      icon:  IndianRupee,
      label: 'Revenue',
      value: stats ? `₹${stats.revenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '₹0',
      sub:   'All time',
      color: 'bg-green-500',
    },
    {
      icon:  Package,
      label: 'Total Products',
      value: stats?.totalProducts ?? 0,
      sub:   'In menu',
      color: 'bg-espresso',
    },
    {
      icon:  TrendingUp,
      label: 'Top Selling',
      value: stats?.topProduct?.name ?? '—',
      sub:   stats?.topProduct ? `${stats.topProduct.qty} units sold` : 'No orders yet',
      color: 'bg-mustard',
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="font-display font-black text-3xl text-espresso">Dashboard</h1>
        <p className="font-sans text-sm text-muted-taupe mt-1">Welcome back, Admin.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((card, i) => (
          <motion.div key={card.label} transition={{ delay: i * 0.07 }}>
            <StatCard {...card} loading={loading} />
          </motion.div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href="/admin/products"
          className="bg-white rounded-2xl border-2 border-espresso/10 p-5 flex items-center
                     justify-between gap-4 shadow-sm hover:border-flame-orange
                     transition-colors duration-150 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-espresso/5 flex items-center justify-center">
              <Package size={18} className="text-espresso" />
            </div>
            <div>
              <p className="font-sans font-bold text-sm text-espresso">Manage Products</p>
              <p className="font-sans text-xs text-muted-taupe">Add, edit, delete, update stock</p>
            </div>
          </div>
          <Package size={16} className="text-muted-taupe group-hover:text-flame-orange transition-colors shrink-0" />
        </a>

        <a
          href="/admin/orders"
          className="bg-white rounded-2xl border-2 border-espresso/10 p-5 flex items-center
                     justify-between gap-4 shadow-sm hover:border-flame-orange
                     transition-colors duration-150 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-espresso/5 flex items-center justify-center">
              <ShoppingBag size={18} className="text-espresso" />
            </div>
            <div>
              <p className="font-sans font-bold text-sm text-espresso">Manage Orders</p>
              <p className="font-sans text-xs text-muted-taupe">View and update order status</p>
            </div>
          </div>
          <ShoppingBag size={16} className="text-muted-taupe group-hover:text-flame-orange transition-colors shrink-0" />
        </a>
      </div>
    </div>
  )
}
