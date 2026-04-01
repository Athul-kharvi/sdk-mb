'use client'
import Image from 'next/image'

export function EditorialStory() {
  return (
    <section className="w-full py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/men-bangle.jpg"
                alt="Sri Devi Kangan Story"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                priority
              />
            </div>
          </div>


          <div className="order-1 lg:order-2 space-y-6">
            <span className="inline-block font-sans text-xs uppercase tracking-widest text-deep-gold font-semibold">
              Our Story
            </span>

            <h2 className="font-serif italic text-4xl sm:text-5xl text-warm-black leading-tight">
              Jewelry That Tells Her Story
            </h2>

            <p className="font-sans text-base sm:text-lg text-gray-600 leading-relaxed">
              Sri Devi Kangan was born from a love of Indian craftsmanship. Each piece is crafted in one-gram gold — beautiful, lightweight, and made to be worn every single day.
            </p>

            <a href="#story" className="inline-block group">
              <span className="font-sans text-sm uppercase tracking-widest text-warm-black font-semibold">
                Discover Our Story
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </span>
              <div className="w-0 h-0.5 bg-deep-gold group-hover:w-full transition-all duration-500" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
