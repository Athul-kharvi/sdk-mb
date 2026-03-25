'use client'

export function GoldRateTicker() {
  return (
    <div className="w-full bg-warm-black py-3 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between text-sm font-sans">
          <span className="text-xs uppercase tracking-wider opacity-70">Today's Gold Rate</span>
          
          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline text-base font-semibold">1 gram 22K — ₹6,842</span>
            <span className="sm:hidden text-base font-semibold">₹6,842</span>
            <div className="relative inline-block">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-subtle" />
            </div>
          </div>

          <span className="text-xs uppercase tracking-wider opacity-70">Prices update daily</span>
        </div>
      </div>
    </div>
  )
}
