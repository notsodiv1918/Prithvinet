'use client';
import { useState, useEffect } from 'react';
import { NOISE_STATIONS, NOISE_LIMITS } from '@/data/waterNoiseData';

export default function PublicNoisePage() {
  const [time, setTime] = useState('');
  const [zoneFilter, setZoneFilter] = useState('All');
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short' }));
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  const NEWS = [
    '🔊 Noise levels at Dharavi Industrial Area exceeding 81 dB(A) — Limit: 75 dB(A) · Notice issued',
    '🔴 LIVE: Bharat Steel Works SO₂ at 142 ppm — Inspection Ordered by MPCB',
    '⚠ Nag River Nagpur water quality CRITICAL — Immediate action required',
    '📋 Monthly compliance reports due 31 March 2026 — All industries must submit',
    '📡 New monitoring station commissioned at Aurangabad MIDC — Real-time data now available',
  ];
  const tickerFull = [...NEWS, ...NEWS].join('   ◆   ');

  const zones = ['All', 'Industrial', 'Commercial', 'Residential', 'Silence'];
  const filtered = zoneFilter === 'All' ? NOISE_STATIONS : NOISE_STATIONS.filter(s => s.zone === zoneFilter);
  const breaches  = NOISE_STATIONS.filter(s => s.status === 'breach');
  const warnings  = NOISE_STATIONS.filter(s => s.status === 'warning');
  const compliant = NOISE_STATIONS.filter(s => s.status === 'safe');

  const sColor = (s: string) => s==='safe'?'#1a6b3a':s==='warning'?'#856404':'#c0392b';
  const sBg    = (s: string) => s==='safe'?'#d4edda':s==='warning'?'#fff3cd':'#fdf0ee';
  const zIcon  = (z: string) => z==='Industrial'?'🏭':z==='Commercial'?'🏢':z==='Residential'?'🏘':'🌿';

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
            <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', fontFamily:'Arial', marginTop:'0.1rem' }}>Public Noise Pollution Portal</div>
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
          { href:'/public-water', label:'💧 Water Quality', active:false },
          { href:'/public-noise', label:'🔊 Noise Levels',  active:true  },
        ].map(item => (
          <a key={item.href} href={item.href}
            style={{ display:'flex', alignItems:'center', padding:'0 1rem', height:'100%', color:item.active?'white':'#94a3b8', fontSize:'0.78rem', fontFamily:'Arial', fontWeight:item.active?'700':'500', textDecoration:'none', borderBottom:item.active?'3px solid #fbbf24':'3px solid transparent', background:item.active?'rgba(255,255,255,0.07)':'none' }}>
            {item.label}
          </a>
        ))}
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#22c55e' }} />
          <span style={{ fontSize:'0.65rem', color:'#94a3b8', fontFamily:'Arial' }}>Real-time · {NOISE_STATIONS.length} zones active</span>
        </div>
      </div>

      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'1.5rem 2rem', width:'100%' }}>

        {/* Breach banner */}
        {breaches.length > 0 && (
          <div className="alert-critical" style={{ marginBottom:'1.5rem', display:'flex', gap:'0.85rem', alignItems:'flex-start' }}>
            <span style={{ fontSize:'1.3rem', flexShrink:0 }}>🔊</span>
            <div>
              <strong style={{ fontSize:'0.85rem', color:'#721c24' }}>Noise Limit Exceeded in {breaches.length} Zone{breaches.length>1?'s':''}</strong>
              <div style={{ fontSize:'0.78rem', color:'#721c24', marginTop:'0.25rem', lineHeight:1.7 }}>
                {breaches.map(s => `${s.name} — ${s.dayLevel} dB(A) (Limit: ${s.dayLimit})`).join(' · ')}.
                Prolonged exposure above prescribed limits may cause hearing damage and health issues.
              </div>
            </div>
          </div>
        )}

        {/* Summary cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
          {[
            { label:'Monitoring Zones', value:NOISE_STATIONS.length, color:'#5a3500' },
            { label:'Compliant',        value:compliant.length,      color:'#1a6b3a' },
            { label:'Warning',          value:warnings.length,       color:'#856404' },
            { label:'Breach',           value:breaches.length,       color:'#c0392b' },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ borderTopColor:s.color, textAlign:'center' }}>
              <div style={{ fontSize:'0.63rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'0.3rem', fontFamily:'Arial' }}>{s.label}</div>
              <div style={{ fontSize:'2.2rem', fontWeight:'800', color:s.color, lineHeight:1, fontFamily:'Georgia' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Zone filter */}
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem' }}>
          <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'Arial', fontWeight:'600' }}>Filter by zone:</span>
          {zones.map(z => (
            <button key={z} onClick={() => setZoneFilter(z)}
              style={{ fontSize:'0.72rem', fontFamily:'Arial', fontWeight:zoneFilter===z?'700':'500', padding:'0.25rem 0.75rem', borderRadius:'15px', border:'1.5px solid', borderColor:zoneFilter===z?'var(--navy)':'var(--border)', background:zoneFilter===z?'var(--navy)':'white', color:zoneFilter===z?'white':'var(--text-mid)', cursor:'pointer', transition:'all 0.12s' }}>
              {z}
            </button>
          ))}
        </div>

        {/* Station cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))', gap:'0.85rem', marginBottom:'1.75rem' }}>
          {filtered.map(s => (
            <div key={s.id} style={{ background:'white', border:`1px solid ${s.status==='breach'?'#f5c6cb':s.status==='warning'?'#ffd966':'#dde2ec'}`, borderTop:`3px solid ${sColor(s.status)}`, borderRadius:'4px', padding:'1rem', boxShadow:'0 1px 3px rgba(26,39,68,0.06)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.5rem' }}>
                <div>
                  <div style={{ fontSize:'0.88rem', fontWeight:'700', color:'var(--navy)', fontFamily:'Georgia' }}>{s.name}</div>
                  <div style={{ fontSize:'0.65rem', color:'var(--text-muted)', fontFamily:'Arial', marginTop:'0.1rem' }}>{zIcon(s.zone)} {s.zone} · {s.district}</div>
                </div>
                <span style={{ background:sBg(s.status), color:sColor(s.status), fontSize:'0.62rem', fontWeight:'700', fontFamily:'Arial', padding:'2px 8px', borderRadius:'2px', textTransform:'uppercase', flexShrink:0 }}>{s.status}</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.3rem', marginBottom:'0.5rem' }}>
                {[
                  ['Day Level', `${s.dayLevel} dB`, s.dayLevel > s.dayLimit],
                  ['Day Limit', `${s.dayLimit} dB`, false],
                  ['Night Level', `${s.nightLevel} dB`, s.nightLevel > s.nightLimit],
                  ['Night Limit', `${s.nightLimit} dB`, false],
                ].map(([k,v,bad]) => (
                  <div key={String(k)} style={{ background:'var(--light-gray)', borderRadius:'3px', padding:'0.3rem 0.45rem', border:`1px solid ${bad?'#f5c6cb':'var(--border)'}` }}>
                    <div style={{ fontSize:'0.58rem', color:'var(--text-muted)', fontFamily:'Arial' }}>{k}</div>
                    <div style={{ fontSize:'0.82rem', fontWeight:'700', fontFamily:'Georgia', color:bad?'var(--danger)':'var(--text-dark)' }}>{String(v)}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:'0.62rem', color:'var(--text-muted)', fontFamily:'Arial' }}>Primary source: {s.primarySource}</div>
            </div>
          ))}
        </div>

        {/* Zone limits guide */}
        <div className="section-card" style={{ marginBottom:'1.5rem' }}>
          <div className="section-title" style={{ color:'#5a3500' }}>🔊 Prescribed Noise Limits by Zone Type</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))', gap:'0.6rem' }}>
            {(Object.entries(NOISE_LIMITS) as [string,[number,number]][]).map(([zone,[day,night]]) => (
              <div key={zone} style={{ background:'#fff8ee', borderRadius:'4px', padding:'0.75rem 0.9rem', borderLeft:'3px solid #5a3500' }}>
                <div style={{ fontSize:'0.78rem', fontWeight:'700', color:'#5a3500', fontFamily:'Arial', marginBottom:'0.3rem' }}>{zIcon(zone)} {zone} Zone</div>
                <div style={{ fontSize:'0.75rem', color:'var(--text-dark)', fontFamily:'Arial' }}>Day: <strong>{day} dB(A)</strong></div>
                <div style={{ fontSize:'0.75rem', color:'var(--text-dark)', fontFamily:'Arial' }}>Night: <strong>{night} dB(A)</strong></div>
                <div style={{ fontSize:'0.62rem', color:'var(--text-muted)', fontFamily:'Arial', marginTop:'0.2rem' }}>
                  {zone==='Industrial'?'Heavy machinery, factory areas':zone==='Commercial'?'Markets, shops, offices':zone==='Residential'?'Housing, schools, hospitals':'Hospitals, courts, libraries'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health info */}
        <div className="section-card" style={{ borderLeft:'4px solid #5a3500', background:'#fffbf5', marginBottom:'1.5rem' }}>
          <div className="section-title" style={{ color:'#5a3500' }}>💡 Noise Pollution — Health Advisory</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem', fontSize:'0.78rem', color:'var(--text-mid)', fontFamily:'Arial', lineHeight:1.8 }}>
            <div>
              <div style={{ fontWeight:'700', color:'#c0392b', marginBottom:'0.3rem' }}>Health impacts of excess noise:</div>
              <ul style={{ paddingLeft:'1.2rem' }}>
                <li>Hearing loss with prolonged exposure above 85 dB</li>
                <li>Increased stress, anxiety and sleep disruption</li>
                <li>Cardiovascular health risks at 65+ dB sustained</li>
                <li>Learning difficulties in children near noisy zones</li>
              </ul>
            </div>
            <div>
              <div style={{ fontWeight:'700', color:'#5a3500', marginBottom:'0.3rem' }}>File a complaint:</div>
              <ul style={{ paddingLeft:'1.2rem' }}>
                <li>MPCB Helpline: <strong>1800-233-3535</strong> (Toll Free)</li>
                <li>Police Control Room: <strong>100</strong></li>
                <li>Sampark: sampark.maharashtra.gov.in</li>
                <li>Email: helpdesk@mpcb.gov.in</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign:'center', fontSize:'0.68rem', color:'var(--text-muted)', fontFamily:'Arial', borderTop:'1px solid var(--border)', paddingTop:'1rem', lineHeight:1.8 }}>
          © 2026 Maharashtra State Pollution Control Board · PrithviNet Environmental Portal<br />
          Noise Pollution (Regulation and Control) Rules, 2000. For complaints: <strong>1800-233-3535</strong> (Toll Free)
        </div>
      </div>
    </div>
  );
}
