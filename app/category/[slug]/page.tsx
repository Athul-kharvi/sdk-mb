import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { CategoryContent } from '@/components/category-content'
import { categoryRepository } from '@/repositories/category.repo'
import { ProductRepo } from '@/repositories/product.repo'

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
    title: `${name} — Vinayak Creation`,
    description: `Browse our ${name} collection.`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params

  const { data: allCategories } = await categoryRepository.getAll()
  const category = (allCategories as any[])?.find(
    (c: any) => c.slug === slug || c.name.toLowerCase().replace(/\s+/g, '-') === slug
  )

  let products: any[] = []
  if (category) {
    const { data } = await ProductRepo.getAll()
    products = (data || []).filter((p: any) => p.category_id === category.id).map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      original_price: p.original_price ?? undefined,
      weight: p.weight ?? undefined,
      image: getFirstImage(p.image),
    }))
  }

  const displayName = category?.name
    ?? slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())

  const cats = ((allCategories as any[]) || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }))

  return (
    <div className="min-h-screen bg-warm-beige">
      <Navbar />
      <CategoryContent
        categoryName={displayName}
        slug={slug}
        products={products}
        allCategories={cats}
      />
      <Footer />
    </div>
  )
}
