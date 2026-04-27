'use client'

export function GoldRateTicker() {
  return (
    <div className="w-full bg-card-dark border-b border-border-gold py-2.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <span className="font-syndicatgrotesk text-[9px] tracking-[0.25em] uppercase text-muted-taupe">
            Today's Gold Rate
          </span>

          <div className="flex items-center gap-2.5">
            <span className="font-brandon text-sm font-black text-ivory hidden sm:inline">
              1g 22K —{' '}
              <span className="text-rich-gold">₹6,842</span>
            </span>
            <span className="font-brandon text-sm font-black text-rich-gold sm:hidden">₹6,842</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-subtle" />
          </div>

          <span className="font-syndicatgrotesk text-[9px] tracking-[0.25em] uppercase text-muted-taupe">
            Updates Daily
          </span>
        </div>
      </div>
    </div>
  )
}
