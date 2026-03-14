'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUser } from '@/lib/auth';

const NEWS_ITEMS = [
  '🔴 LIVE: Bharat Steel Works, Nagpur SO₂ levels at 142 ppm — exceeding limit of 80 ppm · Inspection ordered',
  '⚠ Nag River (Nagpur) water quality CRITICAL — DO: 1.9 mg/L, BOD: 24.1 mg/L · Immediate remediation required',
  '📋 Monthly compliance reports due by 31 March 2026 — All registered industries must submit',
  '🔊 Noise levels at Dharavi Industrial Area exceeding 81 dB(A) — Limit: 75 dB(A) · Notice issued',
  '🌿 Maharashtra SPCB Annual Environment Report 2025-26 published — Download at mpcb.gov.in',
  '✅ Godavari River (Nashik) maintaining GOOD water quality for 6th consecutive month',
  '📡 New monitoring station commissioned at Aurangabad MIDC — Real-time data now available',
  '⚠ PM2.5 levels elevated across Pune region — Advisory issued for sensitive groups',
];

export default function GovHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [time, setTime] = useState('');

  useEffect(() => {
    setUser(getUser());
    const update = () => setTime(new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }));
    update();
    const t = setInterval(update, 30000);
    return () => clearInterval(t);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  // Top nav links by role
  const isIndustry = user?.role === 'Industry User';
  const basePath = isIndustry ? '/industry-dashboard' : '/dashboard';

  const navItems = isIndustry ? [
    { href: '/industry-dashboard', label: 'Dashboard',  icon: '⊞' },
    { href: '/submit',             label: 'Submit',      icon: '✎' },
    { href: '/industry-reports',   label: 'Reports',     icon: '☰' },
    { href: '/industry-forecast',  label: 'Forecast',    icon: '◈' },
    { href: '/industry-alerts',    label: 'Alerts',      icon: '⚐' },
    { href: '/copilot',            label: 'AI Copilot',  icon: '⬡' },
  ] : [
    { href: '/dashboard',          label: 'Dashboard',   icon: '⊞' },
    { href: '/map',                label: 'Map',          icon: '◎' },
    { href: '/alerts',             label: 'Alerts',       icon: '⚐' },
    { href: '/reports',            label: 'Reports',      icon: '☰' },
    { href: '/forecast',           label: 'Forecast',     icon: '◈' },
    { href: '/chat',               label: 'Messages',     icon: '✉' },
    { href: '/copilot',            label: 'AI Copilot',   icon: '⬡' },
    { href: '/risk-scores',        label: 'Risk',         icon: '◇' },
    { href: '/escalations',        label: 'Escalations',  icon: '⇑' },
    { href: '/alert-rules',        label: 'Alert Rules',  icon: '⚐' },
    { href: '/compliance-calendar',label: 'Calendar',     icon: '▦' },
    { href: '/complaints',         label: 'Complaints',   icon: '✆' },
    { href: '/telegram-complaints',  label: 'Telegram',     icon: '💬' },
  ];

  const tickerFull = [...NEWS_ITEMS, ...NEWS_ITEMS].join('   ◆   ');

  return (
    <>
      {/* India tricolour stripe */}
      <div className="tricolour-stripe" />

      {/* Live news ticker */}
      <div className="ticker-wrap">
        <div className="ticker-label">LATEST</div>
        <div className="ticker-content">
          <div className="ticker-text">
            <span>{tickerFull}</span>
            <span style={{ marginLeft: '4rem' }}>{tickerFull}</span>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.06)', borderLeft: '1px solid rgba(255,255,255,0.1)', padding: '0 0.85rem', height: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <span className="live-dot" />
          <span style={{ fontSize: '0.65rem', color: '#22c55e', fontWeight: '700', letterSpacing: '0.08em', fontFamily: 'Arial, sans-serif' }}>LIVE</span>
        </div>
      </div>

      {/* Site header: logo + name + clock */}
      <div className="site-header">
        <div className="site-header-logo">
          <img src="/logo.jpeg" alt="PrithviNet Logo" style={{ height: '62px', width: 'auto' }} />
          <div className="site-header-title">
            <h1>PRITHVINET</h1>
            <p>Environment Monitoring &amp; Compliance Platform</p>
            <p style={{ fontSize: '0.6rem', color: '#8a92a8', marginTop: '0.1rem' }}>Maharashtra State Pollution Control Board</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {user && (
            <div style={{ textAlign: 'right', fontFamily: 'Arial, sans-serif' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--navy)' }}>{user.name}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{user.role}</div>
            </div>
          )}
          <div style={{ textAlign: 'right', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{time}</div>
            <div style={{ fontSize: '0.6rem', color: '#8a92a8', marginTop: '0.1rem' }}>IST</div>
          </div>
          <div style={{ background: 'var(--off-white)', border: '1px solid var(--border)', borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', cursor: 'pointer', flexShrink: 0 }} title={user?.name}>
            👤
          </div>
        </div>
      </div>

      {/* Horizontal top nav */}
      <nav className="top-nav">
        {navItems.map((item, i) => (
          <button key={item.href} onClick={() => router.push(item.href)}
            className={`top-nav-item${isActive(item.href) ? ' active' : ''}`}>
            <span style={{ fontSize: '0.85rem' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
        <div className="top-nav-live">
          <span className="live-dot" />
          <span style={{ fontSize: '0.65rem', color: '#8a92a8', fontFamily: 'Arial, sans-serif' }}>Real-time data · Updated every 5s</span>
        </div>
      </nav>
    </>
  );
}
