'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, setUser } from '@/lib/auth';

const NEWS = [
  '🔴 LIVE: Bharat Steel Works SO₂ at 142 ppm — Limit 80 ppm — Inspection Ordered',
  '⚠ Nag River Nagpur water quality CRITICAL — Immediate action required by MPCB',
  '📋 Monthly compliance reports due 31 March 2026 — All industries must submit',
  '🌿 Maharashtra SPCB Annual Report 2025-26 now available — Download at mpcb.gov.in',
  '✅ Godavari River Nashik maintaining GOOD quality for 6th consecutive month',
];

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
      if (user) {
        setUser(user);
        router.push(user.redirect);
      } else {
        setError('Invalid credentials. Please check and try again.');
        setLoading(false);
      }
    }, 600);
  };

  const demoLogins = [
    { label:'Super Admin',       email:'admin@prithvinet.gov.in', password:'admin123', color:'#1a4e8a', bg:'#e8f0f8' },
    { label:'Regional Officer',  email:'ro@prithvinet.gov.in',    password:'ro123',    color:'#1a6b3a', bg:'#e8f5ee' },
    { label:'Industry User',     email:'industry@bharatsteel.in', password:'industry123', color:'#5a3500', bg:'#fff8ee' },
  ];

  const tickerFull = [...NEWS, ...NEWS].join('   ◆   ');

  return (
    <div style={{ minHeight:'100vh', background:'var(--light-gray)', display:'flex', flexDirection:'column' }}>

      {/* Tricolour */}
      <div style={{ height:'5px', background:'linear-gradient(to right, #FF6B00 33.33%, #FFFFFF 33.33% 66.66%, #138808 66.66%)' }} />

      {/* Ticker */}
      <div style={{ background:'#1a2744', height:'32px', display:'flex', alignItems:'center', overflow:'hidden' }}>
        <div style={{ background:'#FF6B00', color:'white', fontSize:'0.62rem', fontWeight:'700', letterSpacing:'0.1em', textTransform:'uppercase', padding:'0 0.85rem', height:'100%', display:'flex', alignItems:'center', flexShrink:0, fontFamily:'Arial' }}>LATEST</div>
        <div style={{ flex:1, overflow:'hidden', position:'relative' }}>
          <div style={{ whiteSpace:'nowrap', animation:'ticker-scroll 35s linear infinite', color:'#c8d4e8', fontSize:'0.7rem', fontFamily:'Arial', display:'inline-block' }}>
            {tickerFull}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{tickerFull}
          </div>
        </div>
        <style>{`@keyframes ticker-scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`}</style>
      </div>

      {/* Header */}
      <div style={{ background:'white', borderBottom:'2px solid var(--border)', padding:'1rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1.25rem' }}>
          <img src="/logo.jpeg" alt="PrithviNet" style={{ height:'68px', width:'auto' }} />
          <div style={{ borderLeft:'2px solid var(--border)', paddingLeft:'1.25rem' }}>
            <div style={{ fontSize:'1.25rem', fontWeight:'800', color:'var(--navy)', fontFamily:'Georgia', letterSpacing:'0.02em' }}>PRITHVINET</div>
            <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', fontFamily:'Arial', marginTop:'0.1rem' }}>Environment Monitoring &amp; Compliance Platform</div>
            <div style={{ fontSize:'0.65rem', color:'#94a3b8', fontFamily:'Arial', marginTop:'0.05rem' }}>Maharashtra State Pollution Control Board</div>
          </div>
        </div>
        <div style={{ textAlign:'right', fontFamily:'Arial' }}>
          <div style={{ fontSize:'0.65rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em' }}>Government of Maharashtra</div>
          <div style={{ fontSize:'0.62rem', color:'#94a3b8', marginTop:'0.15rem' }}>Established under Environment (Protection) Act, 1986</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, display:'flex', alignItems:'stretch' }}>

        {/* Left — hero / info panel */}
        <div style={{ flex:'1.1', background:'var(--navy)', display:'flex', flexDirection:'column', padding:'3rem 3.5rem', position:'relative', overflow:'hidden' }}>
          {/* Background pattern */}
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle at 20% 80%, rgba(26,78,138,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(19,136,8,0.15) 0%, transparent 40%)', pointerEvents:'none' }} />

          <div style={{ position:'relative', zIndex:1 }}>
            <div style={{ fontSize:'0.7rem', color:'#7b8fba', textTransform:'uppercase', letterSpacing:'0.12em', fontFamily:'Arial', marginBottom:'1rem' }}>Smart Environmental Governance</div>
            <h1 style={{ fontSize:'2rem', fontWeight:'800', color:'white', fontFamily:'Georgia', lineHeight:1.3, marginBottom:'0.85rem' }}>
              Real-time<br/>
              <span style={{ color:'#FF8C33' }}>Environmental</span><br/>
              Monitoring
            </h1>
            <p style={{ fontSize:'0.82rem', color:'#94a3b8', fontFamily:'Arial', lineHeight:1.8, marginBottom:'2rem', maxWidth:'380px' }}>
              Integrated air quality, water quality, and noise level monitoring across Maharashtra — connecting regulators, industries, and citizens.
            </p>



            {/* Public portals */}
            <div style={{ fontSize:'0.68rem', color:'#7b8fba', textTransform:'uppercase', letterSpacing:'0.1em', fontFamily:'Arial', marginBottom:'0.75rem' }}>Public Access — No Login Required</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
              {[
                { href:'/public',       icon:'💨', label:'Air Quality Portal',   sub:'Live AQI across Maharashtra cities',     color:'#34d399' },
                { href:'/public-water', icon:'💧', label:'Water Quality Portal', sub:'River & reservoir water quality data',   color:'#60a5fa' },
                { href:'/public-noise', icon:'🔊', label:'Noise Level Portal',   sub:'Zone-wise noise monitoring data',        color:'#fbbf24' },
              ].map(p => (
                <a key={p.href} href={p.href}
                  style={{ display:'flex', alignItems:'center', gap:'0.85rem', padding:'0.75rem 1rem', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'6px', cursor:'pointer', textDecoration:'none', transition:'all 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.11)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'}>
                  <span style={{ fontSize:'1.3rem' }}>{p.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'0.78rem', fontWeight:'700', color:p.color, fontFamily:'Arial' }}>{p.label}</div>
                    <div style={{ fontSize:'0.62rem', color:'#94a3b8', fontFamily:'Arial' }}>{p.sub}</div>
                  </div>
                  <span style={{ color:'#94a3b8', fontSize:'0.8rem' }}>→</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right — login form */}
        <div style={{ width:'420px', flexShrink:0, background:'white', display:'flex', flexDirection:'column', justifyContent:'center', padding:'3rem 2.5rem', borderLeft:'2px solid var(--border)' }}>
          <div style={{ marginBottom:'2rem' }}>
            <div style={{ fontSize:'0.65rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.1em', fontFamily:'Arial', marginBottom:'0.5rem' }}>Official Portal Login</div>
            <h2 style={{ fontSize:'1.4rem', fontWeight:'800', color:'var(--navy)', fontFamily:'Georgia' }}>Sign In</h2>
            <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', fontFamily:'Arial', marginTop:'0.25rem' }}>Authorised personnel only</p>
          </div>

          {/* Demo quick login */}
          <div style={{ marginBottom:'1.5rem' }}>
            <div style={{ fontSize:'0.62rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.09em', fontFamily:'Arial', marginBottom:'0.5rem' }}>Quick Demo Access</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
              {demoLogins.map(d => (
                <button key={d.label} onClick={() => { setEmail(d.email); setPassword(d.password); }}
                  style={{ display:'flex', alignItems:'center', gap:'0.6rem', padding:'0.5rem 0.75rem', background:d.bg, border:`1px solid ${d.color}40`, borderRadius:'4px', cursor:'pointer', textAlign:'left' }}>
                  <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:d.color, flexShrink:0 }} />
                  <span style={{ fontSize:'0.75rem', fontWeight:'600', color:d.color, fontFamily:'Arial' }}>{d.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.5rem' }}>
            <div style={{ flex:1, height:'1px', background:'var(--border)' }} />
            <span style={{ fontSize:'0.65rem', color:'var(--text-muted)', fontFamily:'Arial' }}>OR ENTER CREDENTIALS</span>
            <div style={{ flex:1, height:'1px', background:'var(--border)' }} />
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom:'1rem' }}>
              <label style={{ display:'block', fontSize:'0.68rem', fontWeight:'700', color:'var(--text-mid)', textTransform:'uppercase', letterSpacing:'0.07em', fontFamily:'Arial', marginBottom:'0.4rem' }}>Email ID</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="user@domain.gov.in"
                style={{ width:'100%', padding:'0.65rem 0.85rem', border:'1.5px solid var(--border)', borderRadius:'4px', fontSize:'0.875rem', color:'var(--text-dark)', fontFamily:'Arial', background:'var(--off-white)', outline:'none' }}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'var(--navy)'}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'var(--border)'}/>
            </div>
            <div style={{ marginBottom:'1.25rem' }}>
              <label style={{ display:'block', fontSize:'0.68rem', fontWeight:'700', color:'var(--text-mid)', textTransform:'uppercase', letterSpacing:'0.07em', fontFamily:'Arial', marginBottom:'0.4rem' }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                style={{ width:'100%', padding:'0.65rem 0.85rem', border:'1.5px solid var(--border)', borderRadius:'4px', fontSize:'0.875rem', color:'var(--text-dark)', fontFamily:'Arial', background:'var(--off-white)', outline:'none' }}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'var(--navy)'}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'var(--border)'}/>
            </div>
            {error && (
              <div style={{ background:'#f8d7da', border:'1px solid #f5c6cb', borderRadius:'4px', padding:'0.5rem 0.75rem', marginBottom:'1rem', fontSize:'0.75rem', color:'#721c24', fontFamily:'Arial' }}>⚠ {error}</div>
            )}
            <button type="submit" disabled={loading} className="btn-primary"
              style={{ width:'100%', padding:'0.75rem', fontSize:'0.88rem', borderRadius:'4px', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
              {loading ? ' Verifying...' : ' Sign In to Portal'}
            </button>
          </form>

          <div style={{ marginTop:'1.5rem', padding:'0.85rem', background:'var(--off-white)', border:'1px solid var(--border)', borderRadius:'4px', fontSize:'0.68rem', color:'var(--text-muted)', fontFamily:'Arial', lineHeight:1.7, textAlign:'center' }}>
            This is an official Maharashtra Government portal.<br/>
            Unauthorised access is a criminal offence under IT Act 2000.
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background:'var(--navy)', borderTop:'1px solid rgba(255,255,255,0.1)', padding:'0.75rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ fontSize:'0.62rem', color:'#7b8fba', fontFamily:'Arial' }}>© 2026 Maharashtra State Pollution Control Board · PrithviNet v2.0</div>
        <div style={{ fontSize:'0.62rem', color:'#7b8fba', fontFamily:'Arial' }}>National Informatics Centre · Designed in India 🇮🇳</div>
      </div>
    </div>
  );
}
