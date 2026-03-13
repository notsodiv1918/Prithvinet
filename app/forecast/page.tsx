'use client';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { FORECAST_DATA, STATIONS } from '@/data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ReferenceLine, Legend, Cell } from 'recharts';

export default function ForecastPage() {
  const chartData = FORECAST_DATA.filter((_,i)=>i%3===0);
  const stationBar = STATIONS.map(s=>({ name:s.district, AQI:s.aqi }));

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#f0f8f3' }}>
      <Sidebar />
      <main style={{ flex:1, overflow:'auto' }}>
        <TopBar title="Forecast & Analytics" subtitle="72-hour AQI prediction with confidence intervals" />
        <div style={{ background:'white', borderBottom:'1px solid #e8f5ee', padding:'0.5rem 1.5rem' }}>
          <span style={{ fontSize:'0.7rem', color:'#6b8c7a' }}>Home › </span>
          <span style={{ fontSize:'0.7rem', color:'#1a6b3a', fontWeight:'600' }}>Forecast</span>
        </div>

        <div style={{ padding:'1.25rem 1.5rem' }}>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'1.25rem' }}>
            {[
              { label:'Forecast Horizon', value:'72 hrs', sub:'Next 3 days', color:'#1a6b3a' },
              { label:'Peak Predicted AQI', value:String(Math.max(...FORECAST_DATA.map(d=>d.predicted))), sub:'Expected tomorrow 8am', color:'#c0392b' },
              { label:'48hr Trend', value:'−15 AQI', sub:'Improving forecast', color:'#1a6b3a' },
            ].map(s=>(
              <div key={s.label} className="stat-card" style={{ borderTopColor:s.color }}>
                <div style={{ fontSize:'0.68rem', color:'#6b8c7a', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.4rem' }}>{s.label}</div>
                <div style={{ fontSize:'1.9rem', fontWeight:'800', color:s.color, lineHeight:1 }}>{s.value}</div>
                <div style={{ fontSize:'0.7rem', color:'#6b8c7a', marginTop:'0.2rem' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div className="section-card">
            <div className="section-title">72-Hour AQI Forecast with Confidence Interval</div>
            <div style={{ fontSize:'0.72rem', color:'#6b8c7a', marginBottom:'1rem', background:'#f7fcf9', border:'1px solid #e8f5ee', padding:'0.5rem 0.75rem', borderRadius:'3px' }}>
              📊 Shaded band = 90% confidence interval · Solid blue line = actual readings (past 24h) · Dashed orange = predicted values
            </div>
            <ResponsiveContainer width="100%" height={290}>
              <AreaChart data={chartData} margin={{ top:10, right:20, bottom:5, left:-10 }}>
                <defs>
                  <linearGradient id="bandG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2d8653" stopOpacity={0.12}/>
                    <stop offset="95%" stopColor="#2d8653" stopOpacity={0.02}/>
                  </linearGradient>
                  <linearGradient id="predG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4680a" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#d4680a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8f5ee" />
                <XAxis dataKey="hour" tick={{ fill:'#6b8c7a', fontSize:10 }} interval={3} />
                <YAxis tick={{ fill:'#6b8c7a', fontSize:11 }} domain={[0,320]} />
                <Tooltip contentStyle={{ background:'white', border:'1px solid #c8e0d2', borderRadius:'3px', fontSize:'12px' }} />
                <ReferenceLine y={100} stroke="#1a6b3a" strokeDasharray="4 4" label={{ value:'Safe limit (100)', fill:'#1a6b3a', fontSize:10 }} />
                <ReferenceLine y={200} stroke="#c0392b" strokeDasharray="4 4" label={{ value:'Breach (200)', fill:'#c0392b', fontSize:10 }} />
                <Area type="monotone" dataKey="upper" stroke="none" fill="url(#bandG)" name="Upper bound" />
                <Area type="monotone" dataKey="lower" stroke="none" fill="white" name="Lower bound" />
                <Area type="monotone" dataKey="predicted" stroke="#d4680a" strokeWidth={2} strokeDasharray="5 5" fill="url(#predG)" name="Predicted AQI" dot={false} />
                <Area type="monotone" dataKey="actual" stroke="#1a6b3a" strokeWidth={2.5} fill="none" name="Actual AQI" dot={false} connectNulls={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="section-card">
            <div className="section-title">Current Month Average AQI — All Monitoring Stations</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stationBar} margin={{ top:5, right:20, bottom:45, left:-10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8f5ee" />
                <XAxis dataKey="name" tick={{ fill:'#6b8c7a', fontSize:10 }} angle={-30} textAnchor="end" />
                <YAxis tick={{ fill:'#6b8c7a', fontSize:11 }} />
                <Tooltip contentStyle={{ background:'white', border:'1px solid #c8e0d2', borderRadius:'3px', fontSize:'12px' }} />
                <ReferenceLine y={100} stroke="#c0392b" strokeDasharray="4 4" label={{ value:'Limit', fill:'#c0392b', fontSize:10 }} />
                <Bar dataKey="AQI" radius={[3,3,0,0]} name="AQI">
                  {stationBar.map((entry,i)=>(
                    <Cell key={i} fill={entry.AQI>200?'#c0392b':entry.AQI>100?'#d4680a':'#1a6b3a'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="section-card" style={{ background:'#f7fcf9', borderColor:'#c8e0d2' }}>
            <div className="section-title">Forecast Methodology Note</div>
            <p style={{ fontSize:'0.8rem', color:'#3d5a48', lineHeight:1.8 }}>
              The 72-hour AQI forecast is generated using a multi-step time-series model combining historical emissions data,
              meteorological parameters (wind speed, humidity, temperature inversion), and industry operating schedules.
              Confidence intervals represent ±1.5σ prediction bands. The model accounts for known rush-hour emission peaks
              (07:00–10:00 and 17:00–20:00 IST) and nocturnal boundary layer effects.
              Forecast data is validated against CPCB reference station benchmarks with mean absolute error below 12 AQI units.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
