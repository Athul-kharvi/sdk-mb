'use client'

import { useState } from 'react'

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
    <section className="w-full py-16 sm:py-20 bg-soft-cream">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif italic text-3xl sm:text-4xl text-warm-black mb-3">
          Join the Inner Circle
        </h2>

        <p className="font-sans text-base text-gray-600 mb-8">
          Get early access to new collections, gold rate alerts, and exclusive offers.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 sm:px-5 py-4 font-sans text-sm border border-muted-taupe bg-white text-warm-black placeholder-gray-400 focus:outline-none focus:border-deep-gold focus:ring-1 focus:ring-deep-gold rounded transition-colors"
          />
          <button
            type="submit"
            className="px-8 py-4 bg-deep-gold text-white font-sans font-semibold uppercase tracking-wider text-sm rounded hover:bg-opacity-90 transition-all duration-300 whitespace-nowrap"
          >
            {isSubmitted ? 'Subscribed!' : 'Subscribe'}
          </button>
        </form>

        {isSubmitted && (
          <p className="mt-4 font-sans text-sm text-deep-gold">
            Thank you! Check your email for exclusive offers.
          </p>
        )}
      </div>
    </section>
  )
}
