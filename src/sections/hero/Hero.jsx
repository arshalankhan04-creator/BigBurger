import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  fadeUp,
  staggerContainer,
  staggerItem,
  floatAnimation,
  viewportOnce,
} from '@/animations/motion'
import heroBurgerLeft from '@/assets/images/hero-burger-left.png'
import heroBurgerRight from '@/assets/images/hero-burger-right.png'

// ── Starburst SVG decoration ─────────────────────────────────────
function Starburst({ className, size = 48, color = '#F3C641' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M24 2L27.5 18.5L42 12L31.5 24L44 34L27.5 29.5L26 46L24 30L22 46L20.5 29.5L4 34L16.5 24L6 12L20.5 18.5L24 2Z"
        fill={color}
      />
    </svg>
  )
}

// ── Sparkle dot decoration ────────────────────────────────────────
function Sparkle({ className, size = 12, color = '#E25222' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6 0L7 5L12 6L7 7L6 12L5 7L0 6L5 5L6 0Z"
        fill={color}
      />
    </svg>
  )
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen bg-warm-cream overflow-hidden
                 flex items-center pt-16"
      aria-label="Hero section"
    >
      {/* ── Background grain texture ── */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
        aria-hidden="true"
      />

      {/* ── Decorative starbursts ── */}
      <motion.div
        animate={floatAnimation}
        className="absolute top-24 left-[8%] hidden lg:block"
        aria-hidden="true"
      >
        <Starburst size={56} color="#F3C641" />
      </motion.div>

      <motion.div
        animate={{ ...floatAnimation, transition: { ...floatAnimation.transition, delay: 1 } }}
        className="absolute top-32 right-[8%] hidden lg:block"
        aria-hidden="true"
      >
        <Starburst size={44} color="#F3C641" />
      </motion.div>

      <motion.div
        animate={{ ...floatAnimation, transition: { ...floatAnimation.transition, delay: 2 } }}
        className="absolute bottom-32 left-[14%] hidden lg:block"
        aria-hidden="true"
      >
        <Sparkle size={16} color="#E25222" />
      </motion.div>

      <motion.div
        animate={{ ...floatAnimation, transition: { ...floatAnimation.transition, delay: 0.5 } }}
        className="absolute bottom-40 right-[14%] hidden lg:block"
        aria-hidden="true"
      >
        <Sparkle size={14} color="#E25222" />
      </motion.div>

      <motion.div
        animate={{ ...floatAnimation, transition: { ...floatAnimation.transition, delay: 1.5 } }}
        className="absolute top-1/2 left-[4%] -translate-y-1/2 hidden xl:block"
        aria-hidden="true"
      >
        <Sparkle size={10} color="#3D1B11" />
      </motion.div>

      {/* ── Main grid ── */}
      <div className="max-w-container mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-8 py-20 lg:py-0 lg:min-h-[calc(100vh-4rem)]">

          {/* ── Left burger image ── */}
          <motion.div
            animate={floatAnimation}
            className="hidden lg:flex justify-end items-center pr-4"
            aria-hidden="true"
          >
            <img
              src={heroBurgerLeft}
              alt=""
              className="w-72 xl:w-80 object-contain drop-shadow-2xl select-none"
              draggable="false"
            />
          </motion.div>

          {/* ── Center content ── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center gap-6 lg:gap-8 z-10"
          >
            {/* Eyebrow */}
            <motion.p variants={staggerItem} className="eyebrow">
              🔥 Flame Grilled Since 1980
            </motion.p>

            {/* H1 */}
            <motion.h1
              variants={staggerItem}
              className="font-display font-black text-espresso
                         text-5xl sm:text-6xl lg:text-display-2xl
                         leading-tight tracking-tight
                         max-w-xs sm:max-w-sm lg:max-w-md"
            >
              Real flame.{' '}
              <span className="text-flame-orange italic">Real flavor.</span>{' '}
              Real good.
            </motion.h1>

            {/* Body copy */}
            <motion.p
              variants={staggerItem}
              className="font-sans text-base lg:text-lg text-muted-taupe
                         max-w-xs sm:max-w-sm leading-relaxed"
            >
              Flame-grilled since 1980. Every patty cooked over real fire,
              every ingredient sourced fresh. This is what a burger should taste like.
            </motion.p>

            {/* CTA */}
            <motion.div variants={staggerItem}>
              <Link
                to="/menu"
                className="btn-primary text-base px-8 py-4"
              >
                Order Now
              </Link>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              variants={staggerItem}
              className="flex items-center gap-8 pt-2"
            >
              {[
                { value: '50+', label: 'Menu Items' },
                { value: '4.9★', label: 'Rating' },
                { value: '10K+', label: 'Happy Customers' },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-0.5">
                  <span className="font-display font-black text-2xl text-espresso leading-none">
                    {stat.value}
                  </span>
                  <span className="font-sans text-xs text-muted-taupe tracking-wide">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right burger image ── */}
          <motion.div
            animate={{
              ...floatAnimation,
              transition: { ...floatAnimation.transition, delay: 2 },
            }}
            className="hidden lg:flex justify-start items-center pl-4"
            aria-hidden="true"
          >
            <img
              src={heroBurgerRight}
              alt=""
              className="w-72 xl:w-80 object-contain drop-shadow-2xl select-none"
              draggable="false"
            />
          </motion.div>

        </div>
      </div>

      {/* ── Mobile burger image (centered below text) ── */}
      <motion.div
        animate={floatAnimation}
        className="lg:hidden absolute bottom-0 left-1/2 -translate-x-1/2 w-64 opacity-20 pointer-events-none"
        aria-hidden="true"
      >
        <img
          src={heroBurgerLeft}
          alt=""
          className="w-full object-contain select-none"
          draggable="false"
        />
      </motion.div>

      {/* ── Wave divider (bottom) ── */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-12 md:h-20"
        >
          <path
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
            fill="#F3EDE2"
          />
        </svg>
      </div>

    </section>
  )
}
