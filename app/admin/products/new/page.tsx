'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { categoryService, Category } from '@/services/category.service'

export default function NewProduct() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category_id: ''
    })

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAll()
                setCategories(data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchCategories()
    }, [])
    const [images, setImages] = useState<string[]>([])
    const [urlInput, setUrlInput] = useState('')
    const [uploadingImage, setUploadingImage] = useState(false)

    const handleAddUrl = () => {
        if (urlInput) {
            setImages([...images, urlInput])
            setUrlInput('')
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return
        setUploadingImage(true)

        try {
            const uploadedUrls: string[] = []
            for (let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i]
                const fileExt = file.name.split('.').pop()
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from('products')
                    .upload(`public/${fileName}`, file, { cacheControl: '3600', upsert: false })

                if (uploadError) {
                    console.error(uploadError)
                    throw uploadError
                }

                const { data } = supabase.storage.from('products').getPublicUrl(`public/${fileName}`)
                uploadedUrls.push(data.publicUrl)
            }

            setImages((prev) => [...prev, ...uploadedUrls])
        } catch (error) {
            console.error('Error uploading image: ', error)
            alert('Failed to upload image. Ensure the "products" storage bucket exists and allows uploads.')
        } finally {
            setUploadingImage(false)
        }
    }

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const {
                data: { session }
            } = await supabase.auth.getSession()
            const res = await fetch('/api/admin/products', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({
                    name: formData.name,
                    price: parseFloat(formData.price),
                    description: formData.description,
                    category_id: formData.category_id,
                    image: JSON.stringify(images)
                })
            })

            if (res.ok) {
                router.push('/admin')
            } else {
                const data = await res.json()
                alert(data.error || 'Failed to create product')
            }
        } catch (err) {
            console.error(err)
            alert('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#faf9f6] text-gray-900 p-8">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-serif">Add New Product</h1>
                    <button
                        onClick={() => router.push('/admin')}
                        className="text-gray-500 hover:text-gray-900"
                    >
                        Cancel
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-600 outline-none"
                            placeholder="e.g. Diamond Ring"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <select
                            required
                            value={formData.category_id}
                            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-600 outline-none"
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price (₹)
                        </label>
                        <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-600 outline-none"
                            placeholder="e.g. 50000"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-yellow-600 outline-none h-32"
                            placeholder="Product description..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Images
                        </label>

                        <div className="flex space-x-2 mb-4">
                            <input
                                type="url"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-yellow-600 outline-none text-sm"
                                placeholder="https://example.com/image.jpg"
                            />
                            <button
                                type="button"
                                onClick={handleAddUrl}
                                disabled={!urlInput}
                                className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50 text-gray-700"
                            >
                                Add URL
                            </button>
                        </div>

                        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileUpload}
                                disabled={uploadingImage}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                            />
                            <div className="text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p className="mt-1 text-sm text-gray-600">
                                    {uploadingImage ? 'Uploading...' : 'Click or drag files to upload directly'}
                                </p>
                            </div>
                        </div>

                        {images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                {images.map((imgUrl, idx) => (
                                    <div key={idx} className="relative group rounded-lg overflow-hidden border">
                                        <img src={imgUrl} alt={`Preview ${idx}`} className="w-full h-32 object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Remove image"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-yellow-600 text-white py-3 rounded-lg font-medium hover:bg-yellow-700 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Create Product'}
                    </button>
                </form>
            </div>
        </div>
    )
}
