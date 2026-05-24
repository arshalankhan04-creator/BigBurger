import Navbar from '@/components/layout/Navbar'
import Footer from '@/sections/footer/Footer'
import ScrollToTopButton from '@/components/common/ScrollToTopButton'
import BottomNav from '@/components/common/BottomNav'
import useScrollToTop from '@/hooks/useScrollToTop'

export default function MainLayout({ children }) {
  useScrollToTop()

  return (
    <div className="min-h-screen bg-warm-cream flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <ScrollToTopButton />
      <BottomNav />
    </div>
  )
}
