import { NextRequest, NextResponse } from 'next/server';
import { RouteConfig } from '@/routes/route';
import { ACCESS_TOKEN,ACCOUNT_TYPE } from '@/shared/constants/storage';
import { IndexConfig } from '@/routes';

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN);
  const accountType = request.cookies.get(ACCOUNT_TYPE)?.value || '';

  const url = request.nextUrl.clone();
  if (!accessToken) {
    url.pathname = RouteConfig.Login.Path;
    return NextResponse.redirect(url);
  }

  if (accountType === IndexConfig.Organization.AccountType && !url.pathname.startsWith('/admin')) {
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  if (accountType === IndexConfig.Personal.AccountType && !url.pathname.startsWith('/staff')) {
    url.pathname = '/staff';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login
     * - register
     * - enable-2FA
     * - activate
     * - reset-password
     * - images (images folder)
     * - admin
     * - staff
     * - profile
     * - update
     */
    '/((?!_next/static|_next/image|favicon.ico|login|register|enable-2FA|activate|reset-password|images|profile|update).*)',
    '/admin/:path*',
    '/staff/:path*',
  ],
};