import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CartProvider } from '@/context/CartContext'
import MainLayout from '@/layouts/MainLayout'
import Home from '@/pages/Home'
import MenuPage from '@/pages/MenuPage'
import AboutPage from '@/pages/AboutPage'
import LocationPage from '@/pages/LocationPage'
import ContactPage from '@/pages/ContactPage'
import CheckoutPage from '@/pages/CheckoutPage'
import NotFoundPage from '@/pages/NotFoundPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
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
        <Route path="*"         element={<PageWrapper><NotFoundPage /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <BurgerReveal />
        <CartDrawer />
        <MainLayout>
          <AnimatedRoutes />
        </MainLayout>
      </CartProvider>
    </BrowserRouter>
  )
}
