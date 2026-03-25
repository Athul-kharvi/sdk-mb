import { supabase } from '@/lib/supabase'

export const categoryRepository = {
    getAll: () =>
        supabase
            .from("categories")
            .select("id, name, slug")
            .eq("is_active", true)
            .order("name"),
}