/**
 * LoginPage
 *
 * Direct-navigation auth entry point (Navbar "Sign In" → /login).
 * Supports both Sign In and Sign Up modes via AuthForm.
 *
 * After successful sign-in, redirects to ?from= param (or home).
 * Google OAuth is handled by AuthForm; the redirect target is set
 * in AuthContext.signInWithGoogle via the supabase redirectTo option.
 */

import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import AuthForm from '@/components/common/AuthForm'
import loginBg from '@/assets/images/Loginbgimage.jpg'

export default function LoginPage() {
  const { user, loading } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()

  const params   = new URLSearchParams(location.search)
  const fromPath = params.get('from') || '/'

  const [mode, setMode] = useState('signin') // 'signin' | 'signup'

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) navigate(fromPath, { replace: true })
  }, [user, loading, navigate, fromPath])

  // After sign-in success, navigate to original destination
  const handleSuccess = () => {
    navigate(fromPath, { replace: true })
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/65" aria-hidden="true" />

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
            {mode === 'signin'
              ? 'Welcome back! Sign in to continue.'
              : 'Create your account.'}
          </p>
        </div>

        {/* Shared form — page variant */}
        <AuthForm
          mode={mode}
          onModeChange={setMode}
          onSuccess={handleSuccess}
          variant="page"
          returnPath={fromPath}
        />

        <p className="mt-5 text-center text-xs text-white/30">
          By continuing you agree to our Terms of Service.
        </p>
      </motion.div>
    </div>
  )
}
