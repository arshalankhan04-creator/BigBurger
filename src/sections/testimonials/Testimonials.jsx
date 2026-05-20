import { motion } from 'framer-motion'
import { staggerContainer, staggerItem, viewportOnce } from '@/animations/motion'
import { testimonials } from '@/data/products'

// ── Star rating ───────────────────────────────────────────────────
function Stars({ count = 5 }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="#3D1B11"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M8 1l1.85 3.75L14 5.5l-3 2.92.71 4.13L8 10.4l-3.71 2.15L5 8.42 2 5.5l4.15-.75L8 1z" />
        </svg>
      ))}
    </div>
  )
}

// ── Single testimonial card ───────────────────────────────────────
function TestimonialCard({ item }) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-mustard border-2 border-espresso rounded-xl
                 p-6 flex flex-col gap-4 min-h-[220px]"
    >
      {/* Stars */}
      <Stars count={item.rating} />

      {/* Quote */}
      <p className="font-sans text-sm text-espresso leading-relaxed flex-1">
        "{item.review}"
      </p>

      {/* Avatar + name */}
      <div className="flex items-center gap-3 mt-auto">
        <div
          className="w-9 h-9 rounded-full bg-espresso border-2 border-espresso
                     overflow-hidden shrink-0 flex items-center justify-center"
          aria-hidden="true"
        >
          {item.avatar ? (
            <img
              src={item.avatar}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <span className="font-sans font-bold text-sm text-white">
              {item.name.charAt(0)}
            </span>
          )}
        </div>
        <span className="font-sans font-bold text-sm text-espresso">
          {item.name}
        </span>
      </div>
    </motion.div>
  )
}

export default function Testimonials() {
  return (
    <section
      id="reviews"
      className="bg-mustard py-16 md:py-20"
      aria-label="Customer reviews"
    >
      <div className="max-w-container mx-auto px-6">

        {/* ── Section header ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="section-header mb-12"
        >
          <motion.p variants={staggerItem} className="eyebrow text-espresso/60">
            What People Say
          </motion.p>
          <motion.h2
            variants={staggerItem}
            className="font-display font-black text-espresso
                       text-display-lg leading-tight"
          >
            Customer Reviews
          </motion.h2>
        </motion.div>

        {/* ── 4-column testimonial grid ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {testimonials.map((item) => (
            <TestimonialCard key={item.id} item={item} />
          ))}
        </motion.div>

      </div>
    </section>
  )
}
