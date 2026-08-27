import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';

export default async function SlugPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  if (!slug || slug === 'favicon.ico') return null;

  try {
    const { rows } = await sql`SELECT url FROM sub_links WHERE subdomain = ${slug.toLowerCase().trim()}`;

    if (rows.length > 0 && rows[0].url) {
      redirect(rows[0].url);
    }
  } catch (err) {
    console.error('Ошибка редиректа:', err);
  }

  return (
    <main style={{ minHeight: '100vh', background: '#07090e', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <h2>Ссылка не найдена</h2>
    </main>
  );
}
