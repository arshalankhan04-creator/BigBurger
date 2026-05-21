import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Star,
  Flame,
  ShoppingCart,
  Plus,
  Minus,
  Heart,
  Share2,
  ChevronRight,
  Zap,
  Leaf,
  Clock,
} from 'lucide-react'
import { allProducts } from '@/data/products'
import { useCart } from '@/context/CartContext'
import { staggerContainer, staggerItem, fadeUp, scaleIn } from '@/animations/motion'

// ── Nutrition pill ────────────────────────────────────────────────
function NutritionPill({ icon: Icon, label, value, color }) {
  return (
    <div className="flex flex-col items-center gap-1 bg-white rounded-xl px-4 py-3 shadow-sm border border-soft-sand">
      <Icon size={18} className={color} />
      <span className="font-display font-black text-lg text-espresso leading-none">{value}</span>
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

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem, openCart } = useCart()

  const product = allProducts.find((p) => p.id === Number(id))

  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  // Related products — same category, exclude current
  const related = allProducts
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4)

  // Reset qty when product changes
  useEffect(() => {
    setQty(1)
    setAdded(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  // 404 state
  if (!product) {
    return (
      <div className="min-h-screen bg-warm-cream flex flex-col items-center justify-center gap-6 px-6">
        <p className="font-display font-black text-4xl text-espresso">Item not found</p>
        <Link to="/menu" className="btn-primary">Back to Menu</Link>
      </div>
    )
  }

  const handleAddToCart = () => {
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
    burgers: '12–15 min',
    sides:   '8–10 min',
    salads:  '5–7 min',
    drinks:  '3–5 min',
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
      <div className="max-w-container mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── LEFT: Image ── */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="sticky top-24"
          >
            {/* Image card */}
            <div className="relative bg-soft-sand rounded-2xl overflow-hidden aspect-square shadow-xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Badge */}
              {product.badge && (
                <span className="absolute top-4 left-4 bg-flame-orange text-white
                                 font-sans font-bold text-xs px-3 py-1.5 rounded-full
                                 shadow-md">
                  {product.badge}
                </span>
              )}

              {/* Wishlist button */}
              <button
                onClick={() => setWishlisted((w) => !w)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90
                           backdrop-blur-sm flex items-center justify-center shadow-md
                           hover:scale-110 transition-transform"
                aria-label="Add to wishlist"
              >
                <Heart
                  size={18}
                  className={wishlisted ? 'fill-flame-orange text-flame-orange' : 'text-muted-taupe'}
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
              <span className="flex items-center gap-1 text-sm font-sans text-green-600 font-medium">
                <Zap size={14} />
                In stock
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

              <div className="flex items-center gap-4">
                {/* Qty stepper */}
                <div className="flex items-center gap-0 bg-soft-sand rounded-xl overflow-hidden border border-soft-sand">
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
                <span className="font-sans text-muted-taupe text-sm">
                  Total:{' '}
                  <span className="font-bold text-espresso">
                    ₹{(product.price * qty).toFixed(0)}
                  </span>
                </span>
              </div>

              {/* Add to Cart button */}
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
      </div>
    </div>
  )
}
