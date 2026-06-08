import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Star, Flame, ShoppingCart, Plus, Minus,
  Heart, Share2, ChevronRight, Zap, Leaf, Clock, AlertTriangle,
} from 'lucide-react'
import { allProducts } from '@/data/products'
import { supabase } from '@/lib/supabase'
import { useCart } from '@/context/CartContext'
import { useWishlist, setWishlistAuthTrigger } from '@/context/WishlistContext'
import { useAuth } from '@/context/AuthContext'
import AuthModal from '@/components/common/AuthModal'
import { staggerContainer, staggerItem, fadeUp, scaleIn } from '@/animations/motion'
import useRecentlyViewed from '@/hooks/useRecentlyViewed'

// ── Nutrition pill ────────────────────────────────────────────────
function NutritionPill({ icon: Icon, label, value, color }) {
  return (
    <div className="flex flex-col items-center gap-1 bg-white rounded-xl px-4 py-3 shadow-sm border border-soft-sand">
      <Icon size={18} className={color} />
      <span className="font-display font-black text-lg text-espresso leading-none whitespace-nowrap text-center">
        {value}
      </span>
      <span className="font-sans text-xs text-muted-taupe">{label}</span>
    </div>
  )
}

// ── Ingredient tag ────────────────────────────────────────────────
function IngredientTag({ name }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-soft-sand text-espresso
                     font-sans text-sm font-medium px-3 py-1.5 rounded-full
                     border border-soft-sand/80">
      <span className="w-1.5 h-1.5 rounded-full bg-flame-orange flex-shrink-0" />
      {name}
    </span>
  )
}

// ── Reviews Section ───────────────────────────────────────────────
function ReviewsSection({ productId }) {
  const { user } = useAuth()

  const [reviews, setReviews]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [filter, setFilter]       = useState('all')

  // Write review form state
  const [rating, setRating]       = useState(0)
  const [hovered, setHovered]     = useState(0)
  const [text, setText]           = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // ── Fetch reviews from Supabase view ─────────────────────────
  const fetchReviews = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('reviews_with_profiles')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
    setReviews(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchReviews() }, [productId])

  // ── Derived summary ───────────────────────────────────────────
  const total = reviews.length
  const avg   = total > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1)
    : '0.0'
  const dist  = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach((r) => { dist[r.rating] = (dist[r.rating] || 0) + 1 })

  const filtered = filter === 'all'
    ? reviews
    : reviews.filter((r) => r.rating === Number(filter))

  // ── Submit review ─────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating)      { setSubmitError('Please select a star rating.'); return }
    if (!text.trim()) { setSubmitError('Please write something.'); return }

    setSubmitError('')
    setSubmitting(true)

    const { error } = await supabase.from('reviews').insert({
      product_id: productId,
      user_id:    user.id,
      rating,
      text:       text.trim(),
    })

    setSubmitting(false)

    if (error) {
      setSubmitError('Failed to submit review. Please try again.')
      return
    }

    // Reset form and refresh
    setRating(0)
    setText('')
    setSubmitSuccess(true)
    setTimeout(() => setSubmitSuccess(false), 3000)
    fetchReviews()
  }

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      className="mt-16"
    >
      <h2 className="font-display font-black text-2xl text-espresso mb-8">
        Customer Reviews
      </h2>

      {/* ── Write a Review ── */}
      <div className="bg-white rounded-2xl border-2 border-espresso p-6 mb-8">
        {user ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <p className="font-sans font-bold text-sm text-espresso uppercase tracking-wider">
              Write a Review
            </p>

            {/* Star picker */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseEnter={() => setHovered(s)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(s)}
                  aria-label={`Rate ${s} star${s > 1 ? 's' : ''}`}
                >
                  <Star
                    size={28}
                    className={`transition-colors duration-100
                      ${s <= (hovered || rating)
                        ? 'fill-mustard text-mustard'
                        : 'text-espresso/20'}`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 font-sans text-sm text-muted-taupe">
                  {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][rating]}
                </span>
              )}
            </div>

            {/* Text */}
            <textarea
              rows={3}
              placeholder="Share your experience with this item..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-espresso/20
                         font-sans text-sm text-espresso placeholder:text-muted-taupe
                         focus:outline-none focus:border-flame-orange
                         transition-colors duration-150 resize-none"
            />

            {submitError && (
              <p className="font-sans text-xs text-red-500">{submitError}</p>
            )}
            {submitSuccess && (
              <p className="font-sans text-xs text-green-600 font-semibold">
                ✓ Review submitted!
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="self-start btn-primary text-sm gap-2 disabled:opacity-60"
            >
              {submitting
                ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg> Submitting...</>
                : 'Submit Review'
              }
            </button>
          </form>
        ) : (
          /* Not logged in */
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={22} className="text-espresso/15" />
              ))}
            </div>
            <p className="font-sans text-sm text-muted-taupe">
              Sign in to leave a review
            </p>
            <a
              href="/login"
              className="btn-primary text-sm"
            >
              Sign In
            </a>
          </div>
        )}
      </div>

      {/* ── Rating Summary ── */}
      {total > 0 && (
        <div className="bg-white rounded-2xl border-2 border-espresso p-6 mb-8
                        grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col items-center gap-2">
            <span className="font-display font-black text-7xl text-espresso leading-none">
              {avg}
            </span>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={20}
                  className={s <= Math.round(Number(avg))
                    ? 'fill-mustard text-mustard'
                    : 'text-espresso/20'} />
              ))}
            </div>
            <span className="font-sans text-sm text-muted-taupe">
              Based on {total} review{total !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {[5,4,3,2,1].map((star) => {
              const count = dist[star] || 0
              const pct = total > 0 ? (count / total) * 100 : 0
              return (
                <button
                  key={star}
                  onClick={() => setFilter(filter === String(star) ? 'all' : String(star))}
                  className={`flex items-center gap-3 w-full text-left
                    ${filter === String(star) ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
                >
                  <span className="font-sans text-xs text-muted-taupe w-4 shrink-0">{star}</span>
                  <Star size={12} className="fill-mustard text-mustard shrink-0" />
                  <div className="flex-1 h-2 bg-soft-sand rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-mustard rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                  <span className="font-sans text-xs text-muted-taupe w-4 shrink-0">{count}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Filter tabs ── */}
      {total > 0 && (
        <div className="flex items-center gap-2 flex-wrap mb-6">
          {['all', '5', '4', '3', '2', '1'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full font-sans font-semibold text-sm
                          border-2 transition-all duration-150
                          ${filter === f
                            ? 'bg-espresso text-white border-espresso'
                            : 'bg-white text-espresso border-espresso/30 hover:border-espresso'
                          }`}
            >
              {f === 'all' ? 'All' : `${f} ★`}
            </button>
          ))}
        </div>
      )}

      {/* ── Review cards ── */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 rounded-full border-4 border-flame-orange border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-sans text-sm text-muted-taupe py-8 text-center"
              >
                {total === 0
                  ? 'No reviews yet. Be the first to review!'
                  : 'No reviews for this rating.'}
              </motion.p>
            ) : (
              filtered.map((review) => {
                const name   = review.full_name || 'Anonymous'
                const avatar = review.avatar_url
                const date   = new Date(review.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })
                return (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-2xl border-2 border-espresso/10 p-5 flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {avatar ? (
                          <img
                            src={avatar}
                            alt={name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-espresso/10"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-flame-orange/10 border-2
                                          border-flame-orange/20 flex items-center justify-center
                                          font-sans font-black text-sm text-flame-orange">
                            {name[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-sans font-bold text-sm text-espresso">{name}</p>
                          <p className="font-sans text-xs text-muted-taupe">{date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} size={13}
                            className={s <= review.rating
                              ? 'fill-mustard text-mustard'
                              : 'text-espresso/20'} />
                        ))}
                      </div>
                    </div>
                    <p className="font-sans text-sm text-muted-taupe leading-relaxed">
                      "{review.text}"
                    </p>
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.section>
  )
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem, openCart } = useCart()
  const { toggle: toggleWishlist, isWishlisted } = useWishlist()
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Register auth trigger for wishlist context
  useEffect(() => {
    setWishlistAuthTrigger(() => setShowAuthModal(true))
    return () => setWishlistAuthTrigger(null)
  }, [])

  // ── Fetch product from Supabase (static data as instant fallback) ──
  const staticProduct = allProducts.find((p) => p.id === Number(id))
  const [product, setProduct] = useState(staticProduct ?? null)
  const [loadingProduct, setLoadingProduct] = useState(true)

  useEffect(() => {
    setLoadingProduct(true)
    supabase
      .from('products')
      .select('*')
      .eq('id', Number(id))
      .single()
      .then(({ data }) => {
        if (data) setProduct(data)
        setLoadingProduct(false)
      })
  }, [id])

  const outOfStock = product?.stock === 0

  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  // Related products — same category, exclude current (from static data for speed)
  const related = allProducts
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4)

  // Recently viewed
  const recentIds = useRecentlyViewed(product?.id)

  // Reset qty when product changes
  useEffect(() => {
    setQty(1)
    setAdded(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  // 404 state — only after Supabase has responded
  if (!loadingProduct && !product) {
    return (
      <div className="min-h-screen bg-warm-cream flex flex-col items-center justify-center gap-6 px-6">
        <p className="font-display font-black text-4xl text-espresso">Item not found</p>
        <Link to="/menu" className="btn-primary">Back to Menu</Link>
      </div>
    )
  }

  // Loading skeleton — only if no static fallback was found
  if (!product) {
    return (
      <div className="min-h-screen bg-warm-cream flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-flame-orange border-t-transparent animate-spin" />
      </div>
    )
  }

  const handleAddToCart = () => {
    if (outOfStock) return
    for (let i = 0; i < qty; i++) addItem(product)
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      openCart()
    }, 800)
  }

  const ingredients = product.ingredients
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  // Estimated prep time based on category
  const prepTime = {
    burgers:  '12–15 min',
    sides:    '8–10 min',
    salads:   '5–7 min',
    drinks:   '3–5 min',
    desserts: '6–8 min',
  }[product.category] ?? '10–12 min'

  return (
    <div className="min-h-screen bg-warm-cream">

      {/* ── Breadcrumb / Back ── */}
      <div className="max-w-container mx-auto px-6 pt-24 pb-4">
        <nav className="flex items-center gap-2 text-sm text-muted-taupe font-sans">
          <Link to="/" className="hover:text-flame-orange transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/menu" className="hover:text-flame-orange transition-colors">Menu</Link>
          <ChevronRight size={14} />
          <Link
            to={`/menu?category=${product.category}`}
            className="hover:text-flame-orange transition-colors capitalize"
          >
            {product.category}
          </Link>
          <ChevronRight size={14} />
          <span className="text-espresso font-medium truncate max-w-[160px]">{product.name}</span>
        </nav>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-container mx-auto px-6 pb-20 lg:pb-20 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── LEFT: Image ── */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="lg:sticky lg:top-24"
          >
            {/* Image card */}
            <div className="relative bg-soft-sand rounded-2xl overflow-hidden aspect-square shadow-xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Badge — Out of Stock takes priority */}
              {outOfStock ? (
                <span className="absolute top-4 left-4 bg-gray-800 text-white
                                 font-sans font-bold text-xs px-3 py-1.5 rounded-full
                                 shadow-md">
                  Out of Stock
                </span>
              ) : product.badge ? (
                <span className="absolute top-4 left-4 bg-flame-orange text-white
                                 font-sans font-bold text-xs px-3 py-1.5 rounded-full
                                 shadow-md">
                  {product.badge}
                </span>
              ) : null}

              {/* Wishlist button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90
                           backdrop-blur-sm flex items-center justify-center shadow-md
                           hover:scale-110 transition-transform"
                aria-label={isWishlisted(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart
                  size={18}
                  className={isWishlisted(product.id) ? 'fill-flame-orange text-flame-orange' : 'text-muted-taupe'}
                />
              </button>

              {/* Share button */}
              <button
                onClick={() => navigator.share?.({ title: product.name, url: window.location.href })}
                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90
                           backdrop-blur-sm flex items-center justify-center shadow-md
                           hover:scale-110 transition-transform"
                aria-label="Share"
              >
                <Share2 size={16} className="text-muted-taupe" />
              </button>
            </div>

            {/* Nutrition strip */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <NutritionPill icon={Flame}  label="Calories" value={product.calories} color="text-flame-orange" />
              <NutritionPill icon={Clock}  label="Prep Time" value={prepTime}         color="text-mustard" />
              <NutritionPill icon={Leaf}   label="Category"  value={product.category.charAt(0).toUpperCase() + product.category.slice(1)} color="text-green-500" />
            </div>
          </motion.div>

          {/* ── RIGHT: Details ── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6 pt-2"
          >
            {/* Category eyebrow */}
            <motion.p variants={staggerItem} className="eyebrow capitalize">
              🔥 {product.category}
            </motion.p>

            {/* Name */}
            <motion.h1
              variants={staggerItem}
              className="font-display font-black text-espresso
                         text-3xl sm:text-4xl lg:text-display-lg leading-tight"
            >
              {product.name}
            </motion.h1>

            {/* Rating row */}
            <motion.div variants={staggerItem} className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={16} className="fill-mustard text-mustard" />
                ))}
                <span className="font-sans font-bold text-sm text-espresso ml-1">4.8</span>
              </div>
              <span className="text-muted-taupe text-sm font-sans">(240+ reviews)</span>
              <span className={`flex items-center gap-1 text-sm font-sans font-medium
                              ${outOfStock ? 'text-red-500' : 'text-green-600'}`}>
                {outOfStock
                  ? <><AlertTriangle size={14} /> Out of Stock</>
                  : <><Zap size={14} /> In stock</>
                }
              </span>
            </motion.div>

            {/* Price */}
            <motion.div variants={staggerItem} className="flex items-baseline gap-3">
              <span className="font-display font-black text-4xl text-flame-orange">
                ₹{product.price.toFixed(0)}
              </span>
              <span className="font-sans text-sm text-muted-taupe line-through">
                ₹{(product.price * 1.2).toFixed(0)}
              </span>
              <span className="bg-green-100 text-green-700 font-sans font-bold text-xs px-2 py-1 rounded-full">
                17% OFF
              </span>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={staggerItem}
              className="font-sans text-base text-muted-taupe leading-relaxed"
            >
              {product.description}
            </motion.p>

            {/* Divider */}
            <motion.hr variants={staggerItem} className="border-soft-sand" />

            {/* Ingredients */}
            <motion.div variants={staggerItem} className="flex flex-col gap-3">
              <h3 className="font-sans font-bold text-sm text-espresso uppercase tracking-wider">
                Ingredients
              </h3>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ing) => (
                  <IngredientTag key={ing} name={ing} />
                ))}
              </div>
            </motion.div>

            {/* Divider */}
            <motion.hr variants={staggerItem} className="border-soft-sand" />

            {/* Qty + Add to Cart */}
            <motion.div variants={staggerItem} className="flex flex-col gap-4">
              <h3 className="font-sans font-bold text-sm text-espresso uppercase tracking-wider">
                Quantity
              </h3>

              {/* Qty stepper — disabled when out of stock */}
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-0 bg-soft-sand rounded-xl overflow-hidden border border-soft-sand
                                ${outOfStock ? 'opacity-40 pointer-events-none' : ''}`}>
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-11 h-11 flex items-center justify-center
                               hover:bg-espresso/10 transition-colors text-espresso"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-display font-black text-lg text-espresso">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-11 h-11 flex items-center justify-center
                               hover:bg-espresso/10 transition-colors text-espresso"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Total */}
                {!outOfStock && (
                  <span className="font-sans text-muted-taupe text-sm">
                    Total:{' '}
                    <span className="font-bold text-espresso">
                      ₹{(product.price * qty).toFixed(0)}
                    </span>
                  </span>
                )}
              </div>

              {/* Add to Cart button */}
              {outOfStock ? (
                <div className="w-full flex items-center justify-center gap-3 py-4 rounded-xl
                                bg-gray-100 border-2 border-gray-200 text-gray-400
                                font-sans font-bold text-base cursor-not-allowed">
                  <AlertTriangle size={18} />
                  Currently Unavailable
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.button
                    key={added ? 'added' : 'add'}
                    initial={{ scale: 0.97, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.97, opacity: 0.8 }}
                    transition={{ duration: 0.15 }}
                    onClick={handleAddToCart}
                    disabled={added}
                    className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl
                                font-sans font-bold text-base transition-all duration-200
                                ${added
                                  ? 'bg-green-500 text-white cursor-default'
                                  : 'bg-flame-orange hover:bg-flame-dark text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                                }`}
                  >
                    {added ? (
                      <>✓ Added to Cart</>
                    ) : (
                      <>
                        <ShoppingCart size={20} />
                        Add to Cart · ₹{(product.price * qty).toFixed(0)}
                      </>
                    )}
                  </motion.button>
                </AnimatePresence>
              )}

              {/* Back to menu link */}
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center gap-2 text-sm font-sans
                           text-muted-taupe hover:text-espresso transition-colors py-2"
              >
                <ArrowLeft size={15} />
                Back
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '0px 0px -60px 0px' }}
            className="mt-20"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display font-black text-2xl text-espresso">
                You might also like
              </h2>
              <Link
                to={`/menu?category=${product.category}`}
                className="font-sans text-sm font-semibold text-flame-orange
                           hover:text-flame-dark transition-colors flex items-center gap-1"
              >
                View all <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm
                             hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="aspect-square overflow-hidden bg-soft-sand">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <p className="font-sans font-semibold text-sm text-espresso line-clamp-1">
                      {item.name}
                    </p>
                    <p className="font-display font-black text-flame-orange text-base mt-0.5">
                      ₹{item.price.toFixed(0)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* ── Recently Viewed ── */}
        {recentIds.length > 0 && (() => {
          const recentProducts = recentIds
            .map((rid) => allProducts.find((p) => p.id === rid))
            .filter(Boolean)
          if (!recentProducts.length) return null
          return (
            <motion.section
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '0px 0px -60px 0px' }}
              className="mt-16"
            >
              <h2 className="font-display font-black text-2xl text-espresso mb-6">
                Recently Viewed
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recentProducts.map((item) => (
                  <Link
                    key={item.id}
                    to={`/product/${item.id}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm
                               hover:shadow-md transition-all duration-200 hover:-translate-y-1
                               border border-espresso/10"
                  >
                    <div className="aspect-square overflow-hidden bg-soft-sand">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <p className="font-sans font-semibold text-sm text-espresso line-clamp-1">
                        {item.name}
                      </p>
                      <p className="font-display font-black text-flame-orange text-base mt-0.5">
                        ₹{item.price.toFixed(0)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.section>
          )
        })()}
      </div>

      {/* ── Reviews ── */}
      <div className="max-w-container mx-auto px-6 pb-8">
        <ReviewsSection productId={product.id} />
      </div>

      {/* ── Auth Modal ── */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        reason="wishlist"
      />

      {/* ── Mobile Sticky Add to Cart Bar (hidden on lg+) ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[980]
                      bg-white border-t-2 border-espresso/10
                      px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3 max-w-lg mx-auto">

          {outOfStock ? (
            /* Out of stock — full width message */
            <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl
                            bg-gray-100 border-2 border-gray-200 text-gray-400
                            font-sans font-bold text-sm cursor-not-allowed">
              <AlertTriangle size={16} />
              Currently Unavailable
            </div>
          ) : (
            <>
              {/* Qty stepper */}
              <div className="flex items-center bg-soft-sand rounded-xl overflow-hidden border border-soft-sand shrink-0">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center
                             hover:bg-espresso/10 transition-colors text-espresso"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-display font-black text-base text-espresso">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-9 h-9 flex items-center justify-center
                             hover:bg-espresso/10 transition-colors text-espresso"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to Cart button */}
              <AnimatePresence mode="wait">
                <motion.button
                  key={added ? 'added-mob' : 'add-mob'}
                  initial={{ scale: 0.97, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.97, opacity: 0.8 }}
                  transition={{ duration: 0.15 }}
                  onClick={handleAddToCart}
                  disabled={added}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl
                              font-sans font-bold text-sm transition-all duration-200
                              ${added
                                ? 'bg-green-500 text-white cursor-default'
                                : 'bg-flame-orange hover:bg-flame-dark text-white shadow-md'
                              }`}
                >
                  {added ? (
                    <>✓ Added!</>
                  ) : (
                    <>
                      <ShoppingCart size={17} />
                      Add to Cart · ₹{(product.price * qty).toFixed(0)}
                    </>
                  )}
                </motion.button>
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
