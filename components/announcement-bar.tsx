'use client'

export function AnnouncementBar() {
  const message = "✨ 10% OFF on Your First Order"

  return (
    <div className="relative w-full z-[9999] bg-[#c4a484] py-3 overflow-hidden">
      <div className="flex animate-marquee-ltr whitespace-nowrap">
        {/* First set */}
        <div className="flex gap-x-16">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={`first-${i}`} className="text-deep-gold font-syndicatgrotesk text-sm font-medium">
              {message}
            </span>
          ))}
        </div>

        {/* Second set for seamless looping */}
        <div className="flex gap-x-16">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={`second-${i}`} className="text-deep-gold font-syndicatgrotesk text-sm font-medium">
              {message}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}