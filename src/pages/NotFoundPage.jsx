import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { staggerContainer, staggerItem } from '@/animations/motion'
import heroBurgerLeft from '@/assets/images/hero-burger-left.png'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-warm-cream pt-16 flex items-center justify-center px-6">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center text-center gap-6 max-w-md"
      >
        {/* Burger image */}
        <motion.div
          variants={staggerItem}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-40 h-40 opacity-80"
        >
          <img src={heroBurgerLeft} alt="" className="w-full h-full object-contain" draggable="false" />
        </motion.div>

        {/* 404 */}
        <motion.h1
          variants={staggerItem}
          className="font-display font-black text-espresso leading-none"
          style={{ fontSize: '8rem' }}
        >
          4<span className="text-flame-orange">0</span>4
        </motion.h1>

        <motion.p
          variants={staggerItem}
          className="font-display font-black text-display-lg text-espresso leading-tight"
        >
          Page Not Found
        </motion.p>

        <motion.p
          variants={staggerItem}
          className="font-sans text-base text-muted-taupe leading-relaxed"
        >
          Looks like this page went missing — just like the last burger.
          Let's get you back on track.
        </motion.p>

        <motion.div variants={staggerItem} className="flex gap-3 flex-wrap justify-center">
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
          <Link to="/menu" className="btn-outline">
            View Menu
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
