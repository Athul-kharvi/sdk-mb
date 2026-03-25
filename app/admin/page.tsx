'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Admin() {
    const router = useRouter()

    const [products, setProducts] = useState<any[]>([])
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const getAuthHeaders = async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession()

        return {
            Authorization: `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
        }
    }

    const fetchProducts = async () => {
        try {
            const headers = await getAuthHeaders()

            const res = await fetch('/api/admin/products', {
                headers,
            })

            const data = await res.json()
            setProducts(data.data || [])
        } catch (err) {
            console.error('Products error:', err)
        }
    }

    const fetchOrders = async () => {
        try {
            const headers = await getAuthHeaders()

            const res = await fetch('/api/admin/orders', {
                headers,
            })

            const data = await res.json()
            setOrders(data.data || [])
        } catch (err) {
            console.error('Orders error:', err)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return

        try {
            const headers = await getAuthHeaders()

            await fetch(`/api/admin/products/${id}`, {
                method: 'DELETE',
                headers,
            })

            // refresh list
            fetchProducts()
        } catch (err) {
            console.error('Delete error:', err)
        }
    }

    useEffect(() => {
        const init = async () => {
            await Promise.all([fetchProducts(), fetchOrders()])
            setLoading(false)
        }

        init()
    }, [])

    if (loading) {
        return <div className="p-10">Loading...</div>
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
                        <button
                            onClick={() => router.push('/admin')}
                            className="text-yellow-600 border-b-2 border-yellow-600 px-1 py-1"
                        >
                            Products
                        </button>

                        <button
                            onClick={() => router.push('/admin/orders')}
                            className="text-gray-500 hover:text-gray-900 px-1 py-1"
                        >
                            Orders
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => router.push('/admin/products/new')}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm uppercase tracking-widest hover:bg-yellow-700"
                >
                    Add Product
                </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <p className="text-sm text-gray-500">Total Products</p>
                        <h2 className="text-2xl font-semibold mt-2">
                            {products.length}
                        </h2>
                    </div>

                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <p className="text-sm text-gray-500">Orders</p>
                        <h2 className="text-2xl font-semibold mt-2">
                            {orders.length}
                        </h2>
                    </div>

                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <p className="text-sm text-gray-500">Revenue</p>
                        <h2 className="text-2xl font-semibold mt-2">
                            ₹{' '}
                            {orders
                                .reduce(
                                    (acc, order) =>
                                        acc + (order.total || order.total_amount || 0),
                                    0
                                )
                                .toLocaleString()}
                        </h2>
                    </div>

                </div>

                {/* Products */}
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-serif">Products</h2>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <table className="w-full text-sm">

                        <thead className="bg-gray-50 text-left">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Price</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.map((p: any) => (
                                <tr key={p.id} className="border-t">

                                    <td className="p-4">{p.name}</td>
                                    <td className="p-4">₹ {p.price}</td>

                                    <td className="p-4 text-right space-x-4">
                                        <button
                                            onClick={() =>
                                                router.push(
                                                    `/admin/products/${p.id}`
                                                )
                                            }
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(p.id)
                                            }
                                            className="text-red-500 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>

                                </tr>
                            ))}

                            {products.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="text-center p-6 text-gray-500"
                                    >
                                        No products found
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