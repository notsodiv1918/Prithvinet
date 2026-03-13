'use client';
import { useEffect, useState } from 'react';

interface Props {
  activeTab: 'air' | 'water' | 'noise';
  stationCount: number;
}

const NEWS = [
  '🔴 LIVE: Nagpur Butibori AQI at 267 — Very Unhealthy — Avoid outdoor activity',
  '⚠ Nag River (Nagpur) water quality CRITICAL — DO: 1.9 mg/L — Avoid contact',
  '🔊 Dharavi Industrial Area noise at 81 dB(A) — Exceeds limit by 6 dB',
  '✅ Godavari River (Nashik) maintaining GOOD quality for 6th consecutive month',
  '📋 MPCB Annual Environment Report 2025-26 published — Download at mpcb.gov.in',
  '⚠ PM2.5 elevated across Pune region — Advisory for sensitive groups',
  '📡 New CAAQMS station commissioned at Chandrapur — Real-time data now live',
];

export default function CitizenPageHeader({ activeTab, stationCount }: Props) {
  const [time, setTime] = useState('');
  const tickerFull = [...NEWS, ...NEWS].join('   ◆   ');

  useEffect(() => {
    const update = () => setTime(
      new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    );
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  const tabs = [
    { key: 'air',   href: '/public',       label: '💨 Air Quality',   activeColor: '#FF8C33' },
    { key: 'water', href: '/public-water', label: '💧 Water Quality', activeColor: '#60a5fa' },
    { key: 'noise', href: '/public-noise', label: '🔊 Noise Levels',  activeColor: '#fbbf24' },
  ];

  return (
    <>
      {/* Tricolour stripe */}
      <div style={{ height: '5px', background: 'linear-gradient(to right,#FF6B00 33.33%,#FFFFFF 33.33% 66.66%,#138808 66.66%)', flexShrink: 0 }} />

      {/* Live news ticker */}
      <div style={{ background: '#1a2744', height: '32px', display: 'flex', alignItems: 'center', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ background: '#FF6B00', color: 'white', fontSize: '0.62rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 0.85rem', height: '100%', display: 'flex', alignItems: 'center', flexShrink: 0, fontFamily: 'Arial' }}>LATEST</div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ whiteSpace: 'nowrap', animation: 'ticker-scroll 40s linear infinite', color: '#c8d4e8', fontSize: '0.7rem', fontFamily: 'Arial', display: 'inline-block' }}>
            {tickerFull}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{tickerFull}
          </div>
        </div>
        <div style={{ padding: '0 0.85rem', height: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', animation: 'pulse-dot 2s infinite' }} />
          <span style={{ fontSize: '0.65rem', color: '#22c55e', fontWeight: '700', fontFamily: 'Arial' }}>LIVE</span>
        </div>
      </div>

      {/* Site header */}
      <div style={{ background: 'white', borderBottom: '2px solid #dde2ec', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/logo.jpeg" alt="PrithviNet" style={{ height: '52px', width: 'auto' }} />
          <div style={{ borderLeft: '2px solid #dde2ec', paddingLeft: '1rem' }}>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1a2744', fontFamily: 'Georgia' }}>PRITHVINET</div>
            <div style={{ fontSize: '0.7rem', color: '#6b7a96', fontFamily: 'Arial' }}>Citizen Environmental Portal · Maharashtra SPCB</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right', fontFamily: 'Arial' }}>
            <div style={{ fontSize: '0.65rem', color: '#6b7a96' }}>Updated: {time}</div>
            <div style={{ fontSize: '0.58rem', color: '#94a3b8' }}>{stationCount} stations active</div>
          </div>
          <a href="/" style={{ background: '#1a2744', color: 'white', fontSize: '0.7rem', fontFamily: 'Arial', fontWeight: '600', padding: '0.35rem 0.8rem', borderRadius: '3px', textDecoration: 'none', flexShrink: 0 }}>
            🔐 Staff Login
          </a>
        </div>
      </div>

      {/* Portal tab nav */}
      <div style={{ background: '#1a2744', display: 'flex', alignItems: 'center', height: '38px', padding: '0 1.5rem', flexShrink: 0 }}>
        {tabs.map(tab => (
          <a key={tab.key} href={tab.href} style={{
            display: 'flex', alignItems: 'center', padding: '0 1rem', height: '100%',
            color: activeTab === tab.key ? 'white' : '#94a3b8',
            fontSize: '0.78rem', fontFamily: 'Arial',
            fontWeight: activeTab === tab.key ? '700' : '500',
            textDecoration: 'none',
            borderBottom: activeTab === tab.key ? `3px solid ${tab.activeColor}` : '3px solid transparent',
            background: activeTab === tab.key ? 'rgba(255,255,255,0.07)' : 'none',
            transition: 'all 0.12s',
          }}>
            {tab.label}
          </a>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: '0.65rem', color: '#94a3b8', fontFamily: 'Arial' }}>
          Maharashtra State Pollution Control Board
        </div>
      </div>

      <style>{`
        @keyframes ticker-scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes pulse-dot { 0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(34,197,94,.4)} 50%{opacity:.8;box-shadow:0 0 0 5px rgba(34,197,94,0)} }
      `}</style>
    </>
  );
}
