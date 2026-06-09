'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

// ─── Crop aspect ratios ───────────────────────────────────────────────────────
const ASPECTS = {
  desktop: 16 / 9,   // wide landscape hero
  mobile: 9 / 19.5,  // tall portrait mobile hero
}

interface CropBox { x: number; y: number; w: number; h: number }

function clamp(box: CropBox, dW: number, dH: number, aspect: number): CropBox {
  let { x, y, w, h } = box
  w = Math.max(40, Math.min(w, dW))
  h = w / aspect
  if (h > dH) { h = dH; w = h * aspect }
  x = Math.max(0, Math.min(x, dW - w))
  y = Math.max(0, Math.min(y, dH - h))
  return { x, y, w, h }
}

// ─── Crop Modal ───────────────────────────────────────────────────────────────
function CropModal({
  file, aspect, label,
  onConfirm, onCancel,
}: {
  file: File
  aspect: number
  label: string
  onConfirm: (blob: Blob) => void
  onCancel: () => void
}) {
  const [imgSrc, setImgSrc] = useState('')
  const [naturalW, setNaturalW] = useState(0)
  const [naturalH, setNaturalH] = useState(0)
  const [displayW, setDisplayW] = useState(0)
  const [displayH, setDisplayH] = useState(0)
  const [crop, setCrop] = useState<CropBox>({ x: 0, y: 0, w: 0, h: 0 })
  const [dragging, setDragging] = useState<null | 'move' | 'se' | 'sw' | 'ne' | 'nw'>(null)
  const dragStart = useRef({ mx: 0, my: 0, cx: 0, cy: 0, cw: 0, ch: 0 })
  const previewRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const url = URL.createObjectURL(file)
    setImgSrc(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const initCrop = useCallback((dW: number, dH: number) => {
    let cw = dW; let ch = cw / aspect
    if (ch > dH) { ch = dH; cw = ch * aspect }
    setCrop({ x: (dW - cw) / 2, y: (dH - ch) / 2, w: cw, h: ch })
  }, [aspect])

  const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    setNaturalW(img.naturalWidth); setNaturalH(img.naturalHeight)
    setDisplayW(img.clientWidth); setDisplayH(img.clientHeight)
    initCrop(img.clientWidth, img.clientHeight)
  }

  // Preview canvas
  useEffect(() => {
    const canvas = previewRef.current
    const img = document.querySelector<HTMLImageElement>('#hero-crop-img')
    if (!canvas || !img || !naturalW || !displayW) return
    const sx = naturalW / displayW; const sy = naturalH / displayH
    const outW = aspect >= 1 ? 240 : 120
    const outH = outW / aspect
    canvas.width = outW; canvas.height = outH
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, crop.x * sx, crop.y * sy, crop.w * sx, crop.h * sy, 0, 0, outW, outH)
  }, [crop, naturalW, naturalH, displayW, displayH, aspect])

  const onMouseDown = (e: React.MouseEvent, type: typeof dragging) => {
    e.preventDefault()
    setDragging(type)
    dragStart.current = { mx: e.clientX, my: e.clientY, cx: crop.x, cy: crop.y, cw: crop.w, ch: crop.h }
  }

  useEffect(() => {
    if (!dragging) return
    const onMove = (e: MouseEvent) => {
      const { mx, my, cx, cy, cw, ch } = dragStart.current
      const dx = e.clientX - mx; const dy = e.clientY - my
      let box: CropBox = { x: cx, y: cy, w: cw, h: ch }
      if (dragging === 'move') box = { x: cx + dx, y: cy + dy, w: cw, h: ch }
      else if (dragging === 'se') { const nw = cw + dx; box = { x: cx, y: cy, w: nw, h: nw / aspect } }
      else if (dragging === 'sw') { const nw = cw - dx; box = { x: cx + dx, y: cy, w: nw, h: nw / aspect } }
      else if (dragging === 'ne') { const nw = cw + dx; const nh = nw / aspect; box = { x: cx, y: cy + ch - nh, w: nw, h: nh } }
      else if (dragging === 'nw') { const nw = cw - dx; const nh = nw / aspect; box = { x: cx + dx, y: cy + ch - nh, w: nw, h: nh } }
      setCrop(clamp(box, displayW, displayH, aspect))
    }
    const onUp = () => setDragging(null)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [dragging, displayW, displayH, aspect])

  const handleConfirm = () => {
    const img = document.querySelector<HTMLImageElement>('#hero-crop-img')
    if (!img || !naturalW || !displayW) return
    const sx = naturalW / displayW; const sy = naturalH / displayH
    const outW = aspect >= 1 ? 1920 : 800
    const outH = outW / aspect
    const canvas = document.createElement('canvas')
    canvas.width = outW; canvas.height = outH
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, crop.x * sx, crop.y * sy, crop.w * sx, crop.h * sy, 0, 0, outW, outH)
    canvas.toBlob(blob => { if (blob) onConfirm(blob) }, 'image/jpeg', 0.90)
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-3xl shadow-2xl flex flex-col" style={{ maxHeight: '92vh' }}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8E0D5] flex items-center justify-between shrink-0">
          <div>
            <p className="font-brandon text-base font-black uppercase tracking-tight text-[#1A1A1A]">Crop {label} Hero Image</p>
            <p className="font-syndicatgrotesk text-[10px] text-[#8A7A6A] mt-0.5 tracking-wider">
              Drag box to move · corners to resize · ratio {label === 'Desktop' ? '16:9' : '9:19.5'}
            </p>
          </div>
          <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center border border-[#E8E0D5] text-[#8A7A6A] hover:border-[#D4A017] hover:text-[#D4A017] transition-colors text-lg">×</button>
        </div>

        {/* Canvas area */}
        <div className="flex-1 overflow-auto bg-[#111] flex items-center justify-center p-6 min-h-0">
          <div className="relative inline-block select-none">
            <img
              id="hero-crop-img"
              src={imgSrc}
              alt="crop"
              onLoad={handleImgLoad}
              style={{ display: 'block', maxWidth: '100%', maxHeight: '52vh', userSelect: 'none', pointerEvents: 'none' }}
            />
            {displayW > 0 && (
              <>
                {/* Dim outside */}
                <svg width={displayW} height={displayH} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
                  <defs>
                    <mask id="hcm">
                      <rect width={displayW} height={displayH} fill="white" />
                      <rect x={crop.x} y={crop.y} width={crop.w} height={crop.h} fill="black" />
                    </mask>
                  </defs>
                  <rect width={displayW} height={displayH} fill="rgba(0,0,0,0.6)" mask="url(#hcm)" />
                </svg>
                {/* Crop box */}
                <div
                  style={{ position: 'absolute', left: crop.x, top: crop.y, width: crop.w, height: crop.h, border: '2px solid #D4A017', boxSizing: 'border-box', cursor: 'move' }}
                  onMouseDown={e => onMouseDown(e, 'move')}
                >
                  {/* Rule of thirds */}
                  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(212,160,23,0.2) 1px,transparent 1px),linear-gradient(90deg,rgba(212,160,23,0.2) 1px,transparent 1px)', backgroundSize: `${crop.w / 3}px ${crop.h / 3}px` }} />
                  {(['nw', 'ne', 'sw', 'se'] as const).map(dir => (
                    <div key={dir} onMouseDown={e => { e.stopPropagation(); onMouseDown(e, dir) }}
                      style={{ position: 'absolute', width: 14, height: 14, background: '#D4A017', border: '2px solid white',
                        top: dir.includes('n') ? -7 : undefined, bottom: dir.includes('s') ? -7 : undefined,
                        left: dir.includes('w') ? -7 : undefined, right: dir.includes('e') ? -7 : undefined,
                        cursor: dir + '-resize' }} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E8E0D5] bg-[#FAF7F2] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <p className="font-syndicatgrotesk text-[9px] tracking-[0.3em] uppercase text-[#8A7A6A]">Preview</p>
            <canvas ref={previewRef} style={{ height: 48, width: aspect >= 1 ? 86 : 22, border: '1px solid #E8E0D5', background: '#F0EBE1' }} />
            <p className="font-syndicatgrotesk text-[9px] text-[#C4B49A]">{aspect >= 1 ? '1920×1080' : '800×1706'} px</p>
          </div>
          <div className="flex gap-3">
            <button onClick={onCancel} className="px-5 py-2.5 border border-[#E8E0D5] font-syndicatgrotesk text-[10px] tracking-[0.15em] uppercase text-[#8A7A6A] hover:border-[#C4B49A] transition-colors">Cancel</button>
            <button onClick={handleConfirm} className="px-6 py-2.5 bg-[#D4A017] text-[#0D0D0D] font-syndicatgrotesk text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#B8860B] transition-colors">Use This Crop</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Image Upload Card ────────────────────────────────────────────────────────
function HeroImageCard({
  type, label, aspectLabel, currentUrl, uploading, onUpload,
}: {
  type: 'desktop' | 'mobile'
  label: string
  aspectLabel: string
  currentUrl: string | null
  uploading: boolean
  onUpload: (type: 'desktop' | 'mobile') => void
}) {
  return (
    <div className="bg-white border border-[#E8E0D5] p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 flex items-center justify-center ${type === 'desktop' ? 'bg-blue-100' : 'bg-purple-100'}`}>
          {type === 'desktop' ? (
            <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" />
            </svg>
          )}
        </div>
        <div>
          <p className="font-brandon text-sm font-black uppercase tracking-tight text-[#1A1A1A]">{label}</p>
          <p className="font-syndicatgrotesk text-[9px] tracking-[0.2em] uppercase text-[#8A7A6A]">{aspectLabel}</p>
        </div>
        {currentUrl && (
          <span className="ml-auto font-syndicatgrotesk text-[9px] tracking-[0.2em] uppercase text-green-600 bg-green-50 border border-green-200 px-2 py-1">✓ Uploaded</span>
        )}
      </div>

      {/* Current image preview */}
      {currentUrl && (
        <div className={`relative overflow-hidden border border-[#E8E0D5] bg-[#F0EBE1] ${type === 'desktop' ? 'aspect-video' : 'aspect-[9/19.5] max-w-[120px]'}`}>
          <img src={currentUrl} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors" />
        </div>
      )}

      {!currentUrl && (
        <div className={`border-2 border-dashed border-[#E8E0D5] bg-[#FDFCFA] flex flex-col items-center justify-center gap-2 ${type === 'desktop' ? 'aspect-video' : 'aspect-[9/19.5] max-w-[120px]'}`}>
          <svg className="w-7 h-7 text-[#C4B49A]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
          </svg>
          <p className="font-syndicatgrotesk text-[9px] text-[#C4B49A] tracking-wider text-center px-2">No image set</p>
        </div>
      )}

      <button
        onClick={() => onUpload(type)}
        disabled={uploading}
        className="w-full py-2.5 bg-[#D4A017] text-[#0D0D0D] font-syndicatgrotesk text-[10px] font-bold tracking-[0.22em] uppercase hover:bg-[#B8860B] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        {uploading ? (
          <>
            <span className="w-3 h-3 rounded-full border-2 border-[#0D0D0D]/30 border-t-[#0D0D0D] animate-spin" />
            Uploading…
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            {currentUrl ? 'Change Image' : 'Upload Image'}
          </>
        )}
      </button>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminHeroPage() {
  const [desktopUrl, setDesktopUrl] = useState<string | null>(null)
  const [mobileUrl, setMobileUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<'desktop' | 'mobile' | null>(null)
  const [toast, setToast] = useState('')

  // Crop state
  const [cropFile, setCropFile] = useState<File | null>(null)
  const [cropType, setCropType] = useState<'desktop' | 'mobile' | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const pendingType = useRef<'desktop' | 'mobile'>('desktop')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const getToken = async () => (await supabase.auth.getSession()).data.session?.access_token ?? ''

  // Load current hero settings
  useEffect(() => {
    fetch('/api/admin/hero').then(r => r.json()).then(({ data }) => {
      if (data) { setDesktopUrl(data.desktop ?? null); setMobileUrl(data.mobile ?? null) }
      setLoading(false)
    })
  }, [])

  const triggerUpload = (type: 'desktop' | 'mobile') => {
    pendingType.current = type
    fileRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCropFile(file)
    setCropType(pendingType.current)
    e.target.value = ''
  }

  const handleCropConfirm = async (blob: Blob) => {
    const type = cropType!
    setCropFile(null); setCropType(null)
    setUploading(type)

    try {
      const token = await getToken()
      const fileName = `hero-${type}-${Date.now()}.jpg`
      const { error: uploadErr } = await supabase.storage
        .from('hero')
        .upload(fileName, blob, { contentType: 'image/jpeg', upsert: true })

      if (uploadErr) { showToast(`Upload failed: ${uploadErr.message}`); return }

      const { data: urlData } = supabase.storage.from('hero').getPublicUrl(fileName)
      const url = urlData.publicUrl

      // Save to DB
      const newDesktop = type === 'desktop' ? url : desktopUrl
      const newMobile = type === 'mobile' ? url : mobileUrl
      const res = await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ desktop: newDesktop, mobile: newMobile }),
      })

      if (res.ok) {
        if (type === 'desktop') setDesktopUrl(url)
        else setMobileUrl(url)
        showToast(`${type === 'desktop' ? 'Desktop' : 'Mobile'} hero image updated!`)
      } else {
        showToast('Failed to save — check Supabase settings')
      }
    } finally {
      setUploading(null)
    }
  }

  // Use desktop image for both
  const handleUseDeskopForBoth = async () => {
    if (!desktopUrl) return
    setSaving(true)
    const token = await getToken()
    const res = await fetch('/api/admin/hero', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ desktop: desktopUrl, mobile: desktopUrl }),
    })
    if (res.ok) { setMobileUrl(desktopUrl); showToast('Desktop image applied to both') }
    setSaving(false)
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

  return (
    <div className="p-6 lg:p-8 space-y-6">

      {/* Hidden file input */}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      {/* Crop modal */}
      {cropFile && cropType && (
        <CropModal
          file={cropFile}
          aspect={ASPECTS[cropType]}
          label={cropType === 'desktop' ? 'Desktop' : 'Mobile'}
          onConfirm={handleCropConfirm}
          onCancel={() => { setCropFile(null); setCropType(null) }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1A1A1A] text-[#D4A017] px-6 py-3 font-syndicatgrotesk text-[11px] tracking-[0.18em] uppercase shadow-xl">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin" className="font-syndicatgrotesk text-[10px] tracking-[0.15em] uppercase text-[#C4B49A] hover:text-[#D4A017] transition-colors">Dashboard</Link>
            <span className="text-[#C4B49A] text-xs">/</span>
            <span className="font-syndicatgrotesk text-[10px] tracking-[0.15em] uppercase text-[#8A7A6A]">Hero Image</span>
          </div>
          <h1 className="font-brandon text-2xl font-black uppercase tracking-tight text-[#1A1A1A]">Hero Image</h1>
          <p className="font-syndicatgrotesk text-[11px] tracking-[0.12em] text-[#8A7A6A] mt-0.5">
            Upload and crop the hero banner shown on the home page
          </p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#E8E0D5] font-syndicatgrotesk text-[10px] tracking-[0.18em] uppercase text-[#8A7A6A] hover:border-[#D4A017] hover:text-[#D4A017] transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
          </svg>
          Preview Store
        </a>
      </div>

      {/* Info banner */}
      <div className="border-l-4 border-[#D4A017] bg-[#D4A017]/5 px-4 py-3">
        <p className="font-syndicatgrotesk text-[11px] text-[#8A7A6A] leading-relaxed">
          <strong className="text-[#B8860B]">Desktop</strong> image uses 16:9 ratio (landscape) ·
          <strong className="text-[#B8860B]"> Mobile</strong> image uses 9:19.5 ratio (portrait) ·
          You can upload separate images or use the desktop image for both.
        </p>
      </div>

      {/* Upload cards */}
      <div className="grid sm:grid-cols-2 gap-5">
        <HeroImageCard
          type="desktop"
          label="Desktop Image"
          aspectLabel="16:9 · 1920×1080px"
          currentUrl={desktopUrl}
          uploading={uploading === 'desktop'}
          onUpload={triggerUpload}
        />
        <HeroImageCard
          type="mobile"
          label="Mobile Image"
          aspectLabel="9:19.5 portrait · 800×1706px"
          currentUrl={mobileUrl}
          uploading={uploading === 'mobile'}
          onUpload={triggerUpload}
        />
      </div>

      {/* Use desktop for both */}
      {desktopUrl && (
        <div className="flex items-center gap-4 bg-white border border-[#E8E0D5] px-5 py-4">
          <div>
            <p className="font-brandon text-sm font-black uppercase tracking-tight text-[#1A1A1A]">Use desktop image for both</p>
            <p className="font-syndicatgrotesk text-[10px] text-[#8A7A6A] mt-0.5">
              Sets the mobile hero to the same image as desktop — good if your image works for both screens.
            </p>
          </div>
          <button
            onClick={handleUseDeskopForBoth}
            disabled={saving}
            className="ml-auto shrink-0 px-5 py-2.5 border border-[#D4A017] text-[#D4A017] font-syndicatgrotesk text-[10px] font-bold tracking-[0.18em] uppercase hover:bg-[#D4A017] hover:text-[#0D0D0D] disabled:opacity-50 transition-colors"
          >
            {saving ? '…' : 'Apply to Both'}
          </button>
        </div>
      )}

      {/* SQL note */}
      <div className="border border-[#E8E0D5] bg-[#FDFCFA] px-5 py-4 space-y-2">
        <p className="font-syndicatgrotesk text-[9px] tracking-[0.2em] uppercase text-[#1A1A1A] font-semibold">Supabase Setup Required (one-time)</p>
        <pre className="font-mono text-[10px] text-[#D4A017] bg-[#1A1A1A] p-3 overflow-x-auto leading-relaxed rounded">
{`-- Settings table
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

-- Hero storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero', 'hero', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "Public read hero" ON storage.objects
  FOR SELECT USING (bucket_id = 'hero');
CREATE POLICY "Admin upload hero" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'hero');
CREATE POLICY "Admin update hero" ON storage.objects
  FOR UPDATE USING (bucket_id = 'hero');`}
        </pre>
      </div>
    </div>
  )
}
