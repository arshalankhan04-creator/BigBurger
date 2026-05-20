import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility to merge Tailwind classes safely (used by shadcn components)
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
