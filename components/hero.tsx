'use client'
import Image from 'next/image'

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
            className={`space-y-5 sm:space-y-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            <div className="mt-6 sm:mt-0 space-y-3 sm:space-y-4">
              <h1 className="font-syndicatgrotesk uppercase font-medium text-lg sm:text-3xl lg:text-4xl leading-snug">
                Gold That Moves With You
              </h1>

              <div className="w-10 sm:w-12 h-0.5 bg-deep-gold" />

              <h2 className="font-serif italic text-xl sm:text-3xl lg:text-4xl text-deep-gold">
                Sri Devi Kangan
              </h2>
            </div>

            <p className="font-syndicatgrotesk text-sm sm:text-base lg:text-lg font-medium text-gray-600 max-w-sm sm:max-w-md leading-relaxed">
              Handcrafted one-gram gold jewelry for the modern Indian woman.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4 w-full">
              <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-deep-gold text-white font-sans text-sm sm:text-base font-semibold uppercase tracking-wider rounded active:scale-95 hover:bg-opacity-90 transition-all duration-300">
                Shop Now
              </button>

              <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-deep-gold text-deep-gold font-sans text-sm sm:text-base font-semibold uppercase tracking-wider rounded active:scale-95 hover:bg-deep-gold hover:text-white transition-all duration-300">
                View Collections
              </button>
            </div>
          </div>

          <div
            className={`relative h-full min-h-96 lg:min-h-full transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
          >
            <div className="absolute inset-2 bg-soft-cream rounded-lg flex items-center justify-center text-muted-taupe opacity-90">
              <img
                src="/images/pendent.png"
                alt="Product"
                className="w-full h-full object-cover rounded-lg shadow-lg border-8 border-white"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
