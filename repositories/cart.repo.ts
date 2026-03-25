import { supabase } from '@/lib/supabase'

export const CartRepo = {
    // Get active cart for user with existing items
    async getCartByUserId(userId: string) {
        return supabase
            .from('carts')
            .select(`
                id, 
                user_id,
                cart_items (
                    id,
                    quantity,
                    products (
                        id, name, price, image
                    )
                )
            `)
            .eq('user_id', userId)
            .single()
    },

    async createCart(userId: string) {
        return supabase.from('carts').insert([{ user_id: userId }]).select('id').single()
    },

    async getCartItem(cartId: string, productId: string) {
        return supabase
            .from('cart_items')
            .select('*')
            .eq('cart_id', cartId)
            .eq('product_id', productId)
            .single()
    },

    async addCartItem(cartId: string, productId: string, quantity: number) {
        return supabase.from('cart_items').insert([{ cart_id: cartId, product_id: productId, quantity }])
    },

    async updateCartItemQuantity(cartItemId: string, quantity: number) {
        return supabase.from('cart_items').update({ quantity }).eq('id', cartItemId)
    },

    async removeCartItem(cartItemId: string) {
        return supabase.from('cart_items').delete().eq('id', cartItemId)
    },

    async clearCart(cartId: string) {
        return supabase.from('cart_items').delete().eq('cart_id', cartId)
    }
}
