'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

function StatCard({
  label,
  value,
  sub,
  borderColor = 'border-[#D4A017]/30',
}: {
  label: string
  value: string | number
  sub?: string
  borderColor?: string
}) {
  return (
    <div className={`bg-white border-l-4 ${borderColor} rounded-lg px-5 py-5 shadow-sm`}>
      <p className="font-syndicatgrotesk text-[10px] tracking-[0.2em] uppercase text-[#8A7A6A]">{label}</p>
      <p className="font-brandon text-2xl font-black text-[#1A1A1A] mt-1 leading-none">{value}</p>
      {sub && <p className="font-syndicatgrotesk text-[10px] text-[#C4B49A] mt-1">{sub}</p>}
    </div>
  )
}

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  paid: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function AdminDashboard() {
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token ?? ''
  }

  const fetchAll = async () => {
    const token = await getToken()
    const h = { Authorization: `Bearer ${token}` }
    const [pr, or, cr] = await Promise.all([
      fetch('/api/admin/products', { headers: h }).then(r => r.json()),
      fetch('/api/admin/orders', { headers: h }).then(r => r.json()),
      fetch('/api/admin/categories', { headers: h }).then(r => r.json()),
    ])
    setProducts(pr.data || [])
    setOrders(or.data || [])
    setCategories(cr.data || [])
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Hide this product from the store?')) return
    setDeletingId(id)
    const token = await getToken()
    await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    setDeletingId(null)
    fetchAll()
  }

  const revenue = orders.reduce((a, o) => a + (o.total || 0), 0)
  const pendingCount = orders.filter(o => ['pending', 'Pending'].includes(o.status ?? '')).length
  const activeProducts = products.filter(p => p.is_active !== false).length
  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  )

  const getThumb = (img?: string) => {
    if (!img) return null
    try {
      const a = JSON.parse(img)
      return Array.isArray(a) ? a[0] : img
    } catch { return img }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center gap-3">
        {[0, 150, 300].map(d => (
          <span key={d} className="w-2 h-2 bg-[#D4A017] rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
        ))}
        <span className="font-syndicatgrotesk text-[11px] tracking-widest uppercase text-[#C4B49A] ml-2">Loading…</span>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-brandon text-2xl font-black uppercase tracking-tight text-[#1A1A1A]">Dashboard</h1>
          <p className="font-syndicatgrotesk text-[11px] tracking-[0.15em] text-[#8A7A6A] mt-0.5">
            Sri Devi Kangan · Admin
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#D4A017] text-[#0D0D0D] font-syndicatgrotesk text-[10px] font-bold tracking-[0.22em] uppercase hover:bg-[#B8860B] transition-colors"
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Product
        </Link>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Products" value={activeProducts} sub={`${products.length} total`} borderColor="border-[#D4A017]" />
        <StatCard label="Categories" value={categories.filter(c => c.is_active).length} sub={`${categories.length} total`} borderColor="border-purple-400" />
        <StatCard label="Pending Orders" value={pendingCount} sub={`${orders.length} total`} borderColor="border-amber-400" />
        <StatCard label="Revenue" value={`₹${revenue.toLocaleString('en-IN')}`} sub="All time" borderColor="border-green-400" />
      </div>

      {/* ── Products table ── */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="font-brandon text-lg font-black uppercase tracking-tight text-[#1A1A1A]">Products</h2>
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full sm:w-56 px-3 py-2 border border-[#E8E0D5] bg-white text-sm font-syndicatgrotesk text-[#1A1A1A] placeholder-[#C4B49A] outline-none focus:border-[#D4A017] transition-colors"
          />
        </div>

        <div className="bg-white border border-[#E8E0D5] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-[#FAF7F2] border-b border-[#E8E0D5]">
                <tr>
                  {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-syndicatgrotesk text-[9px] tracking-[0.22em] uppercase text-[#8A7A6A] font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const thumb = getThumb(p.image)
                  const stock = p.stock ?? null
                  const isActive = p.is_active !== false
                  return (
                    <tr key={p.id} className={`border-b border-[#F0EBE1] hover:bg-[#FAF7F2] transition-colors ${i % 2 === 0 ? '' : 'bg-[#FDFCFA]'}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {thumb
                            ? <img src={thumb} alt={p.name} className="w-9 h-9 object-cover border border-[#E8E0D5] flex-shrink-0" />
                            : <div className="w-9 h-9 bg-[#F0EBE1] flex items-center justify-center flex-shrink-0">
                                <svg width="14" height="14" fill="none" stroke="#C4B49A" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                              </div>
                          }
                          <span className="font-brandon text-sm font-black text-[#1A1A1A] line-clamp-1">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-syndicatgrotesk text-[11px] text-[#8A7A6A]">
                        {p.categories?.name || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-brandon text-sm font-black text-[#1A1A1A]">₹{p.price?.toLocaleString('en-IN')}</span>
                        {p.original_price && (
                          <span className="font-syndicatgrotesk text-[10px] text-[#C4B49A] line-through ml-1">₹{p.original_price?.toLocaleString('en-IN')}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {stock !== null ? (
                          <span className={`font-syndicatgrotesk text-[10px] font-semibold px-2 py-0.5 ${
                            stock === 0 ? 'bg-red-100 text-red-700' :
                            stock <= 5 ? 'bg-amber-100 text-amber-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {stock === 0 ? 'Out' : `${stock} left`}
                          </span>
                        ) : (
                          <span className="font-syndicatgrotesk text-[10px] text-[#C4B49A]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-syndicatgrotesk text-[10px] font-semibold px-2 py-0.5 ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {isActive ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => router.push(`/admin/products/${p.id}`)}
                            className="font-syndicatgrotesk text-[10px] tracking-[0.1em] uppercase text-[#D4A017] hover:text-[#B8860B] font-semibold transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            disabled={deletingId === p.id}
                            className="font-syndicatgrotesk text-[10px] tracking-[0.1em] uppercase text-red-500 hover:text-red-700 font-semibold transition-colors disabled:opacity-40"
                          >
                            {deletingId === p.id ? '…' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center font-syndicatgrotesk text-[11px] tracking-wider uppercase text-[#C4B49A]">
                      {search ? 'No products match your search' : 'No products yet'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Recent orders ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-brandon text-lg font-black uppercase tracking-tight text-[#1A1A1A]">Recent Orders</h2>
          <Link href="/admin/orders" className="font-syndicatgrotesk text-[10px] tracking-[0.15em] uppercase text-[#D4A017] hover:text-[#B8860B] transition-colors">
            View all →
          </Link>
        </div>
        <div className="bg-white border border-[#E8E0D5] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead className="bg-[#FAF7F2] border-b border-[#E8E0D5]">
                <tr>
                  {['Order ID', 'Date', 'Total', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-syndicatgrotesk text-[9px] tracking-[0.22em] uppercase text-[#8A7A6A] font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 6).map((o, i) => (
                  <tr key={o.id} className={`border-b border-[#F0EBE1] hover:bg-[#FAF7F2] transition-colors ${i % 2 === 0 ? '' : 'bg-[#FDFCFA]'}`}>
                    <td className="px-4 py-3 font-mono text-[11px] text-[#8A7A6A]">{o.id?.slice(0, 8)}…</td>
                    <td className="px-4 py-3 font-syndicatgrotesk text-[11px] text-[#8A7A6A]">
                      {new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-4 py-3 font-brandon text-sm font-black text-[#1A1A1A]">
                      ₹{(o.total || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-syndicatgrotesk text-[10px] font-semibold px-2 py-0.5 capitalize ${STATUS_BADGE[o.status?.toLowerCase()] || 'bg-gray-100 text-gray-600'}`}>
                        {o.status || 'pending'}
                      </span>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-10 text-center font-syndicatgrotesk text-[11px] tracking-wider uppercase text-[#C4B49A]">
                      No orders yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
