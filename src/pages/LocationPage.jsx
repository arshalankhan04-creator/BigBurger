import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Phone, Clock, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { staggerContainer, staggerItem, fadeUp, viewportOnce } from '@/animations/motion'
import { locations } from '@/data/locations'

// ── Location card ─────────────────────────────────────────────────
function LocationCard({ location, isActive, onClick }) {
  return (
    <motion.div
      variants={staggerItem}
      onClick={onClick}
      className={`rounded-xl border-2 overflow-hidden cursor-pointer
                  transition-all duration-200
                  ${isActive
                    ? 'border-flame-orange shadow-[0_0_0_3px_rgba(226,82,34,0.15)]'
                    : 'border-espresso hover:border-flame-orange/60'
                  }`}
    >
      {/* Location image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={location.image}
          alt={location.name}
          className="w-full h-full object-cover transition-transform duration-300
                     hover:scale-105"
          loading="lazy"
        />
        {/* Main badge */}
        {location.isMain && (
          <span className="absolute top-3 left-3 bg-flame-orange text-white
                           font-sans font-bold text-xs px-3 py-1 rounded-sm tracking-wide">
            Main Branch
          </span>
        )}
        {/* Active indicator */}
        {isActive && (
          <div className="absolute inset-0 bg-flame-orange/10 border-b-4 border-flame-orange" />
        )}
      </div>

      {/* Info */}
      <div className="bg-white p-5 flex flex-col gap-3">
        <h3 className="font-sans font-extrabold text-base text-espresso">
          {location.name}
        </h3>

        <div className="flex flex-col gap-2">
          {/* Address */}
          <div className="flex items-start gap-2">
            <MapPin size={14} className="text-flame-orange mt-0.5 shrink-0" />
            <span className="font-sans text-sm text-muted-taupe leading-snug">
              {location.address}, {location.city}
            </span>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-flame-orange shrink-0" />
            <a
              href={`tel:${location.phone}`}
              className="font-sans text-sm text-muted-taupe hover:text-flame-orange
                         transition-colors duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              {location.phone}
            </a>
          </div>

          {/* Hours */}
          <div className="flex items-start gap-2">
            <Clock size={14} className="text-flame-orange mt-0.5 shrink-0" />
            <div className="flex flex-col gap-0.5">
              <span className="font-sans text-sm text-muted-taupe">
                {location.hours.weekdays}
              </span>
              <span className="font-sans text-sm text-muted-taupe">
                {location.hours.weekend}
              </span>
            </div>
          </div>
        </div>

        {/* Get directions */}
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(location.address + ' ' + location.city)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="btn-primary text-xs self-start gap-1.5 mt-1"
          aria-label={`Get directions to ${location.name}`}
        >
          <ExternalLink size={12} />
          Get Directions
        </a>
      </div>
    </motion.div>
  )
}

// ── Hours accordion (mobile) ──────────────────────────────────────
function HoursAccordion({ location }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-2 border-espresso rounded-sm overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3
                   bg-white font-sans font-semibold text-sm text-espresso
                   hover:bg-soft-sand transition-colors duration-150
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame-orange"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <Clock size={14} className="text-flame-orange" />
          Opening Hours
        </span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 bg-soft-sand flex flex-col gap-1.5">
              <p className="font-sans text-sm text-muted-taupe">{location.hours.weekdays}</p>
              <p className="font-sans text-sm text-muted-taupe">{location.hours.weekend}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────
export default function LocationPage() {
  const [activeLocation, setActiveLocation] = useState(locations[0])

  return (
    <div className="min-h-screen bg-warm-cream pt-16">

      {/* ── Page hero ── */}
      <div className="bg-espresso py-16 md:py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-container mx-auto px-6 flex flex-col items-center text-center gap-4"
        >
          <motion.p variants={staggerItem} className="eyebrow text-mustard/80">
            Find Us
          </motion.p>
          <motion.h1
            variants={staggerItem}
            className="font-display font-black text-white text-display-xl leading-tight"
          >
            Our Locations
          </motion.h1>
          <motion.p
            variants={staggerItem}
            className="font-sans text-base text-white/60 max-w-md leading-relaxed"
          >
            {locations.length} locations across the city — there's always a Big Burger near you.
          </motion.p>
        </motion.div>
      </div>

      {/* Wave */}
      <div aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-10 md:h-14 block">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="#3D1B11" />
        </svg>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">

          {/* ── Left: Location cards ── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-5"
          >
            <motion.p variants={staggerItem} className="eyebrow">
              Select a Location
            </motion.p>
            {locations.map((loc) => (
              <LocationCard
                key={loc.id}
                location={loc}
                isActive={activeLocation.id === loc.id}
                onClick={() => setActiveLocation(loc)}
              />
            ))}
          </motion.div>

          {/* ── Right: Map + details ── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-5 lg:sticky lg:top-24"
          >
            {/* Map iframe */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLocation.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl overflow-hidden border-2 border-espresso
                           aspect-video w-full bg-soft-sand"
              >
                <iframe
                  src={activeLocation.mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map for ${activeLocation.name}`}
                  className="w-full h-full"
                />
              </motion.div>
            </AnimatePresence>

            {/* Active location detail card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`detail-${activeLocation.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-xl border-2 border-espresso p-6
                           flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display font-black text-display-md text-espresso leading-tight">
                      {activeLocation.name}
                    </h2>
                    <p className="font-sans text-sm text-muted-taupe mt-1">
                      {activeLocation.address}, {activeLocation.city}
                    </p>
                  </div>
                  {activeLocation.isMain && (
                    <span className="shrink-0 bg-flame-orange text-white font-sans font-bold
                                     text-xs px-3 py-1 rounded-sm tracking-wide">
                      Main
                    </span>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t-2 border-espresso/10" />

                {/* Hours grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-sans font-bold text-xs text-espresso uppercase tracking-wider">
                      Weekdays
                    </span>
                    <span className="font-sans text-sm text-muted-taupe">
                      {activeLocation.hours.weekdays.replace('Mon – Fri: ', '')}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-sans font-bold text-xs text-espresso uppercase tracking-wider">
                      Weekend
                    </span>
                    <span className="font-sans text-sm text-muted-taupe">
                      {activeLocation.hours.weekend.replace('Sat – Sun: ', '')}
                    </span>
                  </div>
                </div>

                {/* Phone + directions */}
                <div className="flex items-center gap-3 flex-wrap">
                  <a
                    href={`tel:${activeLocation.phone}`}
                    className="btn-outline text-sm gap-2"
                  >
                    <Phone size={14} />
                    {activeLocation.phone}
                  </a>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(activeLocation.address + ' ' + activeLocation.city)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-sm gap-2"
                  >
                    <ExternalLink size={14} />
                    Get Directions
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

        </div>
      </div>

      {/* ── Bottom info strip ── */}
      <section className="bg-soft-sand border-t-2 border-espresso/10 py-12 mt-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="max-w-container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: Clock,
              title: 'Open 7 Days',
              desc: 'All locations open every day of the week including public holidays.',
            },
            {
              icon: Phone,
              title: 'Call Ahead',
              desc: 'Call your nearest branch to pre-order or reserve a table for groups.',
            },
            {
              icon: MapPin,
              title: 'Easy Parking',
              desc: 'All locations have dedicated parking available for dine-in customers.',
            },
          ].map((item) => {
            const Icon = item.icon
            return (
              <motion.div key={item.title} variants={staggerItem} className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-flame-orange/10 border-2 border-flame-orange/20
                                flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-flame-orange" />
                </div>
                <div>
                  <h3 className="font-sans font-extrabold text-sm text-espresso mb-1">
                    {item.title}
                  </h3>
                  <p className="font-sans text-sm text-muted-taupe leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

    </div>
  )
}
