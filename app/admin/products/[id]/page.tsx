'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { categoryService, Category } from '@/services/category.service'

export default function EditProduct() {
    const router = useRouter()
    const params = useParams()

    const [loading, setLoading] = useState(false)
    const [initialLoad, setInitialLoad] = useState(true)
    const [categories, setCategories] = useState<Category[]>([])

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category_id: ''
    })

    const [images, setImages] = useState<string[]>([])
    const [urlInput, setUrlInput] = useState('')
    const [uploadingImage, setUploadingImage] = useState(false)

    const getAuthHeaders = async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession()

        return {
            Authorization: `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
        }
    }


    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const headers = await getAuthHeaders()

                const res = await fetch(
                    `/api/admin/products/${params.id}`,
                    { headers }
                )

                if (!res.ok) {
                    console.error('Failed to fetch product')
                    return
                }

                const data = await res.json()
                const product = data.data

                // Parse images safely
                let parsedImages: string[] = []

                if (product.image) {
                    try {
                        parsedImages = JSON.parse(product.image)
                        if (!Array.isArray(parsedImages)) {
                            parsedImages = [product.image]
                        }
                    } catch {
                        parsedImages = [product.image]
                    }
                }

                setImages(parsedImages)

                setFormData({
                    name: product.name || '',
                    price: product.price ? product.price.toString() : '',
                    description: product.description || '',
                    category_id: product.category_id || '',
                })
            } catch (err) {
                console.error(err)
            } finally {
                setInitialLoad(false)
            }
        }

        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAll()
                setCategories(data)
            } catch (err) {
                console.error(err)
            }
        }

        if (params.id) {
            fetchCategories()
            fetchProduct()
        }
    }, [params.id])


    const handleAddUrl = () => {
        if (!urlInput) return
        setImages([...images, urlInput])
        setUrlInput('')
    }


    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index))
    }


    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return

        setUploadingImage(true)

        try {
            const uploadedUrls: string[] = []

            for (let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i]
                const fileExt = file.name.split('.').pop()
                const fileName = `${Date.now()}-${Math.random()
                    .toString(36)
                    .substring(7)}.${fileExt}`

                const { error } = await supabase.storage
                    .from('products')
                    .upload(`public/${fileName}`, file)

                if (error) throw error

                const { data } = supabase.storage
                    .from('products')
                    .getPublicUrl(`public/${fileName}`)

                uploadedUrls.push(data.publicUrl)
            }

            setImages((prev) => [...prev, ...uploadedUrls])
        } catch (error) {
            console.error(error)
            alert('Image upload failed')
        } finally {
            setUploadingImage(false)
        }
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const headers = await getAuthHeaders()

            const res = await fetch(
                `/api/admin/products/${params.id}`,
                {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify({
                        name: formData.name,
                        price: parseFloat(formData.price),
                        description: formData.description,
                        category_id: formData.category_id,
                        image: JSON.stringify(images),
                    }),
                }
            )

            if (res.ok) {
                router.push('/admin')
            } else {
                const data = await res.json()
                alert(data.error || 'Update failed')
            }
        } catch (err) {
            console.error(err)
            alert('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    if (initialLoad) {
        return <div className="p-10">Loading product...</div>
    }

    return (
        <div className="min-h-screen bg-[#faf9f6] text-gray-900 p-8">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl border shadow-sm">

                <div className="flex justify-between mb-6">
                    <h1 className="text-2xl font-serif">Edit Product</h1>

                    <button
                        onClick={() => router.push('/admin')}
                        className="text-gray-500 hover:text-black"
                    >
                        Cancel
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* NAME */}
                    <input
                        type="text"
                        placeholder="Product Name"
                        className="w-full p-2 border rounded"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                    />

                    {/* PRICE */}
                    <input
                        type="number"
                        placeholder="Price"
                        className="w-full p-2 border rounded"
                        value={formData.price}
                        onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                        }
                    />

                    {/* CATEGORY */}
                    <select
                        required
                        value={formData.category_id}
                        onChange={(e) =>
                            setFormData({ ...formData, category_id: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    {/* DESCRIPTION */}
                    <textarea
                        placeholder="Description"
                        className="w-full p-2 border rounded h-24"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                description: e.target.value,
                            })
                        }
                    />

                    {/* IMAGE URL */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Image URL"
                            className="flex-1 p-2 border rounded"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={handleAddUrl}
                            className="px-4 bg-gray-200 rounded"
                        >
                            Add
                        </button>
                    </div>

                    {/* FILE UPLOAD */}
                    <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                    />

                    {/* IMAGE PREVIEW */}
                    <div className="grid grid-cols-3 gap-2">
                        {images.map((img, i) => (
                            <div key={i} className="relative">
                                <img
                                    src={img}
                                    className="w-full h-24 object-cover rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    className="absolute top-1 right-1 bg-red-500 text-white px-2 rounded"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-yellow-600 text-white p-2 rounded"
                    >
                        {loading ? 'Saving...' : 'Update Product'}
                    </button>

                </form>
            </div>
        </div>
    )
}