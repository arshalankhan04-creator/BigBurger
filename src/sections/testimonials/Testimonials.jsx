import { useState } from 'react'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem, viewportOnce } from '@/animations/motion'

// ── Testimonials data ─────────────────────────────────────────
const TESTIMONIALS = [
  {
    id: 1,
    name: 'James Spence',
    role: 'Food Blogger',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format',
    rating: 5,
    review: 'Hands down the best burger in Ahmedabad. The flame-grilled patty has this incredible char that you just can\'t get anywhere else. I\'ve been coming here every weekend for 3 years.',
    tag: '🔥 Regular Customer',
  },
  {
    id: 2,
    name: 'Natalie Barry',
    role: 'Food Critic',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format',
    rating: 5,
    review: 'I\'ve reviewed over 200 restaurants and Big Burger consistently delivers. The quality is unmatched — fresh ingredients, perfect seasoning, and the service is always warm.',
    tag: '⭐ Top Reviewer',
  },
  {
    id: 3,
    name: 'Avery Davis',
    role: 'Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&auto=format',
    rating: 5,
    review: 'Our entire office orders from Big Burger every Friday. The Black Beef Burger is absolutely insane — wagyu patty on a charcoal bun? Pure genius. Never disappoints.',
    tag: '🏢 Office Favourite',
  },
  {
    id: 4,
    name: 'Lara Pearson',
    role: 'Nutritionist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&auto=format',
    rating: 5,
    review: 'Even as a nutritionist I can\'t resist Big Burger. The fresh salads are incredible and the grilled chicken burger is actually healthy. Love that they source locally.',
    tag: '🥗 Health Conscious',
  },
  {
    id: 5,
    name: 'Rahul Mehta',
    role: 'Entrepreneur',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format',
    rating: 5,
    review: 'I take all my clients to Big Burger for casual meetings. The ambiance, the food, the service — everything is premium. The Mushroom Swiss Burger is my go-to order.',
    tag: '💼 Business Lunch',
  },
  {
    id: 6,
    name: 'Priya Sharma',
    role: 'College Student',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&auto=format',
    rating: 5,
    review: 'Best value for money in the city! The loaded cheese fries are absolutely addictive. My friends and I come here after every exam. It\'s become our celebration spot.',
    tag: '🎓 Student Favourite',
  },
  {
    id: 7,
    name: 'Vikram Singh',
    role: 'Chef',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format',
    rating: 5,
    review: 'As a professional chef, I appreciate the craft here. The attention to detail — the bun-to-patty ratio, the sauce balance, the freshness — it\'s all spot on. Respect.',
    tag: '👨‍🍳 Chef Approved',
  },
  {
    id: 8,
    name: 'Ananya Gupta',
    role: 'Travel Influencer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&auto=format',
    rating: 5,
    review: 'I\'ve eaten burgers across 15 countries and Big Burger holds its own against the best. The Spicy Jalapeño Burger is genuinely one of the top 5 burgers I\'ve ever had.',
    tag: '✈️ World Traveller',
  },
]

const DOUBLED = [...TESTIMONIALS, ...TESTIMONIALS]

// ── Star rating ───────────────────────────────────────────────
function Stars({ count = 5 }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="13"
          height="13"
          viewBox="0 0 16 16"
          fill={i < count ? '#F3C641' : 'rgba(61,27,17,0.15)'}
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M8 1l1.85 3.75L14 5.5l-3 2.92.71 4.13L8 10.4l-3.71 2.15L5 8.42 2 5.5l4.15-.75L8 1z" />
        </svg>
      ))}
    </div>
  )
}

// ── Single card ───────────────────────────────────────────────
function TestimonialCard({ item }) {
  return (
    <div
      className="relative flex-shrink-0 w-[300px] md:w-[340px] rounded-2xl p-5 flex flex-col gap-3 mx-3 group"
      style={{
        background: '#FFFFFF',
        border: '1.5px solid rgba(61,27,17,0.10)',
        boxShadow: '0 2px 16px rgba(61,27,17,0.07)',
      }}
    >
      {/* Decorative quote mark */}
      <div
        className="absolute top-3 right-4 font-display font-black text-6xl leading-none select-none pointer-events-none"
        style={{ color: 'rgba(226,82,34,0.07)' }}
        aria-hidden="true"
      >
        "
      </div>

      {/* Top row: avatar + name + stars */}
      <div className="flex items-center gap-3">
        <img
          src={item.avatar}
          alt={item.name}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          style={{ border: '2px solid #F3C641' }}
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <p className="font-sans font-bold text-sm leading-tight truncate" style={{ color: '#3D1B11' }}>
            {item.name}
          </p>
          <p className="font-sans text-xs leading-tight" style={{ color: '#756A63' }}>
            {item.role}
          </p>
        </div>
        <Stars count={item.rating} />
      </div>

      {/* Review text */}
      <p className="font-sans text-sm leading-relaxed flex-1" style={{ color: '#3D1B11', opacity: 0.82 }}>
        "{item.review}"
      </p>

      {/* Tag */}
      <span
        className="self-start font-sans font-semibold text-xs px-2.5 py-1 rounded-full"
        style={{ background: 'rgba(243,198,65,0.18)', color: '#3D1B11' }}
      >
        {item.tag}
      </span>
    </div>
  )
}

// ── Marquee row ───────────────────────────────────────────────
function MarqueeRow({ items, direction = 'left', speed = 28 }) {
  const [paused, setPaused] = useState(false)
  const duration = items.length * speed

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex"
        style={{
          animation: `marquee-${direction} ${duration}s linear infinite`,
          animationPlayState: paused ? 'paused' : 'running',
          width: 'max-content',
        }}
      >
        {items.map((item, i) => (
          <TestimonialCard key={`${item.id}-${i}`} item={item} />
        ))}
      </div>
    </div>
  )
}

// ── Main section ──────────────────────────────────────────────
export default function Testimonials() {
  return (
    <section
      id="reviews"
      className="overflow-hidden relative pb-20 md:pb-28"
      style={{ background: '#3D1B11' }}
      aria-label="Customer reviews"
    >
      {/* Marquee CSS */}
      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(226,82,34,0.12) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(243,198,65,0.08) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      {/* Section header */}
      <div className="max-w-container mx-auto px-6 pt-16 pb-10 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex flex-col items-center text-center gap-3"
        >
          <motion.p
            variants={staggerItem}
            className="font-sans font-bold text-xs uppercase tracking-wider"
            style={{ color: '#F3C641' }}
          >
            Real People, Real Reviews
          </motion.p>
          <motion.h2
            variants={staggerItem}
            className="font-display font-black text-display-lg leading-tight"
            style={{ color: '#FBF7F2' }}
          >
            What Our Customers Say
          </motion.h2>
          {/* Decorative mustard rule */}
          <motion.div
            variants={staggerItem}
            className="w-12 h-1 rounded-full mt-1"
            style={{ background: '#F3C641' }}
            aria-hidden="true"
          />
        </motion.div>
      </div>

      {/* Marquee rows */}
      <div className="flex flex-col gap-4 pb-16 relative z-10">
        <MarqueeRow items={DOUBLED} direction="left" speed={20} />
        <MarqueeRow items={[...DOUBLED].reverse()} direction="right" speed={20} />
      </div>

      {/* Left/right fade masks using the dark espresso colour */}
      <div
        className="absolute inset-y-0 left-0 w-20 pointer-events-none z-20"
        style={{ background: 'linear-gradient(to right, #3D1B11, transparent)' }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-y-0 right-0 w-20 pointer-events-none z-20"
        style={{ background: 'linear-gradient(to left, #3D1B11, transparent)' }}
        aria-hidden="true"
      />

      {/* ── Wave divider into About section ── */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-30" aria-hidden="true">
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-12 md:h-20 block"
        >
          <path
            d="M0,40 C360,0 1080,80 1440,20 L1440,80 L0,80 Z"
            fill="#FBF7F2"
          />
        </svg>
      </div>
    </section>
  )
}
