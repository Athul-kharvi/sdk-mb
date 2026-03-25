import { OrderRepo } from '@/repositories/order.repo'

export const OrderService = {
    async getOrders() {
        const { data, error } = await OrderRepo.getAll()
        if (error) throw error
        return data
    },

    async updateOrderStatus(id: string, status: string) {
        const { error } = await OrderRepo.updateStatus(id, status)
        if (error) throw error
    },
}