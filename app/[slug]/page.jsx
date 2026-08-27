import { sql } from '@vercel/postgres';

export default async function SlugPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  if (!slug || slug === 'favicon.ico') return null;

  let targetUrl = null;

  try {
    const { rows } = await sql`SELECT url FROM sub_links WHERE subdomain = ${slug.toLowerCase().trim()}`;
    if (rows.length > 0 && rows[0].url) {
      targetUrl = rows[0].url;
    }
  } catch (err) {
    console.error('Ошибка базы данных:', err);
  }

  if (!targetUrl) {
    return (
      <main style={{ minHeight: '100vh', background: '#07090e', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <h2>Ссылка не найдена</h2>
      </main>
    );
  }

  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content={`0;url=${targetUrl}`} />
        <script dangerouslySetInnerHTML={{ __html: `window.location.href = "${targetUrl}";` }} />
      </head>
      <body style={{ minHeight: '100vh', background: '#07090e', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <p>Перенаправление на <a href={targetUrl} style={{ color: '#3b82f6' }}>{targetUrl}</a>...</p>
      </body>
    </html>
  );
}
