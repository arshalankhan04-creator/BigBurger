import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const WishlistContext = createContext(null)

function loadFromStorage() {
  try {
    return JSON.parse(localStorage.getItem('bigburger_wishlist') || '[]')
  } catch {
    return []
  }
}

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(loadFromStorage)

  useEffect(() => {
    try {
      localStorage.setItem('bigburger_wishlist', JSON.stringify(ids))
    } catch {}
  }, [ids])

  const toggle = useCallback((id) => {
    setIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }, [])

  const isWishlisted = useCallback((id) => ids.includes(id), [ids])

  const clear = useCallback(() => setIds([]), [])

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
