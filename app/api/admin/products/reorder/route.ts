import { isAdmin } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function PUT(req: Request) {
  if (!(await isAdmin(req))) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { updates } = await req.json()
  // updates: { id: string, sort_order: number }[]
  if (!Array.isArray(updates)) return Response.json({ error: 'Invalid payload' }, { status: 400 })

  const results = await Promise.all(
    updates.map(({ id, sort_order }: { id: string; sort_order: number }) =>
      supabase.from('products').update({ sort_order }).eq('id', id)
    )
  )

  const failed = results.find(r => r.error)
  if (failed?.error) return Response.json({ error: failed.error.message }, { status: 500 })

  return Response.json({ success: true })
}