'use client';
import { useState } from 'react';
import CitizenPageHeader from '@/components/CitizenPageHeader';
import CitizenPollutionMap, { MapStation } from '@/components/CitizenPollutionMap';
import LocationDetailsCard, { Precaution } from '@/components/LocationDetailsCard';
import PollutionMetrics, { Metric } from '@/components/PollutionMetrics';
import { WATER_MAP_STATIONS, waterColor, waterRadius } from '@/data/citizenMapData';

// ── helpers ──────────────────────────────────────────────────────────────────
function qualityInfo(q: string) {
  if (q === 'Good')     return { color: '#16a34a', bg: '#d4edda' };
  if (q === 'Moderate') return { color: '#ca8a04', bg: '#fef3c7' };
  if (q === 'Poor')     return { color: '#ea580c', bg: '#fde9d9' };
  return                       { color: '#991b1b', bg: '#fdf0ee' }; // Critical
}

function waterPrecautions(quality: string): Precaution[] {
  if (quality === 'Good') return [
    { icon: '✅', text: 'Water quality is good. Suitable for recreational use after standard treatment.' },
    { icon: '🐟', text: 'Aquatic life is healthy. Biodiversity indicators are within safe range.' },
  ];
  if (quality === 'Moderate') return [
    { icon: '⚠️', text: 'Do not drink untreated water from this source.' },
    { icon: '🏊', text: 'Avoid swimming — mild bacterial contamination detected.' },
    { icon: '🐟', text: 'Fish from this water body should be thoroughly cooked before eating.' },
  ];
  if (quality === 'Poor') return [
    { icon: '🚫', text: 'Do NOT use this water for drinking, cooking or bathing.' },
    { icon: '🏊', text: 'Avoid all contact — high bacterial and organic contamination.' },
    { icon: '🌾', text: 'Do not irrigate food crops with this water.' },
    { icon: '🐟', text: 'Do not consume fish from this water body.' },
    { icon: '🏥', text: 'Report illness after any contact to: 1800-233-3535.' },
  ];
  // Critical
  return [
    { icon: '🚨', text: 'CRITICAL CONTAMINATION — Do NOT touch this water under any circumstances.' },
    { icon: '🚫', text: 'Avoid the riverbank area — toxic contamination risk.' },
    { icon: '⚠️', text: 'Dissolved oxygen critically low — aquatic life cannot survive.' },
    { icon: '🏥', text: 'Seek immediate medical attention if you have had contact with this water.' },
    { icon: '📞', text: 'Report to MPCB immediately: 1800-233-3535 (Toll Free).' },
  ];
}

const LEGEND = [
  { color: '#16a34a', label: 'Good',     description: 'Safe for use'           },
  { color: '#ca8a04', label: 'Moderate', description: 'Limited concerns'       },
  { color: '#ea580c', label: 'Poor',     description: 'Avoid contact'          },
  { color: '#991b1b', label: 'Critical', description: 'Dangerous — stay away' },
];

export default function PublicWaterPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = selectedId ? WATER_MAP_STATIONS.find(s => s.id === selectedId) : null;

  const critical = WATER_MAP_STATIONS.filter(s => s.quality === 'Critical').length;
  const poor     = WATER_MAP_STATIONS.filter(s => s.quality === 'Poor').length;

  const mapStations: MapStation[] = WATER_MAP_STATIONS.map(s => ({
    id:          s.id,
    lat:         s.lat,
    lng:         s.lng,
    color:       waterColor(s.quality),
    outerColor:  waterColor(s.quality),
    radius:      waterRadius(s.quality),
    innerRadius: 6000,
    label:       s.name,
    statusLabel: s.quality,
  }));

  const selInfo = selected ? qualityInfo(selected.quality) : null;
  const selMetrics: Metric[] = selected ? [
    { label: 'pH',             value: selected.ph,              unit: '',        limit: '6.5–8.5', isBreached: selected.ph < 6.5 || selected.ph > 8.5 },
    { label: 'Dissolved O₂',  value: selected.dissolvedOxygen, unit: 'mg/L',   limit: 'min 6',   isBreached: selected.dissolvedOxygen < 6 },
    { label: 'BOD',            value: selected.bod,             unit: 'mg/L',   limit: 'max 3',   isBreached: selected.bod > 3 },
    { label: 'Turbidity',      value: selected.turbidity,       unit: 'NTU',    limit: 'max 1',   isBreached: selected.turbidity > 1 },
    { label: 'Coliform',       value: selected.coliform,        unit: 'MPN',    limit: 'max 50',  isBreached: selected.coliform > 50 },
    { label: 'TDS',            value: selected.tds,             unit: 'mg/L',   limit: 'max 500', isBreached: selected.tds > 500 },
  ] : [];

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', display: 'flex', flexDirection: 'column', fontFamily: 'Arial, sans-serif' }}>
      <CitizenPageHeader activeTab="water" stationCount={WATER_MAP_STATIONS.length} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.25rem 1.5rem', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {(critical > 0 || poor > 0) && (
          <div style={{ background: '#fdf0ee', border: '1px solid #f5c6cb', borderLeft: '4px solid #991b1b', borderRadius: '8px', padding: '0.75rem 1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>⚠️</span>
            <div>
              <strong style={{ fontSize: '0.82rem', color: '#721c24' }}>Water Quality Alert — {critical} Critical · {poor} Poor sites detected</strong>
              <div style={{ fontSize: '0.73rem', color: '#721c24', marginTop: '0.2rem', lineHeight: 1.6 }}>
                {WATER_MAP_STATIONS.filter(s => s.quality === 'Critical' || s.quality === 'Poor').map(s => s.name).join(', ')}.
                Avoid all contact with water at these locations.
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.25rem', alignItems: 'start' }}>

          <div>
            {/* Summary bar above map */}
            <div style={{ background: 'white', borderRadius: '10px 10px 0 0', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f2f5', boxShadow: '0 1px 4px rgba(26,39,68,0.06)' }}>
              <div>
                <div style={{ fontSize: '0.6rem', color: '#6b7a96', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Maharashtra Water Quality — {WATER_MAP_STATIONS.length} Sites</div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  {[
                    { label: 'Critical', count: WATER_MAP_STATIONS.filter(s=>s.quality==='Critical').length, color: '#991b1b' },
                    { label: 'Poor',     count: WATER_MAP_STATIONS.filter(s=>s.quality==='Poor').length,     color: '#ea580c' },
                    { label: 'Moderate', count: WATER_MAP_STATIONS.filter(s=>s.quality==='Moderate').length, color: '#ca8a04' },
                    { label: 'Good',     count: WATER_MAP_STATIONS.filter(s=>s.quality==='Good').length,     color: '#16a34a' },
                  ].map(q => (
                    <div key={q.label} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: q.color }} />
                      <span style={{ fontSize: '0.68rem', color: q.color, fontWeight: '700' }}>{q.count} {q.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ fontSize: '0.58rem', color: '#94a3b8' }}>Tap a circle for details →</div>
            </div>

            <CitizenPollutionMap
              stations={mapStations}
              center={[19.3, 76.5]}
              zoom={6}
              onSelect={setSelectedId}
              selectedId={selectedId}
              height="440px"
              legendItems={LEGEND}
              domain="water"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {selected && selInfo ? (
              <>
                <LocationDetailsCard
                  name={selected.name}
                  district={selected.district}
                  statusLabel={selected.quality}
                  statusColor={selInfo.color}
                  statusBg={selInfo.bg}
                  lastUpdated={selected.updated}
                  precautions={waterPrecautions(selected.quality)}
                  domain="water"
                  onClose={() => setSelectedId(null)}
                />
                <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 1px 8px rgba(26,39,68,0.08)' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#6b7a96', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.65rem' }}>💧 Water Parameters</div>
                  <PollutionMetrics metrics={selMetrics} accentColor={selInfo.color} />
                  <div style={{ marginTop: '0.65rem', fontSize: '0.62rem', color: '#6b7a96', lineHeight: 1.6 }}>
                    <strong>Water body:</strong> {selected.body}<br />
                    <strong>Trend:</strong> {selected.trend === 'improving' ? '↑ Improving' : selected.trend === 'worsening' ? '↓ Worsening' : '→ Stable'}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 1px 8px rgba(26,39,68,0.08)' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#6b7a96', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.7rem' }}>💧 Quality Scale</div>
                  {[
                    ['Good',     '#16a34a', '#d4edda', 'Safe for recreational use (after treatment)'],
                    ['Moderate', '#ca8a04', '#fef3c7', 'Treat before use · Avoid swimming'],
                    ['Poor',     '#ea580c', '#fde9d9', 'Avoid contact · Not safe for any use'],
                    ['Critical', '#991b1b', '#fdf0ee', 'Hazardous · Stay away from water body'],
                  ].map(([label, color, bg, desc]) => (
                    <div key={label} style={{ background: bg, borderRadius: '5px', padding: '0.45rem 0.6rem', marginBottom: '0.3rem', borderLeft: `3px solid ${color}` }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: '700', color }}>{label}</div>
                      <div style={{ fontSize: '0.62rem', color: '#6b7a96', marginTop: '0.1rem' }}>{desc}</div>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 1px 8px rgba(26,39,68,0.08)', maxHeight: '260px', overflowY: 'auto' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#6b7a96', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>All Water Sites</div>
                  {WATER_MAP_STATIONS.map(s => {
                    const info = qualityInfo(s.quality);
                    return (
                      <button key={s.id} onClick={() => setSelectedId(s.id)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.5rem', borderRadius: '5px', border: '1px solid transparent', background: 'transparent', cursor: 'pointer', marginBottom: '0.2rem', textAlign: 'left' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#f0f2f5'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: info.color, flexShrink: 0 }} />
                        <span style={{ fontSize: '0.7rem', color: '#1a2744', flex: 1 }}>{s.name}</span>
                        <span style={{ fontSize: '0.65rem', fontWeight: '700', color: info.color }}>{s.quality}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '1rem 1.25rem', boxShadow: '0 1px 8px rgba(26,39,68,0.08)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#1a5280', marginBottom: '0.4rem' }}>💡 Safe Water Practices</div>
            <ul style={{ fontSize: '0.73rem', color: '#3d4f6b', paddingLeft: '1.1rem', lineHeight: 1.8, margin: 0 }}>
              <li>Always boil or purify river water before drinking</li>
              <li>Avoid swimming in rivers rated Poor or Critical</li>
              <li>Do not wash food in untreated river water</li>
              <li>Report illegal dumping to MPCB: 1800-233-3535</li>
            </ul>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#1a2744', marginBottom: '0.4rem' }}>📞 Emergency Contacts</div>
            <ul style={{ fontSize: '0.73rem', color: '#3d4f6b', paddingLeft: '1.1rem', lineHeight: 1.8, margin: 0 }}>
              <li>MPCB Helpline: <strong>1800-233-3535</strong> (Toll Free)</li>
              <li>Emergency: <strong>112</strong></li>
              <li>Complaint Portal: sampark.maharashtra.gov.in</li>
            </ul>
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.62rem', color: '#94a3b8', borderTop: '1px solid #dde2ec', paddingTop: '0.75rem' }}>
          © 2026 Maharashtra State Pollution Control Board · PrithviNet · Water Quality Monitoring Network
        </div>
      </div>
    </div>
  );
}
