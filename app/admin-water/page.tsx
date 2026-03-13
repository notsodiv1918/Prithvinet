'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { WATER_STATIONS, WATER_TREND, WATER_LIMITS } from '@/data/waterNoiseData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminWaterDashboard() {
  const router = useRouter();
  const critical = WATER_STATIONS.filter(s => s.quality === 'Critical');
  const poor = WATER_STATIONS.filter(s => s.quality === 'Poor');
  const good = WATER_STATIONS.filter(s => s.quality === 'Good');
  const qColor = (q:string) => q==='Good'?'#1a6b3a':q==='Moderate'?'#856404':q==='Poor'?'#c0550a':'#c0392b';
  const qBg = (q:string) => q==='Good'?'#d4edda':q==='Moderate'?'#fff3cd':q==='Poor'?'#fde9d9':'#f8d7da';

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#f0f5ff'}}>
      <Sidebar/>
      <main style={{flex:1,overflow:'auto'}}>
        <TopBar title="Water Quality — Admin Dashboard" subtitle="All Maharashtra rivers and reservoirs — live readings"/>
        <Toaster position="top-right"/>
        <div style={{background:'white',borderBottom:'1px solid #dde8f8',padding:'0.5rem 1.5rem'}}>
          <span style={{fontSize:'0.7rem',color:'#6b8c7a'}}>Home › </span>
          <span style={{fontSize:'0.7rem',color:'#1a5280',fontWeight:'600'}}>Water Quality Dashboard</span>
        </div>
        <div style={{padding:'1.25rem 1.5rem'}}>

          {critical.length>0&&(
            <div style={{background:'#f8d7da',border:'1px solid #f5c6cb',borderLeft:'5px solid #c0392b',borderRadius:'4px',padding:'0.85rem 1.2rem',marginBottom:'1.25rem',display:'flex',gap:'0.75rem'}}>
              <span>⚠️</span>
              <div>
                <div style={{fontWeight:'700',color:'#721c24',fontSize:'0.85rem'}}>Critical Contamination — {critical.length} water bodies</div>
                <div style={{fontSize:'0.75rem',color:'#721c24',marginTop:'0.15rem'}}>{critical.map(s=>`${s.name} (${s.district})`).join(' · ')}</div>
              </div>
            </div>
          )}

          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'1.25rem'}}>
            {[
              {label:'Total Stations',value:WATER_STATIONS.length,color:'#1a5280',bg:'#f0f5ff',border:'#c8d8f0'},
              {label:'Good Quality',value:good.length,color:'#1a6b3a',bg:'#f0f8f3',border:'#c8e0d2'},
              {label:'Poor / Critical',value:poor.length+critical.length,color:'#c0392b',bg:'#fdf0ee',border:'#f5c6cb'},
              {label:'Worsening Trend',value:WATER_STATIONS.filter(s=>s.trend==='worsening').length,color:'#c0392b',bg:'#fdf0ee',border:'#f5c6cb'},
            ].map(s=>(
              <div key={s.label} style={{background:s.bg,border:`1px solid ${s.border}`,borderTop:`3px solid ${s.color}`,borderRadius:'4px',padding:'1rem',boxShadow:'0 1px 4px rgba(0,0,0,0.05)'}}>
                <div style={{fontSize:'0.65rem',color:'#6b8c7a',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'0.3rem'}}>{s.label}</div>
                <div style={{fontSize:'2rem',fontWeight:'800',color:s.color,lineHeight:1}}>{s.value}</div>
              </div>
            ))}
          </div>

          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'1.25rem',marginBottom:'1.25rem'}}>
            <div style={{background:'white',border:'1px solid #c8d8f0',borderRadius:'4px',padding:'1.2rem'}}>
              <div style={{fontSize:'0.75rem',fontWeight:'700',color:'#1a5280',marginBottom:'0.3rem'}}>7-Month DO & BOD Trend — Mula-Mutha, Pune</div>
              <div style={{fontSize:'0.65rem',color:'#6b8c7a',marginBottom:'0.85rem'}}>DO below 6 and rising BOD signals increasing sewage load</div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={WATER_TREND} margin={{top:5,right:15,bottom:5,left:-10}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8f0ff"/>
                  <XAxis dataKey="month" tick={{fill:'#6b8c7a',fontSize:11}}/>
                  <YAxis tick={{fill:'#6b8c7a',fontSize:11}}/>
                  <Tooltip contentStyle={{background:'white',border:'1px solid #c8d8f0',fontSize:'12px'}}/>
                  <Legend wrapperStyle={{fontSize:'11px'}}/>
                  <ReferenceLine y={WATER_LIMITS.do.min} stroke="#1a6b3a" strokeDasharray="4 4" label={{value:'DO min',fill:'#1a6b3a',fontSize:9}}/>
                  <ReferenceLine y={WATER_LIMITS.bod.max} stroke="#c0392b" strokeDasharray="4 4" label={{value:'BOD max',fill:'#c0392b',fontSize:9}}/>
                  <Line type="monotone" dataKey="do" stroke="#1a5280" strokeWidth={2} name="DO mg/L" dot={{r:3}}/>
                  <Line type="monotone" dataKey="bod" stroke="#c0392b" strokeWidth={2} name="BOD mg/L" dot={{r:3}}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{background:'white',border:'1px solid #c8d8f0',borderRadius:'4px',padding:'1.2rem'}}>
              <div style={{fontSize:'0.75rem',fontWeight:'700',color:'#1a5280',marginBottom:'0.75rem'}}>Quality Distribution</div>
              {(['Good','Moderate','Poor','Critical'] as const).map(q=>{
                const count=WATER_STATIONS.filter(s=>s.quality===q).length;
                return(
                  <div key={q} style={{marginBottom:'0.65rem'}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.2rem'}}>
                      <span style={{fontSize:'0.75rem',fontWeight:'600',color:qColor(q)}}>{q}</span>
                      <span style={{fontSize:'0.75rem',fontWeight:'700',color:qColor(q)}}>{count}</span>
                    </div>
                    <div style={{background:'#e8f0ff',borderRadius:'3px',height:'7px'}}>
                      <div style={{height:'100%',width:`${(count/WATER_STATIONS.length)*100}%`,background:qColor(q),borderRadius:'3px'}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{background:'white',border:'1px solid #c8d8f0',borderRadius:'4px',padding:'1.2rem'}}>
            <div style={{fontSize:'0.75rem',fontWeight:'700',color:'#1a5280',marginBottom:'0.75rem',textTransform:'uppercase',letterSpacing:'0.07em'}}>All Station Readings — Live</div>
            <div style={{overflowX:'auto'}}>
              <table className="gov-table">
                <thead><tr><th>ID</th><th>Station</th><th>District</th><th>pH</th><th>DO mg/L</th><th>BOD mg/L</th><th>TDS mg/L</th><th>Coliform</th><th>Quality</th><th>Trend</th><th>Action</th></tr></thead>
                <tbody>
                  {WATER_STATIONS.map(s=>(
                    <tr key={s.id}>
                      <td style={{color:'#1a5280',fontFamily:'monospace',fontSize:'0.75rem'}}>{s.id}</td>
                      <td style={{fontWeight:'500'}}>{s.name}</td>
                      <td style={{color:'#6b8c7a'}}>{s.district}</td>
                      <td style={{color:s.ph<WATER_LIMITS.ph.min||s.ph>WATER_LIMITS.ph.max?'#c0392b':'#1a2e22'}}>{s.ph}</td>
                      <td style={{color:s.do<WATER_LIMITS.do.min?'#c0392b':'#1a6b3a',fontWeight:s.do<WATER_LIMITS.do.min?'700':'400'}}>{s.do}</td>
                      <td style={{color:s.bod>WATER_LIMITS.bod.max?'#c0392b':'#1a2e22',fontWeight:s.bod>WATER_LIMITS.bod.max?'700':'400'}}>{s.bod}</td>
                      <td style={{color:s.tds>WATER_LIMITS.tds.max?'#c0392b':'#1a2e22'}}>{s.tds}</td>
                      <td style={{color:s.coliform>WATER_LIMITS.coliform.max?'#c0392b':'#1a2e22',fontWeight:s.coliform>WATER_LIMITS.coliform.max?'700':'400'}}>{s.coliform}</td>
                      <td><span style={{background:qBg(s.quality),color:qColor(s.quality),border:`1px solid`,borderRadius:'10px',padding:'1px 8px',fontSize:'0.65rem',fontWeight:'700'}}>{s.quality}</span></td>
                      <td style={{color:s.trend==='worsening'?'#c0392b':s.trend==='improving'?'#1a6b3a':'#6b8c7a',fontSize:'0.78rem'}}>{s.trend==='worsening'?'↓':s.trend==='improving'?'↑':'→'} {s.trend}</td>
                      <td>{(s.quality==='Critical'||s.quality==='Poor')&&<button className="btn-danger" style={{fontSize:'0.68rem',padding:'0.2rem 0.5rem'}} onClick={()=>toast.error(`Inspection scheduled: ${s.district}`,{icon:'📋'})}>Inspect</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
