import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { staggerContainer, staggerItem, fadeUp, viewportOnce } from '@/animations/motion'
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react'

// ─── FAQ Data ─────────────────────────────────────────────────────
const faqCategories = [
  {
    id: 'ordering',
    label: '🛒 Ordering',
    faqs: [
      {
        q: 'How do I place an order?',
        a: 'Browse our menu, add items to your cart, and proceed to checkout. You can choose delivery or pickup, fill in your details, and confirm your order in just a few steps.',
      },
      {
        q: 'Can I customize my burger?',
        a: 'Yes! Add special instructions in the "Special Instructions" field at checkout. Our kitchen team will do their best to accommodate your request.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept Credit/Debit cards and Cash on Delivery. Online payment is processed securely at checkout.',
      },
      {
        q: 'Can I cancel or modify my order?',
        a: 'Orders can be cancelled or modified within 2 minutes of placing them. After that, our kitchen has already started preparing your food. Please call your nearest branch directly.',
      },
      {
        q: 'Is there a minimum order amount?',
        a: 'There is no minimum order for pickup. For delivery, a minimum order of ₹150 applies.',
      },
    ],
  },
  {
    id: 'delivery',
    label: '🚴 Delivery',
    faqs: [
      {
        q: 'What are your delivery hours?',
        a: 'We deliver 7 days a week from 10:00 AM to 11:30 PM. Last orders for delivery are accepted at 11:00 PM.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Average delivery time is 25–35 minutes depending on your location and order volume. You can track your order in real-time on the Order Tracking page.',
      },
      {
        q: 'What is the delivery fee?',
        a: 'Standard delivery fee is ₹5. Use the promo code FREEDELIVERY for free delivery on your next order.',
      },
      {
        q: 'Do you deliver to my area?',
        a: 'We currently deliver within a 5 km radius of each of our 3 Ahmedabad locations — SG Highway, CG Road, and Prahlad Nagar.',
      },
    ],
  },
  {
    id: 'food',
    label: '🍔 Food & Menu',
    faqs: [
      {
        q: 'Are your burgers halal?',
        a: 'Yes, all our meat is 100% halal certified. We take food sourcing seriously and work only with certified suppliers.',
      },
      {
        q: 'Do you have vegetarian options?',
        a: 'Currently our menu focuses on meat-based burgers, but we do offer fresh salads and sides that are vegetarian-friendly. Vegetarian burger options are coming soon!',
      },
      {
        q: 'Are your ingredients fresh?',
        a: 'Absolutely. We source all vegetables, buns, and produce fresh daily from local suppliers. No frozen patties — ever.',
      },
      {
        q: 'Do you have allergen information?',
        a: 'Yes. Our menu items contain common allergens including gluten, dairy, and eggs. Please contact us directly if you have specific allergy concerns before ordering.',
      },
      {
        q: 'Can I see calorie information?',
        a: 'Yes! Every product page shows calorie count. You can find this in the nutrition strip below the product image.',
      },
    ],
  },
  {
    id: 'rewards',
    label: '⭐ Rewards & Deals',
    faqs: [
      {
        q: 'How do I join the rewards program?',
        a: 'Membership is free. Simply create an account and start earning points from your very first order.',
      },
      {
        q: 'How do I use a promo code?',
        a: 'Enter your promo code in the "Promo Code" field during checkout (Step 1 — Delivery). The discount will be applied automatically to your order total.',
      },
      {
        q: 'Where can I find current deals?',
        a: 'Visit our Deals page for all current promo codes and seasonal offers. New deals are added every week.',
      },
      {
        q: 'Do points expire?',
        a: 'Points are valid for 12 months from the date earned. Stay active and they keep rolling over.',
      },
    ],
  },
  {
    id: 'other',
    label: '📞 Other',
    faqs: [
      {
        q: 'How do I contact customer support?',
        a: 'You can reach us via the Contact page, call +91 79 1234 5678, or email hello@bigburger.com. We respond within 24 hours.',
      },
      {
        q: 'Do you offer catering for events?',
        a: 'Yes! We offer catering packages for corporate events, parties, and gatherings. Contact us at least 48 hours in advance to discuss your requirements.',
      },
      {
        q: 'How do I find my nearest Big Burger?',
        a: 'Visit our Locations page to see all 3 Ahmedabad branches with addresses, hours, and directions.',
      },
      {
        q: 'Do you have a loyalty app?',
        a: 'Our app is coming soon! In the meantime, you can earn and track rewards through our website.',
      },
    ],
  },
]

// ─── Accordion Item ───────────────────────────────────────────────
function AccordionItem({ faq, index }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      variants={staggerItem}
      className="border-2 border-espresso/10 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4
                   px-5 py-4 text-left bg-white hover:bg-soft-sand
                   transition-colors duration-150 focus-visible:outline-none"
        aria-expanded={open}
      >
        <span className="font-sans font-semibold text-sm text-espresso leading-snug">
          {faq.q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown size={18} className="text-muted-taupe" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 bg-soft-sand border-t border-espresso/10">
              <p className="font-sans text-sm text-muted-taupe leading-relaxed">
                {faq.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────
export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState('ordering')

  const current = faqCategories.find((c) => c.id === activeCategory)

  return (
    <div className="min-h-screen bg-warm-cream pt-16">

      {/* ── Hero ── */}
      <div className="bg-espresso py-16 md:py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-container mx-auto px-6 flex flex-col items-center text-center gap-4"
        >
          <motion.div
            variants={staggerItem}
            className="w-14 h-14 rounded-2xl bg-flame-orange/20 border-2 border-flame-orange/30
                       flex items-center justify-center"
          >
            <HelpCircle size={28} className="text-flame-orange" />
          </motion.div>
          <motion.p variants={staggerItem} className="eyebrow text-mustard/80">
            Help Center
          </motion.p>
          <motion.h1
            variants={staggerItem}
            className="font-display font-black text-white text-display-xl leading-tight"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            variants={staggerItem}
            className="font-sans text-base text-white/60 max-w-md leading-relaxed"
          >
            Can't find what you're looking for? Reach out via our{' '}
            <Link to="/contact" className="text-flame-orange hover:underline">
              Contact page
            </Link>.
          </motion.p>
        </motion.div>
      </div>

      {/* Wave */}
      <div aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-10 md:h-14 block">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="#3D1B11" />
        </svg>
      </div>

      {/* ── Content ── */}
      <div className="max-w-container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 items-start">

          {/* ── Left: Category tabs ── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-row lg:flex-col gap-2 flex-wrap lg:sticky lg:top-24"
          >
            {faqCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl font-sans font-semibold text-sm text-left
                            transition-all duration-150 focus-visible:outline-none
                            ${activeCategory === cat.id
                              ? 'bg-espresso text-white shadow-sm'
                              : 'bg-white text-espresso border-2 border-espresso/10 hover:border-espresso/30'
                            }`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>

          {/* ── Right: FAQ accordion ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="font-display font-black text-display-md text-espresso mb-6">
                {current?.label}
              </h2>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-3"
              >
                {current?.faqs.map((faq, i) => (
                  <AccordionItem key={i} faq={faq} index={i} />
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Still need help? ── */}
      <section className="bg-espresso py-14 mt-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="max-w-container mx-auto px-6 flex flex-col items-center text-center gap-5"
        >
          <motion.h2
            variants={staggerItem}
            className="font-display font-black text-white text-display-md leading-tight"
          >
            Still have questions?
          </motion.h2>
          <motion.p
            variants={staggerItem}
            className="font-sans text-white/60 text-sm max-w-sm"
          >
            Our team is available 7 days a week. We typically respond within a few hours.
          </motion.p>
          <motion.div variants={staggerItem} className="flex gap-3 flex-wrap justify-center">
            <Link to="/contact" className="btn-primary gap-2">
              Contact Us <ArrowRight size={16} />
            </Link>
            <a href="tel:+917912345678" className="btn-outline border-white text-white hover:bg-white hover:text-espresso">
              Call Us
            </a>
          </motion.div>
        </motion.div>
      </section>

    </div>
  )
}
