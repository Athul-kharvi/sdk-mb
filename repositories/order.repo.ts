import { supabase } from '@/lib/supabase'

export const OrderRepo = {
    getAll: () =>
        supabase
            .from('orders')
            .select('*, order_items(*, products(*))'),

    updateStatus: (id: string, status: string) =>
        supabase.from('orders').update({ status }).eq('id', id),
}