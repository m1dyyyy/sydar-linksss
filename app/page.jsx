'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [links, setLinks] = useState([]);

  useEffect(() => {
    fetch('/api/links')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setLinks(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, subdomain }),
    });
    const data = await res.json();
    if (data.success) {
      window.location.reload();
    } else {
      alert('Ошибка: ' + data.error);
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: '#0b0f19', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ background: '#111827', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '420px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', border: '1px solid #1f2937' }}>
        
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>SYDAR Links</h1>
        <p style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center', margin: '0 0 24px 0' }}>Быстрый генератор ссылок с поддержкой поддоменов</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#9ca3af', marginBottom: '6px' }}>Целевая ссылка</label>
            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 14px', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#9ca3af', marginBottom: '6px' }}>Поддомен</label>
            <input
              type="text"
              placeholder="s1"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 14px', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            style={{ width: '100%', padding: '12px', background: '#fff', color: '#000', fontWeight: '600', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', marginTop: '4px', transition: 'background 0.2s' }}
          >
            Создать ссылку
          </button>
        </form>
      </div>

      {links.length > 0 && (
        <div style={{ width: '100%', maxWidth: '420px', marginTop: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#d1d5db' }}>Активные поддомены</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {links.map((link) => (
              <div key={link.id} style={{ background: '#111827', padding: '12px 16px', borderRadius: '8px', border: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '500', color: '#60a5fa' }}>{link.subdomain}</span>
                <a href={link.url} target="_blank" rel="noreferrer" style={{ color: '#9ca3af', fontSize: '13px', textDecoration: 'none', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {link.url}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
