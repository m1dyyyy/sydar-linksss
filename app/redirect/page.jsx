'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function RedirectContent() {
  const searchParams = useSearchParams();
  return <div style={{ color: '#fff', background: '#0f172a', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Перенаправление...</div>;
}

export default function RedirectPage() {
  return (
    <Suspense fallback={<div style={{ color: '#fff', background: '#0f172a', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Загрузка...</div>}>
      <RedirectContent />
    </Suspense>
  );
}
