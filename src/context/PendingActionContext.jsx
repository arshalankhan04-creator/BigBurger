/**
 * PendingActionContext
 *
 * Central store for the "intent preservation" pattern:
 *   1. A protected action fires → stores its callback here
 *   2. AuthModal opens
 *   3. After successful sign-in/sign-up → flushPendingAction() is called
 *      → the stored callback executes automatically
 *
 * Google OAuth persistence:
 *   Because Google OAuth redirects the browser away (wiping all JS state),
 *   we persist { reason, returnPath } to sessionStorage before the redirect.
 *   AuthCallbackPage reads this on return and navigates back to returnPath
 *   with ?resume=<reason> so the originating page can replay its action.
 */

import { createContext, useContext, useCallback, useRef, useState } from 'react'

const PendingActionContext = createContext(null)

const STORAGE_KEY = 'bb_pending_oauth'

/** Save intent before OAuth redirect */
export function saveOAuthIntent(reason, returnPath) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ reason, returnPath }))
  } catch {}
}

/** Read and clear the saved intent after OAuth return */
export function popOAuthIntent() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    sessionStorage.removeItem(STORAGE_KEY)
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function PendingActionProvider({ children }) {
  const pendingFnRef = useRef(null)
  const [reason, setReason]           = useState('default')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const requireAuth = useCallback((fn, actionReason = 'default') => {
    pendingFnRef.current = fn
    setReason(actionReason)
    setIsModalOpen(true)
  }, [])

  const flushPendingAction = useCallback(() => {
    setIsModalOpen(false)
    const fn = pendingFnRef.current
    pendingFnRef.current = null
    setReason('default')
    if (typeof fn === 'function') {
      setTimeout(fn, 180)
    }
  }, [])

  const closeModal = useCallback(() => {
    pendingFnRef.current = null
    setReason('default')
    setIsModalOpen(false)
  }, [])

  return (
    <PendingActionContext.Provider
      value={{ requireAuth, flushPendingAction, closeModal, isModalOpen, reason }}
    >
      {children}
    </PendingActionContext.Provider>
  )
}

export function usePendingAction() {
  const ctx = useContext(PendingActionContext)
  if (!ctx) throw new Error('usePendingAction must be used within PendingActionProvider')
  return ctx
}
