import { CartRepo } from '@/repositories/cart.repo'

export const CartService = {
    async getCart(userId: string) {
        let { data: cart, error } = await CartRepo.getCartByUserId(userId)

        // If no cart exists for user, create one
        if (!cart || error) {
            const { data: newCart, error: createError } = await CartRepo.createCart(userId)
            if (createError) throw new Error('Could not create cart')
            
            cart = { id: newCart.id, user_id: userId, cart_items: [] } as any
        }
        
        return cart
    },

    async addToCart(userId: string, productId: string, quantity: number = 1) {
        const cart = await this.getCart(userId)
        if (!cart) throw new Error('Cart not found')
        const cartId = cart.id

        // Check if item already exists in cart
        const { data: existingItem } = await CartRepo.getCartItem(cartId, productId)

        if (existingItem) {
            const newQty = existingItem.quantity + quantity
            await CartRepo.updateCartItemQuantity(existingItem.id, newQty)
        } else {
            await CartRepo.addCartItem(cartId, productId, quantity)
        }
        
        return await this.getCart(userId)
    },

    async updateItemQuantity(userId: string, cartItemId: string, quantity: number) {
        // Enforce user ownership of the cart in a robust app.
        // For now, updating by item id.
        if (quantity <= 0) {
            await CartRepo.removeCartItem(cartItemId)
        } else {
            await CartRepo.updateCartItemQuantity(cartItemId, quantity)
        }
        return await this.getCart(userId)
    },

    async removeItem(userId: string, cartItemId: string) {
        await CartRepo.removeCartItem(cartItemId)
        return await this.getCart(userId)
    },
    
    async clearUserCart(userId: string) {
        const cart = await this.getCart(userId)
        if (cart) {
           await CartRepo.clearCart(cart.id)
        }
    }
}
