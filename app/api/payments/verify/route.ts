import { createClient } from '@supabase/supabase-js'
import { CartService } from '@/services/cart.service'
import crypto from 'crypto'

const getAuthClient = (token: string) => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { global: { headers: { Authorization: `Bearer ${token}` } } }
)

const getServiceClient = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: { user } } = await getAuthClient(token).auth.getUser(token)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const serviceClient = getServiceClient()

  try {
    const body = await req.json()
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return Response.json({ error: 'Missing payment fields' }, { status: 400 })
    }

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

    const { data: order, error: checkError } = await serviceClient
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single()
    if (!order || checkError) return Response.json({ error: 'Invalid order' }, { status: 400 })

    await serviceClient.from('payments').insert([{
      order_id: orderId,
      razorpay_order_id,
      razorpay_payment_id,
      status: 'captured',
    }])

    await serviceClient.from('orders').update({
      status: 'paid',
      payment_id: razorpay_payment_id,
    }).eq('id', orderId)

    // Decrement stock for each purchased item
    const { data: orderItems } = await serviceClient
      .from('order_items')
      .select('product_id, quantity')
      .eq('order_id', orderId)

    if (orderItems) {
      for (const item of orderItems) {
        await serviceClient.rpc('decrement_stock', {
          p_product_id: item.product_id,
          p_quantity: item.quantity,
        })
      }
    }

    await CartService.clearUserCart(user.id, serviceClient)

    return Response.json({ success: true, orderId })
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 400 })
  }
}
