import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShoppingBag, ChevronRight, CheckCircle, Truck, Store, CreditCard, Banknote, Tag, X } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { isRestaurantOpen } from '@/lib/restaurantHours'
import { staggerContainer, staggerItem } from '@/animations/motion'

// ─── Delivery fee tiers ───────────────────────────────────────────
// 0–199 → ₹40 | 200–499 → ₹20 | 500+ → Free
export function getDeliveryFee(subtotal) {
  if (subtotal >= 500) return 0
  if (subtotal >= 200) return 20
  return 40
}

const STEPS = ['Delivery', 'Payment', 'Review']

// ─── Step indicator ───────────────────────────────────────────────
function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center
              font-sans font-bold text-sm transition-colors duration-300
              ${i < current ? 'bg-flame-orange border-flame-orange text-white'
                : i === current ? 'bg-espresso border-espresso text-white'
                : 'bg-white border-espresso/30 text-muted-taupe'}`}>
              {i < current ? <CheckCircle size={14} /> : i + 1}
            </div>
            <span className={`font-sans text-xs font-semibold
              ${i === current ? 'text-espresso' : 'text-muted-taupe'}`}>
              {step}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-16 h-0.5 mb-4 mx-1 transition-colors duration-300
              ${i < current ? 'bg-flame-orange' : 'bg-espresso/20'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Field component ─────────────────────────────────────────────
const inputClass = `w-full px-4 py-3 rounded-sm border-2 border-espresso bg-white
  font-sans text-sm text-espresso placeholder:text-muted-taupe
  focus:outline-none focus:border-flame-orange transition-colors duration-150`

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-sans font-semibold text-sm text-espresso">{label}</label>
      {children}
      {error && <span className="font-sans text-xs text-red-500">{error}</span>}
    </div>
  )
}

// ─── Order summary sidebar ────────────────────────────────────────
function OrderSummary({ items, subtotal, orderType, promo }) {
  const baseDelivery = orderType === 'delivery' ? getDeliveryFee(subtotal) : 0

  let discount = 0
  if (promo) {
    if (promo.type === 'percent') discount = Math.round(subtotal * promo.value / 100)
    else if (promo.type === 'flat' && subtotal >= (promo.minOrder || 0)) discount = promo.value
  }
  const discountedDelivery = promo?.type === 'delivery' ? 0 : baseDelivery
  const total = subtotal - discount + discountedDelivery

  return (
    <div className="bg-white rounded-xl border-2 border-espresso p-6 flex flex-col gap-4 sticky top-24">
      <h3 className="font-display font-black text-display-md text-espresso">Order Summary</h3>
      <div className="flex flex-col gap-3 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-espresso/10 shrink-0 bg-soft-sand">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans font-semibold text-xs text-espresso truncate">{item.name}</p>
              <p className="font-sans text-xs text-muted-taupe">x{item.qty}</p>
            </div>
            <span className="font-sans font-bold text-sm text-espresso shrink-0">
              ₹{(item.price * item.qty).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t-2 border-espresso/10 pt-3 flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="font-sans text-sm text-muted-taupe">Subtotal</span>
          <span className="font-sans font-semibold text-sm text-espresso">₹{subtotal.toFixed(2)}</span>
        </div>

        {/* Delivery with tier info */}
        {orderType === 'delivery' && (
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="font-sans text-sm text-muted-taupe">Delivery</span>
              {subtotal < 500 && (
                <span className="font-sans text-xs text-muted-taupe/70">
                  {subtotal < 200 ? '₹40 · Free above ₹500' : '₹20 · Free above ₹500'}
                </span>
              )}
            </div>
            <span className={`font-sans font-semibold text-sm
              ${promo?.type === 'delivery' || baseDelivery === 0 ? 'text-green-600' : 'text-espresso'}`}>
              {promo?.type === 'delivery' ? 'Free' : baseDelivery === 0 ? '🎉 Free' : `₹${baseDelivery.toFixed(2)}`}
            </span>
          </div>
        )}

        {/* Discount row */}
        {promo && (discount > 0 || promo.type === 'delivery') && (
          <div className="flex justify-between">
            <span className="font-sans text-sm text-green-600 font-semibold">
              Discount ({promo.code})
            </span>
            <span className="font-sans font-semibold text-sm text-green-600">
              {promo.type === 'delivery' ? `-₹${baseDelivery.toFixed(2)}` : `-₹${discount.toFixed(2)}`}
            </span>
          </div>
        )}

        <div className="border-t border-espresso/10 pt-2 flex justify-between">
          <span className="font-sans font-bold text-base text-espresso">Total</span>
          <span className="font-sans font-black text-xl text-flame-orange">₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Step 1: Delivery info ────────────────────────────────────────
function DeliveryStep({ data, setData, errors, onNext, promo, setPromo, subtotal, user }) {
  const [promoInput, setPromoInput]     = useState('')
  const [promoError, setPromoError]     = useState('')
  const [promoLoading, setPromoLoading] = useState(false)

  const handleApplyPromo = async () => {
    const code = promoInput.trim().toUpperCase()
    if (!code) { setPromoError('Enter a promo code'); return }

    setPromoLoading(true)
    setPromoError('')

    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .single()

    setPromoLoading(false)

    if (error || !coupon) {
      setPromoError('Invalid or inactive promo code.')
      setPromo(null)
      return
    }

    // Check expiry
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      setPromoError('This promo code has expired.')
      setPromo(null)
      return
    }

    // Check global usage limit
    if (coupon.used_count >= coupon.usage_limit) {
      setPromoError('This promo code has reached its usage limit.')
      setPromo(null)
      return
    }

    // Check minimum order amount
    if (subtotal < coupon.min_order) {
      setPromoError(`Minimum order of ₹${coupon.min_order.toFixed(0)} required for this code.`)
      setPromo(null)
      return
    }

    // Check one-time use per user
    if (user) {
      const { data: usageRow } = await supabase
        .from('coupon_uses')
        .select('id')
        .eq('coupon_id', coupon.id)
        .eq('user_id', user.id)
        .maybeSingle()

      if (usageRow) {
        setPromoError('You have already used this promo code.')
        setPromo(null)
        return
      }
    }

    setPromo({
      id:       coupon.id,
      code:     coupon.code,
      type:     coupon.type,
      value:    coupon.value,
      label:    coupon.label,
      minOrder: coupon.min_order,
    })
    setPromoError('')
  }

  const handleRemovePromo = () => {
    setPromo(null)
    setPromoInput('')
    setPromoError('')
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-6">
      <motion.div variants={staggerItem}>
        <h2 className="font-display font-black text-display-lg text-espresso">Delivery Details</h2>
        <p className="font-sans text-sm text-muted-taupe mt-1">Where should we bring your order?</p>
      </motion.div>

      {/* Order type toggle */}
      <motion.div variants={staggerItem} className="grid grid-cols-2 gap-3">
        {[
          { id: 'delivery', label: 'Delivery', icon: Truck },
          { id: 'pickup',   label: 'Pickup',   icon: Store },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setData((d) => ({ ...d, orderType: id }))}
            className={`flex items-center justify-center gap-2 py-3 rounded-sm border-2
              font-sans font-semibold text-sm transition-all duration-150
              ${data.orderType === id
                ? 'bg-espresso border-espresso text-white'
                : 'bg-white border-espresso text-espresso hover:bg-soft-sand'}`}>
            <Icon size={16} />
            {label}
          </button>
        ))}
      </motion.div>

      <motion.div variants={staggerItem} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="First Name *" error={errors.firstName}>
          <input type="text" placeholder="Ahmed" value={data.firstName}
            onChange={(e) => setData((d) => ({ ...d, firstName: e.target.value }))}
            className={`${inputClass} ${errors.firstName ? 'border-red-400' : ''}`} />
        </Field>
        <Field label="Last Name *" error={errors.lastName}>
          <input type="text" placeholder="Khan" value={data.lastName}
            onChange={(e) => setData((d) => ({ ...d, lastName: e.target.value }))}
            className={`${inputClass} ${errors.lastName ? 'border-red-400' : ''}`} />
        </Field>
      </motion.div>

      <motion.div variants={staggerItem} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Phone *" error={errors.phone}>
          <input type="tel" placeholder="+91 98765 43210" value={data.phone}
            onChange={(e) => setData((d) => ({ ...d, phone: e.target.value }))}
            className={`${inputClass} ${errors.phone ? 'border-red-400' : ''}`} />
        </Field>
        <Field label="Email *" error={errors.email}>
          <input type="email" placeholder="ahmed@example.com" value={data.email}
            onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
            className={`${inputClass} ${errors.email ? 'border-red-400' : ''}`} />
        </Field>
      </motion.div>

      {data.orderType === 'delivery' && (
        <motion.div variants={staggerItem} className="flex flex-col gap-4">
          <Field label="Street Address *" error={errors.address}>
            <input type="text" placeholder="123 Main Street" value={data.address}
              onChange={(e) => setData((d) => ({ ...d, address: e.target.value }))}
              className={`${inputClass} ${errors.address ? 'border-red-400' : ''}`} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="City *" error={errors.city}>
              <input type="text" placeholder="Ahmedabad" value={data.city}
                onChange={(e) => setData((d) => ({ ...d, city: e.target.value }))}
                className={`${inputClass} ${errors.city ? 'border-red-400' : ''}`} />
            </Field>
            <Field label="Pincode *" error={errors.pincode}>
              <input type="text" placeholder="380001" value={data.pincode}
                onChange={(e) => setData((d) => ({ ...d, pincode: e.target.value }))}
                className={`${inputClass} ${errors.pincode ? 'border-red-400' : ''}`} />
            </Field>
          </div>
        </motion.div>
      )}

      <motion.div variants={staggerItem}>
        <Field label="Special Instructions (optional)" error={null}>
          <textarea placeholder="Extra sauce, no onions..." rows={3} value={data.notes}
            onChange={(e) => setData((d) => ({ ...d, notes: e.target.value }))}
            className={`${inputClass} resize-none`} />
        </Field>
      </motion.div>

      {/* ── Promo Code ── */}
      <motion.div variants={staggerItem} className="flex flex-col gap-2">
        <label className="font-sans font-semibold text-sm text-espresso flex items-center gap-1.5">
          <Tag size={14} className="text-flame-orange" />
          Promo Code
        </label>
        {promo ? (
          <div className="flex items-center gap-3 bg-green-50 border-2 border-green-500 rounded-sm px-4 py-3">
            <CheckCircle size={16} className="text-green-600 shrink-0" />
            <div className="flex-1">
              <p className="font-sans font-bold text-sm text-green-700">{promo.code}</p>
              <p className="font-sans text-xs text-green-600">{promo.label}</p>
            </div>
            <button onClick={handleRemovePromo} className="text-green-600 hover:text-red-500 transition-colors">
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={promoInput}
              onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError('') }}
              placeholder="Enter promo code"
              className={`${inputClass} flex-1 ${promoError ? 'border-red-400' : ''}`}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
            />
            <button
              onClick={handleApplyPromo}
              disabled={promoLoading}
              className="btn-primary px-5 shrink-0 text-sm disabled:opacity-60 flex items-center gap-2"
            >
              {promoLoading
                ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                : 'Apply'
              }
            </button>
          </div>
        )}
        {promoError && <p className="font-sans text-xs text-red-500">{promoError}</p>}
        {!promo && (
          <p className="font-sans text-xs text-muted-taupe">
            Have a deal code? Check our <a href="/deals" className="text-flame-orange hover:underline">Deals page</a>
          </p>
        )}
      </motion.div>

      <motion.button variants={staggerItem} onClick={onNext} className="btn-primary self-start gap-2">
        Continue to Payment <ChevronRight size={16} />
      </motion.button>
    </motion.div>
  )
}

// ─── Step 2: Payment ─────────────────────────────────────────────
function PaymentStep({ data, setData, onNext, onBack, orderType }) {
  const paymentOptions = orderType === 'pickup'
    ? [
        { id: 'card',    label: 'Credit / Debit Card', icon: CreditCard },
        { id: 'counter', label: 'Pay at Counter',       icon: Banknote   },
      ]
    : [
        { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
        { id: 'cash', label: 'Cash on Delivery',    icon: Banknote   },
      ]

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-6">
      <motion.div variants={staggerItem}>
        <h2 className="font-display font-black text-display-lg text-espresso">Payment Method</h2>
        <p className="font-sans text-sm text-muted-taupe mt-1">
          {orderType === 'pickup' ? "Choose how you'd like to pay when you pick up." : "Choose how you'd like to pay."}
        </p>
      </motion.div>

      <motion.div variants={staggerItem} className="flex flex-col gap-3">
        {paymentOptions.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setData((d) => ({ ...d, paymentMethod: id }))}
            className={`flex items-center gap-4 p-4 rounded-sm border-2 text-left transition-all duration-150
              ${data.paymentMethod === id
                ? 'border-flame-orange bg-flame-orange/5'
                : 'border-espresso bg-white hover:bg-soft-sand'}`}>
            <div className={`w-10 h-10 rounded-sm flex items-center justify-center
              ${data.paymentMethod === id ? 'bg-flame-orange text-white' : 'bg-soft-sand text-espresso'}`}>
              <Icon size={18} />
            </div>
            <span className="font-sans font-semibold text-sm text-espresso">{label}</span>
            <div className={`ml-auto w-4 h-4 rounded-full border-2 flex items-center justify-center
              ${data.paymentMethod === id ? 'border-flame-orange' : 'border-espresso/30'}`}>
              {data.paymentMethod === id && <div className="w-2 h-2 rounded-full bg-flame-orange" />}
            </div>
          </button>
        ))}
      </motion.div>

      {data.paymentMethod === 'card' && (
        <motion.div variants={staggerItem} className="flex flex-col gap-4 p-5 bg-soft-sand rounded-sm border-2 border-espresso/20">
          <Field label="Card Number" error={null}>
            <input type="text" placeholder="1234 5678 9012 3456" maxLength={19} className={inputClass} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Expiry" error={null}>
              <input type="text" placeholder="MM / YY" maxLength={7} className={inputClass} />
            </Field>
            <Field label="CVV" error={null}>
              <input type="text" placeholder="123" maxLength={4} className={inputClass} />
            </Field>
          </div>
          <Field label="Name on Card" error={null}>
            <input type="text" placeholder="Arsalaan Khan" className={inputClass} />
          </Field>
        </motion.div>
      )}

      <motion.div variants={staggerItem} className="flex gap-3">
        <button onClick={onBack} className="btn-outline gap-2">Back</button>
        <button onClick={onNext} className="btn-primary gap-2">
          Review Order <ChevronRight size={16} />
        </button>
      </motion.div>
    </motion.div>
  )
}

// ─── Step 3: Review & confirm ─────────────────────────────────────
function ReviewStep({ delivery, payment, items, subtotal, onBack, onConfirm, loading, orderError }) {
  const deliveryFee = delivery.orderType === 'delivery' ? getDeliveryFee(subtotal) : 0
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-6">
      <motion.div variants={staggerItem}>
        <h2 className="font-display font-black text-display-lg text-espresso">Review Your Order</h2>
        <p className="font-sans text-sm text-muted-taupe mt-1">Everything look good?</p>
      </motion.div>

      {/* Delivery summary */}
      <motion.div variants={staggerItem} className="bg-white rounded-sm border-2 border-espresso p-5 flex flex-col gap-2">
        <p className="eyebrow mb-1">Delivery Info</p>
        <p className="font-sans text-sm text-espresso font-semibold">{delivery.firstName} {delivery.lastName}</p>
        <p className="font-sans text-sm text-muted-taupe">{delivery.phone} · {delivery.email}</p>
        {delivery.orderType === 'delivery' && (
          <p className="font-sans text-sm text-muted-taupe">
            {delivery.address}, {delivery.city} — {delivery.pincode}
          </p>
        )}
        {delivery.orderType === 'pickup' && (
          <p className="font-sans text-sm text-muted-taupe">Pickup from store</p>
        )}
        {delivery.notes && (
          <p className="font-sans text-xs text-muted-taupe italic">Note: {delivery.notes}</p>
        )}
      </motion.div>

      {/* Payment summary */}
      <motion.div variants={staggerItem} className="bg-white rounded-sm border-2 border-espresso p-5">
        <p className="eyebrow mb-2">Payment</p>
        <p className="font-sans text-sm text-espresso font-semibold capitalize">
          {payment.paymentMethod === 'card'
            ? 'Credit / Debit Card'
            : delivery.orderType === 'pickup' ? 'Pay at Counter' : 'Cash on Delivery'}
        </p>
      </motion.div>

      {/* Total */}
      <motion.div variants={staggerItem} className="bg-mustard rounded-sm border-2 border-espresso p-5 flex justify-between items-center">
        <span className="font-sans font-bold text-base text-espresso">Total to Pay</span>
        <span className="font-display font-black text-display-md text-espresso">
          ₹{(subtotal + deliveryFee).toFixed(2)}
        </span>
      </motion.div>

      {/* Order error — stock / closed */}
      {orderError && (
        <motion.div variants={staggerItem}
          className="flex items-start gap-3 bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3">
          <span className="text-red-500 text-lg shrink-0">⚠️</span>
          <p className="font-sans text-sm text-red-700 leading-relaxed">{orderError}</p>
        </motion.div>
      )}

      <motion.div variants={staggerItem} className="flex gap-3">
        <button onClick={onBack} className="btn-outline gap-2">Back</button>
        <button onClick={onConfirm} disabled={loading}
          className="btn-primary flex-1 justify-center gap-2 disabled:opacity-60">
          {loading ? (
            <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg> Placing Order...</>
          ) : 'Place Order 🍔'}
        </button>
      </motion.div>
    </motion.div>
  )
}

// ─── Success screen ───────────────────────────────────────────────
function SuccessScreen({ name, orderId, orderType }) {
  const isPickup = orderType === 'pickup'
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center gap-6 py-16">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}>
        <div className="w-24 h-24 rounded-full bg-flame-orange/10 border-2 border-flame-orange flex items-center justify-center">
          <CheckCircle size={48} className="text-flame-orange" strokeWidth={1.5} />
        </div>
      </motion.div>
      <div className="flex flex-col gap-2">
        <h2 className="font-display font-black text-display-lg text-espresso">Order Placed!</h2>
        <p className="font-sans text-base text-muted-taupe max-w-sm leading-relaxed">
          Thanks {name}! Your order is confirmed. We'll start preparing it right away. 🔥
        </p>
      </div>
      <div className="bg-espresso rounded-xl px-6 py-4 flex flex-col items-center gap-1">
        <p className="font-sans text-xs text-white/50 uppercase tracking-wider">Your Order ID</p>
        <p className="font-display font-black text-white text-2xl tracking-widest">{orderId}</p>
        <p className="font-sans text-xs text-white/40 mt-1">Keep this as your order reference</p>
      </div>
      <div className="bg-soft-sand rounded-sm border-2 border-espresso/20 px-6 py-4">
        <p className="font-sans text-sm text-muted-taupe">Estimated time</p>
        <p className="font-display font-black text-display-md text-espresso">
          {isPickup ? '15–20 min' : '25–35 min'}
        </p>
      </div>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link to="/" className="btn-primary">Back to Home</Link>
        <Link to="/menu" className="btn-outline">Order More</Link>
      </div>
    </motion.div>
  )
}

// ─── Main page ────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const [step, setStep]               = useState(0)
  const [loading, setLoading]         = useState(false)
  const [success, setSuccess]         = useState(false)
  const [orderId, setOrderId]         = useState('')
  const [delivery, setDelivery]       = useState({
    orderType: 'delivery', firstName: '', lastName: '',
    phone: '', email: '', address: '', city: 'Ahmedabad', pincode: '', notes: '',
  })
  const [payment, setPayment]         = useState({ paymentMethod: 'cash' })
  const [errors, setErrors]           = useState({})
  const [promo, setPromo]             = useState(null)
  const [orderError, setOrderError]   = useState('')

  // Redirect to menu if cart is empty
  if (items.length === 0 && !success) {
    return (
      <div className="min-h-screen bg-warm-cream pt-16 flex items-center justify-center px-6">
        <div className="flex flex-col items-center gap-5 text-center">
          <ShoppingBag size={56} className="text-espresso/20" strokeWidth={1} />
          <h2 className="font-display font-black text-display-lg text-espresso">Your cart is empty</h2>
          <p className="font-sans text-sm text-muted-taupe">Add some items before checking out.</p>
          <Link to="/menu" className="btn-primary">Browse Menu</Link>
        </div>
      </div>
    )
  }

  const validateDelivery = () => {
    const e = {}
    if (!delivery.firstName.trim()) e.firstName = 'Required'
    if (!delivery.lastName.trim())  e.lastName  = 'Required'
    if (!delivery.phone.trim())     e.phone     = 'Required'
    if (!delivery.email.trim())     e.email     = 'Required'
    if (delivery.orderType === 'delivery') {
      if (!delivery.address.trim()) e.address = 'Required'
      if (!delivery.city.trim())    e.city    = 'Required'
      if (!delivery.pincode.trim()) e.pincode = 'Required'
    }
    return e
  }

  const handleDeliveryNext = () => {
    const e = validateDelivery()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    setStep(1)
  }

  const handleConfirm = async () => {
    if (!isRestaurantOpen()) {
      setOrderError('Sorry, we are currently closed. We are open 10 AM – 11 PM IST.')
      return
    }

    setOrderError('')
    setLoading(true)
    const deliveryFee = delivery.orderType === 'delivery' ? getDeliveryFee(subtotal) : 0
    const total = subtotal + deliveryFee

    try {
      // ── Step 1: Check stock for all items ──────────────────────
      const stockChecks = await Promise.all(
        items.map((item) =>
          supabase.from('products').select('id, name, stock').eq('id', item.id).single()
        )
      )
      const unavailable = stockChecks
        .filter(({ data }) => data && data.stock < 1)
        .map(({ data }) => data.name)

      if (unavailable.length > 0) {
        setOrderError(
          `Sorry, the following item${unavailable.length > 1 ? 's are' : ' is'} out of stock: ${unavailable.join(', ')}. Please remove ${unavailable.length > 1 ? 'them' : 'it'} from your cart.`
        )
        setLoading(false)
        return
      }

      // ── Step 2: Save order ─────────────────────────────────────
      if (user) {
        const { data: order, error: orderErr } = await supabase
          .from('orders')
          .insert({
            user_id:     user.id,
            status:      'placed',
            order_type:  delivery.orderType,
            total,
            coupon_code: promo?.code ?? null,
            discount:    promo
              ? promo.type === 'percent'
                ? Math.round(subtotal * promo.value / 100)
                : promo.type === 'flat' ? promo.value : 0
              : 0,
          })
          .select()
          .single()

        if (orderErr) throw orderErr

        const { error: itemsErr } = await supabase
          .from('order_items')
          .insert(items.map((i) => ({
            order_id:   order.id,
            product_id: i.id,
            name:       i.name,
            price:      i.price,
            qty:        i.qty,
            image:      i.image,
          })))

        if (itemsErr) throw itemsErr

        // ── Step 3: Decrement stock atomically ──────────────────
        for (const item of items) {
          const { error: stockErr } = await supabase
            .rpc('decrement_stock', { p_product_id: item.id, p_qty: item.qty })
          if (stockErr) {
            if (stockErr.message?.includes('OUT_OF_STOCK:')) {
              throw new Error(`OUT_OF_STOCK:${stockErr.message.split('OUT_OF_STOCK:')[1]}`)
            }
            throw stockErr
          }
        }

        // ── Step 4: Record coupon use + increment used_count ───
        if (promo) {
          await supabase.from('coupon_uses').insert({
            coupon_id: promo.id,
            user_id:   user.id,
            order_id:  order.id,
          })
          // Increment used_count using rpc to avoid race condition
          await supabase.rpc('increment_coupon_used_count', { p_coupon_id: promo.id })
        }

        setOrderId(order.id.slice(0, 8).toUpperCase())

      } else {
        // Guest fallback — localStorage
        const newOrderId = 'BB' + Math.random().toString(36).substring(2, 8).toUpperCase()
        const existing = JSON.parse(localStorage.getItem('bigburger_orders') || '[]')
        localStorage.setItem('bigburger_orders', JSON.stringify([
          {
            id: newOrderId,
            date: new Date().toISOString(),
            orderType: delivery.orderType,
            items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, image: i.image })),
            subtotal,
            total,
            status: 'placed',
            customerName: `${delivery.firstName} ${delivery.lastName}`,
          },
          ...existing,
        ].slice(0, 20)))
        setOrderId(newOrderId)
      }

      clearCart()
      setSuccess(true)

    } catch (err) {
      if (err.message?.includes('OUT_OF_STOCK:')) {
        const name = err.message.split('OUT_OF_STOCK:')[1]
        setOrderError(`"${name}" just went out of stock. Please remove it from your cart.`)
      } else {
        setOrderError('Something went wrong placing your order. Please try again.')
        console.error('Order failed:', err)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-warm-cream pt-16">
      <div className="bg-espresso py-12">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible"
          className="max-w-container mx-auto px-6 flex flex-col items-center text-center gap-3">
          <motion.p variants={staggerItem} className="eyebrow text-mustard/80">Almost There</motion.p>
          <motion.h1 variants={staggerItem}
            className="font-display font-black text-white text-display-xl leading-tight">
            Checkout
          </motion.h1>
        </motion.div>
      </div>

      <div aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-10 block">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="#3D1B11" />
        </svg>
      </div>

      <div className="max-w-container mx-auto px-6 py-10">
        {success ? (
          <SuccessScreen name={delivery.firstName} orderId={orderId} orderType={delivery.orderType} />
        ) : (
          <>
            <StepIndicator current={step} />
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
              <div className="bg-white rounded-xl border-2 border-espresso p-7 md:p-10">
                <AnimatePresence mode="wait">
                  {step === 0 && (
                    <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                      <DeliveryStep
                        data={delivery} setData={setDelivery} errors={errors}
                        onNext={handleDeliveryNext} promo={promo} setPromo={setPromo}
                        subtotal={subtotal} user={user}
                      />
                    </motion.div>
                  )}
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                      <PaymentStep data={payment} setData={setPayment} onNext={() => setStep(2)} onBack={() => setStep(0)} orderType={delivery.orderType} />
                    </motion.div>
                  )}
                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                      <ReviewStep delivery={delivery} payment={payment} items={items} subtotal={subtotal} onBack={() => setStep(1)} onConfirm={handleConfirm} loading={loading} orderError={orderError} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <OrderSummary items={items} subtotal={subtotal} orderType={delivery.orderType} promo={promo} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
