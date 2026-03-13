'use client';
import { useState } from 'react';
import { WATER_STATIONS, WATER_TREND, WATER_LIMITS, WaterStation } from '@/data/waterNoiseData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { useRouter } from 'next/navigation';

const qualityColor = (q: string) =>
  q === 'Good' ? '#1a6b3a' : q === 'Moderate' ? '#856404' : q === 'Poor' ? '#c0550a' : '#c0392b';
const qualityBg = (q: string) =>
  q === 'Good' ? '#d4edda' : q === 'Moderate' ? '#fff3cd' : q === 'Poor' ? '#fde9d9' : '#f8d7da';
const qualityBorder = (q: string) =>
  q === 'Good' ? '#b0d9bc' : q === 'Moderate' ? '#ffd966' : q === 'Poor' ? '#f5bb8a' : '#f5c6cb';

export default function PublicWater() {
  const router = useRouter();
  const [selected, setSelected] = useState<WaterStation | null>(null);

  const counts = {
    good: WATER_STATIONS.filter(s => s.quality === 'Good').length,
    moderate: WATER_STATIONS.filter(s => s.quality === 'Moderate').length,
    poor: WATER_STATIONS.filter(s => s.quality === 'Poor').length,
    critical: WATER_STATIONS.filter(s => s.quality === 'Critical').length,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f5ff', fontFamily: 'Segoe UI, Arial, sans-serif', color: '#1a2e4a' }}>

      {/* Tricolour */}
      <div style={{ height: '4px', background: 'linear-gradient(90deg,#FF9933 33.3%,#fff 33.3%,#fff 66.6%,#138808 66.6%)' }} />

      {/* Header */}
      <div style={{ background: '#1a5280', padding: '0.6rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span style={{ fontSize: '1.5rem' }}>💧</span>
          <div>
            <div style={{ fontSize: '0.55rem', color: '#a8c8f0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Government of Maharashtra · MPCB</div>
            <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'white' }}>PrithviNet — Water Quality Portal</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.62rem', color: '#a8c8f0' }}>Live · {new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</span>
          <button onClick={() => router.push('/')}
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', borderRadius: '3px', padding: '0.28rem 0.7rem', fontSize: '0.7rem', cursor: 'pointer' }}>
            ← Home
          </button>
        </div>
      </div>
      <div style={{ background: '#123a6e', borderBottom: '3px solid #e8a000', padding: '0.25rem 2rem' }}>
        <span style={{ fontSize: '0.62rem', color: '#c0d8f8' }}>National Water Quality Monitoring Programme (NWQMP) — 10 stations across Maharashtra rivers and reservoirs</span>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 2rem' }}>

        {/* Health advisory */}
        {counts.critical > 0 && (
          <div style={{ background: '#f8d7da', border: '1px solid #f5c6cb', borderLeft: '5px solid #c0392b', borderRadius: '4px', padding: '0.85rem 1.2rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>⚠️</span>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#721c24', marginBottom: '0.2rem' }}>Critical Water Quality Alert</div>
              <div style={{ fontSize: '0.75rem', color: '#721c24', lineHeight: 1.7 }}>
                <strong>{counts.critical} water bodies</strong> have critical contamination. Avoid contact with water in {WATER_STATIONS.filter(s => s.quality === 'Critical').map(s => s.district).join(' and ')}.
                Do not use river water for drinking, bathing or irrigation without treatment.
              </div>
            </div>
          </div>
        )}

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Good', value: counts.good, color: '#1a6b3a', bg: '#f0f8f3', border: '#c8e0d2' },
            { label: 'Moderate', value: counts.moderate, color: '#856404', bg: '#fffbee', border: '#ffd966' },
            { label: 'Poor', value: counts.poor, color: '#c0550a', bg: '#fff4ee', border: '#fdc8a0' },
            { label: 'Critical', value: counts.critical, color: '#c0392b', bg: '#fdf0ee', border: '#f5c6cb' },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderTop: `3px solid ${s.color}`, borderRadius: '4px', padding: '1rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: '#6b8c7a', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.3rem' }}>{s.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.6rem', color: '#94a3b8', marginTop: '0.1rem' }}>station{s.value !== 1 ? 's' : ''}</div>
            </div>
          ))}
        </div>

        {/* Trend chart */}
        <div style={{ background: 'white', border: '1px solid #c8d8f0', borderRadius: '4px', padding: '1.2rem', marginBottom: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#1a5280', marginBottom: '0.25rem' }}>2024 Water Quality Trend — Mula-Mutha River, Pune</div>
          <div style={{ fontSize: '0.65rem', color: '#6b8c7a', marginBottom: '1rem' }}>Dissolved Oxygen (DO) dropping below 5 mg/L and rising BOD indicates increasing organic pollution load</div>
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={WATER_TREND} margin={{ top: 5, right: 20, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8f0ff" />
              <XAxis dataKey="month" tick={{ fill: '#6b8c7a', fontSize: 11 }} />
              <YAxis tick={{ fill: '#6b8c7a', fontSize: 11 }} domain={[0, 12]} />
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #c8d8f0', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <ReferenceLine y={WATER_LIMITS.do.min} stroke="#1a6b3a" strokeDasharray="4 4" label={{ value: 'DO min', fill: '#1a6b3a', fontSize: 9 }} />
              <ReferenceLine y={WATER_LIMITS.bod.max} stroke="#c0392b" strokeDasharray="4 4" label={{ value: 'BOD limit', fill: '#c0392b', fontSize: 9 }} />
              <Line type="monotone" dataKey="do" stroke="#1a5280" strokeWidth={2.5} name="Dissolved O₂ (mg/L)" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="bod" stroke="#c0392b" strokeWidth={2.5} name="BOD (mg/L)" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Station cards */}
        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1a5280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.85rem', borderBottom: '2px solid #dde8f8', paddingBottom: '0.4rem' }}>
          Water Bodies — Live Readings
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
          {WATER_STATIONS.map(s => (
            <div key={s.id} onClick={() => setSelected(selected?.id === s.id ? null : s)}
              style={{ background: 'white', border: `1px solid ${qualityBorder(s.quality)}`, borderTop: `3px solid ${qualityColor(s.quality)}`, borderRadius: '4px', padding: '0.9rem', cursor: 'pointer', boxShadow: selected?.id === s.id ? `0 0 0 2px ${qualityColor(s.quality)}` : '0 1px 4px rgba(0,0,0,0.05)', transition: 'box-shadow 0.15s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1a2e4a' }}>{s.district}</div>
                  <div style={{ fontSize: '0.62rem', color: '#6b8c7a' }}>{s.name}</div>
                </div>
                <span style={{ background: qualityBg(s.quality), color: qualityColor(s.quality), border: `1px solid ${qualityBorder(s.quality)}`, fontSize: '0.6rem', fontWeight: '700', padding: '1px 7px', borderRadius: '10px' }}>{s.quality}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem' }}>
                {([
                  ['DO', `${s.do}`, s.do < WATER_LIMITS.do.min, 'mg/L'],
                  ['BOD', `${s.bod}`, s.bod > WATER_LIMITS.bod.max, 'mg/L'],
                  ['pH', `${s.ph}`, s.ph < WATER_LIMITS.ph.min || s.ph > WATER_LIMITS.ph.max, ''],
                  ['TDS', `${s.tds}`, s.tds > WATER_LIMITS.tds.max, 'mg/L'],
                ] as [string, string, boolean, string][]).map(([k, v, bad, unit]) => (
                  <div key={k} style={{ background: '#f7f9ff', border: '1px solid #e8f0ff', borderRadius: '3px', padding: '0.28rem 0.4rem' }}>
                    <div style={{ fontSize: '0.58rem', color: '#94a3b8' }}>{k}</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: '700', color: bad ? '#c0392b' : '#1a2e4a' }}>{v} <span style={{ fontSize: '0.55rem', color: '#94a3b8', fontWeight: 400 }}>{unit}</span></div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.62rem', color: s.trend === 'worsening' ? '#c0392b' : s.trend === 'improving' ? '#1a6b3a' : '#6b8c7a' }}>
                {s.trend === 'worsening' ? '↓' : s.trend === 'improving' ? '↑' : '→'} {s.trend}
              </div>
            </div>
          ))}
        </div>

        {/* Expanded station detail */}
        {selected && (
          <div style={{ background: 'white', border: `1px solid ${qualityBorder(selected.quality)}`, borderLeft: `5px solid ${qualityColor(selected.quality)}`, borderRadius: '4px', padding: '1.2rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1a2e4a' }}>{selected.name}</div>
                <div style={{ fontSize: '0.7rem', color: '#6b8c7a' }}>{selected.body} · {selected.district} · Updated: {selected.lastUpdated}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '0.6rem' }}>
              {([
                ['pH', selected.ph, `${WATER_LIMITS.ph.min}–${WATER_LIMITS.ph.max}`, selected.ph < WATER_LIMITS.ph.min || selected.ph > WATER_LIMITS.ph.max],
                ['DO mg/L', selected.do, `>${WATER_LIMITS.do.min}`, selected.do < WATER_LIMITS.do.min],
                ['BOD mg/L', selected.bod, `<${WATER_LIMITS.bod.max}`, selected.bod > WATER_LIMITS.bod.max],
                ['Turbidity NTU', selected.turbidity, `<${WATER_LIMITS.turbidity.max}`, selected.turbidity > WATER_LIMITS.turbidity.max],
                ['Coliform /100ml', selected.coliform, `<${WATER_LIMITS.coliform.max}`, selected.coliform > WATER_LIMITS.coliform.max],
                ['TDS mg/L', selected.tds, `<${WATER_LIMITS.tds.max}`, selected.tds > WATER_LIMITS.tds.max],
              ] as [string, number, string, boolean][]).map(([k, v, lim, bad]) => (
                <div key={k} style={{ background: bad ? '#fdf0ee' : '#f7fcf9', border: `1px solid ${bad ? '#f5c6cb' : '#c8e0d2'}`, borderRadius: '4px', padding: '0.65rem 0.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.62rem', color: '#6b8c7a', marginBottom: '0.2rem' }}>{k}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: bad ? '#c0392b' : '#1a6b3a' }}>{v}</div>
                  <div style={{ fontSize: '0.58rem', color: '#94a3b8', marginTop: '0.15rem' }}>Limit: {lim}</div>
                  {bad && <div style={{ fontSize: '0.6rem', color: '#c0392b', marginTop: '0.2rem', fontWeight: '600' }}>⚠ Over</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Parameter guide */}
        <div style={{ background: 'white', border: '1px solid #c8d8f0', borderRadius: '4px', padding: '1.2rem' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#1a5280', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>Understanding Water Quality Parameters</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '0.6rem' }}>
            {[
              ['pH', '6.5 – 8.5', 'Acidity level. Outside range harms aquatic life.'],
              ['Dissolved O₂', '> 6 mg/L', 'Fish and plants need this to survive. Below 3 is dead zone.'],
              ['BOD', '< 3 mg/L', 'Organic waste indicator. Higher = more sewage pollution.'],
              ['Turbidity', '< 1 NTU', 'Cloudiness. High turbidity signals sediment or algae.'],
              ['Coliform', '< 50 MPN', 'Fecal bacteria. Above 500 is a public health hazard.'],
              ['TDS', '< 500 mg/L', 'Dissolved solids. High values affect taste and usability.'],
            ].map(([p, norm, desc]) => (
              <div key={String(p)} style={{ background: '#f7f9ff', borderRadius: '3px', padding: '0.6rem 0.7rem', borderLeft: '3px solid #1a5280' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#1a5280' }}>{p}</div>
                <div style={{ fontSize: '0.65rem', color: '#1a6b3a', marginBottom: '0.15rem', fontWeight: '600' }}>Normal: {norm}</div>
                <div style={{ fontSize: '0.65rem', color: '#6b8c7a', lineHeight: 1.5 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.62rem', color: '#94a3b8', lineHeight: 1.8 }}>
          © 2024 Maharashtra SPCB · National Water Quality Monitoring Programme · Data sourced from NWQMP stations<br />
          Water quality emergencies: <strong style={{ color: '#1a5280' }}>1800-233-3535</strong> (Toll Free)
        </div>
      </div>
    </div>
  );
}
