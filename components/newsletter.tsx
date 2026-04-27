'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      setEmail('')
      setTimeout(() => setIsSubmitted(false), 3000)
    }
  }

  return (
    <section className="w-full bg-card-dark border-t border-border-gold py-16 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Decorative element */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-12 h-px bg-border-gold" />
          <span className="font-syndicatgrotesk text-[9px] tracking-[0.35em] uppercase text-rich-gold/70">
            Inner Circle
          </span>
          <div className="w-12 h-px bg-border-gold" />
        </div>

        <h2 className="font-brandon text-3xl sm:text-4xl font-black uppercase tracking-tight text-ivory leading-none mb-3">
          Join the<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rich-gold to-light-gold">
            Inner Circle
          </span>
        </h2>

        <p className="font-syndicatgrotesk text-sm text-muted-taupe mb-8 leading-relaxed">
          Get early access to new collections, gold rate alerts, and exclusive member-only offers.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-xl mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-5 py-4 bg-site-black border border-border-gold text-ivory placeholder-muted-taupe/40 font-syndicatgrotesk text-sm focus:outline-none focus:border-rich-gold/60 transition-colors sm:border-r-0"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-7 py-4 bg-rich-gold text-site-black font-syndicatgrotesk text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-light-gold transition-colors duration-200 whitespace-nowrap"
          >
            {isSubmitted ? 'Subscribed ✓' : <>Subscribe <ArrowRight size={14} /></>}
          </button>
        </form>

        {isSubmitted && (
          <p className="mt-4 font-syndicatgrotesk text-xs text-rich-gold tracking-wider">
            Thank you! Check your inbox for exclusive offers.
          </p>
        )}
      </div>
    </section>
  )
}
