import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'
import { AuthProvider } from '@/context/AuthContext'
import { PendingActionProvider } from '@/context/PendingActionContext'
import MainLayout from '@/layouts/MainLayout'
import AdminLayout from '@/layouts/AdminLayout'
import AdminGuard from '@/components/common/AdminGuard'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminProducts from '@/pages/admin/AdminProducts'
import AdminOrders from '@/pages/admin/AdminOrders'
import AdminMessages from '@/pages/admin/AdminMessages'
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
import WishlistPage from '@/pages/WishlistPage'
import FaqPage from '@/pages/FaqPage'
import OrdersPage from '@/pages/OrdersPage'
import LoginPage from '@/pages/LoginPage'
import AuthCallbackPage from '@/pages/AuthCallbackPage'
import BurgerReveal from '@/components/common/BurgerReveal'
import CartDrawer from '@/components/common/CartDrawer'
import AuthModal from '@/components/common/AuthModal'

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
        <Route path="/"            element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/menu"        element={<PageWrapper><MenuPage /></PageWrapper>} />
        <Route path="/about"       element={<PageWrapper><AboutPage /></PageWrapper>} />
        <Route path="/location"    element={<PageWrapper><LocationPage /></PageWrapper>} />
        <Route path="/contact"     element={<PageWrapper><ContactPage /></PageWrapper>} />
        <Route path="/product/:id" element={<PageWrapper><ProductDetailPage /></PageWrapper>} />
        <Route path="/deals"       element={<PageWrapper><DealsPage /></PageWrapper>} />
        <Route path="/faq"         element={<PageWrapper><FaqPage /></PageWrapper>} />
        <Route path="/checkout"    element={<PageWrapper><CheckoutPage /></PageWrapper>} />
        <Route path="/orders"      element={<PageWrapper><OrdersPage /></PageWrapper>} />
        <Route path="/rewards"     element={<PageWrapper><RewardsPage /></PageWrapper>} />
        <Route path="/wishlist"      element={<PageWrapper><WishlistPage /></PageWrapper>} />
        <Route path="/login"         element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="*"              element={<PageWrapper><NotFoundPage /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PendingActionProvider>
          <CartProvider>
            <WishlistProvider>

              {/* Single global auth modal — driven by PendingActionContext */}
              <AuthModal />

              {/* ── Admin routes — own layout, no navbar/cart ── */}
              <Routes>
                <Route path="/admin/*" element={
                  <AdminGuard>
                    <AdminLayout>
                      <Routes>
                        <Route index            element={<AdminDashboard />} />
                        <Route path="products"  element={<AdminProducts />} />
                        <Route path="orders"    element={<AdminOrders />} />
                        <Route path="messages"  element={<AdminMessages />} />
                      </Routes>
                    </AdminLayout>
                  </AdminGuard>
                } />

                {/* ── Public routes — main layout ── */}
                <Route path="/*" element={
                  <>
                    <BurgerReveal />
                    <CartDrawer />
                    <MainLayout>
                      <AnimatedRoutes />
                    </MainLayout>
                  </>
                } />
              </Routes>

            </WishlistProvider>
          </CartProvider>
        </PendingActionProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
