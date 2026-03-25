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
        const { orderId, razorpay_payment_id = 'mock_pay_123', mockSuccess } = body
        
        if (!orderId) return Response.json({ error: 'orderId is required' }, { status: 400 })

        // Verify order exists and belongs to user
        const { data: order, error: checkError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .eq('user_id', user.id)
            .single()

        if (!order || checkError) return Response.json({ error: 'Invalid order' }, { status: 400 })

        // Insert payment record
        const { error: paymentError } = await supabase.from('payments').insert([{
            order_id: orderId,
            razorpay_order_id: 'mock_order_123',
            razorpay_payment_id: razorpay_payment_id,
            status: mockSuccess ? 'captured' : 'failed'
        }])

        if (paymentError) throw new Error(paymentError.message)

        if (mockSuccess) {
            // Update order status
            await supabase.from('orders').update({ status: 'paid', payment_id: razorpay_payment_id }).eq('id', orderId)
            
            // Clear cart securely matching user
            await CartService.clearUserCart(user.id)
        }

        return Response.json({ success: true })
        
    } catch (e: any) {
        return Response.json({ error: e.message }, { status: 400 })
    }
}
