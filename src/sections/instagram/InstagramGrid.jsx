import { motion } from 'framer-motion'
import { staggerContainer, staggerItem, viewportOnce } from '@/animations/motion'
import { Instagram } from 'lucide-react'

const gramPhotos = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop&auto=format',
    alt: 'Juicy burger close-up',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=400&fit=crop&auto=format',
    alt: 'Friends enjoying burgers',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=400&fit=crop&auto=format',
    alt: 'Hands holding a burger',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop&auto=format',
    alt: 'Fresh ingredients spread',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=400&fit=crop&auto=format',
    alt: 'Burger stack side view',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop&auto=format',
    alt: 'Fries and dipping sauce',
  },
]

export default function InstagramGrid() {
  return (
    <section
      id="instagram"
      className="bg-warm-cream py-16 md:py-20"
      aria-label="Instagram feed"
    >
      <div className="max-w-container mx-auto px-6">

        {/* ── Header ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="section-header mb-10"
        >
          <motion.p variants={staggerItem} className="eyebrow">
            Follow Us @bigburger
          </motion.p>
          <motion.h2
            variants={staggerItem}
            className="font-display font-black text-espresso
                       text-display-lg leading-tight"
          >
            Check Out Our Grams!
          </motion.h2>
        </motion.div>

        {/* ── Photo grid ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
        >
          {gramPhotos.map((photo) => (
            <motion.a
              key={photo.id}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              variants={staggerItem}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className="relative aspect-square rounded-lg overflow-hidden
                         border-2 border-espresso group block"
              aria-label={`View on Instagram: ${photo.alt}`}
            >
              <img
                src={photo.image}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-300
                           group-hover:scale-110"
                loading="lazy"
              />
              {/* Instagram overlay on hover */}
              <div
                className="absolute inset-0 bg-espresso/50 opacity-0 group-hover:opacity-100
                           transition-opacity duration-300 flex items-center justify-center"
                aria-hidden="true"
              >
                <Instagram size={24} className="text-white" />
              </div>
            </motion.a>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
