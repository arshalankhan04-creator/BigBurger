import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useEffect } from 'react'

export default function AuthModal({ isOpen, onClose, reason = 'default' }) {
  const { signInWithGoogle } = useAuth()

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const messages = {
    wishlist: {
      emoji: '❤️',
      title: 'Save to Wishlist',
      subtitle: 'Sign in to save your favourite items and access them from any device.',
    },
    checkout: {
      emoji: '🛍️',
      title: 'Almost There!',
      subtitle: 'Sign in to place your order and track it in real time.',
    },
    default: {
      emoji: '👋',
      title: 'Welcome Back',
      subtitle: 'Sign in to get the full Big Burger experience.',
    },
  }

  const msg = messages[reason] ?? messages.default

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="auth-backdrop"
            className="fixed inset-0 z-[1100] bg-espresso/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="auth-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            className="fixed inset-0 z-[1101] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 24 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl
                         border-2 border-espresso overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top accent bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-flame-orange via-mustard to-flame-orange" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-soft-sand
                           flex items-center justify-center text-muted-taupe
                           hover:bg-espresso hover:text-white transition-colors duration-150"
                aria-label="Close"
              >
                <X size={15} />
              </button>

              {/* Content */}
              <div className="px-8 py-8 flex flex-col items-center text-center gap-5">
                {/* Emoji icon */}
                <div className="w-16 h-16 rounded-2xl bg-flame-orange/10 border-2 border-flame-orange/20
                                flex items-center justify-center text-3xl">
                  {msg.emoji}
                </div>

                <div className="flex flex-col gap-2">
                  <h2
                    id="auth-modal-title"
                    className="font-display font-black text-2xl text-espresso leading-tight"
                  >
                    {msg.title}
                  </h2>
                  <p className="font-sans text-sm text-muted-taupe leading-relaxed max-w-xs">
                    {msg.subtitle}
                  </p>
                </div>

                {/* Google Sign In */}
                <button
                  onClick={() => { signInWithGoogle(); onClose() }}
                  className="w-full flex items-center justify-center gap-3
                             bg-espresso text-white font-sans font-semibold
                             py-3.5 px-5 rounded-xl
                             hover:bg-flame-orange active:scale-95
                             transition-all duration-150 shadow-md"
                  aria-label="Sign in with Google"
                >
                  {/* Google icon */}
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  Continue with Google
                </button>

                <p className="font-sans text-xs text-muted-taupe/60">
                  No account needed — Google sign-in creates one instantly.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
