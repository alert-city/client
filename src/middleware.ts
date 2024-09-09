import { NextRequest } from 'next/server';
import { RouteConfig } from '@/routes/route';
import { ACCESS_TOKEN, ACCOUNT_TYPE, ROLE } from '@/shared/constants/storage';
import createMiddleware from 'next-intl/middleware';
import { IndexConfig } from '@/routes';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);
const commonPaths = ['profile', 'update', 'preferences', 'activate', 'enable-2FA'];

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN);
  const accountType = request.cookies.get(ACCOUNT_TYPE)?.value || '';
  const role = request.cookies.get(ROLE)?.value.split(',') || [];
  const pathname = request.nextUrl.pathname;
  const pagesWithoutToken = ['login', 'register', 'reset-password', ...commonPaths];
  const pagesRegex = new RegExp(
    `^\/(?:en|zh-cn)?\/?(?:${pagesWithoutToken.join('|')})$`,
  );
  const locale = request.cookies.get('NEXT_LOCALE')?.value || 'en';

  const validLocales = ['en', 'zh-cn'];
  const isValidLocale = validLocales.some((loc) => pathname.startsWith(`/${loc}`));
  if (!isValidLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${RouteConfig.Login.Path}`;
    return Response.redirect(url);
  }

  if (pathname.includes('login') && accessToken) {
    const redirectPath = await getRedirectUrl(locale, accountType, role);
    if (pathname !== redirectPath) {
      const url = request.nextUrl.clone();
      url.pathname = redirectPath;
      return Response.redirect(url);
    }
  }

  if (pathname === '/' && accessToken) {
    const redirectPath = await getRedirectUrl(locale, accountType, role);
    if (pathname !== redirectPath) {
      const url = request.nextUrl.clone();
      url.pathname = redirectPath;
      return Response.redirect(url);
    }
  }

  if (!accessToken && !pagesRegex.test(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = `${locale}${RouteConfig.Login.Path}`;
    return Response.redirect(url);
  }

  const isCommonPath = commonPaths.some(path => pathname.includes(`/${locale}/${path}`));
  if (!isCommonPath) {
    if (accountType === IndexConfig.Organization.AccountType && pathname.startsWith(`/${locale}/staff`)) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/admin`;
      return Response.redirect(url);
    }

    if (accountType === IndexConfig.Personal.AccountType && pathname.startsWith(`/${locale}/admin`)) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/staff`;
      return Response.redirect(url);
    }
  }
  return intlMiddleware(request);
}


export const config = {
  matcher: [
    '/',
    '/(zh-cn|en)/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|images/).*)',
  ],
};


const getRedirectUrl = async (locale: string, accountType: string, role: string[]) => {
  if (accountType === IndexConfig.Organization.AccountType) {
    return `/${locale}${RouteConfig.AdminSubmission.Path}`;
  } else if (accountType === IndexConfig.Personal.AccountType) {
    if (role?.includes('staff')) {
      return `/${locale}${RouteConfig.StaffSubmission.Path}`;
    }
  }
  return `/${locale}${RouteConfig.Login.Path}`;
};