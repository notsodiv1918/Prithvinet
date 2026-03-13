'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { NOISE_STATIONS, NOISE_TREND } from '@/data/waterNoiseData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';

// Bharat Steel is Industrial zone in Nagpur
const MY_STATION = NOISE_STATIONS.find(s=>s.id==='NSE003')!;

export default function IndustryNoiseDashboard() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({dayLevel:'',nightLevel:'',notes:'',month:new Date().toISOString().slice(0,7)});

  const dayBreach = MY_STATION.dayLevel > MY_STATION.dayLimit;
  const nightBreach = MY_STATION.nightLevel > MY_STATION.nightLimit;

  const handle = (e:React.FormEvent)=>{
    e.preventDefault();
    setTimeout(()=>{setSubmitted(true);toast.success('Noise level report submitted');},600);
  };

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#fdf8f0'}}>
      <Sidebar/>
      <main style={{flex:1,overflow:'auto'}}>
        <TopBar title="Noise Levels — Industry Portal" subtitle="Bharat Steel Works, Nagpur — facility noise monitoring and reporting"/>
        <Toaster position="top-right"/>
        <div style={{background:'white',borderBottom:'1px solid #e8d8c0',padding:'0.5rem 1.5rem'}}>
          <span style={{fontSize:'0.7rem',color:'#6b8c7a'}}>Home › </span>
          <span style={{fontSize:'0.7rem',color:'#5a3500',fontWeight:'600'}}>Noise Dashboard</span>
        </div>
        <div style={{padding:'1.25rem 1.5rem'}}>

          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'1.25rem'}}>
            {[
              {label:'Zone Type',value:'Industrial',color:'#5a3500',bg:'#fff8ee',border:'#f0d8a0'},
              {label:'Day Level',value:`${MY_STATION.dayLevel} dB`,color:dayBreach?'#c0392b':'#1a6b3a',bg:dayBreach?'#fdf0ee':'#f0f8f3',border:dayBreach?'#f5c6cb':'#c8e0d2'},
              {label:'Night Level',value:`${MY_STATION.nightLevel} dB`,color:nightBreach?'#c0392b':'#1a6b3a',bg:nightBreach?'#fdf0ee':'#f0f8f3',border:nightBreach?'#f5c6cb':'#c8e0d2'},
              {label:'Status',value:MY_STATION.status,color:MY_STATION.status==='safe'?'#1a6b3a':MY_STATION.status==='warning'?'#856404':'#c0392b',bg:'#f0f8f3',border:'#c8e0d2'},
            ].map(s=>(
              <div key={s.label} style={{background:s.bg,border:`1px solid ${s.border}`,borderTop:`3px solid ${s.color}`,borderRadius:'4px',padding:'1rem'}}>
                <div style={{fontSize:'0.65rem',color:'#6b8c7a',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'0.3rem'}}>{s.label}</div>
                <div style={{fontSize:String(s.value).length>8?'1.1rem':'1.6rem',fontWeight:'800',color:s.color,lineHeight:1,textTransform:'capitalize'}}>{s.value}</div>
              </div>
            ))}
          </div>

          <div style={{background:'white',border:'1px solid #e8d8c0',borderRadius:'4px',padding:'1.2rem',marginBottom:'1.25rem'}}>
            <div style={{fontSize:'0.75rem',fontWeight:'700',color:'#5a3500',marginBottom:'0.25rem'}}>Limits Reference — Industrial Zone</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem',marginBottom:'0.85rem'}}>
              {[
                ['Day Limit',MY_STATION.dayLimit,'dB(A)',MY_STATION.dayLevel,dayBreach],
                ['Night Limit',MY_STATION.nightLimit,'dB(A)',MY_STATION.nightLevel,nightBreach],
              ].map(([k,lim,u,actual,breach])=>(
                <div key={String(k)} style={{background:breach?'#fdf0ee':'#fdf8f0',border:`1px solid ${breach?'#f5c6cb':'#e8d8c0'}`,borderRadius:'4px',padding:'0.75rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontSize:'0.68rem',color:'#6b5a3a'}}>{k}</div>
                    <div style={{fontSize:'1.2rem',fontWeight:'800',color:'#5a3500'}}>{lim} {u}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:'0.62rem',color:'#6b5a3a'}}>Current</div>
                    <div style={{fontSize:'1.2rem',fontWeight:'800',color:breach?'#c0392b':'#1a6b3a'}}>{actual}</div>
                    {breach&&<div style={{fontSize:'0.6rem',color:'#c0392b',fontWeight:'600'}}>+{Number(actual)-Number(lim)} over</div>}
                  </div>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={170}>
              <AreaChart data={NOISE_TREND} margin={{top:5,right:15,bottom:5,left:-10}}>
                <defs>
                  <linearGradient id="ng2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c0392b" stopOpacity={0.12}/>
                    <stop offset="95%" stopColor="#c0392b" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0e8d8"/>
                <XAxis dataKey="time" tick={{fill:'#6b5a3a',fontSize:10}}/>
                <YAxis tick={{fill:'#6b5a3a',fontSize:11}} domain={[40,90]}/>
                <Tooltip contentStyle={{background:'white',border:'1px solid #e8d8c0',fontSize:'12px'}} formatter={(v:number)=>[`${v} dB(A)`,'Level']}/>
                <ReferenceLine y={MY_STATION.dayLimit} stroke="#1a6b3a" strokeDasharray="4 4" label={{value:`Day limit ${MY_STATION.dayLimit}`,fill:'#1a6b3a',fontSize:9}}/>
                <ReferenceLine y={MY_STATION.nightLimit} stroke="#1a5280" strokeDasharray="4 4" label={{value:`Night ${MY_STATION.nightLimit}`,fill:'#1a5280',fontSize:9}}/>
                <Area type="monotone" dataKey="level" stroke="#c0392b" strokeWidth={2} fill="url(#ng2)" name="dB(A)" dot={{r:2,fill:'#c0392b'}}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{background:'white',border:'1px solid #e8d8c0',borderRadius:'4px',padding:'1.2rem'}}>
            <div style={{fontSize:'0.78rem',fontWeight:'700',color:'#5a3500',marginBottom:'0.75rem',textTransform:'uppercase',letterSpacing:'0.07em'}}>Monthly Noise Level Report</div>
            {submitted?(
              <div style={{textAlign:'center',padding:'2rem',background:'#fdf8f0',borderRadius:'4px',border:'1px solid #e8d8c0'}}>
                <div style={{fontSize:'2.5rem',marginBottom:'0.75rem'}}>✅</div>
                <div style={{fontSize:'0.95rem',fontWeight:'700',color:'#5a3500',marginBottom:'0.4rem'}}>Report Submitted</div>
                <div style={{fontSize:'0.78rem',color:'#6b8c7a',marginBottom:'1rem'}}>Sent to Regional Officer Rajesh Kumar.</div>
                <button style={{padding:'0.5rem 1.5rem',background:'#5a3500',color:'white',border:'none',borderRadius:'3px',cursor:'pointer',fontSize:'0.875rem',fontWeight:'700'}} onClick={()=>setSubmitted(false)}>Submit Another</button>
              </div>
            ):(
              <form onSubmit={handle}>
                <div style={{marginBottom:'0.85rem'}}>
                  <label style={{display:'block',fontSize:'0.68rem',fontWeight:'600',color:'#6b5a3a',marginBottom:'0.3rem',textTransform:'uppercase',letterSpacing:'0.06em'}}>Reporting Month *</label>
                  <input type="month" value={form.month} onChange={e=>setForm(f=>({...f,month:e.target.value}))}
                    style={{border:'1px solid #c8b890',borderRadius:'3px',padding:'0.5rem 0.7rem',fontSize:'0.85rem',color:'#2a1e0a',background:'white',width:'220px'}}/>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
                  {[
                    {key:'dayLevel',label:`Day Avg dB(A)`,limit:`Limit: ${MY_STATION.dayLimit} dB(A)`,lim:MY_STATION.dayLimit},
                    {key:'nightLevel',label:`Night Avg dB(A)`,limit:`Limit: ${MY_STATION.nightLimit} dB(A)`,lim:MY_STATION.nightLimit},
                  ].map(f=>{
                    const v=Number((form as any)[f.key]);
                    const over=v>0&&v>f.lim;
                    return(
                      <div key={f.key}>
                        <label style={{display:'block',fontSize:'0.68rem',fontWeight:'600',color:'#6b5a3a',marginBottom:'0.3rem',textTransform:'uppercase',letterSpacing:'0.06em'}}>
                          {f.label} * <span style={{color:'#94a3b8',fontWeight:400,textTransform:'none',fontSize:'0.62rem'}}>{f.limit}</span>
                        </label>
                        <input type="number" step="0.1" placeholder="Monthly average" value={(form as any)[f.key]}
                          onChange={e=>setForm(fv=>({...fv,[f.key]:e.target.value}))} required
                          style={{width:'100%',border:`1px solid ${over?'#f5c6cb':'#c8b890'}`,borderRadius:'3px',padding:'0.5rem 0.7rem',fontSize:'0.875rem',color:'#2a1e0a',background:'white'}}/>
                        {over&&<div style={{fontSize:'0.68rem',color:'#c0392b',marginTop:'0.2rem'}}>⚠ Exceeds limit by {v-f.lim} dB</div>}
                      </div>
                    );
                  })}
                </div>
                <div style={{marginBottom:'1rem'}}>
                  <label style={{display:'block',fontSize:'0.68rem',fontWeight:'600',color:'#6b5a3a',marginBottom:'0.3rem',textTransform:'uppercase',letterSpacing:'0.06em'}}>Remarks</label>
                  <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} rows={2}
                    placeholder="Equipment changes, soundproofing measures, complaints received..."
                    style={{width:'100%',border:'1px solid #c8b890',borderRadius:'3px',padding:'0.5rem 0.7rem',fontSize:'0.875rem',color:'#2a1e0a',background:'white',resize:'vertical',fontFamily:'inherit'}}/>
                </div>
                <button type="submit" style={{padding:'0.55rem 1.75rem',background:'#5a3500',color:'white',border:'none',borderRadius:'3px',fontSize:'0.875rem',fontWeight:'700',cursor:'pointer'}}>
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
