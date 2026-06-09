export const revalidate = 300

import { AnnouncementBar } from '@/components/announcement-bar'
import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
// import { GoldRateTicker } from '@/components/gold-rate-ticker'
import { CategoryGrid } from '@/components/category-grid'
import { EditorialStory } from '@/components/editorial-story'
import { TrustSignals } from '@/components/trust-signals'
import { Testimonials } from '@/components/testimonials'
// import { Newsletter } from '@/components/newsletter'
import { Footer } from '@/components/footer'
import { FloatingWhatsApp } from '@/components/floating-whatsapp'
import { categoryService } from '@/services/category.service'

async function getHeroImages() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/site_settings?key=eq.hero&select=value`, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      },
      next: { revalidate: 300 },
    })
    const rows = await res.json()
    return rows?.[0]?.value ?? null
  } catch { return null }
}

export default async function Home() {
  const [categories, heroImages] = await Promise.all([
    categoryService.getAll(),
    getHeroImages(),
  ])

  return (
    <main className="w-full overflow-hidden bg-site-black">
      <AnnouncementBar />
      <Navbar />
      <Hero desktopImage={heroImages?.desktop} mobileImage={heroImages?.mobile} />
      {/* <GoldRateTicker /> */}
      <CategoryGrid categories={categories} />

      {/* <EditorialStory /> */}
      <TrustSignals />
      {/* <Testimonials /> */}
      {/* <Newsletter /> */}
      <Footer />
      <FloatingWhatsApp />
    </main>
  )
}
