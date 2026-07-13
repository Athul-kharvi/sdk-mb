'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, SlidersHorizontal, ArrowUpDown, ChevronDown, X, Check } from 'lucide-react'
import Link from 'next/link'
import { ProductCard } from '@/components/product-card'

interface Product {
  id: string
  name: string
  price: number
  original_price?: number
  weight?: string
  image?: string
}

interface Props {
  categoryName: string
  slug: string
  products: Product[]
  allCategories: { id: string; name: string; slug: string | null }[]
}

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'newest'
type PriceKey = 'all' | 'u500' | '500-1k' | '1k-2k' | 'a2k'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured',   label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest',     label: 'Newest First' },
]

const PRICE_OPTIONS: { value: PriceKey; label: string }[] = [
  { value: 'all',     label: 'All Prices' },
  { value: 'u500',    label: 'Under ₹500' },
  { value: '500-1k',  label: '₹500 – ₹1,000' },
  { value: '1k-2k',   label: '₹1,000 – ₹2,000' },
  { value: 'a2k',     label: 'Above ₹2,000' },
]

function getFirstImage(raw: string | undefined): string | undefined {
  if (!raw) return undefined
  try {
    const arr = JSON.parse(raw)
    if (Array.isArray(arr) && arr.length > 0) return arr[0]
  } catch {}
  return raw
}

function Dropdown({
  open,
  onClose,
  children,
  alignRight = false,
}: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  alignRight?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, onClose])

  return (
    <div ref={ref} className="relative">
      {children}
    </div>
  )
}

export function CategoryContent({ categoryName, slug, products, allCategories }: Props) {
  const [sort, setSort]               = useState<SortKey>('featured')
  const [price, setPrice]             = useState<PriceKey>('all')
  const [sortOpen, setSortOpen]       = useState(false)
  const [filterOpen, setFilterOpen]   = useState(false)

  const filtered = useMemo(() => {
    let r = [...products]
    if (price === 'u500')   r = r.filter(p => p.price < 500)
    if (price === '500-1k') r = r.filter(p => p.price >= 500  && p.price < 1000)
    if (price === '1k-2k')  r = r.filter(p => p.price >= 1000 && p.price < 2000)
    if (price === 'a2k')    r = r.filter(p => p.price >= 2000)
    if (sort === 'price-asc')  r.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') r.sort((a, b) => b.price - a.price)
    return r
  }, [products, sort, price])

  const hasActiveFilter = price !== 'all'
  const hasActiveSort   = sort !== 'featured'
  const activeLabel     = SORT_OPTIONS.find(o => o.value === sort)?.label
  const priceLabel      = PRICE_OPTIONS.find(o => o.value === price)?.label

  const clearAll = () => { setSort('featured'); setPrice('all') }

  return (
    <>
      {/* ── Hero strip ── */}
      <div className="bg-site-black border-b border-border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-0">

          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-syndicatgrotesk text-[10px] tracking-[0.2em] uppercase text-muted-taupe hover:text-rich-gold transition-colors"
          >
            <ArrowLeft size={11} />
            Back to Home
          </Link>

          {/* Desktop: name right, controls left | Mobile: name first, bar below */}
          <div className="mt-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 lg:gap-0 pb-8">

            {/* Controls — left on desktop, bottom-bar on mobile */}
            <div className="order-2 lg:order-1 flex items-center gap-3 w-full lg:w-auto">

              {/* ─ Sort ─ */}
              <Dropdown open={sortOpen} onClose={() => setSortOpen(false)}>
                <button
                  onClick={() => { setSortOpen(v => !v); setFilterOpen(false) }}
                  className={`flex items-center gap-2 px-4 py-2.5 border font-syndicatgrotesk text-[10px] tracking-[0.15em] uppercase transition-all ${
                    hasActiveSort
                      ? 'border-rich-gold text-rich-gold bg-rich-gold/10'
                      : 'border-border-gold/50 text-muted-taupe hover:border-rich-gold/60 hover:text-rich-gold'
                  }`}
                >
                  <ArrowUpDown size={12} />
                  <span className="hidden sm:inline">{hasActiveSort ? activeLabel : 'Sort By'}</span>
                  <span className="sm:hidden">Sort</span>
                  <ChevronDown size={10} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {sortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-52 bg-white border border-border-light z-50 shadow-lg"
                    >
                      {SORT_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => { setSort(opt.value); setSortOpen(false) }}
                          className={`w-full flex items-center justify-between px-4 py-3 font-syndicatgrotesk text-[10px] tracking-[0.12em] uppercase transition-colors border-b border-border-light last:border-0 ${
                            sort === opt.value
                              ? 'text-deep-gold bg-soft-cream'
                              : 'text-warm-black hover:text-deep-gold hover:bg-soft-cream'
                          }`}
                        >
                          {opt.label}
                          {sort === opt.value && <Check size={10} className="text-deep-gold" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Dropdown>

              {/* Clear all */}
              <AnimatePresence>
                {(hasActiveFilter || hasActiveSort) && (
                  <motion.button
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    onClick={clearAll}
                    className="flex items-center gap-1.5 font-syndicatgrotesk text-[9px] tracking-[0.15em] uppercase text-muted-taupe/50 hover:text-rich-gold transition-colors"
                  >
                    <X size={9} />
                    Clear
                  </motion.button>
                )}
              </AnimatePresence>

              {/* ─ Filter — pinned right ─ */}
              <div className="ml-auto">
                <Dropdown open={filterOpen} onClose={() => setFilterOpen(false)}>
                  <button
                    onClick={() => { setFilterOpen(v => !v); setSortOpen(false) }}
                    className={`flex items-center gap-2 px-4 py-2.5 border font-syndicatgrotesk text-[10px] tracking-[0.15em] uppercase transition-all ${
                      hasActiveFilter
                        ? 'border-rich-gold text-rich-gold bg-rich-gold/10'
                        : 'border-border-gold/50 text-muted-taupe hover:border-rich-gold/60 hover:text-rich-gold'
                    }`}
                  >
                    <SlidersHorizontal size={12} />
                    <span className="hidden sm:inline">{hasActiveFilter ? priceLabel : 'Filter'}</span>
                    <span className="sm:hidden">Filter</span>
                    {hasActiveFilter && (
                      <span className="w-4 h-4 rounded-full bg-rich-gold text-site-black text-[8px] font-bold flex items-center justify-center">
                        1
                      </span>
                    )}
                    <ChevronDown size={10} className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {filterOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-1 w-52 bg-white border border-border-light z-50 shadow-lg"
                      >
                        <div className="px-4 py-2.5 border-b border-border-light flex items-center justify-between">
                          <span className="font-syndicatgrotesk text-[9px] tracking-[0.25em] uppercase text-text-muted">
                            Price Range
                          </span>
                          {hasActiveFilter && (
                            <button onClick={() => setPrice('all')} className="text-text-muted hover:text-deep-gold transition-colors">
                              <X size={10} />
                            </button>
                          )}
                        </div>
                        {PRICE_OPTIONS.map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => { setPrice(opt.value); setFilterOpen(false) }}
                            className={`w-full flex items-center justify-between px-4 py-3 font-syndicatgrotesk text-[10px] tracking-[0.12em] uppercase transition-colors border-b border-border-light last:border-0 ${
                              price === opt.value
                                ? 'text-deep-gold bg-soft-cream'
                                : 'text-warm-black hover:text-deep-gold hover:bg-soft-cream'
                            }`}
                          >
                            {opt.label}
                            {price === opt.value && <Check size={10} className="text-deep-gold" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Dropdown>
              </div>
            </div>

            {/* Category name — right on desktop, top on mobile */}
            <div className="order-1 lg:order-2 lg:text-right">
              <h1 className="font-brandon text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-ivory leading-none">
                {categoryName}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* ── Products grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

        {/* Active filter pill */}
        <AnimatePresence>
          {(hasActiveFilter || hasActiveSort) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="flex flex-wrap items-center gap-2 pb-1">
                <span className="font-syndicatgrotesk text-[9px] tracking-[0.2em] uppercase text-text-muted">
                  Active:
                </span>
                {hasActiveSort && (
                  <button
                    onClick={() => setSort('featured')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-soft-cream border border-border-light font-syndicatgrotesk text-[9px] tracking-[0.1em] uppercase text-warm-black hover:border-deep-gold transition-colors"
                  >
                    {activeLabel}
                    <X size={8} />
                  </button>
                )}
                {hasActiveFilter && (
                  <button
                    onClick={() => setPrice('all')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-soft-cream border border-border-light font-syndicatgrotesk text-[9px] tracking-[0.1em] uppercase text-warm-black hover:border-deep-gold transition-colors"
                  >
                    {priceLabel}
                    <X size={8} />
                  </button>
                )}
                <span className="font-syndicatgrotesk text-[9px] tracking-[0.1em] text-text-muted">
                  — {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {filtered.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.35 }}
                >
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.original_price ?? undefined}
                    weight={product.weight ?? undefined}
                    image={getFirstImage(product.image)}
                    isDark={false}
                  />
                </motion.div>
              ))}
            </div>

            <p className="mt-10 text-center font-syndicatgrotesk text-[9px] tracking-[0.25em] uppercase text-text-muted">
              {filtered.length} of {products.length} pieces
            </p>
          </>
        ) : products.length === 0 ? (
          /* No products in category at all */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 border-2 border-dashed border-border-light flex items-center justify-center bg-soft-cream mb-6">
              <svg className="w-8 h-8 text-muted-taupe" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="font-brandon text-xl font-black uppercase tracking-tight text-warm-black mb-2">
              Coming Soon
            </h2>
            <p className="font-syndicatgrotesk text-sm text-text-muted max-w-xs leading-relaxed mb-8">
              We're adding new pieces to the {categoryName} collection. Check back soon or explore our other collections.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {allCategories
                .filter(c => (c.slug ?? c.name.toLowerCase().replace(/\s+/g, '-')) !== slug)
                .slice(0, 4)
                .map(c => {
                  const catSlug = c.slug ?? c.name.toLowerCase().replace(/\s+/g, '-')
                  return (
                    <Link
                      key={c.id}
                      href={`/category/${catSlug}`}
                      className="px-5 py-2.5 border border-border-light bg-white font-syndicatgrotesk text-[10px] tracking-[0.18em] uppercase text-text-muted hover:border-deep-gold hover:text-deep-gold transition-colors"
                    >
                      {c.name}
                    </Link>
                  )
                })}
              <Link
                href="/"
                className="px-5 py-2.5 bg-warm-black text-ivory font-syndicatgrotesk text-[10px] tracking-[0.18em] uppercase hover:bg-deep-gold transition-colors"
              >
                View All
              </Link>
            </div>
          </div>
        ) : (
          /* Filters returned no results */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 border-2 border-dashed border-border-light flex items-center justify-center bg-soft-cream mb-6">
              <SlidersHorizontal size={22} className="text-muted-taupe" />
            </div>
            <h2 className="font-brandon text-xl font-black uppercase tracking-tight text-warm-black mb-2">
              No results
            </h2>
            <p className="font-syndicatgrotesk text-sm text-text-muted mb-6">
              No pieces match the selected filters.
            </p>
            <button
              onClick={clearAll}
              className="px-6 py-3 bg-warm-black text-ivory font-syndicatgrotesk text-[10px] tracking-[0.2em] uppercase hover:bg-deep-gold transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </>
  )
}
