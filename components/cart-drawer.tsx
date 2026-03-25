'use client'

import { useCartStore } from '@/store/cart'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function CartDrawer() {
    const { isOpen, setIsOpen, items, updateQuantity, removeItem, isLoading } = useCartStore()
    const router = useRouter()
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) setToken(session.access_token)
        }
        getSession()
    }, [isOpen])

    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

    const handleUpdateQty = (cartItemId: string, newQty: number) => {
        if (!token) return
        if (newQty <= 0) {
            removeItem(token, cartItemId)
        } else {
            updateQuantity(token, cartItemId, newQty)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={() => setIsOpen(false)} />
            
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <div className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out sm:duration-700 h-full bg-white shadow-xl flex flex-col">
                    
                    <div className="px-4 py-6 sm:px-6 bg-warm-beige/30 border-b flex items-start justify-between">
                        <h2 className="text-xl font-serif italic text-warm-black flex items-center gap-2">
                            <ShoppingBag size={20} /> Your Cart
                        </h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="bg-white p-2 text-gray-400 hover:text-gray-500 rounded-full shadow-sm"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        {items.length === 0 ? (
                            <div className="text-center py-20 text-gray-500 flex flex-col items-center gap-4">
                                <ShoppingBag size={48} className="text-gray-300" />
                                <p className="font-sans uppercase tracking-widest text-sm">Your cart is empty</p>
                            </div>
                        ) : (
                            <ul className="space-y-6">
                                {items.map((item) => {
                                    // Parse image if it's string array
                                    let imgUrl = undefined
                                    if (item.product.image) {
                                        try {
                                            const arr = JSON.parse(item.product.image)
                                            if (Array.isArray(arr) && arr.length > 0) imgUrl = arr[0]
                                        } catch {
                                            imgUrl = item.product.image
                                        }
                                    }

                                    return (
                                        <li key={item.id} className="flex flex-col sm:flex-row gap-4 border-b pb-6">
                                            <div className="h-24 w-24 sm:w-20 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                {imgUrl ? (
                                                    <img src={imgUrl} alt={item.product.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">No Img</div>
                                                )}
                                            </div>

                                            <div className="flex flex-1 flex-col font-sans">
                                                <div>
                                                    <div className="flex justify-between text-base font-medium text-warm-black">
                                                        <h3 className="font-serif italic text-lg">{item.product.name}</h3>
                                                        <p className="ml-4">₹{item.product.price.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex flex-1 items-end justify-between mt-4">
                                                    <div className="flex items-center border rounded-md px-2 py-1 space-x-3">
                                                        <button 
                                                            disabled={isLoading}
                                                            onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                                                            className="text-gray-500 hover:text-warm-black disabled:opacity-50"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="text-sm font-medium">{item.quantity}</span>
                                                        <button 
                                                            disabled={isLoading}
                                                            onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                                                            className="text-gray-500 hover:text-warm-black disabled:opacity-50"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        disabled={isLoading}
                                                        onClick={() => removeItem(token!, item.id)}
                                                        className="font-medium text-red-500 hover:text-red-600 text-sm disabled:opacity-50"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        )}
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-lg font-medium text-warm-black mb-4">
                            <p>Subtotal</p>
                            <p>₹{total.toLocaleString()}</p>
                        </div>
                        <p className="text-sm text-gray-500 mb-6 font-sans">Shipping and taxes calculated at checkout.</p>
                        
                        <button
                            onClick={() => {
                                setIsOpen(false)
                                router.push('/checkout')
                            }}
                            disabled={items.length === 0}
                            className="flex w-full items-center justify-center rounded border border-transparent bg-warm-black px-6 py-4 text-base font-sans font-medium uppercase tracking-wider text-white shadow-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Checkout
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}
