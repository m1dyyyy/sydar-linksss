'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [links, setLinks] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [loading, setLoading] = useState(false);

  const mainDomain = 'misss-letoo.lol';

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = () => {
    fetch('/api/links')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setLinks(data);
      })
      .catch((err) => console.error(err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, subdomain }),
      });
      const data = await res.json();
      if (data.success) {
        setUrl('');
        setSubdomain('');
        fetchLinks();
      } else {
        alert('Ошибка: ' + data.error);
      }
    } catch (err) {
      alert('Ошибка запроса');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <main style={{ minHeight: '100vh', background: '#07090e', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', padding: '20px' }}>
      
      {/* Главная форма */}
      <div style={{ background: '#111827', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '460px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5), 0 10px 10px -5px rgba(0,0,0,0.04)', border: '1px solid #1f2937' }}>
        
        <h1 style={{ fontSize: '24px', fontWeight: '700', textAlign: 'center', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>SYDAR Links</h1>
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
              style={{ width: '100%', padding: '12px 14px', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
              onFocus={(e) => e.target.style.borderColor = '#60a5fa'}
              onBlur={(e) => e.target.style.borderColor = '#374151'}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#9ca3af', marginBottom: '6px' }}>Желаемый поддомен</label>
            <div style={{ display: 'flex', alignItems: 'center', background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', overflow: 'hidden' }}>
              <input
                type="text"
                placeholder="s1"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 14px', background: 'transparent', border: 'none', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
              <span style={{ paddingRight: '14px', color: '#6b7280', fontSize: '13px', userSelect: 'none' }}>.{mainDomain}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: '#fff', color: '#000', fontWeight: '600', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', marginTop: '4px', transition: 'opacity 0.2s', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Создание...' : 'Создать ссылку'}
          </button>
        </form>
      </div>

      {/* Список активных поддоменов */}
      {links.length > 0 && (
        <div style={{ width: '100%', maxWidth: '460px', marginTop: '28px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px', color: '#d1d5db', paddingLeft: '4px' }}>Активные поддомены</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {links.map((link) => {
              const fullSubUrl = `https://${link.subdomain}.${mainDomain}`;
              return (
                <div key={link.id} style={{ background: '#111827', padding: '14px 16px', borderRadius: '12px', border: '1px solid #1f2937', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <a href={fullSubUrl} target="_blank" rel="noreferrer" style={{ fontWeight: '600', color: '#60a5fa', fontSize: '14px', textDecoration: 'none' }}>
                      {link.subdomain}.{mainDomain}
                    </a>
                    <button
                      onClick={() => copyToClipboard(fullSubUrl, link.id)}
                      style={{ background: copiedId === link.id ? '#059669' : '#1f2937', color: '#fff', border: '1px solid #374151', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s' }}
                    >
                      {copiedId === link.id ? 'Скопировано!' : 'Копировать'}
                    </button>
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', borderTop: '1px solid #1f2937', paddingTop: '6px' }}>
                    ➜ <a href={link.url} target="_blank" rel="noreferrer" style={{ color: '#9ca3af', textDecoration: 'none' }}>{link.url}</a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
