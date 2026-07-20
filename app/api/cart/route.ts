import { createClient } from '@supabase/supabase-js'
import { CartService } from '@/services/cart.service'

// Auth check only — verifies the JWT, never used for DB queries
const getAuthClient = (token: string) => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
)

// Service-role client — bypasses RLS for server-side DB operations
// Safe because auth is always verified above before this client is used
const getServiceClient = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const getUser = async (req: Request) => {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) return { user: null, serviceClient: null }
    const { data: { user } } = await getAuthClient(token).auth.getUser(token)
    if (!user) return { user: null, serviceClient: null }
    return { user, serviceClient: getServiceClient() }
}

export async function GET(req: Request) {
    const { user, serviceClient } = await getUser(req)
    if (!user || !serviceClient) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const cart = await CartService.getCart(user.id, serviceClient)
        return Response.json({ data: cart })
    } catch (e: any) {
        return Response.json({ error: e.message }, { status: 400 })
    }
}

export async function POST(req: Request) {
    const { user, serviceClient } = await getUser(req)
    if (!user || !serviceClient) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const body = await req.json()
        const { productId, quantity = 1 } = body

        if (!productId) return Response.json({ error: 'productId is required' }, { status: 400 })

        const cart = await CartService.addToCart(user.id, productId, quantity, serviceClient)
        return Response.json({ success: true, data: cart })
    } catch (e: any) {
        return Response.json({ error: e.message }, { status: 400 })
    }
}

export async function PUT(req: Request) {
    const { user, serviceClient } = await getUser(req)
    if (!user || !serviceClient) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const body = await req.json()
        const { cartItemId, quantity } = body

        if (!cartItemId || typeof quantity !== 'number') {
            return Response.json({ error: 'cartItemId and quantity are required' }, { status: 400 })
        }

        const cart = await CartService.updateItemQuantity(user.id, cartItemId, quantity, serviceClient)
        return Response.json({ success: true, data: cart })
    } catch (e: any) {
        return Response.json({ error: e.message }, { status: 400 })
    }
}

export async function DELETE(req: Request) {
    const { user, serviceClient } = await getUser(req)
    if (!user || !serviceClient) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const url = new URL(req.url)
        const cartItemId = url.searchParams.get('cartItemId')

        if (!cartItemId) return Response.json({ error: 'cartItemId is required' }, { status: 400 })

        const cart = await CartService.removeItem(user.id, cartItemId, serviceClient)
        return Response.json({ success: true, data: cart })
    } catch (e: any) {
        return Response.json({ error: e.message }, { status: 400 })
    }
}
