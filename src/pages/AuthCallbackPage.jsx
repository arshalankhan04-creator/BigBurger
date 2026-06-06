import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

/**
 * Supabase redirects here after Google OAuth.
 * It processes the token from the URL hash and then
 * sends the user to the home page.
 */
export default function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Session is now established — redirect home (or wherever you want)
      navigate(session ? '/' : '/login', { replace: true })
    })
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-medium animate-pulse">Signing you in…</p>
    </div>
  )
}
