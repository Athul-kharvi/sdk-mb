'use client'

import { useState, useEffect } from 'react'
import { Heart, ShoppingBag, Search, Menu, X, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { categoryService } from '@/services/category.service'
import { supabase } from '@/lib/supabase'
import { useCartStore } from '@/store/cart'
import { CartDrawer } from '@/components/cart-drawer'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [session, setSession] = useState<any>(null)
  const [navLinks, setNavLinks] = useState<string[]>([])
  const router = useRouter()
  const { items, setIsOpen, fetchCart } = useCartStore()

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
    }
    getSession()
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) fetchCart(session.access_token)
  }, [session])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const cats = await categoryService.getAll()
        setNavLinks(cats.map((c) => c.name))
      } catch {}
    }
    load()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/signin')
  }

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-site-black/95 backdrop-blur-sm shadow-[0_2px_40px_rgba(0,0,0,0.7)]'
            : 'bg-site-black'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 -ml-2 text-muted-taupe hover:text-rich-gold transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex-shrink-0"
            >
              <span className="block font-brandon text-base sm:text-lg font-black tracking-[0.22em] text-ivory uppercase leading-none">
                Sri Devi Kangan
              </span>
              <span className="block text-center font-syndicatgrotesk text-[8px] tracking-[0.35em] text-rich-gold uppercase leading-none mt-1">
                One Gram Gold
              </span>
            </Link>

            {/* Desktop category nav — reads from Supabase */}
            <div className="hidden md:flex flex-1 justify-center items-center gap-2 lg:gap-4 mx-6">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href={`/category/${link.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group relative px-2 py-1 font-syndicatgrotesk text-[10px] lg:text-xs tracking-[0.14em] uppercase text-muted-taupe hover:text-rich-gold transition-colors duration-200 whitespace-nowrap"
                >
                  {link}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-rich-gold group-hover:w-full transition-all duration-300" />
                </a>
              ))}
              <a
                href="/category/new-arrivals"
                className="px-2 py-1 font-syndicatgrotesk text-[10px] lg:text-xs tracking-[0.14em] uppercase text-rich-gold font-semibold whitespace-nowrap"
              >
                New In
              </a>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button className="p-2 text-muted-taupe hover:text-rich-gold transition-colors" aria-label="Search">
                <Search size={17} />
              </button>

              <button className="hidden sm:flex p-2 text-muted-taupe hover:text-rich-gold transition-colors" aria-label="Wishlist">
                <Heart size={17} />
              </button>

              <button
                onClick={() => setIsOpen(true)}
                className="relative p-2 text-muted-taupe hover:text-rich-gold transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag size={17} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-rich-gold text-site-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {cartCount}
                  </span>
                )}
              </button>

              {session ? (
                <div className="hidden sm:flex items-center gap-1">
                  <a href="/orders" className="p-2 text-muted-taupe hover:text-rich-gold transition-colors" aria-label="Orders">
                    <User size={17} />
                  </a>
                  <button
                    onClick={handleLogout}
                    className="px-2 py-1 font-syndicatgrotesk text-[9px] tracking-widest uppercase text-muted-taupe/60 hover:text-red-400 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <a
                  href="/signin"
                  className="hidden sm:inline px-3 py-1.5 font-syndicatgrotesk text-[9px] tracking-[0.15em] uppercase text-muted-taupe hover:text-rich-gold border border-muted-taupe/30 hover:border-rich-gold/60 transition-all duration-200"
                >
                  Sign In
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Gold rule */}
        <div className="h-px bg-gradient-to-r from-transparent via-border-gold to-transparent" />

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-card-dark">
            <div className="px-4 py-4 space-y-0.5">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href={`/category/${link.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 font-syndicatgrotesk text-xs tracking-[0.15em] uppercase text-muted-taupe hover:text-rich-gold transition-colors"
                >
                  {link}
                </a>
              ))}
              <a
                href="/category/new-arrivals"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2.5 font-syndicatgrotesk text-xs tracking-[0.15em] uppercase text-rich-gold font-semibold"
              >
                New In
              </a>
              <div className="pt-3 border-t border-border-gold mt-2">
                {session ? (
                  <>
                    <a href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-xs uppercase tracking-widest text-muted-taupe/70 hover:text-ivory font-syndicatgrotesk">
                      My Orders
                    </a>
                    <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-xs uppercase tracking-widest text-red-400 font-syndicatgrotesk">
                      Logout
                    </button>
                  </>
                ) : (
                  <a href="/signin" className="block px-3 py-2 text-xs uppercase tracking-widest text-muted-taupe/70 hover:text-ivory font-syndicatgrotesk">
                    Sign In
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
      <CartDrawer />
    </>
  )
}
