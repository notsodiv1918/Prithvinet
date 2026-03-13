'use client';
import { useState, useEffect } from 'react';
import { WATER_STATIONS, WATER_LIMITS } from '@/data/waterNoiseData';

export default function PublicWaterPage() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' }));
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  const NEWS = [
    '⚠ Nag River (Nagpur) water quality CRITICAL — DO: 1.9 mg/L, BOD: 24.1 mg/L · Immediate remediation required',
    '🔴 LIVE: Bharat Steel Works SO₂ at 142 ppm — Inspection Ordered by MPCB',
    '📋 Monthly compliance reports due 31 March 2026 — All industries must submit',
    '✅ Godavari River (Nashik) maintaining GOOD quality for 6th consecutive month',
    '🌿 Maharashtra SPCB Annual Environment Report 2025-26 published — Download at mpcb.gov.in',
  ];
  const tickerFull = [...NEWS, ...NEWS].join('   ◆   ');

  const critical = WATER_STATIONS.filter(s => s.quality === 'Critical');
  const poor     = WATER_STATIONS.filter(s => s.quality === 'Poor');
  const good     = WATER_STATIONS.filter(s => s.quality === 'Good');

  const qColor = (q: string) => q==='Good'?'#1a6b3a':q==='Moderate'?'#856404':q==='Poor'?'#c0550a':'#c0392b';
  const qBg    = (q: string) => q==='Good'?'#d4edda':q==='Moderate'?'#fff3cd':q==='Poor'?'#fde9d9':'#fdf0ee';

  return (
    <div style={{ minHeight:'100vh', background:'var(--light-gray)', display:'flex', flexDirection:'column' }}>

      {/* Tricolour */}
      <div style={{ height:'5px', background:'linear-gradient(to right,#FF6B00 33.33%,#FFFFFF 33.33% 66.66%,#138808 66.66%)' }} />

      {/* Ticker */}
      <div style={{ background:'var(--navy)', height:'32px', display:'flex', alignItems:'center', overflow:'hidden' }}>
        <div style={{ background:'#FF6B00', color:'white', fontSize:'0.62rem', fontWeight:'700', letterSpacing:'0.1em', textTransform:'uppercase', padding:'0 0.85rem', height:'100%', display:'flex', alignItems:'center', flexShrink:0, fontFamily:'Arial' }}>LATEST</div>
        <div style={{ flex:1, overflow:'hidden' }}>
          <div style={{ whiteSpace:'nowrap', animation:'ticker-scroll 35s linear infinite', color:'#c8d4e8', fontSize:'0.7rem', fontFamily:'Arial', display:'inline-block' }}>
            {tickerFull}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{tickerFull}
          </div>
        </div>
        <div style={{ background:'rgba(255,255,255,0.06)', borderLeft:'1px solid rgba(255,255,255,0.1)', padding:'0 0.85rem', height:'100%', display:'flex', alignItems:'center', gap:'0.5rem', flexShrink:0 }}>
          <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#22c55e', animation:'pulse-dot 2s infinite' }} />
          <span style={{ fontSize:'0.65rem', color:'#22c55e', fontWeight:'700', fontFamily:'Arial' }}>LIVE</span>
        </div>
        <style>{`
          @keyframes ticker-scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
          @keyframes pulse-dot { 0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(34,197,94,.4)} 50%{opacity:.8;box-shadow:0 0 0 5px rgba(34,197,94,0)} }
        `}</style>
      </div>

      {/* Header */}
      <div style={{ background:'white', borderBottom:'2px solid var(--border)', padding:'0.85rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1.1rem' }}>
          <img src="/logo.jpeg" alt="PrithviNet" style={{ height:'60px', width:'auto' }} />
          <div style={{ borderLeft:'2px solid var(--border)', paddingLeft:'1rem' }}>
            <div style={{ fontSize:'1.05rem', fontWeight:'800', color:'var(--navy)', fontFamily:'Georgia' }}>PRITHVINET</div>
            <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', fontFamily:'Arial', marginTop:'0.1rem' }}>Public Water Quality Portal</div>
            <div style={{ fontSize:'0.62rem', color:'#94a3b8', fontFamily:'Arial' }}>Maharashtra State Pollution Control Board</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <div style={{ textAlign:'right', fontFamily:'Arial' }}>
            <div style={{ fontSize:'0.68rem', color:'var(--text-muted)' }}>Data updated: {time}</div>
            <div style={{ fontSize:'0.6rem', color:'#94a3b8', marginTop:'0.1rem' }}>Refreshes every 60 seconds</div>
          </div>
          <a href="/" style={{ background:'var(--navy)', color:'white', fontSize:'0.72rem', fontFamily:'Arial', fontWeight:'600', padding:'0.38rem 0.85rem', borderRadius:'3px', textDecoration:'none' }}>🔐 Staff Login</a>
        </div>
      </div>

      {/* Portal nav */}
      <div style={{ background:'var(--navy)', display:'flex', alignItems:'center', height:'38px', padding:'0 1.5rem' }}>
        {[
          { href:'/public',       label:'💨 Air Quality',   active:false },
          { href:'/public-water', label:'💧 Water Quality', active:true  },
          { href:'/public-noise', label:'🔊 Noise Levels',  active:false },
        ].map(item => (
          <a key={item.href} href={item.href}
            style={{ display:'flex', alignItems:'center', padding:'0 1rem', height:'100%', color:item.active?'white':'#94a3b8', fontSize:'0.78rem', fontFamily:'Arial', fontWeight:item.active?'700':'500', textDecoration:'none', borderBottom:item.active?'3px solid #60a5fa':'3px solid transparent', background:item.active?'rgba(255,255,255,0.07)':'none' }}>
            {item.label}
          </a>
        ))}
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#22c55e' }} />
          <span style={{ fontSize:'0.65rem', color:'#94a3b8', fontFamily:'Arial' }}>Real-time · {WATER_STATIONS.length} stations active</span>
        </div>
      </div>

      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'1.5rem 2rem', width:'100%' }}>

        {/* Critical alert */}
        {critical.length > 0 && (
          <div className="alert-critical" style={{ marginBottom:'1.5rem', display:'flex', gap:'0.85rem', alignItems:'flex-start' }}>
            <span style={{ fontSize:'1.3rem', flexShrink:0 }}>⚠️</span>
            <div>
              <strong style={{ fontSize:'0.85rem', color:'#721c24' }}>Water Quality Alert — {critical.length} Critical Site{critical.length>1?'s':''} Detected</strong>
              <div style={{ fontSize:'0.78rem', color:'#721c24', marginTop:'0.25rem', lineHeight:1.7 }}>
                {critical.map(s => `${s.name} (DO: ${s.do} mg/L, BOD: ${s.bod} mg/L)`).join(' · ')}.
                Avoid contact with these water bodies. Do not use for drinking, bathing, or fishing until further notice.
              </div>
            </div>
          </div>
        )}

        {/* Summary row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
          {[
            { label:'Monitoring Sites', value:WATER_STATIONS.length, color:'#1a5280' },
            { label:'Good Quality',     value:good.length,           color:'#1a6b3a' },
            { label:'Poor Quality',     value:poor.length,           color:'#c0550a' },
            { label:'Critical',         value:critical.length,       color:'#c0392b' },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ borderTopColor:s.color, textAlign:'center' }}>
              <div style={{ fontSize:'0.63rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'0.3rem', fontFamily:'Arial' }}>{s.label}</div>
              <div style={{ fontSize:'2.2rem', fontWeight:'800', color:s.color, lineHeight:1, fontFamily:'Georgia' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Station cards */}
        <div style={{ fontSize:'0.7rem', fontWeight:'700', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.85rem', fontFamily:'Arial' }}>
          Water Quality by River / Reservoir
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'0.85rem', marginBottom:'1.75rem' }}>
          {WATER_STATIONS.map(s => (
            <div key={s.id} style={{ background:'white', border:`1px solid ${s.quality==='Critical'?'#f5c6cb':s.quality==='Poor'?'#fde9d9':'#dde2ec'}`, borderTop:`3px solid ${qColor(s.quality)}`, borderRadius:'4px', padding:'1rem', boxShadow:'0 1px 3px rgba(26,39,68,0.06)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.6rem' }}>
                <div>
                  <div style={{ fontSize:'0.88rem', fontWeight:'700', color:'var(--navy)', fontFamily:'Georgia' }}>{s.name}</div>
                  <div style={{ fontSize:'0.65rem', color:'var(--text-muted)', fontFamily:'Arial', marginTop:'0.1rem' }}>{s.district}</div>
                </div>
                <span style={{ background:qBg(s.quality), color:qColor(s.quality), fontSize:'0.62rem', fontWeight:'700', fontFamily:'Arial', padding:'2px 8px', borderRadius:'2px', textTransform:'uppercase', flexShrink:0 }}>{s.quality}</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.3rem' }}>
                {[
                  ['pH',s.ph,`${WATER_LIMITS.ph.min}–${WATER_LIMITS.ph.max}`,s.ph<WATER_LIMITS.ph.min||s.ph>WATER_LIMITS.ph.max],
                  ['DO mg/L',s.do,`>${WATER_LIMITS.do.min}`,s.do<WATER_LIMITS.do.min],
                  ['BOD mg/L',s.bod,`<${WATER_LIMITS.bod.max}`,s.bod>WATER_LIMITS.bod.max],
                  ['TDS mg/L',s.tds,`<${WATER_LIMITS.tds.max}`,s.tds>WATER_LIMITS.tds.max],
                ].map(([k,v,lim,bad]) => (
                  <div key={String(k)} style={{ background:'var(--light-gray)', borderRadius:'3px', padding:'0.3rem 0.45rem', border:`1px solid ${bad?'#f5c6cb':'var(--border)'}` }}>
                    <div style={{ fontSize:'0.58rem', color:'var(--text-muted)', fontFamily:'Arial' }}>{k}</div>
                    <div style={{ fontSize:'0.82rem', fontWeight:'700', fontFamily:'Georgia', color:bad?'var(--danger)':'var(--text-dark)' }}>{v}</div>
                    <div style={{ fontSize:'0.56rem', color:'var(--text-muted)', fontFamily:'Arial' }}>Normal: {lim}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:'0.5rem', fontSize:'0.62rem', fontFamily:'Arial', color:s.trend==='worsening'?'var(--danger)':s.trend==='improving'?'var(--accent-green)':'var(--text-muted)', fontWeight:'600' }}>
                {s.trend==='worsening'?'↓ Worsening trend':s.trend==='improving'?'↑ Improving trend':'→ Stable'}
              </div>
            </div>
          ))}
        </div>

        {/* Water quality guide */}
        <div className="section-card" style={{ marginBottom:'1.5rem' }}>
          <div className="section-title" style={{ color:'#1a5280' }}>💧 Water Quality Parameter Guide</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'0.6rem' }}>
            {[
              ['pH',         '6.5 – 8.5',   'Acidity / alkalinity level'],
              ['DO',         '> 6 mg/L',    'Dissolved oxygen for aquatic life'],
              ['BOD',        '< 3 mg/L',    'Biological oxygen demand'],
              ['Turbidity',  '< 1 NTU',     'Water clarity'],
              ['Coliform',   '< 50 MPN',    'Bacterial contamination indicator'],
              ['TDS',        '< 500 mg/L',  'Total dissolved solids'],
            ].map(([param, limit, desc]) => (
              <div key={param} style={{ background:'#f0f5ff', borderRadius:'4px', padding:'0.7rem 0.85rem', borderLeft:'3px solid #1a5280' }}>
                <div style={{ fontSize:'0.78rem', fontWeight:'700', color:'#1a5280', fontFamily:'Georgia' }}>{param}</div>
                <div style={{ fontSize:'0.75rem', fontWeight:'700', color:'var(--text-dark)', fontFamily:'Arial', margin:'0.1rem 0' }}>Limit: {limit}</div>
                <div style={{ fontSize:'0.65rem', color:'var(--text-muted)', fontFamily:'Arial' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign:'center', fontSize:'0.68rem', color:'var(--text-muted)', fontFamily:'Arial', borderTop:'1px solid var(--border)', paddingTop:'1rem', lineHeight:1.8 }}>
          © 2026 Maharashtra State Pollution Control Board · PrithviNet Environmental Portal<br />
          Do not use water bodies rated Poor or Critical for any purpose without purification. For emergencies: <strong>1800-233-3535</strong> (Toll Free)
        </div>
      </div>
    </div>
  );
}
