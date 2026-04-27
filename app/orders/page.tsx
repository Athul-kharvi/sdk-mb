'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'

const STATUS_STYLES: Record<string, string> = {
  pending:    'bg-amber-500/10 border-amber-500/30 text-amber-400',
  processing: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  shipped:    'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
  delivered:  'bg-green-500/10 border-green-500/30 text-green-400',
  paid:       'bg-green-500/10 border-green-500/30 text-green-400',
  cancelled:  'bg-red-500/10 border-red-500/30 text-red-400',
}

function getFirstImage(raw: string | undefined): string | undefined {
  if (!raw) return undefined
  try {
    const arr = JSON.parse(raw)
    if (Array.isArray(arr) && arr.length > 0) return arr[0]
  } catch {}
  return raw
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/signin'); return }

      try {
        const res = await fetch('/api/user/orders', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        const data = await res.json()
        setOrders(data.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-site-black text-ivory flex items-center justify-center gap-2">
        {[0, 150, 300].map(d => (
          <span key={d} className="w-2 h-2 bg-rich-gold rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-site-black text-ivory">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-px bg-gradient-to-r from-transparent to-rich-gold" />
            <span className="font-syndicatgrotesk text-[9px] tracking-[0.35em] uppercase text-rich-gold/80">Account</span>
            <div className="w-10 h-px bg-gradient-to-l from-transparent to-rich-gold" />
          </div>
          <h1 className="font-brandon text-3xl sm:text-4xl font-black uppercase tracking-tight text-ivory">
            My Orders
          </h1>
          <p className="font-syndicatgrotesk text-xs text-muted-taupe mt-1">
            {orders.length} order{orders.length !== 1 ? 's' : ''} placed
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-[#111] border border-white/8 px-8 py-16 text-center">
            <svg className="w-12 h-12 text-white/10 mx-auto mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="font-syndicatgrotesk text-xs tracking-[0.15em] uppercase text-muted-taupe mb-6">
              No orders yet
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-rich-gold text-[#0D0D0D] font-syndicatgrotesk text-[10px] font-bold tracking-[0.22em] uppercase hover:bg-[#B8860B] transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const isOpen = expanded === order.id
              return (
                <div key={order.id} className="bg-[#111] border border-white/8 overflow-hidden">

                  {/* Order header row — click to expand */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : order.id)}
                    className="w-full px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 text-left hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Left: date + ID */}
                    <div className="flex-1">
                      <p className="font-syndicatgrotesk text-[9px] tracking-[0.2em] uppercase text-muted-taupe mb-0.5">
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="font-mono text-[11px] text-ivory/60">#{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>

                    {/* Middle: item count */}
                    <div className="sm:w-32 text-left sm:text-center">
                      <p className="font-syndicatgrotesk text-xs text-ivory/70">
                        {order.order_items?.length || 0} item{(order.order_items?.length || 0) !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="sm:w-28 flex sm:justify-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 border font-syndicatgrotesk text-[9px] tracking-[0.15em] uppercase ${STATUS_STYLES[order.status?.toLowerCase()] || STATUS_STYLES.pending}`}>
                        <span className="w-1 h-1 rounded-full bg-current" />
                        {order.status || 'pending'}
                      </span>
                    </div>

                    {/* Total */}
                    <div className="sm:w-28 text-right flex sm:justify-end items-center gap-3">
                      <span className="font-brandon text-base font-black text-ivory">
                        ₹{(order.total || 0).toLocaleString('en-IN')}
                      </span>
                      <svg
                        className={`w-4 h-4 text-muted-taupe transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* Expanded items */}
                  {isOpen && (
                    <div className="border-t border-white/8 px-5 py-4 space-y-4">
                      {order.order_items?.map((item: any) => {
                        const img = getFirstImage(item.products?.image)
                        return (
                          <div key={item.id} className="flex gap-4">
                            <div className="w-16 h-16 shrink-0 bg-[#1A1A1A] overflow-hidden">
                              {img ? (
                                <img src={img} alt={item.products?.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <svg className="w-5 h-5 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-syndicatgrotesk text-xs text-ivory truncate">{item.products?.name || 'Product'}</p>
                              <p className="font-syndicatgrotesk text-[10px] text-muted-taupe mt-0.5">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-brandon text-sm font-black text-ivory whitespace-nowrap">
                              ₹{((item.price || 0) * item.quantity).toLocaleString('en-IN')}
                            </p>
                          </div>
                        )
                      })}

                      {order.address && (
                        <div className="pt-3 border-t border-white/8">
                          <p className="font-syndicatgrotesk text-[9px] tracking-[0.2em] uppercase text-muted-taupe mb-1">Delivery To</p>
                          <p className="font-syndicatgrotesk text-[10px] text-ivory/70 leading-relaxed">
                            {order.address.split(' | ').map((s: string) => s.replace(/^[^:]+: /, '')).join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
