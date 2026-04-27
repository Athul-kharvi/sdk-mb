'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Product {
  id: string
  name: string
  price: number
  original_price?: number
  stock?: number
  is_active: boolean
  category_id: string
  image?: string
  categories?: { name: string }
}

type EditRow = { price: string; original_price: string; stock: string }

export default function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [edits, setEdits] = useState<Record<string, EditRow>>({})
  const [toastMsg, setToastMsg] = useState('')

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token ?? ''
  }

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  const fetchData = async () => {
    const token = await getToken()
    const h = { Authorization: `Bearer ${token}` }
    const [pr, cr] = await Promise.all([
      fetch('/api/admin/products', { headers: h }).then(r => r.json()),
      fetch('/api/admin/categories', { headers: h }).then(r => r.json()),
    ])
    const prods: Product[] = pr.data || []
    setProducts(prods)
    setCategories(cr.data || [])
    const init: Record<string, EditRow> = {}
    prods.forEach(p => {
      init[p.id] = {
        price: String(p.price ?? ''),
        original_price: String(p.original_price ?? ''),
        stock: String(p.stock ?? ''),
      }
    })
    setEdits(init)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const setField = (id: string, field: keyof EditRow, val: string) => {
    setEdits(prev => ({ ...prev, [id]: { ...prev[id], [field]: val } }))
  }

  const handleSave = async (id: string, p: Product) => {
    setSaving(id)
    const token = await getToken()
    const e = edits[id]
    await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        price: parseFloat(e.price) || 0,
        original_price: e.original_price ? parseFloat(e.original_price) : null,
        stock: e.stock !== '' ? parseInt(e.stock) : null,
      }),
    })
    setSaving(null)
    showToast(`"${p.name}" updated`)
    fetchData()
  }

  const handleToggleActive = async (id: string, is_active: boolean) => {
    const token = await getToken()
    await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !is_active }),
    })
    showToast(is_active ? 'Product hidden from store' : 'Product visible on store')
    fetchData()
  }

  const getThumb = (img?: string) => {
    if (!img) return null
    try { const a = JSON.parse(img); return Array.isArray(a) ? a[0] : img } catch { return img }
  }

  const stockStatus = (stock: string) => {
    const n = parseInt(stock)
    if (isNaN(n) || stock === '') return null
    if (n === 0) return { label: 'Out of Stock', cls: 'bg-red-100 text-red-700' }
    if (n <= 5) return { label: 'Low', cls: 'bg-amber-100 text-amber-700' }
    return { label: 'In Stock', cls: 'bg-green-100 text-green-700' }
  }

  const hasChanged = (id: string, p: Product) => {
    const e = edits[id]
    if (!e) return false
    return (
      e.price !== String(p.price ?? '') ||
      e.original_price !== String(p.original_price ?? '') ||
      e.stock !== String(p.stock ?? '')
    )
  }

  const filtered = products.filter(p => {
    const ms = p.name?.toLowerCase().includes(search.toLowerCase())
    const mc = !filterCat || p.category_id === filterCat
    return ms && mc
  })

  const lowStock = products.filter(p => {
    const n = parseInt(String(p.stock ?? ''))
    return !isNaN(n) && n <= 5
  }).length
  const outOfStock = products.filter(p => p.stock === 0).length

  if (loading) {
    return (
      <div className="p-8 flex items-center gap-3">
        {[0, 150, 300].map(d => (
          <span key={d} className="w-2 h-2 bg-[#D4A017] rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
        ))}
        <span className="font-syndicatgrotesk text-[11px] tracking-widest uppercase text-[#C4B49A] ml-2">Loading inventory…</span>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1A1A1A] text-[#D4A017] px-6 py-3 font-syndicatgrotesk text-[11px] tracking-[0.18em] uppercase shadow-xl">
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-brandon text-2xl font-black uppercase tracking-tight text-[#1A1A1A]">Inventory</h1>
          <p className="font-syndicatgrotesk text-[11px] tracking-[0.15em] text-[#8A7A6A] mt-0.5">
            Update prices, MRP and stock levels
          </p>
        </div>
      </div>

      {/* Alert strips */}
      {(outOfStock > 0 || lowStock > outOfStock) && (
        <div className="flex flex-wrap gap-3">
          {outOfStock > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 border-l-4 border-red-400 bg-red-50">
              <svg width="14" height="14" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
              </svg>
              <span className="font-syndicatgrotesk text-[11px] text-red-700">
                <strong>{outOfStock}</strong> item{outOfStock !== 1 ? 's' : ''} out of stock
              </span>
            </div>
          )}
          {lowStock - outOfStock > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 border-l-4 border-amber-400 bg-amber-50">
              <svg width="14" height="14" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><path d="M12 9v4M12 17h.01" />
              </svg>
              <span className="font-syndicatgrotesk text-[11px] text-amber-700">
                <strong>{lowStock - outOfStock}</strong> item{lowStock - outOfStock !== 1 ? 's' : ''} low stock
              </span>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-3 py-2.5 border border-[#E8E0D5] bg-white font-syndicatgrotesk text-sm text-[#1A1A1A] placeholder-[#C4B49A] outline-none focus:border-[#D4A017] transition-colors"
        />
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="px-3 py-2.5 border border-[#E8E0D5] bg-white font-syndicatgrotesk text-sm text-[#1A1A1A] outline-none focus:border-[#D4A017] transition-colors"
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E8E0D5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-[#FAF7F2] border-b border-[#E8E0D5]">
              <tr>
                {[
                  'Product',
                  'Category',
                  'Selling Price (₹)',
                  'MRP / Original (₹)',
                  'Stock Qty',
                  'Stock Status',
                  'Visibility',
                  'Save',
                ].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-syndicatgrotesk text-[9px] tracking-[0.22em] uppercase text-[#8A7A6A] font-semibold whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const e = edits[p.id] || { price: '', original_price: '', stock: '' }
                const st = stockStatus(e.stock)
                const thumb = getThumb(p.image)
                const changed = hasChanged(p.id, p)

                return (
                  <tr
                    key={p.id}
                    className={`border-b border-[#F0EBE1] transition-colors ${!p.is_active ? 'opacity-50' : ''} ${i % 2 === 0 ? '' : 'bg-[#FDFCFA]'} hover:bg-[#FAF7F2]`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {thumb
                          ? <img src={thumb} alt={p.name} className="w-9 h-9 object-cover border border-[#E8E0D5] flex-shrink-0" />
                          : <div className="w-9 h-9 bg-[#F0EBE1] flex-shrink-0" />
                        }
                        <span className="font-brandon text-sm font-black text-[#1A1A1A] line-clamp-1 max-w-[140px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-syndicatgrotesk text-[11px] text-[#8A7A6A] whitespace-nowrap">
                      {p.categories?.name || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number" min="0" step="0.01"
                        value={e.price}
                        onChange={v => setField(p.id, 'price', v.target.value)}
                        className="w-24 px-2 py-1.5 border border-[#E8E0D5] font-syndicatgrotesk text-sm text-[#1A1A1A] outline-none focus:border-[#D4A017] transition-colors bg-[#FDFCFA]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number" min="0" step="0.01"
                        placeholder="—"
                        value={e.original_price}
                        onChange={v => setField(p.id, 'original_price', v.target.value)}
                        className="w-24 px-2 py-1.5 border border-[#E8E0D5] font-syndicatgrotesk text-sm text-[#1A1A1A] outline-none focus:border-[#D4A017] transition-colors bg-[#FDFCFA]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number" min="0"
                        placeholder="—"
                        value={e.stock}
                        onChange={v => setField(p.id, 'stock', v.target.value)}
                        className="w-20 px-2 py-1.5 border border-[#E8E0D5] font-syndicatgrotesk text-sm text-[#1A1A1A] outline-none focus:border-[#D4A017] transition-colors bg-[#FDFCFA]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      {st ? (
                        <span className={`font-syndicatgrotesk text-[10px] font-semibold px-2 py-0.5 ${st.cls}`}>
                          {st.label}
                        </span>
                      ) : (
                        <span className="font-syndicatgrotesk text-[10px] text-[#C4B49A]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(p.id, p.is_active)}
                        className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-200 ${p.is_active ? 'bg-[#D4A017]' : 'bg-[#E8E0D5]'}`}
                        role="switch"
                        aria-checked={p.is_active}
                        aria-label={`Toggle ${p.name} visibility`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${p.is_active ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleSave(p.id, p)}
                        disabled={saving === p.id || !changed}
                        className={`px-4 py-1.5 font-syndicatgrotesk text-[10px] font-bold tracking-[0.15em] uppercase transition-colors ${
                          changed
                            ? 'bg-[#D4A017] text-[#0D0D0D] hover:bg-[#B8860B]'
                            : 'bg-[#F0EBE1] text-[#C4B49A] cursor-default'
                        } disabled:opacity-50`}
                      >
                        {saving === p.id ? '…' : 'Save'}
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-14 text-center font-syndicatgrotesk text-[11px] tracking-wider uppercase text-[#C4B49A]">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="font-syndicatgrotesk text-[10px] text-[#C4B49A] tracking-wider">
        Set MRP to show a crossed-out price on the product card. Stock ≤5 shows "Low", 0 shows "Out of Stock".
      </p>
    </div>
  )
}
