'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// const SLUG_IMAGES: Record<string, string> = {
//   rings: '/images/ring.jpg',
//   earrings: '/images/pendent.png',
//   necklaces: '/images/necklace.jpg',
//   bangles: '/images/bangle.jpg',
//   pendants: '/images/pendent.png',
//   'children-kada': '/images/children_kada.png',
// }

interface CategoryItem {
  id: string
  name: string
  slug: string
  image?: string | null
  sort_order?: number | null
}

interface CategoryGridProps {
  categories?: CategoryItem[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const items = (categories ?? []).filter(
    c => !['new-arrivals', 'new arrivals'].includes((c.slug || c.name).toLowerCase())
  )

  if (items.length === 0) return null

  return (
    <section className="w-full bg-site-black py-14 sm:py-20" ref={ref}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="text-center space-y-3 mb-10 sm:mb-14 px-4"
      >
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-rich-gold" />
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-rich-gold" />
        </div>
        <h2 className="font-brandon text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-[0.12em] text-ivory leading-none">
          Shop by Category
        </h2>
        <p className="font-syndicatgrotesk text-xs text-muted-taupe tracking-[0.15em]">
          {/* Limited Styles · Endless Impressions */}
        </p>
      </motion.div>

      {/* Grid — flex-wrap + justify-center auto-centers the last row when odd */}
      <div className="px-2 sm:px-3 lg:px-12">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:max-w-7xl lg:mx-auto">
          {items.map((cat, i) => {
            const slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')
            const image = cat.image || null
            return (
              <motion.a
                key={cat.id}
                href={`/category/${slug}`}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: Math.min(0.15 + i * 0.08, 0.65), ease: 'easeOut' }}
                className="group relative overflow-hidden cursor-pointer rounded-sm w-[calc(50%-4px)] lg:w-[calc(33.333%-8px)]"
                aria-label={`Shop ${cat.name}`}
              >
                {/* Image */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-card-dark">
                  {image ? (
                  <Image
                    src={image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    priority={i < 4}
                  />
                  ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a]" />
                  )}
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Gold border reveal on hover */}
                  <div className="absolute inset-0 border border-rich-gold/0 group-hover:border-rich-gold/50 transition-all duration-500 rounded-sm" />
                </div>

                {/* Bottom overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-brandon text-sm sm:text-lg font-bold uppercase text-white tracking-[0.12em] leading-tight mb-1.5 drop-shadow-lg">
                    {cat.name}
                  </h3>
                  {/* Mobile: always visible · Desktop: fade in on hover */}
                  <div className="flex items-center gap-1.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                    <span className="font-syndicatgrotesk text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#D4A017]">
                      Shop Now
                    </span>
                    <span className="text-[#D4A017] text-xs sm:group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </div>

                {/* Glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{ boxShadow: 'inset 0 0 40px rgba(212,160,23,0.18)' }} />
              </motion.a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
