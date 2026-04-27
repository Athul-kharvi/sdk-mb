import { ProductService } from '@/services/product.service'

export async function GET() {
  try {
    const data = await ProductService.getProducts()
    return Response.json({ data })
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
