'use client'

export function CategoryGrid() {
  const categories = [
    { name: 'Rings', id: 'rings' },
    { name: 'Earrings', id: 'earrings' },
    { name: 'Necklaces', id: 'necklaces' },
    { name: 'Bangles', id: 'bangles' },
  ]

  return (
    <section className="w-full py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif italic text-4xl sm:text-5xl text-center text-warm-black mb-12 sm:mb-16">
          Shop by Style
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="group relative overflow-hidden rounded-lg"
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-muted-taupe to-soft-cream relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-muted-taupe opacity-40">
                  <span className="font-serif italic text-xl">Image</span>
                </div>
                <div className="absolute inset-0 bg-warm-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <h3 className="font-serif italic text-2xl sm:text-3xl text-white relative">
                  {category.name}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-deep-gold group-hover:w-full transition-all duration-500" />
                </h3>
              </div>

              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-deep-gold transition-opacity duration-300" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
