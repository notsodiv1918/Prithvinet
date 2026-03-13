'use client';
import IndustrySidebar from '@/components/IndustrySidebar';
import TopBar from '@/components/TopBar';
import { FORECAST_DATA, PRESCRIBED_LIMITS } from '@/data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function IndustryForecast() {
  const chartData = FORECAST_DATA.filter((_, i) => i % 3 === 0);
  const peakAqi = Math.max(...FORECAST_DATA.map(d => d.predicted));
  const hoursAbove = FORECAST_DATA.filter(d => d.predicted > PRESCRIBED_LIMITS.aqi).length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f8f3' }}>
      <IndustrySidebar />
      <main style={{ flex: 1, overflow: 'auto' }}>
        <TopBar title="AQI Forecast" subtitle="72-hour air quality prediction near your facility — Nagpur" />
        <div style={{ background: 'white', borderBottom: '1px solid #e8f5ee', padding: '0.5rem 1.5rem' }}>
          <span style={{ fontSize: '0.7rem', color: '#6b8c7a' }}>Home › My Dashboard › </span>
          <span style={{ fontSize: '0.7rem', color: '#1a6b3a', fontWeight: '600' }}>AQI Forecast</span>
        </div>

        <div style={{ padding: '1.25rem 1.5rem' }}>

          {/* Warning if forecast is bad */}
          {peakAqi > 200 && (
            <div style={{ background: '#fdf0ee', border: '1px solid #f5c6cb', borderLeft: '4px solid #c0392b', borderRadius: '4px', padding: '0.75rem 1rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#721c24' }}>⚠ High AQI Forecast — Inspection Risk</div>
              <div style={{ fontSize: '0.75rem', color: '#721c24', marginTop: '0.15rem', lineHeight: 1.6 }}>
                AQI is predicted to exceed 200 for approximately <strong>{hoursAbove} hours</strong> in the next 72 hours.
                Sustained readings above the prescribed limit may trigger an automatic inspection request by your Regional Officer.
                Ensure all emission control systems are operating at full capacity.
              </div>
            </div>
          )}

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
            {[
              { label: 'Forecast Horizon', value: '72 hrs', sub: 'Next 3 days', color: '#1a6b3a' },
              { label: 'Peak Predicted AQI', value: peakAqi, sub: 'Expected in next 24h', color: peakAqi > 200 ? '#c0392b' : '#d4680a' },
              { label: 'Hours Above Limit', value: hoursAbove, sub: 'AQI > 100 in 72h window', color: hoursAbove > 24 ? '#c0392b' : '#d4680a' },
            ].map(s => (
              <div key={s.label} className="stat-card" style={{ borderTopColor: s.color }}>
                <div style={{ fontSize: '0.68rem', color: '#6b8c7a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>{s.label}</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.7rem', color: '#6b8c7a', marginTop: '0.2rem' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div className="section-card">
            <div className="section-title">72-Hour AQI Forecast — Nagpur MIDC Zone</div>
            <div style={{ fontSize: '0.72rem', color: '#6b8c7a', marginBottom: '1rem', background: '#f7fcf9', border: '1px solid #e8f5ee', padding: '0.5rem 0.75rem', borderRadius: '3px' }}>
              Shaded band = 90% confidence interval · Blue line = actual readings (past 24h) · Orange dashed = predicted
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 10, right: 20, bottom: 5, left: -10 }}>
                <defs>
                  <linearGradient id="bandG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2d8653" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#2d8653" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8f5ee" />
                <XAxis dataKey="hour" tick={{ fill: '#6b8c7a', fontSize: 10 }} interval={3} />
                <YAxis tick={{ fill: '#6b8c7a', fontSize: 11 }} domain={[0, 320]} />
                <Tooltip contentStyle={{ background: 'white', border: '1px solid #c8e0d2', fontSize: '12px' }} />
                <ReferenceLine y={100} stroke="#1a6b3a" strokeDasharray="4 4" label={{ value: 'Safe (100)', fill: '#1a6b3a', fontSize: 9 }} />
                <ReferenceLine y={200} stroke="#c0392b" strokeDasharray="4 4" label={{ value: 'Breach (200)', fill: '#c0392b', fontSize: 9 }} />
                <Area type="monotone" dataKey="upper" stroke="none" fill="url(#bandG)" name="Upper bound" />
                <Area type="monotone" dataKey="lower" stroke="none" fill="white" name="Lower bound" />
                <Area type="monotone" dataKey="predicted" stroke="#d4680a" strokeWidth={2} strokeDasharray="5 5" fill="none" name="Predicted AQI" dot={false} />
                <Area type="monotone" dataKey="actual" stroke="#1a6b3a" strokeWidth={2.5} fill="none" name="Actual AQI" dot={false} connectNulls={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="section-card" style={{ background: '#f7fcf9' }}>
            <div className="section-title">What This Means For Your Facility</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.8rem', color: '#3d5a48', lineHeight: 1.8 }}>
              <div>
                <div style={{ fontWeight: '700', color: '#1a6b3a', marginBottom: '0.3rem' }}>If AQI remains above 200:</div>
                <ul style={{ paddingLeft: '1.2rem' }}>
                  <li>Regional Officer (Rajesh Kumar) may be notified automatically</li>
                  <li>An unscheduled inspection may be initiated within 48 hours</li>
                  <li>You may be required to submit an emergency report</li>
                </ul>
              </div>
              <div>
                <div style={{ fontWeight: '700', color: '#1a6b3a', marginBottom: '0.3rem' }}>Recommended actions:</div>
                <ul style={{ paddingLeft: '1.2rem' }}>
                  <li>Check all scrubbers and pollution control equipment</li>
                  <li>Reduce production output during peak pollution hours (7–10am, 5–8pm)</li>
                  <li>Submit your monthly report promptly to demonstrate compliance effort</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
