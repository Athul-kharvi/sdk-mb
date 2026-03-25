'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminOrders() {
    const router = useRouter()
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/signin')
                return
            }
            
            const res = await fetch('/api/admin/orders', {
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                }
            })
            const data = await res.json()
            setOrders(data.data || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            const { data: { session } } = await supabase.auth.getSession()
            const res = await fetch(`/api/admin/orders/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ status: newStatus })
            })
            if (res.ok) {
                fetchOrders()
            }
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) {
        return <div className="p-10">Loading orders...</div>
    }

    return (
        <div className="min-h-screen bg-[#faf9f6] text-gray-900">

            {/* Header */}
            <div className="flex justify-between items-center px-8 py-6 border-b bg-white">
                <div className="flex items-center space-x-6">
                    <h1 className="text-2xl font-serif tracking-wide">
                        Admin Panel
                    </h1>
                    <div className="flex space-x-4 text-sm font-medium">
                        <button onClick={() => router.push('/admin')} className="text-gray-500 hover:text-gray-900 px-1 py-1">Products</button>
                        <button onClick={() => router.push('/admin/orders')} className="text-yellow-600 border-b-2 border-yellow-600 px-1 py-1">Orders</button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-serif">Manage Orders</h2>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left">
                            <tr>
                                <th className="p-4">Order ID</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Customer Info</th>
                                <th className="p-4">Products & Total</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((o: any) => (
                                <tr key={o.id} className="border-t align-top hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-mono text-xs w-40 text-gray-500">
                                        {o.id.substring(0, 8)}...
                                    </td>
                                    <td className="p-4 whitespace-nowrap">{new Date(o.created_at).toLocaleDateString()}</td>
                                    
                                    <td className="p-4 w-64">
                                        <div className="text-[11px] space-y-1 bg-white border border-gray-100 p-3 rounded-md shadow-sm text-gray-700">
                                            {o.address ? o.address.split(' | ').map((line: string, i: number) => {
                                                const [key, val] = line.split(': ')
                                                return (
                                                    <div key={i} className="flex justify-between border-b border-gray-50 pb-1 last:border-0 last:pb-0">
                                                        <span className="font-semibold text-gray-900 pr-2">{key}:</span>
                                                        <span className="text-right ml-auto truncate" title={val}>{val}</span>
                                                    </div>
                                                )
                                            }) : <span className="text-gray-400 italic block py-2">No detailed info available</span>}
                                        </div>
                                    </td>

                                    <td className="p-4 w-72">
                                        <div className="space-y-2 mb-3">
                                            {o.order_items?.map((item: any) => (
                                                <div key={item.id} className="flex flex-col text-xs text-gray-600 bg-white border p-2 rounded">
                                                    <span className="font-semibold text-gray-900">{item.products?.name || 'Unknown Item'}</span>
                                                    <span>Qty: {item.quantity} &times; ₹{item.price}</span>
                                                </div>
                                            ))}
                                            {(!o.order_items || o.order_items.length === 0) && (
                                                <span className="text-xs text-gray-400">No items recorded</span>
                                            )}
                                        </div>
                                        <div className="font-semibold text-sm text-warm-black">
                                            Total: ₹{o.total?.toLocaleString() || o.total_amount?.toLocaleString() || 0}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            o.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                            o.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {o.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <select
                                            value={o.status || 'Pending'}
                                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                                            className="border rounded px-2 py-1 text-sm outline-none"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}

                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center p-6 text-gray-500">
                                        No orders found
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
