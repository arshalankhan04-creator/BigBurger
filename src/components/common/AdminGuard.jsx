import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

/**
 * Wraps admin routes. Redirects to /login if not authenticated,
 * or to / if authenticated but not admin.
 */
export default function AdminGuard({ children }) {
  const { user, profile, loading } = useAuth()

  // Still loading session/profile — show spinner
  if (loading || (user && !profile)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 rounded-full border-4 border-espresso border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!user)                    return <Navigate to="/login"  replace />
  if (profile?.role !== 'admin') return <Navigate to="/"      replace />

  return children
}
