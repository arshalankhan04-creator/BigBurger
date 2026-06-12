/**
 * AuthModal
 *
 * Global authentication modal for protected-action flows.
 * - Supports Sign In and Sign Up without redirecting the user away
 * - On successful auth, calls flushPendingAction() to replay the stored intent
 * - Driven by PendingActionContext; no individual isOpen/onClose props needed
 *   from consumers — they use useProtectedAction() instead
 *
 * Also exported as a controlled component (isOpen/onClose props) for
 * backward compatibility with any legacy call sites.
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { usePendingAction } from '@/context/PendingActionContext'
import AuthForm from '@/components/common/AuthForm'

// ── Reason → header copy ──────────────────────────────────────────
const REASON_MESSAGES = {
  wishlist: { emoji: '❤️', title: 'Save to Wishlist',  subtitle: 'Sign in to save your favourites.'                      },
  checkout: { emoji: '🛍️', title: 'Almost There!',     subtitle: 'Sign in to place your order.'                          },
  contact:  { emoji: '✉️', title: 'Sign In to Send',   subtitle: 'You need to be signed in to submit the contact form.'  },
  review:   { emoji: '⭐', title: 'Share Your Thoughts', subtitle: 'Sign in to post your review.'                         },
  orders:   { emoji: '📦', title: 'View Your Orders',  subtitle: 'Sign in to see your order history.'                    },
  default:  { emoji: '👋', title: 'Welcome',           subtitle: 'Sign in or create an account to continue.'             },
}

export default function AuthModal() {
  const { isModalOpen, reason, flushPendingAction, closeModal } = usePendingAction()
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'

  const msg = REASON_MESSAGES[reason] ?? REASON_MESSAGES.default

  // Reset to sign-in view whenever modal opens
  useEffect(() => {
    if (isModalOpen) setMode('signin')
  }, [isModalOpen])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeModal() }
    if (isModalOpen) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isModalOpen, closeModal])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isModalOpen])

  return (
    <AnimatePresence>
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="auth-backdrop"
            className="fixed inset-0 z-[1100] bg-espresso/70 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="auth-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            className="fixed inset-0 z-[1101] flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
              {/* Top accent */}
              <div className="h-1.5 w-full bg-gradient-to-r from-flame-orange via-mustard to-flame-orange" />

              {/* Close */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-soft-sand
                           flex items-center justify-center text-muted-taupe
                           hover:bg-espresso hover:text-white transition-colors duration-150
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame-orange"
                aria-label="Close authentication modal"
              >
                <X size={15} />
              </button>

              <div className="px-7 py-7 flex flex-col gap-5">
                {/* Header */}
                <div className="flex flex-col items-center text-center gap-1.5">
                  <div className="text-3xl" aria-hidden="true">{msg.emoji}</div>
                  <h2
                    id="auth-modal-title"
                    className="font-display font-black text-xl text-espresso"
                  >
                    {mode === 'signin' ? msg.title : 'Create Account'}
                  </h2>
                  <p className="font-sans text-xs text-muted-taupe">
                    {mode === 'signin' ? msg.subtitle : 'Join BigBurger — it only takes a moment.'}
                  </p>
                </div>

                {/* Shared form — modal variant */}
                <AuthForm
                  mode={mode}
                  onModeChange={setMode}
                  onSuccess={flushPendingAction}
                  variant="modal"
                  reason={reason}
                />
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
