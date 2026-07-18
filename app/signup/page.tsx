'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleSignUp = async (e?: React.FormEvent) => {
        e?.preventDefault()
        setError('')
        setSuccess('')

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)

        const { error } = await supabase.auth.signUp({ email, password })

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        setSuccess('Account created! Redirecting to sign in...')
        setLoading(false)

        setTimeout(() => {
            router.push('/signin')
        }, 1500)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] px-4">

            <div className="w-full max-w-md bg-white shadow-xl p-10 rounded-2xl border border-gray-100">

                {/* Brand */}
                <h1 className="text-3xl font-serif text-center text-warm-black mb-2">
                    Vinayak Creation
                </h1>

                <p className="text-center text-sm tracking-widest text-gray-500 mb-8 uppercase">
                    Create your account
                </p>

                <form onSubmit={handleSignUp}>
                {/* Email */}
                <div className="mb-4">
                    <label className="text-xs uppercase tracking-widest text-foreground-light">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex w-full rounded-md border border-control bg-foreground/[.026] placeholder:text-foreground-muted
                        text-sm leading-4 px-3 py-2 h-[34px]
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background-control
                        focus-visible:ring-offset-2 focus-visible:ring-offset-foreground-muted
                        border-strong"
                    />
                </div>

                {/* Password */}
                <div className="mb-4">
                    <label className="text-xs uppercase tracking-widest text-foreground-light">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="flex w-full rounded-md border border-control bg-foreground/[.026] placeholder:text-foreground-muted
                        text-sm leading-4 px-3 py-2 h-[34px]
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background-control
                        focus-visible:ring-offset-2 focus-visible:ring-offset-foreground-muted
                        border-strong"
                    />
                </div>

                {/* Confirm Password */}
                <div className="mb-6">
                    <label className="text-xs uppercase tracking-widest text-foreground-light">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`flex w-full rounded-md border bg-foreground/[.026] placeholder:text-foreground-muted
                        text-sm leading-4 px-3 py-2 h-[34px]
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background-control
                        focus-visible:ring-offset-2 focus-visible:ring-offset-foreground-muted
                        ${confirmPassword && password !== confirmPassword ? 'border-red-400' : 'border-control border-strong'}`}
                    />
                    {confirmPassword && password !== confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                    )}
                </div>

                {/* Error */}
                {error && (
                    <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
                )}

                {/* Success */}
                {success && (
                    <p className="text-green-600 text-sm mb-3 text-center">{success}</p>
                )}

                {/* Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-yellow-600 text-white py-3 rounded-lg tracking-widest uppercase text-sm hover:bg-yellow-700 transition disabled:opacity-60"
                >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
                </form>

                {/* Divider */}
                <div className="text-center my-6 text-gray-400 text-sm">
                    or
                </div>

                {/* Sign in link */}
                <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <a href="/signin" className="text-yellow-600 hover:underline">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    )
}
