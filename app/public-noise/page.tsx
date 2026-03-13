'use client';
import { useState } from 'react';
import { NOISE_STATIONS, NOISE_TREND, NOISE_LIMITS, NoiseStation } from '@/data/waterNoiseData';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { useRouter } from 'next/navigation';

const statusColor = (s: string) => s === 'safe' ? '#1a6b3a' : s === 'warning' ? '#856404' : '#c0392b';
const statusBg = (s: string) => s === 'safe' ? '#d4edda' : s === 'warning' ? '#fff3cd' : '#f8d7da';
const statusBorder = (s: string) => s === 'safe' ? '#b0d9bc' : s === 'warning' ? '#ffd966' : '#f5c6cb';
const zoneIcon = (z: string) => z === 'Industrial' ? '🏭' : z === 'Commercial' ? '🏢' : z === 'Residential' ? '🏘' : '🌿';

export default function PublicNoise() {
  const router = useRouter();
  const [selected, setSelected] = useState<NoiseStation | null>(null);
  const [filterZone, setFilterZone] = useState<string>('All');

  const zones = ['All', 'Residential', 'Commercial', 'Industrial', 'Silence'];
  const filtered = filterZone === 'All' ? NOISE_STATIONS : NOISE_STATIONS.filter(s => s.zone === filterZone);

  const counts = {
    safe: NOISE_STATIONS.filter(s => s.status === 'safe').length,
    warning: NOISE_STATIONS.filter(s => s.status === 'warning').length,
    breach: NOISE_STATIONS.filter(s => s.status === 'breach').length,
  };

  const barData = NOISE_STATIONS.map(s => ({
    name: s.district, day: s.dayLevel, limit: s.dayLimit,
    status: s.status,
  }));

  return (
    <div style={{ minHeight: '100vh', background: '#fdf8f0', fontFamily: 'Segoe UI, Arial, sans-serif', color: '#2a1e0a' }}>

      {/* Tricolour */}
      <div style={{ height: '4px', background: 'linear-gradient(90deg,#FF9933 33.3%,#fff 33.3%,#fff 66.6%,#138808 66.6%)' }} />

      {/* Header */}
      <div style={{ background: '#5a3500', padding: '0.6rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🔊</span>
          <div>
            <div style={{ fontSize: '0.55rem', color: '#d4b080', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Government of Maharashtra · MPCB</div>
            <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'white' }}>PrithviNet — Noise Pollution Portal</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.62rem', color: '#d4b080' }}>Live · {new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</span>
          <button onClick={() => router.push('/')}
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', borderRadius: '3px', padding: '0.28rem 0.7rem', fontSize: '0.7rem', cursor: 'pointer' }}>
            ← Home
          </button>
        </div>
      </div>
      <div style={{ background: '#422800', borderBottom: '3px solid #e8a000', padding: '0.25rem 2rem' }}>
        <span style={{ fontSize: '0.62rem', color: '#e8c880' }}>Noise Pollution (Regulation &amp; Control) Rules 2000 — 10 monitoring stations across Maharashtra</span>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 2rem' }}>

        {/* Alert banner */}
        {counts.breach > 0 && (
          <div style={{ background: '#f8d7da', border: '1px solid #f5c6cb', borderLeft: '5px solid #c0392b', borderRadius: '4px', padding: '0.85rem 1.2rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}>
            <span style={{ fontSize: '1rem', flexShrink: 0 }}>⚠️</span>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#721c24', marginBottom: '0.15rem' }}>Noise Limit Breach — Health Advisory</div>
              <div style={{ fontSize: '0.75rem', color: '#721c24', lineHeight: 1.7 }}>
                <strong>{counts.breach} stations</strong> are recording noise levels above prescribed limits. Prolonged exposure above 65 dB can cause hearing loss and cardiovascular stress.
                Residents near {NOISE_STATIONS.filter(s => s.status === 'breach').slice(0, 2).map(s => s.name).join(', ')} should limit outdoor exposure.
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Stations', value: NOISE_STATIONS.length, color: '#5a3500', bg: '#fff8ee', border: '#f0d8a0' },
            { label: 'Compliant', value: counts.safe, color: '#1a6b3a', bg: '#f0f8f3', border: '#c8e0d2' },
            { label: 'Warning', value: counts.warning, color: '#856404', bg: '#fffbee', border: '#ffd966' },
            { label: 'Breach', value: counts.breach, color: '#c0392b', bg: '#fdf0ee', border: '#f5c6cb' },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderTop: `3px solid ${s.color}`, borderRadius: '4px', padding: '1rem', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '0.65rem', color: '#6b5a3a', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.3rem' }}>{s.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: s.color, lineHeight: 1 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Day noise bar chart */}
        <div style={{ background: 'white', border: '1px solid #e8d8c0', borderRadius: '4px', padding: '1.2rem', marginBottom: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#5a3500', marginBottom: '0.25rem' }}>Daytime Noise Levels vs Limits — All Stations</div>
          <div style={{ fontSize: '0.65rem', color: '#6b5a3a', marginBottom: '1rem' }}>Red bars exceed the prescribed day limit for that zone · Limits differ by zone type</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 5, right: 15, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e8d8" />
              <XAxis dataKey="name" tick={{ fill: '#6b5a3a', fontSize: 10 }} angle={-20} textAnchor="end" height={40} />
              <YAxis tick={{ fill: '#6b5a3a', fontSize: 11 }} domain={[0, 90]} />
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #e8d8c0', fontSize: '12px' }}
                formatter={(v: number, n: string) => [`${v} dB(A)`, n]} />
              <Bar dataKey="day" name="Day Level dB(A)" radius={[3, 3, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={entry.status === 'breach' ? '#c0392b' : entry.status === 'warning' ? '#e6990a' : '#2d8653'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly trend */}
        <div style={{ background: 'white', border: '1px solid #e8d8c0', borderRadius: '4px', padding: '1.2rem', marginBottom: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#5a3500', marginBottom: '0.25rem' }}>24-Hour Noise Pattern — Residential Zone, Mumbai</div>
          <div style={{ fontSize: '0.65rem', color: '#6b5a3a', marginBottom: '1rem' }}>Peak hours: 8am–10am and 6pm–8pm · Night limit is 45 dB(A) for residential zones</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={NOISE_TREND} margin={{ top: 5, right: 15, bottom: 5, left: -10 }}>
              <defs>
                <linearGradient id="noiseG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c0392b" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#c0392b" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e8d8" />
              <XAxis dataKey="time" tick={{ fill: '#6b5a3a', fontSize: 11 }} />
              <YAxis tick={{ fill: '#6b5a3a', fontSize: 11 }} domain={[40, 90]} />
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #e8d8c0', fontSize: '12px' }}
                formatter={(v: number) => [`${v} dB(A)`, 'Noise Level']} />
              <ReferenceLine y={55} stroke="#1a6b3a" strokeDasharray="4 4" label={{ value: 'Day limit 55', fill: '#1a6b3a', fontSize: 9 }} />
              <ReferenceLine y={45} stroke="#c0392b" strokeDasharray="4 4" label={{ value: 'Night limit 45', fill: '#c0392b', fontSize: 9 }} />
              <Area type="monotone" dataKey="level" stroke="#c0392b" strokeWidth={2.5} fill="url(#noiseG)" name="Noise dB(A)" dot={{ r: 3, fill: '#c0392b' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Zone filter + cards */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', borderBottom: '2px solid #e8d8c0', paddingBottom: '0.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#5a3500', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Monitoring Stations</div>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {zones.map(z => (
              <button key={z} onClick={() => setFilterZone(z)}
                style={{ padding: '0.25rem 0.6rem', borderRadius: '3px', fontSize: '0.65rem', fontWeight: filterZone === z ? '700' : '400', background: filterZone === z ? '#5a3500' : 'white', color: filterZone === z ? 'white' : '#5a3500', border: '1px solid #e8d8c0', cursor: 'pointer' }}>
                {z}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
          {filtered.map(s => (
            <div key={s.id} onClick={() => setSelected(selected?.id === s.id ? null : s)}
              style={{ background: 'white', border: `1px solid ${statusBorder(s.status)}`, borderTop: `3px solid ${statusColor(s.status)}`, borderRadius: '4px', padding: '0.9rem', cursor: 'pointer', boxShadow: selected?.id === s.id ? `0 0 0 2px ${statusColor(s.status)}` : '0 1px 4px rgba(0,0,0,0.05)', transition: 'box-shadow 0.15s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#2a1e0a' }}>{s.name}</div>
                  <div style={{ fontSize: '0.62rem', color: '#6b5a3a' }}>{s.district}</div>
                </div>
                <span style={{ background: statusBg(s.status), color: statusColor(s.status), border: `1px solid ${statusBorder(s.status)}`, fontSize: '0.6rem', fontWeight: '700', padding: '1px 7px', borderRadius: '10px' }}>
                  {s.status}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem' }}>{zoneIcon(s.zone)}</span>
                <span style={{ fontSize: '0.65rem', color: '#6b5a3a' }}>{s.zone} Zone</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem' }}>
                {[
                  ['Day', s.dayLevel, s.dayLimit, 'dB'],
                  ['Night', s.nightLevel, s.nightLimit, 'dB'],
                ].map(([k, v, lim, u]) => {
                  const bad = Number(v) > Number(lim);
                  return (
                    <div key={String(k)} style={{ background: bad ? '#fdf0ee' : '#fdf8f0', border: `1px solid ${bad ? '#f5c6cb' : '#e8d8c0'}`, borderRadius: '3px', padding: '0.28rem 0.4rem' }}>
                      <div style={{ fontSize: '0.58rem', color: '#94a3b8' }}>{k}</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '800', color: bad ? '#c0392b' : '#2a1e0a' }}>{v} <span style={{ fontSize: '0.55rem', fontWeight: 400, color: '#94a3b8' }}>{u}</span></div>
                      <div style={{ fontSize: '0.55rem', color: '#94a3b8' }}>Limit: {lim}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ fontSize: '0.62rem', color: '#6b5a3a', marginTop: '0.5rem' }}>📍 {s.primarySource}</div>
            </div>
          ))}
        </div>

        {/* Expanded detail */}
        {selected && (
          <div style={{ background: 'white', border: `1px solid ${statusBorder(selected.status)}`, borderLeft: `5px solid ${statusColor(selected.status)}`, borderRadius: '4px', padding: '1.2rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#2a1e0a' }}>{zoneIcon(selected.zone)} {selected.name} — {selected.district}</div>
                <div style={{ fontSize: '0.68rem', color: '#6b5a3a' }}>{selected.zone} Zone · Primary source: {selected.primarySource} · Updated: {selected.lastUpdated}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem' }}>
              {[
                ['Day Level', selected.dayLevel, selected.dayLimit, 'dB(A)', selected.dayLevel > selected.dayLimit],
                ['Day Limit', selected.dayLimit, null, 'dB(A)', false],
                ['Night Level', selected.nightLevel, selected.nightLimit, 'dB(A)', selected.nightLevel > selected.nightLimit],
                ['Night Limit', selected.nightLimit, null, 'dB(A)', false],
              ].map(([k, v, lim, u, bad]) => (
                <div key={String(k)} style={{ background: bad ? '#fdf0ee' : '#fdf8f0', border: `1px solid ${bad ? '#f5c6cb' : '#e8d8c0'}`, borderRadius: '4px', padding: '0.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: '#6b5a3a', marginBottom: '0.2rem' }}>{k}</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '800', color: bad ? '#c0392b' : '#2a1e0a' }}>{v}</div>
                  <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>{u}</div>
                  {bad && <div style={{ fontSize: '0.6rem', color: '#c0392b', marginTop: '0.2rem', fontWeight: '600' }}>⚠ +{Number(v) - Number(lim)} dB over</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Limits reference */}
        <div style={{ background: 'white', border: '1px solid #e8d8c0', borderRadius: '4px', padding: '1.2rem' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#5a3500', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>Prescribed Noise Limits — Rules 2000</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ background: '#5a3500' }}>
                {['Zone', 'Zone Type', 'Day Limit dB(A)', 'Night Limit dB(A)'].map(h => (
                  <th key={h} style={{ padding: '0.5rem 0.75rem', color: 'white', fontWeight: '700', fontSize: '0.72rem', textAlign: 'left', letterSpacing: '0.03em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {([
                ['Industrial', '🏭', '75', '70'],
                ['Commercial', '🏢', '65', '55'],
                ['Residential', '🏘', '55', '45'],
                ['Silence Zone', '🌿', '50', '40'],
              ]).map(([z, icon, day, night], i) => (
                <tr key={z} style={{ background: i % 2 === 0 ? '#fdf8f0' : 'white', borderBottom: '1px solid #f0e8d8' }}>
                  <td style={{ padding: '0.5rem 0.75rem' }}>{icon} {z}</td>
                  <td style={{ padding: '0.5rem 0.75rem', color: '#6b5a3a', fontSize: '0.7rem' }}>
                    {z === 'Industrial' ? 'Factories, plants' : z === 'Commercial' ? 'Markets, offices' : z === 'Residential' ? 'Housing areas' : 'Hospitals, schools'}
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem', fontWeight: '700', color: '#c0392b' }}>{day} dB</td>
                  <td style={{ padding: '0.5rem 0.75rem', fontWeight: '700', color: '#1a5280' }}>{night} dB</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '0.75rem', fontSize: '0.65rem', color: '#6b5a3a', lineHeight: 1.7 }}>
            Source: Noise Pollution (Regulation &amp; Control) Rules, 2000 under the Environment (Protection) Act, 1986.
            Silence zones include hospitals, educational institutions and courts — firecrackers and loudspeakers are prohibited.
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.62rem', color: '#94a3b8', lineHeight: 1.8 }}>
          © 2024 Maharashtra SPCB · Noise Pollution (Regulation &amp; Control) Rules 2000<br />
          Noise complaints: <strong style={{ color: '#5a3500' }}>1800-233-3535</strong> (Toll Free) · Police noise helpline: <strong>100</strong>
        </div>
      </div>
    </div>
  );
}
