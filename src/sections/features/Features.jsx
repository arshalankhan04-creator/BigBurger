import { motion } from 'framer-motion'
import { staggerContainer, staggerItem, viewportOnce } from '@/animations/motion'
import { Leaf, Heart, Zap } from 'lucide-react'

const features = [
  {
    id: 1,
    icon: Leaf,
    title: 'Fresh Ingredients',
    description:
      'We source locally and seasonally. Every vegetable, every bun, every patty — picked fresh daily from trusted suppliers.',
  },
  {
    id: 2,
    icon: Heart,
    title: 'Made With Love',
    description:
      'Each burger is hand-crafted by our kitchen team. No assembly lines, no shortcuts — just real people making real food.',
  },
  {
    id: 3,
    icon: Zap,
    title: 'Fast & Reliable',
    description:
      'Hot food, fast delivery. We guarantee your order is ready in under 15 minutes — or your next one is on us.',
  },
]

export default function Features() {
  return (
    <section
      id="features"
      className="bg-soft-sand py-16 md:py-20 border-t-2 border-espresso/10"
      aria-label="Our features"
    >
      <div className="max-w-container mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.id}
                variants={staggerItem}
                className="flex flex-col gap-4"
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-lg bg-flame-orange/10 border-2 border-flame-orange/20
                             flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <Icon size={22} className="text-flame-orange" strokeWidth={2} />
                </div>

                {/* Text */}
                <div className="flex flex-col gap-2">
                  <h3 className="font-sans font-extrabold text-base text-espresso">
                    {feature.title}
                  </h3>
                  <p className="font-sans text-sm text-muted-taupe leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
