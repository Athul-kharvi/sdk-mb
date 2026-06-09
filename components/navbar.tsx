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
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [session, setSession] = useState<any>(null)
  const [navLinks, setNavLinks] = useState<{ name: string; slug: string; image?: string | null }[]>([])
  const router = useRouter()
  const { items, setIsOpen, fetchCart } = useCartStore()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (!q) return
    setIsSearchOpen(false)
    setSearchQuery('')
    router.push(`/?search=${encodeURIComponent(q)}`)
  }

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
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIsSearchOpen(false); setSearchQuery('') }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const cats = await categoryService.getAll()
        setNavLinks(cats.map((c) => ({ name: c.name, slug: c.slug || c.name.toLowerCase().replace(/\s+/g, '-'), image: c.image })))
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
              className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex-shrink-0 text-center md:text-left"
            >
              <span className="block font-brandon text-base sm:text-lg font-black tracking-[0.22em] text-ivory uppercase leading-none">
                Vinayak Creation
              </span>
              <span className="block text-center font-syndicatgrotesk text-[8px] tracking-[0.35em] text-rich-gold uppercase leading-none mt-1">
                {/* Handcrafted Jewelry */}
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex flex-1 justify-center items-center gap-1 lg:gap-3 mx-4">

              {/* First 3 categories as direct links */}
              {navLinks.slice(0, 3).map(({ name, slug }) => (
                <a
                  key={slug}
                  href={`/category/${slug}`}
                  className="group relative px-2 py-1 font-syndicatgrotesk text-[10px] lg:text-xs tracking-[0.14em] uppercase text-muted-taupe hover:text-rich-gold transition-colors duration-200 whitespace-nowrap"
                >
                  {name}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-rich-gold group-hover:w-full transition-all duration-300" />
                </a>
              ))}

              {/* More → dropdown (remaining categories) */}
              {navLinks.length > 3 && (
                <div className="relative group">
                  <button className="flex items-center gap-1 px-2 py-1 font-syndicatgrotesk text-[10px] lg:text-xs tracking-[0.14em] uppercase text-muted-taupe hover:text-rich-gold transition-colors duration-200 whitespace-nowrap">
                    More
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="transition-transform duration-200 group-hover:rotate-180">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {/* Dropdown panel */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-50 min-w-[420px]">
                    {/* Arrow tip */}
                    <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#111] border-l border-t border-[#B8860B]/30 rotate-45" />

                    <div className="bg-[#111] border border-[#B8860B]/30 shadow-2xl p-5">
                      <p className="font-syndicatgrotesk text-[8px] tracking-[0.4em] uppercase text-[#D4A017] mb-4">
                        More Collections
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {navLinks.slice(3).map(({ name, slug, image }) => (
                          <a
                            key={slug}
                            href={`/category/${slug}`}
                            className="group/item flex items-center gap-2.5 p-2 hover:bg-white/[0.07] transition-colors rounded-sm"
                          >
                            <div className="w-9 h-9 shrink-0 overflow-hidden bg-[#222] border border-[#B8860B]/20">
                              {image ? (
                                <img src={image} alt={name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300" />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[#222] to-[#333]" />
                              )}
                            </div>
                            <span className="font-syndicatgrotesk text-[10px] tracking-[0.1em] uppercase text-white/80 group-hover/item:text-[#D4A017] transition-colors duration-200 leading-tight">
                              {name}
                            </span>
                          </a>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#B8860B]/15 flex justify-end">
                        <a href="/" className="font-syndicatgrotesk text-[9px] tracking-[0.25em] uppercase text-white/40 hover:text-[#D4A017] transition-colors flex items-center gap-1.5">
                          View All <span>→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <a
                href="/"
                className="px-2 py-1 font-syndicatgrotesk text-[10px] lg:text-xs tracking-[0.14em] uppercase text-rich-gold font-semibold whitespace-nowrap"
              >
                New In
              </a>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-muted-taupe hover:text-rich-gold transition-colors"
                aria-label="Search"
              >
                <Search size={17} />
              </button>

              <button
                onClick={() => session ? router.push('/orders') : router.push('/signin')}
                className="hidden sm:flex p-2 text-muted-taupe hover:text-rich-gold transition-colors"
                aria-label="Wishlist / Saved"
              >
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
              {navLinks.map(({ name, slug }) => (
                <a
                  key={slug}
                  href={`/category/${slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 font-syndicatgrotesk text-xs tracking-[0.15em] uppercase text-muted-taupe hover:text-rich-gold transition-colors"
                >
                  {name}
                </a>
              ))}
              <a
                href="/"
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

      {/* Search overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-24 px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => { setIsSearchOpen(false); setSearchQuery('') }}
          />
          {/* Search box */}
          <div className="relative w-full max-w-lg">
            <form onSubmit={handleSearch} className="flex items-center bg-[#111] border border-white/15 focus-within:border-rich-gold/60 transition-colors">
              <Search size={16} className="ml-4 text-muted-taupe shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search jewellery…"
                className="flex-1 px-3 py-4 bg-transparent font-syndicatgrotesk text-sm text-ivory placeholder-white/30 outline-none"
              />
              <button
                type="button"
                onClick={() => { setIsSearchOpen(false); setSearchQuery('') }}
                className="p-4 text-muted-taupe hover:text-ivory transition-colors"
                aria-label="Close search"
              >
                <X size={16} />
              </button>
            </form>
            <p className="mt-2 font-syndicatgrotesk text-[10px] text-white/30 text-center">
              Press Enter to search · Esc to close
            </p>
          </div>
        </div>
      )}
    </>
  )
}
