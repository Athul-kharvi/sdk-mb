'use client'

import { motion } from 'framer-motion'

export function UrgencyBanner() {
  return (
    <section className="w-full bg-[#0a0a0a] border-t border-[#1a1a1a]">
      <div className="grid grid-cols-1 lg:grid-cols-2">

        {/* Left — image */}
        <div className="relative overflow-hidden" style={{ minHeight: 360 }}>
          <img
            src="/images/bangle_new.png"
            alt="Limited collection"
            className="absolute inset-0 w-full h-full object-cover hover:scale-[1.04] transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-[#0a0a0a]/30" />
        </div>

        {/* Right — text */}
        <div className="flex flex-col justify-center px-10 sm:px-14 lg:px-16 py-16 lg:py-20 bg-[#0f0f0f]">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-syndicatgrotesk text-[8px] tracking-[0.5em] uppercase text-[#B8860B]/70 mb-4"
          >
            Limited availability
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="font-brandon text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white leading-none mb-2"
          >
            Grab It
          </motion.h2>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.14 }}
            className="font-brandon text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-8"
            style={{ WebkitTextStroke: '1.5px #B8860B', color: 'transparent' }}
          >
            Before It's Gone
          </motion.h2>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '3rem' }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-px bg-[#B8860B]/50 mb-8"
          />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.26 }}
            className="font-syndicatgrotesk text-[11px] text-[#7A6F62] tracking-[0.15em] mb-10 max-w-xs leading-relaxed"
          >
            Only a few left in select styles.
          </motion.p>

          <motion.a
            href="/category/bangles"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.32 }}
            whileHover={{ x: 4 }}
            className="inline-flex items-center gap-4 group w-fit"
          >
            <span className="font-syndicatgrotesk text-[10px] font-bold tracking-[0.35em] uppercase text-[#B8860B] group-hover:text-[#D4A017] transition-colors duration-200">
              Shop Now
            </span>
            <span className="text-[#B8860B] group-hover:text-[#D4A017] transition-colors duration-200">→</span>
            <span className="h-px w-0 group-hover:w-8 bg-[#B8860B] transition-all duration-300 block" />
          </motion.a>
        </div>
      </div>
    </section>
  )
}
