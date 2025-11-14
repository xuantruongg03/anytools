import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Temporarily disable middleware - we'll use client-side language switching
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|robots.txt|sitemap.xml).*)',
  ],
};
