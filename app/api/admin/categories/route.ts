import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

const adminSupabase = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function GET(req: Request) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = adminSupabase()
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, is_active, created_at')
    .order('name')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: Request) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, slug } = body

  if (!name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

  const supabase = adminSupabase()
  const { data, error } = await supabase
    .from('categories')
    .insert([{ name: name.trim(), slug: slug?.trim() || name.trim().toLowerCase().replace(/\s+/g, '-'), is_active: true }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
