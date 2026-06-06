import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

const WishlistContext = createContext(null)

// Global setter so AuthModal trigger can be registered from anywhere
let _requireAuth = null
export function setWishlistAuthTrigger(fn) { _requireAuth = fn }

function loadFromStorage() {
  try {
    return JSON.parse(localStorage.getItem('bigburger_wishlist') || '[]')
  } catch {
    return []
  }
}

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [ids, setIds] = useState(loadFromStorage)

  // ── Sync from Supabase when user logs in ──────────────────────
  useEffect(() => {
    if (!user) return
    supabase
      .from('wishlist_items')
      .select('product_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (data) setIds(data.map((r) => r.product_id))
      })
  }, [user])

  // ── Persist to localStorage when logged out ───────────────────
  useEffect(() => {
    if (user) return
    try {
      localStorage.setItem('bigburger_wishlist', JSON.stringify(ids))
    } catch {}
  }, [ids, user])

  const toggle = useCallback(async (id) => {
    // If not logged in, fire the auth modal instead
    if (!user) {
      if (_requireAuth) _requireAuth()
      return
    }

    const isIn = ids.includes(id)

    // Optimistic update
    setIds((prev) => isIn ? prev.filter((i) => i !== id) : [...prev, id])

    if (user) {
      if (isIn) {
        await supabase
          .from('wishlist_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', id)
      } else {
        await supabase
          .from('wishlist_items')
          .insert({ user_id: user.id, product_id: id })
      }
    }
  }, [ids, user])

  const isWishlisted = useCallback((id) => ids.includes(id), [ids])

  const clear = useCallback(async () => {
    setIds([])
    if (user) {
      await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', user.id)
    } else {
      localStorage.removeItem('bigburger_wishlist')
    }
  }, [user])

  return (
    <WishlistContext.Provider value={{ ids, toggle, isWishlisted, clear, count: ids.length }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
