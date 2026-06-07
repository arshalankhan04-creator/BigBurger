// ── Restaurant Hours Utility ──────────────────────────────────────
// Open: 10:00 AM – 11:00 PM IST (UTC+5:30)
// IST offset = +330 minutes from UTC

const OPEN_HOUR  = 10  // 10:00 AM
const CLOSE_HOUR = 23  // 11:00 PM

/**
 * Returns true if the restaurant is currently open (IST).
 */
export function isRestaurantOpen() {
  const now = new Date()

  // Convert current UTC time to IST
  const utcMs  = now.getTime() + now.getTimezoneOffset() * 60_000
  const istMs  = utcMs + 330 * 60_000   // +5:30
  const ist    = new Date(istMs)

  const hours   = ist.getHours()
  const minutes = ist.getMinutes()

  // Open if time is >= 10:00 and < 23:00
  const afterOpen  = hours >= OPEN_HOUR
  const beforeClose = hours < CLOSE_HOUR

  return afterOpen && beforeClose
}

/**
 * Returns a human-readable status string.
 * e.g. "Open · Closes at 11:00 PM" or "Closed · Opens at 10:00 AM"
 */
export function getRestaurantStatus() {
  return isRestaurantOpen()
    ? 'Open · Closes at 11:00 PM IST'
    : 'Closed · Opens at 10:00 AM IST'
}
