'use client';
import { useState, useEffect } from 'react';
import { STATIONS } from '@/data/mockData';

export default function PublicPage() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' }));
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  const breaches = STATIONS.filter(s => s.status === 'breach');
  const avgAqi   = Math.round(STATIONS.reduce((a, s) => a + s.aqi, 0) / STATIONS.length);

  const getAqiInfo = (aqi: number) => {
    if (aqi <= 50)  return { label:'Good',                      color:'#1a6b3a', bg:'#d4edda' };
    if (aqi <= 100) return { label:'Moderate',                  color:'#856404', bg:'#fff3cd' };
    if (aqi <= 150) return { label:'Unhealthy for Sensitive',   color:'#c0550a', bg:'#fde9d9' };
    if (aqi <= 200) return { label:'Unhealthy',                 color:'#d4680a', bg:'#fef0e6' };
    if (aqi <= 300) return { label:'Very Unhealthy',            color:'#c0392b', bg:'#fdf0ee' };
    return               { label:'Hazardous',                   color:'#7b1a1a', bg:'#f8d7da' };
  };

  const overall = getAqiInfo(avgAqi);
  const NEWS = [
    '🔴 LIVE: Bharat Steel Works SO₂ at 142 ppm — Limit 80 ppm — Inspection Ordered',
    '⚠ Nag River Nagpur water quality CRITICAL — Immediate action required by MPCB',
    '📋 Monthly compliance reports due 31 March 2026 — All industries must submit',
    '✅ Godavari River Nashik maintaining GOOD quality for 6th consecutive month',
    '📡 New monitoring station commissioned at Aurangabad MIDC — Real-time data now available',
  ];
  const tickerFull = [...NEWS, ...NEWS].join('   ◆   ');

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

      {/* Site header */}
      <div style={{ background:'white', borderBottom:'2px solid var(--border)', padding:'0.85rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1.1rem' }}>
          <img src="/logo.jpeg" alt="PrithviNet" style={{ height:'60px', width:'auto' }} />
          <div style={{ borderLeft:'2px solid var(--border)', paddingLeft:'1rem' }}>
            <div style={{ fontSize:'1.05rem', fontWeight:'800', color:'var(--navy)', fontFamily:'Georgia' }}>PRITHVINET</div>
            <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', fontFamily:'Arial', marginTop:'0.1rem' }}>Public Air Quality Portal</div>
            <div style={{ fontSize:'0.62rem', color:'#94a3b8', fontFamily:'Arial' }}>Maharashtra State Pollution Control Board</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <div style={{ textAlign:'right', fontFamily:'Arial' }}>
            <div style={{ fontSize:'0.68rem', color:'var(--text-muted)' }}>Data updated: {time}</div>
            <div style={{ fontSize:'0.6rem', color:'#94a3b8', marginTop:'0.1rem' }}>Refreshes every 60 seconds</div>
          </div>
          <a href="/" style={{ background:'var(--navy)', color:'white', fontSize:'0.72rem', fontFamily:'Arial', fontWeight:'600', padding:'0.38rem 0.85rem', borderRadius:'3px', textDecoration:'none' }}>
            🔐 Staff Login
          </a>
        </div>
      </div>

      {/* Nav links to other public portals */}
      <div style={{ background:'var(--navy)', display:'flex', alignItems:'center', height:'38px', padding:'0 1.5rem', gap:'0' }}>
        {[
          { href:'/public',       label:'💨 Air Quality',   active:true  },
          { href:'/public-water', label:'💧 Water Quality', active:false },
          { href:'/public-noise', label:'🔊 Noise Levels',  active:false },
        ].map(item => (
          <a key={item.href} href={item.href}
            style={{ display:'flex', alignItems:'center', padding:'0 1rem', height:'100%', color:item.active?'white':'#94a3b8', fontSize:'0.78rem', fontFamily:'Arial', fontWeight:item.active?'700':'500', textDecoration:'none', borderBottom:item.active?'3px solid #FF8C33':'3px solid transparent', background:item.active?'rgba(255,255,255,0.07)':'none', transition:'all 0.12s' }}>
            {item.label}
          </a>
        ))}
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#22c55e' }} />
          <span style={{ fontSize:'0.65rem', color:'#94a3b8', fontFamily:'Arial' }}>Real-time · {STATIONS.length} stations active</span>
        </div>
      </div>

      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'1.5rem 2rem', width:'100%' }}>

        {/* Health advisory */}
        {breaches.length > 0 && (
          <div className="alert-critical" style={{ marginBottom:'1.5rem', display:'flex', gap:'0.85rem', alignItems:'flex-start' }}>
            <span style={{ fontSize:'1.3rem', flexShrink:0 }}>⚠️</span>
            <div>
              <strong style={{ fontSize:'0.85rem', color:'#721c24' }}>Health Advisory — Poor Air Quality in {breaches.length} Monitoring Zone{breaches.length>1?'s':''}</strong>
              <div style={{ fontSize:'0.78rem', color:'#721c24', marginTop:'0.25rem', lineHeight:1.7 }}>
                Air quality is currently <strong>Very Unhealthy</strong> in {breaches.map(s => s.district).join(', ')}.
                Sensitive groups (elderly, children, those with respiratory conditions) should avoid outdoor activities.
                Others should limit prolonged outdoor exertion.
              </div>
            </div>
          </div>
        )}

        {/* Maharashtra average AQI hero */}
        <div style={{ background:'white', border:'1px solid var(--border)', borderRadius:'4px', padding:'2rem', textAlign:'center', marginBottom:'1.5rem', boxShadow:'0 1px 4px rgba(26,39,68,0.06)', borderTop:`4px solid ${overall.color}` }}>
          <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:'0.5rem', fontFamily:'Arial' }}>Maharashtra State Average AQI</div>
          <div style={{ fontSize:'5.5rem', fontWeight:'900', color:overall.color, lineHeight:1, fontFamily:'Georgia' }}>{avgAqi}</div>
          <div style={{ display:'inline-block', background:overall.bg, color:overall.color, fontSize:'0.88rem', fontWeight:'700', fontFamily:'Arial', padding:'0.3rem 1.2rem', borderRadius:'20px', marginTop:'0.5rem', border:`1px solid ${overall.color}40` }}>
            {overall.label}
          </div>
          <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginTop:'0.6rem', fontFamily:'Arial' }}>
            Based on {STATIONS.length} monitoring stations across Maharashtra
          </div>
        </div>

        {/* Station grid */}
        <div style={{ fontSize:'0.7rem', fontWeight:'700', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.85rem', fontFamily:'Arial' }}>
          Air Quality by Location — All Stations
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(215px,1fr))', gap:'0.85rem', marginBottom:'1.75rem' }}>
          {STATIONS.map(s => {
            const info = getAqiInfo(s.aqi);
            return (
              <div key={s.id} style={{ background:'white', border:`1px solid ${s.status==='breach'?'#f5c6cb':s.status==='warning'?'#ffd966':'#dde2ec'}`, borderTop:`3px solid ${info.color}`, borderRadius:'4px', padding:'1rem', boxShadow:'0 1px 3px rgba(26,39,68,0.06)' }}>
                <div style={{ fontSize:'0.88rem', fontWeight:'700', color:'var(--navy)', fontFamily:'Georgia', marginBottom:'0.1rem' }}>{s.district}</div>
                <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', fontFamily:'Arial', marginBottom:'0.75rem' }}>{s.name}</div>
                <div style={{ display:'flex', alignItems:'baseline', gap:'0.4rem', marginBottom:'0.2rem' }}>
                  <span style={{ fontSize:'2.4rem', fontWeight:'800', color:info.color, lineHeight:1, fontFamily:'Georgia' }}>{s.aqi}</span>
                  <span style={{ fontSize:'0.68rem', color:'var(--text-muted)', fontFamily:'Arial' }}>AQI</span>
                </div>
                <div style={{ display:'inline-block', background:info.bg, color:info.color, fontSize:'0.65rem', fontWeight:'700', fontFamily:'Arial', padding:'1px 8px', borderRadius:'2px', marginBottom:'0.65rem', textTransform:'uppercase', letterSpacing:'0.04em' }}>
                  {info.label}
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.3rem' }}>
                  {[['SO₂',s.so2,'ppm'],['NO₂',s.no2,'ppm']].map(([k,v,u]) => (
                    <div key={String(k)} style={{ background:'var(--light-gray)', borderRadius:'3px', padding:'0.3rem 0.45rem', border:'1px solid var(--border)' }}>
                      <div style={{ fontSize:'0.58rem', color:'var(--text-muted)', fontFamily:'Arial' }}>{k}</div>
                      <div style={{ fontSize:'0.82rem', fontWeight:'700', color:'var(--text-dark)', fontFamily:'Georgia' }}>
                        {v} <span style={{ fontSize:'0.6rem', color:'var(--text-muted)', fontWeight:400 }}>{u}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* AQI scale guide */}
        <div className="section-card" style={{ marginBottom:'1.5rem' }}>
          <div className="section-title">📊 AQI Scale Guide</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'0.6rem' }}>
            {[
              ['0 – 50',   'Good',                    '#1a6b3a', '#d4edda', 'No health impact'],
              ['51 – 100', 'Moderate',                '#856404', '#fff3cd', 'Sensitive groups take care'],
              ['101 – 200','Unhealthy',               '#d4680a', '#fef0e6', 'Limit outdoor activity'],
              ['201 – 300','Very Unhealthy',          '#c0392b', '#fdf0ee', 'Avoid outdoor activity'],
              ['300+',     'Hazardous',               '#7b1a1a', '#f8d7da', 'Stay indoors'],
            ].map(([range,label,color,bg,advice]) => (
              <div key={range} style={{ background:bg, borderRadius:'4px', padding:'0.7rem 0.85rem', borderLeft:`3px solid ${color}` }}>
                <div style={{ fontSize:'0.78rem', fontWeight:'700', color, fontFamily:'Georgia' }}>{range}</div>
                <div style={{ fontSize:'0.78rem', fontWeight:'600', color:'var(--text-dark)', fontFamily:'Arial', margin:'0.1rem 0' }}>{label}</div>
                <div style={{ fontSize:'0.65rem', color:'var(--text-muted)', fontFamily:'Arial' }}>{advice}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Health tips */}
        <div className="section-card" style={{ borderLeft:'4px solid var(--accent-green)', background:'#f0f8f3', marginBottom:'1.5rem' }}>
          <div className="section-title" style={{ color:'var(--accent-green)' }}>💡 Public Health Advisory</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem', fontSize:'0.78rem', color:'var(--text-mid)', fontFamily:'Arial', lineHeight:1.8 }}>
            <div>
              <div style={{ fontWeight:'700', color:'var(--accent-green)', marginBottom:'0.3rem' }}>When AQI is above 150:</div>
              <ul style={{ paddingLeft:'1.2rem' }}>
                <li>Reduce outdoor physical activity</li>
                <li>Keep windows closed indoors</li>
                <li>Use N95 masks if going outside</li>
                <li>Children and elderly should stay indoors</li>
              </ul>
            </div>
            <div>
              <div style={{ fontWeight:'700', color:'var(--accent-green)', marginBottom:'0.3rem' }}>Emergency contacts:</div>
              <ul style={{ paddingLeft:'1.2rem' }}>
                <li>MPCB Helpline: <strong>1800-233-3535</strong> (Toll Free)</li>
                <li>Emergency: <strong>112</strong></li>
                <li>SPCB Website: mpcb.gov.in</li>
                <li>Complaint portal: sampark.maharashtra.gov.in</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign:'center', fontSize:'0.68rem', color:'var(--text-muted)', fontFamily:'Arial', borderTop:'1px solid var(--border)', paddingTop:'1rem', lineHeight:1.8 }}>
          © 2026 Maharashtra State Pollution Control Board · PrithviNet Environmental Portal<br />
          Data sourced from CAAQMS stations across Maharashtra. For emergencies contact: <strong>1800-233-3535</strong> (Toll Free)
        </div>
      </div>
    </div>
  );
}

// Fallback to avoid template literal issues

