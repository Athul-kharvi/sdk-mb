'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface Category {
  id: string
  name: string
  slug: string
  is_active: boolean
  image: string | null
  sort_order: number | null
  created_at: string
}

interface CropBox {
  x: number
  y: number
  w: number
  h: number
}

const CROP_ASPECT = 3 / 4 // 3:4 = same as category grid cards

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function clampCrop(box: CropBox, dW: number, dH: number): CropBox {
  let { x, y, w, h } = box
  w = Math.max(40, Math.min(w, dW))
  h = w / CROP_ASPECT
  if (h > dH) { h = dH; w = h * CROP_ASPECT }
  x = Math.max(0, Math.min(x, dW - w))
  y = Math.max(0, Math.min(y, dH - h))
  return { x, y, w, h }
}

// ─── Crop Modal ───────────────────────────────────────────────────────────────
function ImageCropModal({
  file,
  onConfirm,
  onCancel,
}: {
  file: File
  onConfirm: (blob: Blob) => void
  onCancel: () => void
}) {
  const previewRef = useRef<HTMLCanvasElement>(null)
  const [imgSrc, setImgSrc] = useState('')
  const [naturalW, setNaturalW] = useState(0)
  const [naturalH, setNaturalH] = useState(0)
  const [displayW, setDisplayW] = useState(0)
  const [displayH, setDisplayH] = useState(0)
  const [crop, setCrop] = useState<CropBox>({ x: 0, y: 0, w: 0, h: 0 })
  const [dragging, setDragging] = useState<null | 'move' | 'se' | 'sw' | 'ne' | 'nw'>(null)
  const dragStart = useRef({ mx: 0, my: 0, cx: 0, cy: 0, cw: 0, ch: 0 })

  useEffect(() => {
    const url = URL.createObjectURL(file)
    setImgSrc(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const initCrop = useCallback((dW: number, dH: number) => {
    let cw = dW
    let ch = cw / CROP_ASPECT
    if (ch > dH) { ch = dH; cw = ch * CROP_ASPECT }
    setCrop({ x: (dW - cw) / 2, y: (dH - ch) / 2, w: cw, h: ch })
  }, [])

  const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    setNaturalW(img.naturalWidth)
    setNaturalH(img.naturalHeight)
    setDisplayW(img.clientWidth)
    setDisplayH(img.clientHeight)
    initCrop(img.clientWidth, img.clientHeight)
  }

  // Draw preview canvas whenever crop changes
  useEffect(() => {
    const canvas = previewRef.current
    const img = document.querySelector<HTMLImageElement>('#crop-src-img')
    if (!canvas || !img || !naturalW || !displayW) return
    const scaleX = naturalW / displayW
    const scaleY = naturalH / displayH
    canvas.width = 90
    canvas.height = 120
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, crop.x * scaleX, crop.y * scaleY, crop.w * scaleX, crop.h * scaleY, 0, 0, 90, 120)
  }, [crop, naturalW, naturalH, displayW, displayH])

  const onMouseDown = (e: React.MouseEvent, type: 'move' | 'se' | 'sw' | 'ne' | 'nw') => {
    e.preventDefault()
    setDragging(type)
    dragStart.current = { mx: e.clientX, my: e.clientY, cx: crop.x, cy: crop.y, cw: crop.w, ch: crop.h }
  }

  useEffect(() => {
    if (!dragging) return
    const onMove = (e: MouseEvent) => {
      const { mx, my, cx, cy, cw, ch } = dragStart.current
      const dx = e.clientX - mx
      const dy = e.clientY - my
      let box: CropBox = { x: cx, y: cy, w: cw, h: ch }
      if (dragging === 'move') {
        box = { x: cx + dx, y: cy + dy, w: cw, h: ch }
      } else if (dragging === 'se') {
        const nw = cw + dx; box = { x: cx, y: cy, w: nw, h: nw / CROP_ASPECT }
      } else if (dragging === 'sw') {
        const nw = cw - dx; box = { x: cx + dx, y: cy, w: nw, h: nw / CROP_ASPECT }
      } else if (dragging === 'ne') {
        const nw = cw + dx; const nh = nw / CROP_ASPECT; box = { x: cx, y: cy + ch - nh, w: nw, h: nh }
      } else if (dragging === 'nw') {
        const nw = cw - dx; const nh = nw / CROP_ASPECT; box = { x: cx + dx, y: cy + ch - nh, w: nw, h: nh }
      }
      setCrop(clampCrop(box, displayW, displayH))
    }
    const onUp = () => setDragging(null)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [dragging, displayW, displayH])

  const handleConfirm = () => {
    const img = document.querySelector<HTMLImageElement>('#crop-src-img')
    if (!img || !naturalW || !displayW) return
    const scaleX = naturalW / displayW
    const scaleY = naturalH / displayH
    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 800
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, crop.x * scaleX, crop.y * scaleY, crop.w * scaleX, crop.h * scaleY, 0, 0, 600, 800)
    canvas.toBlob(blob => { if (blob) onConfirm(blob) }, 'image/jpeg', 0.88)
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl shadow-2xl flex flex-col" style={{ maxHeight: '90vh' }}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8E0D5] flex items-center justify-between shrink-0">
          <div>
            <p className="font-brandon text-base font-black uppercase tracking-tight text-[#1A1A1A]">Crop Cover Image</p>
            <p className="font-syndicatgrotesk text-[10px] text-[#8A7A6A] mt-0.5 tracking-wider">
              Drag box to move · drag corners to resize · aspect ratio 3:4 (portrait)
            </p>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center border border-[#E8E0D5] text-[#8A7A6A] hover:border-[#D4A017] hover:text-[#D4A017] transition-colors text-lg font-light"
          >
            ×
          </button>
        </div>

        {/* Image + crop overlay */}
        <div className="flex-1 overflow-auto bg-[#111] flex items-center justify-center p-6 min-h-0">
          <div className="relative inline-block select-none" style={{ cursor: dragging === 'move' ? 'grabbing' : 'default' }}>
            <img
              id="crop-src-img"
              src={imgSrc}
              alt="crop source"
              onLoad={handleImgLoad}
              style={{ display: 'block', maxWidth: '100%', maxHeight: '50vh', userSelect: 'none', pointerEvents: 'none' }}
            />

            {/* Dim outside crop */}
            {displayW > 0 && (
              <svg
                width={displayW}
                height={displayH}
                style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
              >
                <defs>
                  <mask id="cropMask">
                    <rect width={displayW} height={displayH} fill="white" />
                    <rect x={crop.x} y={crop.y} width={crop.w} height={crop.h} fill="black" />
                  </mask>
                </defs>
                <rect width={displayW} height={displayH} fill="rgba(0,0,0,0.6)" mask="url(#cropMask)" />
              </svg>
            )}

            {/* Crop box */}
            {displayW > 0 && (
              <div
                style={{
                  position: 'absolute',
                  left: crop.x,
                  top: crop.y,
                  width: crop.w,
                  height: crop.h,
                  border: '2px solid #D4A017',
                  boxSizing: 'border-box',
                  cursor: 'move',
                }}
                onMouseDown={e => onMouseDown(e, 'move')}
              >
                {/* Grid lines (rule of thirds) */}
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  backgroundImage: 'linear-gradient(rgba(212,160,23,0.25) 1px,transparent 1px),linear-gradient(90deg,rgba(212,160,23,0.25) 1px,transparent 1px)',
                  backgroundSize: `${crop.w / 3}px ${crop.h / 3}px`,
                }} />

                {/* Corner handles */}
                {(['nw', 'ne', 'sw', 'se'] as const).map(dir => (
                  <div
                    key={dir}
                    onMouseDown={e => { e.stopPropagation(); onMouseDown(e, dir) }}
                    style={{
                      position: 'absolute',
                      width: 14, height: 14,
                      background: '#D4A017',
                      border: '2px solid white',
                      top: dir.includes('n') ? -7 : undefined,
                      bottom: dir.includes('s') ? -7 : undefined,
                      left: dir.includes('w') ? -7 : undefined,
                      right: dir.includes('e') ? -7 : undefined,
                      cursor: dir + '-resize',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer with preview */}
        <div className="px-6 py-4 border-t border-[#E8E0D5] bg-[#FAF7F2] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <p className="font-syndicatgrotesk text-[9px] tracking-[0.3em] uppercase text-[#8A7A6A]">Preview</p>
            <canvas
              ref={previewRef}
              style={{ width: 45, height: 60, border: '1px solid #E8E0D5', background: '#F0EBE1' }}
            />
            <p className="font-syndicatgrotesk text-[9px] text-[#C4B49A]">600 × 800 px</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="px-5 py-2.5 border border-[#E8E0D5] font-syndicatgrotesk text-[10px] tracking-[0.15em] uppercase text-[#8A7A6A] hover:border-[#C4B49A] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2.5 bg-[#D4A017] text-[#0D0D0D] font-syndicatgrotesk text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#B8860B] transition-colors"
            >
              Use This Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '' })
  const [editForm, setEditForm] = useState({ name: '', slug: '' })
  const [error, setError] = useState('')
  const [toastMsg, setToastMsg] = useState('')

  // Crop state
  const [cropFile, setCropFile] = useState<File | null>(null)
  const [cropTargetId, setCropTargetId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const activeCatIdRef = useRef<string | null>(null)

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token ?? ''
  }

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  const fetchCategories = async () => {
    const token = await getToken()
    const res = await fetch('/api/admin/categories', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setCategories(data.data || [])
    setLoading(false)
  }

  useEffect(() => { fetchCategories() }, [])

  // ── Create ──
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('Category name is required'); return }
    setSaving(true)
    const token = await getToken()
    const maxOrder = categories.reduce((m, c) => Math.max(m, c.sort_order ?? 0), 0)
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name.trim(),
        slug: form.slug || slugify(form.name),
        sort_order: maxOrder + 1,
      }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Failed to create'); setSaving(false); return }
    setForm({ name: '', slug: '' })
    setShowForm(false)
    setSaving(false)
    showToast(`"${form.name.trim()}" created`)
    fetchCategories()
  }

  // ── Update ──
  const handleUpdate = async (id: string) => {
    setSaving(true)
    const token = await getToken()
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editForm.name.trim(), slug: editForm.slug || slugify(editForm.name) }),
    })
    setSaving(false)
    if (res.ok) { setEditingId(null); showToast('Category updated'); fetchCategories() }
  }

  const handleToggle = async (id: string, is_active: boolean) => {
    const token = await getToken()
    await fetch(`/api/admin/categories/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !is_active }),
    })
    showToast(is_active ? 'Category hidden from store' : 'Category visible on store')
    fetchCategories()
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? Products in this category will still exist.`)) return
    setDeletingId(id)
    const token = await getToken()
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    setDeletingId(null)
    showToast(`"${name}" deleted`)
    fetchCategories()
  }

  // ── Sort order ──
  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const sorted = [...categories].sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999))
    const idx = sorted.findIndex(c => c.id === id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sorted.length) return

    const a = sorted[idx]
    const b = sorted[swapIdx]
    const aOrder = a.sort_order ?? idx
    const bOrder = b.sort_order ?? swapIdx

    const token = await getToken()
    await Promise.all([
      fetch(`/api/admin/categories/${a.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: bOrder }),
      }),
      fetch(`/api/admin/categories/${b.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: aOrder }),
      }),
    ])
    fetchCategories()
  }

  // ── Image upload flow ──
  const triggerImageUpload = (catId: string) => {
    activeCatIdRef.current = catId
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCropFile(file)
    setCropTargetId(activeCatIdRef.current)
    e.target.value = ''
  }

  const handleCropConfirm = async (blob: Blob) => {
    const catId = cropTargetId
    if (!catId) return
    setCropFile(null)
    setCropTargetId(null)
    setUploadingId(catId)

    try {
      const token = await getToken()
      const fileName = `${catId}-${Date.now()}.jpg`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('categories')
        .upload(fileName, blob, { contentType: 'image/jpeg', upsert: true })

      if (uploadError) {
        showToast(`Upload failed: ${uploadError.message}`)
        setUploadingId(null)
        return
      }

      const { data: urlData } = supabase.storage.from('categories').getPublicUrl(fileName)
      const publicUrl = urlData.publicUrl

      await fetch(`/api/admin/categories/${catId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: publicUrl }),
      })
      showToast('Cover image updated')
      fetchCategories()
    } finally {
      setUploadingId(null)
    }
  }

  const handleRemoveImage = async (catId: string) => {
    if (!confirm('Remove the cover image for this category?')) return
    const token = await getToken()
    await fetch(`/api/admin/categories/${catId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: null }),
    })
    showToast('Cover image removed')
    fetchCategories()
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center gap-3">
        {[0, 150, 300].map(d => (
          <span key={d} className="w-2 h-2 bg-[#D4A017] rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
        ))}
        <span className="font-syndicatgrotesk text-[11px] tracking-widest uppercase text-[#C4B49A] ml-2">Loading…</span>
      </div>
    )
  }

  const sorted = [...categories].sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999))

  return (
    <div className="p-6 lg:p-8 space-y-6">

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Crop modal */}
      {cropFile && cropTargetId && (
        <ImageCropModal
          file={cropFile}
          onConfirm={handleCropConfirm}
          onCancel={() => { setCropFile(null); setCropTargetId(null) }}
        />
      )}

      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1A1A1A] text-[#D4A017] px-6 py-3 font-syndicatgrotesk text-[11px] tracking-[0.18em] uppercase shadow-xl">
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-brandon text-2xl font-black uppercase tracking-tight text-[#1A1A1A]">Categories</h1>
          <p className="font-syndicatgrotesk text-[11px] tracking-[0.15em] text-[#8A7A6A] mt-0.5">
            Manage categories — upload cover images, control order and visibility
          </p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError('') }}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#D4A017] text-[#0D0D0D] font-syndicatgrotesk text-[10px] font-bold tracking-[0.22em] uppercase hover:bg-[#B8860B] transition-colors"
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
            <path d={showForm ? 'M18 6L6 18M6 6l12 12' : 'M12 5v14M5 12h14'} />
          </svg>
          {showForm ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white border border-[#E8E0D5] p-6 shadow-sm">
          <p className="font-syndicatgrotesk text-[10px] tracking-[0.25em] uppercase text-[#8A7A6A] mb-4">New Category</p>
          <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Category name e.g. Bangles"
                value={form.name}
                onChange={e => setForm({ name: e.target.value, slug: slugify(e.target.value) })}
                className="w-full px-3 py-2.5 border border-[#E8E0D5] font-syndicatgrotesk text-sm text-[#1A1A1A] placeholder-[#C4B49A] outline-none focus:border-[#D4A017] transition-colors bg-[#FDFCFA]"
              />
              {form.slug && (
                <p className="font-syndicatgrotesk text-[10px] text-[#C4B49A] mt-1 ml-1">
                  Slug: <span className="font-mono text-[#8A7A6A]">{form.slug}</span>
                </p>
              )}
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Slug (auto-generated)"
                value={form.slug}
                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                className="w-full px-3 py-2.5 border border-[#E8E0D5] font-mono text-sm text-[#1A1A1A] placeholder-[#C4B49A] outline-none focus:border-[#D4A017] transition-colors bg-[#FDFCFA]"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#D4A017] text-[#0D0D0D] font-syndicatgrotesk text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#B8860B] disabled:opacity-50 transition-colors"
            >
              {saving ? '…' : 'Create'}
            </button>
          </form>
          {error && <p className="mt-2 font-syndicatgrotesk text-xs text-red-500">{error}</p>}
        </div>
      )}

      {/* Info banner */}
      <div className="border-l-4 border-[#D4A017] bg-[#D4A017]/5 px-4 py-3">
        <p className="font-syndicatgrotesk text-[11px] text-[#8A7A6A] leading-relaxed">
          <strong className="text-[#B8860B]">Tip:</strong> Use ↑↓ arrows to control display order on the home page.
          Upload a cover image for each category — images are automatically cropped to portrait (3:4) ratio to match the category grid.
        </p>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E8E0D5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-[#FAF7F2] border-b border-[#E8E0D5]">
              <tr>
                {['Order', 'Cover Image', 'Category Name', 'Slug', 'Visible', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-syndicatgrotesk text-[9px] tracking-[0.22em] uppercase text-[#8A7A6A] font-semibold whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((cat, i) => (
                <tr
                  key={cat.id}
                  className={`border-b border-[#F0EBE1] hover:bg-[#FAF7F2] transition-colors ${i % 2 === 0 ? '' : 'bg-[#FDFCFA]'}`}
                >
                  {/* Sort order */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <button
                        disabled={i === 0}
                        onClick={() => handleReorder(cat.id, 'up')}
                        className="w-6 h-6 flex items-center justify-center border border-[#E8E0D5] text-[#C4B49A] hover:border-[#D4A017] hover:text-[#D4A017] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <span className="font-syndicatgrotesk text-[9px] text-[#C4B49A] text-center">{i + 1}</span>
                      <button
                        disabled={i === sorted.length - 1}
                        onClick={() => handleReorder(cat.id, 'down')}
                        className="w-6 h-6 flex items-center justify-center border border-[#E8E0D5] text-[#C4B49A] hover:border-[#D4A017] hover:text-[#D4A017] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs"
                        title="Move down"
                      >
                        ↓
                      </button>
                    </div>
                  </td>

                  {/* Cover image */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="relative shrink-0 bg-[#F0EBE1] border border-[#E8E0D5] overflow-hidden cursor-pointer group"
                        style={{ width: 42, height: 56 }}
                        onClick={() => triggerImageUpload(cat.id)}
                        title="Click to upload / change image"
                      >
                        {cat.image ? (
                          <>
                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                              <svg className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m-6 6l-1.5 6 6-1.5L21 6a2.121 2.121 0 00-3-3L9 13z" />
                              </svg>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-0.5">
                            {uploadingId === cat.id ? (
                              <span className="w-2 h-2 rounded-full bg-[#D4A017] animate-pulse" />
                            ) : (
                              <>
                                <svg className="w-4 h-4 text-[#C4B49A] group-hover:text-[#D4A017] transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                </svg>
                                <span className="font-syndicatgrotesk text-[7px] tracking-wide uppercase text-[#C4B49A] group-hover:text-[#D4A017] transition-colors leading-none">
                                  Add
                                </span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      {cat.image && (
                        <button
                          onClick={() => handleRemoveImage(cat.id)}
                          className="text-[#C4B49A] hover:text-red-400 transition-colors"
                          title="Remove image"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Name */}
                  <td className="px-4 py-3">
                    {editingId === cat.id ? (
                      <input
                        value={editForm.name}
                        onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                        className="px-2 py-1.5 border border-[#D4A017] font-brandon text-sm text-[#1A1A1A] outline-none w-40 bg-[#FFFDF9]"
                        autoFocus
                      />
                    ) : (
                      <a
                        href={`/category/${cat.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-brandon text-sm font-black text-[#1A1A1A] hover:text-[#D4A017] transition-colors group flex items-center gap-1.5"
                      >
                        {cat.name}
                        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="opacity-0 group-hover:opacity-60 transition-opacity">
                          <path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        </svg>
                      </a>
                    )}
                  </td>

                  {/* Slug */}
                  <td className="px-4 py-3">
                    {editingId === cat.id ? (
                      <input
                        value={editForm.slug}
                        onChange={e => setEditForm(f => ({ ...f, slug: e.target.value }))}
                        className="px-2 py-1.5 border border-[#D4A017] font-mono text-[11px] text-[#1A1A1A] outline-none w-36 bg-[#FFFDF9]"
                      />
                    ) : (
                      <span className="font-mono text-[11px] text-[#8A7A6A]">/{cat.slug}</span>
                    )}
                  </td>

                  {/* Toggle */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggle(cat.id, cat.is_active)}
                        className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-200 ${cat.is_active ? 'bg-[#D4A017]' : 'bg-[#E8E0D5]'}`}
                        role="switch"
                        aria-checked={cat.is_active}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${cat.is_active ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                      </button>
                      <span className={`font-syndicatgrotesk text-[9px] tracking-wider uppercase font-semibold ${cat.is_active ? 'text-[#D4A017]' : 'text-[#C4B49A]'}`}>
                        {cat.is_active ? 'On' : 'Off'}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {editingId === cat.id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(cat.id)}
                            disabled={saving}
                            className="font-syndicatgrotesk text-[10px] tracking-[0.1em] uppercase text-green-600 hover:text-green-800 font-semibold disabled:opacity-40 transition-colors"
                          >
                            {saving ? '…' : 'Save'}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="font-syndicatgrotesk text-[10px] tracking-[0.1em] uppercase text-[#C4B49A] hover:text-[#8A7A6A] transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => { setEditingId(cat.id); setEditForm({ name: cat.name, slug: cat.slug }) }}
                            className="font-syndicatgrotesk text-[10px] tracking-[0.1em] uppercase text-[#D4A017] hover:text-[#B8860B] font-semibold transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => triggerImageUpload(cat.id)}
                            disabled={uploadingId === cat.id}
                            className="font-syndicatgrotesk text-[10px] tracking-[0.1em] uppercase text-[#8A7A6A] hover:text-[#1A1A1A] font-semibold disabled:opacity-40 transition-colors"
                          >
                            {uploadingId === cat.id ? 'Uploading…' : 'Image'}
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id, cat.name)}
                            disabled={deletingId === cat.id}
                            className="font-syndicatgrotesk text-[10px] tracking-[0.1em] uppercase text-red-400 hover:text-red-600 font-semibold disabled:opacity-40 transition-colors"
                          >
                            {deletingId === cat.id ? '…' : 'Delete'}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-14 text-center font-syndicatgrotesk text-[11px] tracking-wider uppercase text-[#C4B49A]">
                    No categories yet — add your first one above
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supabase setup note */}
      <div className="border border-[#E8E0D5] bg-[#FDFCFA] px-5 py-4 text-[11px] font-syndicatgrotesk text-[#8A7A6A] space-y-1.5 leading-relaxed">
        <p className="font-semibold text-[#1A1A1A] tracking-wide uppercase text-[9px]">Supabase Setup Required</p>
        <p>Run this SQL in your Supabase project to enable images and ordering:</p>
        <pre className="bg-[#1A1A1A] text-[#D4A017] text-[10px] p-3 rounded overflow-x-auto mt-2 font-mono leading-relaxed">
{`ALTER TABLE categories ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS sort_order INTEGER;

-- Create storage bucket for category images
INSERT INTO storage.buckets (id, name, public)
VALUES ('categories', 'categories', true)
ON CONFLICT DO NOTHING;

-- Allow public read and admin write
CREATE POLICY "Public read categories" ON storage.objects
  FOR SELECT USING (bucket_id = 'categories');
CREATE POLICY "Admin upload categories" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'categories');
CREATE POLICY "Admin update categories" ON storage.objects
  FOR UPDATE USING (bucket_id = 'categories');
CREATE POLICY "Admin delete categories" ON storage.objects
  FOR DELETE USING (bucket_id = 'categories');`}
        </pre>
      </div>
    </div>
  )
}
