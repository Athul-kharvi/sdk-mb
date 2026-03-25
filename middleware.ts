import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')

    if (isAdminRoute) {
        // check auth here
        // redirect if not logged in
    }

    return NextResponse.next()
}