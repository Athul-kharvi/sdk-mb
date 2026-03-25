'use client'

import { Instagram } from 'lucide-react'

export function InstagramStrip() {
  const posts = Array.from({ length: 6 }, (_, i) => i + 1)

  return (
    <section className="w-full py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif italic text-3xl sm:text-4xl text-center text-warm-black mb-12 sm:mb-16">
          Follow Our World
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
          {posts.map((post) => (
            <a
              key={post}
              href={`https://instagram.com/sridevi_kangan`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-lg bg-muted-taupe cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-muted-taupe to-soft-cream flex items-center justify-center">
                <span className="text-muted-taupe opacity-40 font-serif italic">Post {post}</span>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-warm-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center">
                <Instagram className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <a
            href="https://instagram.com/sridevi_kangan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-sans text-xs uppercase tracking-widest text-deep-gold hover:text-warm-black font-semibold transition-colors"
          >
            @sridevi_kangan
          </a>
        </div>
      </div>
    </section>
  )
}
