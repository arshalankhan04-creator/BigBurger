import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { staggerContainer, staggerItem } from '@/animations/motion'
import {
  CheckCircle, Clock, ChefHat, Bike, Package,
  Search, ArrowRight, MapPin, Phone, Store,
} from 'lucide-react'

// ─── Stages — Delivery ────────────────────────────────────────────
const DELIVERY_STAGES = [
  {
    id: 0, key: 'placed',    label: 'Order Placed',
    sublabel: 'We received your order',       icon: Package,      duration: 8000,
  },
  {
    id: 1, key: 'preparing', label: 'Preparing',
    sublabel: 'Our chefs are on it',          icon: ChefHat,      duration: 12000,
  },
  {
    id: 2, key: 'on_the_way', label: 'Out for Delivery',
    sublabel: 'Your order is on the way',     icon: Bike,         duration: 10000,
  },
  {
    id: 3, key: 'delivered', label: 'Delivered',
    sublabel: 'Enjoy your meal!',             icon: CheckCircle,  duration: null,
  },
]

// ─── Stages — Pickup ──────────────────────────────────────────────
const PICKUP_STAGES = [
  {
    id: 0, key: 'placed',    label: 'Order Placed',
    sublabel: 'We received your order',       icon: Package,      duration: 8000,
  },
  {
    id: 1, key: 'preparing', label: 'Preparing',
    sublabel: 'Our chefs are on it',          icon: ChefHat,      duration: 12000,
  },
  {
    id: 2, key: 'ready',     label: 'Ready for Pickup',
    sublabel: 'Come collect your order!',     icon: Store,        duration: null,
  },
]

// ─── Generate a fake order ID ─────────────────────────────────────
function generateOrderId() {
  return 'BB' + Math.random().toString(36).substring(2, 8).toUpperCase()
}

// ─── Progress bar ─────────────────────────────────────────────────
function ProgressBar({ currentStage, totalStages }) {
  const pct = (currentStage / (totalStages - 1)) * 100
  return (
    <div className="relative w-full h-2 bg-espresso/10 rounded-full overflow-hidden">
      <motion.div
        className="absolute left-0 top-0 h-full bg-flame-orange rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  )
}

// ─── Stage step ───────────────────────────────────────────────────
function StageStep({ stage, status }) {
  // status: 'done' | 'active' | 'pending'
  const Icon = stage.icon
  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <motion.div
        animate={
          status === 'active'
            ? { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 1.5 } }
            : {}
        }
        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center
                    transition-colors duration-500
                    ${status === 'done'
                      ? 'bg-flame-orange border-flame-orange text-white'
                      : status === 'active'
                      ? 'bg-espresso border-espresso text-white'
                      : 'bg-white border-espresso/20 text-muted-taupe'
                    }`}
      >
        {status === 'done'
          ? <CheckCircle size={20} strokeWidth={2.5} />
          : <Icon size={20} strokeWidth={2} />
        }
      </motion.div>
      <span className={`font-sans font-semibold text-xs text-center leading-tight
                        ${status === 'pending' ? 'text-muted-taupe' : 'text-espresso'}`}>
        {stage.label}
      </span>
    </div>
  )
}

// ─── Tracking view ────────────────────────────────────────────────
function TrackingView({ orderId, orderType, onReset }) {
  const STAGES = orderType === 'pickup' ? PICKUP_STAGES : DELIVERY_STAGES
  const [currentStage, setCurrentStage] = useState(0)
  const timerRef = useRef(null)
  const isPickup = orderType === 'pickup'

  useEffect(() => {
    const stage = STAGES[currentStage]
    if (stage.duration && currentStage < STAGES.length - 1) {
      timerRef.current = setTimeout(() => {
        setCurrentStage((s) => s + 1)
      }, stage.duration)
    }
    return () => clearTimeout(timerRef.current)
  }, [currentStage])

  const activeStage = STAGES[currentStage]
  const isDelivered = currentStage === STAGES.length - 1

  // Estimated time remaining
  const remainingStages = STAGES.slice(currentStage + 1)
  const totalRemaining = remainingStages.reduce((sum, s) => sum + (s.duration || 0), 0)
  const minutesLeft = Math.ceil(totalRemaining / 60000)

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-8"
    >
      {/* Order ID + status header */}
      <motion.div
        variants={staggerItem}
        className="bg-espresso rounded-2xl p-6 flex flex-col gap-4"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-sans text-xs text-white/50 uppercase tracking-wider mb-1">
              Order ID
            </p>
            <p className="font-display font-black text-white text-xl tracking-wide">
              #{orderId}
            </p>
          </div>
          <span className={`font-sans font-bold text-xs px-3 py-1.5 rounded-full shrink-0
                            ${isDelivered
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-flame-orange/20 text-flame-orange'
                            }`}>
            {isDelivered ? (isPickup ? '✓ Ready' : '✓ Delivered') : '● Live'}
          </span>
        </div>

        {/* ETA */}
        {!isDelivered && (
          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-4 py-3">
            <Clock size={16} className="text-mustard shrink-0" />
            <span className="font-sans text-sm text-white/80">
              {isPickup ? 'Ready for pickup in' : 'Estimated delivery in'}{' '}
              <span className="font-bold text-white">{minutesLeft} min</span>
            </span>
          </div>
        )}

        {isDelivered && (
          <div className="flex items-center gap-2 bg-green-500/10 rounded-lg px-4 py-3">
            <CheckCircle size={16} className="text-green-400 shrink-0" />
            <span className="font-sans text-sm text-white/80">
              {isPickup
                ? <>Your order is <span className="font-bold text-green-400">ready for pickup</span>. Come collect it!</>
                : <>Your order has been <span className="font-bold text-green-400">delivered</span>. Enjoy!</>
              }
            </span>
          </div>
        )}
      </motion.div>

      {/* Stage tracker */}
      <motion.div variants={staggerItem} className="bg-white rounded-2xl border-2 border-espresso p-6 flex flex-col gap-6">
        <h3 className="font-sans font-extrabold text-base text-espresso">Order Status</h3>

        {/* Steps row */}
        <div className="flex items-start gap-0 relative">
          {/* Connecting lines */}
          <div className="absolute top-6 left-6 right-6 h-0.5 bg-espresso/10 -z-0" />
          {STAGES.map((stage, i) => (
            <StageStep
              key={stage.key}
              stage={stage}
              status={
                i < currentStage ? 'done'
                : i === currentStage ? 'active'
                : 'pending'
              }
            />
          ))}
        </div>

        {/* Progress bar */}
        <ProgressBar currentStage={currentStage} totalStages={STAGES.length} />

        {/* Active stage description */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStage.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 bg-soft-sand rounded-xl px-4 py-3"
          >
            <div className="w-9 h-9 rounded-full bg-flame-orange/10 flex items-center justify-center shrink-0">
              {(() => { const Icon = activeStage.icon; return <Icon size={18} className="text-flame-orange" /> })()}
            </div>
            <div>
              <p className="font-sans font-bold text-sm text-espresso">{activeStage.label}</p>
              <p className="font-sans text-xs text-muted-taupe">{activeStage.sublabel}</p>
            </div>
            {!isDelivered && (
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="ml-auto w-2 h-2 rounded-full bg-flame-orange shrink-0"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Delivery / Pickup info */}
      <motion.div variants={staggerItem} className="bg-white rounded-2xl border-2 border-espresso p-6 flex flex-col gap-4">
        <h3 className="font-sans font-extrabold text-base text-espresso">
          {isPickup ? 'Pickup Info' : 'Delivery Info'}
        </h3>
        <div className="flex flex-col gap-3">
          {isPickup ? (
            <>
              <div className="flex items-start gap-3">
                <Store size={16} className="text-flame-orange mt-0.5 shrink-0" />
                <div>
                  <p className="font-sans font-semibold text-sm text-espresso">Pickup Location</p>
                  <p className="font-sans text-sm text-muted-taupe">Big Burger — SG Highway, Bodakdev, Ahmedabad</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-flame-orange shrink-0" />
                <div>
                  <p className="font-sans font-semibold text-sm text-espresso">Branch Contact</p>
                  <p className="font-sans text-sm text-muted-taupe">+91 79 1234 5678</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-flame-orange mt-0.5 shrink-0" />
                <div>
                  <p className="font-sans font-semibold text-sm text-espresso">Delivery Address</p>
                  <p className="font-sans text-sm text-muted-taupe">123 SG Highway, Bodakdev, Ahmedabad</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-flame-orange shrink-0" />
                <div>
                  <p className="font-sans font-semibold text-sm text-espresso">Contact</p>
                  <p className="font-sans text-sm text-muted-taupe">+91 98765 43210</p>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div variants={staggerItem} className="flex gap-3 flex-wrap">
        <Link to="/menu" className="btn-primary gap-2">
          Order Again <ArrowRight size={16} />
        </Link>
        <button
          onClick={onReset}
          className="btn-outline text-sm"
        >
          Track Another Order
        </button>
      </motion.div>
    </motion.div>
  )
}

// ─── Search form ──────────────────────────────────────────────────
function SearchForm({ onTrack }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const val = input.trim().toUpperCase()
    if (!val) { setError('Please enter an order ID'); return }
    if (!val.startsWith('BB') || val.length < 4) {
      setError('Invalid order ID. Format: BB + 6 characters (e.g. BBXYZ123)')
      return
    }
    setError('')
    onTrack(val)
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6 max-w-lg mx-auto"
    >
      <motion.div variants={staggerItem} className="flex flex-col gap-2 text-center">
        <h2 className="font-display font-black text-display-lg text-espresso">
          Track Your Order
        </h2>
        <p className="font-sans text-sm text-muted-taupe">
          Enter your order ID to see real-time status updates.
        </p>
      </motion.div>

      <motion.form
        variants={staggerItem}
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
      >
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-taupe" />
            <input
              type="text"
              value={input}
              onChange={(e) => { setInput(e.target.value); setError('') }}
              placeholder="e.g. BBXYZ123"
              className="w-full pl-10 pr-4 py-3 rounded-sm border-2 border-espresso bg-white
                         font-sans text-sm text-espresso placeholder:text-muted-taupe
                         focus:outline-none focus:border-flame-orange transition-colors duration-150"
              aria-label="Order ID"
            />
          </div>
          <button type="submit" className="btn-primary px-6 shrink-0">
            Track
          </button>
        </div>
        {error && (
          <p className="font-sans text-xs text-red-500">{error}</p>
        )}
      </motion.form>

      {/* Demo shortcut */}
      <motion.div
        variants={staggerItem}
        className="bg-soft-sand rounded-xl border-2 border-espresso/20 p-5 flex flex-col gap-3"
      >
        <p className="font-sans font-semibold text-sm text-espresso">
          🎯 Try a demo order
        </p>
        <p className="font-sans text-xs text-muted-taupe">
          Don't have an order ID? Click below to see a live demo of the tracking experience.
        </p>
        <button
          type="button"
          onClick={() => onTrack(generateOrderId())}
          className="btn-primary text-sm self-start gap-2"
        >
          Start Demo <ArrowRight size={14} />
        </button>
      </motion.div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────
export default function OrderTrackingPage() {
  const [searchParams] = useSearchParams()
  const [orderId, setOrderId] = useState(searchParams.get('id') || null)
  const [orderType, setOrderType] = useState(searchParams.get('type') || 'delivery')

  return (
    <div className="min-h-screen bg-warm-cream pt-16">

      {/* ── Hero ── */}
      <div className="bg-espresso py-14 md:py-18">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-container mx-auto px-6 flex flex-col items-center text-center gap-3"
        >
          <motion.p variants={staggerItem} className="eyebrow text-mustard/80">
            Real-Time Updates
          </motion.p>
          <motion.h1
            variants={staggerItem}
            className="font-display font-black text-white text-display-xl leading-tight"
          >
            Order Tracking
          </motion.h1>
        </motion.div>
      </div>

      {/* Wave */}
      <div aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-10 block">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="#3D1B11" />
        </svg>
      </div>

      {/* ── Content ── */}
      <div className="max-w-container mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {orderId ? (
            <motion.div
              key="tracking"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto"
            >
              <TrackingView orderId={orderId} orderType={orderType} onReset={() => setOrderId(null)} />
            </motion.div>
          ) : (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <SearchForm onTrack={setOrderId} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
