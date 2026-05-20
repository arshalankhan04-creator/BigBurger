import { motion } from 'framer-motion'
import { staggerContainer, staggerItem, fadeUp, viewportOnce } from '@/animations/motion'
import { Play } from 'lucide-react'

export default function About() {
  return (
    <section
      id="about"
      className="bg-warm-cream py-16 md:py-20"
      aria-label="About us"
    >
      <div className="max-w-container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left: Text content ── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex flex-col gap-6"
          >
            <motion.p variants={staggerItem} className="eyebrow">
              Our Story
            </motion.p>

            <motion.h2
              variants={staggerItem}
              className="font-display font-black text-espresso
                         text-display-lg leading-tight"
            >
              We Maintain Craft Quality Since 1980
            </motion.h2>

            <motion.p
              variants={staggerItem}
              className="font-sans text-base text-muted-taupe leading-relaxed"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Senectus eget hendrerit fermentum. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Ut elit tellus, luctus nec
              ullamcorper mattis, pulvinar dapibus leo.
            </motion.p>

            <motion.p
              variants={staggerItem}
              className="font-sans text-base text-muted-taupe leading-relaxed"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Ut elit tellus, luctus nec ullamcorper mattis, pulvinar
              dapibus leo. Sed do eiusmod tempor incididunt ut labore.
            </motion.p>

            <motion.div variants={staggerItem}>
              <a href="#about" className="btn-outline self-start">
                About Us
              </a>
            </motion.div>
          </motion.div>

          {/* ── Right: Video thumbnail ── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="relative rounded-xl overflow-hidden border-2 border-espresso
                       aspect-video bg-soft-sand group cursor-pointer"
            role="button"
            aria-label="Play our story video"
            tabIndex={0}
          >
            {/* Thumbnail image */}
            <img
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=500&fit=crop&auto=format"
              alt="Chef preparing food in our kitchen"
              className="w-full h-full object-cover transition-transform duration-500
                         group-hover:scale-105"
              loading="lazy"
            />

            {/* Dark overlay */}
            <div
              className="absolute inset-0 bg-espresso/30 group-hover:bg-espresso/20
                         transition-colors duration-300"
              aria-hidden="true"
            />

            {/* Play button */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              aria-hidden="true"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 rounded-full bg-flame-orange
                           flex items-center justify-center
                           shadow-[0_4px_24px_rgba(226,82,34,0.5)]"
              >
                <Play size={24} fill="white" className="text-white ml-1" />
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
