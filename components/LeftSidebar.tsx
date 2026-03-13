'use client';
import { useRouter } from 'next/navigation';
import { getUser, logout } from '@/lib/auth';
import { useEffect, useState } from 'react';

type Portal = 'air' | 'water' | 'noise' | null;
const key = (email: string) => `pvportal_${email}`;

const DOMAINS = [
  {
    k:           'air'   as const,
    icon:        '💨',
    label:       'Air Pollution',
    sub:         'AQI · SO₂ · NO₂ · PM2.5',
    accent:      '#1a6b3a',
    activeBg:    '#f0f8f3',
    activeBorder:'#1a6b3a',
    activeClass: 'active-air',
  },
  {
    k:           'water' as const,
    icon:        '💧',
    label:       'Water Pollution',
    sub:         'pH · DO · BOD · Turbidity',
    accent:      '#1a5280',
    activeBg:    '#f0f5ff',
    activeBorder:'#1a5280',
    activeClass: 'active-water',
  },
  {
    k:           'noise' as const,
    icon:        '🔊',
    label:       'Noise Pollution',
    sub:         'Day · Night dB(A) · Zones',
    accent:      '#5a3500',
    activeBg:    '#fff8ee',
    activeBorder:'#5a3500',
    activeClass: 'active-noise',
  },
];

export default function LeftSidebar() {
  const router = useRouter();
  const [user,   setUser]   = useState<any>(null);
  const [portal, setPortal] = useState<Portal>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const u = getUser();
    if (!u) { router.push('/'); return; }
    setUser(u);
    const saved = localStorage.getItem(key(u.email)) as Portal | null;
    if (saved) setPortal(saved);
  }, []);

  // Keep in sync with other components that fire pvPortalChange
  useEffect(() => {
    const h = (e: Event) => setPortal((e as CustomEvent).detail as Portal);
    window.addEventListener('pvPortalChange', h);
    return () => window.removeEventListener('pvPortalChange', h);
  }, []);

  const selectDomain = (p: 'air' | 'water' | 'noise') => {
    // Toggle off if clicking same domain
    const next = portal === p ? null : p;
    setPortal(next);
    if (user) {
      if (next) localStorage.setItem(key(user.email), next);
      else       localStorage.removeItem(key(user.email));
    }
    window.dispatchEvent(new CustomEvent('pvPortalChange', { detail: next }));
  };

  const handleLogout = () => {
    if (user) localStorage.removeItem(key(user.email));
    logout();
    router.push('/');
  };

  return (
    <aside className="left-sidebar">

      {/* ── User info ── */}
      {user && (
        <div style={{
          padding: '0.9rem 1rem',
          borderBottom: '1px solid var(--border)',
          background: 'var(--navy)',
          flexShrink: 0,
        }}>
          <div style={{ fontSize:'0.58rem', color:'#7b8fba', textTransform:'uppercase', letterSpacing:'0.1em', fontFamily:'Arial', marginBottom:'0.2rem' }}>
            {user.role}
          </div>
          <div style={{ fontSize:'0.85rem', fontWeight:'700', color:'white', fontFamily:'Arial' }}>
            {user.name}
          </div>
          {user.district && (
            <div style={{ fontSize:'0.63rem', color:'#94a3b8', fontFamily:'Arial', marginTop:'0.15rem' }}>
              📍 Zone: {user.district}
            </div>
          )}
        </div>
      )}

      {/* ── Domain selector label ── */}
      <div style={{
        fontSize: '0.6rem',
        fontWeight: '700',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontFamily: 'Arial',
        padding: '0.65rem 1rem 0.35rem',
      }}>
        Monitoring Domain
      </div>

      {/* ── Three domain cards ── */}
      <div style={{ display:'flex', flexDirection:'column', gap:'3px', padding:'0 0.5rem' }}>
        {DOMAINS.map(d => {
          const isActive = portal === d.k;
          return (
            <button
              key={d.k}
              onClick={() => selectDomain(d.k)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.7rem 0.75rem',
                border: `1.5px solid ${isActive ? d.activeBorder : 'var(--border)'}`,
                borderRadius: '5px',
                background: isActive ? d.activeBg : 'white',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.12s',
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--light-gray)';
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = 'white';
              }}
            >
              {/* Domain icon */}
              <span style={{ fontSize:'1.4rem', flexShrink:0 }}>{d.icon}</span>

              {/* Label + sub-label */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  color: isActive ? d.accent : 'var(--text-dark)',
                  fontFamily: 'Arial',
                  lineHeight: 1.2,
                }}>
                  {d.label}
                </div>
                <div style={{
                  fontSize: '0.58rem',
                  color: isActive ? d.accent : 'var(--text-muted)',
                  fontFamily: 'Arial',
                  marginTop: '0.15rem',
                  opacity: isActive ? 0.8 : 1,
                }}>
                  {d.sub}
                </div>
              </div>

              {/* Active indicator star */}
              {isActive && (
                <svg width="12" height="12" viewBox="0 0 14 14" fill={d.accent} style={{ flexShrink:0 }}>
                  <path d="M7 0L9 5H14L10 8L12 13L7 10L2 13L4 8L0 5H5Z"/>
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Active domain info strip ── */}
      {portal && (() => {
        const d = DOMAINS.find(x => x.k === portal)!;
        return (
          <div style={{
            margin: '0.75rem 0.5rem 0',
            padding: '0.5rem 0.75rem',
            background: d.activeBg,
            border: `1px solid ${d.activeBorder}30`,
            borderLeft: `3px solid ${d.accent}`,
            borderRadius: '4px',
          }}>
            <div style={{ fontSize:'0.62rem', color:d.accent, fontWeight:'700', fontFamily:'Arial', letterSpacing:'0.04em' }}>
              {d.icon} {d.label.toUpperCase()} SELECTED
            </div>
            <div style={{ fontSize:'0.58rem', color:d.accent, fontFamily:'Arial', marginTop:'0.15rem', opacity:0.8, lineHeight:1.5 }}>
              Use the top navigation bar to switch between Dashboard, Map, Alerts, Reports, Forecast and Messages.
            </div>
          </div>
        );
      })()}

      {/* ── No domain selected hint ── */}
      {!portal && (
        <div style={{
          margin: '0.75rem 0.5rem 0',
          padding: '0.5rem 0.75rem',
          background: 'var(--light-gray)',
          border: '1px dashed var(--border)',
          borderRadius: '4px',
        }}>
          <div style={{ fontSize:'0.62rem', color:'var(--text-muted)', fontFamily:'Arial', lineHeight:1.6 }}>
            Select a domain above to load its monitoring data in the main area.
          </div>
        </div>
      )}

      {/* ── Spacer ── */}
      <div style={{ flex:1 }} />

      {/* ── Sign out ── */}
      <div style={{ padding:'0.75rem 0.75rem', borderTop:'1px solid var(--border)', flexShrink:0 }}>
        <button
          onClick={handleLogout}
          className="btn-outline"
          style={{ width:'100%', fontSize:'0.72rem', padding:'0.38rem' }}
        >
          Sign Out
        </button>
      </div>

    </aside>
  );
}
