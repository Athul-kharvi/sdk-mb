'use client'

import { useState, useEffect } from 'react'
import { Heart, ShoppingBag, Search, Menu, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { categoryService } from "@/services/category.service";
import { supabase } from '@/lib/supabase'
import { useCartStore } from '@/store/cart'
import { CartDrawer } from '@/components/cart-drawer'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [session, setSession] = useState<any>(null)

  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
    }

    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  const { items, setIsOpen, fetchCart } = useCartStore()

  useEffect(() => {
    if (session) {
      fetchCart(session.access_token)
    }
  }, [session])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/signin')
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const [navLinks, setNavLinks] = useState<string[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await categoryService.getAll();

        setNavLinks(categories.map((c) => c.name));
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };

    loadCategories();
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 w-full bg-white border-b border-border-light transition-all duration-300 ${isScrolled ? 'py-2 shadow-sm' : 'py-3 sm:py-4'
        }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <div className="flex-shrink-0 min-w-[120px]">
            <Link href="/" className="inline-block">
              <h1 className="text-lg sm:text-xl md:text-2xl font-serif italic text-warm-black leading-tight hover:text-deep-gold transition-colors">
                Sri Devi Kangan
              </h1>
            </Link>
          </div>

          {/* Desktop + Tablet Nav */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex flex-wrap justify-center gap-x-4 lg:gap-x-8 gap-y-2">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(' ', '-')}`}
                  className="text-[10px] sm:text-xs font-sans uppercase tracking-widest text-warm-black hover:text-deep-gold transition-colors whitespace-nowrap"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6">

            <button className="p-1 sm:p-2 text-warm-black hover:text-deep-gold transition-colors">
              <Search size={20} />
            </button>

            <button className="relative p-1 sm:p-2 text-warm-black hover:text-deep-gold transition-colors">
              <Heart size={20} />
              <span className="absolute -top-1 -right-1 bg-deep-gold text-white text-[10px] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </button>

            <button 
              onClick={() => setIsOpen(true)}
              className="relative p-1 sm:p-2 text-warm-black hover:text-deep-gold transition-colors"
            >
              <ShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 bg-deep-gold text-white text-[10px] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center">
                {items.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </button>

            {/* Auth */}
            {session ? (
              <div className="hidden sm:flex items-center gap-4">
                <a
                  href="/orders"
                  className="text-xs uppercase tracking-wider text-warm-black hover:text-deep-gold"
                >
                  My Orders
                </a>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs uppercase tracking-wider text-warm-black hover:text-red-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <a
                href="/signin"
                className="hidden sm:inline text-xs uppercase tracking-widest text-warm-black hover:text-deep-gold"
              >
                Sign In
              </a>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-warm-black"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 border-t border-border-light pt-3 pb-4">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(' ', '-')}`}
                  className="text-sm font-sans text-warm-black hover:text-deep-gold px-2 py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link}
                </a>
              ))}

              {/* Mobile auth */}
              {session ? (
                <>
                  <a
                    href="/orders"
                    className="px-2 py-2 text-sm text-warm-black hover:text-deep-gold font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Orders
                  </a>
                  <button
                    onClick={handleLogout}
                    className="text-left px-2 py-2 text-sm text-red-500 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <a
                  href="/signin"
                  className="px-2 py-2 text-sm text-warm-black"
                >
                  Sign In
                </a>
              )}
            </div>
          </div>
        )}
      </div>
      <CartDrawer />
    </nav>
  )
}