import { SupabaseClient } from '@supabase/supabase-js'
import { CartRepo } from '@/repositories/cart.repo'

export const CartService = {
    async getCart(userId: string, client: SupabaseClient) {
        let { data: cart, error } = await CartRepo.getCartByUserId(userId, client)

        if (!cart || error) {
            const { data: newCart, error: createError } = await CartRepo.createCart(userId, client)
            if (createError) throw new Error('Could not create cart')
            cart = { id: newCart.id, user_id: userId, cart_items: [] } as any
        }

        return cart
    },

    async addToCart(userId: string, productId: string, quantity: number = 1, client: SupabaseClient) {
        const cart = await this.getCart(userId, client)
        if (!cart) throw new Error('Cart not found')
        const cartId = cart.id

        const { data: product } = await CartRepo.getProductStock(productId, client)
        const stock: number | null = product?.stock ?? null

        if (stock !== null && stock === 0) {
            throw new Error('This item is out of stock')
        }

        const { data: existingItem } = await CartRepo.getCartItem(cartId, productId, client)
        const currentQty = existingItem?.quantity ?? 0
        const newQty = currentQty + quantity

        if (existingItem) {
            const { error: updateErr } = await CartRepo.updateCartItemQuantity(existingItem.id, newQty, client)
            if (updateErr) throw new Error(`Failed to update cart item: ${updateErr.message}`)
        } else {
            const { error: insertErr } = await CartRepo.addCartItem(cartId, productId, quantity, client)
            if (insertErr) throw new Error(`Failed to add cart item: ${insertErr.message}`)
        }

        return await this.getCart(userId, client)
    },

    async updateItemQuantity(userId: string, cartItemId: string, quantity: number, client: SupabaseClient) {
        if (quantity <= 0) {
            await CartRepo.removeCartItem(cartItemId, client)
            return await this.getCart(userId, client)
        }

        const { data: itemRow } = await CartRepo.getCartItemById(cartItemId, client)
        if (itemRow?.product_id) {
            const { data: product } = await CartRepo.getProductStock(itemRow.product_id, client)
            const stock: number | null = product?.stock ?? null
            if (stock !== null && stock === 0) {
                throw new Error('This item is out of stock')
            }
        }

        await CartRepo.updateCartItemQuantity(cartItemId, quantity, client)
        return await this.getCart(userId, client)
    },

    async removeItem(userId: string, cartItemId: string, client: SupabaseClient) {
        await CartRepo.removeCartItem(cartItemId, client)
        return await this.getCart(userId, client)
    },

    async clearUserCart(userId: string, client: SupabaseClient) {
        const cart = await this.getCart(userId, client)
        if (cart) {
            await CartRepo.clearCart(cart.id, client)
        }
    }
}
