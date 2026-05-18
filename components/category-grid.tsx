'use client'

import Image from 'next/image'
import { useRef } from 'react'

// Fallback static images keyed by slug
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

  const raw = categories && categories.length > 0 ? categories : STATIC_CATEGORIES
  // Exclude "new arrivals" and cap at 4 for a clean 2×2
  const items = raw
    .filter(c => !['new-arrivals', 'new arrivals'].includes((c.slug || c.name).toLowerCase()))
    .slice(0, 4)

  return (
    <section className="w-full bg-site-black py-14 sm:py-20" ref={ref}>

      {/* Header */}
      <div className="text-center space-y-3 mb-8 sm:mb-12 px-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-rich-gold" />
          {/* <span className="font-syndicatgrotesk text-[9px] tracking-[0.35em] uppercase text-rich-gold/80">Explore</span> */}
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-rich-gold" />
        </div>
        <h2 className="font-brandon text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-[0.12em] text-ivory leading-none">
          Shop by Category
        </h2>
        <p className="font-syndicatgrotesk text-xs text-muted-taupe tracking-[0.15em]">
          Limited Styles · Endless Impressions
        </p>
      </div>

      {/* Grid — full bleed, no gaps */}
      <div className="grid grid-cols-2">
        {items.map((cat, i) => {
          const slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')
          const image = SLUG_IMAGES[cat.slug] || SLUG_IMAGES[cat.name.toLowerCase()] || '/images/ring.jpg'
          return (
            <a
              key={cat.id}
              href={`/category/${slug}`}
              className="group relative overflow-hidden block cursor-pointer w-full"
              aria-label={`Shop ${cat.name}`}
            >
              {/* Image — shorter aspect ratio to shrink size */}
              <div className="relative aspect-[4/3] sm:aspect-[2/1] w-full overflow-hidden bg-card-dark">
                <Image
                  src={image}
                  alt={cat.name}
                  fill
                  sizes="50vw"
                  className="object-cover"
                  priority={i < 2}
                />
                <div className="absolute inset-0 bg-site-black/40" />
              </div>

              {/* Category name — top */}
              <div className="absolute top-0 left-0 right-0 p-4 sm:p-5">
                <h3 className="font-brandon text-xl sm:text-2xl font-black uppercase tracking-wide text-ivory leading-none">
                  {cat.name}
                </h3>
              </div>

              {/* Shop Now — bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                <span className="font-syndicatgrotesk text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-ivory font-bold underline underline-offset-4">
                  Shop Now
                </span>
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}
