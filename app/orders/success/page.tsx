'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'

function getFirstImage(raw: string | undefined): string | undefined {
  if (!raw) return undefined
  try {
    const arr = JSON.parse(raw)
    if (Array.isArray(arr) && arr.length > 0) return arr[0]
  } catch {}
  return raw
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orderId')

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) { router.push('/'); return }

    const fetch = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/signin'); return }

      const res = await window.fetch('/api/user/orders', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const data = await res.json()
      const found = data.data?.find((o: any) => o.id === orderId)
      setOrder(found || null)
      setLoading(false)
    }
    fetch()
  }, [orderId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-2">
        {[0, 150, 300].map(d => (
          <span key={d} className="w-2 h-2 bg-deep-gold rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-20">

      {/* Success badge */}
      <div className="text-center mb-10">
        <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
          <div className="absolute inset-0 bg-deep-gold/10 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
          <div className="relative w-20 h-20 bg-deep-gold/10 border border-deep-gold/40 rounded-full flex items-center justify-center">
            <svg className="w-9 h-9 text-deep-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-10 h-px bg-gradient-to-r from-transparent to-deep-gold" />
          <span className="font-syndicatgrotesk text-[9px] tracking-[0.35em] uppercase text-deep-gold/80">Order Confirmed</span>
          <div className="w-10 h-px bg-gradient-to-l from-transparent to-deep-gold" />
        </div>

        <h1 className="font-brandon text-3xl sm:text-4xl font-black uppercase tracking-tight text-warm-black mb-3">
          Thank You!
        </h1>
        <p className="font-syndicatgrotesk text-sm text-muted-taupe leading-relaxed">
          Your payment was successful. We'll start preparing your order right away.
        </p>
      </div>

      {/* Order card */}
      {order && (
        <div className="bg-white border border-border-light shadow-sm mb-6">
          {/* Order meta */}
          <div className="px-6 py-4 border-b border-border-light bg-soft-cream flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="font-syndicatgrotesk text-[9px] tracking-[0.2em] uppercase text-muted-taupe mb-1">Order ID</p>
              <p className="font-mono text-xs text-warm-black">{order.id.slice(0, 8).toUpperCase()}…</p>
            </div>
            <div>
              <p className="font-syndicatgrotesk text-[9px] tracking-[0.2em] uppercase text-muted-taupe mb-1">Date</p>
              <p className="font-syndicatgrotesk text-xs text-warm-black">
                {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="font-syndicatgrotesk text-[9px] tracking-[0.2em] uppercase text-muted-taupe mb-1">Status</p>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 border border-green-500/30 font-syndicatgrotesk text-[10px] tracking-wider uppercase text-green-700">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                {order.status}
              </span>
            </div>
            <div>
              <p className="font-syndicatgrotesk text-[9px] tracking-[0.2em] uppercase text-muted-taupe mb-1">Total Paid</p>
              <p className="font-brandon text-lg font-black text-deep-gold">₹{(order.total || 0).toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Items */}
          <div className="px-6 py-4 space-y-4">
            {order.order_items?.map((item: any) => {
              const img = getFirstImage(item.products?.image)
              return (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 shrink-0 bg-soft-cream border border-border-light overflow-hidden">
                    {img ? (
                      <img src={img} alt={item.products?.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-muted-taupe/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-syndicatgrotesk text-xs text-warm-black truncate">{item.products?.name || 'Product'}</p>
                    <p className="font-syndicatgrotesk text-[10px] text-muted-taupe mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-brandon text-sm font-black text-warm-black whitespace-nowrap">
                    ₹{((item.price || 0) * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Delivery address */}
          {order.address && (
            <div className="px-6 py-4 border-t border-border-light bg-soft-cream">
              <p className="font-syndicatgrotesk text-[9px] tracking-[0.2em] uppercase text-muted-taupe mb-2">Delivery To</p>
              <p className="font-syndicatgrotesk text-xs text-warm-black/80 leading-relaxed">
                {order.address.split(' | ').map((s: string) => s.replace(/^[^:]+: /, '')).join(', ')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* What's next */}
      <div className="bg-white border border-border-light shadow-sm px-6 py-5 mb-8">
        <p className="font-syndicatgrotesk text-[10px] tracking-[0.2em] uppercase text-deep-gold/80 mb-4">What Happens Next</p>
        <div className="space-y-3">
          {[
            { step: '01', text: 'Order confirmation SMS & email sent to you' },
            { step: '02', text: 'Our team verifies and prepares your jewellery' },
            { step: '03', text: 'Shipped with tracking within 2–3 business days' },
            { step: '04', text: 'Delivered safely to your doorstep' },
          ].map(s => (
            <div key={s.step} className="flex items-start gap-3">
              <span className="font-brandon text-xs font-black text-deep-gold/60 w-5 shrink-0">{s.step}</span>
              <span className="font-syndicatgrotesk text-xs text-muted-taupe">{s.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/orders"
          className="flex-1 py-3.5 border border-border-light font-syndicatgrotesk text-[10px] font-bold tracking-[0.22em] uppercase text-warm-black hover:border-deep-gold hover:text-deep-gold transition-colors text-center"
        >
          View All Orders
        </Link>
        <Link
          href="/"
          className="flex-1 py-3.5 bg-warm-black text-ivory font-syndicatgrotesk text-[10px] font-bold tracking-[0.22em] uppercase hover:bg-deep-gold transition-colors text-center"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-warm-beige">
      <Navbar />
      <Suspense>
        <SuccessContent />
      </Suspense>
      <Footer />
    </div>
  )
}
