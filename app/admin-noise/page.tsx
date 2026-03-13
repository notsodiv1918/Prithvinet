'use client';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { NOISE_STATIONS, NOISE_TREND, NOISE_LIMITS } from '@/data/waterNoiseData';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell, Legend } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';

const sColor = (s:string) => s==='safe'?'#1a6b3a':s==='warning'?'#856404':'#c0392b';
const sBg = (s:string) => s==='safe'?'#d4edda':s==='warning'?'#fff3cd':'#f8d7da';

export default function AdminNoiseDashboard() {
  const breaches = NOISE_STATIONS.filter(s=>s.status==='breach');
  const warnings = NOISE_STATIONS.filter(s=>s.status==='warning');
  const safe = NOISE_STATIONS.filter(s=>s.status==='safe');
  const barData = NOISE_STATIONS.map(s=>({name:s.district,day:s.dayLevel,limit:s.dayLimit,status:s.status}));

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#fdf8f0'}}>
      <Sidebar/>
      <main style={{flex:1,overflow:'auto'}}>
        <TopBar title="Noise Pollution — Admin Dashboard" subtitle="All Maharashtra — zone-wise noise level monitoring"/>
        <Toaster position="top-right"/>
        <div style={{background:'white',borderBottom:'1px solid #e8d8c0',padding:'0.5rem 1.5rem'}}>
          <span style={{fontSize:'0.7rem',color:'#6b8c7a'}}>Home › </span>
          <span style={{fontSize:'0.7rem',color:'#5a3500',fontWeight:'600'}}>Noise Pollution Dashboard</span>
        </div>
        <div style={{padding:'1.25rem 1.5rem'}}>

          {breaches.length>0&&(
            <div style={{background:'#f8d7da',border:'1px solid #f5c6cb',borderLeft:'5px solid #c0392b',borderRadius:'4px',padding:'0.85rem 1.2rem',marginBottom:'1.25rem',display:'flex',gap:'0.75rem'}}>
              <span>⚠️</span>
              <div>
                <div style={{fontWeight:'700',color:'#721c24',fontSize:'0.85rem'}}>Noise Limit Breach — {breaches.length} stations exceeding prescribed limits</div>
                <div style={{fontSize:'0.75rem',color:'#721c24',marginTop:'0.15rem'}}>{breaches.map(s=>`${s.name} (${s.zone})`).join(' · ')}</div>
              </div>
            </div>
          )}

          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'1.25rem'}}>
            {[
              {label:'Total Stations',value:NOISE_STATIONS.length,color:'#5a3500',bg:'#fff8ee',border:'#f0d8a0'},
              {label:'Compliant',value:safe.length,color:'#1a6b3a',bg:'#f0f8f3',border:'#c8e0d2'},
              {label:'Warning',value:warnings.length,color:'#856404',bg:'#fffbee',border:'#ffd966'},
              {label:'Breach',value:breaches.length,color:'#c0392b',bg:'#fdf0ee',border:'#f5c6cb'},
            ].map(s=>(
              <div key={s.label} style={{background:s.bg,border:`1px solid ${s.border}`,borderTop:`3px solid ${s.color}`,borderRadius:'4px',padding:'1rem'}}>
                <div style={{fontSize:'0.65rem',color:'#6b8c7a',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'0.3rem'}}>{s.label}</div>
                <div style={{fontSize:'2rem',fontWeight:'800',color:s.color,lineHeight:1}}>{s.value}</div>
              </div>
            ))}
          </div>

          <div style={{display:'grid',gridTemplateColumns:'3fr 2fr',gap:'1.25rem',marginBottom:'1.25rem'}}>
            <div style={{background:'white',border:'1px solid #e8d8c0',borderRadius:'4px',padding:'1.2rem'}}>
              <div style={{fontSize:'0.75rem',fontWeight:'700',color:'#5a3500',marginBottom:'0.25rem'}}>Daytime Noise vs Limits — All Stations</div>
              <div style={{fontSize:'0.63rem',color:'#6b5a3a',marginBottom:'0.85rem'}}>Red = breach · Yellow = warning · Green = compliant</div>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={barData} margin={{top:5,right:10,bottom:30,left:-10}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0e8d8"/>
                  <XAxis dataKey="name" tick={{fill:'#6b5a3a',fontSize:10}} angle={-25} textAnchor="end" height={50}/>
                  <YAxis tick={{fill:'#6b5a3a',fontSize:11}} domain={[0,90]}/>
                  <Tooltip contentStyle={{background:'white',border:'1px solid #e8d8c0',fontSize:'12px'}} formatter={(v:number)=>[`${v} dB(A)`,'Day Level']}/>
                  <Bar dataKey="day" name="Day dB(A)" radius={[3,3,0,0]}>
                    {barData.map((e,i)=><Cell key={i} fill={e.status==='breach'?'#c0392b':e.status==='warning'?'#e6990a':'#2d8653'}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{background:'white',border:'1px solid #e8d8c0',borderRadius:'4px',padding:'1.2rem'}}>
              <div style={{fontSize:'0.75rem',fontWeight:'700',color:'#5a3500',marginBottom:'0.25rem'}}>24-Hour Pattern — Residential Mumbai</div>
              <div style={{fontSize:'0.63rem',color:'#6b5a3a',marginBottom:'0.85rem'}}>Peak at morning and evening rush hours</div>
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={NOISE_TREND} margin={{top:5,right:10,bottom:5,left:-10}}>
                  <defs>
                    <linearGradient id="ng" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c0392b" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#c0392b" stopOpacity={0.02}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0e8d8"/>
                  <XAxis dataKey="time" tick={{fill:'#6b5a3a',fontSize:10}}/>
                  <YAxis tick={{fill:'#6b5a3a',fontSize:11}} domain={[40,90]}/>
                  <Tooltip contentStyle={{background:'white',border:'1px solid #e8d8c0',fontSize:'12px'}} formatter={(v:number)=>[`${v} dB(A)`,'Noise']}/>
                  <ReferenceLine y={55} stroke="#1a6b3a" strokeDasharray="4 4" label={{value:'Day 55',fill:'#1a6b3a',fontSize:9}}/>
                  <ReferenceLine y={45} stroke="#c0392b" strokeDasharray="4 4" label={{value:'Night 45',fill:'#c0392b',fontSize:9}}/>
                  <Area type="monotone" dataKey="level" stroke="#c0392b" strokeWidth={2} fill="url(#ng)" name="dB(A)" dot={{r:2,fill:'#c0392b'}}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{background:'white',border:'1px solid #e8d8c0',borderRadius:'4px',padding:'1.2rem'}}>
            <div style={{fontSize:'0.75rem',fontWeight:'700',color:'#5a3500',marginBottom:'0.75rem',textTransform:'uppercase',letterSpacing:'0.07em'}}>All Station Readings</div>
            <div style={{overflowX:'auto'}}>
              <table className="gov-table">
                <thead><tr><th>ID</th><th>Station</th><th>District</th><th>Zone</th><th>Day dB</th><th>Day Limit</th><th>Night dB</th><th>Night Limit</th><th>Source</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {NOISE_STATIONS.map(s=>(
                    <tr key={s.id}>
                      <td style={{color:'#5a3500',fontFamily:'monospace',fontSize:'0.75rem'}}>{s.id}</td>
                      <td style={{fontWeight:'500'}}>{s.name}</td>
                      <td style={{color:'#6b8c7a'}}>{s.district}</td>
                      <td style={{color:'#6b8c7a',fontSize:'0.75rem'}}>{s.zone}</td>
                      <td style={{color:s.dayLevel>s.dayLimit?'#c0392b':'#1a6b3a',fontWeight:s.dayLevel>s.dayLimit?'700':'400'}}>{s.dayLevel}</td>
                      <td style={{color:'#6b8c7a'}}>{s.dayLimit}</td>
                      <td style={{color:s.nightLevel>s.nightLimit?'#c0392b':'#1a6b3a',fontWeight:s.nightLevel>s.nightLimit?'700':'400'}}>{s.nightLevel}</td>
                      <td style={{color:'#6b8c7a'}}>{s.nightLimit}</td>
                      <td style={{fontSize:'0.72rem',color:'#6b8c7a'}}>{s.primarySource}</td>
                      <td><span style={{background:sBg(s.status),color:sColor(s.status),borderRadius:'10px',padding:'1px 8px',fontSize:'0.65rem',fontWeight:'700'}}>{s.status}</span></td>
                      <td>{s.status==='breach'&&<button className="btn-danger" style={{fontSize:'0.68rem',padding:'0.2rem 0.5rem'}} onClick={()=>toast.error(`Notice issued: ${s.name}`,{icon:'📋'})}>Notice</button>}</td>
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
