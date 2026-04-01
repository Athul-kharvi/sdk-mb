'use client'

import { Star } from 'lucide-react'

export function Testimonials() {
  const testimonials = [
    {
      name: 'Priya',
      city: 'Mumbai',
      text: 'Finally, jewelry I can wear every day without worrying. The craftsmanship is impeccable and the weight is so comfortable.',
      rating: 5,
    },
    {
      name: 'Anjali',
      city: 'Delhi',
      text: 'I\'ve been a customer for two years now. Sri Devi Kangan pieces are my go-to for both daily wear and special occasions.',
      rating: 5,
    },
    {
      name: 'Neha',
      city: 'Bangalore',
      text: 'The entire experience from browsing to delivery was seamless. Highly recommended for anyone looking for quality gold jewelry.',
      rating: 5,
    },
  ]

  return (
    <section className="w-full py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif italic text-4xl sm:text-5xl text-center text-warm-black mb-12 sm:mb-16">
          Loved by Her
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 sm:p-8 border border-border-light rounded-lg hover:shadow-lg transition-shadow duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-deep-gold text-deep-gold" />
                ))}
              </div>

              {/* Review */}
              <p className="font-syndicatgrotesk text-base text-gray-700 italic mb-4 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Name and City */}
              <div className="border-t border-border-light pt-4">
                <p className="font-syndicatgrotesk font-bold text-warm-black">{testimonial.name}</p>
                <p className="font-syndicatgrotesk text-sm text-gray-600">{testimonial.city}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
