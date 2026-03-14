'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, setUser } from '@/lib/auth';

const NEWS = [
  'Bharat Steel Works SO2 at 142 ppm — Limit 80 ppm — Inspection Ordered',
  'Nag River Nagpur water quality CRITICAL — Immediate remediation required',
  'Monthly compliance reports due 31 March 2026 — All industries must submit',
  'SPCB Annual Report 2025-26 now available at mpcb.gov.in',
  'Godavari River Nashik maintaining GOOD quality — 6th consecutive month',
];

export default function LoginPage() {
  const router   = useRouter();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    setTimeout(() => {
      const user = login(email, password);
      if (user) { setUser(user); router.push(user.redirect); }
      else { setError('Invalid credentials. Please check and try again.'); setLoading(false); }
    }, 600);
  };

  const demoLogins = [
    { label: 'Super Admin',      email: 'admin@prithvinet.gov.in', password: 'admin123',    color: '#1a4e8a', bg: '#eef4fb', role: 'Full system access'  },
    { label: 'Regional Officer', email: 'ro@prithvinet.gov.in',    password: 'ro123',       color: '#166534', bg: '#f0fdf4', role: 'Nagpur zone'         },
    { label: 'Industry User',    email: 'industry@bharatsteel.in', password: 'industry123', color: '#92400e', bg: '#fffbeb', role: 'Bharat Steel Works'  },
  ];

  const tickerText = [...NEWS, ...NEWS].join('     —     ');

  const publicPortals = [
    { href: '/public',       label: 'Air Quality Portal',   sub: 'Live AQI across Maharashtra cities',         dot: '#16a34a' },
    { href: '/public-water', label: 'Water Quality Portal', sub: 'River and reservoir water quality data',     dot: '#0284c7' },
    { href: '/public-noise', label: 'Noise Monitoring',     sub: 'Zone-wise decibel levels, day and night',    dot: '#d97706' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Arial, sans-serif', background: '#f5f6fa' }}>

      {/* Tricolour bar */}
      <div style={{ height: '5px', background: 'linear-gradient(to right, #FF6B00 33.33%, #ffffff 33.33% 66.66%, #138808 66.66%)', flexShrink: 0 }} />

      {/* Ticker — soft dark */}
      <div style={{ background: '#2d3a5c', height: '34px', display: 'flex', alignItems: 'center', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ background: '#e05a2b', color: 'white', fontSize: '0.56rem', fontWeight: '800', letterSpacing: '0.14em', padding: '0 1.1rem', height: '100%', display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0, textTransform: 'uppercase' }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'white', animation: 'blink 1.2s infinite' }} />
          LIVE
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ whiteSpace: 'nowrap', animation: 'ticker 50s linear infinite', color: '#c8d4e8', fontSize: '0.64rem', display: 'inline-block', paddingLeft: '1.5rem', letterSpacing: '0.01em' }}>
            {tickerText}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{tickerText}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', paddingRight: '1.25rem', flexShrink: 0 }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', animation: 'pulseGreen 2s infinite' }} />
          <span style={{ fontSize: '0.56rem', color: '#4ade80', fontWeight: '800', letterSpacing: '0.1em' }}>ONLINE</span>
        </div>
      </div>

      {/* Header — white, clean */}
      <div style={{ background: 'white', borderBottom: '2px solid #e8e0d5', padding: '0.8rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
          <img src="/logo.jpeg" alt="PrithviNet" style={{ height: '54px', width: 'auto' }} />
          <div style={{ borderLeft: '2px solid #e8e0d5', paddingLeft: '1.1rem' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#1a2744', fontFamily: 'Georgia', letterSpacing: '0.05em', lineHeight: 1 }}>PRITHVINET</div>
            <div style={{ fontSize: '0.68rem', color: '#6b7a96', marginTop: '0.2rem' }}>Environmental Monitoring and Compliance Platform</div>
            <div style={{ fontSize: '0.58rem', color: '#94a3b8', marginTop: '0.04rem' }}>Maharashtra State Pollution Control Board</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.63rem', fontWeight: '700', color: '#1a2744', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Government of Maharashtra</div>
          <div style={{ fontSize: '0.57rem', color: '#94a3b8', marginTop: '0.18rem' }}>Established under Environment (Protection) Act, 1986</div>
        </div>
      </div>

      {/* Main two-panel */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

        {/* LEFT — saffron-toned pastel hero */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(145deg, #fdf3e7 0%, #fde8c8 40%, #fcebd0 100%)',
          display: 'flex', flexDirection: 'row', alignItems: 'center',
          padding: '3rem 4rem 3rem 4.5rem',
          position: 'relative', overflow: 'hidden',
          borderRight: '1px solid #f0e0cc',
          gap: '2rem',
        }}>

          {/* Decorative circle top-right */}
          <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,0,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />
          {/* Decorative circle bottom-left */}
          <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(19,136,8,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />
          {/* Saffron left accent bar */}
          <div style={{ position: 'absolute', left: 0, top: '18%', height: '64%', width: '4px', background: 'linear-gradient(to bottom, transparent, #FF6B00 25%, #FF6B00 75%, transparent)', borderRadius: '0 3px 3px 0' }} />

          <div style={{ position: 'relative', zIndex: 1, flex: 1, minWidth: 0 }}>

            {/* Live pill */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(22,163,74,0.09)', border: '1px solid rgba(22,163,74,0.22)', borderRadius: '30px', padding: '0.3rem 0.95rem', marginBottom: '2rem' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#16a34a', animation: 'pulseGreen 2s infinite' }} />
              <span style={{ fontSize: '0.58rem', color: '#15803d', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Live Monitoring Active</span>
            </div>

            {/* Headline */}
            <div style={{ fontSize: '0.7rem', color: '#a07850', textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: '700', marginBottom: '0.65rem' }}>
              Smart Environmental Governance
            </div>
            <h1 style={{ margin: '0 0 1.5rem 0', lineHeight: 1.18, fontFamily: 'Georgia' }}>
              <span style={{ display: 'block', fontSize: '2.6rem', fontWeight: '900', color: '#1a2744', letterSpacing: '-0.01em' }}>Real-time</span>
              <span style={{ display: 'block', fontSize: '2.6rem', fontWeight: '900', color: '#d45f0a', letterSpacing: '-0.01em' }}>Environmental</span>
              <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: '700', color: '#8a6a50', letterSpacing: '0.01em', marginTop: '0.1rem' }}>Monitoring Platform</span>
            </h1>

            <p style={{ fontSize: '0.82rem', color: '#6b5744', lineHeight: 1.82, margin: '0 0 2.5rem 0', maxWidth: '420px' }}>
              Connecting regulators, industries and citizens across Maharashtra through unified air, water and noise monitoring powered by real-time data and AI compliance tools.
            </p>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1, height: '1px', background: '#e8d5be' }} />
              <span style={{ fontSize: '0.56rem', color: '#b89070', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: '700' }}>Public Access — No Login Required</span>
              <div style={{ flex: 1, height: '1px', background: '#e8d5be' }} />
            </div>

            {/* Portal cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {publicPortals.map(p => (
                <a key={p.href} href={p.href}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.72)', border: '1px solid rgba(200,170,130,0.3)', borderRadius: '8px', textDecoration: 'none', transition: 'all 0.15s', boxShadow: '0 1px 3px rgba(180,120,60,0.06)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.95)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(180,120,60,0.12)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.72)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(180,120,60,0.06)'; }}>
                  <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: p.dot, flexShrink: 0, boxShadow: `0 0 5px ${p.dot}60` }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1a2744' }}>{p.label}</div>
                    <div style={{ fontSize: '0.58rem', color: '#8a7060', marginTop: '0.08rem' }}>{p.sub}</div>
                  </div>
                  <span style={{ color: '#c0a080', fontSize: '0.8rem' }}>›</span>
                </a>
              ))}
            </div>
          </div>

          {/* Maharashtra state map SVG */}
          <div style={{ flexShrink: 0, width: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {/* Soft glow behind map */}
            <div style={{ position: 'absolute', width: '340px', height: '340px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,101,52,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <img
              src="/india-map.png"
              alt="India map with Maharashtra highlighted"
              style={{
                width: '520px',
                height: 'auto',
                mixBlendMode: 'multiply',
                position: 'relative',
                zIndex: 1,
                filter: 'drop-shadow(0 4px 16px rgba(22,101,52,0.15))',
              }}
            />
            <div style={{ marginTop: '0.75rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#15803d', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Maharashtra</div>
              <div style={{ fontSize: '0.56rem', color: '#a07850', marginTop: '0.15rem', letterSpacing: '0.06em' }}>10 monitoring stations statewide</div>
            </div>
          </div>

        </div>

        {/* RIGHT — white login panel */}
        <div style={{ width: '420px', flexShrink: 0, background: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2.75rem 2.5rem', borderLeft: '1px solid #e8e0d5', overflowY: 'auto', boxShadow: '-2px 0 12px rgba(0,0,0,0.04)' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{ height: '1px', flex: 1, background: '#f0ebe3' }} />
            <span style={{ fontSize: '0.55rem', color: '#b0a090', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: '700' }}>Official Portal Login</span>
            <div style={{ height: '1px', flex: 1, background: '#f0ebe3' }} />
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#1a2744', fontFamily: 'Georgia', margin: '0 0 0.25rem 0', letterSpacing: '-0.01em' }}>Sign In</h2>
          <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '0 0 1.75rem 0' }}>Authorised personnel only</p>

          {/* Demo buttons */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.57rem', color: '#b0a090', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: '700', marginBottom: '0.6rem' }}>Quick Demo Access</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem' }}>
              {demoLogins.map(d => (
                <button key={d.label}
                  onClick={() => { setEmail(d.email); setPassword(d.password); }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.08rem', padding: '0.6rem 0.75rem', background: d.bg, border: `1.5px solid ${d.color}18`, borderRadius: '7px', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.12s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = d.color + '55'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = d.color + '18'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', color: d.color }}>{d.label}</span>
                  </div>
                  <div style={{ fontSize: '0.56rem', color: '#94a3b8', paddingLeft: '0.9rem', marginTop: '0.04rem' }}>{d.role}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.4rem' }}>
            <div style={{ flex: 1, height: '1px', background: '#f0ebe3' }} />
            <span style={{ fontSize: '0.56rem', color: '#b0a090', letterSpacing: '0.08em' }}>OR ENTER CREDENTIALS</span>
            <div style={{ flex: 1, height: '1px', background: '#f0ebe3' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '0.9rem' }}>
              <label style={{ display: 'block', fontSize: '0.6rem', fontWeight: '700', color: '#6b7a96', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Email ID</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="user@domain.gov.in"
                style={{ width: '100%', padding: '0.72rem 0.9rem', border: '1.5px solid #e8e4dc', borderRadius: '7px', fontSize: '0.875rem', color: '#1a2744', background: '#fdfcfb', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.12s' }}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#d45f0a'}
                onBlur={e  => (e.target as HTMLInputElement).style.borderColor = '#e8e4dc'} />
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.6rem', fontWeight: '700', color: '#6b7a96', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                style={{ width: '100%', padding: '0.72rem 0.9rem', border: '1.5px solid #e8e4dc', borderRadius: '7px', fontSize: '0.875rem', color: '#1a2744', background: '#fdfcfb', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.12s' }}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#d45f0a'}
                onBlur={e  => (e.target as HTMLInputElement).style.borderColor = '#e8e4dc'} />
            </div>

            {error && (
              <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderLeft: '3px solid #e05a2b', borderRadius: '6px', padding: '0.5rem 0.85rem', marginBottom: '1rem', fontSize: '0.7rem', color: '#c0392b' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '0.82rem', fontSize: '0.88rem', fontWeight: '800', background: loading ? '#c8d0dc' : '#d45f0a', color: 'white', border: 'none', borderRadius: '7px', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.03em', transition: 'background 0.15s' }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#b84e06'; }}
              onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#d45f0a'; }}>
              {loading ? 'Verifying...' : 'Sign In to Portal'}
            </button>
          </form>

          {/* Security notice */}
          <div style={{ marginTop: '1.2rem', padding: '0.85rem 1rem', background: '#fdfaf7', border: '1px solid #f0e8dc', borderRadius: '7px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.62rem', fontWeight: '700', color: '#6b5744', marginBottom: '0.22rem' }}>Official Government Portal</div>
            <div style={{ fontSize: '0.59rem', color: '#b0a090', lineHeight: 1.65 }}>
              Unauthorised access is a criminal offence under IT Act, 2000.
            </div>
          </div>

          <div style={{ marginTop: '0.85rem', textAlign: 'center', fontSize: '0.6rem', color: '#b0a090' }}>
            Need help? <span style={{ color: '#1a4e8a', fontWeight: '700' }}>helpdesk@mpcb.gov.in</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: '#2d3a5c', padding: '0.8rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <span style={{ fontSize: '0.58rem', color: '#8899bb' }}>2026 Maharashtra State Pollution Control Board · PrithviNet v2.0</span>
        <div style={{ display: 'flex', gap: '1.75rem' }}>
          {['Privacy Policy', 'Terms of Use', 'Accessibility', 'NIC India'].map(l => (
            <span key={l} style={{ fontSize: '0.58rem', color: '#8899bb', cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ticker     { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes pulseGreen { 0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(22,163,74,0.4)} 50%{opacity:.8;box-shadow:0 0 0 6px rgba(22,163,74,0)} }
        @keyframes blink      { 0%,100%{opacity:1} 50%{opacity:0.2} }
      `}</style>
    </div>
  );
}
