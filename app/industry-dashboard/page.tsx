'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageShell from '@/components/PageShell';
import { useAuth } from '@/lib/useAuth';
import { INDUSTRIES, PRESCRIBED_LIMITS, MONTHLY_REPORTS } from '@/data/mockData';
import { WATER_STATIONS, WATER_LIMITS, WATER_TREND, NOISE_STATIONS, NOISE_TREND } from '@/data/waterNoiseData';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';

type Portal = 'air' | 'water' | 'noise' | null;
const pkey = (email: string) => `pvportal_${email}`;
const IND      = INDUSTRIES[0];
const MY_WATER = WATER_STATIONS.find(s => s.id === 'WTR002')!;
const MY_NOISE = NOISE_STATIONS.find(s => s.id === 'NSE003')!;
const PORTAL_META = {
  air:   { label:'Air Quality',   accent:'#1a6b3a', icon:'💨' },
  water: { label:'Water Quality', accent:'#1a5280', icon:'💧' },
  noise: { label:'Noise Levels',  accent:'#5a3500', icon:'🔊' },
} as const;

// ── AIR ───────────────────────────────────────────────────────────────────────
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
    <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
      {liveAqi>200&&(
        <div className="alert-critical" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <strong style={{fontSize:'0.82rem',color:'#721c24'}}>⚠ AQI Breach — Current: {liveAqi} (Limit: 100)</strong>
            <div style={{fontSize:'0.72rem',color:'#721c24',marginTop:'0.2rem'}}>Sustained breach may trigger inspection. Submit compliance report immediately.</div>
          </div>
          <button className="btn-danger" style={{flexShrink:0,marginLeft:'1rem'}} onClick={()=>router.push('/submit')}>Submit Report</button>
        </div>
      )}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem'}}>
        {[
          {label:'Live AQI',value:liveAqi,color:liveAqi>200?'#c0392b':'#856404'},
          {label:'SO₂ ppm',value:liveSo2,color:liveSo2>PRESCRIBED_LIMITS.so2?'#c0392b':'#1a6b3a'},
          {label:'Compliance Rate',value:`${IND.complianceRate}%`,color:IND.complianceRate<50?'#c0392b':'#856404'},
          {label:'Next Report Due',value:'17 days',color:'#1a4e8a'},
        ].map(s=>(
          <div key={s.label} className="stat-card" style={{borderTopColor:s.color}}>
            <div style={{fontSize:'0.63rem',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'0.3rem',fontFamily:'Arial'}}>{s.label}</div>
            <div style={{fontSize:'1.9rem',fontWeight:'800',color:s.color,lineHeight:1,fontFamily:'Georgia'}}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'1.25rem'}}>
        <div className="section-card">
          <div className="section-title">📈 7-Day Emissions Trend</div>
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={IND.history.map(h=>({date:h.date,SO2:h.so2,NO2:h.no2}))} margin={{top:5,right:10,bottom:5,left:-10}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8eef8"/>
              <XAxis dataKey="date" tick={{fill:'var(--text-muted)',fontSize:10,fontFamily:'Arial'}}/>
              <YAxis tick={{fill:'var(--text-muted)',fontSize:10}}/>
              <Tooltip contentStyle={{background:'white',border:'1px solid var(--border)',fontSize:'12px',fontFamily:'Arial'}}/>
              <ReferenceLine y={PRESCRIBED_LIMITS.so2} stroke="#c0392b" strokeDasharray="4 4" label={{value:'SO₂ Limit',fill:'#c0392b',fontSize:9}}/>
              <Line type="monotone" dataKey="SO2" stroke="#c0392b" strokeWidth={2} dot={{r:3}} name="SO₂"/>
              <Line type="monotone" dataKey="NO2" stroke="#d4680a" strokeWidth={2} dot={{r:3}} name="NO₂"/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="section-card">
          <div className="section-title">⚖️ vs Prescribed Limits</div>
          {([['SO₂',liveSo2,PRESCRIBED_LIMITS.so2,'ppm'],['NO₂',IND.currentNo2,PRESCRIBED_LIMITS.no2,'ppm'],['PM2.5',IND.currentPm25,PRESCRIBED_LIMITS.pm25,'µg/m³']] as [string,number,number,string][]).map(([k,v,lim,u])=>{
            const over=v>lim;
            return (<div key={k} style={{marginBottom:'0.85rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.25rem'}}>
                <span style={{fontSize:'0.78rem',fontWeight:'600',fontFamily:'Arial'}}>{k}</span>
                <span style={{fontSize:'0.75rem',fontWeight:'800',fontFamily:'Georgia',color:over?'#c0392b':'#1a6b3a'}}>{v}/{lim} {u}</span>
              </div>
              <div style={{background:'#e8eef8',borderRadius:'3px',height:'8px'}}>
                <div style={{height:'100%',width:`${Math.min(100,Math.round(v/lim*100))}%`,background:over?'#c0392b':'#1a6b3a',borderRadius:'3px'}}/>
              </div>
            </div>);
          })}
        </div>
      </div>
      {MONTHLY_REPORTS?.length>0&&(
        <div className="section-card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.75rem'}}>
            <div className="section-title" style={{marginBottom:0}}>📋 Monthly Report History</div>
            <button className="btn-outline" style={{fontSize:'0.72rem',padding:'0.28rem 0.75rem'}} onClick={()=>router.push('/industry-reports')}>View All →</button>
          </div>
          <table className="gov-table">
            <thead><tr><th>Month</th><th>Avg SO₂</th><th>Avg NO₂</th><th>Avg PM2.5</th><th>Status</th><th>Submitted</th></tr></thead>
            <tbody>
              {MONTHLY_REPORTS.slice(0,4).map(r=>(
                <tr key={r.id}>
                  <td style={{fontWeight:'600'}}>{r.month} {r.year}</td>
                  <td style={{color:r.so2Avg>PRESCRIBED_LIMITS.so2?'#c0392b':'var(--text-dark)',fontWeight:r.so2Avg>PRESCRIBED_LIMITS.so2?'700':'400'}}>{r.so2Avg}</td>
                  <td style={{color:r.no2Avg>PRESCRIBED_LIMITS.no2?'#c0392b':'var(--text-dark)'}}>{r.no2Avg}</td>
                  <td style={{color:r.pm25Avg>PRESCRIBED_LIMITS.pm25?'#c0392b':'var(--text-dark)'}}>{r.pm25Avg}</td>
                  <td><span className={r.status==='Compliant'?'badge-compliant':'badge-noncompliant'}>{r.status}</span></td>
                  <td style={{color:'var(--text-muted)',fontSize:'0.75rem'}}>{r.submittedOn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── WATER ─────────────────────────────────────────────────────────────────────
function WaterSection({ router }: { router: any }) {
  const qC=(q:string)=>q==='Good'?'#1a6b3a':q==='Moderate'?'#856404':q==='Poor'?'#c0550a':'#c0392b';
  const isCrit=MY_WATER.quality==='Critical'||MY_WATER.quality==='Poor';

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
      <div className={isCrit?'alert-critical':'alert-info'}>
        <strong style={{fontSize:'0.82rem',color:isCrit?'#721c24':'#1a2e4a'}}>{isCrit?'⚠':'📍'} Nearest Water Body: {MY_WATER.name}</strong>
        <div style={{fontSize:'0.75rem',color:isCrit?'#721c24':'#3d5a6a',marginTop:'0.2rem',lineHeight:1.7}}>
          Quality: <strong style={{color:qC(MY_WATER.quality)}}>{MY_WATER.quality}</strong> · DO: {MY_WATER.do} mg/L · BOD: {MY_WATER.bod} mg/L · TDS: {MY_WATER.tds} mg/L · Trend: {MY_WATER.trend}
          {isCrit&&' — Effluent discharge monitoring required. Submit water quality report immediately.'}
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'0.85rem'}}>
        {([['pH',MY_WATER.ph,`${WATER_LIMITS.ph.min}–${WATER_LIMITS.ph.max}`,MY_WATER.ph<WATER_LIMITS.ph.min||MY_WATER.ph>WATER_LIMITS.ph.max],
           ['DO mg/L',MY_WATER.do,`>${WATER_LIMITS.do.min}`,MY_WATER.do<WATER_LIMITS.do.min],
           ['BOD mg/L',MY_WATER.bod,`<${WATER_LIMITS.bod.max}`,MY_WATER.bod>WATER_LIMITS.bod.max],
           ['TDS mg/L',MY_WATER.tds,`<${WATER_LIMITS.tds.max}`,MY_WATER.tds>WATER_LIMITS.tds.max]] as [string,number,string,boolean][]).map(([k,v,lim,bad])=>(
          <div key={k} className="stat-card" style={{borderTopColor:bad?'#c0392b':'#1a6b3a',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.85rem 1.1rem'}}>
            <div>
              <div style={{fontSize:'0.65rem',color:'var(--text-muted)',fontFamily:'Arial',marginBottom:'0.2rem'}}>{k}</div>
              <div style={{fontSize:'1.6rem',fontWeight:'800',color:bad?'#c0392b':'#1a5280',fontFamily:'Georgia'}}>{v}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:'0.62rem',color:'var(--text-muted)',fontFamily:'Arial'}}>Normal: {lim}</div>
              {bad&&<div style={{fontSize:'0.68rem',color:'#c0392b',fontWeight:'700',marginTop:'0.2rem',fontFamily:'Arial'}}>⚠ Out of range</div>}
            </div>
          </div>
        ))}
      </div>
      <div className="section-card">
        <div className="section-title">📈 Water Quality Trend — {MY_WATER.body}</div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={WATER_TREND} margin={{top:5,right:10,bottom:5,left:-10}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8eef8"/>
            <XAxis dataKey="month" tick={{fill:'var(--text-muted)',fontSize:10,fontFamily:'Arial'}}/>
            <YAxis tick={{fill:'var(--text-muted)',fontSize:10}}/>
            <Tooltip contentStyle={{background:'white',border:'1px solid var(--border)',fontSize:'12px',fontFamily:'Arial'}}/>
            <Legend wrapperStyle={{fontSize:'11px',fontFamily:'Arial'}}/>
            <ReferenceLine y={6} stroke="#1a6b3a" strokeDasharray="4 4" label={{value:'DO Min',fill:'#1a6b3a',fontSize:9}}/>
            <ReferenceLine y={3} stroke="#c0392b" strokeDasharray="4 4" label={{value:'BOD Max',fill:'#c0392b',fontSize:9}}/>
            <Line type="monotone" dataKey="do"  stroke="#1a5280" strokeWidth={2} name="DO mg/L" dot={{r:3}}/>
            <Line type="monotone" dataKey="bod" stroke="#c0392b" strokeWidth={2} name="BOD mg/L" dot={{r:3}}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="section-card" style={{borderLeft:'4px solid #1a5280',background:'#f0f5ff'}}>
        <div className="section-title" style={{color:'#1a5280'}}>📋 Water Quality Reporting Obligation</div>
        <p style={{fontSize:'0.78rem',color:'var(--text-mid)',fontFamily:'Arial',lineHeight:1.8}}>Under the <strong>Water (Prevention and Control of Pollution) Act, 1974</strong>, industries discharging effluents are required to submit monthly water quality reports. Non-compliance may result in <strong>suspension of Consent to Operate</strong>. Reports are due by the last working day of each month.</p>
        <button className="btn-primary" style={{marginTop:'0.75rem',fontSize:'0.75rem'}} onClick={()=>router.push('/submit')}>Submit Water Quality Report</button>
      </div>
    </div>
  );
}

// ── NOISE ─────────────────────────────────────────────────────────────────────
function NoiseSection({ router }: { router: any }) {
  const dayB   = MY_NOISE.dayLevel   > MY_NOISE.dayLimit;
  const nightB = MY_NOISE.nightLevel > MY_NOISE.nightLimit;

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
      {(dayB||nightB)&&(
        <div className="alert-critical">
          <strong style={{fontSize:'0.82rem',color:'#721c24'}}>⚠ Noise Limit Exceeded at your facility zone</strong>
          <div style={{fontSize:'0.72rem',color:'#721c24',marginTop:'0.2rem'}}>Day: {MY_NOISE.dayLevel}/{MY_NOISE.dayLimit} dB(A) · Night: {MY_NOISE.nightLevel}/{MY_NOISE.nightLimit} dB(A) — Submit monthly noise report immediately.</div>
        </div>
      )}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
        {([['Day Level',MY_NOISE.dayLevel,MY_NOISE.dayLimit,dayB],['Night Level',MY_NOISE.nightLevel,MY_NOISE.nightLimit,nightB]] as [string,number,number,boolean][]).map(([k,v,lim,bad])=>(
          <div key={k} className="stat-card" style={{borderTopColor:bad?'#c0392b':'#1a6b3a',textAlign:'center',padding:'1.25rem'}}>
            <div style={{fontSize:'0.65rem',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.07em',fontFamily:'Arial',marginBottom:'0.4rem'}}>{k}</div>
            <div style={{fontSize:'2.5rem',fontWeight:'800',color:bad?'#c0392b':'#1a6b3a',fontFamily:'Georgia'}}>{v} <span style={{fontSize:'0.9rem',fontWeight:400,color:'var(--text-muted)'}}>dB(A)</span></div>
            <div style={{fontSize:'0.7rem',color:'var(--text-muted)',fontFamily:'Arial',marginTop:'0.3rem'}}>Limit: {lim} dB(A)</div>
            {bad&&<div style={{fontSize:'0.72rem',color:'#c0392b',fontWeight:'700',marginTop:'0.3rem',fontFamily:'Arial'}}>+{v-lim} dB over limit</div>}
          </div>
        ))}
      </div>
      <div className="section-card">
        <div className="section-title">📈 24-Hour Noise Pattern — {MY_NOISE.zone} Zone</div>
        <div style={{fontSize:'0.68rem',color:'var(--text-muted)',fontFamily:'Arial',marginBottom:'0.75rem'}}>Typical daily noise pattern. Industrial zone day limit: {MY_NOISE.dayLimit} dB(A)</div>
        <ResponsiveContainer width="100%" height={175}>
          <AreaChart data={NOISE_TREND} margin={{top:5,right:10,bottom:5,left:-10}}>
            <defs>
              <linearGradient id="myNoiseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#5a3500" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#5a3500" stopOpacity={0.02}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8eef8"/>
            <XAxis dataKey="time" tick={{fill:'var(--text-muted)',fontSize:10,fontFamily:'Arial'}}/>
            <YAxis tick={{fill:'var(--text-muted)',fontSize:10}} domain={[35,85]}/>
            <Tooltip contentStyle={{background:'white',border:'1px solid var(--border)',fontSize:'12px',fontFamily:'Arial'}}/>
            <ReferenceLine y={MY_NOISE.dayLimit} stroke="#c0392b" strokeDasharray="4 4" label={{value:`Day Limit (${MY_NOISE.dayLimit})`,fill:'#c0392b',fontSize:9}}/>
            <Area type="monotone" dataKey="level" stroke="#5a3500" strokeWidth={2} fill="url(#myNoiseGrad)" name="Noise dB(A)"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="section-card" style={{borderLeft:'4px solid #5a3500',background:'#fffbf5'}}>
        <div className="section-title" style={{color:'#5a3500'}}>📋 Noise Reporting Obligation — Industrial Zone</div>
        <p style={{fontSize:'0.78rem',color:'var(--text-mid)',fontFamily:'Arial',lineHeight:1.8}}>Under <strong>Noise Pollution (Regulation and Control) Rules, 2000</strong>, Industrial zone limits are <strong>{MY_NOISE.dayLimit} dB(A) Day / {MY_NOISE.nightLimit} dB(A) Night</strong>. Monthly noise measurement reports must be submitted to your Regional Officer. Persistent violations attract penalties under Section 15 of the Environment (Protection) Act, 1986.</p>
        <button className="btn-primary" style={{marginTop:'0.75rem',fontSize:'0.75rem'}} onClick={()=>router.push('/submit')}>Submit Noise Report</button>
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function IndustryDashboard() {
  const router = useRouter();
  const { user, mounted } = useAuth({ allowedRoles:['Industry User'] });
  const [portal, setPortal] = useState<Portal>(null);

  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(pkey(user.email)) as Portal|null;
    if (saved) setPortal(saved);
  }, [user]);

  useEffect(() => {
    const h = (e:Event) => setPortal((e as CustomEvent).detail as Portal);
    window.addEventListener('pvPortalChange', h);
    return () => window.removeEventListener('pvPortalChange', h);
  }, []);

  const activeP = portal ? PORTAL_META[portal] : null;

  return (
    <PageShell loading={!mounted||!user}>
      <Toaster position="top-right" toastOptions={{style:{background:'white',color:'var(--text-dark)',border:'1px solid var(--border)',fontFamily:'Arial',fontSize:'0.82rem'}}}/>
      <div className="breadcrumb">
        <span>🏠 Home</span><span>›</span>
        <a onClick={()=>router.push('/industry-dashboard')}>My Dashboard</a>
        {portal&&<><span>›</span><span style={{color:activeP?.accent,fontWeight:'700'}}>{activeP?.icon} {activeP?.label}</span></>}
      </div>
      <div className="live-bar">
        <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
          <span className="live-dot"/>
          <span style={{fontSize:'0.72rem',fontWeight:'700',color:'#22c55e',fontFamily:'Arial',letterSpacing:'0.05em'}}>LIVE</span>
          <span style={{fontSize:'0.7rem',color:'var(--text-muted)',fontFamily:'Arial',marginLeft:'0.5rem'}}>
            {portal==='air'   && 'Air emissions · AQI, SO₂, NO₂, PM2.5 · Bharat Steel Works, Nagpur'}
            {portal==='water' && 'Water quality · pH, DO, BOD, effluent parameters · Nag River zone'}
            {portal==='noise' && 'Noise levels · Day/Night dB(A) · Butibori MIDC, Nagpur'}
            {!portal           && 'Bharat Steel Works, Nagpur · Industry Compliance Portal'}
          </span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'0.6rem'}}>
          {portal && (
            <span style={{fontSize:'0.65rem',fontWeight:'700',color:activeP?.accent,fontFamily:'Arial',background:`${activeP?.accent}15`,padding:'0.1rem 0.55rem',borderRadius:'3px',border:`1px solid ${activeP?.accent}35`}}>
              {activeP?.icon} {activeP?.label}
            </span>
          )}
          <span style={{fontSize:'0.7rem',color:'var(--text-muted)',fontFamily:'Arial'}}>Industry Portal</span>
        </div>
      </div>
      <div className="main-content">
        {!portal?(
          <div className="empty-domain">
            <div style={{fontSize:'3.5rem',marginBottom:'1.25rem'}}>🌿</div>
            <div style={{fontSize:'1.1rem',fontWeight:'700',color:'var(--navy)',marginBottom:'0.5rem',fontFamily:'Georgia'}}>Select a Monitoring Domain</div>
            <div style={{fontSize:'0.82rem',color:'var(--text-muted)',fontFamily:'Arial',maxWidth:'360px',margin:'0 auto',lineHeight:1.7}}>Choose Air Quality, Water Quality, or Noise Levels from the left panel to view your compliance data and submit reports.</div>
            <div style={{display:'flex',gap:'1rem',justifyContent:'center',marginTop:'2rem'}}>
              {(['air','water','noise'] as const).map(p=>(
                <button key={p} onClick={()=>{setPortal(p);if(user)localStorage.setItem(pkey(user.email),p);window.dispatchEvent(new CustomEvent('pvPortalChange',{detail:p}));}}
                  style={{background:'white',border:`2px solid ${PORTAL_META[p].accent}`,color:PORTAL_META[p].accent,borderRadius:'4px',padding:'0.6rem 1.25rem',fontSize:'0.82rem',fontFamily:'Arial',fontWeight:'700',cursor:'pointer'}}>
                  {PORTAL_META[p].icon} {PORTAL_META[p].label}
                </button>
              ))}
            </div>
          </div>
        ):portal==='air'?<AirSection router={router}/>
          :portal==='water'?<WaterSection router={router}/>
          :<NoiseSection router={router}/>
        }
      </div>
    </PageShell>
  );
}
