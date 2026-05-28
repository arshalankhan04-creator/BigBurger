import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { staggerContainer, staggerItem, viewportOnce } from '@/animations/motion'
import { categories } from '@/data/categories'

function CategoryCard({ item }) {
  const navigate = useNavigate()

  const handleClick = () => {
    // Navigate to menu page with category pre-selected via URL state
    navigate(`/menu?category=${item.slug}`)
  }

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      className="flex flex-col items-center gap-3 cursor-pointer group"
      role="button"
      tabIndex={0}
      aria-label={`Browse ${item.label}`}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      {/* Card box */}
      <div
        className="w-full aspect-square bg-white rounded-lg
                   border-2 border-espresso
                   overflow-hidden relative
                   transition-colors duration-200"
      >
        <img
          src={item.image}
          alt={item.label}
          className="w-full h-full object-cover
                     transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            e.currentTarget.parentElement.style.backgroundColor = '#F3EDE2'
          }}
        />
        {/* Dark overlay on hover */}
        <div
          className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/20
                     transition-colors duration-300"
          aria-hidden="true"
        />
      </div>

      {/* Label */}
      <span
        className="font-sans font-extrabold text-sm uppercase tracking-wide
                   text-espresso group-hover:text-flame-orange
                   transition-colors duration-200"
      >
        {item.label}
      </span>
    </motion.div>
  )
}

export default function Categories() {
  return (
    <section
      id="categories"
      className="bg-soft-sand py-16 md:py-20"
      aria-label="Menu categories"
    >
      <div className="max-w-container mx-auto px-6">

        {/* ── Section header ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="section-header mb-10"
        >
          <motion.p variants={staggerItem} className="eyebrow">
            Browse by Category
          </motion.p>
          <motion.h2
            variants={staggerItem}
            className="font-display font-black text-espresso
                       text-display-lg leading-tight"
          >
            Our Menu
          </motion.h2>
        </motion.div>

        {/* ── 4-column category grid ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6"
        >
          {categories.map((item) => (
            <CategoryCard key={item.id} item={item} />
          ))}
        </motion.div>

      </div>

      {/* ── Wave divider into Offers section ── */}
      <div className="relative mt-16 md:mt-20 pointer-events-none" aria-hidden="true">
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-12 md:h-20"
        >
          <path
            d="M0,20 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
            fill="#3D1B11"
          />
        </svg>
      </div>
    </section>
  )
}
