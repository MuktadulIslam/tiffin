import { NextResponse, NextRequest } from 'next/server'
import {AUTH} from '@/config'

export const getRefreshTokenServer = (req: NextRequest): string | undefined => {
    const token = req.cookies.get(AUTH.COOKIE_NAME)?.value;
    if (!token) return undefined;
    return token;
};


export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    const isAuthPage = pathname.startsWith('/admin/login');
    const isAuthenticated = !!getRefreshTokenServer(request);

    if (isAuthPage) {
        if (isAuthenticated) {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        }
        return NextResponse.next()
    }
    else {
        if (!isAuthenticated) {
            const url = new URL('/admin/login', request.url);
            url.searchParams.set('next', request.nextUrl.pathname + request.nextUrl.search);
            return NextResponse.redirect(url);
        }
        return NextResponse.next()
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'
    ],
}