'use client';
import { useRouter, usePathname } from 'next/navigation';
import { getUser, logout } from '@/lib/auth';
import { useEffect, useState } from 'react';

type Portal = 'air' | 'water' | 'noise' | null;
const key = (email: string) => `pvportal_${email}`;

const DOMAINS = [
  { k: 'air'   as const, icon: '💨', name: 'Air Quality',   sub: 'AQI · SO₂ · PM2.5',  activeClass: 'active-air',   accent: '#1a6b3a' },
  { k: 'water' as const, icon: '💧', name: 'Water Quality', sub: 'pH · DO · BOD',       activeClass: 'active-water', accent: '#1a5280' },
  { k: 'noise' as const, icon: '🔊', name: 'Noise Levels',  sub: 'Day · Night dB(A)',   activeClass: 'active-noise', accent: '#5a3500' },
];

const SUB_NAV: Record<string, Record<string, { href: string; label: string; icon: string; badge?: number }[]>> = {
  'Super Admin': {
    air: [
      { href: '/dashboard', label: 'Overview', icon: '⊞' },
      { href: '/map', label: 'Pollution Map', icon: '◎' },
      { href: '/alerts', label: 'Alerts & Notices', icon: '⚐', badge: 3 },
      { href: '/reports', label: 'Industry Reports', icon: '☰' },
      { href: '/forecast', label: 'AQI Forecast', icon: '◈' },
      { href: '/chat', label: 'Messages', icon: '✉', badge: 2 },
    ],
    water: [{ href: '/dashboard', label: 'Overview', icon: '⊞' }, { href: '/chat', label: 'Messages', icon: '✉', badge: 2 }],
    noise: [{ href: '/dashboard', label: 'Overview', icon: '⊞' }, { href: '/chat', label: 'Messages', icon: '✉', badge: 2 }],
  },
  'Regional Officer': {
    air: [
      { href: '/dashboard', label: 'Overview', icon: '⊞' },
      { href: '/map', label: 'Pollution Map', icon: '◎' },
      { href: '/alerts', label: 'Alerts & Actions', icon: '⚐', badge: 3 },
      { href: '/chat', label: 'Messages', icon: '✉', badge: 1 },
    ],
    water: [{ href: '/dashboard', label: 'Overview', icon: '⊞' }, { href: '/chat', label: 'Messages', icon: '✉', badge: 1 }],
    noise: [{ href: '/dashboard', label: 'Overview', icon: '⊞' }, { href: '/chat', label: 'Messages', icon: '✉', badge: 1 }],
  },
  'Industry User': {
    air: [
      { href: '/industry-dashboard', label: 'My Dashboard', icon: '⊞' },
      { href: '/submit', label: 'Submit Report', icon: '✎' },
      { href: '/industry-reports', label: 'Past Reports', icon: '☰' },
      { href: '/industry-forecast', label: 'AQI Forecast', icon: '◈' },
      { href: '/industry-alerts', label: 'My Alerts', icon: '⚐', badge: 2 },
    ],
    water: [
      { href: '/industry-dashboard', label: 'My Dashboard', icon: '⊞' },
      { href: '/submit', label: 'Submit Report', icon: '✎' },
      { href: '/industry-reports', label: 'Past Reports', icon: '☰' },
    ],
    noise: [
      { href: '/industry-dashboard', label: 'My Dashboard', icon: '⊞' },
      { href: '/submit', label: 'Submit Report', icon: '✎' },
      { href: '/industry-reports', label: 'Past Reports', icon: '☰' },
    ],
  },
  'Monitoring Team': {
    air: [
      { href: '/dashboard', label: 'Overview', icon: '⊞' },
      { href: '/map', label: 'Pollution Map', icon: '◎' },
      { href: '/alerts', label: 'Alerts', icon: '⚐' },
      { href: '/forecast', label: 'Forecast', icon: '◈' },
    ],
    water: [{ href: '/dashboard', label: 'Overview', icon: '⊞' }],
    noise: [{ href: '/dashboard', label: 'Overview', icon: '⊞' }],
  },
};

export default function LeftSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [portal, setPortal] = useState<Portal>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push('/'); return; }
    setUser(u);
    const saved = localStorage.getItem(key(u.email)) as Portal | null;
    if (saved) setPortal(saved);
  }, []);

  useEffect(() => {
    const h = (e: Event) => setPortal((e as CustomEvent).detail as Portal);
    window.addEventListener('pvPortalChange', h);
    return () => window.removeEventListener('pvPortalChange', h);
  }, []);

  const handleDomainClick = (p: 'air' | 'water' | 'noise') => {
    // Toggle off if clicking same domain
    const next = portal === p ? null : p;
    setPortal(next);
    if (user) {
      if (next) localStorage.setItem(key(user.email), next);
      else localStorage.removeItem(key(user.email));
    }
    window.dispatchEvent(new CustomEvent('pvPortalChange', { detail: next }));
  };

  const roleNavs = user ? (SUB_NAV[user.role] || SUB_NAV['Monitoring Team']) : {};
  const navItems = portal ? (roleNavs[portal] || []) : [];
  const activeDomain = DOMAINS.find(d => d.k === portal);

  return (
    <aside className="left-sidebar">
      {/* User info at top */}
      {user && (
        <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--border)', background: 'var(--navy)' }}>
          <div style={{ fontSize: '0.6rem', color: '#7b8fba', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Arial', marginBottom: '0.25rem' }}>{user.role}</div>
          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'white', fontFamily: 'Arial' }}>{user.name}</div>
          {user.district && <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontFamily: 'Arial', marginTop: '0.1rem' }}>📍 Zone: {user.district}</div>}
        </div>
      )}

      {/* Domain selector label */}
      <div className="sidebar-section-title" style={{ marginTop: '0.25rem' }}>Select Domain</div>

      {/* 3 domain cards */}
      <div style={{ padding: '0 0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {DOMAINS.map(d => {
          const isActive = portal === d.k;
          return (
            <button key={d.k} onClick={() => handleDomainClick(d.k)}
              className={`portal-domain-card${isActive ? ' ' + d.activeClass : ''}`}
              style={{ borderColor: isActive ? d.accent : 'var(--border)' }}>
              <span className="domain-icon">{d.icon}</span>
              <div style={{ flex: 1 }}>
                <div className="domain-name" style={{ color: isActive ? d.accent : 'var(--text-dark)' }}>{d.name}</div>
                <div className="domain-sub">{d.sub}</div>
              </div>
              {isActive && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill={d.accent}>
                  <path d="M7 0L9 5H14L10 8L12 13L7 10L2 13L4 8L0 5H5Z"/>
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* Sub-nav when domain chosen */}
      {portal && navItems.length > 0 && (
        <>
          <div className="sidebar-divider" style={{ marginTop: '0.75rem' }}/>
          <div className="sidebar-section-title" style={{ color: activeDomain?.accent }}>
            {activeDomain?.icon} {activeDomain?.name} Menu
          </div>
          <nav style={{ paddingBottom: '0.5rem' }}>
            {navItems.map(item => {
              const active = pathname === item.href;
              return (
                <button key={item.href + item.label} onClick={() => router.push(item.href)}
                  className={`sidebar-nav-item${active ? ' active' : ''}`}
                  style={active ? { borderLeftColor: activeDomain?.accent, background: `${activeDomain?.accent}12`, color: activeDomain?.accent } : {}}>
                  <span className="icon">{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && <span className="badge">{item.badge}</span>}
                </button>
              );
            })}
          </nav>
        </>
      )}

      {/* Spacer + logout at bottom */}
      <div style={{ flex: 1 }} />
      <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border)' }}>
        <button onClick={() => { if (user) localStorage.removeItem(key(user.email)); logout(); router.push('/'); }}
          className="btn-outline" style={{ width: '100%', fontSize: '0.72rem', padding: '0.35rem' }}>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
