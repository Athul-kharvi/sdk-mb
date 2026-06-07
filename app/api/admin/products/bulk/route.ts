import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

const adminSupabase = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export interface BulkProduct {
  sku: string
  name: string
  description?: string
  price: number
  original_price?: number
  discount?: number
  stock: number
  category_name: string
  brand?: string
  images?: string[]
}

export async function POST(req: Request) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json() as { products: BulkProduct[] }
    const { products } = body

    if (!Array.isArray(products) || products.length === 0)
      return NextResponse.json({ error: 'No products provided' }, { status: 400 })

    const sb = adminSupabase()

    // Fetch all categories to resolve names → ids
    const { data: categories } = await sb
      .from('categories')
      .select('id, name, slug')

    const catMap: Record<string, string> = {}
    for (const c of (categories || [])) {
      catMap[c.name.toLowerCase()] = c.id
      catMap[c.slug?.toLowerCase() ?? ''] = c.id
    }

    const results: { sku: string; success: boolean; error?: string }[] = []

    for (const p of products) {
      try {
        const category_id = catMap[p.category_name?.toLowerCase()] ?? null
        const payload: Record<string, any> = {
          name: p.name.trim(),
          price: p.price,
          stock: p.stock ?? 0,
          is_active: true,
        }
        if (p.description?.trim()) payload.description = p.description.trim()
        if (category_id) payload.category_id = category_id
        if (p.original_price) payload.original_price = p.original_price
        if (p.brand?.trim()) payload.brand = p.brand.trim()
        if (p.sku?.trim()) payload.sku = p.sku.trim()
        if (p.images && p.images.length > 0) payload.image = JSON.stringify(p.images)

        const { error } = await sb.from('products').insert([payload])
        if (error) results.push({ sku: p.sku, success: false, error: error.message })
        else results.push({ sku: p.sku, success: true })
      } catch (e: any) {
        results.push({ sku: p.sku, success: false, error: e.message })
      }
    }

    const succeeded = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success)
    return NextResponse.json({ succeeded, failed, results })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
