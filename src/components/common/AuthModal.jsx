/**
 * AuthModal — Redesigned
 *
 * Global authentication modal for protected-action flows.
 * - Supports Sign In and Sign Up without redirecting the user away
 * - On successful auth, calls flushPendingAction() to replay the stored intent
 * - Driven by PendingActionContext
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { usePendingAction } from '@/context/PendingActionContext'
import AuthForm from '@/components/common/AuthForm'

// ── Reason → header copy ──────────────────────────────────────────
const REASON_MESSAGES = {
  wishlist: { icon: '♥',  title: 'Save to Wishlist',    subtitle: 'Sign in to keep your favourites.',          accent: '#E25222' },
  checkout: { icon: '🛍', title: 'Almost There!',        subtitle: 'Sign in to place your order.',              accent: '#E25222' },
  contact:  { icon: '✉',  title: 'Send a Message',       subtitle: 'Sign in to reach out to us.',               accent: '#E25222' },
  review:   { icon: '★',  title: 'Share Your Thoughts',  subtitle: 'Sign in to leave your review.',             accent: '#F3C641' },
  orders:   { icon: '📦', title: 'Your Orders',          subtitle: 'Sign in to view your order history.',       accent: '#E25222' },
  default:  { icon: '👋', title: 'Welcome Back',         subtitle: 'Sign in or create an account to continue.', accent: '#E25222' },
}

export default function AuthModal() {
  const { isModalOpen, reason, flushPendingAction, closeModal } = usePendingAction()
  const [mode, setMode] = useState('signin')

  const msg = REASON_MESSAGES[reason] ?? REASON_MESSAGES.default

  // Reset to sign-in whenever modal opens
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
          {/* ── Backdrop ── */}
          <motion.div
            key="auth-backdrop"
            className="fixed inset-0 z-[1100]"
            style={{ background: 'rgba(20, 8, 4, 0.82)', backdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeModal}
            aria-hidden="true"
          />

          {/* ── Modal wrapper ── */}
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
              initial={{ scale: 0.88, y: 40, opacity: 0 }}
              animate={{ scale: 1,    y: 0,  opacity: 1 }}
              exit={{    scale: 0.88, y: 40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 340, damping: 26 }}
              className="relative w-full max-w-md overflow-hidden"
              style={{
                borderRadius: '20px',
                background: '#FBF7F2',
                boxShadow: '0 32px 80px rgba(61,27,17,0.45), 0 0 0 1.5px #3D1B11',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Decorative blob — top right ── */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: -40,
                  right: -40,
                  width: 160,
                  height: 160,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(226,82,34,0.12) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />

              {/* ── Close button ── */}
              <button
                onClick={closeModal}
                className="absolute top-5 right-5 z-10 w-8 h-8 rounded-full
                           flex items-center justify-center
                           transition-all duration-150
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame-orange"
                style={{ background: '#3D1B11', color: '#FBF7F2' }}
                aria-label="Close"
                onMouseEnter={(e) => { e.currentTarget.style.background = '#E25222' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#3D1B11' }}
              >
                <X size={14} strokeWidth={2.5} />
              </button>

              <div className="px-8 pt-6 pb-8 flex flex-col gap-6">

                {/* ── Header ── */}
                <div className="flex flex-col items-center text-center gap-2">
                  {/* Icon bubble */}
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-1"
                    style={{
                      background: 'linear-gradient(135deg, #3D1B11 0%, #6B3020 100%)',
                      boxShadow: '0 8px 24px rgba(61,27,17,0.3)',
                    }}
                    aria-hidden="true"
                  >
                    {msg.icon}
                  </motion.div>

                  <h2
                    id="auth-modal-title"
                    className="font-display font-black text-espresso"
                    style={{ fontSize: '1.5rem', letterSpacing: '-0.03em', lineHeight: 1.1 }}
                  >
                    {mode === 'signin' ? msg.title : 'Create Account'}
                  </h2>

                  <p className="font-sans text-sm" style={{ color: '#756A63', maxWidth: '22ch' }}>
                    {mode === 'signin'
                      ? msg.subtitle
                      : 'Join BigBurger — it only takes a moment.'}
                  </p>
                </div>

                {/* ── Auth form ── */}
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
