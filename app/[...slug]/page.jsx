import { sql } from '@vercel/postgres';
import { redirect } from 'next/navigation';

export default async function CatchAllPage({ params }) {
  const resolvedParams = await params;
  const slugArray = resolvedParams.slug;
  const slug = slugArray ? slugArray.join('/') : '';

  if (!slug || slug === 'favicon.ico') return null;

  let targetUrl = null;

  try {
    // 1. Проверяем, есть ли уже такая ссылка в базе
    const { rows } = await sql`SELECT url FROM sub_links WHERE subdomain = ${slug.toLowerCase().trim()}`;
    
    if (rows.length > 0 && rows[0].url) {
      targetUrl = rows[0].url;
    } else {
      // 2. Если ссылки нет в базе, но ты хочешь, чтобы любая новая ебашила куда-то по умолчанию
      // (сюда можно вписать дефолтный URL или логику автогенерации)
      targetUrl = 'https://quantix-team.com/dashboard'; // пример дефолтного адреса
    }
  } catch (err) {
    console.error('Ошибка базы данных:', err);
  }

  if (targetUrl) {
    redirect(targetUrl);
  }

  return (
    <main style={{ minHeight: '100vh', background: '#07090e', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <h2>Ссылка не найдена</h2>
    </main>
  );
}
