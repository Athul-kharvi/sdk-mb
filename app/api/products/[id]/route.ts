import { ProductService } from '@/services/product.service'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { data, error } = await ProductService.getProductById(params.id)
  if (error) return Response.json({ error: (error as any).message }, { status: 404 })
  return Response.json({ data })
}
