import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import loginBg from '@/assets/images/Loginbgimage.jpg'

// ── Google Icon ───────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}

// ── Input field ───────────────────────────────────────────────────
function Field({ icon: Icon, type, placeholder, value, onChange, error, rightEl }) {
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
          className="flex-1 bg-transparent text-white placeholder:text-white/40
                     font-sans text-sm focus:outline-none"
          autoComplete={type === 'password' ? 'current-password' : type === 'email' ? 'email' : 'name'}
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

export default function LoginPage() {
  const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()

  // Read ?from= param — this is where we'll redirect after login
  const params    = new URLSearchParams(location.search)
  const fromPath  = params.get('from') || '/'

  const [mode, setMode]           = useState('signin') // 'signin' | 'signup'
  const [name, setName]           = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [showPass, setShowPass]   = useState(false)
  const [errors, setErrors]       = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting]   = useState(false)
  const [signupDone, setSignupDone]   = useState(false)

  // Redirect if already logged in — go back to where they came from
  useEffect(() => {
    if (!loading && user) navigate(fromPath, { replace: true })
  }, [user, loading, navigate, fromPath])

  const validate = () => {
    const e = {}
    if (mode === 'signup' && !name.trim())    e.name     = 'Name is required'
    if (!email.trim())                         e.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email))     e.email    = 'Invalid email'
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
            error.message.includes('Invalid login')
              ? 'Incorrect email or password.'
              : error.message
          )
        }
        // Navigation handled by useEffect above
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

  const switchMode = () => {
    setMode((m) => m === 'signin' ? 'signup' : 'signin')
    setErrors({})
    setServerError('')
    setSignupDone(false)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/65" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-sm bg-white/10 backdrop-blur-md
                   border border-white/20 rounded-2xl p-8 shadow-2xl text-white"
      >
        {/* Brand */}
        <div className="text-center mb-7">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Big<span className="text-yellow-400">Burger</span>
          </h1>
          <p className="mt-1.5 text-sm text-white/60">
            {mode === 'signin' ? 'Welcome back! Sign in to continue.' : 'Create your account.'}
          </p>
        </div>

        {/* ── Email confirmed message ── */}
        <AnimatePresence mode="wait">
          {signupDone ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-4 py-4 text-center"
            >
              <div className="text-4xl">📧</div>
              <p className="font-sans font-semibold text-white">Check your email!</p>
              <p className="font-sans text-sm text-white/60">
                We sent a confirmation link to <span className="text-white font-semibold">{email}</span>.
                Click it to activate your account, then sign in.
              </p>
              <button
                onClick={() => { setMode('signin'); setSignupDone(false) }}
                className="mt-2 font-sans text-sm text-yellow-400 hover:underline"
              >
                Back to Sign In
              </button>
            </motion.div>
          ) : (
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: mode === 'signup' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
              noValidate
            >
              {/* Name — signup only */}
              {mode === 'signup' && (
                <Field
                  icon={User}
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                />
              )}

              {/* Email */}
              <Field
                icon={Mail}
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />

              {/* Password */}
              <Field
                icon={Lock}
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                rightEl={
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="text-white/40 hover:text-white/80 transition-colors"
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
              />

              {/* Server error */}
              {serverError && (
                <p className="flex items-center gap-1.5 font-sans text-xs text-red-400 bg-red-500/10
                              border border-red-400/30 rounded-lg px-3 py-2">
                  <AlertCircle size={13} className="shrink-0" />
                  {serverError}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900
                           font-sans font-bold py-3 rounded-xl
                           active:scale-95 transition-all duration-150
                           disabled:opacity-60 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2"
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
                <div className="flex-1 h-px bg-white/20" />
                <span className="font-sans text-xs text-white/40">or</span>
                <div className="flex-1 h-px bg-white/20" />
              </div>

              {/* Google */}
              <button
                type="button"
                onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-3
                           bg-white text-gray-800 font-sans font-semibold
                           py-3 rounded-xl hover:bg-gray-100
                           active:scale-95 transition-all duration-150 shadow-md"
              >
                <GoogleIcon />
                Continue with Google
              </button>

              {/* Switch mode */}
              <p className="text-center font-sans text-xs text-white/50 mt-1">
                {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-yellow-400 font-semibold hover:underline"
                >
                  {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="mt-5 text-center text-xs text-white/30">
          By continuing you agree to our Terms of Service.
        </p>
      </motion.div>
    </div>
  )
}
