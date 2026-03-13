'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, setUser } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      const user = login(email, password);
      if (user) { setUser(user); router.push(user.redirect); }
      else { setError('Invalid credentials. Please try again.'); setLoading(false); }
    }, 600);
  };

  const demos = [
    { label: 'Super Admin', email: 'admin@prithvinet.gov.in', password: 'admin123' },
    { label: 'Regional Officer', email: 'ro@prithvinet.gov.in', password: 'ro123' },
    { label: 'Industry User', email: 'industry@bharatsteel.in', password: 'industry123' },
  ];

  const portals = [
    {
      icon: '💨', label: 'Air Quality',
      desc: 'Live AQI, PM2.5, SO₂ and health advisories across Maharashtra',
      badge: '218 AQI', badgeLabel: 'Mumbai · Unhealthy',
      badgeColor: '#c0392b', topColor: '#1a6b3a',
      btnBg: '#1a6b3a', pillBg: '#fdf0ee', pillBorder: '#f5c6cb',
      href: '/public',
    },
    {
      icon: '💧', label: 'Water Quality',
      desc: 'pH, dissolved oxygen and contamination levels in rivers & lakes',
      badge: '2 Critical', badgeLabel: 'Mumbai · Nagpur',
      badgeColor: '#c0392b', topColor: '#1a5280',
      btnBg: '#1a5280', pillBg: '#e8f0ff', pillBorder: '#b8d0f0',
      href: '/public-water',
    },
    {
      icon: '🔊', label: 'Noise Levels',
      desc: 'Day & night decibel readings by zone across major cities',
      badge: '5 Breaches', badgeLabel: 'Residential zones',
      badgeColor: '#c0392b', topColor: '#7d4e00',
      btnBg: '#7d4e00', pillBg: '#fff8ee', pillBorder: '#f0d8a0',
      href: '/public-noise',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f0f8f3', fontFamily: 'Segoe UI, Arial, sans-serif', display: 'flex', flexDirection: 'column' }}>

      {/* Tricolour stripe */}
      <div style={{ height: '4px', background: 'linear-gradient(90deg,#FF9933 33.3%,#fff 33.3%,#fff 66.6%,#138808 66.6%)' }} />

      {/* Top bar */}
      <div style={{ background: '#1a6b3a', padding: '0.5rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
          <span style={{ fontSize: '1.4rem' }}>🌿</span>
          <div>
            <div style={{ fontSize: '0.55rem', color: '#a8d5bc', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Government of Maharashtra</div>
            <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'white', letterSpacing: '0.01em' }}>PrithviNet</div>
          </div>
        </div>
        <div style={{ fontSize: '0.6rem', color: '#a8d5bc', textAlign: 'right', lineHeight: 1.7 }}>
          Maharashtra State Pollution Control Board<br/>Environmental Monitoring &amp; Compliance System
        </div>
      </div>
      <div style={{ background: '#155a30', borderBottom: '3px solid #e8a000', padding: '0.25rem 2.5rem' }}>
        <span style={{ fontSize: '0.62rem', color: '#c8e8d4' }}>Integrated monitoring — Air · Water · Noise · Open data for citizens · RTI compliant</span>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 2.5rem', gap: '2.5rem', flexWrap: 'wrap' }}>

        {/* ── LEFT: Login form ── */}
        <div style={{ width: '320px', flexShrink: 0 }}>
          <div style={{ background: 'white', border: '1px solid #c8e0d2', borderTop: '4px solid #1a6b3a', borderRadius: '6px', boxShadow: '0 2px 16px rgba(26,107,58,0.1)' }}>

            <div style={{ padding: '1.1rem 1.4rem', borderBottom: '1px solid #e8f5ee', background: '#f7fcf9', borderRadius: '2px 2px 0 0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: '#6b8c7a', letterSpacing: '0.09em', textTransform: 'uppercase' }}>Authorised Personnel Only</div>
              <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1a6b3a', marginTop: '0.15rem' }}>Official Login</div>
              <div style={{ fontSize: '0.62rem', color: '#94a3b8', marginTop: '0.1rem' }}>For Government staff &amp; Industry users</div>
            </div>

            <div style={{ padding: '1.2rem 1.4rem' }}>
              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ display: 'block', fontSize: '0.67rem', fontWeight: '600', color: '#3d5a48', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="Enter your official email"
                    style={{ width: '100%', border: '1px solid #a0c8b4', borderRadius: '3px', padding: '0.5rem 0.7rem', fontSize: '0.85rem', color: '#1a2e22', background: 'white', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.67rem', fontWeight: '600', color: '#3d5a48', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                    placeholder="Enter your password"
                    style={{ width: '100%', border: '1px solid #a0c8b4', borderRadius: '3px', padding: '0.5rem 0.7rem', fontSize: '0.85rem', color: '#1a2e22', background: 'white', boxSizing: 'border-box' }} />
                </div>
                {error && (
                  <div style={{ background: '#fdf0ee', border: '1px solid #f5c6cb', borderRadius: '3px', padding: '0.4rem 0.65rem', fontSize: '0.75rem', color: '#721c24', marginBottom: '0.85rem' }}>{error}</div>
                )}
                <button type="submit" disabled={loading}
                  style={{ width: '100%', padding: '0.6rem', background: loading ? '#4a9e6a' : '#1a6b3a', color: 'white', border: 'none', borderRadius: '3px', fontSize: '0.875rem', fontWeight: '700', cursor: loading ? 'default' : 'pointer', letterSpacing: '0.02em' }}>
                  {loading ? 'Authenticating…' : 'Login to Portal'}
                </button>
              </form>

              <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid #e8f5ee' }}>
                <div style={{ fontSize: '0.58rem', color: '#94a3b8', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>Quick Demo Access</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.35rem' }}>
                  {demos.map(d => (
                    <button key={d.label} onClick={() => { setEmail(d.email); setPassword(d.password); }}
                      style={{ background: '#f7fcf9', border: '1px solid #c8e0d2', borderRadius: '3px', padding: '0.35rem 0.2rem', fontSize: '0.65rem', color: '#1a6b3a', fontWeight: '600', cursor: 'pointer', textAlign: 'center' }}>
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '0.75rem', fontSize: '0.58rem', color: '#94a3b8', textAlign: 'center', lineHeight: 1.8 }}>
            © 2024 Maharashtra SPCB · Secure Government Portal<br/>
            Unauthorised access is prohibited under IT Act 2000
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <div style={{ width: '1px', height: '80px', background: '#c8e0d2' }} />
          <span style={{ fontSize: '0.65rem', fontWeight: '600', color: '#6b8c7a', background: 'white', border: '1px solid #c8e0d2', borderRadius: '20px', padding: '0.2rem 0.55rem' }}>OR</span>
          <div style={{ width: '1px', height: '80px', background: '#c8e0d2' }} />
        </div>

        {/* ── RIGHT: 3 public portals ── */}
        <div style={{ flex: 1, minWidth: '320px', maxWidth: '600px' }}>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#3d5a48', textTransform: 'uppercase', letterSpacing: '0.09em' }}>Public Information Portals</div>
            <div style={{ fontSize: '0.65rem', color: '#6b8c7a', marginTop: '0.2rem' }}>Live environmental data — no login required</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.85rem' }}>
            {portals.map(p => (
              <div key={p.label} style={{ background: 'white', border: '1px solid #dde8e0', borderTop: `3px solid ${p.topColor}`, borderRadius: '6px', padding: '1.1rem 1rem', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>

                <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem', lineHeight: 1 }}>{p.icon}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1a2e22', marginBottom: '0.4rem' }}>{p.label}</div>
                <div style={{ fontSize: '0.68rem', color: '#6b8c7a', lineHeight: 1.6, flex: 1, marginBottom: '0.75rem' }}>{p.desc}</div>

                {/* Live reading pill */}
                <div style={{ background: p.pillBg, border: `1px solid ${p.pillBorder}`, borderRadius: '3px', padding: '0.35rem 0.6rem', marginBottom: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.6rem', color: '#6b8c7a' }}>Live now</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '800', color: p.badgeColor, lineHeight: 1 }}>{p.badge}</div>
                    <div style={{ fontSize: '0.58rem', color: '#94a3b8' }}>{p.badgeLabel}</div>
                  </div>
                </div>

                <button onClick={() => router.push(p.href)}
                  style={{ width: '100%', padding: '0.5rem', background: p.btnBg, color: 'white', border: 'none', borderRadius: '3px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.01em' }}>
                  View Dashboard →
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1a6b3a' }} />
            <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>All portals show real-time readings · Refreshed every 5 minutes · Open access</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: '#1a6b3a', padding: '0.35rem 2.5rem', textAlign: 'center' }}>
        <span style={{ fontSize: '0.58rem', color: '#a8d5bc' }}>
          PrithviNet · Maharashtra State Pollution Control Board · Ministry of Environment, Forest and Climate Change, Government of India
        </span>
      </div>
    </div>
  );
}
