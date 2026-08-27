import { redirect } from 'next/navigation';

export default async function SlugPage({ params }) {
  const { slug } = await params;

  // Игнорируем технические запросы фавиконки и т.д.
  if (!slug || slug === 'favicon.ico') return null;

  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/links`, { cache: 'no-store' });
    const links = await res.json();
    
    // Ищем совпадение по любому полю
    const found = links.find((l) => l.subdomain === slug || l.slug === slug);

    if (found && found.url) {
      redirect(found.url);
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
