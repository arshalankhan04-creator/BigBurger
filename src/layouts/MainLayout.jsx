import Navbar from '@/components/layout/Navbar'
import Footer from '@/sections/footer/Footer'
import useScrollToTop from '@/hooks/useScrollToTop'

export default function MainLayout({ children }) {
  // Scroll to top on every route change
  useScrollToTop()

  return (
    <div className="min-h-screen bg-warm-cream flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
