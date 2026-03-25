'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cart'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function CheckoutPage() {
    const { items, fetchCart, clearCart } = useCartStore()
    const router = useRouter()
    
    const [token, setToken] = useState<string | null>(null)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/signin')
                return
            }
            setToken(session.access_token)
            await fetchCart(session.access_token)
        }
        init()
    }, [])

    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!address) {
            setError('Please provide a delivery address.')
            return
        }
        if (items.length === 0) {
            setError('Your cart is empty.')
            return
        }

        setLoading(true)
        setError('')

        try {
            // 1. Create Order
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ name, email, phone, address })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to initialize checkout')

            // 2. Mock Razorpay Payment Verification
            const verifyRes = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({
                    orderId: data.orderId,
                    mockSuccess: true
                })
            })

            const verifyData = await verifyRes.json()
            if (!verifyRes.ok) throw new Error(verifyData.error || 'Payment failed')

            // Clear local cart
            useCartStore.getState().clearCart()
            
            setSuccessMessage('Payment successful! Your order has been placed.')
            setTimeout(() => {
                router.push('/orders') // redirect to orders page
            }, 3000)

        } catch (err: any) {
            console.error(err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (successMessage) {
        return (
            <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-sm border max-w-md w-full text-center space-y-4">
                    <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <h2 className="text-2xl font-serif italic text-warm-black">Thank You!</h2>
                    <p className="text-gray-600 font-sans">{successMessage}</p>
                    <p className="text-sm text-gray-400 mt-4">Redirecting you to your orders...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            <Navbar />
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-4 lg:p-10">
                
                {/* Checkout Form */}
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border h-fit">
                    <h2 className="text-2xl font-serif italic text-warm-black mb-6">Checkout</h2>
                    
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4">{error}</div>}

                    <form onSubmit={handleCheckout} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-600 outline-none font-sans" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-600 outline-none font-sans" placeholder="john@example.com" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-600 outline-none font-sans" placeholder="1234567890" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Delivery Address
                            </label>
                            <textarea
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                rows={3}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-600 outline-none resize-none font-sans"
                                placeholder="123 Main Street, City, State, ZIP..."
                            />
                        </div>

                        {/* Dummy credit card fields purely for UX feel, not actually processed */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Payment Details
                            </label>
                            <div className="p-4 border rounded bg-gray-50 flex items-center space-x-3 text-sm text-gray-600">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                                <span>Mock Payment Gateway Active</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || items.length === 0}
                            className="w-full bg-warm-black text-white py-4 rounded font-sans font-medium uppercase tracking-wider hover:bg-gray-800 disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Processing...' : `Pay ₹${total.toLocaleString()}`}
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border h-fit">
                    <h2 className="text-xl font-serif italic text-warm-black mb-6 border-b pb-4">Order Summary</h2>
                    
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {items.length === 0 ? (
                            <p className="text-gray-500 text-sm">No items to checkout.</p>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                                    <div className="font-sans">
                                        <p className="font-medium text-sm text-warm-black">{item.product.name}</p>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium text-sm text-warm-black">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="mt-6 pt-6 border-t font-sans">
                        <div className="flex justify-between text-warm-black font-semibold text-lg">
                            <span>Total</span>
                            <span>₹{total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    )
}
