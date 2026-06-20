import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

const sb = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  const { data } = await sb()
    .from('site_settings')
    .select('value')
    .eq('key', 'hero')
    .single()
  return NextResponse.json({ data: data?.value ?? null })
}

export async function PUT(req: Request) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  // body.desktop: string[] (up to 3), body.mobile: string[] (up to 3)
  const value: Record<string, string[]> = {}
  if (Array.isArray(body.desktop)) value.desktop = body.desktop.slice(0, 3)
  if (Array.isArray(body.mobile)) value.mobile = body.mobile.slice(0, 3)

  const { error } = await sb()
    .from('site_settings')
    .upsert({ key: 'hero', value }, { onConflict: 'key' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}