import { ProductService } from '@/services/product.service'
import { isAdmin } from '@/lib/auth'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(req: Request, { params }: RouteContext) {
  if (!(await isAdmin(req))) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const { data, error } = await ProductService.getProductById(id)
    if (error) return Response.json({ error: error.message }, { status: 400 })
    return Response.json({ data })
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: RouteContext) {
  if (!(await isAdmin(req))) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const body = await req.json()

    // Strip out any fields that don't exist in the DB schema
    const { name, price, description, category_id, image, stock, is_active } = body
    const payload: Record<string, any> = {}
    if (name !== undefined) payload.name = name
    if (price !== undefined) payload.price = Number(price)
    if (description !== undefined) payload.description = description
    if (category_id !== undefined) payload.category_id = category_id
    if (image !== undefined) payload.image = image
    if (stock !== undefined) payload.stock = Number(stock) || 0
    if (is_active !== undefined) payload.is_active = is_active

    await ProductService.updateProduct(id, payload)
    return Response.json({ success: true })
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: RouteContext) {
  if (!(await isAdmin(req))) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    await ProductService.deleteProduct(id)
    return Response.json({ success: true })
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
