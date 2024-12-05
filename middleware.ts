import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUser } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const user = await getUser(request);
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');

  if (!user && !isAuthPage && request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};