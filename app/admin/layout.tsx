'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/signin')
                return
            }
            
            const { data } = await supabase
                .from('users')
                .select('role')
                .eq('id', session.user.id)
                .single()
            
            if (data?.role !== 'admin') {
                router.push('/')
                return
            }
            setLoading(false)
        }
        checkAdmin()
    }, [router])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/signin')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
                <div className="animate-pulse flex items-center space-x-2 text-gray-500 font-medium">
                    <span className="h-2 w-2 bg-yellow-600 rounded-full animate-bounce" />
                    <span className="h-2 w-2 bg-yellow-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="h-2 w-2 bg-yellow-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                    <span className="ml-2">Verifying Admin Access...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen">
            <div className="w-full flex justify-end items-center px-8 py-2 bg-gray-900 text-white text-xs tracking-wider">
                <span className="mr-6 text-gray-400">Admin Privileges Active</span>
                <button 
                    onClick={handleLogout} 
                    className="hover:text-yellow-400 font-semibold uppercase flex items-center space-x-1"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>Logout</span>
                </button>
            </div>
            
            <main className="flex-1">
                {children}
            </main>
        </div>
    )
}
