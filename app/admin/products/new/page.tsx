'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { categoryService, Category } from '@/services/category.service'
import Link from 'next/link'

export default function NewProduct() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({ name: '', price: '', original_price: '', stock: '0', description: '', category_id: '', weight: '1 gram' })
  const [images, setImages] = useState<string[]>([])
  const [urlInput, setUrlInput] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    categoryService.getAll().then(setCategories).catch(console.error)
  }, [])

  const handleAddUrl = () => {
    if (urlInput.trim()) { setImages([...images, urlInput.trim()]); setUrlInput('') }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    setUploadingImage(true)
    try {
      const urls: string[] = []
      for (const file of Array.from(e.target.files)) {
        const ext = file.name.split('.').pop()
        const name = `${Date.now()}-${Math.random().toString(36).slice(7)}.${ext}`
        const { error } = await supabase.storage.from('products').upload(`public/${name}`, file, { cacheControl: '3600', upsert: false })
        if (error) throw error
        const { data } = supabase.storage.from('products').getPublicUrl(`public/${name}`)
        urls.push(data.publicUrl)
      }
      setImages(p => [...p, ...urls])
    } catch { alert('Image upload failed. Check the "products" storage bucket.') }
    finally { setUploadingImage(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          original_price: formData.original_price ? parseFloat(formData.original_price) : null,
          stock: parseInt(formData.stock) || 0,
          description: formData.description,
          category_id: formData.category_id,
          image: JSON.stringify(images),
          weight: formData.weight,
        }),
      })
      if (res.ok) { router.push('/admin') }
      else { const d = await res.json(); alert(d.error || 'Failed to create') }
    } catch { alert('Something went wrong') }
    finally { setLoading(false) }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-2xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/admin" className="font-syndicatgrotesk text-[10px] tracking-[0.15em] uppercase text-[#C4B49A] hover:text-[#D4A017] transition-colors">Dashboard</Link>
          <span className="text-[#C4B49A]">/</span>
          <span className="font-syndicatgrotesk text-[10px] tracking-[0.15em] uppercase text-[#8A7A6A]">Add Product</span>
        </div>

        <h1 className="font-brandon text-2xl font-black uppercase tracking-tight text-[#1A1A1A] mb-6">Add New Product</h1>

        <div className="bg-white border border-[#E8E0D5] shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block font-syndicatgrotesk text-[10px] tracking-[0.2em] uppercase text-[#8A7A6A] mb-1.5">Product Name *</label>
              <input
                type="text" required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2.5 border border-[#E8E0D5] font-syndicatgrotesk text-sm text-[#1A1A1A] placeholder-[#C4B49A] outline-none focus:border-[#D4A017] transition-colors bg-[#FDFCFA]"
                placeholder="e.g. Classic Gold Bangle Set"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-syndicatgrotesk text-[10px] tracking-[0.2em] uppercase text-[#8A7A6A] mb-1.5">Category *</label>
              <select
                required
                value={formData.category_id}
                onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-3 py-2.5 border border-[#E8E0D5] font-syndicatgrotesk text-sm text-[#1A1A1A] outline-none focus:border-[#D4A017] transition-colors bg-[#FDFCFA]"
              >
                <option value="">Select a category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* Price row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-syndicatgrotesk text-[10px] tracking-[0.2em] uppercase text-[#8A7A6A] mb-1.5">Selling Price (₹) *</label>
                <input
                  type="number" required min="0" step="0.01"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2.5 border border-[#E8E0D5] font-syndicatgrotesk text-sm text-[#1A1A1A] placeholder-[#C4B49A] outline-none focus:border-[#D4A017] transition-colors bg-[#FDFCFA]"
                  placeholder="1299"
                />
              </div>
              <div>
                <label className="block font-syndicatgrotesk text-[10px] tracking-[0.2em] uppercase text-[#8A7A6A] mb-1.5">Original / MRP (₹)</label>
                <input
                  type="number" min="0" step="0.01"
                  value={formData.original_price}
                  onChange={e => setFormData({ ...formData, original_price: e.target.value })}
                  className="w-full px-3 py-2.5 border border-[#E8E0D5] font-syndicatgrotesk text-sm text-[#1A1A1A] placeholder-[#C4B49A] outline-none focus:border-[#D4A017] transition-colors bg-[#FDFCFA]"
                  placeholder="1599"
                />
              </div>
              <div>
                <label className="block font-syndicatgrotesk text-[10px] tracking-[0.2em] uppercase text-[#8A7A6A] mb-1.5">Stock Qty</label>
                <input
                  type="number" min="0"
                  value={formData.stock}
                  onChange={e => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-3 py-2.5 border border-[#E8E0D5] font-syndicatgrotesk text-sm text-[#1A1A1A] placeholder-[#C4B49A] outline-none focus:border-[#D4A017] transition-colors bg-[#FDFCFA]"
                  placeholder="50"
                />
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="block font-syndicatgrotesk text-[10px] tracking-[0.2em] uppercase text-[#8A7A6A] mb-1.5">Weight Label</label>
              <input
                type="text"
                value={formData.weight}
                onChange={e => setFormData({ ...formData, weight: e.target.value })}
                className="w-full px-3 py-2.5 border border-[#E8E0D5] font-syndicatgrotesk text-sm text-[#1A1A1A] placeholder-[#C4B49A] outline-none focus:border-[#D4A017] transition-colors bg-[#FDFCFA]"
                placeholder="1 gram"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-syndicatgrotesk text-[10px] tracking-[0.2em] uppercase text-[#8A7A6A] mb-1.5">Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2.5 border border-[#E8E0D5] font-syndicatgrotesk text-sm text-[#1A1A1A] placeholder-[#C4B49A] outline-none focus:border-[#D4A017] transition-colors bg-[#FDFCFA] h-28 resize-none"
                placeholder="Describe this product…"
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Product Images</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="url"
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
                  className="flex-1 px-3 py-2 border border-[#E8E0D5] font-syndicatgrotesk text-sm text-[#1A1A1A] placeholder-[#C4B49A] outline-none focus:border-[#D4A017] transition-colors bg-[#FDFCFA]"
                  placeholder="https://example.com/image.jpg"
                />
                <button type="button" onClick={handleAddUrl} disabled={!urlInput}
                  className="px-4 py-2 border border-[#E8E0D5] font-syndicatgrotesk text-sm text-[#8A7A6A] hover:bg-[#FAF7F2] disabled:opacity-40 transition-colors">
                  Add URL
                </button>
              </div>

              <div className="relative border-2 border-dashed border-[#E8E0D5] p-8 flex flex-col items-center justify-center bg-[#FAF7F2] hover:bg-[#F5EFE6] transition cursor-pointer">
                <input type="file" multiple accept="image/*" onChange={handleFileUpload} disabled={uploadingImage}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                <svg className="w-8 h-8 text-[#C4B49A] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="font-syndicatgrotesk text-sm text-[#C4B49A]">{uploadingImage ? 'Uploading…' : 'Click or drag to upload images'}</p>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                  {images.map((url, i) => (
                    <div key={i} className="relative group rounded-lg overflow-hidden border aspect-square">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">
                        ×
                      </button>
                      {i === 0 && <span className="absolute bottom-1 left-1 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded">Main</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => router.push('/admin')}
                className="flex-1 py-3 border border-[#E8E0D5] font-syndicatgrotesk text-sm text-[#8A7A6A] hover:bg-[#FAF7F2] transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 py-3 bg-[#D4A017] text-[#0D0D0D] font-syndicatgrotesk text-[10px] font-bold tracking-[0.22em] uppercase hover:bg-[#B8860B] transition-colors disabled:opacity-50">
                {loading ? 'Creating…' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
