'use client';
import { useState } from 'react';
import CitizenPageHeader from '@/components/CitizenPageHeader';
import CitizenPollutionMap, { MapStation } from '@/components/CitizenPollutionMap';
import LocationDetailsCard, { Precaution } from '@/components/LocationDetailsCard';
import PollutionMetrics, { Metric } from '@/components/PollutionMetrics';
import { NOISE_MAP_STATIONS, noiseColor, noiseRadius } from '@/data/citizenMapData';

// ── helpers ──────────────────────────────────────────────────────────────────
function noiseInfo(status: string) {
  if (status === 'safe')    return { color: '#16a34a', bg: '#d4edda', label: 'Within Limit'  };
  if (status === 'warning') return { color: '#ca8a04', bg: '#fef3c7', label: 'Near Limit'    };
  return                           { color: '#991b1b', bg: '#fdf0ee', label: 'Limit Exceeded' };
}

function noisePrecautions(status: string, zone: string): Precaution[] {
  if (status === 'safe') return [
    { icon: '✅', text: `Noise levels are within safe limits for this ${zone} zone.` },
    { icon: '😴', text: 'Night-time levels suitable for uninterrupted sleep.' },
  ];
  if (status === 'warning') return [
    { icon: '👂', text: 'Noise is near the prescribed limit. Prolonged exposure may cause discomfort.' },
    { icon: '😴', text: 'Use earplugs or white noise if you have trouble sleeping.' },
    { icon: '🪟', text: 'Keep windows closed at night to reduce noise exposure.' },
  ];
  // breach
  return [
    { icon: '🚨', text: 'Noise levels exceed legal limits. Health risk with prolonged exposure.' },
    { icon: '👂', text: 'Use hearing protection (ear defenders or earplugs) in this area.' },
    { icon: '🧒', text: 'Children and infants should be kept away from this noise source.' },
    { icon: '😴', text: 'Elevated noise disrupts sleep — use sound-dampening curtains or earplugs.' },
    { icon: '📞', text: 'File a noise complaint: MPCB 1800-233-3535 or Police 100.' },
  ];
}

const LEGEND = [
  { color: '#16a34a', label: 'Within Limit', description: 'Safe noise level'     },
  { color: '#ca8a04', label: 'Near Limit',   description: 'Within 5 dB of limit' },
  { color: '#991b1b', label: 'Exceeds Limit',description: 'Above legal limit'    },
];

const ZONE_LIMITS = { Industrial: [75, 70], Commercial: [65, 55], Residential: [55, 45], Silence: [50, 40] };

export default function PublicNoisePage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = selectedId ? NOISE_MAP_STATIONS.find(s => s.id === selectedId) : null;

  const breachCount  = NOISE_MAP_STATIONS.filter(s => s.status === 'breach').length;
  const warningCount = NOISE_MAP_STATIONS.filter(s => s.status === 'warning').length;
  const avgDay = Math.round(NOISE_MAP_STATIONS.reduce((a, s) => a + s.dayLevel, 0) / NOISE_MAP_STATIONS.length);

  const mapStations: MapStation[] = NOISE_MAP_STATIONS.map(s => ({
    id:          s.id,
    lat:         s.lat,
    lng:         s.lng,
    color:       noiseColor(s.status),
    outerColor:  noiseColor(s.status),
    radius:      noiseRadius(s.dayLevel, s.dayLimit),
    innerRadius: 5000,
    label:       s.name,
    statusLabel: noiseInfo(s.status).label,
  }));

  const selInfo = selected ? noiseInfo(selected.status) : null;
  const excess  = selected ? selected.dayLevel - selected.dayLimit : 0;
  const selMetrics: Metric[] = selected ? [
    { label: 'Day Level',   value: selected.dayLevel,   unit: 'dB(A)', limit: `${selected.dayLimit}`,  isBreached: selected.dayLevel > selected.dayLimit },
    { label: 'Day Limit',   value: selected.dayLimit,   unit: 'dB(A)', limit: '',                      isBreached: false },
    { label: 'Night Level', value: selected.nightLevel, unit: 'dB(A)', limit: `${selected.nightLimit}`,isBreached: selected.nightLevel > selected.nightLimit },
    { label: 'Night Limit', value: selected.nightLimit, unit: 'dB(A)', limit: '',                      isBreached: false },
    { label: 'Zone Type',   value: selected.zone,       unit: '',      limit: '',                      isBreached: false },
    { label: 'Excess',      value: Math.max(0, excess), unit: 'dB(A)', limit: '0',                     isBreached: excess > 0 },
  ] : [];

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', display: 'flex', flexDirection: 'column', fontFamily: 'Arial, sans-serif' }}>
      <CitizenPageHeader activeTab="noise" stationCount={NOISE_MAP_STATIONS.length} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.25rem 1.5rem', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {breachCount > 0 && (
          <div style={{ background: '#fdf0ee', border: '1px solid #f5c6cb', borderLeft: '4px solid #991b1b', borderRadius: '8px', padding: '0.75rem 1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>🔊</span>
            <div>
              <strong style={{ fontSize: '0.82rem', color: '#721c24' }}>Noise Alert — {breachCount} zone{breachCount > 1 ? 's' : ''} exceeding legal limits</strong>
              <div style={{ fontSize: '0.73rem', color: '#721c24', marginTop: '0.2rem', lineHeight: 1.6 }}>
                {NOISE_MAP_STATIONS.filter(s => s.status === 'breach').map(s => s.name).join(' · ')}. Avoid prolonged exposure.
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.25rem', alignItems: 'start' }}>

          <div>
            <div style={{ background: 'white', borderRadius: '10px 10px 0 0', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f2f5', boxShadow: '0 1px 4px rgba(26,39,68,0.06)' }}>
              <div>
                <div style={{ fontSize: '0.6rem', color: '#6b7a96', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Maharashtra Noise Monitoring — {NOISE_MAP_STATIONS.length} Zones</div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: '900', color: avgDay > 70 ? '#991b1b' : '#ca8a04', fontFamily: 'Georgia' }}>{avgDay}</span>
                    <span style={{ fontSize: '0.68rem', color: '#6b7a96' }}>dB(A) avg</span>
                  </div>
                  {[
                    { label: 'Breach',  count: breachCount,  color: '#991b1b' },
                    { label: 'Warning', count: warningCount, color: '#ca8a04' },
                    { label: 'Safe',    count: NOISE_MAP_STATIONS.filter(s=>s.status==='safe').length, color: '#16a34a' },
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
              domain="noise"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {selected && selInfo ? (
              <>
                <LocationDetailsCard
                  name={selected.name}
                  district={selected.district}
                  statusLabel={selInfo.label}
                  statusColor={selInfo.color}
                  statusBg={selInfo.bg}
                  lastUpdated={selected.updated}
                  precautions={noisePrecautions(selected.status, selected.zone)}
                  domain="noise"
                  onClose={() => setSelectedId(null)}
                />
                <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 1px 8px rgba(26,39,68,0.08)' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#6b7a96', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.65rem' }}>🔊 Noise Readings</div>
                  <PollutionMetrics metrics={selMetrics} accentColor={selInfo.color} />
                  <div style={{ marginTop: '0.65rem', fontSize: '0.62rem', color: '#6b7a96' }}>
                    Primary source: {selected.primarySource}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 1px 8px rgba(26,39,68,0.08)' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#6b7a96', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.7rem' }}>🔊 Zone Limits (dB(A))</div>
                  {(Object.entries(ZONE_LIMITS) as [string, number[]][]).map(([zone, [day, night]]) => {
                    const icon = zone === 'Industrial' ? '🏭' : zone === 'Commercial' ? '🏢' : zone === 'Residential' ? '🏘' : '🌿';
                    return (
                      <div key={zone} style={{ background: '#f8f9fa', borderRadius: '6px', padding: '0.5rem 0.65rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontSize: '0.72rem', color: '#1a2744', fontWeight: '600' }}>{icon} {zone}</div>
                        <div style={{ fontSize: '0.65rem', color: '#6b7a96', textAlign: 'right' }}>
                          Day: <strong style={{ color: '#1a2744' }}>{day}</strong> · Night: <strong style={{ color: '#1a2744' }}>{night}</strong>
                        </div>
                      </div>
                    );
                  })}
                  <div style={{ fontSize: '0.58rem', color: '#94a3b8', marginTop: '0.4rem' }}>
                    Noise Pollution (Regulation &amp; Control) Rules, 2000
                  </div>
                </div>

                <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 1px 8px rgba(26,39,68,0.08)', maxHeight: '260px', overflowY: 'auto' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#6b7a96', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>All Monitoring Zones</div>
                  {NOISE_MAP_STATIONS.map(s => {
                    const info = noiseInfo(s.status);
                    return (
                      <button key={s.id} onClick={() => setSelectedId(s.id)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.5rem', borderRadius: '5px', border: '1px solid transparent', background: 'transparent', cursor: 'pointer', marginBottom: '0.2rem', textAlign: 'left' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#f0f2f5'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: info.color, flexShrink: 0 }} />
                        <span style={{ fontSize: '0.7rem', color: '#1a2744', flex: 1 }}>{s.name}</span>
                        <span style={{ fontSize: '0.72rem', fontWeight: '800', color: info.color, fontFamily: 'Georgia' }}>{s.dayLevel}</span>
                        <span style={{ fontSize: '0.58rem', color: '#94a3b8' }}>dB</span>
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
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#5a3500', marginBottom: '0.4rem' }}>💡 Protecting Yourself from Noise</div>
            <ul style={{ fontSize: '0.73rem', color: '#3d4f6b', paddingLeft: '1.1rem', lineHeight: 1.8, margin: 0 }}>
              <li>Prolonged exposure above 85 dB(A) can cause permanent hearing loss</li>
              <li>Use earplugs or noise-cancelling headphones in loud areas</li>
              <li>Plant trees around your home — they act as natural noise barriers</li>
              <li>Report noisy construction or industry to your local authority</li>
            </ul>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#1a2744', marginBottom: '0.4rem' }}>📞 File a Noise Complaint</div>
            <ul style={{ fontSize: '0.73rem', color: '#3d4f6b', paddingLeft: '1.1rem', lineHeight: 1.8, margin: 0 }}>
              <li>MPCB Helpline: <strong>1800-233-3535</strong> (Toll Free)</li>
              <li>Police Control Room: <strong>100</strong></li>
              <li>Sampark: sampark.maharashtra.gov.in</li>
              <li>Email: helpdesk@mpcb.gov.in</li>
            </ul>
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.62rem', color: '#94a3b8', borderTop: '1px solid #dde2ec', paddingTop: '0.75rem' }}>
          © 2026 Maharashtra State Pollution Control Board · PrithviNet · Noise Pollution Monitoring Network
        </div>
      </div>
    </div>
  );
}
