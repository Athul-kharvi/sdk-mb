'use client'

import { ShieldCheck, Truck, RotateCcw, Lock } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const signals = [
  {
    Icon: Truck,
    label: 'Free Shipping',
    description: 'On all orders above ₹599',
  },
  {
    Icon: RotateCcw,
    label: 'Easy Returns',
    description: '7-day no-questions policy',
  },
  {
    Icon: Lock,
    label: 'Secure Payments',
    description: 'UPI · Cards · Wallets',
  },
]

export function TrustSignals() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="w-full bg-card-dark border-y border-border-gold py-12 sm:py-14" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       <div className="grid grid-cols-2 gap-6 sm:flex sm:justify-center sm:gap-20">
          {signals.map(({ Icon, label, description }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1, ease: 'easeOut' }}
              whileHover={{ y: -4 }}
              className="flex flex-col items-center text-center gap-3 group cursor-default"
            >
              <motion.div
                whileHover={{ boxShadow: '0 0 20px rgba(212,160,23,0.35)' }}
                className="w-12 h-12 flex items-center justify-center border border-border-gold group-hover:border-rich-gold/70 transition-all duration-300"
              >
                <Icon size={20} className="text-rich-gold" strokeWidth={1.5} />
              </motion.div>
              <div>
                <p className="font-brandon text-sm font-black uppercase tracking-wide text-ivory">
                  {label}
                </p>
                <p className="font-syndicatgrotesk text-[11px] text-muted-taupe mt-0.5 leading-relaxed">
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
