'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cart'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Script from 'next/script'
import Link from 'next/link'
import { ShoppingBag, Shield, RotateCcw, Truck, BadgeCheck } from 'lucide-react'

declare global {
  interface Window { Razorpay: any }
}

function getFirstImage(raw: string | undefined): string | undefined {
  if (!raw) return undefined
  try {
    const arr = JSON.parse(raw)
    if (Array.isArray(arr) && arr.length > 0) return arr[0]
  } catch {}
  return raw
}

const inputCls = `w-full px-4 py-3 bg-white border border-border-light font-syndicatgrotesk text-sm text-warm-black placeholder-muted-taupe outline-none focus:border-deep-gold focus:ring-1 focus:ring-deep-gold/20 transition-all`

export default function CheckoutPage() {
  const { items, fetchCart } = useCartStore()
  const router = useRouter()

  const [token, setToken] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' })
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/signin'); return }
      setToken(session.access_token)
      await fetchCart(session.access_token)
      setPageLoading(false)
    }
    init()
  }, [])

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const itemCount = items.reduce((a, i) => a + i.quantity, 0)

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) { setError('Your cart is empty.'); return }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to initialize checkout')

      // If mock order (Razorpay not configured), skip modal and confirm directly
      if (data.razorpayOrderId?.startsWith('mock_order_')) {
        const verifyRes = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            orderId: data.orderId,
            razorpay_order_id: data.razorpayOrderId,
            razorpay_payment_id: `mock_pay_${data.orderId}`,
            razorpay_signature: 'mock_signature',
          }),
        })
        const verifyData = await verifyRes.json()
        if (!verifyRes.ok) throw new Error(verifyData.error || 'Order confirmation failed')
        useCartStore.getState().clearCart()
        router.push(`/orders/success?orderId=${data.orderId}`)
        return
      }

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount * 100,
        currency: data.currency,
        name: 'Sri Devi Kangan',
        description: 'Jewellery Order',
        image: '/images/logo.png',
        order_id: data.razorpayOrderId,
        prefill: { name: data.name, email: data.email, contact: data.phone },
        theme: { color: '#B8860B' },
        handler: async (response: any) => {
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              orderId: data.orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })
          const verifyData = await verifyRes.json()
          if (!verifyRes.ok) throw new Error(verifyData.error || 'Payment verification failed')
          useCartStore.getState().clearCart()
          router.push(`/orders/success?orderId=${data.orderId}`)
        },
        modal: { ondismiss: () => setLoading(false) },
      })
      rzp.open()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-warm-beige flex items-center justify-center gap-2">
        {[0, 150, 300].map(d => (
          <span key={d} className="w-2 h-2 bg-deep-gold rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
        ))}
      </div>
    )
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />

      <div className="min-h-screen bg-warm-beige">
        <Navbar />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

          {/* Page header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-px bg-deep-gold/60" />
              <span className="font-syndicatgrotesk text-[9px] tracking-[0.35em] uppercase text-deep-gold">
                Secure Checkout
              </span>
              <div className="w-8 h-px bg-deep-gold/60" />
            </div>
            <h1 className="font-brandon text-2xl sm:text-3xl font-black uppercase tracking-tight text-warm-black">
              Complete Your Order
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start">

            {/* ── LEFT — Delivery form ── */}
            <div className="bg-white border border-border-light shadow-sm">

              {/* Section title */}
              <div className="px-6 py-4 border-b border-border-light bg-soft-cream">
                <h2 className="font-brandon text-sm font-black uppercase tracking-[0.15em] text-warm-black">
                  Delivery Details
                </h2>
              </div>

              <div className="px-6 py-6">
                {error && (
                  <div className="mb-5 flex items-start gap-2 px-4 py-3 border border-red-300 bg-red-50 text-red-700 font-syndicatgrotesk text-xs">
                    <span className="shrink-0 mt-0.5">✕</span>
                    {error}
                  </div>
                )}

                <form onSubmit={handleCheckout} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-syndicatgrotesk text-[10px] tracking-[0.2em] uppercase text-text-muted mb-1.5">
                        Full Name <span className="text-deep-gold">*</span>
                      </label>
                      <input
                        required type="text"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Priya Sharma"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block font-syndicatgrotesk text-[10px] tracking-[0.2em] uppercase text-text-muted mb-1.5">
                        Email Address <span className="text-deep-gold">*</span>
                      </label>
                      <input
                        required type="email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="priya@example.com"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-syndicatgrotesk text-[10px] tracking-[0.2em] uppercase text-text-muted mb-1.5">
                      Phone Number <span className="text-deep-gold">*</span>
                    </label>
                    <input
                      required type="tel" pattern="[6-9][0-9]{9}" maxLength={10}
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="9876543210"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className="block font-syndicatgrotesk text-[10px] tracking-[0.2em] uppercase text-text-muted mb-1.5">
                      Delivery Address <span className="text-deep-gold">*</span>
                    </label>
                    <textarea
                      required rows={4}
                      value={form.address}
                      onChange={e => setForm({ ...form, address: e.target.value })}
                      placeholder="Flat / House No., Street, City, State, PIN Code"
                      className={`${inputCls} resize-none`}
                    />
                  </div>

                  {/* Razorpay badge */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-soft-cream border border-border-light">
                    <Shield size={16} className="text-deep-gold shrink-0" />
                    <div>
                      <p className="font-syndicatgrotesk text-[10px] tracking-[0.15em] uppercase text-warm-black font-semibold">
                        Secured by Razorpay
                      </p>
                      <p className="font-syndicatgrotesk text-[10px] text-text-muted mt-0.5">
                        UPI · Debit / Credit Cards · Net Banking · Wallets
                      </p>
                    </div>
                  </div>

                  {/* Policy line */}
                  <p className="font-syndicatgrotesk text-[10px] text-text-muted leading-relaxed">
                    By placing your order you agree to our{' '}
                    <Link href="/policies/terms" target="_blank" className="text-deep-gold hover:underline">Terms of Service</Link>,{' '}
                    <Link href="/policies/returns" target="_blank" className="text-deep-gold hover:underline">Return Policy</Link>, and{' '}
                    <Link href="/policies/privacy" target="_blank" className="text-deep-gold hover:underline">Privacy Policy</Link>.
                  </p>

                  {/* Pay button */}
                  <button
                    type="submit"
                    disabled={loading || items.length === 0}
                    className="w-full py-4 bg-warm-black text-ivory font-syndicatgrotesk text-[11px] font-bold tracking-[0.25em] uppercase hover:bg-deep-gold disabled:opacity-50 transition-colors duration-200"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" />
                        Processing…
                      </span>
                    ) : (
                      `Pay ₹${total.toLocaleString('en-IN')}`
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* ── RIGHT — Order summary ── */}
            <div className="space-y-4">

              {/* Items card */}
              <div className="bg-white border border-border-light shadow-sm">
                <div className="px-5 py-4 border-b border-border-light bg-soft-cream flex items-center gap-2">
                  <ShoppingBag size={14} className="text-deep-gold" />
                  <h2 className="font-brandon text-sm font-black uppercase tracking-[0.15em] text-warm-black">
                    Order Summary
                  </h2>
                  <span className="ml-auto font-syndicatgrotesk text-[10px] text-text-muted">
                    {itemCount} item{itemCount !== 1 ? 's' : ''}
                  </span>
                </div>

                {items.length === 0 ? (
                  <p className="px-5 py-6 font-syndicatgrotesk text-xs text-text-muted">No items in cart.</p>
                ) : (
                  <ul className="divide-y divide-border-light max-h-72 overflow-y-auto">
                    {items.map(item => {
                      const img = getFirstImage(item.product.image)
                      return (
                        <li key={item.id} className="px-5 py-4 flex gap-3">
                          <div className="w-14 h-14 shrink-0 bg-soft-cream border border-border-light overflow-hidden">
                            {img ? (
                              <img src={img} alt={item.product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingBag size={14} className="text-muted-taupe" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-brandon text-xs font-black uppercase tracking-wide text-warm-black truncate leading-snug">
                              {item.product.name}
                            </p>
                            <p className="font-syndicatgrotesk text-[10px] text-text-muted mt-0.5">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="font-brandon text-sm font-black text-warm-black whitespace-nowrap">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </li>
                      )
                    })}
                  </ul>
                )}

                {/* Totals */}
                <div className="px-5 py-4 bg-soft-cream border-t border-border-light space-y-2">
                  <div className="flex justify-between font-syndicatgrotesk text-xs text-text-muted">
                    <span>Subtotal</span>
                    <span className="text-warm-black">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-syndicatgrotesk text-xs text-text-muted">
                    <span>Shipping</span>
                    <span className="text-deep-gold font-semibold">Free</span>
                  </div>
                  <div className="pt-2 border-t border-border-light flex justify-between">
                    <span className="font-brandon text-sm font-black uppercase text-warm-black">Total</span>
                    <span className="font-brandon text-lg font-black text-warm-black">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trust badges card */}
              <div className="bg-white border border-border-light shadow-sm px-5 py-4">
                <p className="font-syndicatgrotesk text-[9px] tracking-[0.2em] uppercase text-text-muted mb-3">
                  Why shop with us
                </p>
                <div className="space-y-2.5">
                  {[
                    { Icon: Shield,     label: 'SSL Secured Payment' },
                    { Icon: RotateCcw,  label: '7-Day Easy Returns' },
                    { Icon: Truck,      label: 'Free Shipping on All Orders' },
                    { Icon: BadgeCheck, label: 'BIS Certified Genuine Gold' },
                  ].map(({ Icon, label }) => (
                    <div key={label} className="flex items-center gap-2.5">
                      <Icon size={13} className="text-deep-gold shrink-0" />
                      <span className="font-syndicatgrotesk text-[10px] text-text-muted">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}
