'use client'

export function Footer() {
  return (
    <footer className="bg-site-black border-t border-border-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">

          {/* Brand */}
          <div className="space-y-5 lg:col-span-1">
            <div>
              <p className="font-brandon text-base font-black tracking-[0.22em] text-ivory uppercase leading-none">
                Sri Devi Kangan
              </p>
              <p className="font-syndicatgrotesk text-[9px] tracking-[0.35em] uppercase text-rich-gold mt-1">
                One Gram Gold
              </p>
            </div>
            <p className="font-syndicatgrotesk text-xs text-muted-taupe leading-relaxed max-w-xs">
              Handcrafted one-gram gold jewelry for the modern Indian woman.
              Wear Gold Every Day.
            </p>
            <div className="flex gap-3 pt-1">
              {[
                {
                  href: '#',
                  label: 'Instagram',
                  svg: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                    </svg>
                  ),
                },
                {
                  href: '#',
                  label: 'Facebook',
                  svg: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  ),
                },
                {
                  href: '#',
                  label: 'YouTube',
                  svg: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
                    </svg>
                  ),
                },
              ].map(({ href, label, svg }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center border border-border-gold text-muted-taupe hover:border-rich-gold hover:text-rich-gold transition-all duration-200"
                >
                  {svg}
                </a>
              ))}
            </div>
          </div>

          {/* Discover */}
          <div className="space-y-4">
            <h4 className="font-brandon text-xs font-black uppercase tracking-[0.22em] text-ivory">
              Discover
            </h4>
            <div className="w-8 h-px bg-rich-gold/50" />
            <ul className="space-y-2.5">
              {['New Arrivals', 'Rings', 'Earrings', 'Necklaces', 'Bangles', 'Pendants'].map((item) => (
                <li key={item}>
                  <a
                    href={`/category/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="font-syndicatgrotesk text-xs text-muted-taupe hover:text-rich-gold transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h4 className="font-brandon text-xs font-black uppercase tracking-[0.22em] text-ivory">
              Policies
            </h4>
            <div className="w-8 h-px bg-rich-gold/50" />
            <ul className="space-y-2.5">
              {['Shipping Policy', 'Return & Refund', 'Track Order', 'Privacy Policy', 'Terms of Service'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="font-syndicatgrotesk text-xs text-muted-taupe hover:text-rich-gold transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-brandon text-xs font-black uppercase tracking-[0.22em] text-ivory">
              Contact Us
            </h4>
            <div className="w-8 h-px bg-rich-gold/50" />
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://wa.me/919999999999"
                  className="font-syndicatgrotesk text-xs text-muted-taupe hover:text-rich-gold transition-colors duration-200"
                >
                  WhatsApp: +91 9999-999-999
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@sridevik.in"
                  className="font-syndicatgrotesk text-xs text-muted-taupe hover:text-rich-gold transition-colors duration-200"
                >
                  hello@sridevik.in
                </a>
              </li>
              <li className="font-syndicatgrotesk text-xs text-muted-taupe leading-relaxed">
                Mumbai, Maharashtra, India
              </li>
            </ul>

            <div className="pt-2">
              <p className="font-syndicatgrotesk text-[9px] tracking-[0.25em] uppercase text-muted-taupe/70 mb-2">
                Sign up and save
              </p>
              <a
                href="/signup"
                className="inline-flex items-center gap-1.5 font-syndicatgrotesk text-[9px] tracking-[0.2em] uppercase px-4 py-2 border border-rich-gold/50 text-ivory hover:border-rich-gold hover:text-rich-gold transition-all duration-200"
              >
                Create Account →
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border-gold mt-12 pt-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-syndicatgrotesk text-[10px] tracking-wider text-muted-taupe/70 text-center sm:text-left">
            © 2025 Sri Devi Kangan · All Rights Reserved · Made with love in India
          </p>
          <div className="flex items-center gap-5">
            {['UPI', 'VISA', 'Mastercard', 'RuPay'].map((method) => (
              <span
                key={method}
                className="font-syndicatgrotesk text-[9px] tracking-[0.18em] uppercase text-muted-taupe/60"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
