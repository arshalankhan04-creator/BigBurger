import Navbar from '@/components/layout/Navbar'
import Footer from '@/sections/footer/Footer'
import ScrollToTopButton from '@/components/common/ScrollToTopButton'
import BottomNav from '@/components/common/BottomNav'
import useScrollToTop from '@/hooks/useScrollToTop'
import { useState } from 'react'

export default function MainLayout({ children }) {
  useScrollToTop()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-warm-cream flex flex-col">
      <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <ScrollToTopButton hidden={mobileMenuOpen} />
      <BottomNav />
    </div>
  )
}
