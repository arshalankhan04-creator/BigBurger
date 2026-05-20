// ─── Framer Motion Variants ──────────────────────────────────────
// Single source of truth for all animation tokens across the site.

// Fade up — used for section content reveal on scroll
export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

// Fade in — used for overlays, images
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

// Scale in — used for cards, badges
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

// Stagger container — wraps a list of children with staggered reveal
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.08,
    },
  },
}

// Stagger item — child of staggerContainer
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

// Slide in from left — used for hero text block
export const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

// Slide in from right — used for hero side image
export const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

// Float — continuous gentle bob for hero decorative elements
// Used as animate prop directly (not variants), paired with CSS keyframe as fallback
export const floatAnimation = {
  y: [0, -6, 0],
  transition: {
    duration: 4,
    ease: 'easeInOut',
    repeat: Infinity,
    repeatType: 'loop',
  },
}

// Hover lift — used on interactive cards
export const hoverLift = {
  whileHover: { y: -4, transition: { duration: 0.2 } },
  whileTap:   { scale: 0.97, transition: { duration: 0.1 } },
}

// Viewport config — reusable once prop for scroll-triggered animations
export const viewportOnce = {
  once: true,
  margin: '0px 0px -60px 0px',
}
