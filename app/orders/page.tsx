'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function UserOrders() {
    const router = useRouter()
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrders = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/signin')
                return
            }

            try {
                const res = await fetch('/api/user/orders', {
                    headers: { Authorization: `Bearer ${session.access_token}` }
                })
                const data = await res.json()
                if (data.data) {
                    setOrders(data.data)
                }
            } catch (error) {
                console.error('Failed to fetch orders:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [router])

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            <Navbar />
            <main className="max-w-4xl mx-auto p-4 sm:p-8">
                <h1 className="text-3xl font-serif italic text-warm-black mb-8">My Orders</h1>

                {loading ? (
                    <div className="text-center p-10 font-sans text-gray-500 tracking-widest uppercase text-sm">Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-gray-500 font-sans tracking-wide">You haven't placed any orders yet.</p>
                        <button 
                            onClick={() => router.push('/')}
                            className="mt-6 px-6 py-2 bg-warm-black text-white font-sans uppercase tracking-widest text-xs rounded hover:bg-gray-800 transition-colors"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white border text-warm-black border-gray-100 rounded-xl overflow-hidden shadow-sm">
                                <div className="bg-warm-beige/30 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-100 gap-4">
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Order Placed</p>
                                        <p className="font-sans font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Total</p>
                                        <p className="font-sans font-medium">₹{order.total.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Status</p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                                            order.status === 'paid' ? 'bg-green-100 text-green-700' :
                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="p-4 sm:p-6">
                                    <ul className="divide-y divide-gray-100">
                                        {order.order_items.map((item: any) => {
                                            let imgUrl = undefined
                                            if (item.products.image) {
                                                try {
                                                    const arr = JSON.parse(item.products.image)
                                                    if (Array.isArray(arr) && arr.length > 0) imgUrl = arr[0]
                                                } catch { imgUrl = item.products.image }
                                            }

                                            return (
                                                <li key={item.id} className="py-4 flex gap-4">
                                                    <div className="h-20 w-20 shrink-0 bg-gray-50 rounded-md overflow-hidden border">
                                                        {imgUrl ? (
                                                            <img src={imgUrl} alt={item.products.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 flex flex-col justify-center">
                                                        <h3 className="font-serif text-lg">{item.products.name}</h3>
                                                        <p className="text-sm font-sans text-gray-500 mt-1">₹{item.price.toLocaleString()} &times; {item.quantity}</p>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    )
}
