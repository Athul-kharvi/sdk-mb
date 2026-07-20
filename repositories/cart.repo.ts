import { SupabaseClient } from '@supabase/supabase-js'

export const CartRepo = {
    async getCartByUserId(userId: string, client: SupabaseClient) {
        const result = await client
            .from('carts')
            .select(`
                id,
                user_id,
                cart_items (
                    id,
                    quantity,
                    products (
                        id, name, price, image, stock
                    )
                )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: true })
            .limit(1)
        return { data: result.data?.[0] ?? null, error: result.error }
    },

    async createCart(userId: string, client: SupabaseClient) {
        return client.from('carts').insert([{ user_id: userId }]).select('id').single()
    },

    async getCartItem(cartId: string, productId: string, client: SupabaseClient) {
        return client
            .from('cart_items')
            .select('*')
            .eq('cart_id', cartId)
            .eq('product_id', productId)
            .single()
    },

    async addCartItem(cartId: string, productId: string, quantity: number, client: SupabaseClient) {
        return client.from('cart_items').insert([{ cart_id: cartId, product_id: productId, quantity }])
    },

    async updateCartItemQuantity(cartItemId: string, quantity: number, client: SupabaseClient) {
        return client.from('cart_items').update({ quantity }).eq('id', cartItemId)
    },

    async getProductStock(productId: string, client: SupabaseClient) {
        return client
            .from('products')
            .select('stock')
            .eq('id', productId)
            .single()
    },

    async getCartItemById(cartItemId: string, client: SupabaseClient) {
        return client
            .from('cart_items')
            .select('id, product_id, quantity')
            .eq('id', cartItemId)
            .single()
    },

    async removeCartItem(cartItemId: string, client: SupabaseClient) {
        return client.from('cart_items').delete().eq('id', cartItemId)
    },

    async clearCart(cartId: string, client: SupabaseClient) {
        return client.from('cart_items').delete().eq('cart_id', cartId)
    }
}
