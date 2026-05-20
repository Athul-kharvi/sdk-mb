'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const SLUG_IMAGES: Record<string, string> = {
  rings: '/images/ring.jpg',
  earrings: '/images/pendent.png',
  necklaces: '/images/necklace.jpg',
  bangles: '/images/bangle.jpg',
  pendants: '/images/pendent.png',
  'children-kada': '/images/children_kada.png',
}

interface CategoryItem {
  id: string
  name: string
  slug: string
}

interface CategoryGridProps {
  categories?: CategoryItem[]
}

const STATIC_CATEGORIES: CategoryItem[] = [
  { id: 'rings', name: 'Rings', slug: 'rings' },
  { id: 'earrings', name: 'Earrings', slug: 'earrings' },
  { id: 'necklaces', name: 'Necklaces', slug: 'necklaces' },
  { id: 'bangles', name: 'Bangles', slug: 'bangles' },
]

export function CategoryGrid({ categories }: CategoryGridProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const raw = categories && categories.length > 0 ? categories : STATIC_CATEGORIES
  const items = raw
    .filter(c => !['new-arrivals', 'new arrivals'].includes((c.slug || c.name).toLowerCase()))
    .slice(0, 4)

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
          Limited Styles · Endless Impressions
        </p>
      </motion.div>

      {/* Grid */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5 max-w-7xl mx-auto">
          {items.map((cat, i) => {
            const slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')
            const image = SLUG_IMAGES[cat.slug] || SLUG_IMAGES[cat.name.toLowerCase()] || '/images/ring.jpg'
            return (
              <motion.a
                key={cat.id}
                href={`/category/${slug}`}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.15 + i * 0.1, ease: 'easeOut' }}
                className="group relative overflow-hidden block cursor-pointer rounded-sm"
                aria-label={`Shop ${cat.name}`}
              >
                {/* Image */}
                <div className="relative aspect-[3/4] sm:aspect-[4/3] w-full overflow-hidden bg-card-dark">
                  <Image
                    src={image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    priority={i < 2}
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Gold border reveal on hover */}
                  <div className="absolute inset-0 border border-rich-gold/0 group-hover:border-rich-gold/50 transition-all duration-500 rounded-sm" />
                </div>

                {/* Bottom-left overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <h3
                    className="font-brandon text-base sm:text-3xl font-black uppercase text-white tracking-wide leading-none mb-2 sm:mb-3"
                    style={{ transform: 'scaleY(1.4) scaleX(1.1)', transformOrigin: 'bottom left', display: 'inline-block' }}
                  >
                    {cat.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="font-syndicatgrotesk text-[11px] sm:text-xs tracking-[0.15em] uppercase font-bold text-white">
                      Shop Now
                    </span>
                    <span className="text-white text-sm transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                  </div>
                </div>
              </motion.a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
