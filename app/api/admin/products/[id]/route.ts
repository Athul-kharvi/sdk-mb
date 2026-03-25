import { ProductService } from '@/services/product.service'
import { isAdmin } from '@/lib/auth'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(req: Request, { params }: RouteContext) {
    if (!(await isAdmin(req))) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { data: product, error } = await ProductService.getProductById(id)

    if (error) {
        return Response.json({ error: error.message }, { status: 400 })
    }

    return Response.json({ data: product })
}

export async function PUT(req: Request, { params }: RouteContext) {
    if (!(await isAdmin(req))) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    await ProductService.updateProduct(id, body)

    return Response.json({ success: true })
}

export async function DELETE(req: Request, { params }: RouteContext) {
    if (!(await isAdmin(req))) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await ProductService.deleteProduct(id)

    return Response.json({ success: true })
}