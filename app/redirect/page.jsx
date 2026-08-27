'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function RedirectContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');

  // Здесь может быть твоя логика редиректа, если она там была
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: '#fff', fontFamily: 'sans-serif' }}>
      <p>Перенаправление...</p>
    </div>
  );
}

export default function RedirectPage() {
  return (
    <Suspense fallback={<div style={{ color: '#fff', background: '#0f172a', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Загрузка...</div>}>
      <RedirectContent />
    </Suspense>
  );
}
