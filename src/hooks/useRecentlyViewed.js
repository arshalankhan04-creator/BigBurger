import { useState, useEffect } from 'react'

const KEY = 'bigburger_recently_viewed'
const MAX = 4

/**
 * Tracks recently viewed product IDs in localStorage.
 * Returns the list of recently viewed product IDs (excluding current).
 */
export default function useRecentlyViewed(currentId) {
  const [recentIds, setRecentIds] = useState([])

  useEffect(() => {
    if (!currentId) return

    try {
      // Load existing
      const saved = JSON.parse(localStorage.getItem(KEY) || '[]')

      // Add current to front, remove duplicates, limit to MAX + 1 (we'll exclude current)
      const updated = [currentId, ...saved.filter((id) => id !== currentId)].slice(0, MAX + 1)

      localStorage.setItem(KEY, JSON.stringify(updated))

      // Return all except current, max 4
      setRecentIds(updated.filter((id) => id !== currentId).slice(0, MAX))
    } catch {
      setRecentIds([])
    }
  }, [currentId])

  return recentIds
}
