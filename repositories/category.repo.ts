import { supabase } from '@/lib/supabase'

export const categoryRepository = {
    getAll: () =>
        supabase
            .from("categories")
            .select("id, name, slug, image, sort_order")
            .eq("is_active", true)
            .order("sort_order", { ascending: true, nullsFirst: false })
            .order("name"),

    getAllWithImages: () =>
        supabase
            .from("categories")
            .select("id, name, slug, image, sort_order, count_label")
            .eq("is_active", true)
            .order("sort_order", { ascending: true, nullsFirst: false })
            .order("name"),
}