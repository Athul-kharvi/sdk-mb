import { create } from 'zustand'

export interface CartItem {
    id: string
    quantity: number
    product: {
        id: string
        name: string
        price: number
        image?: string
    }
}

interface CartState {
    items: CartItem[]
    isOpen: boolean
    isLoading: boolean
    error: string | null
    
    // Actions
    setIsOpen: (isOpen: boolean) => void
    fetchCart: (token: string) => Promise<void>
    addToCart: (token: string, productId: string, quantity?: number) => Promise<void>
    updateQuantity: (token: string, cartItemId: string, quantity: number) => Promise<void>
    removeItem: (token: string, cartItemId: string) => Promise<void>
    clearCart: () => void
}

const mapCartData = (data: any): CartItem[] => {
    if (!data || !data.cart_items) return []
    return data.cart_items.map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
        product: {
            id: item.products.id,
            name: item.products.name,
            price: item.products.price,
            image: item.products.image
        }
    }))
}

export const useCartStore = create<CartState>((set) => ({
    items: [],
    isOpen: false,
    isLoading: false,
    error: null,

    setIsOpen: (isOpen: boolean) => set({ isOpen }),

    fetchCart: async (token: string) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch('/api/cart', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (!res.ok) throw new Error('Failed to fetch cart')
            const { data } = await res.json()
            set({ items: mapCartData(data), isLoading: false })
        } catch (error: any) {
            set({ error: error.message, isLoading: false })
        }
    },

    addToCart: async (token: string, productId: string, quantity = 1) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ productId, quantity })
            })
            if (!res.ok) throw new Error('Failed to add to cart')
            const { data } = await res.json()
            set({ items: mapCartData(data), isOpen: true, isLoading: false }) // Auto-open cart on add
        } catch (error: any) {
            set({ error: error.message, isLoading: false })
        }
    },

    updateQuantity: async (token: string, cartItemId: string, quantity: number) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch('/api/cart', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ cartItemId, quantity })
            })
            if (!res.ok) throw new Error('Failed to update quantity')
            const { data } = await res.json()
            set({ items: mapCartData(data), isLoading: false })
        } catch (error: any) {
            set({ error: error.message, isLoading: false })
        }
    },

    removeItem: async (token: string, cartItemId: string) => {
        set({ isLoading: true, error: null })
        try {
            const res = await fetch(`/api/cart?cartItemId=${cartItemId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            })
            if (!res.ok) throw new Error('Failed to remove item')
            const { data } = await res.json()
            set({ items: mapCartData(data), isLoading: false })
        } catch (error: any) {
            set({ error: error.message, isLoading: false })
        }
    },
    
    clearCart: () => set({ items: [] })
}))
