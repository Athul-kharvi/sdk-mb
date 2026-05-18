'use client'

import { motion } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: 'easeOut' as const },
})

export function Hero() {
  return (
    <>
      {/* ── MOBILE (< sm) — portrait image, text pinned to top ── */}
      <section className="sm:hidden relative w-full overflow-hidden" style={{ height: '92svh' }}>
        <img
          src="/images/hero_image_mobile.png"
          alt="Sri Devi Kangan Gold Bangles"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center bottom' }}
        />

        {/* Top gradient so text reads over image */}
        <div
          className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(13,13,13,0.72) 0%, transparent 100%)' }}
        />

        {/* Text pinned to top */}
        <div className="absolute top-0 left-0 right-0 z-10 px-6 pt-14 flex flex-col items-center text-center">
          <motion.h1
            {...fadeUp(0.05)}
            className="font-syndicatgrotesk text-[2.2rem] font-black uppercase leading-[0.92] text-ivory mb-1"
          >
            Bridal to
          </motion.h1>
          <motion.h1
            {...fadeUp(0.12)}
            className="font-brandon text-[2.2rem] font-black uppercase leading-[0.92] tracking-widest mb-4"
          >
            <span
              className="text-transparent bg-clip-text animate-shimmer-text"
              style={{
                backgroundImage: 'linear-gradient(90deg, #B8860B, #D4A017, #F0C040, #D4A017, #B8860B)',
                backgroundSize: '200% auto',
              }}
            >
              Daily
            </span>
          </motion.h1>
          <motion.p
            {...fadeUp(0.18)}
            className="font-syndicatgrotesk text-[11px] text-ivory/80 leading-[1.75] max-w-[260px] mb-5"
          >
            A jewellery collection designed for every occasion — from bridal elegance to everyday wear, made to match every version of you.
          </motion.p>
          <motion.div {...fadeUp(0.28)}>
            <motion.a
              href="#collections"
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center px-7 py-3 bg-[#1d1607] text-[#FFD700] font-syndicatgrotesk text-[9px] font-bold uppercase tracking-[0.28em] hover:bg-[#2a2008] transition-colors duration-200"
            >
              Shop Collection
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ── DESKTOP (sm+) — landscape image, text left-aligned ── */}
      <section
        className="hidden sm:block relative w-full overflow-hidden"
        style={{ height: 'clamp(480px, 70vh, 800px)' }}
      >
        <img
          src="/images/hero_image.png"
          alt="Sri Devi Kangan Gold Bangles"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />


        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center h-full px-12 lg:px-20 xl:px-28 max-w-[600px]">
          <motion.div {...fadeUp(0)} className="flex items-center gap-3 mb-7">
            <div className="w-8 h-px bg-rich-gold/70" />
            <span className="font-syndicatgrotesk text-[9px] tracking-[0.45em] uppercase text-rich-gold/80">
              One Gram Gold
            </span>
          </motion.div>

          <div className="mb-6">
            <motion.h1
              {...fadeUp(0.1)}
              className="font-syndicatgrotesk text-[3.8rem] lg:text-[4.5rem] font-black uppercase leading-[0.9] text-ivory"
            >
              Bridal to
            </motion.h1>
            <motion.h1
              {...fadeUp(0.18)}
              className="font-brandon text-[3.8rem] lg:text-[4.5rem] font-black uppercase leading-[0.9] tracking-widest"
            >
              <span
                className="text-transparent bg-clip-text animate-shimmer-text"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #B8860B, #D4A017, #F0C040, #D4A017, #B8860B)',
                  backgroundSize: '200% auto',
                }}
              >
                Daily
              </span>
            </motion.h1>
          </div>

          <motion.p
            {...fadeUp(0.28)}
            className="font-syndicatgrotesk text-[15px] text-muted-taupe leading-[1.85] max-w-[380px] mb-10"
          >
            A jewellery collection designed for every occasion — from bridal
            elegance to everyday wear, made to match every version of you.
          </motion.p>

          <motion.div {...fadeUp(0.4)}>
            <motion.a
              href="#collections"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center px-9 py-4 bg-[#1d1607] text-[#FFD700] font-syndicatgrotesk text-[10px] font-bold uppercase tracking-[0.28em] hover:bg-[#2a2008] transition-colors duration-200"
            >
              Shop Collection
            </motion.a>
          </motion.div>
        </div>
      </section>
    </>
  )
}
