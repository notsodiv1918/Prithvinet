'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { NOISE_STATIONS } from '@/data/waterNoiseData';
import toast, { Toaster } from 'react-hot-toast';

const sColor = (s:string)=>s==='safe'?'#1a6b3a':s==='warning'?'#856404':'#c0392b';
const sBg = (s:string)=>s==='safe'?'#d4edda':s==='warning'?'#fff3cd':'#f8d7da';
const zIcon = (z:string)=>z==='Industrial'?'🏭':z==='Commercial'?'🏢':z==='Residential'?'🏘':'🌿';

// RO Nagpur zone stations
const MY_STATIONS = NOISE_STATIONS.filter(s=>['Nagpur','Thane','Navi Mumbai'].includes(s.district));

export default function RONoiseDashboard() {
  const [notified, setNotified] = useState<Set<string>>(new Set());

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#fdf8f0'}}>
      <Sidebar/>
      <main style={{flex:1,overflow:'auto'}}>
        <TopBar title="Noise Levels — Regional Officer" subtitle="Nagpur Zone — monitoring stations and limit compliance"/>
        <Toaster position="top-right"/>
        <div style={{background:'white',borderBottom:'1px solid #e8d8c0',padding:'0.5rem 1.5rem'}}>
          <span style={{fontSize:'0.7rem',color:'#6b8c7a'}}>Home › </span>
          <span style={{fontSize:'0.7rem',color:'#5a3500',fontWeight:'600'}}>Noise Dashboard</span>
        </div>
        <div style={{padding:'1.25rem 1.5rem'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem',marginBottom:'1.25rem'}}>
            {[
              {label:'My Stations',value:MY_STATIONS.length,color:'#5a3500',bg:'#fff8ee',border:'#f0d8a0'},
              {label:'Breaches',value:MY_STATIONS.filter(s=>s.status==='breach').length,color:'#c0392b',bg:'#fdf0ee',border:'#f5c6cb'},
              {label:'Warnings',value:MY_STATIONS.filter(s=>s.status==='warning').length,color:'#856404',bg:'#fffbee',border:'#ffd966'},
            ].map(s=>(
              <div key={s.label} style={{background:s.bg,border:`1px solid ${s.border}`,borderTop:`3px solid ${s.color}`,borderRadius:'4px',padding:'1rem'}}>
                <div style={{fontSize:'0.65rem',color:'#6b8c7a',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'0.3rem'}}>{s.label}</div>
                <div style={{fontSize:'2rem',fontWeight:'800',color:s.color,lineHeight:1}}>{s.value}</div>
              </div>
            ))}
          </div>

          <div style={{background:'white',border:'1px solid #e8d8c0',borderRadius:'4px',padding:'1.2rem'}}>
            <div style={{fontSize:'0.75rem',fontWeight:'700',color:'#5a3500',marginBottom:'0.75rem',textTransform:'uppercase',letterSpacing:'0.07em'}}>My Zone — Noise Stations</div>
            {MY_STATIONS.map(s=>{
              const dayBreach = s.dayLevel>s.dayLimit;
              const nightBreach = s.nightLevel>s.nightLimit;
              const isBreach = dayBreach||nightBreach;
              return(
                <div key={s.id} style={{background:isBreach?'#fdf0ee':'#fdf8f0',border:`1px solid ${isBreach?'#f5c6cb':'#e8d8c0'}`,borderRadius:'4px',padding:'1rem',marginBottom:'0.75rem'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.65rem'}}>
                    <div>
                      <div style={{fontSize:'0.88rem',fontWeight:'700',color:'#2a1e0a'}}>{zIcon(s.zone)} {s.name}</div>
                      <div style={{fontSize:'0.68rem',color:'#6b5a3a'}}>{s.zone} Zone · {s.district} · {s.primarySource}</div>
                    </div>
                    <span style={{background:sBg(s.status),color:sColor(s.status),fontSize:'0.65rem',fontWeight:'700',padding:'2px 10px',borderRadius:'10px'}}>{s.status}</span>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem',marginBottom:'0.65rem'}}>
                    {[
                      ['Day Level',s.dayLevel,s.dayLimit,'dB(A)'],
                      ['Night Level',s.nightLevel,s.nightLimit,'dB(A)'],
                    ].map(([k,v,lim,u])=>{
                      const bad=Number(v)>Number(lim);
                      return(
                        <div key={String(k)} style={{background:'white',border:`1px solid ${bad?'#f5c6cb':'#e8d8c0'}`,borderRadius:'3px',padding:'0.4rem 0.6rem'}}>
                          <div style={{fontSize:'0.62rem',color:'#6b5a3a'}}>{k}</div>
                          <div style={{fontSize:'1rem',fontWeight:'800',color:bad?'#c0392b':'#2a1e0a'}}>{v} <span style={{fontSize:'0.6rem',fontWeight:400,color:'#94a3b8'}}>{u}</span></div>
                          <div style={{fontSize:'0.58rem',color:'#94a3b8'}}>Limit: {lim}</div>
                          {bad&&<div style={{fontSize:'0.6rem',color:'#c0392b',fontWeight:'600',marginTop:'0.1rem'}}>+{Number(v)-Number(lim)} dB over</div>}
                        </div>
                      );
                    })}
                  </div>
                  {isBreach&&(
                    <div style={{display:'flex',gap:'0.5rem'}}>
                      {notified.has(s.id)
                        ?<span style={{fontSize:'0.72rem',color:'#1a6b3a',fontWeight:'600',background:'#d4edda',padding:'0.25rem 0.65rem',borderRadius:'3px',border:'1px solid #b8dfc4'}}>✓ Notice Issued</span>
                        :<button className="btn-danger" style={{fontSize:'0.72rem',padding:'0.3rem 0.75rem'}}
                          onClick={()=>{setNotified(p=>new Set(p).add(s.id));toast.error(`Noise violation notice: ${s.name}`,{icon:'📋'});}}>
                          Issue Notice
                        </button>
                      }
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
