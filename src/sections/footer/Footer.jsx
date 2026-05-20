import { motion } from 'framer-motion'
import { fadeUp, viewportOnce } from '@/animations/motion'
import { ShoppingBag, Instagram, Facebook, Twitter, Youtube } from 'lucide-react'

const footerLinks = {
  Company: ['About Us', 'Careers', 'Press', 'Blog'],
  Menu:    ['Burgers', 'Sides', 'Salads', 'Drinks', 'Desserts'],
  Support: ['Contact Us', 'FAQ', 'Locations', 'Franchising'],
  Legal:   ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
}

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Facebook,  label: 'Facebook',  href: '#' },
  { icon: Twitter,   label: 'Twitter',   href: '#' },
  { icon: Youtube,   label: 'YouTube',   href: '#' },
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
            <a
              href="#home"
              className="flex items-center gap-2 w-fit"
              aria-label="Big Burger homepage"
            >
              <div className="w-9 h-9 rounded-sm bg-flame-orange flex items-center justify-center">
                <ShoppingBag size={18} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display font-black text-white text-xl leading-none">
                Big <span className="text-flame-orange">Burger</span>
              </span>
            </a>

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
                  <li key={link}>
                    <a
                      href="#"
                      className="font-sans text-sm text-white/60 hover:text-flame-orange
                                 transition-colors duration-150
                                 focus-visible:outline-none focus-visible:text-flame-orange"
                    >
                      {link}
                    </a>
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
