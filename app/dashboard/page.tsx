'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageShell from '@/components/PageShell';
import { useAuth } from '@/lib/useAuth';
import { STATIONS, INDUSTRIES, PRESCRIBED_LIMITS, REPORTS } from '@/data/mockData';
import { WATER_STATIONS, WATER_LIMITS, WATER_TREND, NOISE_STATIONS, NOISE_TREND } from '@/data/waterNoiseData';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';

type Portal = 'air' | 'water' | 'noise' | null;
const pkey = (email: string) => `pvportal_${email}`;

const PORTAL_META = {
  air:   { label:'Air Quality',   accent:'#1a6b3a', icon:'💨' },
  water: { label:'Water Quality', accent:'#1a5280', icon:'💧' },
  noise: { label:'Noise Levels',  accent:'#5a3500', icon:'🔊' },
} as const;

// ── AIR ──────────────────────────────────────────────────────────────────────
function AirDashboard({ user, liveData }: { user: any; liveData: typeof STATIONS }) {
  const router     = useRouter();
  const isRO       = user?.role === 'Regional Officer';
  const stations   = isRO ? liveData.filter(s => ['Nagpur','Pune'].includes(s.district)) : liveData;
  const industries = isRO ? INDUSTRIES.filter(i => i.assignedRO === 'Rajesh Kumar') : INDUSTRIES;
  const breaches   = stations.filter(s => s.status === 'breach').length;
  const warnings   = stations.filter(s => s.status === 'warning').length;
  const avgAqi     = Math.round(stations.reduce((a, s) => a + s.aqi, 0) / stations.length);
  const trendData  = INDUSTRIES[0].history.map((h, i) => ({ date:h.date, 'SO₂':h.so2, 'NO₂':INDUSTRIES[1].history[i]?.no2||0 }));
  const compliant    = REPORTS.filter(r => r.status==='Compliant').length;
  const nonCompliant = REPORTS.filter(r => r.status==='Non-Compliant').length;
  const pending      = REPORTS.filter(r => r.status==='Pending').length;

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
      {breaches>0 && (
        <div className="alert-critical">
          <strong style={{fontSize:'0.82rem',color:'#721c24'}}>🚨 Active Limit Breaches: {breaches} station{breaches>1?'s':''} exceeding prescribed limits</strong>
          <div style={{fontSize:'0.72rem',color:'#721c24',marginTop:'0.2rem'}}>{stations.filter(s=>s.status==='breach').map(s=>`${s.name} (AQI: ${s.aqi})`).join(' · ')}</div>
        </div>
      )}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem'}}>
        {[
          {label:'Active Stations',value:stations.length,color:'#1a4e8a'},
          {label:'Limit Breaches',value:breaches,sub:`${warnings} warnings`,color:'#c0392b'},
          {label:'State Average AQI',value:avgAqi,color:avgAqi>100?'#c0392b':avgAqi>50?'#856404':'#1a6b3a'},
          {label:'Industries Monitored',value:industries.length,color:'#5a3500'},
        ].map(s=>(
          <div key={s.label} className="stat-card" style={{borderTopColor:s.color}}>
            <div style={{fontSize:'0.63rem',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'0.3rem',fontFamily:'Arial'}}>{s.label}</div>
            <div style={{fontSize:'2.2rem',fontWeight:'800',color:s.color,lineHeight:1,fontFamily:'Georgia'}}>{s.value}</div>
            {(s as any).sub&&<div style={{fontSize:'0.63rem',color:'var(--text-muted)',marginTop:'0.2rem',fontFamily:'Arial'}}>{(s as any).sub}</div>}
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'1.25rem'}}>
        <div className="section-card">
          <div className="section-title">📈 7-Day SO₂ / NO₂ Trend</div>
          <ResponsiveContainer width="100%" height={195}>
            <LineChart data={trendData} margin={{top:5,right:10,bottom:5,left:-10}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8eef8"/>
              <XAxis dataKey="date" tick={{fill:'var(--text-muted)',fontSize:10,fontFamily:'Arial'}}/>
              <YAxis tick={{fill:'var(--text-muted)',fontSize:10}}/>
              <Tooltip contentStyle={{background:'white',border:'1px solid var(--border)',fontSize:'12px',fontFamily:'Arial'}}/>
              <Legend wrapperStyle={{fontSize:'11px',fontFamily:'Arial'}}/>
              <ReferenceLine y={PRESCRIBED_LIMITS.so2} stroke="#c0392b" strokeDasharray="5 5" label={{value:'Limit 80',fill:'#c0392b',fontSize:9}}/>
              <Line type="monotone" dataKey="SO₂" stroke="#c0392b" strokeWidth={2} dot={false}/>
              <Line type="monotone" dataKey="NO₂" stroke="#d4680a" strokeWidth={2} dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="section-card">
          <div className="section-title">📊 Industry Compliance</div>
          {industries.map(ind=>(
            <div key={ind.id} style={{marginBottom:'0.85rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.25rem'}}>
                <span style={{fontSize:'0.75rem',fontWeight:'600',fontFamily:'Arial',color:'var(--text-dark)'}}>{ind.name.split(' ').slice(0,2).join(' ')}</span>
                <span style={{fontSize:'0.75rem',fontWeight:'800',fontFamily:'Georgia',color:ind.complianceRate<50?'#c0392b':ind.complianceRate<80?'#856404':'#1a6b3a'}}>{ind.complianceRate}%</span>
              </div>
              <div style={{background:'#e8eef8',borderRadius:'3px',height:'8px'}}>
                <div style={{height:'100%',width:`${ind.complianceRate}%`,background:ind.complianceRate<50?'#c0392b':ind.complianceRate<80?'#856404':'#1a6b3a',borderRadius:'3px',transition:'width 0.3s'}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem'}}>
        {[
          {label:'Compliant Reports',value:compliant,color:'#1a6b3a',bg:'#d4edda'},
          {label:'Non-Compliant Reports',value:nonCompliant,color:'#c0392b',bg:'#fdf0ee'},
          {label:'Pending Submission',value:pending,color:'#856404',bg:'#fff3cd'},
        ].map(s=>(
          <div key={s.label} style={{background:s.bg,border:`1px solid ${s.color}30`,borderLeft:`4px solid ${s.color}`,borderRadius:'4px',padding:'0.85rem 1rem',display:'flex',alignItems:'center',gap:'1rem'}}>
            <div style={{fontSize:'2.2rem',fontWeight:'800',color:s.color,lineHeight:1,fontFamily:'Georgia'}}>{s.value}</div>
            <div style={{fontSize:'0.78rem',fontWeight:'600',color:s.color,fontFamily:'Arial'}}>{s.label}</div>
          </div>
        ))}
      </div>
      <div className="section-card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.75rem'}}>
          <div className="section-title" style={{marginBottom:0}}>🏭 Live Station Readings</div>
          {!isRO&&<button className="btn-outline" style={{fontSize:'0.7rem',padding:'0.22rem 0.6rem'}} onClick={()=>router.push('/map')}>Map View →</button>}
        </div>
        <div style={{overflowX:'auto'}}>
          <table className="gov-table">
            <thead><tr><th>Station</th><th>District</th><th>AQI</th><th>SO₂ ppm</th><th>NO₂ ppm</th><th>PM2.5</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {stations.map(s=>(
                <tr key={s.id}>
                  <td style={{fontWeight:'600'}}>{s.name}</td>
                  <td style={{color:'var(--text-muted)'}}>{s.district}</td>
                  <td style={{fontWeight:'800',fontFamily:'Georgia',color:s.status==='breach'?'#c0392b':s.status==='warning'?'#856404':'#1a6b3a'}}>{s.aqi}</td>
                  <td style={{color:s.so2>PRESCRIBED_LIMITS.so2?'#c0392b':'var(--text-dark)',fontWeight:s.so2>PRESCRIBED_LIMITS.so2?'700':'400'}}>{s.so2}</td>
                  <td>{s.no2}</td><td>{s.pm25}</td>
                  <td><span className={`badge-${s.status}`}>{s.status}</span></td>
                  <td>{s.status==='breach'&&<button className="btn-danger" style={{fontSize:'0.68rem',padding:'0.2rem 0.55rem'}} onClick={()=>toast.error(`Inspection ordered: ${s.district}`,{icon:'📋'})}>Inspect</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="section-card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.75rem'}}>
          <div className="section-title" style={{marginBottom:0}}>📋 Recent Reports</div>
          <button className="btn-outline" style={{fontSize:'0.7rem',padding:'0.22rem 0.6rem'}} onClick={()=>router.push('/reports')}>View All →</button>
        </div>
        <table className="gov-table">
          <thead><tr><th>ID</th><th>Industry</th><th>Type</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            {REPORTS.slice(0,5).map(r=>(
              <tr key={r.id}>
                <td style={{fontFamily:'monospace',fontSize:'0.78rem',color:'var(--accent-blue)'}}>{r.id}</td>
                <td style={{fontWeight:'600'}}>{r.industry}</td>
                <td>{r.type}</td>
                <td style={{color:'var(--text-muted)'}}>{r.date}</td>
                <td><span className={r.status==='Compliant'?'badge-compliant':r.status==='Non-Compliant'?'badge-noncompliant':'badge-pending'}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── WATER ─────────────────────────────────────────────────────────────────────
function WaterDashboard({ user }: { user: any }) {
  const isRO = user?.role === 'Regional Officer';
  const [inspected, setInspected] = useState<Set<string>>(new Set());
  const stations  = isRO ? WATER_STATIONS.filter(s=>['Nagpur','Thane','Navi Mumbai'].includes(s.district)) : WATER_STATIONS;
  const critical  = stations.filter(s=>s.quality==='Critical');
  const poor      = stations.filter(s=>s.quality==='Poor');
  const good      = stations.filter(s=>s.quality==='Good');
  const worsening = stations.filter(s=>s.trend==='worsening');
  const phB  = stations.filter(s=>s.ph<WATER_LIMITS.ph.min||s.ph>WATER_LIMITS.ph.max).length;
  const doB  = stations.filter(s=>s.do<WATER_LIMITS.do.min).length;
  const bodB = stations.filter(s=>s.bod>WATER_LIMITS.bod.max).length;
  const colB = stations.filter(s=>s.coliform>WATER_LIMITS.coliform.max).length;
  const qC=(q:string)=>q==='Good'?'#1a6b3a':q==='Moderate'?'#856404':q==='Poor'?'#c0550a':'#c0392b';
  const qB=(q:string)=>q==='Good'?'#d4edda':q==='Moderate'?'#fff3cd':q==='Poor'?'#fde9d9':'#f8d7da';

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
      {critical.length>0&&(
        <div className="alert-critical">
          <strong style={{fontSize:'0.82rem',color:'#721c24'}}>🚨 Critical Contamination: {critical.length} site{critical.length>1?'s':''} — Immediate Action Required</strong>
          <div style={{fontSize:'0.72rem',color:'#721c24',marginTop:'0.2rem'}}>{critical.map(s=>`${s.name} — DO: ${s.do} mg/L, BOD: ${s.bod} mg/L`).join(' · ')}</div>
        </div>
      )}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem'}}>
        {[
          {label:'Monitoring Sites',value:stations.length,color:'#1a5280'},
          {label:'Good Quality',value:good.length,color:'#1a6b3a'},
          {label:'Poor / Critical',value:poor.length+critical.length,color:'#c0392b'},
          {label:'Worsening Trend',value:worsening.length,color:'#c0392b'},
        ].map(s=>(
          <div key={s.label} className="stat-card" style={{borderTopColor:s.color}}>
            <div style={{fontSize:'0.63rem',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'0.3rem',fontFamily:'Arial'}}>{s.label}</div>
            <div style={{fontSize:'2.2rem',fontWeight:'800',color:s.color,lineHeight:1,fontFamily:'Georgia'}}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'1.25rem'}}>
        <div className="section-card">
          <div className="section-title">📈 DO vs BOD Trend — Nag River (7 Months)</div>
          <div style={{fontSize:'0.68rem',color:'var(--text-muted)',fontFamily:'Arial',marginBottom:'0.75rem'}}>DO below 6 mg/L and BOD above 3 mg/L indicate worsening pollution</div>
          <ResponsiveContainer width="100%" height={185}>
            <LineChart data={WATER_TREND} margin={{top:5,right:10,bottom:5,left:-10}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8eef8"/>
              <XAxis dataKey="month" tick={{fill:'var(--text-muted)',fontSize:10,fontFamily:'Arial'}}/>
              <YAxis tick={{fill:'var(--text-muted)',fontSize:10}}/>
              <Tooltip contentStyle={{background:'white',border:'1px solid var(--border)',fontSize:'12px',fontFamily:'Arial'}}/>
              <Legend wrapperStyle={{fontSize:'11px',fontFamily:'Arial'}}/>
              <ReferenceLine y={6} stroke="#1a6b3a" strokeDasharray="4 4" label={{value:'DO Min (6)',fill:'#1a6b3a',fontSize:9}}/>
              <ReferenceLine y={3} stroke="#c0392b" strokeDasharray="4 4" label={{value:'BOD Max (3)',fill:'#c0392b',fontSize:9}}/>
              <Line type="monotone" dataKey="do"  stroke="#1a5280" strokeWidth={2} dot={{r:3}} name="DO mg/L"/>
              <Line type="monotone" dataKey="bod" stroke="#c0392b" strokeWidth={2} dot={{r:3}} name="BOD mg/L"/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="section-card">
          <div className="section-title">⚠ Parameter Breaches</div>
          {[
            {label:'pH Out of Range',count:phB, limit:`${WATER_LIMITS.ph.min}–${WATER_LIMITS.ph.max}`,color:'#856404'},
            {label:'Low DO',         count:doB, limit:`< ${WATER_LIMITS.do.min} mg/L`,   color:'#c0392b'},
            {label:'High BOD',       count:bodB,limit:`> ${WATER_LIMITS.bod.max} mg/L`,  color:'#c0392b'},
            {label:'High Coliform',  count:colB,limit:`> ${WATER_LIMITS.coliform.max}`,  color:'#c0392b'},
          ].map(p=>(
            <div key={p.label} style={{marginBottom:'0.9rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.25rem'}}>
                <span style={{fontSize:'0.75rem',fontWeight:'600',fontFamily:'Arial',color:'var(--text-dark)'}}>{p.label}</span>
                <span style={{fontSize:'0.72rem',fontWeight:'800',fontFamily:'Georgia',color:p.count>0?p.color:'#1a6b3a'}}>{p.count}/{stations.length}</span>
              </div>
              <div style={{background:'#e8eef8',borderRadius:'3px',height:'7px'}}>
                <div style={{height:'100%',width:`${stations.length>0?(p.count/stations.length)*100:0}%`,background:p.count>0?p.color:'#1a6b3a',borderRadius:'3px',minWidth:p.count>0?'4px':'0'}}/>
              </div>
              <div style={{fontSize:'0.6rem',color:'var(--text-muted)',fontFamily:'Arial',marginTop:'0.1rem'}}>Limit: {p.limit}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'0.85rem'}}>
        {[
          {label:'Critical',count:critical.length,color:'#c0392b',bg:'#fdf0ee'},
          {label:'Poor',count:poor.length,color:'#c0550a',bg:'#fde9d9'},
          {label:'Moderate',count:stations.filter(s=>s.quality==='Moderate').length,color:'#856404',bg:'#fff3cd'},
          {label:'Good',count:good.length,color:'#1a6b3a',bg:'#d4edda'},
        ].map(q=>(
          <div key={q.label} style={{background:q.bg,border:`1px solid ${q.color}30`,borderLeft:`4px solid ${q.color}`,borderRadius:'4px',padding:'0.85rem 1rem'}}>
            <div style={{fontSize:'0.63rem',color:q.color,textTransform:'uppercase',letterSpacing:'0.07em',fontFamily:'Arial',marginBottom:'0.25rem'}}>{q.label}</div>
            <div style={{fontSize:'2rem',fontWeight:'800',color:q.color,fontFamily:'Georgia'}}>{q.count}</div>
            <div style={{fontSize:'0.65rem',color:q.color,fontFamily:'Arial'}}>sites</div>
          </div>
        ))}
      </div>
      <div className="section-card">
        <div className="section-title">💧 Live Water Quality Readings</div>
        <div style={{overflowX:'auto'}}>
          <table className="gov-table">
            <thead><tr>
              <th>Station</th><th>District</th>
              <th>pH<br/><span style={{fontWeight:400,fontSize:'0.6rem'}}>6.5–8.5</span></th>
              <th>DO mg/L<br/><span style={{fontWeight:400,fontSize:'0.6rem'}}>min 6</span></th>
              <th>BOD mg/L<br/><span style={{fontWeight:400,fontSize:'0.6rem'}}>max 3</span></th>
              <th>TDS mg/L<br/><span style={{fontWeight:400,fontSize:'0.6rem'}}>max 500</span></th>
              <th>Coliform<br/><span style={{fontWeight:400,fontSize:'0.6rem'}}>max 50</span></th>
              <th>Quality</th><th>Trend</th>
              {!isRO&&<th>Action</th>}
            </tr></thead>
            <tbody>
              {stations.map(s=>(
                <tr key={s.id}>
                  <td style={{fontWeight:'600',fontSize:'0.8rem'}}>{s.name}</td>
                  <td style={{color:'var(--text-muted)'}}>{s.district}</td>
                  <td style={{color:s.ph<WATER_LIMITS.ph.min||s.ph>WATER_LIMITS.ph.max?'#c0392b':'var(--text-dark)',fontWeight:s.ph<WATER_LIMITS.ph.min||s.ph>WATER_LIMITS.ph.max?'700':'400'}}>{s.ph}</td>
                  <td style={{color:s.do<WATER_LIMITS.do.min?'#c0392b':'#1a6b3a',fontWeight:s.do<WATER_LIMITS.do.min?'700':'400'}}>{s.do}</td>
                  <td style={{color:s.bod>WATER_LIMITS.bod.max?'#c0392b':'var(--text-dark)',fontWeight:s.bod>WATER_LIMITS.bod.max?'700':'400'}}>{s.bod}</td>
                  <td style={{color:s.tds>WATER_LIMITS.tds.max?'#c0392b':'var(--text-dark)'}}>{s.tds}</td>
                  <td style={{color:s.coliform>WATER_LIMITS.coliform.max?'#c0392b':'var(--text-dark)',fontWeight:s.coliform>WATER_LIMITS.coliform.max?'700':'400'}}>{s.coliform}</td>
                  <td><span style={{background:qB(s.quality),color:qC(s.quality),fontSize:'0.65rem',fontWeight:'700',padding:'2px 9px',borderRadius:'2px',fontFamily:'Arial',textTransform:'uppercase'}}>{s.quality}</span></td>
                  <td style={{color:s.trend==='worsening'?'#c0392b':s.trend==='improving'?'#1a6b3a':'var(--text-muted)',fontSize:'0.78rem',fontWeight:'600'}}>{s.trend==='worsening'?'↓ Worsening':s.trend==='improving'?'↑ Improving':'→ Stable'}</td>
                  {!isRO&&<td>{(s.quality==='Critical'||s.quality==='Poor')&&(inspected.has(s.id)?<span style={{fontSize:'0.7rem',color:'#1a6b3a',fontWeight:'700',fontFamily:'Arial'}}>✓ Actioned</span>:<button className="btn-danger" style={{fontSize:'0.68rem',padding:'0.2rem 0.55rem'}} onClick={()=>{setInspected(p=>new Set(p).add(s.id));toast.error(`Remediation ordered: ${s.district}`,{icon:'💧'});}}>Order Remediation</button>)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="section-card" style={{borderLeft:'4px solid #1a5280',background:'#f0f5ff'}}>
        <div className="section-title" style={{color:'#1a5280'}}>📏 Prescribed Water Quality Limits (MPCB / CPCB)</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'0.75rem'}}>
          {[['pH',`${WATER_LIMITS.ph.min}–${WATER_LIMITS.ph.max}`,'Neutral range for aquatic life'],['Dissolved Oxygen',`Min ${WATER_LIMITS.do.min} mg/L`,'Essential for aquatic organisms'],['BOD',`Max ${WATER_LIMITS.bod.max} mg/L`,'Organic pollution indicator'],['TDS',`Max ${WATER_LIMITS.tds.max} mg/L`,'Total dissolved solids'],['Coliform',`Max ${WATER_LIMITS.coliform.max} MPN/100mL`,'Bacterial contamination'],['Turbidity',`Max ${WATER_LIMITS.turbidity.max} NTU`,'Water clarity']].map(([p,lim,desc])=>(
            <div key={p} style={{background:'white',borderRadius:'4px',padding:'0.65rem 0.85rem',border:'1px solid var(--border)'}}>
              <div style={{fontSize:'0.72rem',fontWeight:'700',color:'#1a5280',fontFamily:'Arial'}}>{p}</div>
              <div style={{fontSize:'0.82rem',fontWeight:'800',color:'var(--navy)',fontFamily:'Georgia',margin:'0.15rem 0'}}>{lim}</div>
              <div style={{fontSize:'0.62rem',color:'var(--text-muted)',fontFamily:'Arial'}}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── NOISE ─────────────────────────────────────────────────────────────────────
function NoiseDashboard({ user }: { user: any }) {
  const isRO = user?.role === 'Regional Officer';
  const [noticed, setNoticed] = useState<Set<string>>(new Set());
  const stations  = isRO ? NOISE_STATIONS.filter(s=>['Nagpur','Thane','Navi Mumbai'].includes(s.district)) : NOISE_STATIONS;
  const breaches  = stations.filter(s=>s.status==='breach');
  const warnings  = stations.filter(s=>s.status==='warning');
  const compliant = stations.filter(s=>s.status==='safe');
  const sC=(s:string)=>s==='safe'?'#1a6b3a':s==='warning'?'#856404':'#c0392b';
  const sB=(s:string)=>s==='safe'?'#d4edda':s==='warning'?'#fff3cd':'#f8d7da';
  const zI=(z:string)=>z==='Industrial'?'🏭':z==='Commercial'?'🏢':z==='Residential'?'🏘':'🌿';
  const barData = stations.map(s=>({name:s.name.split(' ').slice(0,2).join(' '),'Day dB':s.dayLevel,'Day Limit':s.dayLimit,over:s.dayLevel>s.dayLimit}));
  const zoneGroups = ['Industrial','Commercial','Residential','Silence'].map(zone=>({
    zone,total:stations.filter(s=>s.zone===zone).length,breaches:stations.filter(s=>s.zone===zone&&s.status==='breach').length,
  })).filter(z=>z.total>0);

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
      {breaches.length>0&&(
        <div className="alert-critical">
          <strong style={{fontSize:'0.82rem',color:'#721c24'}}>🔊 Noise Limit Breaches: {breaches.length} location{breaches.length>1?'s':''} exceeding prescribed limits</strong>
          <div style={{fontSize:'0.72rem',color:'#721c24',marginTop:'0.2rem'}}>{breaches.map(s=>`${s.name} — Day: ${s.dayLevel} dB (Limit: ${s.dayLimit})`).join(' · ')}</div>
        </div>
      )}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem'}}>
        {[
          {label:'Monitoring Zones',value:stations.length,color:'#5a3500'},
          {label:'Compliant',value:compliant.length,color:'#1a6b3a'},
          {label:'Warning',value:warnings.length,color:'#856404'},
          {label:'Breach',value:breaches.length,color:'#c0392b'},
        ].map(s=>(
          <div key={s.label} className="stat-card" style={{borderTopColor:s.color}}>
            <div style={{fontSize:'0.63rem',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'0.3rem',fontFamily:'Arial'}}>{s.label}</div>
            <div style={{fontSize:'2.2rem',fontWeight:'800',color:s.color,lineHeight:1,fontFamily:'Georgia'}}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'1.25rem'}}>
        <div className="section-card">
          <div className="section-title">📊 Day Noise Levels vs Limits</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{top:5,right:10,bottom:38,left:-10}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8eef8"/>
              <XAxis dataKey="name" tick={{fill:'var(--text-muted)',fontSize:9,fontFamily:'Arial'}} angle={-30} textAnchor="end"/>
              <YAxis tick={{fill:'var(--text-muted)',fontSize:10}} domain={[30,90]}/>
              <Tooltip contentStyle={{background:'white',border:'1px solid var(--border)',fontSize:'12px',fontFamily:'Arial'}}/>
              <Bar dataKey="Day dB" radius={[2,2,0,0]}>
                {barData.map((entry,i)=><Cell key={i} fill={entry.over?'#c0392b':entry['Day dB']>=entry['Day Limit']-5?'#856404':'#1a6b3a'}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="section-card">
          <div className="section-title">🗂 By Zone Type</div>
          {zoneGroups.map(z=>(
            <div key={z.zone} style={{marginBottom:'0.9rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.25rem'}}>
                <span style={{fontSize:'0.78rem',fontWeight:'600',fontFamily:'Arial',color:'var(--text-dark)'}}>{zI(z.zone)} {z.zone}</span>
                <span style={{fontSize:'0.72rem',fontFamily:'Arial',color:z.breaches>0?'#c0392b':'#1a6b3a',fontWeight:'700'}}>{z.breaches>0?`${z.breaches} breach`:'✓ OK'} / {z.total}</span>
              </div>
              <div style={{background:'#e8eef8',borderRadius:'3px',height:'7px'}}>
                <div style={{height:'100%',width:`${(z.breaches/z.total)*100}%`,background:z.breaches>0?'#c0392b':'#1a6b3a',borderRadius:'3px',minWidth:z.breaches>0?'4px':'0'}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="section-card">
        <div className="section-title">📈 Typical 24-Hour Noise Pattern — Urban Industrial Zone</div>
        <div style={{fontSize:'0.68rem',color:'var(--text-muted)',fontFamily:'Arial',marginBottom:'0.75rem'}}>Peak noise during morning/evening rush hours. Industrial zone day limit: 75 dB(A)</div>
        <ResponsiveContainer width="100%" height={175}>
          <AreaChart data={NOISE_TREND} margin={{top:5,right:10,bottom:5,left:-10}}>
            <defs>
              <linearGradient id="noiseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#5a3500" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#5a3500" stopOpacity={0.02}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8eef8"/>
            <XAxis dataKey="time" tick={{fill:'var(--text-muted)',fontSize:10,fontFamily:'Arial'}}/>
            <YAxis tick={{fill:'var(--text-muted)',fontSize:10}} domain={[35,85]}/>
            <Tooltip contentStyle={{background:'white',border:'1px solid var(--border)',fontSize:'12px',fontFamily:'Arial'}}/>
            <ReferenceLine y={75} stroke="#c0392b" strokeDasharray="4 4" label={{value:'Industrial Limit (75)',fill:'#c0392b',fontSize:9}}/>
            <ReferenceLine y={55} stroke="#856404" strokeDasharray="4 4" label={{value:'Residential (55)',fill:'#856404',fontSize:9}}/>
            <Area type="monotone" dataKey="level" stroke="#5a3500" strokeWidth={2} fill="url(#noiseGrad)" name="Noise dB(A)"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="section-card">
        <div className="section-title">🔊 Live Noise Level Readings — All Zones</div>
        <div style={{overflowX:'auto'}}>
          <table className="gov-table">
            <thead><tr>
              <th>Station</th><th>District</th><th>Zone</th>
              <th>Day dB(A)</th><th>Day Limit</th>
              <th>Night dB(A)</th><th>Night Limit</th>
              <th>Source</th><th>Status</th>
              {!isRO&&<th>Action</th>}
            </tr></thead>
            <tbody>
              {stations.map(s=>(
                <tr key={s.id}>
                  <td style={{fontWeight:'600',fontSize:'0.8rem'}}>{s.name}</td>
                  <td style={{color:'var(--text-muted)'}}>{s.district}</td>
                  <td style={{fontSize:'0.78rem'}}>{zI(s.zone)} {s.zone}</td>
                  <td style={{color:s.dayLevel>s.dayLimit?'#c0392b':'#1a6b3a',fontWeight:s.dayLevel>s.dayLimit?'800':'400',fontFamily:'Georgia'}}>{s.dayLevel}</td>
                  <td style={{color:'var(--text-muted)'}}>{s.dayLimit}</td>
                  <td style={{color:s.nightLevel>s.nightLimit?'#c0392b':'#1a6b3a',fontWeight:s.nightLevel>s.nightLimit?'800':'400',fontFamily:'Georgia'}}>{s.nightLevel}</td>
                  <td style={{color:'var(--text-muted)'}}>{s.nightLimit}</td>
                  <td style={{fontSize:'0.72rem',color:'var(--text-muted)'}}>{s.primarySource}</td>
                  <td><span style={{background:sB(s.status),color:sC(s.status),fontSize:'0.65rem',fontWeight:'700',padding:'2px 9px',borderRadius:'2px',fontFamily:'Arial',textTransform:'uppercase'}}>{s.status}</span></td>
                  {!isRO&&<td>{s.status==='breach'&&(noticed.has(s.id)?<span style={{fontSize:'0.7rem',color:'#1a6b3a',fontWeight:'700',fontFamily:'Arial'}}>✓ Noticed</span>:<button className="btn-danger" style={{fontSize:'0.68rem',padding:'0.2rem 0.55rem'}} onClick={()=>{setNoticed(p=>new Set(p).add(s.id));toast.error(`Notice issued: ${s.name}`,{icon:'🔊'});}}>Issue Notice</button>)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="section-card" style={{borderLeft:'4px solid #5a3500',background:'#fffbf5'}}>
        <div className="section-title" style={{color:'#5a3500'}}>📏 Prescribed Noise Limits — Noise Pollution (Regulation and Control) Rules, 2000</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'0.75rem'}}>
          {[['🏭 Industrial',75,70,'#5a3500'],['🏢 Commercial',65,55,'#1a4e8a'],['🏘 Residential',55,45,'#1a6b3a'],['🌿 Silence',50,40,'#c0392b']].map(([zone,day,night,color])=>(
            <div key={String(zone)} style={{background:'white',borderRadius:'4px',padding:'0.75rem 0.9rem',border:`1px solid ${color}30`,borderTop:`3px solid ${color}`}}>
              <div style={{fontSize:'0.75rem',fontWeight:'700',color:String(color),fontFamily:'Arial',marginBottom:'0.5rem'}}>{zone}</div>
              <div style={{fontSize:'0.72rem',color:'var(--text-dark)',fontFamily:'Arial'}}>Day: <strong style={{fontFamily:'Georgia'}}>{day} dB(A)</strong></div>
              <div style={{fontSize:'0.72rem',color:'var(--text-dark)',fontFamily:'Arial'}}>Night: <strong style={{fontFamily:'Georgia'}}>{night} dB(A)</strong></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const router = useRouter();
  const { user, mounted } = useAuth({ allowedRoles:['Super Admin','Regional Officer','Monitoring Team'] });
  const [portal,   setPortal]   = useState<Portal>(null);
  const [liveData, setLiveData] = useState(STATIONS);

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

  const activeP = portal ? PORTAL_META[portal] : null;

  return (
    <PageShell loading={!mounted||!user}>
      <Toaster position="top-right" toastOptions={{style:{background:'white',color:'var(--text-dark)',border:'1px solid var(--border)',fontFamily:'Arial',fontSize:'0.82rem'}}}/>
      <div className="breadcrumb">
        <span>🏠 Home</span><span>›</span>
        <a onClick={()=>router.push('/dashboard')}>Dashboard</a>
        {portal&&<><span>›</span><span style={{color:activeP?.accent,fontWeight:'700'}}>{activeP?.icon} {activeP?.label}</span></>}
      </div>
      <div className="live-bar">
        <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
          <span className="live-dot"/>
          <span style={{fontSize:'0.72rem',fontWeight:'700',color:'#22c55e',fontFamily:'Arial',letterSpacing:'0.05em'}}>LIVE DATA</span>
          <span style={{fontSize:'0.7rem',color:'var(--text-muted)',fontFamily:'Arial',marginLeft:'0.5rem'}}>Refreshes every 5 seconds · Maharashtra SPCB Monitoring Network</span>
        </div>
        <div style={{fontSize:'0.7rem',color:'var(--text-muted)',fontFamily:'Arial'}}>{user?.role} Portal</div>
      </div>
      <div className="main-content">
        {!portal?(
          <div className="empty-domain">
            <div style={{fontSize:'3.5rem',marginBottom:'1.25rem'}}>🌿</div>
            <div style={{fontSize:'1.1rem',fontWeight:'700',color:'var(--navy)',marginBottom:'0.5rem',fontFamily:'Georgia'}}>Select a Monitoring Domain</div>
            <div style={{fontSize:'0.82rem',color:'var(--text-muted)',fontFamily:'Arial',maxWidth:'360px',margin:'0 auto',lineHeight:1.7}}>Choose Air Quality, Water Quality, or Noise Levels from the left panel to view live monitoring data, compliance status and station readings.</div>
            <div style={{display:'flex',gap:'1rem',justifyContent:'center',marginTop:'2rem'}}>
              {(['air','water','noise'] as const).map(p=>(
                <button key={p} onClick={()=>{setPortal(p);if(user)localStorage.setItem(pkey(user.email),p);window.dispatchEvent(new CustomEvent('pvPortalChange',{detail:p}));}}
                  style={{background:'white',border:`2px solid ${PORTAL_META[p].accent}`,color:PORTAL_META[p].accent,borderRadius:'4px',padding:'0.6rem 1.25rem',fontSize:'0.82rem',fontFamily:'Arial',fontWeight:'700',cursor:'pointer'}}>
                  {PORTAL_META[p].icon} {PORTAL_META[p].label}
                </button>
              ))}
            </div>
          </div>
        ):portal==='air'?<AirDashboard user={user} liveData={liveData}/>
          :portal==='water'?<WaterDashboard user={user}/>
          :<NoiseDashboard user={user}/>
        }
      </div>
    </PageShell>
  );
}
