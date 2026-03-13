'use client';
import PageShell from '@/components/PageShell';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { FORECAST_DATA, STATIONS } from '@/data/mockData';
import { AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function ForecastPage() {
  const router = useRouter();
  const { user, mounted } = useAuth({ allowedRoles:['Super Admin','Regional Officer','Monitoring Team'] });

  if (!mounted || !user) return <PageShell loading />;

  const chartData  = FORECAST_DATA.filter((_,i) => i % 3 === 0);
  const stationBar = STATIONS.map(s => ({ name:s.district, AQI:s.aqi }));
  const peakAqi    = Math.max(...FORECAST_DATA.map(d => d.predicted));

  return (
    <PageShell>
      <div className="breadcrumb">
        <span>🏠 Home</span><span>›</span>
        <a onClick={() => router.push('/dashboard')} style={{ cursor:'pointer' }}>Dashboard</a>
        <span>›</span>
        <span style={{ color:'var(--navy)', fontWeight:'700' }}>◈ AQI Forecast</span>
      </div>
      <div className="live-bar">
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <span className="live-dot" />
          <span style={{ fontSize:'0.72rem', fontWeight:'700', color:'#22c55e', fontFamily:'Arial', letterSpacing:'0.05em' }}>LIVE</span>
          <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'Arial', marginLeft:'0.35rem' }}>
            72-hour predictive forecast · PrithviNet Analytics Engine
          </span>
        </div>
        <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'Arial' }}>Maharashtra — All Stations</span>
      </div>
      <div className="main-content" style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem' }}>
          {[
            { label:'Forecast Horizon',    value:'72 hrs',    sub:'Next 3 days',               color:'var(--accent-blue)'  },
            { label:'Peak Predicted AQI',  value:peakAqi,     sub:'Expected tomorrow 8 AM IST', color:'var(--danger)'       },
            { label:'Improvement (48 hr)', value:'−15 AQI',   sub:'vs current readings',        color:'var(--accent-green)' },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ borderTopColor:s.color }}>
              <div style={{ fontSize:'0.63rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'0.3rem', fontFamily:'Arial' }}>{s.label}</div>
              <div style={{ fontSize:'2rem', fontWeight:'800', color:s.color, lineHeight:1, fontFamily:'Georgia' }}>{s.value}</div>
              <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', marginTop:'0.25rem', fontFamily:'Arial' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="section-card">
          <div className="section-title">📈 72-Hour AQI Forecast with Confidence Interval</div>
          <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', fontFamily:'Arial', marginBottom:'1rem', background:'var(--light-gray)', border:'1px solid var(--border)', padding:'0.45rem 0.75rem', borderRadius:'3px', lineHeight:1.7 }}>
            Shaded band = 90% confidence interval &nbsp;·&nbsp; Solid blue = actual readings (past 24 h) &nbsp;·&nbsp; Dashed orange = predicted AQI
          </div>
          <ResponsiveContainer width="100%" height={290}>
            <AreaChart data={chartData} margin={{ top:10, right:20, bottom:5, left:-10 }}>
              <defs>
                <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#1a4e8a" stopOpacity={0.12}/>
                  <stop offset="95%" stopColor="#1a4e8a" stopOpacity={0.02}/>
                </linearGradient>
                <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#d4680a" stopOpacity={0.18}/>
                  <stop offset="95%" stopColor="#d4680a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="hour" tick={{ fill:'var(--text-muted)', fontSize:10, fontFamily:'Arial' }} interval={3} />
              <YAxis tick={{ fill:'var(--text-muted)', fontSize:10 }} domain={[0,300]} />
              <Tooltip contentStyle={{ background:'white', border:'1px solid var(--border)', fontSize:'12px', fontFamily:'Arial' }} />
              <ReferenceLine y={100} stroke="var(--accent-green)" strokeDasharray="4 4" label={{ value:'Safe (100)', fill:'var(--accent-green)', fontSize:9 }} />
              <ReferenceLine y={200} stroke="var(--danger)"       strokeDasharray="4 4" label={{ value:'Breach (200)', fill:'var(--danger)', fontSize:9 }} />
              <Area type="monotone" dataKey="upper"     stroke="none"      fill="url(#bandGrad)" name="Upper bound" />
              <Area type="monotone" dataKey="lower"     stroke="none"      fill="white"          name="Lower bound" />
              <Area type="monotone" dataKey="predicted" stroke="#d4680a"   strokeWidth={2} strokeDasharray="5 5" fill="url(#predGrad)" name="Predicted AQI" dot={false} />
              <Area type="monotone" dataKey="actual"    stroke="#1a4e8a"   strokeWidth={2.5} fill="none" name="Actual AQI" dot={false} connectNulls={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="section-card">
          <div className="section-title">📊 Current Average AQI — All Stations</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stationBar} margin={{ top:5, right:20, bottom:40, left:-10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill:'var(--text-muted)', fontSize:10, fontFamily:'Arial' }} angle={-30} textAnchor="end" />
              <YAxis tick={{ fill:'var(--text-muted)', fontSize:10 }} />
              <Tooltip contentStyle={{ background:'white', border:'1px solid var(--border)', fontSize:'12px', fontFamily:'Arial' }} />
              <ReferenceLine y={100} stroke="var(--danger)" strokeDasharray="4 4" />
              <Bar dataKey="AQI" radius={[3,3,0,0]}>
                {stationBar.map((entry, i) => <Cell key={i} fill={entry.AQI>200?'var(--danger)':entry.AQI>100?'#d4680a':'var(--accent-green)'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="section-card" style={{ borderLeft:'4px solid var(--accent-blue)', background:'#f5f8ff' }}>
          <div className="section-title" style={{ color:'var(--accent-blue)' }}>📋 Forecast Methodology Note</div>
          <p style={{ fontSize:'0.8rem', color:'var(--text-mid)', lineHeight:1.8, fontFamily:'Arial' }}>
            The 72-hour AQI forecast is generated using a multi-step time-series model combining historical emissions data,
            meteorological parameters (wind speed, humidity, temperature), and industry operating schedules.
            Confidence intervals represent ±1.5σ prediction bands. The model accounts for known rush-hour emission peaks
            (07:00–10:00 and 17:00–20:00 IST) and nocturnal boundary layer effects. Forecast accuracy is validated against
            CPCB reference station data with mean absolute error below 12 AQI units.
          </p>
        </div>

      </div>
    </PageShell>
  );
}
