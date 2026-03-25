'use client'

import { ProductCard } from './product-card'
import { ChevronRight } from 'lucide-react'

interface ProductScrollProps {
  title: string
  viewAllLink?: string
  isDark?: boolean
  products: Array<{ id: string; name: string; price: number; weight?: string; image?: string }>
}

export function ProductScroll({
  title,
  viewAllLink = '#',
  isDark = false,
  products,
}: ProductScrollProps) {
  return (
    <section className={`w-full py-16 sm:py-20 ${isDark ? 'bg-warm-black' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <h2 className={`font-serif italic text-3xl sm:text-4xl ${isDark ? 'text-white' : 'text-warm-black'}`}>
            {title}
          </h2>
          <a
            href={viewAllLink}
            className={`flex items-center gap-2 font-sans text-xs uppercase tracking-widest transition-colors ${
              isDark
                ? 'text-deep-gold hover:text-white'
                : 'text-deep-gold hover:text-warm-black'
            }`}
          >
            View All <ChevronRight size={16} />
          </a>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="flex gap-6 pb-4 min-w-min">
            {products.map((product, index) => (
              <ProductCard
                key={index}
                {...product}
                isDark={isDark}
              />
            ))}
          </div>
          {/* Hide scrollbar */}
          <style>{`
            .overflow-x-auto {
              scrollbar-width: none;
            }
            .overflow-x-auto::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>
      </div>
    </section>
  )
}
