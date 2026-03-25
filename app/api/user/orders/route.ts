import { createClient } from '@supabase/supabase-js'

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

export async function GET(req: Request) {
    const { supabase, token } = getSupabaseWithAuth(req)
    if (!supabase || !token) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const { data: orders, error } = await supabase
            .from('orders')
            .select(`
                id,
                total,
                status,
                address,
                created_at,
                order_items (
                    id, quantity, price,
                    products ( id, name, image )
                )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) throw new Error(error.message)

        return Response.json({ data: orders })
    } catch (e: any) {
        return Response.json({ error: e.message }, { status: 400 })
    }
}
