'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag, Zap, Heart, ChevronLeft, ChevronRight,
  Shield, RotateCcw, Truck, BadgeCheck, Package, Tag, ArrowLeft,
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { useCartStore } from '@/store/cart'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  price: number
  original_price?: number
  weight?: string
  image?: string
  description?: string
  stock?: number
  category_id?: string
  categories?: { id: string; name: string; slug: string }
}

function parseImages(raw: string | undefined): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed.filter(Boolean)
  } catch {}
  return [raw]
}

function getFirstImage(raw: string | undefined): string | undefined {
  const imgs = parseImages(raw)
  return imgs[0]
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [adding, setAdding] = useState(false)
  const [addedFeedback, setAddedFeedback] = useState(false)
  const [qty, setQty] = useState(1)

  const { addToCart } = useCartStore()

  useEffect(() => {
    setActiveImg(0)
    setQty(1)
    const load = async () => {
      setLoading(true)
      const res = await fetch(`/api/products/${id}`)
      if (!res.ok) { setLoading(false); return }
      const { data } = await res.json()
      setProduct(data)

      // fetch related: same category, excluding current product
      if (data?.category_id) {
        const allRes = await fetch('/api/products')
        if (allRes.ok) {
          const { data: all } = await allRes.json()
          const others = (all as Product[]).filter(
            p => p.category_id === data.category_id && p.id !== data.id
          ).slice(0, 6)
          setRelated(others)
        }
      }

      setLoading(false)
    }
    load()
  }, [id])

  const handleAddToCart = async (redirect = false) => {
    setAdding(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      alert('Please login first to purchase items.')
      router.push('/signin')
      setAdding(false)
      return
    }
    await addToCart(session.access_token, id, qty)
    setAdding(false)
    if (redirect) {
      router.push('/checkout')
    } else {
      setAddedFeedback(true)
      setTimeout(() => setAddedFeedback(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-beige flex items-center justify-center gap-2">
        {[0, 150, 300].map(d => (
          <span key={d} className="w-2 h-2 bg-deep-gold rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
        ))}
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-warm-beige flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="font-brandon text-xl font-black uppercase text-warm-black">Product not found</p>
          <Link href="/" className="font-syndicatgrotesk text-[10px] tracking-[0.2em] uppercase text-deep-gold hover:underline">
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const images = parseImages(product.image)
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null
  const inStock = !product.stock || product.stock > 0

  return (
    <div className="min-h-screen bg-warm-beige">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6 font-syndicatgrotesk text-[10px] tracking-[0.15em] uppercase text-text-muted">
          <Link href="/" className="hover:text-deep-gold transition-colors">Home</Link>
          <span className="text-border-light">/</span>
          {product.categories && (
            <>
              <Link href={`/category/${product.categories.slug}`} className="hover:text-deep-gold transition-colors">
                {product.categories.name}
              </Link>
              <span className="text-border-light">/</span>
            </>
          )}
          <span className="text-warm-black line-clamp-1">{product.name}</span>
        </nav>

        {/* ── Main product grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">

          {/* LEFT — Images */}
          <div className="flex flex-col gap-3 lg:sticky lg:top-6">
            {/* Main image */}
            <div className="relative aspect-square bg-soft-cream border border-border-light overflow-hidden">
              <AnimatePresence mode="wait">
                {images.length > 0 ? (
                  <motion.img
                    key={activeImg}
                    src={images[activeImg]}
                    alt={product.name}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-syndicatgrotesk text-xs tracking-widest uppercase text-muted-taupe/40">
                      Vinayak Creation
                    </span>
                  </div>
                )}
              </AnimatePresence>

              {/* Discount badge */}
              {discount && (
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-site-black text-rich-gold font-syndicatgrotesk text-[9px] font-bold tracking-[0.1em] uppercase border border-border-gold">
                  -{discount}% OFF
                </span>
              )}

              {/* Wishlist */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm border border-border-light hover:border-rich-gold/60 shadow-sm transition-all duration-200"
                aria-label="Add to wishlist"
              >
                <Heart size={15} className={isWishlisted ? 'fill-rich-gold text-rich-gold' : 'text-warm-black/60'} />
              </motion.button>

              {/* Prev/Next */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-border-light hover:border-deep-gold transition-colors shadow-sm"
                  >
                    <ChevronLeft size={16} className="text-warm-black" />
                  </button>
                  <button
                    onClick={() => setActiveImg(i => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-border-light hover:border-deep-gold transition-colors shadow-sm"
                  >
                    <ChevronRight size={16} className="text-warm-black" />
                  </button>
                </>
              )}

              {/* Dot indicators */}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                        activeImg === i ? 'bg-deep-gold w-4' : 'bg-site-black/30'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-[72px] h-[72px] border-2 overflow-hidden transition-all duration-200 ${
                      activeImg === i
                        ? 'border-deep-gold opacity-100'
                        : 'border-border-light opacity-60 hover:opacity-100 hover:border-site-black/30'
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Product info */}
          <div className="flex flex-col gap-5">

            {/* Category pill */}
            {product.categories && (
              <Link
                href={`/category/${product.categories.slug}`}
                className="self-start flex items-center gap-1.5 font-syndicatgrotesk text-[9px] tracking-[0.22em] uppercase px-3 py-1.5 bg-rich-gold/10 text-deep-gold border border-deep-gold/20 hover:bg-rich-gold/20 transition-colors"
              >
                <Tag size={9} />
                {product.categories.name}
              </Link>
            )}

            {/* Name */}
            <h1 className="font-brandon text-2xl sm:text-3xl font-black uppercase tracking-tight text-warm-black leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-brandon text-3xl font-black text-deep-gold">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.original_price && (
                <span className="font-syndicatgrotesk text-base line-through text-site-black/35">
                  ₹{product.original_price.toLocaleString('en-IN')}
                </span>
              )}
              {discount && (
                <span className="font-syndicatgrotesk text-[10px] font-bold tracking-[0.1em] uppercase text-green-700 bg-green-50 border border-green-200 px-2.5 py-1">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`font-syndicatgrotesk text-[10px] tracking-[0.15em] uppercase font-semibold ${inStock ? 'text-green-700' : 'text-red-600'}`}>
                {inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className="w-full h-px bg-border-light" />

            {/* Quantity selector */}
            {inStock && (
              <div className="flex items-center gap-4">
                <span className="font-syndicatgrotesk text-[10px] tracking-[0.2em] uppercase text-text-muted">Qty</span>
                <div className="flex items-center border border-border-light">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center text-warm-black hover:bg-soft-cream transition-colors font-brandon font-black text-lg"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-brandon text-sm font-black text-warm-black">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(q => q + 1)}
                    className="w-9 h-9 flex items-center justify-center text-warm-black hover:bg-soft-cream transition-colors font-brandon font-black text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => handleAddToCart(false)}
                disabled={adding || !inStock}
                className="flex-1 flex items-center justify-center gap-2 py-4 border-2 border-deep-gold text-deep-gold font-syndicatgrotesk text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-deep-gold hover:text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={14} />
                {addedFeedback ? '✓ Added to Cart' : adding ? 'Adding…' : 'Add to Cart'}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => handleAddToCart(true)}
                disabled={adding || !inStock}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-site-black text-ivory font-syndicatgrotesk text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-deep-gold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Zap size={14} />
                Buy Now
              </motion.button>
            </div>

            {/* Trust row */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { Icon: Shield,     label: 'Secure Payment' },
                { Icon: RotateCcw,  label: '7-Day Returns' },
                { Icon: Truck,      label: 'Free Shipping' },
                { Icon: BadgeCheck, label: 'Certified Quality' },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2 px-3 py-2.5 bg-white border border-border-light">
                  <Icon size={12} className="text-deep-gold shrink-0" />
                  <span className="font-syndicatgrotesk text-[9px] tracking-[0.1em] uppercase text-text-muted">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Description section ── */}
        {product.description && (
          <div className="mt-14 sm:mt-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-px bg-deep-gold/50" />
              <span className="font-syndicatgrotesk text-[9px] tracking-[0.35em] uppercase text-deep-gold">Details</span>
              <div className="flex-1 h-px bg-border-light" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
              {/* Description text */}
              <div className="bg-white border border-border-light p-6 sm:p-8">
                <h2 className="font-brandon text-lg font-black uppercase tracking-wide text-warm-black mb-4">
                  Product Description
                </h2>
                <div className="font-syndicatgrotesk text-sm text-warm-black/75 leading-relaxed space-y-3 whitespace-pre-line">
                  {product.description}
                </div>
              </div>

              {/* Product details card */}
              <div className="bg-white border border-border-light p-6 h-fit">
                <h3 className="font-brandon text-sm font-black uppercase tracking-wide text-warm-black mb-4">
                  Product Details
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'SKU', value: product.id.slice(0, 8).toUpperCase() },
                    ...(product.weight ? [{ label: 'Weight', value: product.weight }] : []),
                    ...(product.categories ? [{ label: 'Category', value: product.categories.name }] : []),
                    { label: 'Availability', value: inStock ? 'In Stock' : 'Out of Stock' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-start py-2.5 border-b border-border-light last:border-0">
                      <span className="font-syndicatgrotesk text-[10px] tracking-[0.15em] uppercase text-text-muted">
                        {label}
                      </span>
                      <span className="font-syndicatgrotesk text-[11px] text-warm-black font-semibold text-right max-w-[60%]">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Shipping note */}
                <div className="mt-5 flex items-start gap-2.5 p-3 bg-soft-cream border border-border-light">
                  <Package size={13} className="text-deep-gold shrink-0 mt-0.5" />
                  <p className="font-syndicatgrotesk text-[10px] text-text-muted leading-relaxed">
                    Ships within 2–5 business days. Free delivery on orders above ₹599.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Similar products ── */}
        {related.length > 0 && (
          <div className="mt-16 sm:mt-24">
            {/* Section header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-end gap-5">
                <p className="font-brandon text-3xl sm:text-4xl font-black uppercase tracking-tight text-warm-black leading-none">
                  You Might Also Like
                </p>
                <div className="mb-1 flex items-center gap-2 pb-0.5">
                  <div className="w-1 h-1 bg-deep-gold/60 rotate-45 shrink-0" />
                  <div className="w-10 h-px bg-deep-gold/40" />
                </div>
              </div>
              {product.categories && (
                <Link
                  href={`/category/${product.categories.slug}`}
                  className="hidden sm:flex items-center gap-1.5 font-syndicatgrotesk text-[10px] tracking-[0.18em] uppercase text-text-muted hover:text-deep-gold transition-colors"
                >
                  View All
                  <ChevronRight size={12} />
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {related.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                >
                  <ProductCard
                    id={p.id}
                    name={p.name}
                    price={p.price}
                    originalPrice={p.original_price}
                    weight={p.weight}
                    image={getFirstImage(p.image)}
                    isDark={false}
                  />
                </motion.div>
              ))}
            </div>

            {/* Mobile view all */}
            {product.categories && (
              <div className="mt-8 flex justify-center sm:hidden">
                <Link
                  href={`/category/${product.categories.slug}`}
                  className="flex items-center gap-2 px-8 py-3 border border-site-black/20 font-syndicatgrotesk text-[10px] tracking-[0.2em] uppercase text-warm-black hover:border-deep-gold hover:text-deep-gold transition-colors"
                >
                  View All {product.categories.name}
                  <ChevronRight size={12} />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
