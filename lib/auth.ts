import { createClient } from '@supabase/supabase-js'

export async function isAdmin(req: Request) {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) return false

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: { user }, error } = await supabase.auth.getUser(token)

    console.log('USER FROM SERVER:', user)

    if (error || !user) return false

    return user.email === 'ak@gmail.com'
}