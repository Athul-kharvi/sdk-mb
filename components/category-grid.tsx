'use client'

import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const CATEGORIES = [
  { name: 'Rings', id: 'rings', image: '/images/ring.jpg', count: '120+ Styles' },
  { name: 'Earrings', id: 'earrings', image: '/images/pendent.png', count: '200+ Styles' },
  { name: 'Necklaces', id: 'necklaces', image: '/images/necklace.jpg', count: '90+ Styles' },
  { name: 'Bangles', id: 'bangles', image: '/images/bangle.jpg', count: '80+ Styles' },
]

export function CategoryGrid() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="w-full bg-site-black py-16 sm:py-20" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center space-y-3 mb-10 sm:mb-14"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-rich-gold" />
            <span className="font-syndicatgrotesk text-[9px] tracking-[0.35em] uppercase text-rich-gold/80">
              Explore
            </span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-rich-gold" />
          </div>
          <h2 className="font-brandon text-3xl sm:text-4xl font-black uppercase tracking-tight text-ivory leading-none">
            ║ Shop by Category ║
          </h2>
          <p className="font-syndicatgrotesk text-xs text-muted-taupe tracking-[0.15em]">
            Limited Styles · Endless Impressions
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.a
              key={cat.id}
              href={`#${cat.id}`}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12, ease: 'easeOut' }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden block"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-card-dark">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-108"
                  priority
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-site-black/85 via-site-black/20 to-transparent" />
                {/* Hover gold tint */}
                <div className="absolute inset-0 bg-rich-gold/0 group-hover:bg-rich-gold/10 transition-all duration-500" />
              </div>

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                <p className="font-syndicatgrotesk text-[8px] tracking-[0.25em] uppercase text-rich-gold/70 mb-1">
                  {cat.count}
                </p>
                <h3 className="font-brandon text-xl sm:text-2xl font-black uppercase tracking-wide text-ivory leading-none">
                  {cat.name}
                </h3>
                <motion.div
                  className="h-px bg-rich-gold mt-2 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  style={{ width: '2rem' }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Gold border on hover */}
              <div className="absolute inset-0 border border-transparent group-hover:border-rich-gold/40 transition-all duration-400 pointer-events-none" />

              {/* Corner accent top-right */}
              <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-rich-gold/0 group-hover:border-rich-gold/60 transition-all duration-400 pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-rich-gold/0 group-hover:border-rich-gold/60 transition-all duration-400 pointer-events-none" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
