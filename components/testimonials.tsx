'use client'

import { Star } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const testimonials = [
  {
    name: 'Priya S.',
    city: 'Mumbai',
    text: 'Finally, jewelry I can wear every day without worrying. The craftsmanship is impeccable and so lightweight.',
    rating: 5,
  },
  {
    name: 'Anjali R.',
    city: 'Delhi',
    text: "I've been a customer for two years. Vinayak Creation pieces are my go-to for both daily wear and special occasions.",
    rating: 5,
  },
  {
    name: 'Neha K.',
    city: 'Bangalore',
    text: 'The entire experience from browsing to delivery was seamless. Highly recommended for quality gold jewelry.',
    rating: 5,
  },
]

export function Testimonials() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="w-full bg-site-black py-16 sm:py-24" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center space-y-3 mb-12 sm:mb-16"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-px bg-rich-gold/50" />
            <span className="font-syndicatgrotesk text-[9px] tracking-[0.35em] uppercase text-rich-gold/80">
              Customer Love
            </span>
            <div className="w-10 h-px bg-rich-gold/50" />
          </div>
          <h2 className="font-brandon text-4xl sm:text-5xl font-black uppercase tracking-tight text-ivory leading-none">
            Loved by Her
          </h2>
          <div className="flex items-center justify-center gap-1 pt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} className="fill-rich-gold text-rich-gold" />
            ))}
            <span className="font-syndicatgrotesk text-[10px] tracking-widest text-muted-taupe ml-2">4.9 · 2,300+ Reviews</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 45 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15, ease: 'easeOut' }}
              whileHover={{ y: -5, boxShadow: '0 8px 40px rgba(212,160,23,0.12)' }}
              className="relative p-7 border border-border-gold/40 hover:border-rich-gold/50 transition-all duration-300 group cursor-default"
            >
              {/* Quote mark */}
              <span className="absolute top-4 right-5 font-brandon text-7xl font-black text-border-gold/25 leading-none select-none pointer-events-none">
                "
              </span>

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={12} className="fill-rich-gold text-rich-gold" />
                ))}
              </div>

              <p className="font-syndicatgrotesk text-sm text-muted-taupe leading-relaxed mb-6">
                "{t.text}"
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-border-gold/30">
                <div className="w-9 h-9 bg-rich-gold/15 border border-rich-gold/30 flex items-center justify-center">
                  <span className="font-brandon text-sm font-black text-rich-gold">
                    {t.name[0]}
                  </span>
                </div>
                <div>
                  <p className="font-brandon text-xs font-black uppercase tracking-wide text-ivory">
                    {t.name}
                  </p>
                  <p className="font-syndicatgrotesk text-[10px] tracking-widest uppercase text-muted-taupe/80">
                    {t.city}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
