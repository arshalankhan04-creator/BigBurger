/**
 * useResumeAction
 *
 * After a Google OAuth round-trip, AuthCallbackPage appends ?resume=<reason>
 * to the return URL. This hook detects that param, fires the provided callback
 * once (when the user is confirmed authenticated), then cleans the URL.
 *
 * Usage:
 *   useResumeAction('contact', handleSubmit)
 *   useResumeAction('review', submitReview)
 *
 * The callback is only fired when:
 *   - The ?resume param matches the expected reason
 *   - The user is signed in (auth has resolved)
 */

import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export function useResumeAction(reason, callback) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const firedRef = useRef(false)

  useEffect(() => {
    if (loading) return
    if (!user) return
    if (firedRef.current) return

    const params = new URLSearchParams(location.search)
    if (params.get('resume') !== reason) return

    firedRef.current = true

    // Strip the ?resume param from the URL without a navigation flash
    params.delete('resume')
    const clean = location.pathname + (params.toString() ? `?${params.toString()}` : '')
    navigate(clean, { replace: true })

    // Small delay so the page has fully rendered before the action fires
    setTimeout(() => callback(), 100)
  }, [user, loading, location.search, reason, callback, location.pathname, navigate])
}
