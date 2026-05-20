'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleSignUp = async () => {
        setLoading(true)
        setError('')
        setSuccess('')

        const { error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        setSuccess('Account created! Please check your email to confirm.')
        setLoading(false)

        // optional redirect after delay
        setTimeout(() => {
            router.push('/products')
        }, 2000)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] px-4">

            <div className="w-full max-w-md bg-white shadow-xl p-10 rounded-2xl border border-gray-100">

                {/* Brand */}
                <h1 className="text-3xl font-serif text-center text-warm-black mb-2">
                    Vinayaka Creation
                </h1>

                <p className="text-center text-sm tracking-widest text-gray-500 mb-8 uppercase">
                    Create your account
                </p>

                {/* Email */}
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
                <div className="mb-6">
                    <label className="text-xs uppercase tracking-widest text-foreground-light">
                        Password
                    </label>

                    <input
                        type="password"
                        name="password"
                        autoComplete="current-password"
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
                {/* Error */}
                {error && (
                    <p className="text-red-500 text-sm mb-3 text-center">
                        {error}
                    </p>
                )}

                {/* Success */}
                {success && (
                    <p className="text-green-600 text-sm mb-3 text-center">
                        {success}
                    </p>
                )}

                {/* Button */}
                <button
                    onClick={handleSignUp}
                    disabled={loading}
                    className="w-full bg-yellow-600 text-white py-3 rounded-lg tracking-widest uppercase text-sm hover:bg-yellow-700 transition"
                >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </button>

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