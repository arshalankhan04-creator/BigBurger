import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import heroBurgerLeft from '@/assets/images/hero-burger-left.png'

/**
 * BurgerReveal — Cinematic intro (Option B: Circular clip-path reveal)
 *
 * Architecture: Two completely separate fixed layers
 *   Layer 1 (z-[9998]) — The site sits behind, revealed by clip-path expanding
 *   Layer 2 (z-[9999]) — Dark overlay with burger, fades out after clip starts
 *
 * Phases (driven by a single numeric state):
 *   0 → dark screen, burger animates in
 *   1 → clip-path circle expands on the SITE layer (not the overlay)
 *   2 → overlay unmounts, site fully visible
 */

export default function BurgerReveal({ onComplete }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    // Lock scroll during animation
    document.body.style.overflow = 'hidden'
    window.scrollTo({ top: 0, behavior: 'instant' })

    // Phase 0 → 1: start reveal after burger has animated in
    const t1 = setTimeout(() => setPhase(1), 1600)
    // Phase 1 → 2: unmount overlay after circle fully expands
    const t2 = setTimeout(() => {
      setPhase(2)
      // Unlock scroll and ensure user lands at top of page (hero section)
      document.body.style.overflow = ''
      window.scrollTo({ top: 0, behavior: 'instant' })
      onComplete?.()
    }, 2700)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* ── LAYER 1: Site reveal mask ─────────────────────────────
          Sits above the actual site content.
          clip-path starts as circle(0%) then expands to circle(150%)
          revealing the site underneath.
      ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === 1 && (
          <motion.div
            key="reveal-mask"
            className="fixed inset-0 z-[9998] bg-espresso pointer-events-none"
            initial={{ clipPath: 'circle(0% at 50% 50%)' }}
            animate={{ clipPath: 'circle(150% at 50% 50%)' }}
            transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          />
        )}
      </AnimatePresence>

      {/* ── LAYER 2: Dark overlay with burger ────────────────────
          Full screen dark bg + burger image + glow effects.
          Fades out when phase hits 1.
      ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {phase < 2 && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-[9999] bg-espresso
                       flex flex-col items-center justify-center
                       overflow-hidden pointer-events-none"
            animate={phase === 1 ? { opacity: 0 } : { opacity: 1 }}
            transition={phase === 1 ? { duration: 0.5, delay: 0.5 } : { duration: 0 }}
          >
            {/* Mustard glow */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: '420px',
                height: '420px',
                background:
                  'radial-gradient(circle, rgba(243,198,65,0.30) 0%, transparent 70%)',
              }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.0, delay: 0.6, ease: 'easeOut' }}
            />

            {/* Flame orange inner glow */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: '240px',
                height: '240px',
                background:
                  'radial-gradient(circle, rgba(226,82,34,0.22) 0%, transparent 70%)',
              }}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
            />

            {/* Burger image */}
            <motion.div
              className="relative z-10"
              style={{ width: '280px', height: '280px' }}
              initial={{ opacity: 0, scale: 0.35, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: 1.1,
                delay: 0.25,
                ease: [0.34, 1.4, 0.64, 1],
              }}
            >
              <img
                src={heroBurgerLeft}
                alt=""
                className="w-full h-full object-contain"
                draggable="false"
              />
            </motion.div>

            {/* Brand text */}
            <motion.div
              className="relative z-10 flex flex-col items-center gap-1 mt-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <span className="font-display font-black text-4xl text-white tracking-tight">
                Big <span className="text-flame-orange">Burger</span>
              </span>
              <span className="font-sans text-xs text-white/40 tracking-widest uppercase">
                Real flame. Real flavor.
              </span>
            </motion.div>

            {/* Floating particles */}
            {[
              { left: '22%', top: '38%', delay: 0.9 },
              { left: '35%', top: '62%', delay: 1.0 },
              { left: '50%', top: '30%', delay: 1.1 },
              { left: '65%', top: '58%', delay: 1.0 },
              { left: '76%', top: '40%', delay: 0.9 },
            ].map((p, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-mustard/50 pointer-events-none"
                style={{ left: p.left, top: p.top }}
                initial={{ opacity: 0, y: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], y: -40, scale: [0, 1, 0] }}
                transition={{ duration: 1.4, delay: p.delay, ease: 'easeOut' }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
