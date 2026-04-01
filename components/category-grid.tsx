'use client'

import Image from 'next/image'

export function CategoryGrid() {
  const categories = [
    { name: 'Rings', id: 'rings', image: '/images/ring.jpg' },
    { name: 'Earrings', id: 'earrings', image: '/images/pendent.png' },
    { name: 'Necklaces', id: 'necklaces', image: '/images/necklace.jpg' },
    { name: 'Bangles', id: 'bangles', image: '/images/bangle.jpg' },
  ]

  return (
    <section className="w-full py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-syndicatgrotesk font-medium uppercase text-3xl sm:text-4xl text-center mb-12 sm:mb-16">
          Shop by Style
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="group relative overflow-hidden rounded-lg"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <h3 className="font-serif italic text-xl sm:text-2xl md:text-3xl text-white relative">
                  {category.name}
                  <span className="block w-0 h-[2px] bg-yellow-500 group-hover:w-full transition-all duration-500 mt-1" />
                </h3>
              </div>

              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-yellow-600 transition-opacity duration-300" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}