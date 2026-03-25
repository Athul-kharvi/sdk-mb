import { ProductRepo } from '@/repositories/product.repo'

export const ProductService = {
    async getProducts() {
        const { data, error } = await ProductRepo.getAll()
        if (error) throw error
        return data
    },

    async getProductById(id: string) {
        const { data, error } = await ProductRepo.getById(id)
        return { data, error }
    },

    async createProduct(body: any) {
        if (!body.name || !body.price) {
            throw new Error('Missing fields')
        }

        const { error } = await ProductRepo.create(body)
        if (error) throw error
    },

    async updateProduct(id: string, body: any) {
        const { error } = await ProductRepo.update(id, body)
        if (error) throw error
    },

    async deleteProduct(id: string) {
        const { error } = await ProductRepo.delete(id)
        if (error) throw error
    },
}