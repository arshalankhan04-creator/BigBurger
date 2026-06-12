// ─── Fake reviews data ───────────────────────────────────────────
// Keyed by product ID — each product has 4-6 reviews

const reviewPool = [
  { id: 1,  name: 'Aryan Mehta',    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop', rating: 5, date: '12 Jan 2025', helpful: 24, text: 'Absolutely incredible! The patty was perfectly charred and juicy. Best burger I\'ve had in Ahmedabad by far.' },
  { id: 2,  name: 'Priya Shah',     avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop', rating: 5, date: '8 Jan 2025',  helpful: 18, text: 'Ordered twice this week already. The flavors are so well balanced — not too heavy, not too light. Highly recommend.' },
  { id: 3,  name: 'Rohan Desai',    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop', rating: 4, date: '3 Jan 2025',  helpful: 11, text: 'Really good quality. The bun was fresh and the patty was cooked just right. Would have given 5 stars but delivery took a bit longer.' },
  { id: 4,  name: 'Nisha Patel',    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop', rating: 5, date: '28 Dec 2024', helpful: 31, text: 'This is my go-to order every weekend. Never disappoints. The ingredients taste so fresh every single time.' },
  { id: 5,  name: 'Karan Joshi',    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop', rating: 3, date: '20 Dec 2024', helpful: 5,  text: 'Decent burger but I expected a bit more flavor. The fries on the side were great though. Might try a different variant next time.' },
  { id: 6,  name: 'Meera Kapoor',   avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop', rating: 5, date: '15 Dec 2024', helpful: 42, text: 'Wow. Just wow. The char on the patty is unreal. You can actually taste the flame-grilling. Worth every rupee.' },
  { id: 7,  name: 'Vikram Singh',   avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop', rating: 4, date: '10 Dec 2024', helpful: 9,  text: 'Solid burger. Good portion size and the sauce was on point. Will definitely order again.' },
  { id: 8,  name: 'Ananya Gupta',   avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop', rating: 5, date: '5 Dec 2024',  helpful: 27, text: 'Ordered for a family gathering and everyone loved it. The quality is consistent every time. Big Burger never lets you down.' },
  { id: 9,  name: 'Rahul Verma',    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop', rating: 4, date: '1 Dec 2024',  helpful: 14, text: 'Great taste and fast delivery. The packaging was also really good — everything arrived hot and fresh.' },
  { id: 10, name: 'Sneha Iyer',     avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop', rating: 5, date: '25 Nov 2024', helpful: 19, text: 'I\'ve tried many burger places but Big Burger is on another level. The freshness of ingredients is unmatched.' },
  { id: 11, name: 'Dev Malhotra',   avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&h=80&fit=crop', rating: 3, date: '20 Nov 2024', helpful: 7,  text: 'Good but not great. The patty was a little dry this time. Hope it was just a one-off. Usually it\'s much better.' },
  { id: 12, name: 'Pooja Nair',     avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=80&h=80&fit=crop', rating: 5, date: '15 Nov 2024', helpful: 33, text: 'Absolutely love this place. The burgers are always fresh, hot, and delicious. My whole family is hooked.' },
]

// Assign reviews to products — rotate through pool
export function getReviewsForProduct(productId) {
  // Each product gets 4 reviews, offset by product ID for variety
  const offset = ((productId - 1) * 3) % reviewPool.length
  const result = []
  for (let i = 0; i < 4; i++) {
    result.push(reviewPool[(offset + i) % reviewPool.length])
  }
  return result
}

// Calculate rating summary
export function getRatingSummary(reviews) {
  const total = reviews.length
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / total
  const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach((r) => { dist[r.rating] = (dist[r.rating] || 0) + 1 })
  return { avg: avg.toFixed(1), total, dist }
}
