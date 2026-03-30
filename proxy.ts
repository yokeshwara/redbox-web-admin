import { NextRequest, NextResponse } from 'next/server'

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if the path is an admin route
  if (pathname.startsWith('/admin')) {
    // Allow access to login page without authentication
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }

    // For other admin routes, you would check for authentication
    // Since we're using client-side mock authentication, 
    // the client-side AdminLayout component handles the redirect
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
