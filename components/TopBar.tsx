'use client';
import { useEffect, useState } from 'react';
import { getUser } from '@/lib/auth';

export default function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const [time, setTime] = useState('');
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    setUser(getUser());
    const update = () => setTime(new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }));
    update();
    const t = setInterval(update, 30000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      background: 'white',
      borderBottom: '2px solid #c8e0d2',
      padding: '0.7rem 1.5rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: '0 1px 4px rgba(26,107,58,0.07)'
    }}>
      <div>
        <h1 style={{ fontSize: '1rem', fontWeight: '700', color: '#1a6b3a' }}>{title}</h1>
        {subtitle && <p style={{ fontSize: '0.72rem', color: '#6b8c7a', marginTop: '0.1rem' }}>{subtitle}</p>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div className="live-dot" />
          <span style={{ fontSize: '0.7rem', color: '#2d8653', fontWeight: '700', letterSpacing: '0.06em' }}>LIVE</span>
        </div>
        <div style={{ fontSize: '0.72rem', color: '#6b8c7a', background: '#f0f8f3', padding: '0.2rem 0.6rem', borderRadius: '2px', border: '1px solid #c8e0d2' }}>
          {time}
        </div>
        {user && (
          <div style={{ fontSize: '0.72rem', color: '#1a6b3a', background: '#e8f5ee', padding: '0.2rem 0.7rem', borderRadius: '2px', border: '1px solid #b8dfc4', fontWeight: '600' }}>
            {user.role}
          </div>
        )}
      </div>
    </div>
  );
}
