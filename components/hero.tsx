'use client'

import { motion } from 'framer-motion'
import { useEffect, useState, useCallback } from 'react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: 'easeOut' as const },
})

// ─── Slideshow ────────────────────────────────────────────────────────────────
function Slideshow({ images, objectPosition = 'center' }: { images: string[]; objectPosition?: string }) {
  const [idx, setIdx] = useState(0)
  const count = images.length

  const prev = useCallback(() => setIdx(i => (i - 1 + count) % count), [count])
  const next = useCallback(() => setIdx(i => (i + 1) % count), [count])

  // Auto-advance every 3 s
  useEffect(() => {
    if (count <= 1) return
    const t = setInterval(next, 3000)
    return () => clearInterval(t)
  }, [count, next])

  return (
    <div className="absolute inset-0">
      {/* Images — crossfade */}
      {images.map((src, i) => (
        <img
          key={src + i}
          src={src}
          alt=""
          fetchPriority={i === 0 ? 'high' : 'low'}
          loading={i === 0 ? 'eager' : 'lazy'}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 pointer-events-none"
          style={{ opacity: i === idx ? 1 : 0, objectPosition }}
        />
      ))}

      {/* Arrows — only if more than 1 image */}
      {count > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center bg-black/40 hover:bg-black/70 border border-white/20 text-white transition-colors duration-200"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center bg-black/40 hover:bg-black/70 border border-white/20 text-white transition-colors duration-200"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {count > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2 items-center">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${i === idx ? 'w-5 h-1.5 bg-[#D4A017]' : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main Hero ────────────────────────────────────────────────────────────────
export function Hero() {
  const [desktopImgs, setDesktopImgs] = useState<string[]>(['/images/hero_image.png'])
  const [mobileImgs, setMobileImgs] = useState<string[]>(['/images/hero_image_mobile.png'])

  // Fetch fresh from DB every time — bypasses all Next.js caching
  useEffect(() => {
    fetch('/api/admin/hero', { cache: 'no-store' })
      .then(r => r.json())
      .then(({ data }) => {
        if (!data) return
        const norm = (v: any): string[] => {
          if (Array.isArray(v) && v.length) return v.filter(Boolean)
          if (typeof v === 'string' && v) return [v]
          return []
        }
        const d = norm(data.desktop)
        const m = norm(data.mobile)
        if (d.length) setDesktopImgs(d)
        if (m.length) setMobileImgs(m)
        else if (d.length) setMobileImgs(d) // fallback: use desktop for mobile
      })
      .catch(() => {})
  }, [])

  return (
    <>
      {/* ── MOBILE ── */}
      <section className="sm:hidden relative w-full overflow-hidden" style={{ height: '92svh' }}>
        <Slideshow images={mobileImgs} objectPosition="center bottom" />

        <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to bottom, rgba(13,13,13,0.72) 0%, transparent 100%)' }} />

        <div className="absolute top-0 left-0 right-0 z-10 px-6 pt-14 flex flex-col items-center text-center pointer-events-none">
          <motion.h1 {...fadeUp(0.05)} className="font-syndicatgrotesk text-[2.2rem] font-black uppercase leading-[0.92] text-ivory mb-1">
            Bridal to
          </motion.h1>
          <motion.h1 {...fadeUp(0.12)} className="font-brandon text-[2.2rem] font-black uppercase leading-[0.92] tracking-widest mb-4">
            <span className="text-transparent bg-clip-text animate-shimmer-text"
              style={{ backgroundImage: 'linear-gradient(90deg, #B8860B, #D4A017, #F0C040, #D4A017, #B8860B)', backgroundSize: '200% auto' }}>
              Daily
            </span>
          </motion.h1>
          <motion.p {...fadeUp(0.18)} className="font-syndicatgrotesk text-[11px] text-ivory/80 leading-[1.75] max-w-[260px] mb-5">
            A jewellery collection designed for every occasion — from bridal elegance to everyday wear, made to match every version of you.
          </motion.p>
          <motion.div {...fadeUp(0.28)} className="pointer-events-auto">
            <motion.a href="#collections" whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center px-7 py-3 bg-[#1d1607] text-[#FFD700] font-syndicatgrotesk text-[9px] font-bold uppercase tracking-[0.28em] hover:bg-[#2a2008] transition-colors duration-200">
              Shop Collection
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ── DESKTOP ── */}
      <section className="hidden sm:block relative w-full overflow-hidden" style={{ height: 'clamp(480px, 70vh, 800px)' }}>
        <Slideshow images={desktopImgs} />

        <div className="relative z-10 flex flex-col justify-center h-full px-12 lg:px-20 xl:px-28 max-w-[600px] pointer-events-none">
          <motion.div {...fadeUp(0)} className="flex items-center gap-3 mb-7">
            <div className="w-8 h-px bg-rich-gold/70" />
          </motion.div>

          <div className="mb-6">
            <motion.h1 {...fadeUp(0.1)} className="font-syndicatgrotesk text-[3.8rem] lg:text-[4.5rem] font-black uppercase leading-[0.9] text-ivory">
              Bridal to
            </motion.h1>
            <motion.h1 {...fadeUp(0.18)} className="font-brandon text-[3.8rem] lg:text-[4.5rem] font-black uppercase leading-[0.9] tracking-widest">
              <span className="text-transparent bg-clip-text animate-shimmer-text"
                style={{ backgroundImage: 'linear-gradient(90deg, #B8860B, #D4A017, #F0C040, #D4A017, #B8860B)', backgroundSize: '200% auto' }}>
                Daily
              </span>
            </motion.h1>
          </div>

          <motion.p {...fadeUp(0.28)} className="font-syndicatgrotesk text-[15px] text-muted-taupe leading-[1.85] max-w-[380px] mb-10">
            A jewellery collection designed for every occasion — from bridal elegance to everyday wear, made to match every version of you.
          </motion.p>

          <motion.div {...fadeUp(0.4)} className="pointer-events-auto">
            <motion.a href="#collections" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center px-9 py-4 bg-[#1d1607] text-[#FFD700] font-syndicatgrotesk text-[10px] font-bold uppercase tracking-[0.28em] hover:bg-[#2a2008] transition-colors duration-200">
              Shop Collection
            </motion.a>
          </motion.div>
        </div>
      </section>
    </>
  )
}