'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Category { id: string; name: string }
interface Product { id: string; name: string; image?: string; price: number; sort_order?: number | null }

function getThumb(img?: string) {
  if (!img) return null
  try { const a = JSON.parse(img); return Array.isArray(a) ? a[0] : img } catch { return img }
}

export default function ArrangePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCat, setSelectedCat] = useState<string>('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2500) }

  const getToken = async () => (await supabase.auth.getSession()).data.session?.access_token ?? ''

  // Load categories
  useEffect(() => {
    getToken().then(token =>
      fetch('/api/admin/categories', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(({ data }) => {
          const cats = (data || []).filter((c: any) => c.is_active !== false)
          setCategories(cats)
          if (cats.length) setSelectedCat(cats[0].id)
          setLoading(false)
        })
    )
  }, [])

  // Load products for selected category
  useEffect(() => {
    if (!selectedCat) return
    getToken().then(token =>
      fetch('/api/admin/products', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(({ data }) => {
          const filtered = (data || [])
            .filter((p: any) => p.category_id === selectedCat && p.is_active !== false)
            .sort((a: any, b: any) => {
              const ao = a.sort_order ?? 99999
              const bo = b.sort_order ?? 99999
              return ao - bo
            })
          setProducts(filtered)
        })
    )
  }, [selectedCat])

  const move = (from: number, to: number) => {
    if (to < 0 || to >= products.length) return
    const next = [...products]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    setProducts(next)
  }

  // Drag handlers
  const onDragStart = (i: number) => setDragIdx(i)
  const onDragOver = (e: React.DragEvent, i: number) => { e.preventDefault(); setDragOverIdx(i) }
  const onDrop = (e: React.DragEvent, i: number) => {
    e.preventDefault()
    if (dragIdx !== null && dragIdx !== i) move(dragIdx, i)
    setDragIdx(null); setDragOverIdx(null)
  }
  const onDragEnd = () => { setDragIdx(null); setDragOverIdx(null) }

  const save = useCallback(async () => {
    setSaving(true)
    const token = await getToken()
    const updates = products.map((p, i) => ({ id: p.id, sort_order: i + 1 }))
    const res = await fetch('/api/admin/products/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ updates }),
    })
    setSaving(false)
    if (res.ok) showToast('Order saved!')
    else showToast('Save failed')
  }, [products])

  if (loading) return (
    <div className="p-8 flex items-center gap-2.5">
      {[0, 150, 300].map(d => <span key={d} className="w-2 h-2 bg-[#D4A017] rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
      <span className="font-syndicatgrotesk text-[11px] tracking-widest uppercase text-[#C4B49A] ml-2">Loading…</span>
    </div>
  )

  return (
    <div className="p-6 lg:p-8 space-y-6">

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1A1A1A] text-[#D4A017] px-5 py-2.5 font-syndicatgrotesk text-[11px] tracking-widest uppercase shadow-xl pointer-events-none">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-brandon text-2xl font-black uppercase tracking-tight text-[#1A1A1A]">Arrange Products</h1>
          <p className="font-syndicatgrotesk text-[11px] text-[#8A7A6A] mt-0.5 tracking-wider">
            Drag rows or use ↑↓ buttons to set display order per category
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving || products.length === 0}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#D4A017] text-[#0D0D0D] font-syndicatgrotesk text-[10px] font-bold tracking-[0.22em] uppercase hover:bg-[#B8860B] transition-colors disabled:opacity-50"
        >
          {saving ? (
            <span className="w-3.5 h-3.5 rounded-full border-2 border-[#0D0D0D]/30 border-t-[#0D0D0D] animate-spin" />
          ) : (
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
          )}
          Save Order
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCat(c.id)}
            className={`px-4 py-2 font-syndicatgrotesk text-[10px] tracking-[0.18em] uppercase transition-colors border ${
              selectedCat === c.id
                ? 'bg-[#D4A017] text-[#0D0D0D] border-[#D4A017]'
                : 'bg-white text-[#8A7A6A] border-[#E8E0D5] hover:border-[#D4A017] hover:text-[#D4A017]'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Hint */}
      <div className="border-l-4 border-[#D4A017] bg-[#D4A017]/5 px-4 py-3">
        <p className="font-syndicatgrotesk text-[11px] text-[#8A7A6A] leading-relaxed">
          Drag &amp; drop rows · or use <strong className="text-[#B8860B]">↑ ↓</strong> arrows · click <strong className="text-[#B8860B]">Save Order</strong> when done
        </p>
      </div>

      {/* Product list */}
      {products.length === 0 ? (
        <div className="bg-white border border-[#E8E0D5] py-16 text-center">
          <p className="font-syndicatgrotesk text-[11px] tracking-widest uppercase text-[#C4B49A]">No products in this category</p>
          <Link href="/admin/products/new" className="inline-block mt-4 font-syndicatgrotesk text-[10px] uppercase tracking-widest text-[#D4A017] hover:text-[#B8860B]">
            Add a product →
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#E8E0D5] overflow-hidden shadow-sm">
          {products.map((p, i) => {
            const thumb = getThumb(p.image)
            const isDragging = dragIdx === i
            const isOver = dragOverIdx === i && dragIdx !== i
            return (
              <div
                key={p.id}
                draggable
                onDragStart={() => onDragStart(i)}
                onDragOver={e => onDragOver(e, i)}
                onDrop={e => onDrop(e, i)}
                onDragEnd={onDragEnd}
                className={`flex items-center gap-4 px-4 py-3 border-b border-[#F0EBE1] last:border-b-0 transition-all duration-150 cursor-grab active:cursor-grabbing select-none
                  ${isDragging ? 'opacity-40 bg-[#FDF8EE]' : ''}
                  ${isOver ? 'border-t-2 border-t-[#D4A017] bg-[#FDF8EE]' : 'hover:bg-[#FAF7F2]'}
                `}
              >
                {/* Drag handle */}
                <div className="flex-shrink-0 text-[#C4B49A] hover:text-[#8A7A6A]">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Position number */}
                <span className="flex-shrink-0 w-6 text-center font-brandon text-sm font-black text-[#C4B49A]">
                  {i + 1}
                </span>

                {/* Thumb */}
                {thumb
                  ? <img src={thumb} alt={p.name} className="flex-shrink-0 w-10 h-10 object-cover border border-[#E8E0D5]" />
                  : <div className="flex-shrink-0 w-10 h-10 bg-[#F0EBE1] border border-[#E8E0D5]" />
                }

                {/* Name + price */}
                <div className="flex-1 min-w-0">
                  <p className="font-brandon text-sm font-black text-[#1A1A1A] line-clamp-1">{p.name}</p>
                  <p className="font-syndicatgrotesk text-[10px] text-[#8A7A6A]">₹{p.price?.toLocaleString('en-IN')}</p>
                </div>

                {/* ↑ ↓ buttons */}
                <div className="flex-shrink-0 flex flex-col gap-0.5">
                  <button
                    onClick={() => move(i, i - 1)}
                    disabled={i === 0}
                    className="w-7 h-7 flex items-center justify-center border border-[#E8E0D5] text-[#8A7A6A] hover:border-[#D4A017] hover:text-[#D4A017] disabled:opacity-25 transition-colors"
                    aria-label="Move up"
                  >
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6" /></svg>
                  </button>
                  <button
                    onClick={() => move(i, i + 1)}
                    disabled={i === products.length - 1}
                    className="w-7 h-7 flex items-center justify-center border border-[#E8E0D5] text-[#8A7A6A] hover:border-[#D4A017] hover:text-[#D4A017] disabled:opacity-25 transition-colors"
                    aria-label="Move down"
                  >
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}