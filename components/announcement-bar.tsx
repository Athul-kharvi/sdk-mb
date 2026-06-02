'use client'

const messages = [
  '✦ FREE SHIPPING on Orders Above ₹599',
  '✦ 20% OFF on Your First Order · Use: FIRST20',
  '✦ Easy 7-Day Returns — No Questions Asked',
  '✦ New Collection Arrived — Shop Now',
  '✦ Secure Payments · UPI · Cards · Wallets',
  '✦ Handcrafted Designs · 500+ Styles',
]

export function AnnouncementBar() {
  const repeated = [...messages, ...messages]

  return (
    <div className="relative w-full z-[9999] overflow-hidden py-2" style={{ background: 'linear-gradient(90deg, #0D0D0D 0%, #1a1200 40%, #0D0D0D 100%)', borderBottom: '1px solid #3A3020' }}>
      {/* Gold shimmer line at top */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #D4A017, #F0C040, #D4A017, transparent)' }} />

      <div className="flex animate-marquee-ltr whitespace-nowrap">
        {repeated.map((msg, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 font-syndicatgrotesk text-[10px] tracking-[0.2em] uppercase px-8"
            style={{ color: i % 3 === 0 ? '#D4A017' : '#C4B49A' }}
          >
            {msg}
          </span>
        ))}
      </div>
    </div>
  )
}
