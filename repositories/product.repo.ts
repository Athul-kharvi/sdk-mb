import { supabase } from '@/lib/supabase'

export const ProductRepo = {
    getAll: () => supabase.from('products').select('*, categories(id, name, slug)').eq('is_active', true).order('created_at', { ascending: false }),

    getById: (id: string) =>
        supabase.from('products').select('*, categories(id, name, slug)').eq('id', id).single(),

    create: (data: any) =>
        supabase.from('products').insert([data]),

    update: (id: string, data: any) =>
        supabase.from('products').update(data).eq('id', id),

    delete: (id: string) =>
        supabase.from('products').update({ is_active: false }).eq('id', id),
}