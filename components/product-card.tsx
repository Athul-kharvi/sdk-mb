'use client'

import { Heart } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/store/cart'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface ProductCardProps {
  id: string
  name: string
  price: number
  weight?: string
  image?: string
  isDark?: boolean
}

export function ProductCard({ id, name, price, weight = '1 gram', image, isDark = false }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const router = useRouter()
  const { addToCart } = useCartStore()
  const [adding, setAdding] = useState(false)

  const handleAddToCart = async (redirect = false) => {
    setAdding(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      alert('Please login first to purchase items.')
      router.push('/signin')
      return
    }
    await addToCart(session.access_token, id, 1)
    setAdding(false)
    if (redirect) {
      router.push('/checkout')
    }
  }

  return (
    <div
      className={`flex-shrink-0 w-64 sm:w-72 rounded-lg overflow-hidden group transition-all duration-300 ${
        isDark ? 'bg-gray-900' : 'bg-white'
      }`}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-warm-beige to-soft-cream">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-taupe opacity-40">
            <span className="font-serif italic text-xl">Product</span>
          </div>
        )}
        <div className="absolute inset-0 bg-warm-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />

        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 ${
            isDark ? 'bg-white' : 'bg-white'
          }`}
        >
          <Heart
            size={20}
            className={isWishlisted ? 'fill-deep-gold text-deep-gold' : `${isDark ? 'text-gray-900' : 'text-warm-black'}`}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className={`p-4 space-y-3 ${isDark ? 'text-white' : 'text-warm-black'}`}>
        <h3 className={`font-serif italic text-lg ${isDark ? 'text-white' : 'text-warm-black'}`}>
          {name}
        </h3>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-sans uppercase tracking-widest px-3 py-1 rounded-full ${
            isDark ? 'bg-gray-800 text-soft-cream' : 'bg-warm-beige text-warm-black'
          }`}>
            {weight}
          </span>
        </div>

        <p className={`font-sans text-lg font-semibold ${isDark ? 'text-white' : 'text-warm-black'}`}>
          ₹{price.toLocaleString()}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full mt-2">
          <button 
            onClick={() => handleAddToCart(false)}
            disabled={adding}
            className={`flex-1 py-3 px-2 font-sans font-bold uppercase tracking-wider text-xs transition-all duration-300 rounded disabled:opacity-50 disabled:cursor-wait ${
            isDark 
              ? 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-black' 
              : 'bg-transparent border-2 border-black text-black hover:bg-black hover:text-white'
          }`}>
            Add to Cart
          </button>
          
          <button 
            onClick={() => handleAddToCart(true)}
            disabled={adding}
            className={`flex-1 py-3 px-2 font-sans font-bold uppercase tracking-wider text-xs transition-all duration-300 rounded shadow-md disabled:opacity-50 disabled:cursor-wait ${
            isDark 
              ? 'bg-white text-black hover:bg-gray-200' 
              : 'bg-black text-white hover:bg-gray-800'
          }`}>
            {adding ? '...' : 'Buy Now'}
          </button>
        </div>
      </div>
    </div>
  )
}
