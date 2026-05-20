import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { categoryRepository } from '@/repositories/category.repo'
import { ProductRepo } from '@/repositories/product.repo'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

function getFirstImage(raw: string | undefined): string | undefined {
  if (!raw) return undefined
  try {
    const arr = JSON.parse(raw)
    if (Array.isArray(arr) && arr.length > 0) return arr[0]
  } catch {}
  return raw
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const name = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  return {
    title: `${name} — Vinayaka Creations`,
    description: `Browse our ${name} collection. Handcrafted one-gram gold jewellery.`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params

  // Fetch all categories to find the matching one
  const { data: allCategories } = await categoryRepository.getAll()
  const category = allCategories?.find(
    (c: any) => c.slug === slug || c.name.toLowerCase().replace(/\s+/g, '-') === slug
  )

  // Fetch products — filter by category_id if found, else empty
  let products: any[] = []
  if (category) {
    const { data } = await ProductRepo.getAll()
    products = (data || []).filter((p: any) => p.category_id === category.id)
  }

  const displayName = category?.name
    ?? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  return (
    <div className="min-h-screen bg-warm-beige">
      <Navbar />

      {/* Hero strip */}
      <div className="bg-site-black border-b border-border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-syndicatgrotesk text-[10px] tracking-[0.2em] uppercase text-muted-taupe hover:text-rich-gold transition-colors mb-6"
          >
            <ArrowLeft size={12} />
            Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-rich-gold/60" />
            <span className="font-syndicatgrotesk text-[9px] tracking-[0.35em] uppercase text-rich-gold/80">
              Collection
            </span>
            <div className="w-8 h-px bg-rich-gold/60" />
          </div>

          <h1 className="font-brandon text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-ivory">
            {displayName}
          </h1>
          <p className="font-syndicatgrotesk text-xs text-muted-taupe mt-2">
            {products.length > 0
              ? `${products.length} piece${products.length !== 1 ? 's' : ''} · One Gram Gold`
              : 'One Gram Gold · Handcrafted Jewellery'}
          </p>
        </div>
      </div>

      {/* Products grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {products.map((product: any) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={getFirstImage(product.image)}
                isDark={false}
              />
            ))}
          </div>
        ) : (
          /* Empty state — category exists but no products yet */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 border-2 border-dashed border-border-light rounded-full flex items-center justify-center bg-soft-cream mb-6">
              <svg className="w-8 h-8 text-muted-taupe" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="font-brandon text-xl font-black uppercase tracking-tight text-warm-black mb-2">
              Coming Soon
            </h2>
            <p className="font-syndicatgrotesk text-sm text-text-muted max-w-xs leading-relaxed mb-8">
              We're adding new pieces to the {displayName} collection. Check back soon or explore our other collections.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {(allCategories as any[])
                ?.filter((c: any) => (c.slug || c.name.toLowerCase().replace(/\s+/g, '-')) !== slug)
                .slice(0, 4)
                .map((c: any) => {
                  const catSlug = c.slug || c.name.toLowerCase().replace(/\s+/g, '-')
                  return (
                    <Link
                      key={c.id}
                      href={`/category/${catSlug}`}
                      className="px-5 py-2.5 border border-border-light bg-white font-syndicatgrotesk text-[10px] tracking-[0.18em] uppercase text-text-muted hover:border-deep-gold hover:text-deep-gold transition-colors"
                    >
                      {c.name}
                    </Link>
                  )
                })}
              <Link
                href="/"
                className="px-5 py-2.5 bg-warm-black text-ivory font-syndicatgrotesk text-[10px] tracking-[0.18em] uppercase hover:bg-deep-gold transition-colors"
              >
                View All
              </Link>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
