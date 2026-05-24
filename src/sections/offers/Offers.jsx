import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { staggerContainer, staggerItem, viewportOnce } from '@/animations/motion'

const offers = [
  {
    id: 1,
    eyebrow: 'Limited Time',
    title: 'Get a 50% Discount On Black Friday',
    description: 'Stack up on your favorites. Every burger, every side — half price for one day only.',
    cta: 'Order Now',
    ctaHref: '/menu',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop&auto=format',
    badge: '50% OFF',
  },
  {
    id: 2,
    eyebrow: 'Free with Every Order',
    title: 'Free Drinks',
    description:
      'Download the Big Burger app and get a free drink with every order. Available on iOS and Android.',
    ctaApp: true,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop&auto=format',
  },
]

function AppStoreBadges() {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Google Play */}
      <a
        href="#"
        aria-label="Get it on Google Play"
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20
                   border border-white/20 rounded-sm px-3 py-2
                   transition-colors duration-200"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
          <path d="M3.18 23.76a2 2 0 0 0 2.07-.22l11.07-6.4-2.97-2.97-10.17 9.59zM.5 1.1A2 2 0 0 0 0 2.5v19a2 2 0 0 0 .5 1.4l.07.07 10.64-10.64v-.25L.57 1.03.5 1.1zM20.32 10.5l-3.07-1.77-3.3 3.3 3.3 3.3 3.09-1.78a2.02 2.02 0 0 0 0-3.05zM5.25.46L16.32 6.86l-2.97 2.97L3.18.24A2 2 0 0 1 5.25.46z"/>
        </svg>
        <div className="flex flex-col leading-none">
          <span className="text-white/60 text-[9px] font-sans">GET IT ON</span>
          <span className="text-white text-xs font-sans font-semibold">Google Play</span>
        </div>
      </a>

      {/* App Store */}
      <a
        href="#"
        aria-label="Download on the App Store"
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20
                   border border-white/20 rounded-sm px-3 py-2
                   transition-colors duration-200"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
        <div className="flex flex-col leading-none">
          <span className="text-white/60 text-[9px] font-sans">DOWNLOAD ON THE</span>
          <span className="text-white text-xs font-sans font-semibold">App Store</span>
        </div>
      </a>
    </div>
  )
}

export default function Offers() {
  return (
    <section
      id="offers"
      className="bg-espresso py-16 md:py-20"
      aria-label="Special offers"
    >
      <div className="max-w-container mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >

          {/* ── Offer Card 1 — Black Friday ── */}
          <motion.div
            variants={staggerItem}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="relative bg-[#2A1009] rounded-xl border-2 border-white/10
                       overflow-hidden flex flex-col justify-between
                       min-h-[220px] p-7"
          >
            {/* Badge */}
            <span
              className="absolute top-5 right-5 bg-flame-orange text-white
                         font-sans font-black text-sm px-3 py-1 rounded-sm
                         tracking-wide"
              aria-label="50% off discount"
            >
              50% OFF
            </span>

            {/* Text content */}
            <div className="flex flex-col gap-3 max-w-[60%]">
              <p className="eyebrow text-mustard">{offers[0].eyebrow}</p>
              <h3
                className="font-display font-black text-white
                           text-2xl md:text-display-md leading-snug"
              >
                {offers[0].title}
              </h3>
              <p className="font-sans text-sm text-white/60 leading-relaxed">
                {offers[0].description}
              </p>
              <Link to={offers[0].ctaHref} className="btn-primary mt-2 self-start text-sm">
                {offers[0].cta}
              </Link>
            </div>

            {/* Food image — absolute right */}
            <div
              className="absolute right-0 bottom-0 w-40 md:w-48 pointer-events-none"
              aria-hidden="true"
            >
              <img
                src={offers[0].image}
                alt=""
                className="w-full object-contain drop-shadow-2xl"
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* ── Offer Card 2 — Free Drinks ── */}
          <motion.div
            variants={staggerItem}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="relative bg-[#2A1009] rounded-xl border-2 border-white/10
                       overflow-hidden flex flex-col justify-between
                       min-h-[220px] p-7"
          >
            {/* Text content */}
            <div className="flex flex-col gap-3 max-w-[60%]">
              <p className="eyebrow text-mustard">{offers[1].eyebrow}</p>
              <h3
                className="font-display font-black text-white
                           text-2xl md:text-display-md leading-snug"
              >
                {offers[1].title}
              </h3>
              <p className="font-sans text-sm text-white/60 leading-relaxed">
                {offers[1].description}
              </p>
              <div className="mt-2">
                <AppStoreBadges />
              </div>
            </div>

            {/* Food image — absolute right */}
            <div
              className="absolute right-0 bottom-0 w-40 md:w-48 pointer-events-none"
              aria-hidden="true"
            >
              <img
                src={offers[1].image}
                alt=""
                className="w-full object-contain drop-shadow-2xl"
                loading="lazy"
              />
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}
