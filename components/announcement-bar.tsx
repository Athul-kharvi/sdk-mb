'use client'

export function AnnouncementBar() {
  return (
    <div className="w-full bg-deep-gold py-3">
      <div className="overflow-hidden">
        <div className="animate-marquee whitespace-nowrap text-white text-sm font-sans">
          <span className="inline-block pr-8">
            Free shipping on orders above ₹999 · Easy 7-day returns · BIS Hallmarked Jewelry
          </span>
          <span className="inline-block pr-8">
            Free shipping on orders above ₹999 · Easy 7-day returns · BIS Hallmarked Jewelry
          </span>
        </div>
      </div>
    </div>
  )
}
