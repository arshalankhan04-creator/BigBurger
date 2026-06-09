import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { X, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}

export default function AuthModal({ isOpen, onClose, reason = 'default' }) {
  const { signInWithGoogle, signInWithEmail } = useAuth()
  const location = useLocation()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  // Current page path to pass as ?from= so login can redirect back
  const fromPath = encodeURIComponent(location.pathname + location.search)

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setEmail(''); setPassword(''); setError(''); setShowPass(false)
    }
  }, [isOpen])

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
    wishlist: { emoji: '❤️', title: 'Save to Wishlist',  subtitle: 'Sign in to save your favourites.' },
    checkout: { emoji: '🛍️', title: 'Almost There!',     subtitle: 'Sign in to place your order.'       },
    default:  { emoji: '👋', title: 'Welcome Back',      subtitle: 'Sign in to your account.'           },
  }
  const msg = messages[reason] ?? messages.default

  const handleEmailSignIn = async (e) => {
    e.preventDefault()
    if (!email || !password) { setError('Please enter email and password.'); return }
    setError(''); setLoading(true)
    const { error: err } = await signInWithEmail(email, password)
    setLoading(false)
    if (err) {
      setError(err.message.includes('Invalid login') ? 'Incorrect email or password.' : err.message)
    } else {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="auth-backdrop"
            className="fixed inset-0 z-[1100] bg-espresso/70 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-soft-sand
                           flex items-center justify-center text-muted-taupe
                           hover:bg-espresso hover:text-white transition-colors duration-150"
                aria-label="Close"
              >
                <X size={15} />
              </button>

              <div className="px-7 py-7 flex flex-col gap-5">
                {/* Header */}
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="text-3xl">{msg.emoji}</div>
                  <h2 id="auth-modal-title"
                    className="font-display font-black text-xl text-espresso">{msg.title}</h2>
                  <p className="font-sans text-xs text-muted-taupe">{msg.subtitle}</p>
                </div>

                {/* Email / password form */}
                <form onSubmit={handleEmailSignIn} className="flex flex-col gap-3" noValidate>
                  {/* Email */}
                  <div className="flex items-center gap-2 border-2 border-espresso/20 rounded-lg px-3 py-2.5
                                  focus-within:border-flame-orange transition-colors">
                    <Mail size={14} className="text-muted-taupe shrink-0" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 font-sans text-sm text-espresso placeholder:text-muted-taupe
                                 bg-transparent focus:outline-none"
                      autoComplete="email"
                    />
                  </div>

                  {/* Password */}
                  <div className="flex items-center gap-2 border-2 border-espresso/20 rounded-lg px-3 py-2.5
                                  focus-within:border-flame-orange transition-colors">
                    <Lock size={14} className="text-muted-taupe shrink-0" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex-1 font-sans text-sm text-espresso placeholder:text-muted-taupe
                                 bg-transparent focus:outline-none"
                      autoComplete="current-password"
                    />
                    <button type="button" onClick={() => setShowPass(s => !s)}
                      className="text-muted-taupe hover:text-espresso transition-colors">
                      {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>

                  {/* Error */}
                  {error && (
                    <p className="flex items-center gap-1.5 font-sans text-xs text-red-500
                                  bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                      <AlertCircle size={12} className="shrink-0" /> {error}
                    </p>
                  )}

                  {/* Sign In button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-espresso hover:bg-flame-orange text-white
                               font-sans font-semibold py-3 rounded-xl
                               transition-all duration-150 active:scale-95
                               disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading
                      ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                        </svg>
                      : 'Sign In'
                    }
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-espresso/10" />
                  <span className="font-sans text-xs text-muted-taupe">or</span>
                  <div className="flex-1 h-px bg-espresso/10" />
                </div>

                {/* Google */}
                <button
                  onClick={() => { signInWithGoogle(); onClose() }}
                  className="w-full flex items-center justify-center gap-2.5
                             border-2 border-espresso/20 hover:border-espresso
                             font-sans font-semibold text-sm text-espresso
                             py-2.5 rounded-xl transition-all duration-150 active:scale-95"
                >
                  <GoogleIcon /> Continue with Google
                </button>

                {/* Link to full login page — passes current path so login can redirect back */}
                <p className="text-center font-sans text-xs text-muted-taupe">
                  New here?{' '}
                  <a
                    href={`/login?from=${fromPath}`}
                    onClick={onClose}
                    className="text-flame-orange font-semibold hover:underline"
                  >
                    Create an account
                  </a>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
