import { createClient } from '@supabase/supabase-js'

export async function isAdmin(req: Request): Promise<boolean> {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return false

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    )

    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return false

    return user.email === 'ak@gmail.com'
  } catch {
    return false
  }
}
