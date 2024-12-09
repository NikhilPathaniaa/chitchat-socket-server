import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Redirect /home to /chat
  if (request.nextUrl.pathname === '/home') {
    return NextResponse.redirect(new URL('/chat', request.url));
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
