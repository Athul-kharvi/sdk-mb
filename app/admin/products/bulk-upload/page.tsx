'use client'

import { useState, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import * as XLSX from 'xlsx'
import JSZip from 'jszip'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────
interface RawRow {
  sku: string
  name: string
  description: string
  price: number
  original_price: number
  discount: number
  stock: number
  category: string
  brand: string
}

interface ProductRow extends RawRow {
  _id: string
  images: File[]
  thumbnailUrl: string
  errors: string[]
  warnings: string[]
  removed: boolean
}

type Step = 'upload' | 'validate' | 'preview' | 'importing' | 'done'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function uid() {
  return Math.random().toString(36).slice(2)
}

function normaliseKey(k: string) {
  return k.toLowerCase().replace(/[\s_\-]+/g, '')
}

const KEY_MAP: Record<string, keyof RawRow> = {
  sku: 'sku',
  productname: 'name',
  name: 'name',
  description: 'description',
  desc: 'description',
  price: 'price',
  sellingprice: 'price',
  originalprice: 'original_price',
  mrp: 'original_price',
  discount: 'discount',
  discountpercent: 'discount',
  stockquantity: 'stock',
  stock: 'stock',
  qty: 'stock',
  quantity: 'stock',
  category: 'category',
  categoryname: 'category',
  brand: 'brand',
}

function mapRow(raw: Record<string, any>): RawRow {
  const out: any = {
    sku: '', name: '', description: '', price: 0,
    original_price: 0, discount: 0, stock: 0, category: '', brand: '',
  }
  for (const [k, v] of Object.entries(raw)) {
    const mapped = KEY_MAP[normaliseKey(k)]
    if (mapped) out[mapped] = v ?? ''
  }
  out.price = Number(out.price) || 0
  out.original_price = Number(out.original_price) || 0
  out.discount = Number(out.discount) || 0
  out.stock = Number(out.stock) || 0
  out.sku = String(out.sku).trim()
  out.name = String(out.name).trim()
  out.category = String(out.category).trim()
  out.brand = String(out.brand).trim()
  out.description = String(out.description).trim()
  return out
}

function validateRow(row: RawRow, skusSeen: Set<string>, zipFolders: Set<string>): { errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []

  if (!row.sku) errors.push('SKU is missing')
  if (!row.name) errors.push('Product name is missing')
  if (!row.price || row.price <= 0) errors.push('Invalid price')
  if (row.sku && skusSeen.has(row.sku)) errors.push('Duplicate SKU')
  if (row.sku) skusSeen.add(row.sku)

  if (row.sku && zipFolders.size > 0) {
    if (!zipFolders.has(row.sku)) warnings.push('No image folder found in ZIP')
  }
  if (!row.category) warnings.push('No category assigned')
  if (!row.stock) warnings.push('Stock is 0')

  return { errors, warnings }
}

// ─── Summary Card ─────────────────────────────────────────────────────────────
function SummaryCard({ icon, label, value, color }: { icon: string; label: string; value: number | string; color: string }) {
  return (
    <div className={`border ${color} bg-white p-4 flex items-center gap-4`}>
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="font-brandon text-xl font-black text-[#1A1A1A]">{value}</p>
        <p className="font-syndicatgrotesk text-[10px] tracking-[0.2em] uppercase text-[#8A7A6A]">{label}</p>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BulkUploadPage() {
  const [step, setStep] = useState<Step>('upload')
  const [rows, setRows] = useState<ProductRow[]>([])
  const [zipFolders, setZipFolders] = useState<Map<string, File[]>>(new Map())
  const [importResults, setImportResults] = useState<{ succeeded: number; failed: { sku: string; error: string }[] } | null>(null)
  const [importProgress, setImportProgress] = useState(0)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editBuf, setEditBuf] = useState<Partial<RawRow>>({})
  const [xlsxReady, setXlsxReady] = useState(false)
  const [zipReady, setZipReady] = useState(false)
  const [parseError, setParseError] = useState('')
  const xlsxRef = useRef<HTMLInputElement>(null)
  const zipRef = useRef<HTMLInputElement>(null)

  // Parsed but not yet validated
  const [parsedRows, setParsedRows] = useState<RawRow[]>([])
  const [parsedZip, setParsedZip] = useState<Map<string, File[]>>(new Map())

  // ── Parse Excel ──
  const handleXlsx = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setParseError('')
    try {
      const buf = await file.arrayBuffer()
      const wb = XLSX.read(buf, { type: 'array' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const raw: Record<string, any>[] = XLSX.utils.sheet_to_json(ws, { defval: '' })
      if (raw.length === 0) { setParseError('Excel file is empty or has no data rows'); return }
      setParsedRows(raw.map(mapRow))
      setXlsxReady(true)
    } catch {
      setParseError('Could not read Excel file. Make sure it is a valid .xlsx file.')
    }
    e.target.value = ''
  }, [])

  // ── Parse ZIP ──
  const handleZip = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setParseError('')
    try {
      const zip = await JSZip.loadAsync(await file.arrayBuffer())
      const folderMap = new Map<string, File[]>()
      const promises: Promise<void>[] = []

      zip.forEach((relativePath, zipEntry) => {
        if (zipEntry.dir) return
        const parts = relativePath.split('/')
        if (parts.length < 2) return
        const folder = parts[0]
        const fileName = parts[parts.length - 1]
        if (!/\.(jpe?g|png|webp)$/i.test(fileName)) return

        const p = zipEntry.async('blob').then(blob => {
          const imgFile = new File([blob], fileName, { type: blob.type || 'image/jpeg' })
          if (!folderMap.has(folder)) folderMap.set(folder, [])
          folderMap.get(folder)!.push(imgFile)
        })
        promises.push(p)
      })
      await Promise.all(promises)
      setParsedZip(folderMap)
      setZipReady(true)
    } catch {
      setParseError('Could not read ZIP file.')
    }
    e.target.value = ''
  }, [])

  // ── Run Validation ──
  const handleValidate = () => {
    if (!xlsxReady) { setParseError('Please upload an Excel file first'); return }
    setParseError('')

    const skusSeen = new Set<string>()
    const zipFolderKeys = new Set(parsedZip.keys())
    const validated: ProductRow[] = parsedRows.map(raw => {
      const { errors, warnings } = validateRow(raw, skusSeen, zipFolderKeys)
      const images = parsedZip.get(raw.sku) ?? []
      if (images.length > 0 && images.length < 3) warnings.push(`Only ${images.length} image(s) (recommended: 3+)`)
      const thumbnailUrl = images.length > 0 ? URL.createObjectURL(images[0]) : ''
      return { ...raw, _id: uid(), images, thumbnailUrl, errors, warnings, removed: false }
    })
    setRows(validated)
    setZipFolders(parsedZip)
    setStep('validate')
  }

  // ── Summary counts ──
  const active = rows.filter(r => !r.removed)
  const withErrors = active.filter(r => r.errors.length > 0)
  const withWarnings = active.filter(r => r.warnings.length > 0)
  const totalImages = active.reduce((sum, r) => sum + r.images.length, 0)

  // ── Edit row ──
  const startEdit = (row: ProductRow) => {
    setEditingId(row._id)
    setEditBuf({ sku: row.sku, name: row.name, description: row.description, price: row.price, original_price: row.original_price, discount: row.discount, stock: row.stock, category: row.category, brand: row.brand })
  }

  const saveEdit = (id: string) => {
    setRows(prev => prev.map(r => {
      if (r._id !== id) return r
      const updated = { ...r, ...editBuf } as ProductRow
      // Re-validate
      const skusSeen = new Set<string>()
      rows.filter(x => x._id !== id && !x.removed).forEach(x => skusSeen.add(x.sku))
      const { errors, warnings } = validateRow(updated, skusSeen, new Set(zipFolders.keys()))
      if (updated.images.length > 0 && updated.images.length < 3) warnings.push(`Only ${updated.images.length} image(s)`)
      return { ...updated, errors, warnings }
    }))
    setEditingId(null)
  }

  const removeRow = (id: string) => setRows(prev => prev.map(r => r._id === id ? { ...r, removed: true } : r))

  // ── Import ──
  const handleImport = async () => {
    const token = (await supabase.auth.getSession()).data.session?.access_token ?? ''
    const toImport = active.filter(r => r.errors.length === 0)
    if (toImport.length === 0) return

    setStep('importing')
    setImportProgress(0)

    // Upload images first — batch upload to Supabase storage
    const withUrls: (ProductRow & { uploadedUrls: string[] })[] = []
    for (let i = 0; i < toImport.length; i++) {
      const row = toImport[i]
      const urls: string[] = []
      for (let j = 0; j < row.images.length; j++) {
        const file = row.images[j]
        const ext = file.name.split('.').pop() ?? 'jpg'
        const path = `public/${row.sku}-${j + 1}-${Date.now()}.${ext}`
        const { error } = await supabase.storage.from('products').upload(path, file, { upsert: true })
        if (!error) {
          const { data } = supabase.storage.from('products').getPublicUrl(path)
          urls.push(data.publicUrl)
        }
      }
      withUrls.push({ ...row, uploadedUrls: urls })
      setImportProgress(Math.round(((i + 1) / toImport.length) * 50))
    }

    // Send to API
    const payload = withUrls.map(r => ({
      sku: r.sku,
      name: r.name,
      description: r.description,
      price: r.price,
      original_price: r.original_price || undefined,
      discount: r.discount || undefined,
      stock: r.stock,
      category_name: r.category,
      brand: r.brand || undefined,
      images: r.uploadedUrls,
    }))

    const res = await fetch('/api/admin/products/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ products: payload }),
    })
    setImportProgress(100)
    const result = await res.json()
    setImportResults({ succeeded: result.succeeded ?? 0, failed: result.failed ?? [] })
    setStep('done')
  }

  // ── Download template ──
  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ['SKU', 'Product Name', 'Description', 'Price', 'Original Price', 'Discount', 'Stock Quantity', 'Category', 'Brand'],
      ['PRD001', 'Gold Bangle Set', 'Beautiful handcrafted bangles', 1299, 1599, 10, 50, 'Bangles', 'Vinayak'],
      ['PRD002', 'Classic Earrings', 'Elegant daily wear earrings', 899, 1099, 0, 30, 'Earrings', 'Vinayak'],
    ])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Products')
    XLSX.writeFile(wb, 'bulk-upload-template.xlsx')
  }

  // ─── RENDER ────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 lg:p-8 space-y-6 min-h-screen">

      {/* Breadcrumb + header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin" className="font-syndicatgrotesk text-[10px] tracking-[0.15em] uppercase text-[#C4B49A] hover:text-[#D4A017] transition-colors">Dashboard</Link>
            <span className="text-[#C4B49A] text-xs">/</span>
            <span className="font-syndicatgrotesk text-[10px] tracking-[0.15em] uppercase text-[#8A7A6A]">Bulk Upload</span>
          </div>
          <h1 className="font-brandon text-2xl font-black uppercase tracking-tight text-[#1A1A1A]">Bulk Product Upload</h1>
          <p className="font-syndicatgrotesk text-[11px] tracking-[0.12em] text-[#8A7A6A] mt-0.5">Upload Excel + ZIP to import multiple products at once</p>
        </div>
        <button
          onClick={downloadTemplate}
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#E8E0D5] bg-white font-syndicatgrotesk text-[10px] tracking-[0.18em] uppercase text-[#8A7A6A] hover:border-[#D4A017] hover:text-[#D4A017] transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Template
        </button>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0">
        {(['upload', 'validate', 'preview', 'done'] as const).map((s, i) => {
          const labels = ['Upload Files', 'Validation', 'Preview & Edit', 'Done']
          const stepIndex = ['upload', 'validate', 'preview', 'importing', 'done'].indexOf(step)
          const thisIndex = ['upload', 'validate', 'preview', 'done'].indexOf(s)
          const done = stepIndex > thisIndex || (s === 'done' && step === 'done')
          const active = s === step || (s === 'preview' && step === 'importing')
          return (
            <div key={s} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 border font-syndicatgrotesk text-[9px] tracking-[0.2em] uppercase transition-colors
                ${done ? 'border-[#D4A017] bg-[#D4A017]/10 text-[#D4A017]' :
                  active ? 'border-[#D4A017] bg-[#D4A017] text-[#0D0D0D]' :
                  'border-[#E8E0D5] bg-white text-[#C4B49A]'}`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black
                  ${done ? 'bg-[#D4A017] text-white' : active ? 'bg-[#0D0D0D] text-white' : 'bg-[#E8E0D5] text-[#C4B49A]'}`}>
                  {done ? '✓' : i + 1}
                </span>
                {labels[i]}
              </div>
              {i < 3 && <div className="w-4 h-px bg-[#E8E0D5]" />}
            </div>
          )
        })}
      </div>

      {/* ── STEP 1: Upload ─────────────────────────────────────────────────── */}
      {step === 'upload' && (
        <div className="space-y-5">

          {parseError && (
            <div className="border border-red-200 bg-red-50 px-4 py-3 font-syndicatgrotesk text-xs text-red-600">
              {parseError}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-5">

            {/* Excel upload */}
            <div className="bg-white border border-[#E8E0D5] p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-brandon text-sm font-black uppercase tracking-tight text-[#1A1A1A]">Excel File</p>
                  <p className="font-syndicatgrotesk text-[9px] tracking-[0.15em] uppercase text-[#8A7A6A]">.xlsx format required</p>
                </div>
                {xlsxReady && (
                  <span className="ml-auto font-syndicatgrotesk text-[9px] tracking-[0.2em] uppercase text-green-600 bg-green-50 border border-green-200 px-2 py-1">
                    ✓ {parsedRows.length} rows
                  </span>
                )}
              </div>

              <div
                onClick={() => xlsxRef.current?.click()}
                className="relative border-2 border-dashed border-[#E8E0D5] hover:border-[#D4A017] transition-colors cursor-pointer bg-[#FDFCFA] p-8 flex flex-col items-center gap-2"
              >
                <input ref={xlsxRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleXlsx} />
                <svg className="w-8 h-8 text-[#C4B49A]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <p className="font-syndicatgrotesk text-xs text-[#8A7A6A]">Click to select Excel file</p>
              </div>

              <div className="bg-[#FAF7F2] border border-[#E8E0D5] px-4 py-3 space-y-1">
                <p className="font-syndicatgrotesk text-[9px] tracking-[0.2em] uppercase text-[#8A7A6A] font-semibold">Required Columns</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {['SKU', 'Product Name', 'Price', 'Category'].map(c => (
                    <span key={c} className="font-mono text-[9px] bg-[#D4A017]/10 text-[#B8860B] px-1.5 py-0.5 border border-[#D4A017]/20">{c}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {['Description', 'Original Price', 'Discount', 'Stock', 'Brand'].map(c => (
                    <span key={c} className="font-mono text-[9px] bg-[#FAF7F2] text-[#8A7A6A] px-1.5 py-0.5 border border-[#E8E0D5]">{c} <span className="text-[#C4B49A]">optional</span></span>
                  ))}
                </div>
              </div>
            </div>

            {/* ZIP upload */}
            <div className="bg-white border border-[#E8E0D5] p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-amber-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </div>
                <div>
                  <p className="font-brandon text-sm font-black uppercase tracking-tight text-[#1A1A1A]">Images ZIP</p>
                  <p className="font-syndicatgrotesk text-[9px] tracking-[0.15em] uppercase text-[#8A7A6A]">.zip · optional but recommended</p>
                </div>
                {zipReady && (
                  <span className="ml-auto font-syndicatgrotesk text-[9px] tracking-[0.2em] uppercase text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1">
                    ✓ {parsedZip.size} folders
                  </span>
                )}
              </div>

              <div
                onClick={() => zipRef.current?.click()}
                className="relative border-2 border-dashed border-[#E8E0D5] hover:border-[#D4A017] transition-colors cursor-pointer bg-[#FDFCFA] p-8 flex flex-col items-center gap-2"
              >
                <input ref={zipRef} type="file" accept=".zip" className="hidden" onChange={handleZip} />
                <svg className="w-8 h-8 text-[#C4B49A]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <p className="font-syndicatgrotesk text-xs text-[#8A7A6A]">Click to select ZIP file</p>
              </div>

              <div className="bg-[#FAF7F2] border border-[#E8E0D5] px-4 py-3">
                <p className="font-syndicatgrotesk text-[9px] tracking-[0.2em] uppercase text-[#8A7A6A] font-semibold mb-2">ZIP structure</p>
                <pre className="font-mono text-[10px] text-[#8A7A6A] leading-relaxed">{`product_images.zip
  PRD001/
    1.jpg  2.jpg  3.jpg
  PRD002/
    1.jpg  2.jpg`}</pre>
                <p className="font-syndicatgrotesk text-[9px] text-[#C4B49A] mt-2">Folder name must match SKU exactly</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleValidate}
              disabled={!xlsxReady}
              className="px-8 py-3 bg-[#D4A017] text-[#0D0D0D] font-syndicatgrotesk text-[10px] font-bold tracking-[0.25em] uppercase hover:bg-[#B8860B] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Validate & Continue →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Validation report ─────────────────────────────────────── */}
      {step === 'validate' && (
        <div className="space-y-5">

          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <SummaryCard icon="✓" label="Products Found" value={active.length} color="border-green-200" />
            <SummaryCard icon="🖼" label="Images Found" value={totalImages} color="border-blue-200" />
            <SummaryCard icon="⚠" label="Validation Errors" value={withErrors.length} color={withErrors.length ? 'border-red-300' : 'border-green-200'} />
            <SummaryCard icon="⚡" label="Warnings" value={withWarnings.length} color={withWarnings.length ? 'border-amber-300' : 'border-green-200'} />
          </div>

          {/* Per-row errors */}
          {withErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 p-4 space-y-2">
              <p className="font-brandon text-sm font-black uppercase tracking-tight text-red-700">Errors — These rows will be skipped on import</p>
              {withErrors.map(r => (
                <div key={r._id} className="flex items-start gap-3 font-syndicatgrotesk text-xs text-red-600">
                  <span className="font-mono bg-red-100 px-1.5 py-0.5 shrink-0">{r.sku || '(no sku)'}</span>
                  <span>{r.errors.join(' · ')}</span>
                </div>
              ))}
            </div>
          )}

          {withWarnings.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 p-4 space-y-2">
              <p className="font-brandon text-sm font-black uppercase tracking-tight text-amber-700">Warnings — These rows will still import</p>
              {withWarnings.filter(r => r.warnings.length > 0).map(r => (
                <div key={r._id} className="flex items-start gap-3 font-syndicatgrotesk text-xs text-amber-700">
                  <span className="font-mono bg-amber-100 px-1.5 py-0.5 shrink-0">{r.sku}</span>
                  <span>{r.warnings.join(' · ')}</span>
                </div>
              ))}
            </div>
          )}

          {active.filter(r => r.errors.length === 0).length === 0 && (
            <div className="bg-red-50 border border-red-300 px-4 py-3 font-syndicatgrotesk text-sm text-red-700">
              All rows have errors. Fix the Excel file and re-upload.
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button onClick={() => setStep('upload')} className="px-6 py-2.5 border border-[#E8E0D5] font-syndicatgrotesk text-[10px] tracking-[0.2em] uppercase text-[#8A7A6A] hover:bg-[#FAF7F2] transition-colors">
              ← Re-upload
            </button>
            <button
              onClick={() => setStep('preview')}
              disabled={active.filter(r => r.errors.length === 0).length === 0}
              className="px-8 py-2.5 bg-[#D4A017] text-[#0D0D0D] font-syndicatgrotesk text-[10px] font-bold tracking-[0.25em] uppercase hover:bg-[#B8860B] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Preview Products ({active.filter(r => r.errors.length === 0).length}) →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Preview & Edit ─────────────────────────────────────────── */}
      {(step === 'preview' || step === 'importing') && (
        <div className="space-y-5">

          {step === 'importing' && (
            <div className="bg-[#1A1A1A] text-white px-6 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-syndicatgrotesk text-[11px] tracking-[0.2em] uppercase text-[#D4A017]">
                  {importProgress < 50 ? 'Uploading images…' : 'Creating products…'}
                </p>
                <p className="font-brandon text-sm font-black text-white">{importProgress}%</p>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#D4A017] transition-all duration-300" style={{ width: `${importProgress}%` }} />
              </div>
            </div>
          )}

          <div className="bg-white border border-[#E8E0D5] overflow-hidden">
            <div className="bg-[#FAF7F2] border-b border-[#E8E0D5] px-5 py-3 flex items-center justify-between">
              <p className="font-brandon text-sm font-black uppercase tracking-tight text-[#1A1A1A]">
                {active.filter(r => !r.removed).length} Products to Import
              </p>
              <p className="font-syndicatgrotesk text-[9px] tracking-[0.2em] uppercase text-[#8A7A6A]">
                {active.filter(r => r.errors.length > 0).length > 0 &&
                  `${active.filter(r => r.errors.length > 0).length} rows with errors will be skipped`}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="border-b border-[#E8E0D5] bg-[#FDFCFA]">
                  <tr>
                    {['', 'Thumb', 'SKU', 'Product Name', 'Category', 'Price', 'Orig. Price', 'Stock', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-3 py-2.5 text-left font-syndicatgrotesk text-[8px] tracking-[0.22em] uppercase text-[#8A7A6A] whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.filter(r => !r.removed).map((row, i) => {
                    const isEditing = editingId === row._id
                    const hasError = row.errors.length > 0
                    return (
                      <tr key={row._id} className={`border-b border-[#F0EBE1] text-sm ${hasError ? 'bg-red-50/40' : i % 2 === 0 ? '' : 'bg-[#FDFCFA]'}`}>
                        {/* Row # */}
                        <td className="px-3 py-2 font-syndicatgrotesk text-[9px] text-[#C4B49A]">{i + 1}</td>

                        {/* Thumbnail */}
                        <td className="px-3 py-2">
                          {row.thumbnailUrl
                            ? <img src={row.thumbnailUrl} alt="" className="w-10 h-12 object-cover border border-[#E8E0D5]" />
                            : <div className="w-10 h-12 bg-[#F0EBE1] border border-[#E8E0D5] flex items-center justify-center">
                                <span className="text-[8px] text-[#C4B49A]">No img</span>
                              </div>
                          }
                        </td>

                        {/* SKU */}
                        <td className="px-3 py-2">
                          {isEditing
                            ? <input value={editBuf.sku ?? ''} onChange={e => setEditBuf(b => ({ ...b, sku: e.target.value }))} className="w-20 px-1.5 py-1 border border-[#D4A017] font-mono text-xs outline-none" />
                            : <span className="font-mono text-[11px] text-[#8A7A6A]">{row.sku}</span>
                          }
                        </td>

                        {/* Name */}
                        <td className="px-3 py-2 max-w-[200px]">
                          {isEditing
                            ? <input value={editBuf.name ?? ''} onChange={e => setEditBuf(b => ({ ...b, name: e.target.value }))} className="w-full px-1.5 py-1 border border-[#D4A017] font-syndicatgrotesk text-xs outline-none" />
                            : <span className="font-syndicatgrotesk text-xs font-semibold text-[#1A1A1A] line-clamp-2">{row.name}</span>
                          }
                        </td>

                        {/* Category */}
                        <td className="px-3 py-2">
                          {isEditing
                            ? <input value={editBuf.category ?? ''} onChange={e => setEditBuf(b => ({ ...b, category: e.target.value }))} className="w-24 px-1.5 py-1 border border-[#D4A017] font-syndicatgrotesk text-xs outline-none" />
                            : <span className="font-syndicatgrotesk text-[10px] text-[#8A7A6A]">{row.category || '—'}</span>
                          }
                        </td>

                        {/* Price */}
                        <td className="px-3 py-2">
                          {isEditing
                            ? <input type="number" value={editBuf.price ?? 0} onChange={e => setEditBuf(b => ({ ...b, price: Number(e.target.value) }))} className="w-20 px-1.5 py-1 border border-[#D4A017] font-syndicatgrotesk text-xs outline-none" />
                            : <span className="font-brandon text-xs font-black text-[#1A1A1A]">₹{row.price}</span>
                          }
                        </td>

                        {/* Orig price */}
                        <td className="px-3 py-2">
                          {isEditing
                            ? <input type="number" value={editBuf.original_price ?? 0} onChange={e => setEditBuf(b => ({ ...b, original_price: Number(e.target.value) }))} className="w-20 px-1.5 py-1 border border-[#D4A017] font-syndicatgrotesk text-xs outline-none" />
                            : <span className="font-syndicatgrotesk text-[10px] text-[#C4B49A] line-through">{row.original_price ? `₹${row.original_price}` : '—'}</span>
                          }
                        </td>

                        {/* Stock */}
                        <td className="px-3 py-2">
                          {isEditing
                            ? <input type="number" value={editBuf.stock ?? 0} onChange={e => setEditBuf(b => ({ ...b, stock: Number(e.target.value) }))} className="w-16 px-1.5 py-1 border border-[#D4A017] font-syndicatgrotesk text-xs outline-none" />
                            : <span className="font-syndicatgrotesk text-xs text-[#8A7A6A]">{row.stock}</span>
                          }
                        </td>

                        {/* Status badge */}
                        <td className="px-3 py-2">
                          {hasError
                            ? <span className="inline-flex items-center gap-1 font-syndicatgrotesk text-[8px] tracking-wider uppercase text-red-600 bg-red-100 border border-red-200 px-2 py-0.5">
                                ✗ Error
                              </span>
                            : row.warnings.length > 0
                              ? <span className="inline-flex items-center gap-1 font-syndicatgrotesk text-[8px] tracking-wider uppercase text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5">
                                  ⚠ Warn
                                </span>
                              : <span className="inline-flex items-center gap-1 font-syndicatgrotesk text-[8px] tracking-wider uppercase text-green-700 bg-green-100 border border-green-200 px-2 py-0.5">
                                  ✓ Ready
                                </span>
                          }
                        </td>

                        {/* Actions */}
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            {isEditing ? (
                              <>
                                <button onClick={() => saveEdit(row._id)} className="font-syndicatgrotesk text-[9px] uppercase tracking-wider text-green-600 hover:text-green-800 font-semibold transition-colors">Save</button>
                                <button onClick={() => setEditingId(null)} className="font-syndicatgrotesk text-[9px] uppercase tracking-wider text-[#C4B49A] hover:text-[#8A7A6A] transition-colors">Cancel</button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => startEdit(row)} disabled={step === 'importing'} className="font-syndicatgrotesk text-[9px] uppercase tracking-wider text-[#D4A017] hover:text-[#B8860B] font-semibold disabled:opacity-40 transition-colors">Edit</button>
                                <button onClick={() => removeRow(row._id)} disabled={step === 'importing'} className="font-syndicatgrotesk text-[9px] uppercase tracking-wider text-red-400 hover:text-red-600 font-semibold disabled:opacity-40 transition-colors">Remove</button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-3 justify-between">
            <button
              onClick={() => setStep('validate')}
              disabled={step === 'importing'}
              className="px-6 py-2.5 border border-[#E8E0D5] font-syndicatgrotesk text-[10px] tracking-[0.2em] uppercase text-[#8A7A6A] hover:bg-[#FAF7F2] disabled:opacity-40 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleImport}
              disabled={step === 'importing' || rows.filter(r => !r.removed && r.errors.length === 0).length === 0}
              className="px-8 py-2.5 bg-[#D4A017] text-[#0D0D0D] font-syndicatgrotesk text-[10px] font-bold tracking-[0.25em] uppercase hover:bg-[#B8860B] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {step === 'importing'
                ? `Importing… ${importProgress}%`
                : `Import ${rows.filter(r => !r.removed && r.errors.length === 0).length} Products`
              }
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 4: Done ──────────────────────────────────────────────────── */}
      {step === 'done' && importResults && (
        <div className="space-y-5">
          <div className="bg-white border border-[#E8E0D5] p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-brandon text-3xl font-black uppercase text-[#1A1A1A]">{importResults.succeeded} Products Imported</p>
              {importResults.failed.length > 0 && (
                <p className="font-syndicatgrotesk text-sm text-red-600 mt-1">{importResults.failed.length} failed</p>
              )}
            </div>

            {importResults.failed.length > 0 && (
              <div className="text-left bg-red-50 border border-red-200 p-4 space-y-1.5 max-w-lg mx-auto">
                <p className="font-syndicatgrotesk text-[10px] tracking-[0.2em] uppercase text-red-700 font-semibold">Failed Products</p>
                {importResults.failed.map((f, i) => (
                  <div key={i} className="flex gap-2 font-syndicatgrotesk text-xs text-red-600">
                    <span className="font-mono">{f.sku}</span>
                    <span>— {f.error}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => { setStep('upload'); setRows([]); setXlsxReady(false); setZipReady(false); setParsedRows([]); setParsedZip(new Map()) }}
                className="px-6 py-2.5 border border-[#E8E0D5] font-syndicatgrotesk text-[10px] tracking-[0.2em] uppercase text-[#8A7A6A] hover:bg-[#FAF7F2] transition-colors"
              >
                Upload More
              </button>
              <Link
                href="/admin"
                className="px-6 py-2.5 bg-[#D4A017] text-[#0D0D0D] font-syndicatgrotesk text-[10px] font-bold tracking-[0.25em] uppercase hover:bg-[#B8860B] transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
