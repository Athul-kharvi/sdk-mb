'use client'

import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / 40
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 30)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{count}{suffix}</span>
}

export function EditorialStory() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="w-full bg-site-black py-14 sm:py-20 lg:py-28 overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">

          {/* Image — left */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="order-2 lg:order-1 relative"
          >
            {/* Decorative frames */}
            <div className="absolute -top-5 -left-5 w-3/4 h-3/4 border border-border-gold/35 pointer-events-none" />
            <div className="absolute -bottom-5 -right-5 w-3/4 h-3/4 border border-border-gold/20 pointer-events-none" />

            <div className="relative aspect-[4/3] sm:aspect-[4/5] overflow-hidden">
              <Image
                src="/images/men-bangle.jpg"
                alt="Sri Devi Kangan — Craftsmanship"
                fill
                className="object-cover transition-transform duration-1000 hover:scale-[1.04]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                priority
              />
              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-site-black/65 via-transparent to-transparent pointer-events-none" />

              {/* Floating stat card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-8 left-8 bg-site-black/85 backdrop-blur-sm border border-rich-gold/60 px-5 py-4"
                style={{ boxShadow: '0 0 20px rgba(212,160,23,0.2)' }}
              >
                <p className="font-brandon text-3xl font-black text-rich-gold leading-none">
                  <CountUp target={10} suffix="K+" />
                </p>
                <p className="font-syndicatgrotesk text-[9px] tracking-[0.28em] uppercase text-muted-taupe mt-1">
                  Happy Customers
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Text — right */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.15, ease: 'easeOut' }}
            className="order-1 lg:order-2 space-y-7"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-rich-gold" />
              <span className="font-syndicatgrotesk text-[9px] tracking-[0.35em] uppercase text-rich-gold">
                Our Story
              </span>
            </div>

            <h2 className="font-brandon text-3xl sm:text-4xl lg:text-6xl font-black uppercase leading-[0.88] tracking-tight text-ivory">
              Crafted With<br />
              <span
                className="text-transparent bg-clip-text animate-shimmer-text"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #B8860B, #D4A017, #F0C040, #D4A017, #B8860B)',
                  backgroundSize: '200% auto',
                }}
              >
                Pure Love
              </span>
            </h2>

            <p className="font-syndicatgrotesk text-sm sm:text-[15px] text-muted-taupe leading-relaxed max-w-md">
              Sri Devi Kangan was born from a deep love of Indian craftsmanship.
              Each piece is handcrafted in one-gram gold — radiant, lightweight,
              and made to be worn every single day. From festivals to daily wear,
              our jewelry moves with you.
            </p>

            {/* Stats grid with countup */}
            <div className="grid grid-cols-2 gap-5 pt-2">
              {[
                { stat: 1, suffix: 'g', label: 'Pure Gold Standard' },
                { stat: 0, suffix: 'BIS', label: 'Hallmark Certified', raw: true },
                { stat: 500, suffix: '+', label: 'Unique Designs' },
                { stat: 100, suffix: '%', label: 'Handcrafted' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1, ease: 'easeOut' }}
                  className="border-l-2 border-rich-gold/50 pl-4 py-1 hover:border-rich-gold transition-colors duration-200"
                >
                  <p className="font-brandon text-xl font-black text-rich-gold leading-none">
                    {item.raw ? item.suffix : <CountUp target={item.stat} suffix={item.suffix} />}
                  </p>
                  <p className="font-syndicatgrotesk text-[9px] tracking-[0.2em] uppercase text-muted-taupe/80 mt-1">{item.label}</p>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="#story"
              whileHover={{ x: 4 }}
              className="inline-flex items-center gap-3 group"
            >
              <span className="font-syndicatgrotesk text-xs tracking-[0.2em] uppercase text-muted-taupe group-hover:text-rich-gold transition-colors duration-200">
                Discover Our Craft
              </span>
              <span className="text-rich-gold transition-transform duration-200">→</span>
              <motion.span
                initial={{ width: 0 }}
                whileHover={{ width: '3rem' }}
                className="h-px bg-rich-gold block"
              />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
