'use client'

import { useEffect, useState } from 'react'

export function Hero() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="relative w-full h-screen bg-warm-beige overflow-hidden">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full items-center gap-8 lg:gap-12">
          {/* Left Content */}
          <div
            className={`space-y-6 transition-all duration-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="space-y-4">
              <h1 className="font-serif italic text-5xl sm:text-6xl lg:text-7xl text-warm-black leading-tight">
                Gold That Moves With You
              </h1>
              <div className="w-12 h-0.5 bg-deep-gold" />
              <h2 className="font-serif italic text-3xl sm:text-4xl text-deep-gold">
                Sri Devi Kangan
              </h2>
            </div>

            <p className="font-sans text-base sm:text-lg text-gray-600 max-w-md leading-relaxed">
              Handcrafted one-gram gold jewelry for the modern Indian woman.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="px-8 py-4 bg-deep-gold text-white font-sans font-semibold uppercase tracking-wider rounded hover:bg-opacity-90 transition-all duration-300">
                Shop Now
              </button>
              <button className="px-8 py-4 border-2 border-deep-gold text-deep-gold font-sans font-semibold uppercase tracking-wider rounded hover:bg-deep-gold hover:text-white transition-all duration-300">
                View Collections
              </button>
            </div>
          </div>

          {/* Right Image Placeholder */}
          <div
            className={`relative h-full min-h-96 lg:min-h-full transition-all duration-1000 delay-200 ${
              isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-muted-taupe to-warm-beige rounded-lg shadow-lg border-8 border-white" />
            <div className="absolute inset-2 bg-soft-cream rounded-lg flex items-center justify-center text-muted-taupe opacity-60">
              <span className="font-serif text-2xl italic">Product Image</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
