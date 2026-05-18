'use client'

import { motion } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: 'easeOut' as const },
})

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: 'clamp(480px, 70vh, 800px)' }}>

      {/* Full-bleed background image */}
      <img
        src="/images/hero_image.png"
        alt="Sri Devi Kangan Gold Bangles"
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: 'center center' }}
      />

      {/* Mobile overlay — full dark tint so text is readable on small screens */}
      <div className="absolute inset-0 pointer-events-none sm:hidden" style={{ background: 'rgba(13,13,13,0.55)' }} />

      {/* Mobile: bottom half fade so content at bottom is readable */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none sm:hidden" style={{ background: 'linear-gradient(to top, rgba(13,13,13,0.85) 0%, transparent 100%)' }} />

      {/* Content — centered on mobile, left-aligned on desktop */}
      <div className="relative z-10 flex flex-col h-full px-5 sm:px-12 lg:px-20 xl:px-28
        items-center justify-end pb-10
        sm:items-start sm:justify-center sm:pb-0
        max-w-full sm:max-w-[600px]">

        {/* Eyebrow */}
        <motion.div {...fadeUp(0)} className="flex items-center gap-3 mb-4 sm:mb-7">
          <div className="w-6 sm:w-8 h-px bg-rich-gold/70" />
          {/* <span className="font-syndicatgrotesk text-[8px] sm:text-[9px] tracking-[0.45em] uppercase text-rich-gold/80">
            One Gram Gold
          </span> */}
        </motion.div>

        {/* Headline */}
        <div className="mb-4 sm:mb-6 text-center sm:text-left">
          <motion.h1
            {...fadeUp(0.1)}
            className="font-syndicatgrotesk text-[2.2rem] sm:text-[3.8rem] lg:text-[4.5rem] font-black uppercase leading-[0.9] text-ivory"
          >
            Bridal to
          </motion.h1>
          <motion.h1
            {...fadeUp(0.18)}
            className="font-brandon text-[2.2rem] sm:text-[3.8rem] lg:text-[4.5rem] font-black uppercase leading-[0.9] tracking-widest"
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

        {/* Paragraph — hidden on very small, shown from sm */}
        <motion.p
          {...fadeUp(0.28)}
          className="hidden sm:block font-syndicatgrotesk text-sm sm:text-[15px] text-muted-taupe leading-[1.85] max-w-[380px] mb-10 text-left"
        >
          A jewellery collection designed for every occasion — from bridal
          elegance to everyday wear, made to match every version of you.
        </motion.p>

        {/* Paragraph mobile — shorter version */}
        <motion.p
          {...fadeUp(0.28)}
          className="sm:hidden font-syndicatgrotesk text-[11px] text-ivory/70 leading-[1.7] text-center max-w-[280px] mb-6"
        >
          From bridal elegance to everyday wear, made for every version of you.
        </motion.p>

        {/* CTA */}
        <motion.div {...fadeUp(0.4)}>
          <motion.a
            href="#collections"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center px-8 sm:px-9 py-3.5 sm:py-4 bg-rich-gold text-site-black font-syndicatgrotesk text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.28em] hover:bg-light-gold transition-colors duration-200 animate-glow-pulse"
          >
            Shop Collection
          </motion.a>
        </motion.div>

      </div>

    </section>
  )
}
