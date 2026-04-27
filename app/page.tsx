import { AnnouncementBar } from '@/components/announcement-bar'
import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { GoldRateTicker } from '@/components/gold-rate-ticker'
import { CategoryGrid } from '@/components/category-grid'
import { EditorialStory } from '@/components/editorial-story'
import { ProductScroll } from '@/components/product-scroll'
import { TrustSignals } from '@/components/trust-signals'
import { Testimonials } from '@/components/testimonials'
import { Newsletter } from '@/components/newsletter'
import { Footer } from '@/components/footer'
import { FloatingWhatsApp } from '@/components/floating-whatsapp'
import { categoryService } from '@/services/category.service'
import { ProductService } from '@/services/product.service'

export default async function Home() {
  const categories = await categoryService.getAll()
  const products = await ProductService.getProducts()

  return (
    <main className="w-full overflow-hidden bg-site-black">
      <AnnouncementBar />
      <Navbar />
      <Hero />
      <GoldRateTicker />
      <CategoryGrid categories={categories} />

      {categories.map((category, index) => {
        const categoryProducts = products?.filter(p => p.category_id === category.id) || []
        if (categoryProducts.length === 0) return null

        return (
          <div key={category.id} id={category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}>
            <ProductScroll
              title={category.name}
              subtitle="One Gram Gold"
              viewAllLink={`#${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              isDark={index % 2 === 0}
              products={categoryProducts.map(p => {
                let parsedImage: string | undefined = undefined
                if (p.image) {
                  try {
                    const arr = JSON.parse(p.image)
                    if (Array.isArray(arr) && arr.length > 0) parsedImage = arr[0]
                  } catch {
                    parsedImage = p.image
                  }
                }
                return {
                  id: p.id,
                  name: p.name,
                  price: p.price,

                  weight: (p as any).weight || '1 gram',
                  image: parsedImage,
                }
              })}
            />
          </div>
        )
      })}

      <EditorialStory />
      <TrustSignals />
      <Testimonials />
      <Newsletter />
      <Footer />
      <FloatingWhatsApp />
    </main>
  )
}
