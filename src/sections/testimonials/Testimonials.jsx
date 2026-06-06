import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem, viewportOnce } from '@/animations/motion'

// ── Extended testimonials data ────────────────────────────────────
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

// Duplicate for seamless loop
const DOUBLED = [...TESTIMONIALS, ...TESTIMONIALS]

// ── Star rating ───────────────────────────────────────────────────
function Stars({ count = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 16 16"
          fill={i < count ? '#E25222' : 'rgba(61,27,17,0.2)'}
          xmlns="http://www.w3.org/2000/svg">
          <path d="M8 1l1.85 3.75L14 5.5l-3 2.92.71 4.13L8 10.4l-3.71 2.15L5 8.42 2 5.5l4.15-.75L8 1z" />
        </svg>
      ))}
    </div>
  )
}

// ── Single card ───────────────────────────────────────────────────
function TestimonialCard({ item }) {
  return (
    <div
      className="relative flex-shrink-0 w-[320px] md:w-[360px] rounded-2xl p-6 flex flex-col gap-4 mx-3 group"
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        border: '1.5px solid rgba(61,27,17,0.08)',
        boxShadow: '0 4px 24px rgba(61,27,17,0.06)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      {/* Large decorative quote */}
      <div
        className="absolute top-4 right-5 font-display font-black text-7xl leading-none select-none pointer-events-none"
        style={{ color: 'rgba(226,82,34,0.08)' }}
        aria-hidden="true"
      >
        "
      </div>

      {/* Tag */}
      <span
        className="self-start font-sans font-bold text-xs px-2.5 py-1 rounded-full"
        style={{ background: 'rgba(226,82,34,0.1)', color: '#E25222' }}
      >
        {item.tag}
      </span>

      {/* Stars */}
      <Stars count={item.rating} />

      {/* Review text */}
      <p className="font-sans text-sm leading-relaxed flex-1" style={{ color: '#3D1B11' }}>
        "{item.review}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: 'rgba(61,27,17,0.08)' }}>
        <img
          src={item.avatar}
          alt={item.name}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          style={{ border: '2px solid rgba(226,82,34,0.3)' }}
          loading="lazy"
        />
        <div>
          <p className="font-sans font-bold text-sm" style={{ color: '#3D1B11' }}>{item.name}</p>
          <p className="font-sans text-xs" style={{ color: '#756A63' }}>{item.role}</p>
        </div>
        {/* Verified badge */}
        <div className="ml-auto flex-shrink-0">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
            style={{ background: 'rgba(34,197,94,0.15)', color: '#16a34a' }}
            title="Verified customer"
          >
            ✓
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Marquee row ───────────────────────────────────────────────────
function MarqueeRow({ items, direction = 'left', speed = 40 }) {
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

// ── Stats strip ───────────────────────────────────────────────────
function StatsStrip() {
  const stats = [
    { value: '10K+', label: 'Happy Customers', icon: '😊' },
    { value: '4.9★', label: 'Average Rating', icon: '⭐' },
    { value: '98%', label: 'Would Recommend', icon: '👍' },
    { value: '5K+', label: 'Reviews Written', icon: '✍️' },
  ]

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14"
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          variants={staggerItem}
          className="flex flex-col items-center gap-1 py-5 rounded-2xl"
          style={{
            background: 'rgba(255,255,255,0.5)',
            backdropFilter: 'blur(8px)',
            border: '1.5px solid rgba(61,27,17,0.08)',
          }}
        >
          <span className="text-2xl">{stat.icon}</span>
          <span className="font-display font-black text-2xl" style={{ color: '#E25222' }}>
            {stat.value}
          </span>
          <span className="font-sans text-xs text-center" style={{ color: '#756A63' }}>
            {stat.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  )
}

// ── Main section ──────────────────────────────────────────────────
export default function Testimonials() {
  return (
    <section
      id="reviews"
      className="py-16 md:py-24 overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, #FBF7F2 0%, #F3EDE2 50%, #FBF7F2 100%)' }}
      aria-label="Customer reviews"
    >
      {/* Decorative background blobs */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(243,198,65,0.15)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(226,82,34,0.08)' }}
        aria-hidden="true"
      />

      {/* Marquee CSS */}
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      <div className="max-w-container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="section-header mb-12"
        >
          <motion.p variants={staggerItem} className="eyebrow">
            Real People, Real Reviews
          </motion.p>
          <motion.h2
            variants={staggerItem}
            className="font-display font-black text-espresso text-display-lg leading-tight"
          >
            What Our Customers Say
          </motion.h2>
          <motion.p
            variants={staggerItem}
            className="font-sans text-base text-muted-taupe max-w-md leading-relaxed mt-2"
          >
            Over 10,000 happy customers and counting. Here's what they have to say.
          </motion.p>
        </motion.div>

        {/* Stats */}
        <StatsStrip />
      </div>

      {/* Marquee rows — full width, no container constraint */}
      <div className="flex flex-col gap-5">
        <MarqueeRow items={DOUBLED} direction="left" speed={35} />
        <MarqueeRow items={[...DOUBLED].reverse()} direction="right" speed={40} />
      </div>

      {/* Fade edges */}
      <div
        className="absolute inset-y-0 left-0 w-24 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to right, #FBF7F2, transparent)' }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-y-0 right-0 w-24 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to left, #FBF7F2, transparent)' }}
        aria-hidden="true"
      />
    </section>
  )
}
