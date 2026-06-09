'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const NAV_ITEMS = [
  {
    href: '/admin',
    label: 'Dashboard',
    exact: true,
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: '/admin/hero',
    label: 'Hero Image',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="14" rx="2" />
        <path d="M3 13l4-4 4 4 3-3 4 4" />
      </svg>
    ),
  },
  {
    href: '/admin/categories',
    label: 'Categories',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
      </svg>
    ),
  },
  {
    href: '/admin/inventory',
    label: 'Inventory',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
        <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" />
      </svg>
    ),
  },
  {
    href: '/admin/orders',
    label: 'Orders',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6M9 16h4" />
      </svg>
    ),
  },
  {
    href: '/admin/products/new',
    label: 'Add Product',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
  {
    href: '/admin/products/bulk-upload',
    label: 'Bulk Upload',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        <path d="M7 10h10" />
      </svg>
    ),
  },
]

function SidebarContent({
  pathname,
  onNavigate,
  onLogout,
}: {
  pathname: string
  onNavigate: () => void
  onLogout: () => void
}) {
  const isActive = (item: typeof NAV_ITEMS[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  return (
    <div className="flex flex-col h-full bg-[#0D0D0D]">
      {/* Brand */}
      <div className="px-6 pt-7 pb-6 border-b border-white/[0.08]">
        <p className="font-brandon text-xs font-black tracking-[0.3em] uppercase text-[#D4A017]">
          Vinayak Creation
        </p>
        <p className="font-syndicatgrotesk text-[10px] tracking-[0.25em] uppercase text-white/30 mt-0.5">
          Admin Panel
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-3 transition-all duration-150 cursor-pointer
                ${active
                  ? 'bg-[#D4A017]/10 text-[#D4A017] border-l-2 border-[#D4A017] pl-[10px]'
                  : 'text-white/45 hover:text-white/80 hover:bg-white/[0.05] border-l-2 border-transparent'
                }`}
            >
              <span className={`flex-shrink-0 transition-colors ${active ? 'text-[#D4A017]' : 'text-white/35'}`}>
                {item.icon}
              </span>
              <span className="font-syndicatgrotesk text-[11px] tracking-[0.18em] uppercase font-medium">
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/[0.08] space-y-0.5">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-3 text-white/30 hover:text-white/70 transition-colors cursor-pointer"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          </svg>
          <span className="font-syndicatgrotesk text-[10px] tracking-[0.2em] uppercase">View Store</span>
        </a>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-3 text-white/30 hover:text-red-400 transition-colors cursor-pointer"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          <span className="font-syndicatgrotesk text-[10px] tracking-[0.2em] uppercase">Logout</span>
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/signin'); return }
      const { data } = await supabase
        .from('users').select('role').eq('id', session.user.id).single()
      if (data?.role !== 'admin') { router.push('/'); return }
      setLoading(false)
    }
    check()
  }, [router])

  // Close mobile drawer on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/signin')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="flex items-center gap-2">
          {[0, 150, 300].map((d) => (
            <span
              key={d}
              className="w-2 h-2 bg-[#D4A017] rounded-full animate-bounce"
              style={{ animationDelay: `${d}ms` }}
            />
          ))}
          <span className="font-syndicatgrotesk text-[11px] tracking-[0.2em] uppercase text-[#8A7A6A] ml-3">
            Verifying access…
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#F5EFE6] font-brandon">

      {/* ── DESKTOP sidebar (always visible, takes layout space) ── */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:flex-shrink-0 lg:sticky lg:top-0 lg:h-screen">
        <SidebarContent
          pathname={pathname}
          onNavigate={() => {}}
          onLogout={handleLogout}
        />
      </aside>

      {/* ── MOBILE: overlay backdrop ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── MOBILE: drawer ── */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 z-50 lg:hidden transform transition-transform duration-300 ease-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-label="Navigation"
      >
        <SidebarContent
          pathname={pathname}
          onNavigate={() => setMobileOpen(false)}
          onLogout={handleLogout}
        />
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-[#0D0D0D] border-b border-white/[0.08]">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 text-white/60 hover:text-white transition-colors"
            aria-label="Open navigation"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-brandon text-[11px] font-black tracking-[0.25em] uppercase text-[#D4A017]">
            Vinayak Creation
          </span>
          <div className="w-9" />
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
