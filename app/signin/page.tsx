'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleLogin = async () => {
        setLoading(true)
        setError('')

        const { data: authData, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        if (!authData?.user) {
            setLoading(false)
            return
        }

        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', authData.user.id)
            .single()

        setLoading(false)

        if (userData?.role === 'admin') {
            router.push('/admin')
        } else {
            router.push('/')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] px-4">

            <div className="w-full max-w-md bg-white shadow-xl p-10 rounded-2xl border border-gray-100">

                {/* Brand */}
                <h1 className="text-3xl font-serif text-center text-warm-black mb-2">
                    Vinayaka Creation
                </h1>
                <p className="text-center text-sm tracking-widest text-gray-500 mb-8 uppercase">
                    Sign in to your account
                </p>

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
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mt-2 rounded-md border border-control bg-foreground/[.026]
                        px-3 py-2 h-[34px] text-sm leading-4
                        placeholder:text-foreground-muted
                        focus:outline-none focus:ring-2 focus:ring-background-control
                        focus:ring-offset-2 focus:ring-offset-foreground-muted"
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
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mt-2 rounded-md border border-control bg-foreground/[.026]
                        px-3 py-2 h-[34px] text-sm leading-4
                        placeholder:text-foreground-muted
                        focus:outline-none focus:ring-2 focus:ring-background-control
                        focus:ring-offset-2 focus:ring-offset-foreground-muted"
                    />
                </div>
                {error && (
                    <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
                )}

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full bg-yellow-600 text-white py-3 rounded-lg tracking-widest uppercase text-sm hover:bg-yellow-700 transition"
                >
                    {loading ? 'Signing In...' : 'Sign In'}
                </button>

                {/* Divider */}
                <div className="text-center my-6 text-gray-400 text-sm">or</div>

                {/* Sign up link */}
                <p className="text-center text-sm text-gray-600">
                    Don’t have an account?{' '}
                    <a href="/signup" className="text-yellow-600 hover:underline">
                        Create one
                    </a>
                </p>

            </div>
        </div>
    )
}