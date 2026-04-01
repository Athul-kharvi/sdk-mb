'use client'

export function TrustSignals() {
  const signals = [
    {
      icon: '✓',
      label: 'BIS Hallmarked',
      description: 'Certified pure gold',
    },
    {
      icon: '📦',
      label: 'Free Shipping',
      description: 'Orders above ₹999',
    },
    {
      icon: '↺',
      label: 'Easy Returns',
      description: '7-day no questions',
    },
    {
      icon: '🔒',
      label: 'Secure Payments',
      description: 'UPI · Cards · Wallets',
    },
  ]

  return (
    <section className="w-full py-16 sm:py-20 bg-warm-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {signals.map((signal, index) => (
            <div key={index} className="text-center space-y-3">
              <div className="flex justify-center text-4xl text-deep-gold mb-4">
                {signal.icon}
              </div>
              <h3 className="font-syndicatgrotesk font-bold text-base sm:text-lg text-warm-black">
                {signal.label}
              </h3>
              <p className="font-syndicatgrotesk text-sm text-gray-600">
                {signal.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
