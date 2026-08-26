export const revalidate = 300

import { AnnouncementBar } from '@/components/announcement-bar'
import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { CategoryGrid } from '@/components/category-grid'
import { TrustSignals } from '@/components/trust-signals'
import { Footer } from '@/components/footer'
import { FloatingWhatsApp } from '@/components/floating-whatsapp'
import { categoryService } from '@/services/category.service'
import { supabase } from '@/lib/supabase'

async function getHeroImages() {
  const { data } = await supabase.from('site_settings').select('value').eq('key', 'hero').single()
  if (!data?.value) return { desktop: ['/images/hero_image.png'], mobile: ['/images/hero_image_mobile.png'] }
  const norm = (v: any): string[] => Array.isArray(v) && v.length ? v.filter(Boolean) : []
  const desktop = norm(data.value.desktop)
  const mobile = norm(data.value.mobile)
  return {
    desktop: desktop.length ? desktop : ['/images/hero_image.png'],
    mobile: mobile.length ? mobile : (desktop.length ? desktop : ['/images/hero_image_mobile.png']),
  }
}

export default async function Home() {
  const [categories, hero] = await Promise.all([
    categoryService.getAll(),
    getHeroImages(),
  ])

  const navCategories = categories.map(c => ({ name: c.name, slug: c.slug || c.name.toLowerCase().replace(/\s+/g, '-'), image: c.image ?? null }))

  return (
    <main className="w-full overflow-hidden bg-site-black">
      <AnnouncementBar />
      <Navbar categories={navCategories} />
      <Hero desktopImgs={hero.desktop} mobileImgs={hero.mobile} />
      <CategoryGrid categories={categories.map(c => ({ ...c, slug: c.slug ?? '' }))} />
      <TrustSignals />
      <Footer />
      <FloatingWhatsApp />
    </main>
  )
}