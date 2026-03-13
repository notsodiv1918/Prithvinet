'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { INDUSTRIES, PRESCRIBED_LIMITS, MONTHLY_REPORTS } from '@/data/mockData';
import { WATER_STATIONS, WATER_LIMITS, NOISE_STATIONS } from '@/data/waterNoiseData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';
import { getUser } from '@/lib/auth';

type Portal = 'air' | 'water' | 'noise' | null;
const key = (email: string) => `pvportal_${email}`;

const IND = INDUSTRIES[0];
const MY_WATER = WATER_STATIONS.find(s => s.id === 'WTR002')!; // Nag River Nagpur
const MY_NOISE = NOISE_STATIONS.find(s => s.id === 'NSE003')!; // Butibori MIDC Nagpur

function AirSection({ router }: { router: any }) {
  const [liveAqi, setLiveAqi] = useState(267);
  const [liveSo2, setLiveSo2] = useState(IND.currentSo2);
  useEffect(() => {
    const t = setInterval(() => {
      setLiveAqi(v => Math.max(80, v + Math.round((Math.random()-0.5)*8)));
      setLiveSo2(v => Math.max(30, v + Math.round((Math.random()-0.5)*5)));
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      {liveAqi > 200 && (
        <div style={{background:'#fdf0ee',border:'1px solid #f5c6cb',borderLeft:'4px solid #c0392b',borderRadius:'4px',padding:'0.75rem 1rem',marginBottom:'1.25rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{fontSize:'0.82rem',fontWeight:'700',color:'#721c24'}}>⚠ AQI Breach — {liveAqi} (Limit: 100)</div>
            <div style={{fontSize:'0.72rem',color:'#721c24',marginTop:'0.1rem'}}>Submit a compliance report to avoid inspection notice.</div>
          </div>
          <button className="btn-danger" style={{fontSize:'0.75rem',whiteSpace:'nowrap',marginLeft:'1rem'}} onClick={()=>router.push('/submit')}>Submit Report</button>
        </div>
      )}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'1.25rem'}}>
        {[
          {label:'Live AQI', value:liveAqi, color:liveAqi>200?'#c0392b':'#d4680a'},
          {label:'SO₂ (ppm)', value:liveSo2, color:liveSo2>PRESCRIBED_LIMITS.so2?'#c0392b':'#1a6b3a'},
          {label:'Compliance', value:`${IND.complianceRate}%`, color:IND.complianceRate<50?'#c0392b':'#d4680a'},
          {label:'Next Report Due', value:'17 days', color:'#1a4e8a', onClick:()=>router.push('/submit')},
        ].map(s => (
          <div key={s.label} className="stat-card" style={{borderTopColor:s.color,cursor:(s as any).onClick?'pointer':'default'}} onClick={(s as any).onClick}>
            <div style={{fontSize:'0.65rem',color:'#6b8c7a',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'0.3rem'}}>{s.label}</div>
            <div style={{fontSize:'1.7rem',fontWeight:'800',color:s.color,lineHeight:1}}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'1.25rem',marginBottom:'1.25rem'}}>
        <div className="section-card">
          <div className="section-title">7-Day Emissions Trend</div>
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={IND.history.map(h=>({date:h.date,SO2:h.so2,NO2:h.no2}))} margin={{top:5,right:10,bottom:5,left:-10}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8f5ee"/>
              <XAxis dataKey="date" tick={{fill:'#6b8c7a',fontSize:10}}/>
              <YAxis tick={{fill:'#6b8c7a',fontSize:11}}/>
              <Tooltip contentStyle={{background:'white',border:'1px solid #c8e0d2',fontSize:'12px'}}/>
              <ReferenceLine y={PRESCRIBED_LIMITS.so2} stroke="#c0392b" strokeDasharray="4 4" label={{value:'SO₂ limit',fill:'#c0392b',fontSize:9}}/>
              <Line type="monotone" dataKey="SO2" stroke="#c0392b" strokeWidth={2} dot={{r:3}} name="SO₂"/>
              <Line type="monotone" dataKey="NO2" stroke="#d4680a" strokeWidth={2} dot={{r:3}} name="NO₂"/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="section-card">
          <div className="section-title">vs Prescribed Limits</div>
          {[['SO₂',liveSo2,PRESCRIBED_LIMITS.so2,'ppm'],['NO₂',IND.currentNo2,PRESCRIBED_LIMITS.no2,'ppm'],['PM2.5',IND.currentPm25,PRESCRIBED_LIMITS.pm25,'µg/m³']].map(([k,v,lim,u])=>{
            const over=Number(v)>Number(lim);
            return (<div key={String(k)} style={{marginBottom:'0.75rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.2rem'}}>
                <span style={{fontSize:'0.75rem',fontWeight:'600'}}>{k}</span>
                <span style={{fontSize:'0.75rem',fontWeight:'700',color:over?'#c0392b':'#1a6b3a'}}>{v}/{lim} {u}</span>
              </div>
              <div style={{background:'#e8f5ee',borderRadius:'3px',height:'7px'}}>
                <div style={{height:'100%',width:`${Math.min(100,Math.round(Number(v)/Number(lim)*100))}%`,background:over?'#c0392b':'#1a6b3a',borderRadius:'3px'}}/>
              </div>
            </div>);
          })}
        </div>
      </div>
      {MONTHLY_REPORTS && MONTHLY_REPORTS.length > 0 && (
        <div className="section-card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.75rem'}}>
            <div className="section-title" style={{marginBottom:0}}>Recent Monthly Reports</div>
            <button className="btn-outline" style={{fontSize:'0.72rem',padding:'0.25rem 0.75rem'}} onClick={()=>router.push('/industry-reports')}>View All →</button>
          </div>
          <table className="gov-table">
            <thead><tr><th>Month</th><th>Avg SO₂</th><th>Avg NO₂</th><th>Status</th><th>Submitted</th></tr></thead>
            <tbody>
              {MONTHLY_REPORTS.slice(0,4).map(r=>(
                <tr key={r.id}>
                  <td style={{fontWeight:'600'}}>{r.month} {r.year}</td>
                  <td style={{color:r.so2Avg>PRESCRIBED_LIMITS.so2?'#c0392b':'#1a2e22',fontWeight:r.so2Avg>PRESCRIBED_LIMITS.so2?'700':'400'}}>{r.so2Avg}</td>
                  <td>{r.no2Avg}</td>
                  <td><span className={r.status==='Compliant'?'badge-compliant':'badge-noncompliant'}>{r.status}</span></td>
                  <td style={{color:'#6b8c7a',fontSize:'0.75rem'}}>{r.submittedOn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function WaterSection() {
  const qC=(q:string)=>q==='Good'?'#1a6b3a':q==='Moderate'?'#856404':q==='Poor'?'#c0550a':'#c0392b';
  const isCrit=MY_WATER.quality==='Critical'||MY_WATER.quality==='Poor';
  return (
    <div>
      <div style={{background:isCrit?'#fdf0ee':'#f0f5ff',border:`1px solid ${isCrit?'#f5c6cb':'#c8d8f0'}`,borderLeft:`5px solid ${isCrit?'#c0392b':'#1a5280'}`,borderRadius:'4px',padding:'0.85rem 1.2rem',marginBottom:'1.25rem'}}>
        <div style={{fontSize:'0.85rem',fontWeight:'700',color:isCrit?'#721c24':'#1a2e4a',marginBottom:'0.2rem'}}>{isCrit?'⚠':'📍'} Nearest Water Body: {MY_WATER.name}</div>
        <div style={{fontSize:'0.75rem',color:isCrit?'#721c24':'#3d5a6a',lineHeight:1.8}}>
          Status: <strong style={{color:qC(MY_WATER.quality)}}>{MY_WATER.quality}</strong> · DO: {MY_WATER.do} mg/L (Min: {WATER_LIMITS.do.min}) · BOD: {MY_WATER.bod} mg/L (Max: {WATER_LIMITS.bod.max}) · Trend: {MY_WATER.trend}
          {isCrit && ' · Your facility effluent discharge may be contributing. Submit a water quality report.'}
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'0.75rem',marginBottom:'1.25rem'}}>
        {([
          ['pH', MY_WATER.ph, `${WATER_LIMITS.ph.min}–${WATER_LIMITS.ph.max}`, MY_WATER.ph<WATER_LIMITS.ph.min||MY_WATER.ph>WATER_LIMITS.ph.max],
          ['DO mg/L', MY_WATER.do, `>${WATER_LIMITS.do.min}`, MY_WATER.do<WATER_LIMITS.do.min],
          ['BOD mg/L', MY_WATER.bod, `<${WATER_LIMITS.bod.max}`, MY_WATER.bod>WATER_LIMITS.bod.max],
          ['TDS mg/L', MY_WATER.tds, `<${WATER_LIMITS.tds.max}`, MY_WATER.tds>WATER_LIMITS.tds.max],
        ] as [string,number,string,boolean][]).map(([k,v,lim,bad])=>(
          <div key={k} style={{background:bad?'#fdf0ee':'#f7f9ff',border:`1px solid ${bad?'#f5c6cb':'#c8d8f0'}`,borderRadius:'4px',padding:'0.75rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div style={{fontSize:'0.68rem',color:'#6b8c7a'}}>{k}</div>
              <div style={{fontSize:'1.3rem',fontWeight:'800',color:bad?'#c0392b':'#1a5280'}}>{v}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:'0.6rem',color:'#94a3b8'}}>Normal range</div>
              <div style={{fontSize:'0.75rem',color:'#6b8c7a'}}>{lim}</div>
              {bad && <div style={{fontSize:'0.62rem',color:'#c0392b',fontWeight:'700',marginTop:'0.1rem'}}>⚠ Out of range</div>}
            </div>
          </div>
        ))}
      </div>
      <div style={{background:'white',border:'1px solid #c8d8f0',borderRadius:'4px',padding:'1rem',fontSize:'0.78rem',color:'#2a4a6a',lineHeight:1.8}}>
        <strong style={{color:'#1a5280'}}>📋 Reporting Obligation:</strong> Under the Water (Prevention and Control of Pollution) Act 1974, industries must submit monthly effluent quality reports. Failure to comply may lead to suspension of Consent to Operate.
      </div>
    </div>
  );
}

function NoiseSection() {
  const dayB=MY_NOISE.dayLevel>MY_NOISE.dayLimit;
  const nightB=MY_NOISE.nightLevel>MY_NOISE.nightLimit;
  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'0.75rem',marginBottom:'1.25rem'}}>
        {[
          ['Day Level',MY_NOISE.dayLevel,MY_NOISE.dayLimit,dayB,'dB(A)'],
          ['Night Level',MY_NOISE.nightLevel,MY_NOISE.nightLimit,nightB,'dB(A)'],
        ].map(([k,v,lim,bad,u])=>(
          <div key={String(k)} style={{background:bad?'#fdf0ee':'#fdf8f0',border:`1px solid ${bad?'#f5c6cb':'#e8d8c0'}`,borderTop:`3px solid ${bad?'#c0392b':'#1a6b3a'}`,borderRadius:'4px',padding:'1rem',textAlign:'center'}}>
            <div style={{fontSize:'0.68rem',color:'#6b5a3a',marginBottom:'0.3rem',textTransform:'uppercase',letterSpacing:'0.06em'}}>{k}</div>
            <div style={{fontSize:'2rem',fontWeight:'800',color:bad?'#c0392b':'#1a6b3a'}}>{v} <span style={{fontSize:'0.75rem',fontWeight:400,color:'#94a3b8'}}>{u}</span></div>
            <div style={{fontSize:'0.68rem',color:'#6b5a3a',marginTop:'0.25rem'}}>Limit: {lim} {u}</div>
            {bad && <div style={{fontSize:'0.7rem',color:'#c0392b',fontWeight:'700',marginTop:'0.15rem'}}>+{Number(v)-Number(lim)} dB over limit</div>}
          </div>
        ))}
      </div>
      <div style={{background:'white',border:'1px solid #e8d8c0',borderRadius:'4px',padding:'1rem',fontSize:'0.78rem',color:'#4a3a1a',lineHeight:1.8}}>
        <div style={{fontWeight:'700',color:'#5a3500',marginBottom:'0.3rem'}}>🏭 Industrial Zone Noise Limits (Noise Pollution Rules, 2000)</div>
        Day: <strong>75 dB(A)</strong> · Night: <strong>70 dB(A)</strong> — your facility is currently
        <strong style={{color:dayB||nightB?'#c0392b':'#1a6b3a',marginLeft:'0.3rem'}}>{dayB||nightB?'exceeding':'within'} prescribed limits</strong>.
        Monthly noise level reports must be submitted to Regional Officer Rajesh Kumar.
      </div>
    </div>
  );
}

export default function IndustryDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [portal, setPortal] = useState<Portal>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push('/'); return; }
    setUser(u);
    const saved = localStorage.getItem(key(u.email)) as Portal | null;
    if (saved) setPortal(saved);
  }, []);

  useEffect(() => {
    const h = (e: Event) => setPortal((e as CustomEvent).detail as Portal);
    window.addEventListener('pvPortalChange', h);
    return () => window.removeEventListener('pvPortalChange', h);
  }, []);

  const handleSelectPortal = (p: Portal) => {
    setPortal(p);
    if (user) localStorage.setItem(key(user.email), p as string);
    window.dispatchEvent(new CustomEvent('pvPortalChange', { detail: p }));
  };

  if (!user) return null;

  const PORTALS = [
    { k:'air' as const,   icon:'💨', label:'Air Quality',   desc:'AQI · SO₂ · PM2.5 emissions compliance', accent:'#1a6b3a', bg:'#f0f8f3', border:'#c8e0d2', stat:`${IND.complianceRate}% compliant`,       statColor:IND.complianceRate<50?'#c0392b':'#d4680a' },
    { k:'water' as const, icon:'💧', label:'Water Quality', desc:'Effluent · Nearby water body monitoring',  accent:'#1a5280', bg:'#f0f5ff', border:'#c8d8f0', stat:`${MY_WATER.quality} — Nag River`,       statColor:MY_WATER.quality==='Critical'?'#c0392b':'#856404' },
    { k:'noise' as const, icon:'🔊', label:'Noise Levels',  desc:'Day & night dB(A) · Industrial zone limits', accent:'#5a3500', bg:'#fff8ee', border:'#f0d8a0', stat:`Day: ${MY_NOISE.dayLevel}/${MY_NOISE.dayLimit} dB`, statColor:MY_NOISE.dayLevel>MY_NOISE.dayLimit?'#c0392b':'#1a6b3a' },
  ];

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#f0f8f3' }}>
      <Sidebar />
      <main style={{ flex:1, overflow:'auto' }}>
        <TopBar title={`Industry Dashboard — ${portal ? PORTALS.find(p=>p.k===portal)?.label : 'Select Domain'}`} subtitle="Bharat Steel Works, Nagpur — Environmental Compliance Portal"/>
        <Toaster position="top-right"/>
        <div style={{ background:'white', borderBottom:'1px solid #e8f5ee', padding:'0.5rem 1.5rem' }}>
          <span style={{ fontSize:'0.7rem', color:'#6b8c7a' }}>Home › </span>
          <span style={{ fontSize:'0.7rem', color:'#1a6b3a', fontWeight:'600' }}>My Dashboard{portal ? ` › ${PORTALS.find(p=>p.k===portal)?.label}` : ''}</span>
        </div>
        <div style={{ padding:'1.25rem 1.5rem' }}>

          {/* Portal selector cards */}
          <div style={{ marginBottom:'1.5rem' }}>
            <div style={{ fontSize:'0.68rem', fontWeight:'700', color:'#3d5a48', textTransform:'uppercase', letterSpacing:'0.09em', marginBottom:'0.85rem' }}>Select Monitoring Domain</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem' }}>
              {PORTALS.map(p => {
                const isActive = portal === p.k;
                return (
                  <button key={p.k} onClick={() => handleSelectPortal(p.k)}
                    style={{ display:'flex', alignItems:'center', gap:'0.9rem', padding:'1rem 1.1rem', background:isActive?p.bg:'white', border:`2px solid ${isActive?p.accent:p.border}`, borderRadius:'8px', cursor:'pointer', textAlign:'left', transition:'all 0.15s', boxShadow:isActive?'0 3px 14px rgba(0,0,0,0.1)':'0 1px 4px rgba(0,0,0,0.05)' }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.borderColor = p.accent; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.borderColor = p.border; }}>
                    <span style={{ fontSize:'2rem', flexShrink:0 }}>{p.icon}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:'0.88rem', fontWeight:'700', color:isActive?p.accent:'#1a2e22', marginBottom:'0.15rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
                        {p.label}
                        {isActive && <span style={{ fontSize:'0.58rem', background:p.accent, color:'white', padding:'1px 5px', borderRadius:'8px' }}>Active</span>}
                      </div>
                      <div style={{ fontSize:'0.63rem', color:'#6b8c7a', lineHeight:1.5 }}>{p.desc}</div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <div style={{ fontSize:'0.78rem', fontWeight:'800', color:p.statColor }}>{p.stat}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Domain content */}
          {!portal && (
            <div style={{ background:'white', border:'2px dashed #c8e0d2', borderRadius:'8px', padding:'4rem 2rem', textAlign:'center' }}>
              <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>☝️</div>
              <div style={{ fontSize:'1rem', fontWeight:'700', color:'#3d5a48', marginBottom:'0.5rem' }}>Choose a domain above to view your compliance data</div>
              <div style={{ fontSize:'0.8rem', color:'#6b8c7a' }}>Air Quality, Water Quality, or Noise Levels</div>
            </div>
          )}
          {portal === 'air'   && <AirSection router={router} />}
          {portal === 'water' && <WaterSection />}
          {portal === 'noise' && <NoiseSection />}

        </div>
      </main>
    </div>
  );
}
