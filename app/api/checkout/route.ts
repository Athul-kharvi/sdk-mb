import { createClient } from '@supabase/supabase-js'
import { CartService } from '@/services/cart.service'

const getSupabaseWithAuth = (req: Request) => {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) return { supabase: null, token: null }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { global: { headers: { Authorization: `Bearer ${token}` } } }
    )
    return { supabase, token }
}

export async function POST(req: Request) {
    const { supabase, token } = getSupabaseWithAuth(req)
    if (!supabase || !token) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const body = await req.json()
        const { name, email, phone, address } = body
        
        if (!address || !name || !email || !phone) return Response.json({ error: 'All fields are required' }, { status: 400 })

        // 1. Get current cart
        const cart = await CartService.getCart(user.id)
        if (!cart || !cart.cart_items || cart.cart_items.length === 0) {
            return Response.json({ error: 'Cart is empty' }, { status: 400 })
        }

        // Calculate total
        const total = cart.cart_items.reduce((sum: number, item: any) => sum + (item.products.price * item.quantity), 0)

        // Format grouped address metadata string
        const formattedAddress = `Name: ${name} | Email: ${email} | Phone: ${phone} | Address: ${address}`

        // 2. Create Order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([{ user_id: user.id, total, address: formattedAddress, status: 'pending' }])
            .select()
            .single()

        if (orderError) throw new Error(orderError.message)

        // 3. Move items to order_items
        const orderItems = cart.cart_items.map((item: any) => ({
            order_id: order.id,
            product_id: item.products.id,
            quantity: item.quantity,
            price: item.products.price
        }))

        const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
        if (itemsError) throw new Error(itemsError.message)

        // At this point, in a real env, you would create a Razorpay order:
        // const razorpayOrder = await razorpay.orders.create({ amount: total * 100, currency: 'INR', receipt: order.id })
        // return Response.json({ orderId: order.id, razorpayOrderId: razorpayOrder.id, amount: total })

        // We return success with order details for mock checkout
        return Response.json({ success: true, orderId: order.id, amount: total })
        
    } catch (e: any) {
        return Response.json({ error: e.message }, { status: 400 })
    }
}
