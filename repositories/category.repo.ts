import { supabase } from '@/lib/supabase'

export const categoryRepository = {
    getAll: () =>
        supabase
            .from("categories")
            .select("id, name, slug")
            .eq("is_active", true)
            .order("name"),

    getAllWithImages: () =>
        supabase
            .from("categories")
            .select("id, name, slug, image, count_label")
            .eq("is_active", true)
            .order("name"),
}