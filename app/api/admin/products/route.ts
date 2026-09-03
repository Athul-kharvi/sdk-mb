import { ProductRepo } from '@/repositories/product.repo'
import { isAdmin } from '@/lib/auth'

export async function GET(req: Request) {
  if (!(await isAdmin(req))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(req.url)
  const pageParam = url.searchParams.get('page')
  const search = url.searchParams.get('search') ?? ''
  const categoryId = url.searchParams.get('category') ?? ''

  if (pageParam !== null) {
    const page = Math.max(0, parseInt(pageParam) || 0)
    const limit = 25
    const { data, count, error } = await ProductRepo.getAllAdminPaginated(page, limit, search, categoryId)
    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ data, total: count ?? 0, page, limit })
  }

  const { data, error } = await ProductRepo.getAllAdmin()
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ data })
}

export async function POST(req: Request) {
  if (!(await isAdmin(req))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { name, price, original_price, category_id, description, image, stock, weight, is_active } = body

    if (!name?.trim()) return Response.json({ error: 'Product name is required' }, { status: 400 })
    if (!price || isNaN(Number(price))) return Response.json({ error: 'Valid price is required' }, { status: 400 })

    const payload: Record<string, any> = {
      name: name.trim(),
      price: Number(price),
      is_active: is_active ?? true,
    }
    if (category_id) payload.category_id = category_id
    if (description?.trim()) payload.description = description.trim()
    if (image) payload.image = image
    if (stock !== undefined && stock !== '') payload.stock = Number(stock) || 0
    if (original_price !== undefined) payload.original_price = original_price ? Number(original_price) : null
    if (weight?.trim()) payload.weight = weight.trim()

    const { data, error } = await ProductRepo.create(payload)
    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ success: true, data }, { status: 201 })
  } catch (e: any) {
    return Response.json({ error: e.message || 'Failed to create product' }, { status: 500 })
  }
}
