'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { STATIONS, INDUSTRIES, PRESCRIBED_LIMITS } from '@/data/mockData';
import { WATER_STATIONS, WATER_LIMITS, NOISE_STATIONS } from '@/data/waterNoiseData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';
import { getUser } from '@/lib/auth';

type Portal = 'air' | 'water' | 'noise' | null;

const key = (email: string) => `pvportal_${email}`;

// ── Air dashboard ──────────────────────────────────────────────────────────────
function AirDashboard({ user, liveData }: { user: any; liveData: typeof STATIONS }) {
  const isRO = user?.role === 'Regional Officer';
  const stations = isRO ? liveData.filter(s => ['Nagpur','Pune'].includes(s.district)) : liveData;
  const industries = isRO ? INDUSTRIES.filter(i => i.assignedRO === 'Rajesh Kumar') : INDUSTRIES;
  const breaches = stations.filter(s => s.status === 'breach').length;
  const warnings = stations.filter(s => s.status === 'warning').length;
  const avgAqi = Math.round(stations.reduce((a,s)=>a+s.aqi,0)/stations.length);
  const trendData = INDUSTRIES[0].history.map((h,i) => ({
    date:h.date, 'SO₂':h.so2, 'NO₂':INDUSTRIES[1].history[i]?.no2||0, 'Limit':PRESCRIBED_LIMITS.so2
  }));

  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'1.25rem' }}>
        {[
          {label:'Active Stations', value:stations.length, color:'#1a6b3a'},
          {label:'Breaches', value:breaches, sub:`${warnings} warnings`, color:'#c0392b'},
          {label:'Avg AQI', value:avgAqi, color:avgAqi>100?'#d4680a':'#1a6b3a'},
          {label:'Industries', value:industries.length, color:'#7d4e00'},
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ borderTopColor:s.color }}>
            <div style={{ fontSize:'0.65rem', color:'#6b8c7a', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'0.3rem' }}>{s.label}</div>
            <div style={{ fontSize:'2rem', fontWeight:'800', color:s.color, lineHeight:1 }}>{s.value}</div>
            {(s as any).sub && <div style={{ fontSize:'0.65rem', color:'#6b8c7a', marginTop:'0.15rem' }}>{(s as any).sub}</div>}
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'1.25rem', marginBottom:'1.25rem' }}>
        <div className="section-card">
          <div className="section-title">7-Day Emissions Trend</div>
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={trendData} margin={{top:5,right:10,bottom:5,left:-10}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8f5ee"/>
              <XAxis dataKey="date" tick={{fill:'#6b8c7a',fontSize:10}}/>
              <YAxis tick={{fill:'#6b8c7a',fontSize:11}}/>
              <Tooltip contentStyle={{background:'white',border:'1px solid #c8e0d2',fontSize:'12px'}}/>
              <Legend wrapperStyle={{fontSize:'11px'}}/>
              <Line type="monotone" dataKey="SO₂" stroke="#c0392b" strokeWidth={2} dot={false}/>
              <Line type="monotone" dataKey="NO₂" stroke="#d4680a" strokeWidth={2} dot={false}/>
              <Line type="monotone" dataKey="Limit" stroke="#1a6b3a" strokeWidth={1.5} strokeDasharray="5 5" dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="section-card">
          <div className="section-title">Compliance Overview</div>
          {industries.map(ind => (
            <div key={ind.id} style={{ marginBottom:'0.75rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.2rem' }}>
                <span style={{ fontSize:'0.75rem', fontWeight:'600' }}>{ind.name.split(' ').slice(0,2).join(' ')}</span>
                <span style={{ fontSize:'0.75rem', fontWeight:'700', color:ind.complianceRate<50?'#c0392b':ind.complianceRate<80?'#d4680a':'#1a6b3a' }}>{ind.complianceRate}%</span>
              </div>
              <div style={{ background:'#e8f5ee', borderRadius:'3px', height:'7px' }}>
                <div style={{ height:'100%', width:`${ind.complianceRate}%`, background:ind.complianceRate<50?'#c0392b':ind.complianceRate<80?'#d4680a':'#1a6b3a', borderRadius:'3px' }}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-card">
        <div className="section-title">Live Station Readings</div>
        <div style={{ overflowX:'auto' }}>
          <table className="gov-table">
            <thead><tr><th>Station</th><th>District</th><th>AQI</th><th>SO₂</th><th>NO₂</th><th>PM2.5</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {stations.map(s => (
                <tr key={s.id}>
                  <td style={{fontWeight:'500'}}>{s.name}</td>
                  <td style={{color:'#6b8c7a'}}>{s.district}</td>
                  <td style={{fontWeight:'700', color:s.status==='breach'?'#c0392b':s.status==='warning'?'#d4680a':'#1a6b3a'}}>{s.aqi}</td>
                  <td style={{color:s.so2>PRESCRIBED_LIMITS.so2?'#c0392b':'#1a2e22', fontWeight:s.so2>PRESCRIBED_LIMITS.so2?'700':'400'}}>{s.so2}</td>
                  <td>{s.no2}</td><td>{s.pm25}</td>
                  <td><span className={`badge-${s.status}`}>{s.status}</span></td>
                  <td>{s.status==='breach' && <button className="btn-danger" style={{fontSize:'0.68rem',padding:'0.2rem 0.5rem'}} onClick={()=>toast.error(`Inspection: ${s.district}`,{icon:'📋'})}>Inspect</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Water dashboard ────────────────────────────────────────────────────────────
function WaterDashboard({ user }: { user: any }) {
  const isRO = user?.role === 'Regional Officer';
  const stations = isRO ? WATER_STATIONS.filter(s=>['Nagpur','Thane','Navi Mumbai'].includes(s.district)) : WATER_STATIONS;
  const qC = (q:string) => q==='Good'?'#1a6b3a':q==='Moderate'?'#856404':q==='Poor'?'#c0550a':'#c0392b';
  const qB = (q:string) => q==='Good'?'#d4edda':q==='Moderate'?'#fff3cd':q==='Poor'?'#fde9d9':'#f8d7da';

  return (
    <div>
      {stations.filter(s=>s.quality==='Critical').length>0 && (
        <div style={{background:'#f8d7da',border:'1px solid #f5c6cb',borderLeft:'5px solid #c0392b',borderRadius:'4px',padding:'0.85rem 1.2rem',marginBottom:'1.25rem',fontSize:'0.78rem',color:'#721c24'}}>
          ⚠️ <strong>Critical Contamination:</strong> {stations.filter(s=>s.quality==='Critical').map(s=>s.name).join(' · ')} — immediate action required
        </div>
      )}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'1.25rem'}}>
        {[
          {label:'Monitoring Sites', value:stations.length, color:'#1a5280'},
          {label:'Good Quality', value:stations.filter(s=>s.quality==='Good').length, color:'#1a6b3a'},
          {label:'Poor / Critical', value:stations.filter(s=>s.quality==='Poor'||s.quality==='Critical').length, color:'#c0392b'},
          {label:'Worsening Trend', value:stations.filter(s=>s.trend==='worsening').length, color:'#c0392b'},
        ].map(s=>(
          <div key={s.label} style={{background:'white',border:'1px solid #c8d8f0',borderTop:`3px solid ${s.color}`,borderRadius:'4px',padding:'1rem',boxShadow:'0 1px 4px rgba(0,0,0,0.05)'}}>
            <div style={{fontSize:'0.65rem',color:'#6b8c7a',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'0.3rem'}}>{s.label}</div>
            <div style={{fontSize:'2rem',fontWeight:'800',color:s.color,lineHeight:1}}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{background:'white',border:'1px solid #c8d8f0',borderRadius:'4px',padding:'1.2rem'}}>
        <div style={{fontSize:'0.75rem',fontWeight:'700',color:'#1a5280',marginBottom:'0.75rem',textTransform:'uppercase',letterSpacing:'0.07em'}}>Live Water Quality Readings</div>
        <div style={{overflowX:'auto'}}>
          <table className="gov-table">
            <thead><tr><th>Station</th><th>District</th><th>pH</th><th>DO mg/L</th><th>BOD mg/L</th><th>TDS mg/L</th><th>Coliform</th><th>Quality</th><th>Trend</th></tr></thead>
            <tbody>
              {stations.map(s=>(
                <tr key={s.id}>
                  <td style={{fontWeight:'500',fontSize:'0.78rem'}}>{s.name}</td>
                  <td style={{color:'#6b8c7a'}}>{s.district}</td>
                  <td style={{color:s.ph<WATER_LIMITS.ph.min||s.ph>WATER_LIMITS.ph.max?'#c0392b':'#1a2e22'}}>{s.ph}</td>
                  <td style={{color:s.do<WATER_LIMITS.do.min?'#c0392b':'#1a6b3a',fontWeight:s.do<WATER_LIMITS.do.min?'700':'400'}}>{s.do}</td>
                  <td style={{color:s.bod>WATER_LIMITS.bod.max?'#c0392b':'#1a2e22',fontWeight:s.bod>WATER_LIMITS.bod.max?'700':'400'}}>{s.bod}</td>
                  <td style={{color:s.tds>WATER_LIMITS.tds.max?'#c0392b':'#1a2e22'}}>{s.tds}</td>
                  <td style={{color:s.coliform>WATER_LIMITS.coliform.max?'#c0392b':'#1a2e22',fontWeight:s.coliform>WATER_LIMITS.coliform.max?'700':'400'}}>{s.coliform}</td>
                  <td><span style={{background:qB(s.quality),color:qC(s.quality),fontSize:'0.62rem',fontWeight:'700',padding:'1px 8px',borderRadius:'10px'}}>{s.quality}</span></td>
                  <td style={{color:s.trend==='worsening'?'#c0392b':s.trend==='improving'?'#1a6b3a':'#6b8c7a',fontSize:'0.78rem'}}>{s.trend==='worsening'?'↓':s.trend==='improving'?'↑':'→'} {s.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Noise dashboard ────────────────────────────────────────────────────────────
function NoiseDashboard({ user }: { user: any }) {
  const isRO = user?.role === 'Regional Officer';
  const stations = isRO ? NOISE_STATIONS.filter(s=>['Nagpur','Thane','Navi Mumbai'].includes(s.district)) : NOISE_STATIONS;
  const sC = (s:string) => s==='safe'?'#1a6b3a':s==='warning'?'#856404':'#c0392b';
  const sB = (s:string) => s==='safe'?'#d4edda':s==='warning'?'#fff3cd':'#f8d7da';
  const zI = (z:string) => z==='Industrial'?'🏭':z==='Commercial'?'🏢':z==='Residential'?'🏘':'🌿';

  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'1.25rem'}}>
        {[
          {label:'Monitoring Zones', value:stations.length, color:'#5a3500'},
          {label:'Compliant', value:stations.filter(s=>s.status==='safe').length, color:'#1a6b3a'},
          {label:'Warning', value:stations.filter(s=>s.status==='warning').length, color:'#856404'},
          {label:'Breach', value:stations.filter(s=>s.status==='breach').length, color:'#c0392b'},
        ].map(s=>(
          <div key={s.label} style={{background:'white',border:'1px solid #e8d8c0',borderTop:`3px solid ${s.color}`,borderRadius:'4px',padding:'1rem',boxShadow:'0 1px 4px rgba(0,0,0,0.05)'}}>
            <div style={{fontSize:'0.65rem',color:'#6b8c7a',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'0.3rem'}}>{s.label}</div>
            <div style={{fontSize:'2rem',fontWeight:'800',color:s.color,lineHeight:1}}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{background:'white',border:'1px solid #e8d8c0',borderRadius:'4px',padding:'1.2rem'}}>
        <div style={{fontSize:'0.75rem',fontWeight:'700',color:'#5a3500',marginBottom:'0.75rem',textTransform:'uppercase',letterSpacing:'0.07em'}}>Live Noise Level Readings</div>
        <div style={{overflowX:'auto'}}>
          <table className="gov-table">
            <thead><tr><th>Station</th><th>District</th><th>Zone</th><th>Day dB</th><th>Limit</th><th>Night dB</th><th>Limit</th><th>Primary Source</th><th>Status</th></tr></thead>
            <tbody>
              {stations.map(s=>(
                <tr key={s.id}>
                  <td style={{fontWeight:'500',fontSize:'0.78rem'}}>{s.name}</td>
                  <td style={{color:'#6b8c7a'}}>{s.district}</td>
                  <td style={{fontSize:'0.75rem'}}>{zI(s.zone)} {s.zone}</td>
                  <td style={{color:s.dayLevel>s.dayLimit?'#c0392b':'#1a6b3a',fontWeight:s.dayLevel>s.dayLimit?'700':'400'}}>{s.dayLevel}</td>
                  <td style={{color:'#6b8c7a'}}>{s.dayLimit}</td>
                  <td style={{color:s.nightLevel>s.nightLimit?'#c0392b':'#1a6b3a',fontWeight:s.nightLevel>s.nightLimit?'700':'400'}}>{s.nightLevel}</td>
                  <td style={{color:'#6b8c7a'}}>{s.nightLimit}</td>
                  <td style={{fontSize:'0.72rem',color:'#6b8c7a'}}>{s.primarySource}</td>
                  <td><span style={{background:sB(s.status),color:sC(s.status),fontSize:'0.62rem',fontWeight:'700',padding:'1px 8px',borderRadius:'10px'}}>{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [portal, setPortal] = useState<Portal>(null);
  const [liveData, setLiveData] = useState(STATIONS);

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push('/'); return; }
    if (u.role === 'Industry User') { router.push('/industry-dashboard'); return; }
    if (u.role === 'Citizen') { router.push('/public'); return; }
    setUser(u);
    const saved = localStorage.getItem(key(u.email)) as Portal | null;
    if (saved) setPortal(saved);
  }, []);

  // Sync portal from Sidebar's ↩ switch
  useEffect(() => {
    const h = (e: Event) => setPortal((e as CustomEvent).detail as Portal);
    window.addEventListener('pvPortalChange', h);
    return () => window.removeEventListener('pvPortalChange', h);
  }, []);

  // Live AQI ticker
  useEffect(() => {
    const t = setInterval(() => {
      setLiveData(prev => prev.map(s => ({
        ...s,
        aqi: Math.max(30, s.aqi + Math.round((Math.random()-0.5)*6)),
        so2: Math.max(10, s.so2 + Math.round((Math.random()-0.5)*4)),
      })));
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const handleSelectPortal = (p: Portal) => {
    setPortal(p);
    if (user) localStorage.setItem(key(user.email), p as string);
    // Tell Sidebar to update
    window.dispatchEvent(new CustomEvent('pvPortalChange', { detail: p }));
  };

  if (!user) return null;

  const PORTALS = [
    {
      k:'air' as const, icon:'💨', label:'Air Quality',
      desc:'AQI · SO₂ · PM2.5 · NO₂ emissions and station-wise monitoring',
      accent:'#1a6b3a', bg:'#f0f8f3', border:'#c8e0d2',
      stat: `${STATIONS.filter(s=>s.status==='breach').length} active breaches`,
      statColor:'#c0392b',
    },
    {
      k:'water' as const, icon:'💧', label:'Water Quality',
      desc:'pH · DO · BOD · Coliform across rivers and reservoirs',
      accent:'#1a5280', bg:'#f0f5ff', border:'#c8d8f0',
      stat:`${WATER_STATIONS.filter(s=>s.quality==='Critical').length} critical sites`,
      statColor:'#c0392b',
    },
    {
      k:'noise' as const, icon:'🔊', label:'Noise Levels',
      desc:'Day & night dB(A) · Zone-based limits · Industrial to Silence zones',
      accent:'#5a3500', bg:'#fff8ee', border:'#f0d8a0',
      stat:`${NOISE_STATIONS.filter(s=>s.status==='breach').length} limit breaches`,
      statColor:'#c0392b',
    },
  ];

  const activePortal = PORTALS.find(p => p.k === portal);

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#f0f8f3' }}>
      <Sidebar />
      <main style={{ flex:1, overflow:'auto' }}>
        <TopBar
          title={portal ? `Dashboard — ${activePortal?.label}` : 'Dashboard — Select Domain'}
          subtitle={`${user.role} · Maharashtra SPCB Environmental Monitoring Portal`}
        />
        <Toaster position="top-right"/>

        <div style={{ background:'white', borderBottom:'1px solid #e8f5ee', padding:'0.5rem 1.5rem' }}>
          <span style={{ fontSize:'0.7rem', color:'#6b8c7a' }}>Home › </span>
          <span style={{ fontSize:'0.7rem', color:'#1a6b3a', fontWeight:'600' }}>
            Dashboard{portal ? ` › ${activePortal?.label}` : ''}
          </span>
        </div>

        <div style={{ padding:'1.25rem 1.5rem' }}>

          {/* ── 3 domain selector cards — always at top ── */}
          <div style={{ marginBottom:'1.5rem' }}>
            <div style={{ fontSize:'0.68rem', fontWeight:'700', color:'#3d5a48', textTransform:'uppercase', letterSpacing:'0.09em', marginBottom:'0.85rem' }}>
              Select Monitoring Domain
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem' }}>
              {PORTALS.map(p => {
                const isActive = portal === p.k;
                return (
                  <button key={p.k} onClick={() => handleSelectPortal(p.k)}
                    style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'1.1rem 1.25rem', background:isActive ? p.bg : 'white', border:`2px solid ${isActive ? p.accent : p.border}`, borderRadius:'8px', cursor:'pointer', textAlign:'left', transition:'all 0.15s', boxShadow:isActive ? `0 3px 14px rgba(0,0,0,0.1)` : '0 1px 4px rgba(0,0,0,0.05)' }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.borderColor = p.accent; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.borderColor = p.border; }}>
                    <span style={{ fontSize:'2.2rem', flexShrink:0 }}>{p.icon}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:'0.9rem', fontWeight:'700', color:isActive ? p.accent : '#1a2e22', marginBottom:'0.2rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
                        {p.label}
                        {isActive && <span style={{ fontSize:'0.6rem', background:p.accent, color:'white', padding:'1px 6px', borderRadius:'8px' }}>Active</span>}
                      </div>
                      <div style={{ fontSize:'0.65rem', color:'#6b8c7a', lineHeight:1.5 }}>{p.desc}</div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <div style={{ fontSize:'0.82rem', fontWeight:'800', color:p.statColor }}>{p.stat}</div>
                      <div style={{ fontSize:'0.58rem', color:'#94a3b8', marginTop:'0.1rem' }}>live now</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Domain content — empty state or live data ── */}
          {!portal && (
            <div style={{ background:'white', border:'2px dashed #c8e0d2', borderRadius:'8px', padding:'4rem 2rem', textAlign:'center' }}>
              <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>☝️</div>
              <div style={{ fontSize:'1rem', fontWeight:'700', color:'#3d5a48', marginBottom:'0.5rem' }}>Choose a domain above to view live data</div>
              <div style={{ fontSize:'0.8rem', color:'#6b8c7a' }}>Air Quality, Water Quality, or Noise Levels — select one to load station readings, trends and compliance status.</div>
            </div>
          )}

          {portal === 'air'   && <AirDashboard   user={user} liveData={liveData} />}
          {portal === 'water' && <WaterDashboard user={user} />}
          {portal === 'noise' && <NoiseDashboard user={user} />}

        </div>
      </main>
    </div>
  );
}
