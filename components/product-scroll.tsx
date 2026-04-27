'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ProductCard } from './product-card'
import { ArrowRight } from 'lucide-react'

interface ProductScrollProps {
  title: string
  subtitle?: string
  viewAllLink?: string
  isDark?: boolean
  products: Array<{ id: string; name: string; price: number; weight?: string; image?: string }>
}

export function ProductScroll({
  title,
  subtitle,
  viewAllLink = '#',
  isDark = false,
  products,
}: ProductScrollProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      id={title.toLowerCase().replace(/\s+/g, '-')}
      ref={ref}
      className={`w-full py-16 sm:py-20 ${isDark ? 'bg-section-dark' : 'bg-soft-cream'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header — dark vs light variants */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-10 sm:mb-12 space-y-3"
        >
          {isDark ? (
            // ── DARK SECTION header ──
            <>
              <div className="flex items-center justify-center gap-3">
                <div className="flex-1 h-px max-w-[60px] bg-rich-gold/40" />
                <span className="font-syndicatgrotesk text-[8px] tracking-[0.3em] uppercase text-rich-gold">
                  {subtitle || 'Collection'}
                </span>
                <div className="flex-1 h-px max-w-[60px] bg-rich-gold/40" />
              </div>
              <h2 className="font-brandon text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none text-ivory">
                ║ {title} ║
              </h2>
              <p className="font-syndicatgrotesk text-[10px] tracking-[0.2em] uppercase text-muted-taupe">
                Premium One Gram Gold · Handcrafted Designs
              </p>
            </>
          ) : (
            // ── LIGHT / CREAM SECTION header ──
            <>
              <div className="flex items-center justify-center gap-4">
                <div className="flex-1 h-[1.5px] max-w-[80px] bg-site-black/25" />
                <span className="font-syndicatgrotesk text-[9px] tracking-[0.35em] uppercase text-deep-gold font-bold">
                  {subtitle || 'Collection'}
                </span>
                <div className="flex-1 h-[1.5px] max-w-[80px] bg-site-black/25" />
              </div>
              <h2 className="font-brandon text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none text-site-black">
                ║ {title} ║
              </h2>
              <p className="font-syndicatgrotesk text-[11px] tracking-[0.2em] uppercase text-site-black/60">
                Premium One Gram Gold · Handcrafted Designs
              </p>
            </>
          )}
        </motion.div>

        {/* Product grid — 4 col desktop, 2 col tablet, horizontal scroll mobile */}
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="grid grid-flow-col sm:grid-flow-row grid-rows-1 sm:grid-rows-none sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 min-w-min sm:min-w-0">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                className="w-44 xs:w-48 sm:w-auto"
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: index * 0.08, ease: 'easeOut' }}
              >
                <ProductCard
                  {...product}
                  isDark={isDark}
                  badge={index === 0 ? 'NEW' : index === 1 ? 'BESTSELLER' : undefined}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* View all CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
          className="flex justify-center mt-10 sm:mt-12"
        >
          <motion.a
            href={viewAllLink}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className={`inline-flex items-center gap-3 px-8 py-3 border font-syndicatgrotesk text-[10px] font-bold tracking-[0.22em] uppercase transition-all duration-200 group ${
              isDark
                ? 'border-rich-gold/50 text-ivory hover:border-rich-gold hover:text-rich-gold hover:bg-rich-gold/8'
                : 'border-site-black text-site-black hover:border-deep-gold hover:text-deep-gold hover:bg-deep-gold/10'
            }`}
          >
            Shop All {title}
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-200" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
