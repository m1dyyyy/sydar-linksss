import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  const currentHost = 'votee-arts.lol';

  let subdomain = '';
  if (hostname.includes('.')) {
    const parts = hostname.split('.');
    if (parts.length > currentHost.split('.').length) {
      subdomain = parts[0];
    }
  }

  if (subdomain && subdomain !== 'www') {
    try {
      const apiResponse = await fetch(`${url.protocol}//${hostname}/api/links`);
      const links = await apiResponse.json();

      const found = links.find((item: any) => item.subdomain.toLowerCase() === subdomain.toLowerCase());

      if (found && found.url) {
        return NextResponse.redirect(found.url);
      }
    } catch (e) {
      console.error('Middleware redirect error:', e);
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
