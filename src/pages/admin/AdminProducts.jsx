import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Check, AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const CATEGORIES = ['burgers', 'sides', 'salads', 'drinks', 'desserts']

const emptyForm = {
  name: '', description: '', ingredients: '',
  price: '', calories: '', stock: '', category: 'burgers',
  image: '', badge: '',
}

// ── Inline field ──────────────────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-sans text-xs font-semibold text-espresso uppercase tracking-wider">
        {label}
      </label>
      {children}
      {error && <p className="font-sans text-xs text-red-500">{error}</p>}
    </div>
  )
}

const inputCls = `w-full px-3 py-2.5 rounded-lg border-2 border-espresso/20 bg-white
  font-sans text-sm text-espresso placeholder:text-muted-taupe
  focus:outline-none focus:border-flame-orange transition-colors duration-150`

// ── Product form modal ────────────────────────────────────────────
function ProductModal({ product, onClose, onSaved }) {
  const isEdit = Boolean(product?.id)
  const [form, setForm]     = useState(product ? { ...product } : { ...emptyForm })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [serverErr, setServerErr] = useState('')

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.name.trim())        e.name        = 'Required'
    if (!form.price)               e.price       = 'Required'
    else if (isNaN(Number(form.price)) || Number(form.price) < 0) e.price = 'Must be a positive number'
    if (!form.category)            e.category    = 'Required'
    if (form.stock === '' || form.stock === null) e.stock = 'Required'
    else if (isNaN(Number(form.stock)) || Number(form.stock) < 0) e.stock = 'Must be 0 or more'
    return e
  }

  const handleSave = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setSaving(true)
    setServerErr('')

    const payload = {
      name:        form.name.trim(),
      description: form.description?.trim() || null,
      ingredients: form.ingredients?.trim() || null,
      price:       Number(form.price),
      calories:    form.calories ? Number(form.calories) : null,
      stock:       Number(form.stock),
      category:    form.category,
      image:       form.image?.trim() || null,
      badge:       form.badge?.trim() || null,
    }

    let error
    if (isEdit) {
      ;({ error } = await supabase.from('products').update(payload).eq('id', product.id))
    } else {
      ;({ error } = await supabase.from('products').insert(payload))
    }

    setSaving(false)
    if (error) { setServerErr(error.message); return }
    onSaved()
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      />
      {/* Modal */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.95, y: 16 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 16 }}
          className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border-2 border-espresso
                     overflow-y-auto max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-espresso/10 sticky top-0 bg-white z-10">
            <h2 className="font-display font-black text-xl text-espresso">
              {isEdit ? 'Edit Product' : 'Add Product'}
            </h2>
            <button onClick={onClose} className="text-muted-taupe hover:text-espresso transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name *" error={errors.name}>
                <input className={inputCls} value={form.name}
                  onChange={(e) => set('name', e.target.value)} placeholder="Beef Burger" />
              </Field>
              <Field label="Category *" error={errors.category}>
                <select className={inputCls} value={form.category}
                  onChange={(e) => set('category', e.target.value)}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Description" error={null}>
              <textarea className={`${inputCls} resize-none`} rows={2} value={form.description || ''}
                onChange={(e) => set('description', e.target.value)} placeholder="Short description..." />
            </Field>

            <Field label="Ingredients" error={null}>
              <input className={inputCls} value={form.ingredients || ''}
                onChange={(e) => set('ingredients', e.target.value)}
                placeholder="Beef, lettuce, tomato..." />
            </Field>

            <div className="grid grid-cols-3 gap-4">
              <Field label="Price (₹) *" error={errors.price}>
                <input type="number" min="0" className={inputCls} value={form.price}
                  onChange={(e) => set('price', e.target.value)} placeholder="45" />
              </Field>
              <Field label="Calories" error={null}>
                <input type="number" min="0" className={inputCls} value={form.calories || ''}
                  onChange={(e) => set('calories', e.target.value)} placeholder="540" />
              </Field>
              <Field label="Stock *" error={errors.stock}>
                <input type="number" min="0" className={inputCls} value={form.stock}
                  onChange={(e) => set('stock', e.target.value)} placeholder="100" />
              </Field>
            </div>

            <Field label="Image URL" error={null}>
              <input className={inputCls} value={form.image || ''}
                onChange={(e) => set('image', e.target.value)}
                placeholder="https://images.unsplash.com/..." />
            </Field>

            <Field label="Badge (optional)" error={null}>
              <input className={inputCls} value={form.badge || ''}
                onChange={(e) => set('badge', e.target.value)}
                placeholder="Popular / Premium / 🌶 Hot" />
            </Field>

            {serverErr && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <AlertTriangle size={14} className="text-red-500 shrink-0" />
                <p className="font-sans text-xs text-red-600">{serverErr}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-espresso/10 flex justify-end gap-3 sticky bottom-0 bg-white">
            <button onClick={onClose} className="btn-outline text-sm px-5">Cancel</button>
            <button onClick={handleSave} disabled={saving}
              className="btn-primary text-sm px-5 gap-2 disabled:opacity-60">
              {saving
                ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                : <Check size={15} />
              }
              {isEdit ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}

// ── Delete confirmation ───────────────────────────────────────────
function DeleteConfirm({ product, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    await supabase.from('products').delete().eq('id', product.id)
    setDeleting(false)
    onDeleted()
  }

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
          className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border-2 border-espresso p-6
                     flex flex-col gap-4 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <Trash2 size={20} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-display font-black text-lg text-espresso">Delete Product?</h3>
            <p className="font-sans text-sm text-muted-taupe mt-1">
              <span className="font-semibold text-espresso">"{product.name}"</span> will be permanently removed.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-outline flex-1 text-sm">Cancel</button>
            <button onClick={handleDelete} disabled={deleting}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-sans font-semibold
                         text-sm py-2.5 rounded-xl transition-colors disabled:opacity-60">
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}

// ── Main page ─────────────────────────────────────────────────────
export default function AdminProducts() {
  const [products, setProducts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [modal, setModal]         = useState(null)   // null | 'add' | product object (edit)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [search, setSearch]       = useState('')
  const [catFilter, setCatFilter] = useState('all')

  const fetchProducts = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('category')
      .order('name')
    setProducts(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  const filtered = products.filter((p) => {
    const matchCat  = catFilter === 'all' || p.category === catFilter
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-black text-3xl text-espresso">Products</h1>
          <p className="font-sans text-sm text-muted-taupe mt-1">{products.length} items in menu</p>
        </div>
        <button
          onClick={() => setModal('add')}
          className="btn-primary text-sm gap-2"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border-2 border-espresso/20 bg-white
                     font-sans text-sm focus:outline-none focus:border-flame-orange
                     transition-colors placeholder:text-muted-taupe"
        />
        <div className="flex gap-2 flex-wrap">
          {['all', ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={`px-3 py-2 rounded-lg font-sans font-semibold text-xs border-2
                          transition-all duration-150 capitalize
                          ${catFilter === c
                            ? 'bg-espresso text-white border-espresso'
                            : 'bg-white text-espresso border-espresso/20 hover:border-espresso'
                          }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 rounded-full border-4 border-flame-orange border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-espresso/10 overflow-hidden shadow-sm">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-soft-sand border-b-2 border-espresso/10">
                <tr>
                  {['Product', 'Category', 'Price', 'Stock', 'Badge', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-sans font-bold text-xs
                                          text-espresso uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-espresso/5">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center font-sans text-sm text-muted-taupe">
                      No products found.
                    </td>
                  </tr>
                ) : filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-soft-sand/40 transition-colors">
                    <td className="px-4 py-3 flex items-center gap-3">
                      {p.image && (
                        <img src={p.image} alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover border border-espresso/10 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="font-sans font-semibold text-sm text-espresso truncate max-w-[160px]">
                          {p.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-sans text-xs bg-soft-sand text-espresso px-2 py-1
                                       rounded-full capitalize">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-sans font-bold text-sm text-espresso">
                      ₹{Number(p.price).toFixed(0)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-sans font-bold text-sm
                        ${p.stock === 0 ? 'text-red-500' : p.stock <= 10 ? 'text-amber-500' : 'text-green-600'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-sans text-xs text-muted-taupe">
                      {p.badge || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setModal(p)}
                          className="w-8 h-8 rounded-lg bg-espresso/5 hover:bg-espresso hover:text-white
                                     text-espresso flex items-center justify-center transition-colors"
                          aria-label={`Edit ${p.name}`}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-500 hover:text-white
                                     text-red-500 flex items-center justify-center transition-colors"
                          aria-label={`Delete ${p.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col divide-y divide-espresso/5">
            {filtered.length === 0 ? (
              <p className="px-4 py-12 text-center font-sans text-sm text-muted-taupe">
                No products found.
              </p>
            ) : filtered.map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                {p.image && (
                  <img src={p.image} alt={p.name}
                    className="w-12 h-12 rounded-xl object-cover border border-espresso/10 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-sans font-semibold text-sm text-espresso truncate">{p.name}</p>
                  <p className="font-sans text-xs text-muted-taupe capitalize">{p.category} · ₹{Number(p.price).toFixed(0)}</p>
                  <p className={`font-sans text-xs font-bold
                    ${p.stock === 0 ? 'text-red-500' : p.stock <= 10 ? 'text-amber-500' : 'text-green-600'}`}>
                    Stock: {p.stock}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setModal(p)}
                    className="w-8 h-8 rounded-lg bg-espresso/5 hover:bg-espresso hover:text-white
                               text-espresso flex items-center justify-center transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleteTarget(p)}
                    className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-500 hover:text-white
                               text-red-500 flex items-center justify-center transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {modal && (
          <ProductModal
            product={modal === 'add' ? null : modal}
            onClose={() => setModal(null)}
            onSaved={() => { setModal(null); fetchProducts() }}
          />
        )}
        {deleteTarget && (
          <DeleteConfirm
            product={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onDeleted={() => { setDeleteTarget(null); fetchProducts() }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
