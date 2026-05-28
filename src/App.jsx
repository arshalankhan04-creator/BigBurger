import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CartProvider } from '@/context/CartContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { WishlistProvider } from '@/context/WishlistContext'
import MainLayout from '@/layouts/MainLayout'
import Home from '@/pages/Home'
import MenuPage from '@/pages/MenuPage'
import AboutPage from '@/pages/AboutPage'
import LocationPage from '@/pages/LocationPage'
import ContactPage from '@/pages/ContactPage'
import CheckoutPage from '@/pages/CheckoutPage'
import NotFoundPage from '@/pages/NotFoundPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import RewardsPage from '@/pages/RewardsPage'
import DealsPage from '@/pages/DealsPage'
import OrderTrackingPage from '@/pages/OrderTrackingPage'
import WishlistPage from '@/pages/WishlistPage'
import FaqPage from '@/pages/FaqPage'
import OrdersPage from '@/pages/OrdersPage'
import BurgerReveal from '@/components/common/BurgerReveal'
import CartDrawer from '@/components/common/CartDrawer'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  enter:   { opacity: 1, y: 0,  transition: { duration: 0.35, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2,  ease: 'easeIn'  } },
}

function PageWrapper({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit">
      {children}
    </motion.div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"         element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/menu"     element={<PageWrapper><MenuPage /></PageWrapper>} />
        <Route path="/about"    element={<PageWrapper><AboutPage /></PageWrapper>} />
        <Route path="/location" element={<PageWrapper><LocationPage /></PageWrapper>} />
        <Route path="/contact"  element={<PageWrapper><ContactPage /></PageWrapper>} />
        <Route path="/checkout" element={<PageWrapper><CheckoutPage /></PageWrapper>} />
        <Route path="/product/:id" element={<PageWrapper><ProductDetailPage /></PageWrapper>} />
        <Route path="/rewards"     element={<PageWrapper><RewardsPage /></PageWrapper>} />
        <Route path="/deals"       element={<PageWrapper><DealsPage /></PageWrapper>} />
        <Route path="/track-order" element={<PageWrapper><OrderTrackingPage /></PageWrapper>} />
        <Route path="/wishlist"    element={<PageWrapper><WishlistPage /></PageWrapper>} />
        <Route path="/faq"         element={<PageWrapper><FaqPage /></PageWrapper>} />
        <Route path="/orders"      element={<PageWrapper><OrdersPage /></PageWrapper>} />
        <Route path="*"            element={<PageWrapper><NotFoundPage /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <CartProvider>
          <WishlistProvider>
            <BurgerReveal />
            <CartDrawer />
            <MainLayout>
              <AnimatedRoutes />
            </MainLayout>
          </WishlistProvider>
        </CartProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
