import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fadeUp, viewportOnce } from '@/animations/motion'
import { ShoppingBag, Instagram, Facebook, Twitter, Youtube } from 'lucide-react'

// to: internal route, href: external URL, disabled: not yet available
const footerLinks = {
  Company: [
    { label: 'About Us',  to: '/about' },
    { label: 'Wishlist',  to: '/wishlist' },
    { label: 'Careers',   disabled: true },
    { label: 'Press',     disabled: true },
    { label: 'Blog',      disabled: true },
  ],
  Menu: [
    { label: 'Burgers',  to: '/menu?category=burgers' },
    { label: 'Sides',    to: '/menu?category=sides' },
    { label: 'Salads',   to: '/menu?category=salads' },
    { label: 'Drinks',   to: '/menu?category=drinks' },
    { label: 'Desserts', to: '/menu?category=desserts' },
  ],
  Support: [
    { label: 'Contact Us',   to: '/contact' },
    { label: 'Rewards',      to: '/rewards' },
    { label: 'Deals',        to: '/deals' },
    { label: 'Track Order',  to: '/track-order' },
    { label: 'FAQ',          to: '/faq' },
    { label: 'Locations',    to: '/location' },
    { label: 'Franchising',  disabled: true },
  ],
  Legal: [
    { label: 'Privacy Policy',    disabled: true },
    { label: 'Terms of Service',  disabled: true },
    { label: 'Cookie Policy',     disabled: true },
  ],
}

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
  { icon: Facebook,  label: 'Facebook',  href: 'https://facebook.com' },
  { icon: Twitter,   label: 'Twitter',   href: 'https://twitter.com' },
  { icon: Youtube,   label: 'YouTube',   href: 'https://youtube.com' },
]

export default function Footer() {
  return (
    <footer
      className="bg-espresso text-white"
      aria-label="Site footer"
    >
      {/* ── Main footer content ── */}
      <div className="max-w-container mx-auto px-6 py-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10"
        >
          {/* Brand column */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 w-fit"
              aria-label="Big Burger homepage"
            >
              <div className="w-9 h-9 rounded-sm bg-flame-orange flex items-center justify-center">
                <ShoppingBag size={18} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display font-black text-white text-xl leading-none">
                Big <span className="text-flame-orange">Burger</span>
              </span>
            </Link>

            <p className="font-sans text-sm text-white/60 leading-relaxed max-w-xs">
              Real flame. Real flavor. Real good. Serving craft burgers
              with love since 1980.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-sm bg-white/10 hover:bg-flame-orange
                             flex items-center justify-center
                             transition-colors duration-200
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame-orange"
                >
                  <Icon size={16} className="text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading} className="flex flex-col gap-4">
              <h4 className="font-sans font-bold text-sm text-white uppercase tracking-wider">
                {heading}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.disabled ? (
                      // Disabled — page not yet available
                      <span
                        className="font-sans text-sm text-white/30 cursor-not-allowed
                                   flex items-center gap-1.5"
                        title="Coming soon"
                        aria-disabled="true"
                      >
                        {link.label}
                        <span className="text-[10px] text-white/25 font-sans">soon</span>
                      </span>
                    ) : (
                      // Active internal link
                      <Link
                        to={link.to}
                        className="font-sans text-sm text-white/60 hover:text-flame-orange
                                   transition-colors duration-150
                                   focus-visible:outline-none focus-visible:text-flame-orange"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/10">
        <div className="max-w-container mx-auto px-6 py-5
                        flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-xs text-white/40">
            © {new Date().getFullYear()} Big Burger. All rights reserved.
          </p>
          <p className="font-sans text-xs text-white/40">
            Made with ❤️ for food lovers everywhere
          </p>
        </div>
      </div>
    </footer>
  )
}
