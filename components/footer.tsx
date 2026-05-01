'use client'

import Link from 'next/link'

const POLICY_LINKS = [
  { label: 'Shipping Policy',    href: '/policies/shipping' },
  { label: 'Return & Refund',    href: '/policies/returns' },
  { label: 'Track Order',        href: '/orders' },
  { label: 'Privacy Policy',     href: '/policies/privacy' },
  { label: 'Terms of Service',   href: '/policies/terms' },
]

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
                  href: 'https://www.instagram.com/vinayak_creation_sdk?igsh=Yjd2dzkxZndidjZ6',
                  label: 'Instagram',
                  svg: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                    </svg>
                  ),
                },
                {
                  href: 'https://www.facebook.com/share/1MkukVn4SM/',
                  label: 'Facebook',
                  svg: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  ),
                },
                {
                  href: 'https://youtube.com/@vinayakacreationsdk?si=2ZZD3SQUnJ_8J35t',
                  label: 'YouTube',
                  svg: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
                    </svg>
                  ),
                },
              ].map(({ href, label, svg }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center border border-border-gold text-muted-taupe hover:border-rich-gold hover:text-rich-gold hover:bg-rich-gold/10 transition-all duration-200"
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
              {POLICY_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="font-syndicatgrotesk text-xs text-muted-taupe hover:text-rich-gold transition-colors duration-200"
                  >
                    {label}
                  </Link>
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

        {/* Trust strip — Comet-style icon row */}
        <div className="border-t border-border-gold mt-12 pt-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                    <path d="M5 12h14M5 12l4-4M5 12l4 4M19 12l-4-4M19 12l-4 4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 6h18M3 18h18" strokeLinecap="round" />
                  </svg>
                ),
                label: 'Free Shipping',
                sub: 'On all orders',
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path d="M2 10h20" strokeLinecap="round" />
                  </svg>
                ),
                label: 'Cash on Delivery',
                sub: 'Pay when you receive',
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                label: '7-Day Returns',
                sub: 'Hassle-free process',
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                label: 'BIS Certified',
                sub: 'Genuine one-gram gold',
              },
            ].map(({ icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="shrink-0 text-rich-gold">{icon}</div>
                <div>
                  <p className="font-brandon text-xs font-black uppercase tracking-wide text-ivory">{label}</p>
                  <p className="font-syndicatgrotesk text-[10px] text-muted-taupe mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border-gold/40 pt-6">
            <p className="font-syndicatgrotesk text-[10px] tracking-wider text-muted-taupe/70 text-center sm:text-left">
              © 2025 Sri Devi Kangan · All Rights Reserved · Made with love in India
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4">
              {['UPI', 'VISA', 'Mastercard', 'RuPay'].map((method) => (
                <span key={method} className="font-syndicatgrotesk text-[9px] tracking-[0.18em] uppercase text-muted-taupe/60">
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
