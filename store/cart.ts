import { create } from 'zustand'

export interface CartItem {
    id: string
    quantity: number
    product: {
        id: string
        name: string
        price: number
        image?: string
        stock?: number | null
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
            image: item.products.image,
            stock: item.products.stock ?? null
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
            const json = await res.json()
            if (!res.ok) throw new Error(json.error || 'Failed to add to cart')
            set({ items: mapCartData(json.data), isOpen: true, isLoading: false })
        } catch (error: any) {
            set({ error: error.message, isLoading: false })
            throw error
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
            const json = await res.json()
            if (!res.ok) throw new Error(json.error || 'Failed to update quantity')
            set({ items: mapCartData(json.data), isLoading: false })
        } catch (error: any) {
            set({ error: error.message, isLoading: false })
            throw error
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
