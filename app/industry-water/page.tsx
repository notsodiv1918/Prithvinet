'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { WATER_STATIONS, WATER_LIMITS } from '@/data/waterNoiseData';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// Bharat Steel Works is in Nagpur — nearest water body is Nag River
const MY_STATION = WATER_STATIONS.find(s=>s.id==='WTR004')!;

export default function IndustryWaterDashboard() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ph:'',do_val:'',bod:'',tds:'',notes:'',month:new Date().toISOString().slice(0,7)});

  const params = [
    {key:'ph',label:'pH',limit:`${WATER_LIMITS.ph.min}–${WATER_LIMITS.ph.max}`,bad:(v:number)=>v<WATER_LIMITS.ph.min||v>WATER_LIMITS.ph.max},
    {key:'do_val',label:'Dissolved O₂ (mg/L)',limit:`>${WATER_LIMITS.do.min}`,bad:(v:number)=>v<WATER_LIMITS.do.min},
    {key:'bod',label:'BOD (mg/L)',limit:`<${WATER_LIMITS.bod.max}`,bad:(v:number)=>v>WATER_LIMITS.bod.max},
    {key:'tds',label:'TDS (mg/L)',limit:`<${WATER_LIMITS.tds.max}`,bad:(v:number)=>v>WATER_LIMITS.tds.max},
  ];

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(()=>{setSubmitted(true);toast.success('Water quality report submitted');},600);
  };

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#f0f5ff'}}>
      <Sidebar/>
      <main style={{flex:1,overflow:'auto'}}>
        <TopBar title="Water Quality — Industry Portal" subtitle="Bharat Steel Works — effluent discharge and nearby water body monitoring"/>
        <Toaster position="top-right"/>
        <div style={{background:'white',borderBottom:'1px solid #dde8f8',padding:'0.5rem 1.5rem'}}>
          <span style={{fontSize:'0.7rem',color:'#6b8c7a'}}>Home › </span>
          <span style={{fontSize:'0.7rem',color:'#1a5280',fontWeight:'600'}}>Water Quality Dashboard</span>
        </div>
        <div style={{padding:'1.25rem 1.5rem'}}>

          {/* Nearest water body status */}
          <div style={{background:MY_STATION.quality==='Critical'?'#fdf0ee':'#f0f5ff',border:`1px solid ${MY_STATION.quality==='Critical'?'#f5c6cb':'#c8d8f0'}`,borderLeft:`5px solid ${MY_STATION.quality==='Critical'?'#c0392b':'#1a5280'}`,borderRadius:'4px',padding:'0.85rem 1.2rem',marginBottom:'1.25rem'}}>
            <div style={{fontSize:'0.82rem',fontWeight:'700',color:MY_STATION.quality==='Critical'?'#721c24':'#1a2e4a',marginBottom:'0.15rem'}}>
              {MY_STATION.quality==='Critical'?'⚠ Critical':'📍'} Nearest Water Body: {MY_STATION.name}
            </div>
            <div style={{fontSize:'0.75rem',color:MY_STATION.quality==='Critical'?'#721c24':'#3d5a6a',lineHeight:1.7}}>
              Current quality: <strong>{MY_STATION.quality}</strong> · Trend: {MY_STATION.trend} · DO: {MY_STATION.do} mg/L · BOD: {MY_STATION.bod} mg/L
              {MY_STATION.quality==='Critical'&&' — Your facility\'s effluent discharge may be contributing to contamination. Submit a water quality report.'}
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'1.25rem'}}>
            {[
              {label:'Water Body Status',value:MY_STATION.quality,color:MY_STATION.quality==='Critical'?'#c0392b':'#856404',bg:'#fdf0ee',border:'#f5c6cb'},
              {label:'DO Level',value:`${MY_STATION.do} mg/L`,color:MY_STATION.do<WATER_LIMITS.do.min?'#c0392b':'#1a6b3a',bg:'#f0f5ff',border:'#c8d8f0'},
              {label:'BOD Level',value:`${MY_STATION.bod} mg/L`,color:MY_STATION.bod>WATER_LIMITS.bod.max?'#c0392b':'#1a6b3a',bg:'#f0f5ff',border:'#c8d8f0'},
              {label:'Report Due In',value:'17d',color:'#1a5280',bg:'#f0f5ff',border:'#c8d8f0',onClick:()=>{}},
            ].map(s=>(
              <div key={s.label} style={{background:s.bg,border:`1px solid ${s.border}`,borderTop:`3px solid ${s.color}`,borderRadius:'4px',padding:'1rem',cursor:(s as any).onClick?'pointer':'default'}} onClick={(s as any).onClick}>
                <div style={{fontSize:'0.65rem',color:'#6b8c7a',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'0.3rem'}}>{s.label}</div>
                <div style={{fontSize:String(s.value).length>5?'1.3rem':'1.8rem',fontWeight:'800',color:s.color,lineHeight:1}}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Submit report */}
          <div style={{background:'white',border:'1px solid #c8d8f0',borderRadius:'4px',padding:'1.2rem'}}>
            <div style={{fontSize:'0.78rem',fontWeight:'700',color:'#1a5280',marginBottom:'0.75rem',textTransform:'uppercase',letterSpacing:'0.07em'}}>Monthly Effluent Quality Report</div>
            {submitted?(
              <div style={{textAlign:'center',padding:'2rem',background:'#f0f5ff',borderRadius:'4px',border:'1px solid #c8d8f0'}}>
                <div style={{fontSize:'2.5rem',marginBottom:'0.75rem'}}>✅</div>
                <div style={{fontSize:'0.95rem',fontWeight:'700',color:'#1a5280',marginBottom:'0.4rem'}}>Report Submitted</div>
                <div style={{fontSize:'0.78rem',color:'#6b8c7a',marginBottom:'1.25rem'}}>Your water quality report has been sent to Regional Officer Rajesh Kumar.</div>
                <button className="btn-primary" style={{background:'#1a5280'}} onClick={()=>setSubmitted(false)}>Submit Another</button>
              </div>
            ):(
              <form onSubmit={handle}>
                <div style={{marginBottom:'0.85rem'}}>
                  <label style={{display:'block',fontSize:'0.68rem',fontWeight:'600',color:'#3d5a6a',marginBottom:'0.3rem',textTransform:'uppercase',letterSpacing:'0.06em'}}>Reporting Month *</label>
                  <input type="month" value={form.month} onChange={e=>setForm(f=>({...f,month:e.target.value}))}
                    style={{border:'1px solid #a0b8d4',borderRadius:'3px',padding:'0.5rem 0.7rem',fontSize:'0.85rem',color:'#1a2e4a',background:'white',width:'220px'}}/>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
                  {params.map(p=>{
                    const val=Number((form as any)[p.key]);
                    const over=val>0&&p.bad(val);
                    return(
                      <div key={p.key}>
                        <label style={{display:'block',fontSize:'0.68rem',fontWeight:'600',color:'#3d5a6a',marginBottom:'0.3rem',textTransform:'uppercase',letterSpacing:'0.06em'}}>
                          {p.label} * <span style={{color:'#6b8c7a',fontWeight:400,fontSize:'0.62rem',textTransform:'none'}}>Limit: {p.limit}</span>
                        </label>
                        <input type="number" step="0.1" placeholder={`Monthly avg ${p.label}`} value={(form as any)[p.key]}
                          onChange={e=>setForm(fv=>({...fv,[p.key]:e.target.value}))} required
                          style={{width:'100%',border:`1px solid ${over?'#f5c6cb':'#a0b8d4'}`,borderRadius:'3px',padding:'0.5rem 0.7rem',fontSize:'0.875rem',color:'#1a2e4a',background:'white'}}/>
                        {over&&<div style={{fontSize:'0.68rem',color:'#c0392b',marginTop:'0.2rem'}}>⚠ Outside permitted range</div>}
                      </div>
                    );
                  })}
                </div>
                <div style={{marginBottom:'1rem'}}>
                  <label style={{display:'block',fontSize:'0.68rem',fontWeight:'600',color:'#3d5a6a',marginBottom:'0.3rem',textTransform:'uppercase',letterSpacing:'0.06em'}}>Remarks</label>
                  <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} rows={2}
                    placeholder="Treatment measures, operational changes..."
                    style={{width:'100%',border:'1px solid #a0b8d4',borderRadius:'3px',padding:'0.5rem 0.7rem',fontSize:'0.875rem',color:'#1a2e4a',background:'white',resize:'vertical',fontFamily:'inherit'}}/>
                </div>
                <button type="submit" style={{padding:'0.55rem 1.75rem',background:'#1a5280',color:'white',border:'none',borderRadius:'3px',fontSize:'0.875rem',fontWeight:'700',cursor:'pointer'}}>
                  Submit Report
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
