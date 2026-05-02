'use client'

import { motion } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: 'easeOut' as const },
})

export function Hero() {
  return (
    <section className="relative w-full bg-site-black overflow-hidden">
      {/* Radial gold glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,160,23,0.12),transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(184,134,11,0.09),transparent_55%)] pointer-events-none" />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(212,160,23,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,0.6) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── DESKTOP layout (lg+): 3-column grid ── */}
      <div className="hidden lg:block relative w-full max-w-[1400px] mx-auto px-10 py-20">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-10 items-center">

          {/* Left image */}
          <div className="relative animate-[fadeInLeft_0.85s_ease-out_forwards]">
            <div className="relative group overflow-hidden" style={{ aspectRatio: '3/4' }}>
              <img src="/images/ring.jpg" alt="One Gram Gold Rings" fetchPriority="high" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-site-black/70 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 z-20">
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="bg-rich-gold text-site-black px-3 py-1.5">
                  <span className="font-brandon text-sm font-black uppercase tracking-wide">20% OFF</span>
                  <p className="font-syndicatgrotesk text-[8px] tracking-[0.2em] uppercase text-site-black/70">Rings</p>
                </motion.div>
              </div>
              <div className="absolute bottom-5 left-5 right-5 z-20">
                <p className="font-syndicatgrotesk text-[9px] tracking-[0.3em] uppercase text-rich-gold">Collection</p>
                <p className="font-brandon text-lg font-black uppercase text-ivory leading-tight mt-0.5">Rings</p>
              </div>
            </div>
          </div>

          {/* Center text */}
          <div className="flex flex-col items-center text-center space-y-6 w-[460px]">
            <motion.div {...fadeUp(0)} className="flex items-center gap-3">
              <div className="w-10 h-px bg-rich-gold/60" />
              {/* <span className="font-syndicatgrotesk text-[9px] tracking-[0.35em] uppercase text-rich-gold">One Gram Gold</span> */}
              <div className="w-10 h-px bg-rich-gold/60" />
            </motion.div>
            <div className="space-y-1">
              <motion.h1 {...fadeUp(0.1)} className="font-syndicatgrotesk text-[4rem] font-black uppercase leading-[0.85] text-ivory">Bridal to</motion.h1>
              <motion.h1 {...fadeUp(0.2)} className="font-brandon text-[3rem] font-black uppercase leading-[0.85] tracking-widest">
                <span className="text-transparent bg-clip-text animate-shimmer-text" style={{ backgroundImage: 'linear-gradient(90deg, #B8860B, #D4A017, #F0C040, #D4A017, #B8860B)', backgroundSize: '200% auto' }}>Daily</span>
              </motion.h1>
              <motion.div {...fadeUp(0.25)}>
                <p className="font-kapraneuepro text-3xl font-black  leading-[0.9] text-muted-taupe mt-2 tracking-wider">Crafted for Every You</p>
              </motion.div>
            </div>
            <motion.p {...fadeUp(0.3)} className="font-syndicatgrotesk text-sm text-muted-taupe leading-relaxed max-w-xs">
              {/* Handcrafted one-gram gold jewelry for the modern Indian woman. */}
              <br />Rings · Necklaces · Bangles &amp; much more.
            </motion.p>
            <motion.div {...fadeUp(0.4)} className="flex items-center gap-3 flex-wrap justify-center">
              {[{ pct: '20%', cat: 'Rings' }, { pct: '15%', cat: 'Necklaces' }, { pct: '10%', cat: 'Earrings' }].map((b) => (
                <motion.div key={b.cat} whileHover={{ scale: 1.08, y: -3 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="flex flex-col items-center px-5 py-3 border border-rich-gold/60 bg-rich-gold/[0.12] hover:bg-rich-gold/20 hover:border-rich-gold transition-all duration-200 cursor-default">
                  <span className="font-brandon text-2xl font-black text-rich-gold leading-none">{b.pct}</span>
                  <span className="font-syndicatgrotesk text-[8px] tracking-[0.25em] uppercase text-muted-taupe mt-0.5">OFF {b.cat}</span>
                </motion.div>
              ))}
            </motion.div>
            <motion.div {...fadeUp(0.5)} className="flex flex-row gap-3">
              <motion.a href="#collections" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center px-8 py-4 bg-rich-gold text-site-black font-syndicatgrotesk text-[10px] font-bold uppercase tracking-[0.22em] hover:bg-light-gold transition-colors duration-200 animate-glow-pulse">
                Shop Collections
              </motion.a>
              {/* <motion.a href="#story" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center px-8 py-4 border border-muted-taupe/40 text-ivory font-syndicatgrotesk text-[10px] uppercase tracking-[0.22em] hover:border-rich-gold/70 hover:text-rich-gold transition-all duration-200">
                Our Story
              </motion.a> */}
            </motion.div>
            {/* <motion.div {...fadeUp(0.6)} className="flex items-center gap-4 pt-2">
              {['Free Shipping ₹999+', 'BIS Certified', '10K+ Customers'].map((t, idx) => (
                <span key={idx} className="font-syndicatgrotesk text-[8px] tracking-[0.15em] uppercase text-muted-taupe/80">
                  {idx > 0 && <span className="mr-4 text-rich-gold/50">·</span>}{t}
                </span>
              ))}
            </motion.div> */}
          </div>

          {/* Right image */}
          <div className="relative animate-[fadeInRight_0.85s_ease-out_forwards]">
            <div className="relative group overflow-hidden" style={{ aspectRatio: '3/4' }}>
              <img src="/images/necklace.jpg" alt="One Gram Gold Necklaces" fetchPriority="high" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-site-black/70 via-transparent to-transparent" />
              <div className="absolute top-4 right-4 z-20">
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                  className="w-14 h-14 rounded-full bg-rich-gold flex flex-col items-center justify-center animate-glow-pulse">
                  <span className="font-brandon text-sm font-black text-site-black leading-none">NEW</span>
                  <span className="font-syndicatgrotesk text-[7px] tracking-wider text-site-black/70 uppercase">Season</span>
                </motion.div>
              </div>
              <div className="absolute bottom-5 left-5 right-5 z-20">
                <p className="font-syndicatgrotesk text-[9px] tracking-[0.3em] uppercase text-rich-gold">New Arrival</p>
                <p className="font-brandon text-lg font-black uppercase text-ivory leading-tight mt-0.5">Necklaces</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-syndicatgrotesk text-[8px] tracking-[0.3em] uppercase text-muted-taupe/50">Scroll</span>
          <motion.div animate={{ scaleY: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-8 bg-gradient-to-b from-rich-gold/60 to-transparent origin-top" />
        </motion.div>
      </div>

      {/* ── MOBILE / TABLET layout (< lg) ── */}
      <div className="lg:hidden w-full px-4 sm:px-6 pt-10 pb-8 sm:pt-14 sm:pb-10">

        {/* Eyebrow — same as desktop divider lines */}
        <motion.div {...fadeUp(0)} className="flex items-center justify-center gap-3 mb-5 sm:mb-6">
          <div className="w-10 h-px bg-rich-gold/60" />
          <div className="w-10 h-px bg-rich-gold/60" />
        </motion.div>

        {/* Headline — mirrors desktop fonts & text exactly */}
        <div className="text-center space-y-1 mb-4 sm:mb-5">
          <motion.h1 {...fadeUp(0.1)} className="font-syndicatgrotesk text-[2.6rem] sm:text-5xl font-black uppercase leading-[0.85] text-ivory">
            Bridal to
          </motion.h1>
          <motion.h1 {...fadeUp(0.2)} className="font-brandon text-[2.6rem] sm:text-5xl font-black uppercase leading-[0.85] tracking-widest">
            <span className="text-transparent bg-clip-text animate-shimmer-text" style={{ backgroundImage: 'linear-gradient(90deg, #B8860B, #D4A017, #F0C040, #D4A017, #B8860B)', backgroundSize: '200% auto' }}>
              Daily
            </span>
          </motion.h1>
          <motion.div {...fadeUp(0.25)}>
            <p className="font-kapraneuepro text-lg sm:text-2xl font-black leading-[0.9] text-muted-taupe mt-2 tracking-wider">
              Crafted for Every You
            </p>
          </motion.div>
        </div>

        {/* Sub copy */}
        <motion.p {...fadeUp(0.3)} className="font-syndicatgrotesk text-xs text-muted-taupe leading-relaxed text-center max-w-xs mx-auto mb-5 sm:mb-6">
          Rings · Necklaces · Bangles &amp; much more.
        </motion.p>

        {/* 2-col image strip */}
        <motion.div {...fadeUp(0.35)} className="grid grid-cols-2 gap-2 sm:gap-3 mb-5 sm:mb-6">
          {[
            { src: '/images/ring.jpg', label: 'Rings', badge: '20% OFF' },
            { src: '/images/necklace.jpg', label: 'Necklaces', badge: 'NEW' },
          ].map((item) => (
            <div key={item.label} className="relative overflow-hidden bg-card-dark" style={{ aspectRatio: '3/4' }}>
              <img src={item.src} alt={item.label} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-site-black/70 to-transparent" />
              <div className="absolute top-2 left-2 bg-rich-gold px-2 py-0.5">
                <span className="font-brandon text-[10px] font-black text-site-black">{item.badge}</span>
              </div>
              <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
                <p className="font-brandon text-sm font-black uppercase text-ivory">{item.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Discount badges — same as desktop */}
        <motion.div {...fadeUp(0.4)} className="flex items-center justify-center gap-2 flex-wrap mb-5 sm:mb-6">
          {[{ pct: '20%', cat: 'Rings' }, { pct: '15%', cat: 'Necklaces' }, { pct: '10%', cat: 'Earrings' }].map((b) => (
            <div key={b.cat} className="flex flex-col items-center px-4 py-2.5 border border-rich-gold/60 bg-rich-gold/[0.12]">
              <span className="font-brandon text-xl font-black text-rich-gold leading-none">{b.pct}</span>
              <span className="font-syndicatgrotesk text-[7px] tracking-[0.25em] uppercase text-muted-taupe mt-0.5">OFF {b.cat}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA — same as desktop */}
        <motion.div {...fadeUp(0.5)} className="flex justify-center">
          <motion.a href="/category/rings" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center px-8 py-4 bg-rich-gold text-site-black font-syndicatgrotesk text-[10px] font-bold uppercase tracking-[0.22em] hover:bg-amber-400 transition-colors duration-200">
            Shop Collections
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
