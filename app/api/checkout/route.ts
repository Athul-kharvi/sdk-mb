import { createClient } from '@supabase/supabase-js'
import { CartService } from '@/services/cart.service'
import Razorpay from 'razorpay'

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

    if (!address || !name || !email || !phone) {
      return Response.json({ error: 'All fields are required' }, { status: 400 })
    }

    const cart = await CartService.getCart(user.id)
    if (!cart || !cart.cart_items || cart.cart_items.length === 0) {
      return Response.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const total = cart.cart_items.reduce(
      (sum: number, item: any) => sum + item.products.price * item.quantity, 0
    )
    const formattedAddress = `Name: ${name} | Email: ${email} | Phone: ${phone} | Address: ${address}`

    // Create pending order in DB first
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{ user_id: user.id, total, address: formattedAddress, status: 'pending' }])
      .select()
      .single()
    if (orderError) throw new Error(orderError.message)

    // Insert order items
    const orderItems = cart.cart_items.map((item: any) => ({
      order_id: order.id,
      product_id: item.products.id,
      quantity: item.quantity,
      price: item.products.price,
    }))
    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
    if (itemsError) throw new Error(itemsError.message)

    const amountPaise = Math.round(total * 100)
    if (amountPaise < 100) {
      return Response.json({ error: 'Order amount too low (minimum ₹1)' }, { status: 400 })
    }

    const hasRazorpayCredentials = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET

    let razorpayOrderId: string

    if (hasRazorpayCredentials) {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
      })
      const rzpOrder = await razorpay.orders.create({
        amount: amountPaise,
        currency: 'INR',
        receipt: `receipt_${order.id}`.slice(0, 40),
      })
      razorpayOrderId = rzpOrder.id
    } else {
      razorpayOrderId = `mock_order_${order.id}`
    }

    await supabase.from('orders').update({ razorpay_order_id: razorpayOrderId }).eq('id', order.id)

    return Response.json({
      success: true,
      orderId: order.id,
      razorpayOrderId,
      razorpayKeyId: hasRazorpayCredentials ? process.env.RAZORPAY_KEY_ID : undefined,
      amount: total,
      currency: 'INR',
      name,
      email,
      phone,
    })
  } catch (e: any) {
    const msg = e?.error?.description ?? e?.message ?? 'Checkout failed'
    return Response.json({ error: msg }, { status: 500 })
  }
}
