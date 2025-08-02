import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Protect the /admin route
    if (pathname.startsWith('/admin') && token?.role !== 'admin') {
      return new NextResponse('You are not authorized!');
    }

    // Protect the /dashboard route
    if (pathname.startsWith('/dashboard') && token?.role !== 'vendor') {
      return new NextResponse('You are not authorized!');
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // A user is authorized if they have a token (are logged in)
    },
  }
);

// This specifies which routes the middleware should run on
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};