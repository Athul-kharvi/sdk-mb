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

export default async function Home() {
  const categories = await categoryService.getAll()

  return (
    <main className="w-full overflow-hidden bg-site-black">
      <AnnouncementBar />
      <Navbar />
      <Hero />
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
