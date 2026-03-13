'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { WATER_STATIONS, WATER_LIMITS } from '@/data/waterNoiseData';
import toast, { Toaster } from 'react-hot-toast';

const qColor = (q:string) => q==='Good'?'#1a6b3a':q==='Moderate'?'#856404':q==='Poor'?'#c0550a':'#c0392b';
const qBg = (q:string) => q==='Good'?'#d4edda':q==='Moderate'?'#fff3cd':q==='Poor'?'#fde9d9':'#f8d7da';

// RO Rajesh Kumar is assigned Nagpur zone
const MY_STATIONS = WATER_STATIONS.filter(s => ['Nagpur','Thane','Navi Mumbai'].includes(s.district));

export default function ROWaterDashboard() {
  const [reminded, setReminded] = useState<Set<string>>(new Set());
  const critical = MY_STATIONS.filter(s=>s.quality==='Critical'||s.quality==='Poor');

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#f0f5ff'}}>
      <Sidebar/>
      <main style={{flex:1,overflow:'auto'}}>
        <TopBar title="Water Quality — Regional Officer" subtitle="Nagpur Zone — assigned monitoring stations"/>
        <Toaster position="top-right"/>
        <div style={{background:'white',borderBottom:'1px solid #dde8f8',padding:'0.5rem 1.5rem'}}>
          <span style={{fontSize:'0.7rem',color:'#6b8c7a'}}>Home › </span>
          <span style={{fontSize:'0.7rem',color:'#1a5280',fontWeight:'600'}}>Water Quality Dashboard</span>
        </div>
        <div style={{padding:'1.25rem 1.5rem'}}>

          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem',marginBottom:'1.25rem'}}>
            {[
              {label:'My Stations',value:MY_STATIONS.length,color:'#1a5280',bg:'#f0f5ff',border:'#c8d8f0'},
              {label:'Poor/Critical',value:critical.length,color:'#c0392b',bg:'#fdf0ee',border:'#f5c6cb'},
              {label:'Worsening',value:MY_STATIONS.filter(s=>s.trend==='worsening').length,color:'#c0392b',bg:'#fdf0ee',border:'#f5c6cb'},
            ].map(s=>(
              <div key={s.label} style={{background:s.bg,border:`1px solid ${s.border}`,borderTop:`3px solid ${s.color}`,borderRadius:'4px',padding:'1rem'}}>
                <div style={{fontSize:'0.65rem',color:'#6b8c7a',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'0.3rem'}}>{s.label}</div>
                <div style={{fontSize:'2rem',fontWeight:'800',color:s.color,lineHeight:1}}>{s.value}</div>
              </div>
            ))}
          </div>

          <div style={{background:'white',border:'1px solid #c8d8f0',borderRadius:'4px',padding:'1.2rem',marginBottom:'1.25rem'}}>
            <div style={{fontSize:'0.75rem',fontWeight:'700',color:'#1a5280',marginBottom:'0.75rem',textTransform:'uppercase',letterSpacing:'0.07em'}}>My Zone — Water Stations</div>
            {MY_STATIONS.map(s=>{
              const hasProblem = s.quality==='Poor'||s.quality==='Critical';
              return (
                <div key={s.id} style={{background:hasProblem?'#fdf0ee':'#f7f9ff',border:`1px solid ${hasProblem?'#f5c6cb':'#c8d8f0'}`,borderRadius:'4px',padding:'1rem',marginBottom:'0.75rem'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.75rem'}}>
                    <div>
                      <div style={{fontSize:'0.88rem',fontWeight:'700',color:'#1a2e4a'}}>{s.name}</div>
                      <div style={{fontSize:'0.68rem',color:'#6b8c7a'}}>{s.body} · {s.district} · Updated: {s.lastUpdated}</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <span style={{background:qBg(s.quality),color:qColor(s.quality),fontSize:'0.65rem',fontWeight:'700',padding:'2px 10px',borderRadius:'10px'}}>{s.quality}</span>
                      <div style={{fontSize:'0.62rem',marginTop:'0.2rem',color:s.trend==='worsening'?'#c0392b':s.trend==='improving'?'#1a6b3a':'#6b8c7a'}}>
                        {s.trend==='worsening'?'↓':s.trend==='improving'?'↑':'→'} {s.trend}
                      </div>
                    </div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'0.4rem',marginBottom:'0.75rem'}}>
                    {([
                      ['DO',s.do,s.do<WATER_LIMITS.do.min,'mg/L'],
                      ['BOD',s.bod,s.bod>WATER_LIMITS.bod.max,'mg/L'],
                      ['pH',s.ph,s.ph<WATER_LIMITS.ph.min||s.ph>WATER_LIMITS.ph.max,''],
                      ['TDS',s.tds,s.tds>WATER_LIMITS.tds.max,'mg/L'],
                    ] as [string,number,boolean,string][]).map(([k,v,bad,u])=>(
                      <div key={k} style={{background:'white',border:`1px solid ${bad?'#f5c6cb':'#e8f0ff'}`,borderRadius:'3px',padding:'0.35rem 0.5rem'}}>
                        <div style={{fontSize:'0.6rem',color:'#6b8c7a'}}>{k}</div>
                        <div style={{fontSize:'0.88rem',fontWeight:'700',color:bad?'#c0392b':'#1a2e4a'}}>{v} <span style={{fontSize:'0.55rem',color:'#94a3b8',fontWeight:400}}>{u}</span></div>
                      </div>
                    ))}
                  </div>
                  {hasProblem&&(
                    <div style={{display:'flex',gap:'0.5rem'}}>
                      {reminded.has(s.id)
                        ?<span style={{fontSize:'0.72rem',color:'#1a6b3a',fontWeight:'600',background:'#d4edda',padding:'0.25rem 0.65rem',borderRadius:'3px',border:'1px solid #b8dfc4'}}>✓ Notice Sent</span>
                        :<button className="btn-danger" style={{fontSize:'0.72rem',padding:'0.3rem 0.75rem'}}
                          onClick={()=>{setReminded(p=>new Set(p).add(s.id));toast.error(`Contamination notice issued for ${s.district}`,{icon:'📋'});}}>
                          Issue Notice
                        </button>
                      }
                      <button className="btn-outline" style={{fontSize:'0.72rem',padding:'0.3rem 0.75rem'}}
                        onClick={()=>toast(`Inspection scheduled at ${s.name}`,{icon:'🔍'})}>
                        Schedule Inspection
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
