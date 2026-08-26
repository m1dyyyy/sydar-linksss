'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function RedirectPage() {
  const searchParams = useSearchParams();
  const sub = searchParams.get('sub');
  const [status, setStatus] = useState('Redirecting...');

  useEffect(() => {
    if (!sub) {
      setStatus('Ссылка не найдена');
      return;
    }

    async function fetchTarget() {
      try {
        const res = await fetch('/api/links');
        const data = await res.json();
        const found = data.find((item) => item.subdomain === sub);
        
        if (found && found.url) {
          window.location.href = found.url;
        } else {
          setStatus('Поддомен не существует в базе');
        }
      } catch (e) {
        setStatus('Ошибка загрузки редиректа');
      }
    }

    fetchTarget();
  }, [sub]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'sans-serif', flexDirection: 'column', gap: '10px' }}>
      <h2>{status}</h2>
      <p style={{ color: '#666', fontSize: '14px' }}>Пожалуйста, подождите...</p>
    </div>
  );
}
