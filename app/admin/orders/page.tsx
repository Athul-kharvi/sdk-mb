'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  paid: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  Pending: 'bg-amber-100 text-amber-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-indigo-100 text-indigo-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token ?? ''
  }

  const fetchOrders = async () => {
    const token = await getToken()
    const res = await fetch('/api/admin/orders', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setOrders(data.data || [])
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [])

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id)
    const token = await getToken()
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setUpdatingId(null)
    fetchOrders()
  }

  const revenue = orders.reduce((a, o) => a + (o.total || 0), 0)

  const filtered = orders.filter(o => {
    const ms = !search ||
      o.id?.toLowerCase().includes(search.toLowerCase()) ||
      o.address?.toLowerCase().includes(search.toLowerCase())
    const mf = !filterStatus || o.status?.toLowerCase() === filterStatus
    return ms && mf
  })

  const statusCount = (s: string) =>
    orders.filter(o => o.status?.toLowerCase() === s).length

  if (loading) {
    return (
      <div className="p-8 flex items-center gap-3">
        {[0, 150, 300].map(d => (
          <span key={d} className="w-2 h-2 bg-[#D4A017] rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
        ))}
        <span className="font-syndicatgrotesk text-[11px] tracking-widest uppercase text-[#C4B49A] ml-2">Loading orders…</span>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">

      {/* Header */}
      <div>
        <h1 className="font-brandon text-2xl font-black uppercase tracking-tight text-[#1A1A1A]">Orders</h1>
        <p className="font-syndicatgrotesk text-[11px] tracking-[0.15em] text-[#8A7A6A] mt-0.5">
          {orders.length} total orders · ₹{revenue.toLocaleString('en-IN')} revenue
        </p>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATUS_OPTIONS.slice(0, 4).map(s => {
          const count = statusCount(s)
          const active = filterStatus === s
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(active ? '' : s)}
              className={`text-left p-4 border transition-all ${
                active
                  ? 'border-[#D4A017] bg-[#D4A017]/5'
                  : 'border-[#E8E0D5] bg-white hover:border-[#D4A017]/40'
              }`}
            >
              <p className="font-syndicatgrotesk text-[9px] tracking-[0.2em] uppercase capitalize text-[#8A7A6A]">{s}</p>
              <p className="font-brandon text-xl font-black text-[#1A1A1A] mt-1">{count}</p>
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by Order ID or customer address…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-3 py-2.5 border border-[#E8E0D5] bg-white font-syndicatgrotesk text-sm text-[#1A1A1A] placeholder-[#C4B49A] outline-none focus:border-[#D4A017] transition-colors"
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2.5 border border-[#E8E0D5] bg-white font-syndicatgrotesk text-sm text-[#1A1A1A] outline-none focus:border-[#D4A017] transition-colors"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s} className="capitalize">
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E8E0D5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="bg-[#FAF7F2] border-b border-[#E8E0D5]">
              <tr>
                {['Order ID', 'Date', 'Customer', 'Items', 'Total', 'Status', 'Update'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-syndicatgrotesk text-[9px] tracking-[0.22em] uppercase text-[#8A7A6A] font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => (
                <tr
                  key={o.id}
                  className={`border-b border-[#F0EBE1] transition-colors align-top hover:bg-[#FAF7F2] ${i % 2 === 0 ? '' : 'bg-[#FDFCFA]'}`}
                >
                  <td className="px-4 py-3 font-mono text-[11px] text-[#8A7A6A] whitespace-nowrap">
                    {o.id?.slice(0, 8)}…
                  </td>
                  <td className="px-4 py-3 font-syndicatgrotesk text-[11px] text-[#8A7A6A] whitespace-nowrap">
                    {new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </td>
                  <td className="px-4 py-3 max-w-[180px]">
                    {o.address ? (
                      <div className="space-y-0.5">
                        {o.address.split(' | ').slice(0, 3).map((line: string, j: number) => {
                          const [k, v] = line.split(': ')
                          return (
                            <p key={j} className="font-syndicatgrotesk text-[10px] text-[#8A7A6A] line-clamp-1">
                              <span className="text-[#1A1A1A] font-semibold">{k}:</span> {v}
                            </p>
                          )
                        })}
                      </div>
                    ) : (
                      <span className="font-syndicatgrotesk text-[10px] text-[#C4B49A]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 max-w-[160px]">
                    <div className="space-y-1">
                      {o.order_items?.slice(0, 3).map((item: any) => (
                        <p key={item.id} className="font-syndicatgrotesk text-[10px] text-[#8A7A6A] line-clamp-1">
                          {item.products?.name || 'Item'} ×{item.quantity}
                        </p>
                      ))}
                      {(o.order_items?.length || 0) > 3 && (
                        <p className="font-syndicatgrotesk text-[10px] text-[#C4B49A]">+{o.order_items.length - 3} more</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-brandon text-sm font-black text-[#1A1A1A] whitespace-nowrap">
                    ₹{(o.total || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-syndicatgrotesk text-[10px] font-semibold px-2 py-0.5 capitalize whitespace-nowrap ${STATUS_BADGE[o.status] || 'bg-gray-100 text-gray-600'}`}>
                      {o.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status?.toLowerCase() || 'pending'}
                      onChange={e => handleStatusChange(o.id, e.target.value)}
                      disabled={updatingId === o.id}
                      className="border border-[#E8E0D5] bg-white px-2 py-1.5 font-syndicatgrotesk text-[11px] text-[#1A1A1A] outline-none focus:border-[#D4A017] transition-colors disabled:opacity-50 capitalize"
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s} className="capitalize">
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-14 text-center font-syndicatgrotesk text-[11px] tracking-wider uppercase text-[#C4B49A]">
                    {search || filterStatus ? 'No orders match your filters' : 'No orders yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
