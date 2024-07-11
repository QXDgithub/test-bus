import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log('Middleware: Current path:', req.nextUrl.pathname);
  console.log('Middleware: Session exists:', !!session);
  console.log('Middleware: Session details:', session);

  if (!session && req.nextUrl.pathname !== '/signin') {
    console.log('Middleware: Redirecting to signin');
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  console.log('Middleware: Allowing access to', req.nextUrl.pathname);
  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};