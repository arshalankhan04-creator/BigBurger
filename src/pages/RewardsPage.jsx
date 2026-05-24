import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { staggerContainer, staggerItem, fadeUp, viewportOnce } from '@/animations/motion'
import { Star, Gift, Zap, Crown, ShoppingBag, ArrowRight, Check } from 'lucide-react'

// ─── Data ─────────────────────────────────────────────────────────

const tiers = [
  {
    name: 'Flame Starter',
    icon: Star,
    color: 'bg-soft-sand border-espresso',
    iconColor: 'text-muted-taupe',
    badgeColor: 'bg-soft-sand text-espresso',
    points: '0 – 499 pts',
    perks: [
      'Birthday free burger',
      'Early access to new items',
      '1 point per ₹10 spent',
    ],
  },
  {
    name: 'Grill Master',
    icon: Zap,
    color: 'bg-flame-orange/10 border-flame-orange',
    iconColor: 'text-flame-orange',
    badgeColor: 'bg-flame-orange text-white',
    points: '500 – 1499 pts',
    perks: [
      'Everything in Flame Starter',
      'Free side with every 5th order',
      '1.5x points on weekends',
      'Priority customer support',
    ],
    popular: true,
  },
  {
    name: 'Burger Royale',
    icon: Crown,
    color: 'bg-mustard/20 border-mustard',
    iconColor: 'text-mustard-dark',
    badgeColor: 'bg-mustard text-espresso',
    points: '1500+ pts',
    perks: [
      'Everything in Grill Master',
      'Free delivery on all orders',
      '2x points on every order',
      'Exclusive member-only deals',
      'Monthly surprise gift',
    ],
  },
]

const steps = [
  {
    step: '01',
    icon: ShoppingBag,
    title: 'Place an Order',
    description: 'Every time you order from Big Burger — in-store, online, or via app — you earn points automatically.',
  },
  {
    step: '02',
    icon: Star,
    title: 'Earn Points',
    description: 'Earn 1 point for every ₹10 spent. Hit higher tiers to multiply your earnings up to 2x.',
  },
  {
    step: '03',
    icon: Gift,
    title: 'Redeem Rewards',
    description: 'Use your points for free burgers, sides, drinks, or exclusive member discounts.',
  },
]

const faqs = [
  {
    q: 'How do I join the rewards program?',
    a: 'Simply create an account on our app or website. Membership is free and points start accumulating from your very first order.',
  },
  {
    q: 'Do points expire?',
    a: 'Points are valid for 12 months from the date they were earned. Stay active and they keep rolling over.',
  },
  {
    q: 'Can I use points in-store?',
    a: 'Yes! Show your app QR code at any Big Burger location and your points will be applied automatically.',
  },
  {
    q: 'How many points do I need for a free burger?',
    a: 'A free Regular Beef Burger costs 450 points. Premium items require more points — check the app for the full rewards catalogue.',
  },
]

// ─── Sub-components ───────────────────────────────────────────────

function TierCard({ tier, index }) {
  const Icon = tier.icon
  return (
    <motion.div
      variants={staggerItem}
      className={`relative rounded-2xl border-2 p-7 flex flex-col gap-5
                  ${tier.color} ${tier.popular ? 'shadow-xl scale-[1.02]' : ''}`}
    >
      {tier.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2
                         bg-flame-orange text-white font-sans font-bold text-xs
                         px-4 py-1 rounded-full shadow-md whitespace-nowrap">
          Most Popular
        </span>
      )}

      {/* Icon + tier name */}
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                         ${tier.popular ? 'bg-flame-orange/20' : 'bg-white/60'}`}>
          <Icon size={24} className={tier.iconColor} />
        </div>
        <div>
          <h3 className="font-display font-black text-xl text-espresso">{tier.name}</h3>
          <span className={`font-sans font-bold text-xs px-2 py-0.5 rounded-full ${tier.badgeColor}`}>
            {tier.points}
          </span>
        </div>
      </div>

      {/* Perks */}
      <ul className="flex flex-col gap-2.5">
        {tier.perks.map((perk) => (
          <li key={perk} className="flex items-start gap-2.5">
            <Check size={15} className="text-flame-orange mt-0.5 shrink-0" strokeWidth={2.5} />
            <span className="font-sans text-sm text-espresso leading-snug">{perk}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

function StepCard({ step }) {
  const Icon = step.icon
  return (
    <motion.div variants={staggerItem} className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="font-display font-black text-5xl text-flame-orange/20 leading-none">
          {step.step}
        </span>
        <div className="w-12 h-12 rounded-xl bg-flame-orange/10 border-2 border-flame-orange/20
                        flex items-center justify-center shrink-0">
          <Icon size={22} className="text-flame-orange" />
        </div>
      </div>
      <h3 className="font-sans font-extrabold text-lg text-espresso">{step.title}</h3>
      <p className="font-sans text-sm text-muted-taupe leading-relaxed">{step.description}</p>
    </motion.div>
  )
}

function FaqItem({ item, index }) {
  return (
    <motion.div
      variants={staggerItem}
      className="bg-white rounded-xl border-2 border-espresso p-6 flex flex-col gap-3"
    >
      <h4 className="font-sans font-bold text-base text-espresso">{item.q}</h4>
      <p className="font-sans text-sm text-muted-taupe leading-relaxed">{item.a}</p>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────

export default function RewardsPage() {
  return (
    <div className="min-h-screen bg-warm-cream pt-16">

      {/* ── Hero ── */}
      <div className="bg-espresso py-20 md:py-28 relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          w-[600px] h-[600px] rounded-full
                          bg-flame-orange/10 blur-3xl" />
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-container mx-auto px-6 flex flex-col items-center text-center gap-6 relative z-10"
        >
          <motion.div
            variants={staggerItem}
            className="w-16 h-16 rounded-2xl bg-flame-orange/20 border-2 border-flame-orange/30
                       flex items-center justify-center"
          >
            <Crown size={32} className="text-flame-orange" />
          </motion.div>

          <motion.p variants={staggerItem} className="eyebrow text-mustard/80">
            Big Burger Rewards
          </motion.p>

          <motion.h1
            variants={staggerItem}
            className="font-display font-black text-white text-display-xl leading-tight max-w-2xl"
          >
            Every Bite Earns You More
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className="font-sans text-base text-white/60 max-w-md leading-relaxed"
          >
            Join thousands of loyal customers earning points on every order.
            Redeem for free food, exclusive deals, and member-only perks.
          </motion.p>

          <motion.div variants={staggerItem} className="flex gap-4 flex-wrap justify-center">
            <Link to="/menu" className="btn-primary gap-2">
              Start Earning <ArrowRight size={16} />
            </Link>
            <a href="#how-it-works" className="btn-outline border-white text-white hover:bg-white hover:text-espresso">
              How It Works
            </a>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            variants={staggerItem}
            className="flex items-center gap-8 pt-4 flex-wrap justify-center"
          >
            {[
              { value: '10K+', label: 'Active Members' },
              { value: '₹50L+', label: 'Rewards Redeemed' },
              { value: '3', label: 'Reward Tiers' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <span className="font-display font-black text-2xl text-white">{stat.value}</span>
                <span className="font-sans text-xs text-white/50">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Wave */}
      <div aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-10 md:h-14 block">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="#3D1B11" />
        </svg>
      </div>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-16 md:py-20 bg-warm-cream">
        <div className="max-w-container mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="section-header mb-14"
          >
            <motion.p variants={staggerItem} className="eyebrow">Simple & Rewarding</motion.p>
            <motion.h2
              variants={staggerItem}
              className="font-display font-black text-espresso text-display-lg leading-tight"
            >
              How It Works
            </motion.h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {steps.map((step) => (
              <StepCard key={step.step} step={step} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Tiers ── */}
      <section className="py-16 md:py-20 bg-soft-sand border-y-2 border-espresso/10">
        <div className="max-w-container mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="section-header mb-14"
          >
            <motion.p variants={staggerItem} className="eyebrow">Climb the Ranks</motion.p>
            <motion.h2
              variants={staggerItem}
              className="font-display font-black text-espresso text-display-lg leading-tight"
            >
              Reward Tiers
            </motion.h2>
            <motion.p
              variants={staggerItem}
              className="font-sans text-base text-muted-taupe max-w-md leading-relaxed mt-2"
            >
              The more you order, the better your rewards get. Unlock higher tiers
              and enjoy exclusive perks.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
          >
            {tiers.map((tier, i) => (
              <TierCard key={tier.name} tier={tier} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Points calculator strip ── */}
      <section className="py-14 bg-flame-orange">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="max-w-container mx-auto px-6 flex flex-col md:flex-row
                     items-center justify-between gap-8"
        >
          <div className="flex flex-col gap-2 text-center md:text-left">
            <p className="font-sans font-bold text-white/80 text-sm uppercase tracking-wider">
              Quick Example
            </p>
            <h3 className="font-display font-black text-white text-display-md leading-tight">
              Order ₹500 → Earn 50 Points
            </h3>
            <p className="font-sans text-white/80 text-sm">
              Collect 450 points and redeem for a free Regular Beef Burger 🍔
            </p>
          </div>
          <Link
            to="/menu"
            className="btn-outline border-white text-white hover:bg-white hover:text-flame-orange
                       shrink-0 gap-2"
          >
            Order Now <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 md:py-20 bg-warm-cream">
        <div className="max-w-container mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="section-header mb-12"
          >
            <motion.p variants={staggerItem} className="eyebrow">Got Questions?</motion.p>
            <motion.h2
              variants={staggerItem}
              className="font-display font-black text-espresso text-display-lg leading-tight"
            >
              Rewards FAQ
            </motion.h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto"
          >
            {faqs.map((item, i) => (
              <FaqItem key={i} item={item} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-espresso py-16 md:py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="max-w-container mx-auto px-6 flex flex-col items-center text-center gap-6"
        >
          <motion.p variants={staggerItem} className="eyebrow text-mustard/80">
            Ready to Start?
          </motion.p>
          <motion.h2
            variants={staggerItem}
            className="font-display font-black text-white text-display-lg leading-tight"
          >
            Your First Order Earns Points
          </motion.h2>
          <motion.p
            variants={staggerItem}
            className="font-sans text-base text-white/60 max-w-md leading-relaxed"
          >
            Join for free. Start earning from your very first bite.
          </motion.p>
          <motion.div variants={staggerItem} className="flex gap-4 flex-wrap justify-center">
            <Link to="/menu" className="btn-primary gap-2">
              Order & Earn <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-espresso">
              Contact Us
            </Link>
          </motion.div>
        </motion.div>
      </section>

    </div>
  )
}
