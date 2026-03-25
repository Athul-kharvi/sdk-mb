'use client'

import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-warm-black text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif italic text-xl text-white">Sri Devi Kangan</h3>
            <p className="font-sans text-sm text-gray-400">
              Wear Gold Every Day. One Gram. Pure Elegance.
            </p>
            <div className="flex gap-4 pt-4">
              <a href="#" className="text-gray-400 hover:text-deep-gold transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-deep-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-deep-gold transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-deep-gold transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-3">
            <h4 className="font-sans font-bold text-white text-sm uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2">
              {['Rings', 'Earrings', 'Necklaces', 'Bangles', 'New Arrivals'].map((item) => (
                <li key={item}>
                  <a href="#" className="font-sans text-sm text-gray-400 hover:text-deep-gold transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-3">
            <h4 className="font-sans font-bold text-white text-sm uppercase tracking-wider">Help</h4>
            <ul className="space-y-2">
              {['Shipping', 'Returns', 'Track Order', 'Contact Us', 'FAQs'].map((item) => (
                <li key={item}>
                  <a href="#" className="font-sans text-sm text-gray-400 hover:text-deep-gold transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="font-sans font-bold text-white text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2 font-sans text-sm">
              <li>
                <a href="https://wa.me/919999999999" className="text-gray-400 hover:text-deep-gold transition-colors">
                  WhatsApp: +91 9999-999-999
                </a>
              </li>
              <li>
                <a href="mailto:hello@sridevi.in" className="text-gray-400 hover:text-deep-gold transition-colors">
                  hello@sridevi.in
                </a>
              </li>
              <li className="text-gray-400">
                Mumbai, India
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="font-sans text-sm text-gray-400 text-center sm:text-left">
            © 2025 Sri Devi Kangan · Made with love in India
          </p>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <span className="font-sans text-xs text-gray-500">UPI</span>
            <span className="font-sans text-xs text-gray-500">VISA</span>
            <span className="font-sans text-xs text-gray-500">Mastercard</span>
            <span className="font-sans text-xs text-gray-500">RuPay</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
