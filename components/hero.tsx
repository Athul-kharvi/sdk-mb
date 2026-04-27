'use client'

import { motion } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, delay, ease: 'easeOut' as const },
})

const fadeLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.85, delay, ease: 'easeOut' as const },
})

const fadeRight = (delay = 0) => ({
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.85, delay, ease: 'easeOut' as const },
})

export function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] bg-site-black overflow-hidden flex items-center">
      {/* Radial gold glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,160,23,0.12),transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(184,134,11,0.09),transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,160,23,0.04),transparent_70%)] pointer-events-none" />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(212,160,23,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,0.6) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-10 items-center">

          {/* ── LEFT IMAGE PANEL ── */}
          <motion.div {...fadeLeft(0.1)} className="hidden lg:block relative">
            <div className="relative group overflow-hidden" style={{ aspectRatio: '3/4' }}>
              {/* Gold frame */}
              <div className="absolute -inset-2 border border-border-gold/40 pointer-events-none z-10" />
              <div className="absolute -inset-4 border border-border-gold/20 pointer-events-none z-10" />
              <img
                src="/images/ring.jpg"
                alt="One Gram Gold Rings"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-site-black/70 via-transparent to-transparent" />
              {/* Floating badge */}
              <div className="absolute top-4 left-4 z-20">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="bg-rich-gold text-site-black px-3 py-1.5"
                >
                  <span className="font-brandon text-sm font-black uppercase tracking-wide">20% OFF</span>
                  <p className="font-syndicatgrotesk text-[8px] tracking-[0.2em] uppercase text-site-black/70">Rings</p>
                </motion.div>
              </div>
              <div className="absolute bottom-5 left-5 right-5 z-20">
                <p className="font-syndicatgrotesk text-[9px] tracking-[0.3em] uppercase text-rich-gold">Collection</p>
                <p className="font-brandon text-lg font-black uppercase text-ivory leading-tight mt-0.5">Rings</p>
              </div>
            </div>
          </motion.div>

          {/* ── CENTER TEXT ── */}
          <div className="flex flex-col items-center text-center space-y-6 lg:w-[420px]">
            {/* Eyebrow */}
            <motion.div {...fadeUp(0)} className="flex items-center gap-3">
              <div className="w-10 h-px bg-rich-gold/60" />
              <span className="font-syndicatgrotesk text-[9px] tracking-[0.35em] uppercase text-rich-gold">
                BIS Hallmarked · One Gram Gold
              </span>
              <div className="w-10 h-px bg-rich-gold/60" />
            </motion.div>

            {/* Main headline */}
            <div className="space-y-1">
              <motion.h1 {...fadeUp(0.1)} className="font-brandon text-5xl sm:text-6xl lg:text-7xl font-black uppercase leading-[0.88] tracking-tight text-ivory">
                Wear Gold
              </motion.h1>
              <motion.h1 {...fadeUp(0.2)} className="font-brandon text-5xl sm:text-6xl lg:text-7xl font-black uppercase leading-[0.88] tracking-tight">
                <span
                  className="text-transparent bg-clip-text animate-shimmer-text"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #B8860B, #D4A017, #F0C040, #D4A017, #B8860B)',
                    backgroundSize: '200% auto',
                  }}
                >
                  Every Day
                </span>
              </motion.h1>
              <motion.div {...fadeUp(0.25)}>
                <p className="font-brandon text-xl sm:text-2xl font-black uppercase leading-[0.9] tracking-tight text-muted-taupe mt-1">
                  Royal Wedding Collection
                </p>
              </motion.div>
            </div>

            {/* Sub copy */}
            <motion.p {...fadeUp(0.3)} className="font-syndicatgrotesk text-sm text-muted-taupe leading-relaxed max-w-xs">
              Handcrafted one-gram gold jewelry for the modern Indian woman.
              <br />Rings · Necklaces · Bangles &amp; much more.
            </motion.p>

            {/* Discount badges row */}
            <motion.div {...fadeUp(0.4)} className="flex items-center gap-3 flex-wrap justify-center">
              {[
                { pct: '20%', cat: 'Rings' },
                { pct: '15%', cat: 'Necklaces' },
                { pct: '10%', cat: 'Earrings' },
              ].map((b) => (
                <motion.div
                  key={b.cat}
                  whileHover={{ scale: 1.08, y: -3 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="flex flex-col items-center px-5 py-3 border border-rich-gold/60 bg-rich-gold/[0.12] hover:bg-rich-gold/20 hover:border-rich-gold transition-all duration-200 cursor-default"
                >
                  <span className="font-brandon text-2xl font-black text-rich-gold leading-none">{b.pct}</span>
                  <span className="font-syndicatgrotesk text-[8px] tracking-[0.25em] uppercase text-muted-taupe mt-0.5">OFF {b.cat}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div {...fadeUp(0.5)} className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <motion.a
                href="#collections"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-rich-gold text-site-black font-syndicatgrotesk text-[10px] font-bold uppercase tracking-[0.22em] hover:bg-light-gold transition-colors duration-200 animate-glow-pulse"
              >
                Shop Collections
              </motion.a>
              <motion.a
                href="#story"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-muted-taupe/40 text-ivory font-syndicatgrotesk text-[10px] uppercase tracking-[0.22em] hover:border-rich-gold/70 hover:text-rich-gold transition-all duration-200"
              >
                Our Story
              </motion.a>
            </motion.div>

            {/* Trust micro-bar */}
            <motion.div {...fadeUp(0.6)} className="flex items-center gap-4 pt-2">
              {['Free Shipping ₹999+', 'BIS Certified', '10K+ Customers'].map((t, idx) => (
                <span key={idx} className="font-syndicatgrotesk text-[8px] tracking-[0.15em] uppercase text-muted-taupe/80">
                  {idx > 0 && <span className="mr-4 text-rich-gold/50">·</span>}{t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT IMAGE PANEL ── */}
          <motion.div {...fadeRight(0.1)} className="hidden lg:block relative">
            <div className="relative group overflow-hidden" style={{ aspectRatio: '3/4' }}>
              <div className="absolute -inset-2 border border-border-gold/40 pointer-events-none z-10" />
              <div className="absolute -inset-4 border border-border-gold/20 pointer-events-none z-10" />
              <img
                src="/images/necklace.jpg"
                alt="One Gram Gold Necklaces"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-site-black/70 via-transparent to-transparent" />
              {/* NEW badge */}
              <div className="absolute top-4 right-4 z-20">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                  className="w-14 h-14 rounded-full bg-rich-gold flex flex-col items-center justify-center animate-glow-pulse"
                >
                  <span className="font-brandon text-sm font-black text-site-black leading-none">NEW</span>
                  <span className="font-syndicatgrotesk text-[7px] tracking-wider text-site-black/70 uppercase">Season</span>
                </motion.div>
              </div>
              <div className="absolute bottom-5 left-5 right-5 z-20">
                <p className="font-syndicatgrotesk text-[9px] tracking-[0.3em] uppercase text-rich-gold">New Arrival</p>
                <p className="font-brandon text-lg font-black uppercase text-ivory leading-tight mt-0.5">Necklaces</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile hero image strip */}
      <motion.div {...fadeUp(0.4)} className="lg:hidden w-full px-4 pb-8 -mt-2 grid grid-cols-2 gap-3">
        {[
          { src: '/images/ring.jpg', label: 'Rings', badge: '20% OFF' },
          { src: '/images/necklace.jpg', label: 'Necklaces', badge: 'NEW' },
        ].map((item) => (
          <div key={item.label} className="relative overflow-hidden aspect-[3/4] bg-card-dark">
            <img src={item.src} alt={item.label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-site-black/70 to-transparent" />
            <div className="absolute top-2 left-2 bg-rich-gold px-2 py-1">
              <span className="font-brandon text-xs font-black text-site-black">{item.badge}</span>
            </div>
            <div className="absolute bottom-3 left-3">
              <p className="font-brandon text-sm font-black uppercase text-white">{item.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Bottom scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
      >
        <span className="font-syndicatgrotesk text-[8px] tracking-[0.3em] uppercase text-muted-taupe/50">Scroll</span>
        <motion.div
          animate={{ scaleY: [1, 0.3, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-rich-gold/60 to-transparent origin-top"
        />
      </motion.div>
    </section>
  )
}
