import { createClient } from '@supabase/supabase-js'
import { CartService } from '@/services/cart.service'
import crypto from 'crypto'

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
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return Response.json({ error: 'Missing payment fields' }, { status: 400 })
    }

    // Skip signature verification for mock orders
    const isMock = razorpay_order_id?.startsWith('mock_order_')
    if (!isMock) {
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex')
      if (expectedSignature !== razorpay_signature) {
        return Response.json({ error: 'Invalid payment signature' }, { status: 400 })
      }
    }

    // Confirm order belongs to this user
    const { data: order, error: checkError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single()
    if (!order || checkError) return Response.json({ error: 'Invalid order' }, { status: 400 })

    // Record payment
    await supabase.from('payments').insert([{
      order_id: orderId,
      razorpay_order_id,
      razorpay_payment_id,
      status: 'captured',
    }])

    // Mark order as paid
    await supabase.from('orders').update({
      status: 'paid',
      payment_id: razorpay_payment_id,
    }).eq('id', orderId)

    // Clear cart
    await CartService.clearUserCart(user.id)

    return Response.json({ success: true, orderId })
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 400 })
  }
}
