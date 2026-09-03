import { supabase } from '@/lib/supabase'

const LISTING_COLS = 'id, name, price, original_price, weight, image, stock, category_id, categories(id, name, slug)'

export const ProductRepo = {
    getAll: () => supabase.from('products').select('*, categories(id, name, slug)').eq('is_active', true).order('sort_order', { ascending: true, nullsFirst: false }).order('created_at', { ascending: false }),

    getAllListing: () => supabase.from('products').select(LISTING_COLS).eq('is_active', true).order('sort_order', { ascending: true, nullsFirst: false }).order('created_at', { ascending: false }),

    getByCategory: (categoryId: string) => supabase.from('products')
        .select('id, name, price, original_price, weight, image, stock')
        .eq('is_active', true)
        .eq('category_id', categoryId)
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false }),

    getAllAdmin: () => supabase.from('products').select('*, categories(id, name, slug)').order('created_at', { ascending: false }),

    getAllAdminPaginated: (page: number, limit: number, search: string, categoryId: string) => {
        let q = supabase
            .from('products')
            .select('*, categories(id, name, slug)', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(page * limit, (page + 1) * limit - 1)
        if (search) q = q.ilike('name', `%${search}%`)
        if (categoryId) q = q.eq('category_id', categoryId)
        return q
    },

    getById: (id: string) =>
        supabase.from('products').select('*, categories(id, name, slug)').eq('id', id).single(),

    create: (data: any) =>
        supabase.from('products').insert([data]),

    update: (id: string, data: any) =>
        supabase.from('products').update(data).eq('id', id),

    delete: (id: string) =>
        supabase.from('products').update({ is_active: false }).eq('id', id),
}