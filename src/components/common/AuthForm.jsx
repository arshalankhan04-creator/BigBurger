/**
 * AuthForm
 *
 * Reusable sign-in / sign-up form shared between:
 *   - AuthModal (protected-action flow — stays on current page)
 *   - LoginPage (direct navigation flow — redirects after success)
 *
 * Props:
 *   mode          'signin' | 'signup'
 *   onModeChange  (newMode) => void  — called when user clicks the switch link
 *   onSuccess     () => void         — called after successful auth
 *   variant       'modal' | 'page'   — controls visual style
 *   initialEmail  string             — pre-fill email (e.g. after sign-up attempt)
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { saveOAuthIntent } from '@/context/PendingActionContext'

// ── Google SVG ─────────────────────────────────────────────────────
function GoogleIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}

// ── Field wrapper — page variant ──────────────────────────────────
function PageField({ icon: Icon, type, placeholder, value, onChange, error, rightEl, autoComplete }) {
  return (
    <div className="flex flex-col gap-1">
      <div className={`flex items-center gap-3 bg-white/10 border rounded-xl px-4 py-3
                       transition-colors duration-150
                       ${error ? 'border-red-400' : 'border-white/20 focus-within:border-white/60'}`}>
        <Icon size={16} className="text-white/50 shrink-0" />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className="flex-1 bg-transparent text-white placeholder:text-white/40
                     font-sans text-sm focus:outline-none"
        />
        {rightEl}
      </div>
      {error && (
        <p className="flex items-center gap-1 font-sans text-xs text-red-400 px-1">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  )
}

// ── Field wrapper — modal variant ─────────────────────────────────
function ModalField({ icon: Icon, type, placeholder, value, onChange, error, rightEl, autoComplete }) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className="flex items-center gap-2.5 px-4 py-3 rounded-xl transition-all duration-150"
        style={{
          background: '#FFFFFF',
          border: error ? '2px solid #ef4444' : '1.5px solid #3D1B1130',
          boxShadow: '0 1px 4px rgba(61,27,17,0.06)',
        }}
        onFocus={(e) => {
          if (!error) e.currentTarget.style.border = '2px solid #E25222'
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(226,82,34,0.12)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.border = error ? '2px solid #ef4444' : '1.5px solid #3D1B1130'
          e.currentTarget.style.boxShadow = '0 1px 4px rgba(61,27,17,0.06)'
        }}
      >
        <Icon size={15} style={{ color: '#756A63', flexShrink: 0 }} />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className="flex-1 font-sans text-sm text-espresso placeholder:text-muted-taupe
                     bg-transparent focus:outline-none"
        />
        {rightEl}
      </div>
      {error && (
        <p className="flex items-center gap-1 font-sans text-xs text-red-500 px-1">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────
export default function AuthForm({
  mode = 'signin',
  onModeChange,
  onSuccess,
  variant = 'modal',
  initialEmail = '',
  reason = 'default',
  returnPath = '/',
}) {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth()
  const location = useLocation()

  const [name, setName]           = useState('')
  const [email, setEmail]         = useState(initialEmail)
  const [password, setPassword]   = useState('')
  const [showPass, setShowPass]   = useState(false)
  const [errors, setErrors]       = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting]   = useState(false)
  const [signupDone, setSignupDone]   = useState(false)

  // Reset fields when mode switches
  useEffect(() => {
    setErrors({})
    setServerError('')
    setSignupDone(false)
    setPassword('')
    setShowPass(false)
  }, [mode])

  const validate = () => {
    const e = {}
    if (mode === 'signup' && !name.trim())    e.name     = 'Name is required'
    if (!email.trim())                         e.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email))     e.email    = 'Invalid email address'
    if (!password)                             e.password = 'Password is required'
    else if (password.length < 6)             e.password = 'Minimum 6 characters'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSubmitting(true)

    try {
      if (mode === 'signin') {
        const { error } = await signInWithEmail(email, password)
        if (error) {
          setServerError(
            error.message.includes('Invalid login') || error.message.includes('invalid_credentials')
              ? 'Incorrect email or password.'
              : error.message
          )
        } else {
          onSuccess?.()
        }
      } else {
        const { error } = await signUpWithEmail(email, password, name.trim())
        if (error) {
          setServerError(error.message)
        } else {
          setSignupDone(true)
        }
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleSignIn = () => {
    // Persist intent so AuthCallbackPage can restore it after the OAuth round-trip
    const path = returnPath !== '/' ? returnPath : location.pathname + location.search
    saveOAuthIntent(reason, path)
    signInWithGoogle()
  }

  const FieldComponent = variant === 'page' ? PageField : ModalField

  // ── Email confirmation screen (sign-up done) ────────────────────
  if (signupDone) {
    return (
      <motion.div
        key="done"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4 py-4 text-center"
      >
        <div className="text-4xl">📧</div>
        <p className={`font-sans font-semibold ${variant === 'page' ? 'text-white' : 'text-espresso'}`}>
          Check your email!
        </p>
        <p className={`font-sans text-sm max-w-xs leading-relaxed ${variant === 'page' ? 'text-white/60' : 'text-muted-taupe'}`}>
          We sent a confirmation link to{' '}
          <span className={`font-semibold ${variant === 'page' ? 'text-white' : 'text-espresso'}`}>
            {email}
          </span>
          . Click it to activate your account, then sign in.
        </p>
        <button
          onClick={() => onModeChange?.('signin')}
          className={`mt-2 font-sans text-sm font-semibold hover:underline
            ${variant === 'page' ? 'text-yellow-400' : 'text-flame-orange'}`}
        >
          Back to Sign In
        </button>
      </motion.div>
    )
  }

  // ── Sign-in / Sign-up form ──────────────────────────────────────
  const isPage = variant === 'page'

  return (
    <AnimatePresence mode="wait">
      <motion.form
        key={mode}
        initial={{ opacity: 0, x: mode === 'signup' ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4"
      >
        {/* Name — sign-up only */}
        {mode === 'signup' && (
          <FieldComponent
            icon={User}
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            autoComplete="name"
          />
        )}

        {/* Email */}
        <FieldComponent
          icon={Mail}
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: '' })) }}
          error={errors.email}
          autoComplete="email"
        />

        {/* Password */}
        <FieldComponent
          icon={Lock}
          type={showPass ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((p) => ({ ...p, password: '' })) }}
          error={errors.password}
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          rightEl={
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              aria-label={showPass ? 'Hide password' : 'Show password'}
              className={`transition-colors ${
                isPage
                  ? 'text-white/40 hover:text-white/80'
                  : 'text-muted-taupe hover:text-espresso'
              }`}
            >
              {showPass ? <EyeOff size={isPage ? 15 : 13} /> : <Eye size={isPage ? 15 : 13} />}
            </button>
          }
        />

        {/* Server error */}
        {serverError && (
          <p className={`flex items-center gap-1.5 font-sans text-xs rounded-lg px-3 py-2
            ${isPage
              ? 'text-red-400 bg-red-500/10 border border-red-400/30'
              : 'text-red-500 bg-red-50 border border-red-200'}`}
          >
            <AlertCircle size={12} className="shrink-0" /> {serverError}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className={`w-full font-sans font-bold py-3 rounded-xl
            active:scale-95 transition-all duration-150
            disabled:opacity-60 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
            ${isPage
              ? 'bg-yellow-400 hover:bg-yellow-300 text-gray-900'
              : 'text-white'}`}
          style={!isPage ? {
            background: 'linear-gradient(135deg, #3D1B11 0%, #E25222 100%)',
            boxShadow: '0 4px 16px rgba(226,82,34,0.35)',
          } : undefined}
        >
          {submitting ? (
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
          ) : mode === 'signin' ? 'Sign In' : 'Create Account'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className={`flex-1 h-px ${isPage ? 'bg-white/20' : 'bg-espresso/10'}`} />
          <span className={`font-sans text-xs ${isPage ? 'text-white/40' : 'text-muted-taupe'}`}>or</span>
          <div className={`flex-1 h-px ${isPage ? 'bg-white/20' : 'bg-espresso/10'}`} />
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className={`w-full flex items-center justify-center gap-2.5
            font-sans font-semibold text-sm py-2.5 rounded-xl
            active:scale-95 transition-all duration-150
            ${isPage
              ? 'bg-white text-gray-800 hover:bg-gray-100 shadow-md py-3 gap-3'
              : 'border-2 border-espresso/20 hover:border-espresso text-espresso'}`}
        >
          <GoogleIcon size={isPage ? 20 : 16} />
          Continue with Google
        </button>

        {/* Mode switch */}
        <p className={`text-center font-sans text-xs mt-1
          ${isPage ? 'text-white/50' : 'text-muted-taupe'}`}
        >
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => onModeChange?.(mode === 'signin' ? 'signup' : 'signin')}
            className={`font-semibold hover:underline
              ${isPage ? 'text-yellow-400' : 'text-flame-orange'}`}
          >
            {mode === 'signin' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </motion.form>
    </AnimatePresence>
  )
}
