/**
 * useProtectedAction
 *
 * Wraps any action with an auth gate. Usage:
 *
 *   const protectedCheckout = useProtectedAction(() => navigate('/checkout'), 'checkout')
 *   <button onClick={protectedCheckout}>Proceed to Checkout</button>
 *
 * If the user is signed in, the action runs immediately.
 * If not, the auth modal opens and the action is replayed after sign-in.
 */

import { useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { usePendingAction } from '@/context/PendingActionContext'

/**
 * @param {Function} action - The callback to protect
 * @param {string} [reason] - Modal context: 'checkout' | 'contact' | 'wishlist' | 'default'
 * @returns {Function} - Safe wrapper to use as event handler
 */
export function useProtectedAction(action, reason = 'default') {
  const { user } = useAuth()
  const { requireAuth } = usePendingAction()

  return useCallback((...args) => {
    if (user) {
      action(...args)
    } else {
      requireAuth(() => action(...args), reason)
    }
  }, [user, action, requireAuth, reason])
}
