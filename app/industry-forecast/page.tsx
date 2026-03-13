'use client';
import PageShell from '@/components/PageShell';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { FORECAST_DATA } from '@/data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function IndustryForecast() {
  const router = useRouter();
  const { user, mounted } = useAuth({ allowedRoles:['Industry User'] });

  if (!mounted || !user) return <PageShell loading />;

  const chartData      = FORECAST_DATA.filter((_,i) => i % 3 === 0);
  const maxPredicted   = Math.max(...FORECAST_DATA.map(d => d.predicted));
  const inspectionRisk = maxPredicted > 200;

  return (
    <PageShell>
      <div className="breadcrumb">
        <span>Home</span><span>›</span>
        <a onClick={() => router.push('/industry-dashboard')} style={{ cursor:'pointer' }}>My Dashboard</a>
        <span>›</span>
        <span style={{ color:'var(--navy)', fontWeight:'700' }}>AQI Forecast</span>
      </div>
      <div className="live-bar">
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <span className="live-dot" />
          <span style={{ fontSize:'0.72rem', fontWeight:'700', color:'#22c55e', fontFamily:'Arial' }}>LIVE FORECAST</span>
          <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'Arial', marginLeft:'0.35rem' }}>72-hour prediction · Nagpur Industrial Area</span>
        </div>
        <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'Arial' }}>Bharat Steel Works</span>
      </div>
      <div className="main-content" style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>

        {inspectionRisk && (
          <div className="alert-critical" style={{ display:'flex', gap:'0.75rem', alignItems:'flex-start' }}>
            <span style={{ fontSize:'1.3rem', flexShrink:0 }}>⚠️</span>
            <div>
              <strong style={{ fontSize:'0.82rem', color:'#721c24' }}>High Inspection Risk — AQI forecast to exceed 200 within 24 hours</strong>
              <div style={{ fontSize:'0.75rem', color:'#721c24', marginTop:'0.25rem', lineHeight:1.7 }}>
                AQI near your facility is predicted to cross 200. This will trigger an automatic inspection review. Ensure all pollution control systems are running and your report is up to date.
              </div>
            </div>
          </div>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem' }}>
          {[
            { label:'Forecast Period',    value:'72 hrs',             sub:'Next 3 days',               color:'var(--accent-blue)'  },
            { label:'Peak AQI Predicted', value:String(maxPredicted), sub:'Expected tomorrow 8 AM IST', color:'var(--danger)'       },
            { label:'Inspection Risk',    value:inspectionRisk?'HIGH':'LOW', sub:inspectionRisk?'AQI > 200 forecast':'Below threshold', color:inspectionRisk?'var(--danger)':'var(--accent-green)' },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ borderTopColor:s.color }}>
              <div style={{ fontSize:'0.63rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'0.3rem', fontFamily:'Arial' }}>{s.label}</div>
              <div style={{ fontSize:'2rem', fontWeight:'800', color:s.color, lineHeight:1, fontFamily:'Georgia' }}>{s.value}</div>
              <div style={{ fontSize:'0.68rem', color:s.color, marginTop:'0.2rem', fontWeight:'600', fontFamily:'Arial' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="section-card">
          <div className="section-title">72-Hour AQI Forecast — Nagpur Facility Area</div>
          <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', fontFamily:'Arial', marginBottom:'1rem', background:'var(--light-gray)', border:'1px solid var(--border)', padding:'0.45rem 0.75rem', borderRadius:'3px', lineHeight:1.7 }}>
            Red dashed = 200 AQI (inspection threshold) · Green dashed = 100 AQI (safe limit) · Shaded = confidence interval
          </div>
          <ResponsiveContainer width="100%" height={270}>
            <AreaChart data={chartData} margin={{ top:10, right:20, bottom:5, left:-10 }}>
              <defs>
                <linearGradient id="indBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--accent-green)" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="var(--accent-green)" stopOpacity={0.01}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="hour" tick={{ fill:'var(--text-muted)', fontSize:10, fontFamily:'Arial' }} interval={3} />
              <YAxis tick={{ fill:'var(--text-muted)', fontSize:10 }} domain={[0,350]} />
              <Tooltip contentStyle={{ background:'white', border:'1px solid var(--border)', fontSize:'12px', fontFamily:'Arial' }} />
              <ReferenceLine y={200} stroke="var(--danger)"       strokeDasharray="5 5" label={{ value:'Inspection threshold (200)', fill:'var(--danger)', fontSize:9 }} />
              <ReferenceLine y={100} stroke="var(--accent-green)" strokeDasharray="5 5" label={{ value:'Safe limit (100)', fill:'var(--accent-green)', fontSize:9 }} />
              <Area type="monotone" dataKey="upper"     stroke="none"              fill="url(#indBand)" />
              <Area type="monotone" dataKey="lower"     stroke="none"              fill="white" />
              <Area type="monotone" dataKey="predicted" stroke="#d4680a"           strokeWidth={2} strokeDasharray="5 5" fill="none" name="Predicted AQI" dot={false} />
              <Area type="monotone" dataKey="actual"    stroke="var(--accent-green)" strokeWidth={2.5} fill="none" name="Actual AQI" dot={false} connectNulls={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="section-card" style={{ background:'var(--off-white)', borderLeft:'4px solid var(--accent-green)' }}>
          <div className="section-title" style={{ color:'var(--accent-green)' }}>What This Means for Your Facility</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem', fontSize:'0.8rem', color:'var(--text-mid)', lineHeight:1.8, fontFamily:'Arial' }}>
            <div>
              <div style={{ fontWeight:'700', color:'var(--danger)', marginBottom:'0.4rem' }}>If AQI stays above 200:</div>
              <ul style={{ paddingLeft:'1.2rem' }}>
                <li>MPCB may schedule an unannounced inspection</li>
                <li>Your Regional Officer will be notified automatically</li>
                <li>Non-submission of reports will attract penalty</li>
                <li>Persistent breach may lead to show-cause notice</li>
              </ul>
            </div>
            <div>
              <div style={{ fontWeight:'700', color:'var(--accent-green)', marginBottom:'0.4rem' }}>Recommended actions:</div>
              <ul style={{ paddingLeft:'1.2rem' }}>
                <li>Ensure emission control systems are operational</li>
                <li>Submit your monthly report before 31 July</li>
                <li>Check scrubber and filter maintenance logs</li>
                <li>Contact your RO if you need an extension</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </PageShell>
  );
}
