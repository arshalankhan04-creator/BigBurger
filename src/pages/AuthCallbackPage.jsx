import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { popOAuthIntent } from '@/context/PendingActionContext'

/**
 * Supabase redirects here after Google OAuth.
 *
 * Flow:
 *   1. Establish the session from the URL hash/code
 *   2. Check sessionStorage for a saved intent (set before the OAuth redirect)
 *   3a. Intent found → navigate to returnPath?resume=<reason>
 *       The destination page reads ?resume= and replays its protected action.
 *   3b. No intent → navigate to / (plain sign-in from Navbar)
 *   4. On failure → navigate to /login
 */
export default function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login', { replace: true })
        return
      }

      const intent = popOAuthIntent()

      if (intent?.returnPath) {
        const { returnPath, reason } = intent

        // For actions that navigate to a different page (checkout),
        // go straight there. For in-page actions (contact, review, wishlist),
        // go back to the originating page and pass ?resume= so it can replay.
        if (reason === 'checkout') {
          navigate('/checkout', { replace: true })
        } else if (reason && reason !== 'default') {
          const sep = returnPath.includes('?') ? '&' : '?'
          navigate(`${returnPath}${sep}resume=${reason}`, { replace: true })
        } else {
          navigate(returnPath, { replace: true })
        }
      } else {
        navigate('/', { replace: true })
      }
    })
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-cream">
      <div className="flex flex-col items-center gap-4">
        <svg className="animate-spin w-8 h-8 text-flame-orange" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
        </svg>
        <p className="font-sans text-sm text-muted-taupe">Signing you in…</p>
      </div>
    </div>
  )
}
