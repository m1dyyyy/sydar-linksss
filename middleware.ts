import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Убираем порт, если он есть (например, localhost:3000)
  const currentHost = hostname.split(':')[0];

  // Распознаем верселевские технические домены (например, твой-проект.vercel.app) 
  // или кастомные. Нам нужны поддомены, которых больше 2 частей (например, sub.sydar.vercel.app или sub.votee-arts.lol)
  const parts = currentHost.split('.');
  
  let isSubdomain = false;
  let subdomain = '';

  if (currentHost.includes('vercel.app')) {
    // Для *.vercel.app поддомен — это всё, что идет ДО имени проекта
    // Например: my-sub.project-name.vercel.app -> parts length > 3
    if (parts.length > 3) {
      subdomain = parts[0];
      isSubdomain = true;
    }
  } else {
    // Для обычных доменов (если решишь привязать другой): sub.domain.com -> parts length > 2
    if (parts.length > 2) {
      subdomain = parts[0];
      isSubdomain = true;
    }
  }

  // Если это поддомен (и не www)
  if (isSubdomain && subdomain !== 'www') {
    // Пробуем найти оригинальную ссылку через наш API-роут или кеш
    // Перенаправляем запрос на внутренний обработчик редиректов
    url.pathname = `/api/redirect`;
    url.searchParams.set('subdomain', subdomain);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
