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

        const { data: product } = await CartRepo.getProductStock(productId)
        const stock: number | null = product?.stock ?? null

        const { data: existingItem } = await CartRepo.getCartItem(cartId, productId)
        const currentQty = existingItem?.quantity ?? 0
        const newQty = currentQty + quantity

        if (stock !== null && stock === 0) {
            throw new Error('This item is out of stock')
        }
        if (stock !== null && newQty > stock) {
            throw new Error(`Only ${stock} in stock`)
        }

        if (existingItem) {
            await CartRepo.updateCartItemQuantity(existingItem.id, newQty)
        } else {
            await CartRepo.addCartItem(cartId, productId, quantity)
        }

        return await this.getCart(userId)
    },

    async updateItemQuantity(userId: string, cartItemId: string, quantity: number) {
        if (quantity <= 0) {
            await CartRepo.removeCartItem(cartItemId)
            return await this.getCart(userId)
        }

        const { data: itemRow } = await CartRepo.getCartItemById(cartItemId)
        if (itemRow?.product_id) {
            const { data: product } = await CartRepo.getProductStock(itemRow.product_id)
            const stock: number | null = product?.stock ?? null
            if (stock !== null && stock === 0) {
                throw new Error('This item is out of stock')
            }
            if (stock !== null && quantity > stock) {
                throw new Error(`Only ${stock} in stock`)
            }
        }

        await CartRepo.updateCartItemQuantity(cartItemId, quantity)
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
