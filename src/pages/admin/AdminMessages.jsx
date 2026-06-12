import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Mail, MailOpen, Trash2, ChevronDown, Phone, Tag, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'

// ── Helpers ───────────────────────────────────────────────────────
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  }) + ' · ' + new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit',
  })
}

// ── Message row (expandable) ──────────────────────────────────────
function MessageRow({ msg, onToggleRead, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!window.confirm('Delete this message? This cannot be undone.')) return
    setDeleting(true)
    await onDelete(msg.id)
  }

  const handleToggleRead = async (e) => {
    e.stopPropagation()
    await onToggleRead(msg.id, !msg.is_read)
  }

  return (
    <div className={`border-b border-espresso/5 last:border-0 transition-colors
                     ${!msg.is_read ? 'bg-flame-orange/[0.03]' : ''}`}>
      {/* Row header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-4 hover:bg-soft-sand/30
                   transition-colors text-left"
        aria-expanded={expanded}
      >
        {/* Unread dot */}
        <div className="shrink-0 w-2 h-2 rounded-full mt-0.5
                        transition-colors
                        ${!msg.is_read ? 'bg-flame-orange' : 'bg-transparent'}">
          {!msg.is_read && <div className="w-2 h-2 rounded-full bg-flame-orange" />}
        </div>

        <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-4 gap-2 items-center">
          {/* Name */}
          <p className={`font-sans text-sm truncate
                         ${!msg.is_read ? 'font-bold text-espresso' : 'font-medium text-espresso/80'}`}>
            {msg.name}
          </p>
          {/* Subject */}
          <p className="font-sans text-xs text-muted-taupe truncate">{msg.subject}</p>
          {/* Date — hidden on mobile */}
          <p className="hidden md:block font-sans text-xs text-muted-taupe">
            {formatDate(msg.created_at)}
          </p>
          {/* Email */}
          <p className="hidden md:block font-sans text-xs text-flame-orange truncate">
            {msg.email}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Mark read/unread */}
          <button
            onClick={handleToggleRead}
            title={msg.is_read ? 'Mark as unread' : 'Mark as read'}
            className="p-1.5 rounded-lg text-muted-taupe hover:text-espresso
                       hover:bg-soft-sand transition-colors"
          >
            {msg.is_read
              ? <Mail size={14} />
              : <MailOpen size={14} className="text-flame-orange" />
            }
          </button>
          {/* Delete */}
          <button
            onClick={handleDelete}
            disabled={deleting}
            title="Delete"
            className="p-1.5 rounded-lg text-muted-taupe hover:text-red-500
                       hover:bg-red-50 transition-colors disabled:opacity-40"
          >
            <Trash2 size={14} />
          </button>
          {/* Expand chevron */}
          <div className={`text-muted-taupe transition-transform duration-200
                           ${expanded ? 'rotate-180' : ''}`}>
            <ChevronDown size={16} />
          </div>
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 border-t border-espresso/5 flex flex-col gap-4">
              {/* Meta row */}
              <div className="flex flex-wrap gap-5 text-sm">
                <div className="flex items-center gap-1.5 text-muted-taupe">
                  <Mail size={13} />
                  <a href={`mailto:${msg.email}`}
                     className="text-flame-orange hover:underline text-xs font-medium">
                    {msg.email}
                  </a>
                </div>
                {msg.phone && (
                  <div className="flex items-center gap-1.5 text-muted-taupe">
                    <Phone size={13} />
                    <span className="text-xs">{msg.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-muted-taupe">
                  <Tag size={13} />
                  <span className="text-xs">{msg.subject}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-taupe">
                  <Clock size={13} />
                  <span className="text-xs">{formatDate(msg.created_at)}</span>
                </div>
              </div>

              {/* Message body */}
              <div className="bg-soft-sand rounded-xl p-4 border border-espresso/10">
                <p className="font-sans text-sm text-espresso leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </p>
              </div>

              {/* Reply shortcut */}
              <div>
                <a
                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                             bg-espresso text-white font-sans font-semibold text-sm
                             hover:bg-espresso/90 transition-colors"
                >
                  <Mail size={14} />
                  Reply via Email
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────
export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all') // 'all' | 'unread' | 'read'

  const fetchMessages = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchMessages() }, [])

  const handleToggleRead = async (id, is_read) => {
    await supabase.from('contact_messages').update({ is_read }).eq('id', id)
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, is_read } : m))
  }

  const handleDelete = async (id) => {
    await supabase.from('contact_messages').delete().eq('id', id)
    setMessages((prev) => prev.filter((m) => m.id !== id))
  }

  const filtered = messages.filter((m) => {
    if (filter === 'unread') return !m.is_read
    if (filter === 'read')   return m.is_read
    return true
  })

  const unreadCount = messages.filter((m) => !m.is_read).length

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-black text-3xl text-espresso">Messages</h1>
          <p className="font-sans text-sm text-muted-taupe mt-1">
            {messages.length} total · {unreadCount} unread
          </p>
        </div>
        <button
          onClick={fetchMessages}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-espresso/20
                     font-sans font-semibold text-sm text-espresso hover:bg-soft-sand
                     transition-colors"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all',    label: 'All',    count: messages.length },
          { key: 'unread', label: 'Unread', count: unreadCount },
          { key: 'read',   label: 'Read',   count: messages.length - unreadCount },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-2 rounded-lg font-sans font-semibold text-xs border-2
                        transition-all duration-150
                        ${filter === key
                          ? 'bg-espresso text-white border-espresso'
                          : 'bg-white text-espresso border-espresso/20 hover:border-espresso'
                        }`}
          >
            {label}
            <span className="ml-1 opacity-60">({count})</span>
          </button>
        ))}
      </div>

      {/* Messages list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 rounded-full border-4 border-flame-orange border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-espresso/10 overflow-hidden shadow-sm">
          {/* Column headers — desktop */}
          <div className="hidden md:grid grid-cols-4 gap-2 px-8 py-3 bg-soft-sand
                          border-b-2 border-espresso/10">
            {['Name', 'Subject', 'Date', 'Email'].map((h) => (
              <p key={h} className="font-sans font-bold text-xs text-espresso uppercase tracking-wider">
                {h}
              </p>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <Mail size={32} className="text-muted-taupe/40" />
              <p className="font-sans text-sm text-muted-taupe">No messages found.</p>
            </div>
          ) : (
            filtered.map((msg) => (
              <MessageRow
                key={msg.id}
                msg={msg}
                onToggleRead={handleToggleRead}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}
