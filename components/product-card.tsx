'use client'

import { Heart, ShoppingBag, Zap } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCartStore } from '@/store/cart'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface ProductCardProps {
  id: string
  name: string
  price: number
  originalPrice?: number
  weight?: string
  image?: string
  isDark?: boolean
  badge?: string
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  weight = '1 gram',
  image,
  isDark = false,
  badge,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [adding, setAdding] = useState(false)
  const router = useRouter()
  const { addToCart } = useCartStore()

  const handleAddToCart = async (redirect = false) => {
    setAdding(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      alert('Please login first to purchase items.')
      router.push('/signin')
      setAdding(false)
      return
    }
    await addToCart(session.access_token, id, 1)
    setAdding(false)
    if (redirect) router.push('/checkout')
  }

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : null

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 350, damping: 22 }}
      className={`group relative flex flex-col overflow-hidden ${
        isDark
          ? 'bg-card-dark border border-border-gold/40 hover:border-rich-gold/60'
          : 'bg-white border border-site-black/15 hover:border-site-black/40'
      } transition-colors duration-300`}
    >
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden">
        {/* Background fallback */}
        <div className={`absolute inset-0 ${isDark ? 'bg-section-dark' : 'bg-warm-beige/60'}`} />

        {image ? (
          <img
            src={image}
            alt={name}
            className="relative z-10 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-syndicatgrotesk text-xs tracking-widest uppercase text-muted-taupe/50">
              Sri Devi Kangan
            </span>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 z-20 bg-site-black/0 group-hover:bg-site-black/20 transition-all duration-400 pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 z-30 flex flex-col gap-1.5">
          {badge && (
            <span className="px-2.5 py-1 bg-rich-gold text-site-black font-syndicatgrotesk text-[9px] font-bold tracking-[0.18em] uppercase shadow-md">
              {badge}
            </span>
          )}
          {discount && (
            <span className="px-2.5 py-1 bg-site-black text-rich-gold font-syndicatgrotesk text-[9px] font-bold tracking-[0.1em] uppercase border border-border-gold">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-2.5 right-2.5 z-30 w-8 h-8 flex items-center justify-center bg-site-black/65 backdrop-blur-sm border border-white/10 hover:border-rich-gold/60 transition-all duration-200"
          aria-label="Wishlist"
        >
          <Heart
            size={13}
            className={isWishlisted ? 'fill-rich-gold text-rich-gold' : 'text-white/80'}
          />
        </motion.button>

        {/* Quick Add overlay — slides up on hover */}
        <div className="absolute inset-x-0 bottom-0 z-30 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={() => handleAddToCart(false)}
            disabled={adding}
            className="w-full py-3 bg-rich-gold text-site-black font-syndicatgrotesk text-[10px] font-bold tracking-[0.22em] uppercase hover:bg-light-gold transition-colors duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <Zap size={12} />
            {adding ? 'Adding…' : 'Quick Add'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className={`flex flex-col gap-2 p-3.5 ${isDark ? 'bg-card-dark' : 'bg-white'}`}>
        {/* Weight tag */}
        <span className={`self-start font-syndicatgrotesk text-[8px] tracking-[0.22em] uppercase px-2 py-0.5 ${
          isDark ? 'bg-rich-gold/20 text-rich-gold' : 'bg-site-black/8 text-site-black/70'
        }`}>
          {weight}
        </span>

        {/* Name */}
        <h3 className={`font-brandon text-sm font-black uppercase tracking-wide leading-snug line-clamp-2 ${
          isDark ? 'text-ivory' : 'text-site-black'
        }`}>
          {name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className={`font-brandon text-base font-black ${isDark ? 'text-rich-gold' : 'text-deep-gold'}`}>
            ₹{price.toLocaleString('en-IN')}
          </span>
          {originalPrice && (
            <span className={`font-syndicatgrotesk text-xs line-through ${isDark ? 'text-white/40' : 'text-site-black/40'}`}>
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-1">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAddToCart(false)}
            disabled={adding}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 font-syndicatgrotesk text-[9px] font-bold tracking-[0.18em] uppercase transition-all duration-200 disabled:opacity-50 ${
              isDark
                ? 'border border-border-gold/70 text-muted-taupe hover:border-rich-gold hover:text-rich-gold'
                : 'border border-site-black/30 text-site-black hover:border-deep-gold hover:text-deep-gold'
            }`}
          >
            <ShoppingBag size={11} />
            {adding ? '…' : 'Add to Cart'}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAddToCart(true)}
            disabled={adding}
            className={`flex-1 py-2.5 font-syndicatgrotesk text-[9px] font-bold tracking-[0.18em] uppercase transition-all duration-200 disabled:opacity-50 ${
              isDark
                ? 'bg-rich-gold text-site-black hover:bg-light-gold'
                : 'bg-site-black text-white hover:bg-deep-gold'
            }`}
          >
            Buy Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
