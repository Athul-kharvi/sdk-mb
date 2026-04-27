'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Category {
  id: string
  name: string
  slug: string
  is_active: boolean
  created_at: string
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', slug: '' })
  const [editForm, setEditForm] = useState({ name: '', slug: '' })
  const [error, setError] = useState('')
  const [toastMsg, setToastMsg] = useState('')

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

  const handleNameChange = (val: string) => setForm({ name: val, slug: slugify(val) })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('Category name is required'); return }
    setSaving(true)
    const token = await getToken()
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name.trim(), slug: form.slug || slugify(form.name) }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Failed to create'); setSaving(false); return }
    setForm({ name: '', slug: '' })
    setShowForm(false)
    setSaving(false)
    showToast(`"${form.name.trim()}" category created`)
    fetchCategories()
  }

  const startEdit = (cat: Category) => {
    setEditingId(cat.id)
    setEditForm({ name: cat.name, slug: cat.slug })
  }

  const handleUpdate = async (id: string) => {
    setSaving(true)
    const token = await getToken()
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editForm.name.trim(),
        slug: editForm.slug || slugify(editForm.name),
      }),
    })
    setSaving(false)
    if (res.ok) {
      setEditingId(null)
      showToast('Category updated')
      fetchCategories()
    }
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
    await fetch(`/api/admin/categories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    setDeletingId(null)
    showToast(`"${name}" deleted`)
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

  return (
    <div className="p-6 lg:p-8 space-y-6">

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
            Manage jewelry categories — visible on the home page
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
                onChange={e => handleNameChange(e.target.value)}
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
          <strong className="text-[#B8860B]">Tip:</strong> Clicking a category name below opens it on the customer-facing store. Use the toggle to show/hide categories from the home page without deleting them.
        </p>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E8E0D5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead className="bg-[#FAF7F2] border-b border-[#E8E0D5]">
              <tr>
                {['Category Name', 'Slug / URL', 'Visible on Store', 'Created', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-syndicatgrotesk text-[9px] tracking-[0.22em] uppercase text-[#8A7A6A] font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <tr
                  key={cat.id}
                  className={`border-b border-[#F0EBE1] hover:bg-[#FAF7F2] transition-colors ${i % 2 === 0 ? '' : 'bg-[#FDFCFA]'}`}
                >
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
                        href={`/#${cat.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-brandon text-sm font-black text-[#1A1A1A] hover:text-[#D4A017] transition-colors group flex items-center gap-1.5"
                        title={`Open #${cat.slug} on store`}
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
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => handleToggle(cat.id, cat.is_active)}
                        className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A017] ${cat.is_active ? 'bg-[#D4A017]' : 'bg-[#E8E0D5]'}`}
                        role="switch"
                        aria-checked={cat.is_active}
                        aria-label={`Toggle ${cat.name} visibility`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${cat.is_active ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                      </button>
                      <span className={`font-syndicatgrotesk text-[10px] tracking-wider uppercase font-semibold ${cat.is_active ? 'text-[#D4A017]' : 'text-[#C4B49A]'}`}>
                        {cat.is_active ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                  </td>

                  {/* Created */}
                  <td className="px-4 py-3 font-syndicatgrotesk text-[11px] text-[#C4B49A]">
                    {new Date(cat.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
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
                            onClick={() => startEdit(cat)}
                            className="font-syndicatgrotesk text-[10px] tracking-[0.1em] uppercase text-[#D4A017] hover:text-[#B8860B] font-semibold transition-colors"
                          >
                            Edit
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
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-14 text-center font-syndicatgrotesk text-[11px] tracking-wider uppercase text-[#C4B49A]">
                    No categories yet — add your first one above
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
