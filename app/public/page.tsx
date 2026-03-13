'use client';
import { useState } from 'react';
import CitizenPageHeader from '@/components/CitizenPageHeader';
import CitizenPollutionMap, { MapStation } from '@/components/CitizenPollutionMap';
import LocationDetailsCard, { Precaution } from '@/components/LocationDetailsCard';
import PollutionMetrics, { Metric } from '@/components/PollutionMetrics';
import { AIR_STATIONS, airColor, airRadius } from '@/data/citizenMapData';

// ── helpers ──────────────────────────────────────────────────────────────────
function aqiLabel(aqi: number) {
  if (aqi <= 50)  return { label: 'Good',                   bg: '#d4edda', color: '#16a34a' };
  if (aqi <= 100) return { label: 'Moderate',               bg: '#fef3c7', color: '#ca8a04' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive',bg: '#fde9d9', color: '#ea580c' };
  if (aqi <= 200) return { label: 'Unhealthy',              bg: '#fef0e6', color: '#ea580c' };
  if (aqi <= 300) return { label: 'Very Unhealthy',         bg: '#fdf0ee', color: '#c0392b' };
  return               { label: 'Hazardous',                bg: '#f8d7da', color: '#991b1b' };
}

function airPrecautions(status: string): Precaution[] {
  if (status === 'good') return [
    { icon: '✅', text: 'Air quality is good. Enjoy outdoor activities.' },
    { icon: '🌿', text: 'Good time for jogging, cycling or outdoor sports.' },
  ];
  if (status === 'moderate') return [
    { icon: '😷', text: 'Unusually sensitive people should consider reducing prolonged outdoor exertion.' },
    { icon: '🏠', text: 'Keep windows closed during peak traffic hours (7–10 AM, 5–8 PM).' },
    { icon: '🌬', text: 'Watch for symptoms like coughing or throat irritation.' },
  ];
  if (status === 'poor') return [
    { icon: '😷', text: 'Wear an N95 mask when outdoors.' },
    { icon: '🏠', text: 'Keep windows and doors closed. Use air purifiers if available.' },
    { icon: '🧒', text: 'Children, elderly and those with respiratory conditions must stay indoors.' },
    { icon: '🚴', text: 'Avoid prolonged outdoor exercise and heavy physical activity.' },
    { icon: '🏥', text: 'If you feel breathless or develop chest tightness, seek medical attention.' },
  ];
  // hazardous
  return [
    { icon: '🚨', text: 'HEALTH EMERGENCY — Stay indoors. Keep all windows and doors shut.' },
    { icon: '😷', text: 'If you must go outside, wear a properly fitted N95 or N99 respirator.' },
    { icon: '🧒', text: 'Children, elderly and sick must NOT go outside under any circumstances.' },
    { icon: '🏥', text: 'Anyone with breathing difficulties should contact emergency services: 112.' },
    { icon: '📞', text: 'MPCB Helpline: 1800-233-3535 (Toll Free).' },
  ];
}

const LEGEND = [
  { color: '#16a34a', label: 'Good',        description: 'AQI 0 – 50'   },
  { color: '#ca8a04', label: 'Moderate',    description: 'AQI 51 – 100' },
  { color: '#ea580c', label: 'Unhealthy',   description: 'AQI 101 – 200'},
  { color: '#991b1b', label: 'Hazardous',   description: 'AQI 200+'     },
];

export default function PublicAirPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = selectedId ? AIR_STATIONS.find(s => s.id === selectedId) : null;

  // Overall state
  const totalBreaches = AIR_STATIONS.filter(s => s.status === 'poor' || s.status === 'hazardous').length;
  const avgAqi = Math.round(AIR_STATIONS.reduce((a, s) => a + s.aqi, 0) / AIR_STATIONS.length);
  const avgInfo = aqiLabel(avgAqi);

  // Build MapStation[] — shared map contract
  const mapStations: MapStation[] = AIR_STATIONS.map(s => ({
    id:          s.id,
    lat:         s.lat,
    lng:         s.lng,
    color:       airColor(s.status),
    outerColor:  airColor(s.status),
    radius:      airRadius(s.aqi),
    innerRadius: 6000,
    label:       s.name,
    statusLabel: aqiLabel(s.aqi).label,
  }));

  // Selected station detail data
  const selInfo     = selected ? aqiLabel(selected.aqi) : null;
  const selMetrics: Metric[] = selected ? [
    { label: 'AQI',   value: selected.aqi,  unit: '',      limit: '100',  isBreached: selected.aqi > 100 },
    { label: 'PM2.5', value: selected.pm25, unit: 'µg/m³', limit: '60',   isBreached: selected.pm25 > 60 },
    { label: 'PM10',  value: selected.pm10, unit: 'µg/m³', limit: '100',  isBreached: selected.pm10 > 100 },
    { label: 'NO₂',   value: selected.no2,  unit: 'ppb',   limit: '60',   isBreached: selected.no2 > 60 },
    { label: 'SO₂',   value: selected.so2,  unit: 'ppb',   limit: '80',   isBreached: selected.so2 > 80 },
    { label: 'Ozone', value: selected.o3,   unit: 'ppb',   limit: '70',   isBreached: selected.o3 > 70 },
  ] : [];

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', display: 'flex', flexDirection: 'column', fontFamily: 'Arial, sans-serif' }}>
      <CitizenPageHeader activeTab="air" stationCount={AIR_STATIONS.length} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.25rem 1.5rem', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* ── State-wide alert banner ── */}
        {totalBreaches > 0 && (
          <div style={{ background: '#fdf0ee', border: '1px solid #f5c6cb', borderLeft: '4px solid #c0392b', borderRadius: '8px', padding: '0.75rem 1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>⚠️</span>
            <div>
              <strong style={{ fontSize: '0.82rem', color: '#721c24' }}>Health Advisory — Poor Air Quality in {totalBreaches} zone{totalBreaches > 1 ? 's' : ''}</strong>
              <div style={{ fontSize: '0.73rem', color: '#721c24', marginTop: '0.2rem', lineHeight: 1.6 }}>
                {AIR_STATIONS.filter(s => s.status === 'poor' || s.status === 'hazardous').map(s => s.district).join(', ')}.
                Sensitive groups (elderly, children, respiratory conditions) should avoid outdoor activities.
              </div>
            </div>
          </div>
        )}

        {/* ── Two-column layout: map left, info right ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.25rem', alignItems: 'start' }}>

          {/* MAP — primary element */}
          <div>
            {/* State average hero above map */}
            <div style={{ background: 'white', borderRadius: '10px 10px 0 0', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f2f5', boxShadow: '0 1px 4px rgba(26,39,68,0.06)' }}>
              <div>
                <div style={{ fontSize: '0.6rem', color: '#6b7a96', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Maharashtra Average AQI</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ fontSize: '2.4rem', fontWeight: '900', color: avgInfo.color, fontFamily: 'Georgia', lineHeight: 1 }}>{avgAqi}</span>
                  <span style={{ background: avgInfo.bg, color: avgInfo.color, fontSize: '0.72rem', fontWeight: '700', padding: '0.2rem 0.75rem', borderRadius: '20px', border: `1px solid ${avgInfo.color}40` }}>{avgInfo.label}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.62rem', color: '#6b7a96' }}>Based on {AIR_STATIONS.length} stations</div>
                <div style={{ fontSize: '0.58rem', color: '#94a3b8', marginTop: '0.1rem' }}>Tap any circle on map for details →</div>
              </div>
            </div>

            <CitizenPollutionMap
              stations={mapStations}
              center={[19.3, 76.5]}
              zoom={6}
              onSelect={setSelectedId}
              selectedId={selectedId}
              height="440px"
              legendItems={LEGEND}
              domain="air"
            />
          </div>

          {/* RIGHT PANEL — changes when station selected */}
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
                  precautions={airPrecautions(selected.status)}
                  domain="air"
                  onClose={() => setSelectedId(null)}
                />
                <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 1px 8px rgba(26,39,68,0.08)' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#6b7a96', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.65rem' }}>
                    📊 Pollutant Readings
                  </div>
                  <PollutionMetrics metrics={selMetrics} accentColor={selInfo.color} />
                </div>
              </>
            ) : (
              <>
                {/* Default: AQI scale guide */}
                <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 1px 8px rgba(26,39,68,0.08)' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#6b7a96', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.7rem' }}>📊 AQI Scale</div>
                  {[
                    ['0–50',   'Good',          '#16a34a', '#d4edda', 'No health risk'],
                    ['51–100', 'Moderate',      '#ca8a04', '#fef3c7', 'Sensitive groups take care'],
                    ['101–200','Unhealthy',     '#ea580c', '#fde9d9', 'Limit outdoor activity'],
                    ['201–300','Very Unhealthy','#c0392b', '#fdf0ee', 'Avoid all outdoor activity'],
                    ['300+',   'Hazardous',     '#991b1b', '#f8d7da', 'Stay indoors — emergency'],
                  ].map(([range, label, color, bg]) => (
                    <div key={range} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.5rem', borderRadius: '5px', marginBottom: '0.25rem', background: bg }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                      <span style={{ fontSize: '0.7rem', fontWeight: '700', color, minWidth: '50px' }}>{range}</span>
                      <span style={{ fontSize: '0.7rem', color: '#1a2744', fontWeight: '600' }}>{label}</span>
                    </div>
                  ))}
                </div>

                {/* Quick station list */}
                <div style={{ background: 'white', borderRadius: '12px', padding: '1rem', boxShadow: '0 1px 8px rgba(26,39,68,0.08)', maxHeight: '280px', overflowY: 'auto' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#6b7a96', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>All Stations</div>
                  {AIR_STATIONS.map(s => {
                    const info = aqiLabel(s.aqi);
                    return (
                      <button key={s.id} onClick={() => setSelectedId(s.id)}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.5rem', borderRadius: '5px', border: '1px solid transparent', background: 'transparent', cursor: 'pointer', marginBottom: '0.2rem', textAlign: 'left', transition: 'all 0.1s' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#f0f2f5'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: info.color, flexShrink: 0 }} />
                        <span style={{ fontSize: '0.73rem', color: '#1a2744', flex: 1, fontFamily: 'Arial' }}>{s.district}</span>
                        <span style={{ fontSize: '0.78rem', fontWeight: '800', color: info.color, fontFamily: 'Georgia' }}>{s.aqi}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Health advice footer ── */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '1rem 1.25rem', boxShadow: '0 1px 8px rgba(26,39,68,0.08)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#16a34a', marginBottom: '0.4rem' }}>💡 General Protective Actions</div>
            <ul style={{ fontSize: '0.73rem', color: '#3d4f6b', paddingLeft: '1.1rem', lineHeight: 1.8, margin: 0 }}>
              <li>Check AQI before outdoor activities</li>
              <li>Use N95 masks when AQI is above 150</li>
              <li>Keep windows closed during high pollution periods</li>
              <li>Avoid exercising near busy roads or industrial areas</li>
            </ul>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#1a2744', marginBottom: '0.4rem' }}>📞 Emergency Contacts</div>
            <ul style={{ fontSize: '0.73rem', color: '#3d4f6b', paddingLeft: '1.1rem', lineHeight: 1.8, margin: 0 }}>
              <li>MPCB Helpline: <strong>1800-233-3535</strong> (Toll Free)</li>
              <li>Emergency Services: <strong>112</strong></li>
              <li>SPCB: <a href="https://mpcb.gov.in" style={{ color: '#1a5280' }}>mpcb.gov.in</a></li>
            </ul>
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.62rem', color: '#94a3b8', borderTop: '1px solid #dde2ec', paddingTop: '0.75rem' }}>
          © 2026 Maharashtra State Pollution Control Board · PrithviNet · Data from CAAQMS network
        </div>
      </div>
    </div>
  );
}
