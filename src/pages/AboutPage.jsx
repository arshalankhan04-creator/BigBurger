import { motion } from 'framer-motion'
import { staggerContainer, staggerItem, fadeUp, viewportOnce } from '@/animations/motion'
import { Flame, Leaf, Heart, Award, Users, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

// ─── Data ─────────────────────────────────────────────────────────

const stats = [
  { value: '45+',  label: 'Years of Craft',    icon: Clock },
  { value: '50+',  label: 'Menu Items',         icon: Flame },
  { value: '12',   label: 'Locations',          icon: Users },
  { value: '4.9★', label: 'Average Rating',     icon: Award },
]

const timeline = [
  {
    year: '1980',
    title: 'The Beginning',
    description:
      'Big Burger was born in a small kitchen in Ahmedabad with one simple belief — real flame makes real flavor. Our founder Arsalaan Khan opened the first location with just 5 items on the menu.',
  },
  {
    year: '1995',
    title: 'First Expansion',
    description:
      'After 15 years of loyal customers and word-of-mouth love, we opened our second location. The signature Black Beef Burger was introduced and became an instant classic.',
  },
  {
    year: '2005',
    title: 'Going Craft',
    description:
      'We made the decision to source only locally-grown produce and premium beef. Quality over quantity — a commitment that defines us to this day.',
  },
  {
    year: '2015',
    title: 'Digital Era',
    description:
      'Launched online ordering and our loyalty program. 10,000 customers joined in the first month. The brand went from neighborhood staple to city-wide institution.',
  },
  {
    year: '2024',
    title: 'Today',
    description:
      'With 12 locations, a full craft menu, and a community of passionate food lovers — we\'re still cooking with the same flame we started with in 1980.',
  },
]

const team = [
  {
    name: 'Arsalaan Khan',
    role: 'Founder & Head Chef',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format',
    bio: 'Started Big Burger at 28 with a cast iron grill and a dream.',
  },
  {
    name: 'Sara Malik',
    role: 'Creative Director',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&auto=format',
    bio: 'Designs every menu, every space, every experience.',
  },
  {
    name: 'Zain Raza',
    role: 'Head of Operations',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&auto=format',
    bio: 'Keeps 12 locations running like a well-oiled machine.',
  },
  {
    name: 'Nadia Hussain',
    role: 'Culinary Innovation',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&auto=format',
    bio: 'The mind behind every new item that hits the menu.',
  },
]

const values = [
  {
    icon: Flame,
    title: 'Flame First',
    description:
      'Every patty is cooked over real flame. No shortcuts, no shortcuts, no shortcuts. The char is the flavor.',
  },
  {
    icon: Leaf,
    title: 'Fresh Always',
    description:
      'We source locally and seasonally. If it\'s not fresh, it\'s not on the menu. Simple as that.',
  },
  {
    icon: Heart,
    title: 'Community Driven',
    description:
      'We\'re not a chain. We\'re a neighborhood institution. Every location is part of its community.',
  },
]

// ─── Sub-components ───────────────────────────────────────────────

function StatCard({ stat }) {
  const Icon = stat.icon
  return (
    <motion.div
      variants={staggerItem}
      className="flex flex-col items-center gap-3 text-center"
    >
      <div className="w-12 h-12 rounded-lg bg-flame-orange/15 border-2 border-flame-orange/20
                      flex items-center justify-center">
        <Icon size={20} className="text-flame-orange" />
      </div>
      <span className="font-display font-black text-display-lg text-espresso leading-none">
        {stat.value}
      </span>
      <span className="font-sans text-sm text-muted-taupe">{stat.label}</span>
    </motion.div>
  )
}

function TimelineItem({ item, index }) {
  const isEven = index % 2 === 0
  return (
    <motion.div
      variants={staggerItem}
      className={`flex flex-col md:flex-row items-start md:items-center gap-6
                  ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      {/* Text */}
      <div className={`flex-1 ${isEven ? 'md:text-right' : 'md:text-left'}`}>
        <p className="eyebrow mb-1">{item.year}</p>
        <h3 className="font-display font-black text-display-md text-espresso mb-2">
          {item.title}
        </h3>
        <p className="font-sans text-sm text-muted-taupe leading-relaxed max-w-sm
                      ${isEven ? 'md:ml-auto' : ''}">
          {item.description}
        </p>
      </div>

      {/* Center dot */}
      <div className="flex flex-col items-center shrink-0">
        <div className="w-5 h-5 rounded-full bg-flame-orange border-4 border-warm-cream
                        ring-2 ring-flame-orange" />
      </div>

      {/* Spacer */}
      <div className="flex-1 hidden md:block" />
    </motion.div>
  )
}

function TeamCard({ member }) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="flex flex-col items-center text-center gap-4 group"
    >
      <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-espresso
                      transition-transform duration-300 group-hover:scale-105">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-sans font-extrabold text-base text-espresso">
          {member.name}
        </h3>
        <p className="eyebrow text-xs">{member.role}</p>
        <p className="font-sans text-sm text-muted-taupe leading-relaxed max-w-[180px]">
          {member.bio}
        </p>
      </div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-warm-cream pt-16">

      {/* ── Page hero ── */}
      <div className="bg-espresso py-16 md:py-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-container mx-auto px-6 flex flex-col items-center text-center gap-4"
        >
          <motion.p variants={staggerItem} className="eyebrow text-mustard/80">
            Our Story
          </motion.p>
          <motion.h1
            variants={staggerItem}
            className="font-display font-black text-white text-display-xl leading-tight"
          >
            Craft Quality Since 1980
          </motion.h1>
          <motion.p
            variants={staggerItem}
            className="font-sans text-base text-white/60 max-w-md leading-relaxed"
          >
            We didn't set out to build a burger chain. We set out to make the best
            burger you've ever had. Everything else followed.
          </motion.p>
        </motion.div>
      </div>

      {/* Wave */}
      <div aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-10 md:h-14 block">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="#3D1B11" />
        </svg>
      </div>

      {/* ── Brand story ── */}
      <section className="py-16 md:py-20" aria-label="Brand story">
        <div className="max-w-container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Image */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="relative rounded-xl overflow-hidden border-2 border-espresso aspect-[4/3]"
            >
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&auto=format"
                alt="Our kitchen"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Year badge */}
              <div className="absolute bottom-5 left-5 bg-espresso text-white
                              font-display font-black text-2xl px-4 py-2 rounded-sm">
                Est. 1980
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="flex flex-col gap-6"
            >
              <motion.p variants={staggerItem} className="eyebrow">Who We Are</motion.p>
              <motion.h2
                variants={staggerItem}
                className="font-display font-black text-espresso text-display-lg leading-tight"
              >
                We Maintain Craft Quality Since 1980
              </motion.h2>
              <motion.p variants={staggerItem}
                className="font-sans text-base text-muted-taupe leading-relaxed">
                Big Burger started as a single flame grill in a small downtown kitchen.
                Our founder believed that great food doesn't need gimmicks — just quality
                ingredients, real fire, and genuine care.
              </motion.p>
              <motion.p variants={staggerItem}
                className="font-sans text-base text-muted-taupe leading-relaxed">
                Over 45 years later, that belief hasn't changed. Every patty is still
                flame-grilled. Every ingredient is still sourced fresh. Every customer
                still matters.
              </motion.p>
              <motion.div variants={staggerItem}>
                <Link to="/menu" className="btn-primary self-start">
                  Explore Our Menu
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="bg-soft-sand py-16 border-y-2 border-espresso/10" aria-label="Our numbers">
        <div className="max-w-container mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-2 md:grid-cols-4 gap-10"
          >
            {stats.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-16 md:py-20 bg-warm-cream" aria-label="Our history">
        <div className="max-w-container mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="section-header mb-14"
          >
            <motion.p variants={staggerItem} className="eyebrow">Our Journey</motion.p>
            <motion.h2
              variants={staggerItem}
              className="font-display font-black text-espresso text-display-lg leading-tight"
            >
              45 Years of Flavor
            </motion.h2>
          </motion.div>

          {/* Timeline line + items */}
          <div className="relative">
            {/* Vertical line — desktop only */}
            <div
              className="hidden md:block absolute left-1/2 top-0 bottom-0
                         w-0.5 bg-espresso/15 -translate-x-1/2"
              aria-hidden="true"
            />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="flex flex-col gap-12"
            >
              {timeline.map((item, i) => (
                <TimelineItem key={item.year} item={item} index={i} />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="bg-soft-sand py-16 md:py-20" aria-label="Our values">
        <div className="max-w-container mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="section-header mb-12"
          >
            <motion.p variants={staggerItem} className="eyebrow">What We Stand For</motion.p>
            <motion.h2
              variants={staggerItem}
              className="font-display font-black text-espresso text-display-lg leading-tight"
            >
              Our Values
            </motion.h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {values.map((v) => {
              const Icon = v.icon
              return (
                <motion.div
                  key={v.title}
                  variants={staggerItem}
                  className="bg-white rounded-xl border-2 border-espresso p-7
                             flex flex-col gap-4"
                >
                  <div className="w-12 h-12 rounded-lg bg-flame-orange/10 border-2 border-flame-orange/20
                                  flex items-center justify-center">
                    <Icon size={22} className="text-flame-orange" />
                  </div>
                  <h3 className="font-sans font-extrabold text-lg text-espresso">{v.title}</h3>
                  <p className="font-sans text-sm text-muted-taupe leading-relaxed">{v.description}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-16 md:py-20 bg-warm-cream" aria-label="Our team">
        <div className="max-w-container mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="section-header mb-12"
          >
            <motion.p variants={staggerItem} className="eyebrow">The People Behind It</motion.p>
            <motion.h2
              variants={staggerItem}
              className="font-display font-black text-espresso text-display-lg leading-tight"
            >
              Meet The Team
            </motion.h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-2 md:grid-cols-4 gap-10"
          >
            {team.map((member) => (
              <TeamCard key={member.name} member={member} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-espresso py-16 md:py-20" aria-label="Call to action">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="max-w-container mx-auto px-6 flex flex-col items-center text-center gap-6"
        >
          <motion.p variants={staggerItem} className="eyebrow text-mustard/80">
            Ready to Taste?
          </motion.p>
          <motion.h2
            variants={staggerItem}
            className="font-display font-black text-white text-display-lg leading-tight"
          >
            Come Experience It Yourself
          </motion.h2>
          <motion.p
            variants={staggerItem}
            className="font-sans text-base text-white/60 max-w-md leading-relaxed"
          >
            Words only go so far. The real story is in the first bite.
          </motion.p>
          <motion.div variants={staggerItem} className="flex gap-4 flex-wrap justify-center">
            <Link to="/menu" className="btn-primary">
              View Our Menu
            </Link>
            <Link to="/location" className="btn-outline border-white text-white hover:bg-white hover:text-espresso">
              Find a Location
            </Link>
          </motion.div>
        </motion.div>
      </section>

    </div>
  )
}
