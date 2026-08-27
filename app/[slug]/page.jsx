import { sql } from '@vercel/postgres';
import { redirect } from 'next/navigation';

export default async function Page({ params }) {
  const { slug } = await params;

  if (!slug || slug === 'favicon.ico') return null;

  let destination = null;

  try {
    const { rows } = await sql`
      SELECT url FROM sub_links 
      WHERE LOWER(TRIM(subdomain)) = ${slug.toLowerCase().trim()}
    `;

    if (rows.length > 0 && rows[0].url) {
      destination = rows[0].url;
    }
  } catch (error) {
    console.error('Database query error:', error);
  }

  if (destination) {
    if (!destination.startsWith('http://') && !destination.startsWith('https://')) {
      destination = `https://${destination}`;
    }
    redirect(destination);
  }

  return (
    <main style={{ minHeight: '100vh', background: '#07090e', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <h2>Ссылка не найдена</h2>
    </main>
  );
}
