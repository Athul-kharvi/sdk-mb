import { createClient } from '@supabase/supabase-js'
import { CartService } from '@/services/cart.service'

const getSupabaseWithAuth = (req: Request) => {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) return { supabase: null, token: null }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        }
    )
    return { supabase, token }
}

export async function GET(req: Request) {
    const { supabase, token } = getSupabaseWithAuth(req)
    if (!supabase || !token) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: { user } } = await supabase.auth.getUser(token)
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const cart = await CartService.getCart(user.id)
        return Response.json({ data: cart })
    } catch (e: any) {
        return Response.json({ error: e.message }, { status: 400 })
    }
}

export async function POST(req: Request) {
    const { supabase, token } = getSupabaseWithAuth(req)
    if (!supabase || !token) return Response.json({ error: 'Unauthorized', reason: 'no token' }, { status: 401 })

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (!user) return Response.json({ error: 'Unauthorized', reason: authError?.message ?? 'user null', tokenSnippet: token.slice(0, 20) }, { status: 401 })

    try {
        const body = await req.json()
        const { productId, quantity = 1 } = body
        
        if (!productId) return Response.json({ error: 'productId is required' }, { status: 400 })

        const cart = await CartService.addToCart(user.id, productId, quantity)
        return Response.json({ success: true, data: cart })
    } catch (e: any) {
        return Response.json({ error: e.message }, { status: 400 })
    }
}

export async function PUT(req: Request) {
    const { supabase, token } = getSupabaseWithAuth(req)
    if (!supabase || !token) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: { user } } = await supabase.auth.getUser(token)
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const body = await req.json()
        const { cartItemId, quantity } = body
        
        if (!cartItemId || typeof quantity !== 'number') {
            return Response.json({ error: 'cartItemId and quantity are required' }, { status: 400 })
        }

        const cart = await CartService.updateItemQuantity(user.id, cartItemId, quantity)
        return Response.json({ success: true, data: cart })
    } catch (e: any) {
        return Response.json({ error: e.message }, { status: 400 })
    }
}

export async function DELETE(req: Request) {
    const { supabase, token } = getSupabaseWithAuth(req)
    if (!supabase || !token) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: { user } } = await supabase.auth.getUser(token)
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const url = new URL(req.url)
        const cartItemId = url.searchParams.get('cartItemId')
        
        if (!cartItemId) return Response.json({ error: 'cartItemId is required' }, { status: 400 })

        const cart = await CartService.removeItem(user.id, cartItemId)
        return Response.json({ success: true, data: cart })
    } catch (e: any) {
        return Response.json({ error: e.message }, { status: 400 })
    }
}
