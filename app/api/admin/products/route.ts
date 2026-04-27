import { ProductService } from '@/services/product.service'
import { ProductRepo } from '@/repositories/product.repo'
import { isAdmin } from '@/lib/auth'

export async function GET(req: Request) {
    if (!(await isAdmin(req))) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Admin sees ALL products including hidden ones
    const { data, error } = await ProductRepo.getAllAdmin()
    if (error) return Response.json({ error: error.message }, { status: 500 })
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
