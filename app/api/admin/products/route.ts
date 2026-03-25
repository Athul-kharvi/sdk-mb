import { ProductService } from '@/services/product.service'
import { isAdmin } from '@/lib/auth'

export async function GET(req: Request) {
    if (!(await isAdmin(req))) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await ProductService.getProducts()
    return Response.json({ data })
}

export async function POST(req: Request) {
    if (!(await isAdmin(req))) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    await ProductService.createProduct(body)

    return Response.json({ success: true })
}