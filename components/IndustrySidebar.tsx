'use client';
import { useRouter, usePathname } from 'next/navigation';
import { getUser, logout } from '@/lib/auth';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/industry-dashboard', label: 'My Dashboard', icon: '⊞' },
  { href: '/submit', label: 'Submit Report', icon: '✎' },
  { href: '/industry-reports', label: 'Past Reports', icon: '☰' },
  { href: '/industry-forecast', label: 'AQI Forecast', icon: '◈' },
  { href: '/industry-alerts', label: 'My Alerts', icon: '⚐', badge: 2 },
];

export default function IndustrySidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) router.push('/');
    else setUser(u);
  }, []);

  const handleLogout = () => { logout(); router.push('/'); };

  return (
    <aside style={{ width: '220px', minWidth: '220px', background: 'white', borderRight: '2px solid #c8e0d2', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, boxShadow: '2px 0 8px rgba(26,107,58,0.07)' }}>
      <div style={{ padding: '1rem', borderBottom: '2px solid #e8f5ee', background: '#1a6b3a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🌿</span>
          <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'white' }}>PrithviNet</span>
        </div>
        <div style={{ fontSize: '0.6rem', color: '#a8d5bc', paddingLeft: '2.1rem' }}>Maharashtra SPCB</div>
      </div>

      <div style={{ background: '#fff8ee', borderBottom: '1px solid #f0d8a0', padding: '0.4rem 1rem' }}>
        <span style={{ fontSize: '0.62rem', fontWeight: '700', color: '#7d4e00', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Industry Portal</span>
        <div style={{ fontSize: '0.6rem', color: '#a06800', marginTop: '0.1rem' }}>Bharat Steel Works</div>
      </div>

      <nav style={{ flex: 1, padding: '0.5rem 0' }}>
        {navItems.map(item => {
          const active = pathname === item.href;
          return (
            <button key={item.href} onClick={() => router.push(item.href)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.6rem 1rem', background: active ? '#e8f5ee' : 'transparent', borderLeft: active ? '3px solid #1a6b3a' : '3px solid transparent', color: active ? '#1a6b3a' : '#3d5a48', fontSize: '0.82rem', fontWeight: active ? '700' : '400', cursor: 'pointer', border: 'none', textAlign: 'left', transition: 'all 0.12s' }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = '#f0f8f3'; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
              <span style={{ fontSize: '0.95rem', opacity: 0.8 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && <span style={{ background: '#c0392b', color: 'white', borderRadius: '10px', padding: '1px 7px', fontSize: '0.65rem', fontWeight: '700' }}>{item.badge}</span>}
            </button>
          );
        })}
      </nav>

      {user && (
        <div style={{ padding: '0.75rem 1rem', borderTop: '2px solid #e8f5ee', background: '#f7fcf9' }}>
          <div style={{ fontSize: '0.65rem', color: '#6b8c7a', marginBottom: '0.15rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{user.role}</div>
          <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1a2e22', marginBottom: '0.6rem' }}>{user.name}</div>
          <button onClick={handleLogout} style={{ width: '100%', background: 'white', color: '#1a6b3a', border: '1px solid #c8e0d2', borderRadius: '3px', padding: '0.3rem', fontSize: '0.72rem', cursor: 'pointer' }}>Logout</button>
        </div>
      )}
    </aside>
  );
}
