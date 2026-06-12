import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Instagram, Facebook, Twitter } from 'lucide-react'
import { staggerContainer, staggerItem, fadeUp, viewportOnce } from '@/animations/motion'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { useProtectedAction } from '@/hooks/useProtectedAction'
import { useResumeAction } from '@/hooks/useResumeAction'

// ─── Contact info data ────────────────────────────────────────────
const contactInfo = [
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 79 1234 5678',
    href: 'tel:+917912345678',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@bigburger.com',
    href: 'mailto:hello@bigburger.com',
  },
  {
    icon: MapPin,
    label: 'Main Branch',
    value: '123 SG Highway, Bodakdev, Ahmedabad, Gujarat',
    href: 'https://maps.google.com',
  },
  {
    icon: Clock,
    label: 'Hours',
    value: 'Mon–Sun: 10:00 AM – 12:00 AM',
    href: null,
  },
]

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com', handle: '@bigburger' },
  { icon: Facebook,  label: 'Facebook',  href: 'https://facebook.com',  handle: 'Big Burger' },
  { icon: Twitter,   label: 'Twitter',   href: 'https://twitter.com',   handle: '@bigburger' },
]

const subjects = [
  'General Inquiry',
  'Order Issue',
  'Feedback',
  'Catering Request',
  'Franchising',
  'Other',
]

// ─── Form field components ────────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-sans font-semibold text-sm text-espresso">
        {label}
      </label>
      {children}
      {error && (
        <span className="font-sans text-xs text-red-500">{error}</span>
      )}
    </div>
  )
}

const inputClass = `w-full px-4 py-3 rounded-sm border-2 border-espresso bg-white
  font-sans text-sm text-espresso placeholder:text-muted-taupe
  focus:outline-none focus:border-flame-orange
  transition-colors duration-150`

// ─── Page ─────────────────────────────────────────────────────────
const STORAGE_KEY = 'contact_form_draft'

const emptyForm = { name: '', email: '', phone: '', subject: '', message: '' }

function loadDraft() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    return saved ? { ...emptyForm, ...JSON.parse(saved) } : emptyForm
  } catch {
    return emptyForm
  }
}

export default function ContactPage() {
  const { user } = useAuth()
  const [form, setForm] = useState(loadDraft)
  const [errors, setErrors]       = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Persist form data to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(form))
  }, [form])

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'Name is required'
    if (!form.email.trim())   e.email   = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.subject)        e.subject = 'Please select a subject'
    if (!form.message.trim()) e.message = 'Message is required'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  // The actual submission logic — called directly when authed,
  // or replayed automatically by PendingActionContext after sign-in
  const doSubmit = useCallback(async () => {
    const e2 = validate()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }

    setLoading(true)
    setSubmitError('')

    try {
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert({
          name:    form.name.trim(),
          email:   form.email.trim(),
          phone:   form.phone.trim() || null,
          subject: form.subject,
          message: form.message.trim(),
        })

      if (dbError) throw new Error(dbError.message)

      try {
        await supabase.functions.invoke('send-contact-confirmation', {
          body: { name: form.name.trim(), email: form.email.trim(), subject: form.subject },
        })
      } catch {
        // Email failure is non-fatal
      }

      sessionStorage.removeItem(STORAGE_KEY)
      setSubmitted(true)
    } catch (err) {
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form])

  // Wrap with auth gate — if user is not signed in, modal opens;
  // after sign-in, doSubmit() runs automatically
  const protectedSubmit = useProtectedAction(doSubmit, 'contact')

  const handleSubmit = (e) => {
    e.preventDefault()

    // Run form validation first — no point opening auth modal if form is invalid
    const e2 = validate()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }

    protectedSubmit()
  }

  // Resume after Google OAuth round-trip
  useResumeAction('contact', doSubmit)

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
            Get In Touch
          </motion.p>
          <motion.h1
            variants={staggerItem}
            className="font-display font-black text-white text-display-xl leading-tight"
          >
            Contact Us
          </motion.h1>
          <motion.p
            variants={staggerItem}
            className="font-sans text-base text-white/60 max-w-md leading-relaxed"
          >
            Questions, feedback, catering requests — we'd love to hear from you.
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
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 items-start">

          {/* ── Left: Contact form ── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl border-2 border-espresso p-7 md:p-10"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                /* ── Success state ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center gap-5 py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  >
                    <CheckCircle size={56} className="text-flame-orange" strokeWidth={1.5} />
                  </motion.div>
                  <h2 className="font-display font-black text-display-md text-espresso">
                    Message Sent!
                  </h2>
                  <p className="font-sans text-base text-muted-taupe max-w-sm leading-relaxed">
                    Thanks for reaching out, {form.name.split(' ')[0]}. We'll get back to you
                    within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm(emptyForm) }}
                    className="btn-outline text-sm mt-2"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                /* ── Form ── */
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  noValidate
                  className="flex flex-col gap-5"
                >
                  <div>
                    <h2 className="font-display font-black text-display-md text-espresso leading-tight">
                      Send Us a Message
                    </h2>
                    <p className="font-sans text-sm text-muted-taupe mt-1">
                      We typically respond within 24 hours.
                    </p>
                  </div>

                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Full Name *" error={errors.name}>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Arsalaan Khan"
                        className={`${inputClass} ${errors.name ? 'border-red-400' : ''}`}
                        autoComplete="name"
                      />
                    </Field>
                    <Field label="Email Address *" error={errors.email}>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="khan@gmail.com"
                        className={`${inputClass} ${errors.email ? 'border-red-400' : ''}`}
                        autoComplete="email"
                      />
                    </Field>
                  </div>

                  {/* Phone + Subject row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Phone (optional)" error={errors.phone}>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+92 300 1234567"
                        className={inputClass}
                        autoComplete="tel"
                      />
                    </Field>
                    <Field label="Subject *" error={errors.subject}>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className={`${inputClass} ${errors.subject ? 'border-red-400' : ''} cursor-pointer`}
                      >
                        <option value="">Select a subject</option>
                        {subjects.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  {/* Message */}
                  <Field label="Message *" error={errors.message}>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help..."
                      rows={5}
                      className={`${inputClass} resize-none ${errors.message ? 'border-red-400' : ''}`}
                    />
                  </Field>

                  {/* Submit */}
                  {submitError && (
                    <p className="font-sans text-sm text-red-500">{submitError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary self-start gap-2 min-w-[160px] justify-center
                               disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        Send Message
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Right: Contact info + social ── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-5"
          >
            {/* Contact info card */}
            <motion.div
              variants={staggerItem}
              className="bg-espresso rounded-xl border-2 border-espresso p-7
                         flex flex-col gap-5"
            >
              <h3 className="font-display font-black text-white text-display-md leading-tight">
                Get In Touch
              </h3>
              <div className="flex flex-col gap-4">
                {contactInfo.map((item) => {
                  const Icon = item.icon
                  const content = (
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-sm bg-flame-orange/20
                                      flex items-center justify-center shrink-0">
                        <Icon size={16} className="text-flame-orange" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-sans font-bold text-xs text-white/50 uppercase tracking-wider">
                          {item.label}
                        </span>
                        <span className="font-sans text-sm text-white leading-snug">
                          {item.value}
                        </span>
                      </div>
                    </div>
                  )
                  return item.href ? (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity duration-150"
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={item.label}>{content}</div>
                  )
                })}
              </div>
            </motion.div>

            {/* Social links card */}
            <motion.div
              variants={staggerItem}
              className="bg-white rounded-xl border-2 border-espresso p-7
                         flex flex-col gap-4"
            >
              <h3 className="font-sans font-extrabold text-base text-espresso">
                Follow Us
              </h3>
              <div className="flex flex-col gap-3">
                {socialLinks.map(({ icon: Icon, label, href, handle }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 group"
                    aria-label={`Follow us on ${label}`}
                  >
                    <div className="w-9 h-9 rounded-sm bg-soft-sand border-2 border-espresso
                                    flex items-center justify-center
                                    group-hover:bg-flame-orange group-hover:border-flame-orange
                                    transition-colors duration-200">
                      <Icon size={16} className="text-espresso group-hover:text-white
                                                  transition-colors duration-200" />
                    </div>
                    <div className="flex flex-col gap-0">
                      <span className="font-sans font-semibold text-sm text-espresso
                                       group-hover:text-flame-orange transition-colors duration-150">
                        {label}
                      </span>
                      <span className="font-sans text-xs text-muted-taupe">{handle}</span>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* FAQ teaser */}
            <motion.div
              variants={staggerItem}
              className="bg-mustard rounded-xl border-2 border-espresso p-6
                         flex flex-col gap-3"
            >
              <h3 className="font-sans font-extrabold text-base text-espresso">
                Common Questions
              </h3>
              {[
                'Do you offer catering for events?',
                'Can I customize my burger?',
                'Do you have vegetarian options?',
              ].map((q) => (
                <div key={q} className="flex items-start gap-2">
                  <span className="text-flame-orange font-bold text-sm mt-0.5">→</span>
                  <span className="font-sans text-sm text-espresso">{q}</span>
                </div>
              ))}
              <p className="font-sans text-xs text-espresso/60 mt-1">
                Send us a message and we'll answer any question you have.
              </p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
