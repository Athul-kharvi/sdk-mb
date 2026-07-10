'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

const ASPECTS = { desktop: 21 / 9, mobile: 9 / 19 }
const MAX_SLIDES = 3

interface CropBox { x: number; y: number; w: number; h: number }

function clampCrop(b: CropBox, dW: number, dH: number, asp: number): CropBox {
  let { x, y, w } = b
  w = Math.max(40, Math.min(w, dW))
  let h = w / asp
  if (h > dH) { h = dH; w = h * asp }
  return { x: Math.max(0, Math.min(x, dW - w)), y: Math.max(0, Math.min(y, dH - h)), w, h }
}

// ─── Crop Modal ───────────────────────────────────────────────────────────────
function CropModal({ file, asp, label, onDone, onCancel }: {
  file: File; asp: number; label: string
  onDone: (blob: Blob) => void; onCancel: () => void
}) {
  const [src, setSrc] = useState('')
  const [nat, setNat] = useState({ w: 0, h: 0 })
  const [disp, setDisp] = useState({ w: 0, h: 0 })
  const [crop, setCrop] = useState<CropBox>({ x: 0, y: 0, w: 0, h: 0 })
  const [drag, setDrag] = useState<string | null>(null)
  const start = useRef({ mx: 0, my: 0, cx: 0, cy: 0, cw: 0, ch: 0 })
  const previewRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const u = URL.createObjectURL(file)
    setSrc(u)
    return () => URL.revokeObjectURL(u)
  }, [file])

  const initCrop = useCallback((dW: number, dH: number) => {
    let cw = dW; let ch = cw / asp
    if (ch > dH) { ch = dH; cw = ch * asp }
    setCrop({ x: (dW - cw) / 2, y: (dH - ch) / 2, w: cw, h: ch })
  }, [asp])

  const onLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    setNat({ w: img.naturalWidth, h: img.naturalHeight })
    setDisp({ w: img.clientWidth, h: img.clientHeight })
    initCrop(img.clientWidth, img.clientHeight)
  }

  // live preview
  useEffect(() => {
    const cv = previewRef.current
    const img = document.getElementById('hcrop') as HTMLImageElement | null
    if (!cv || !img || !nat.w || !disp.w) return
    const sx = nat.w / disp.w; const sy = nat.h / disp.h
    const ow = asp >= 1 ? 180 : 80; const oh = ow / asp
    cv.width = ow; cv.height = oh
    cv.getContext('2d')!.drawImage(img, crop.x * sx, crop.y * sy, crop.w * sx, crop.h * sy, 0, 0, ow, oh)
  }, [crop, nat, disp, asp])

  const mouseDown = (e: React.MouseEvent, type: string) => {
    e.preventDefault(); e.stopPropagation()
    setDrag(type)
    start.current = { mx: e.clientX, my: e.clientY, cx: crop.x, cy: crop.y, cw: crop.w, ch: crop.h }
  }

  useEffect(() => {
    if (!drag) return
    const move = (e: MouseEvent) => {
      const { mx, my, cx, cy, cw, ch } = start.current
      const dx = e.clientX - mx; const dy = e.clientY - my
      let b: CropBox = { x: cx, y: cy, w: cw, h: ch }
      if (drag === 'mv') b = { x: cx + dx, y: cy + dy, w: cw, h: ch }
      else if (drag === 'se') { const nw = cw + dx; b = { x: cx, y: cy, w: nw, h: nw / asp } }
      else if (drag === 'sw') { const nw = cw - dx; b = { x: cx + dx, y: cy, w: nw, h: nw / asp } }
      else if (drag === 'ne') { const nw = cw + dx; const nh = nw / asp; b = { x: cx, y: cy + ch - nh, w: nw, h: nh } }
      else if (drag === 'nw') { const nw = cw - dx; const nh = nw / asp; b = { x: cx + dx, y: cy + ch - nh, w: nw, h: nh } }
      setCrop(clampCrop(b, disp.w, disp.h, asp))
    }
    const up = () => setDrag(null)
    window.addEventListener('mousemove', move); window.addEventListener('mouseup', up)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) }
  }, [drag, disp, asp])

  const confirm = () => {
    const img = document.getElementById('hcrop') as HTMLImageElement | null
    if (!img || !nat.w || !disp.w) return
    const sx = nat.w / disp.w; const sy = nat.h / disp.h
    const ow = asp >= 1 ? 2520 : 800; const oh = ow / asp
    const cv = document.createElement('canvas'); cv.width = ow; cv.height = oh
    cv.getContext('2d')!.drawImage(img, crop.x * sx, crop.y * sy, crop.w * sx, crop.h * sy, 0, 0, ow, oh)
    cv.toBlob(blob => { if (blob) onDone(blob) }, 'image/jpeg', 0.88)
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/85 p-4">
      <div className="bg-white w-full max-w-3xl flex flex-col shadow-2xl" style={{ maxHeight: '92vh' }}>
        <div className="px-5 py-3.5 border-b border-[#E8E0D5] flex items-center justify-between shrink-0">
          <div>
            <p className="font-brandon text-sm font-black uppercase tracking-tight text-[#1A1A1A]">Crop — {label}</p>
            <p className="font-syndicatgrotesk text-[10px] text-[#8A7A6A]">{asp >= 1 ? '21:9 ultrawide' : '9:19 portrait'}</p>
          </div>
          <button onClick={onCancel} className="w-7 h-7 border border-[#E8E0D5] text-[#8A7A6A] hover:text-[#D4A017] hover:border-[#D4A017] text-base transition-colors">×</button>
        </div>

        <div className="flex-1 overflow-auto bg-[#111] flex items-center justify-center p-5 min-h-0">
          <div className="relative inline-block select-none">
            <img id="hcrop" src={src} alt="" onLoad={onLoad}
              style={{ display: 'block', maxWidth: '100%', maxHeight: '50vh', pointerEvents: 'none', userSelect: 'none' }} />
            {disp.w > 0 && (
              <>
                <svg width={disp.w} height={disp.h} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
                  <defs><mask id="m"><rect width={disp.w} height={disp.h} fill="white" /><rect x={crop.x} y={crop.y} width={crop.w} height={crop.h} fill="black" /></mask></defs>
                  <rect width={disp.w} height={disp.h} fill="rgba(0,0,0,0.6)" mask="url(#m)" />
                </svg>
                <div onMouseDown={e => mouseDown(e, 'mv')}
                  style={{ position: 'absolute', left: crop.x, top: crop.y, width: crop.w, height: crop.h, border: '2px solid #D4A017', cursor: 'move', boxSizing: 'border-box' }}>
                  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(212,160,23,0.2) 1px,transparent 1px),linear-gradient(90deg,rgba(212,160,23,0.2) 1px,transparent 1px)', backgroundSize: `${crop.w / 3}px ${crop.h / 3}px` }} />
                  {(['nw','ne','sw','se'] as const).map(d => (
                    <div key={d} onMouseDown={e => mouseDown(e, d)}
                      style={{ position: 'absolute', width: 13, height: 13, background: '#D4A017', border: '2px solid white',
                        top: d[0]==='n' ? -6 : undefined, bottom: d[0]==='s' ? -6 : undefined,
                        left: d[1]==='w' ? -6 : undefined, right: d[1]==='e' ? -6 : undefined, cursor: d+'-resize' }} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="px-5 py-3.5 border-t border-[#E8E0D5] bg-[#FAF7F2] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <p className="font-syndicatgrotesk text-[9px] uppercase tracking-widest text-[#8A7A6A]">Preview</p>
            <canvas ref={previewRef} style={{ height: 40, width: asp >= 1 ? 71 : 18, border: '1px solid #E8E0D5', background: '#eee' }} />
          </div>
          <div className="flex gap-2.5">
            <button onClick={onCancel} className="px-4 py-2 border border-[#E8E0D5] font-syndicatgrotesk text-[10px] uppercase tracking-widest text-[#8A7A6A] hover:border-[#C4B49A] transition-colors">Cancel</button>
            <button onClick={confirm} className="px-5 py-2 bg-[#D4A017] text-[#0D0D0D] font-syndicatgrotesk text-[10px] font-bold uppercase tracking-widest hover:bg-[#B8860B] transition-colors">Use Crop</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Slide slot card ──────────────────────────────────────────────────────────
function SlideSlot({ idx, url, uploading, asp, onUpload, onRemove }: {
  idx: number; url: string | null; uploading: boolean; asp: number
  onUpload: () => void; onRemove: () => void
}) {
  return (
    <div className="border border-[#E8E0D5] bg-white p-3 space-y-2.5">
      <div className="flex items-center justify-between">
        <p className="font-syndicatgrotesk text-[9px] tracking-[0.25em] uppercase text-[#8A7A6A]">Slide {idx + 1}</p>
        {url && <button onClick={onRemove} className="font-syndicatgrotesk text-[9px] uppercase tracking-wider text-red-400 hover:text-red-600 transition-colors">Remove</button>}
      </div>

      <div className={`relative overflow-hidden border border-[#E8E0D5] bg-[#F5F0EA] cursor-pointer group ${asp >= 1 ? 'aspect-video' : 'aspect-[9/16] max-w-[90px]'}`}
        onClick={onUpload}>
        {url ? (
          <>
            <img src={url} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 font-syndicatgrotesk text-[9px] uppercase tracking-widest text-white">Change</span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1">
            {uploading ? (
              <span className="w-4 h-4 rounded-full border-2 border-[#D4A017]/30 border-t-[#D4A017] animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5 text-[#C4B49A] group-hover:text-[#D4A017] transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-syndicatgrotesk text-[8px] uppercase tracking-wider text-[#C4B49A] group-hover:text-[#D4A017] transition-colors">Upload</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminHeroPage() {
  const [desktop, setDesktop] = useState<(string | null)[]>([null, null, null])
  const [mobile, setMobile] = useState<(string | null)[]>([null, null, null])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [cropFile, setCropFile] = useState<File | null>(null)
  const [cropMeta, setCropMeta] = useState<{ type: 'desktop' | 'mobile'; idx: number } | null>(null)
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const pending = useRef<{ type: 'desktop' | 'mobile'; idx: number }>({ type: 'desktop', idx: 0 })

  const getToken = async () => (await supabase.auth.getSession()).data.session?.access_token ?? ''
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 2500) }

  const normalise = (val: any): string[] => {
    if (!val) return []
    if (Array.isArray(val)) return val.filter(Boolean)
    if (typeof val === 'string') return [val]
    return []
  }

  useEffect(() => {
    fetch('/api/admin/hero').then(r => r.json()).then(({ data }) => {
      if (data) {
        const d = normalise(data.desktop)
        const m = normalise(data.mobile)
        setDesktop([d[0] ?? null, d[1] ?? null, d[2] ?? null])
        setMobile([m[0] ?? null, m[1] ?? null, m[2] ?? null])
      }
      setLoading(false)
    })
  }, [])

  const save = async (newDesktop: (string | null)[], newMobile: (string | null)[]) => {
    const token = await getToken()
    await fetch('/api/admin/hero', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        desktop: newDesktop.filter(Boolean),
        mobile: newMobile.filter(Boolean),
      }),
    })
  }

  const triggerUpload = (type: 'desktop' | 'mobile', idx: number) => {
    pending.current = { type, idx }
    fileRef.current?.click()
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCropFile(file)
    setCropMeta(pending.current)
    e.target.value = ''
  }

  const onCropDone = async (blob: Blob) => {
    const { type, idx } = cropMeta!
    setCropFile(null); setCropMeta(null)
    const slotKey = `${type}-${idx}`
    setUploadingSlot(slotKey)

    try {
      const fileName = `hero-${type}-${idx}-${Date.now()}.jpg`
      const { error } = await supabase.storage.from('hero').upload(fileName, blob, { contentType: 'image/jpeg', upsert: true })
      if (error) { showToast('Upload failed: ' + error.message); return }
      const url = supabase.storage.from('hero').getPublicUrl(fileName).data.publicUrl

      const newD = [...desktop]; const newM = [...mobile]
      if (type === 'desktop') newD[idx] = url
      else newM[idx] = url
      setDesktop(newD); setMobile(newM)
      await save(newD, newM)
      showToast(`Slide ${idx + 1} saved`)
    } finally {
      setUploadingSlot(null)
    }
  }

  const removeSlide = async (type: 'desktop' | 'mobile', idx: number) => {
    const newD = [...desktop]; const newM = [...mobile]
    if (type === 'desktop') newD[idx] = null
    else newM[idx] = null
    setDesktop(newD); setMobile(newM)
    await save(newD, newM)
    showToast('Slide removed')
  }

  const useDeskForMobile = async () => {
    const newM = [...desktop]
    setMobile(newM)
    await save(desktop, newM)
    showToast('Desktop images applied to mobile')
  }

  if (loading) return (
    <div className="p-8 flex items-center gap-2.5">
      {[0,150,300].map(d => <span key={d} className="w-2 h-2 bg-[#D4A017] rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
      <span className="font-syndicatgrotesk text-[11px] tracking-widest uppercase text-[#C4B49A] ml-2">Loading…</span>
    </div>
  )

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />

      {cropFile && cropMeta && (
        <CropModal
          file={cropFile}
          asp={ASPECTS[cropMeta.type]}
          label={`${cropMeta.type === 'desktop' ? 'Desktop' : 'Mobile'} · Slide ${cropMeta.idx + 1}`}
          onDone={onCropDone}
          onCancel={() => { setCropFile(null); setCropMeta(null) }}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1A1A1A] text-[#D4A017] px-5 py-2.5 font-syndicatgrotesk text-[11px] tracking-widest uppercase shadow-xl pointer-events-none">
          {toast}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="font-brandon text-2xl font-black uppercase tracking-tight text-[#1A1A1A]">Hero Slideshow</h1>
        <p className="font-syndicatgrotesk text-[11px] text-[#8A7A6A] mt-0.5 tracking-wider">
          Up to {MAX_SLIDES} slides · auto-advances every 3 seconds · separate images for desktop &amp; mobile
        </p>
      </div>

      <div className="border-l-4 border-[#D4A017] bg-[#D4A017]/5 px-4 py-3">
        <p className="font-syndicatgrotesk text-[11px] text-[#8A7A6A] leading-relaxed">
          Click any slot to upload &amp; crop · <strong className="text-[#B8860B]">Desktop</strong> 16:9 (landscape) · <strong className="text-[#B8860B]">Mobile</strong> 9:19.5 (portrait) · At least 1 slide required per device
        </p>
      </div>

      {/* Desktop slides */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="font-brandon text-sm font-black uppercase tracking-tight text-[#1A1A1A] flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
            Desktop
          </p>
          <span className="font-syndicatgrotesk text-[9px] uppercase tracking-widest text-[#C4B49A]">21:9 · 2520×1080</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {desktop.map((url, i) => (
            <SlideSlot key={i} idx={i} url={url} asp={ASPECTS.desktop}
              uploading={uploadingSlot === `desktop-${i}`}
              onUpload={() => triggerUpload('desktop', i)}
              onRemove={() => removeSlide('desktop', i)} />
          ))}
        </div>
      </div>

      {/* Mobile slides */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="font-brandon text-sm font-black uppercase tracking-tight text-[#1A1A1A] flex items-center gap-2">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></svg>
            Mobile
          </p>
          <button onClick={useDeskForMobile} className="font-syndicatgrotesk text-[9px] uppercase tracking-widest text-[#D4A017] hover:text-[#B8860B] transition-colors">
            ← Use desktop images
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {mobile.map((url, i) => (
            <SlideSlot key={i} idx={i} url={url} asp={ASPECTS.mobile}
              uploading={uploadingSlot === `mobile-${i}`}
              onUpload={() => triggerUpload('mobile', i)}
              onRemove={() => removeSlide('mobile', i)} />
          ))}
        </div>
      </div>

      {/* Slideshow preview */}
      {desktop.some(Boolean) && (
        <div>
          <p className="font-syndicatgrotesk text-[9px] uppercase tracking-widest text-[#8A7A6A] mb-2">Live preview (desktop)</p>
          <div className="relative overflow-hidden aspect-video max-w-sm border border-[#E8E0D5]">
            {desktop.filter(Boolean).map((url, i) => (
              <img key={i} src={url!} alt="" className="absolute inset-0 w-full h-full object-cover"
                style={{ animation: `heroFade ${desktop.filter(Boolean).length * 3}s ${i * 3}s infinite`, opacity: i === 0 ? 1 : 0 }} />
            ))}
          </div>
          <style>{`
            @keyframes heroFade {
              0%, ${Math.round(100 / (desktop.filter(Boolean).length))}% { opacity: 1 }
              ${Math.round(100 / (desktop.filter(Boolean).length)) + 5}%, 95% { opacity: 0 }
              100% { opacity: 0 }
            }
          `}</style>
        </div>
      )}

      {/* SQL note */}
      <details className="border border-[#E8E0D5] bg-[#FDFCFA]">
        <summary className="px-4 py-3 font-syndicatgrotesk text-[9px] uppercase tracking-widest text-[#8A7A6A] cursor-pointer select-none">
          Supabase setup (one-time) ▸
        </summary>
        <pre className="font-mono text-[10px] text-[#D4A017] bg-[#1A1A1A] p-4 m-3 overflow-x-auto rounded leading-relaxed">{`CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

INSERT INTO storage.buckets (id, name, public)
VALUES ('hero', 'hero', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Public read hero" ON storage.objects
  FOR SELECT USING (bucket_id = 'hero');
CREATE POLICY "Admin upload hero" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'hero');
CREATE POLICY "Admin update hero" ON storage.objects
  FOR UPDATE USING (bucket_id = 'hero');`}</pre>
      </details>
    </div>
  )
}