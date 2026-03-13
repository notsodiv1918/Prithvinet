'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { STATIONS, PRESCRIBED_LIMITS } from '@/data/mockData';

export default function MapPage() {
  const [MapComponents, setMapComponents] = useState<any>(null);
  const [selected, setSelected] = useState<typeof STATIONS[0] | null>(null);

  useEffect(() => {
    Promise.all([import('react-leaflet'), import('leaflet')]).then(([rl, L]) => {
      (L.default.Icon.Default.prototype as any)._getIconUrl = undefined;
      setMapComponents(rl);
    });
  }, []);

  const getColor = (status: string) => status==='breach'?'#c0392b':status==='warning'?'#d4680a':'#1a6b3a';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f8f3' }}>
      <Sidebar />
      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <TopBar title="Pollution Map" subtitle="Geo-spatial environmental monitoring — Maharashtra" />
        <div style={{ background: 'white', borderBottom: '1px solid #e8f5ee', padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', color: '#6b8c7a' }}>Home</span>
          <span style={{ fontSize: '0.7rem', color: '#c8e0d2' }}>›</span>
          <span style={{ fontSize: '0.7rem', color: '#1a6b3a', fontWeight: '600' }}>Pollution Map</span>
        </div>
        <div style={{ flex: 1, position: 'relative' }}>

          {/* Legend */}
          <div style={{ position:'absolute', top:'1rem', right:'1rem', zIndex:1000, background:'white', border:'1px solid #c8e0d2', borderTop:'3px solid #1a6b3a', borderRadius:'4px', padding:'0.75rem', minWidth:'170px', boxShadow:'0 2px 8px rgba(26,107,58,0.12)' }}>
            <div style={{ fontSize:'0.68rem', fontWeight:'700', color:'#1a6b3a', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.6rem' }}>AQI Status Legend</div>
            {[['Safe (AQI < 100)','#1a6b3a'],['Warning (100–200)','#d4680a'],['Breach (> 200)','#c0392b']].map(([l,c])=>(
              <div key={l} style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.4rem' }}>
                <div style={{ width:'12px', height:'12px', borderRadius:'50%', background:c, border:`2px solid ${c}` }} />
                <span style={{ fontSize:'0.75rem', color:'#3d5a48' }}>{l}</span>
              </div>
            ))}
            <div style={{ borderTop:'1px solid #e8f5ee', marginTop:'0.5rem', paddingTop:'0.5rem', fontSize:'0.65rem', color:'#6b8c7a' }}>
              {STATIONS.filter(s=>s.status==='breach').length} breach · {STATIONS.filter(s=>s.status==='warning').length} warning · {STATIONS.filter(s=>s.status==='safe').length} safe
            </div>
          </div>

          {/* Selected station panel */}
          {selected && (
            <div style={{ position:'absolute', top:'1rem', left:'1rem', zIndex:1000, background:'white', border:`2px solid ${getColor(selected.status)}`, borderRadius:'4px', padding:'1rem', minWidth:'230px', boxShadow:'0 2px 10px rgba(26,107,58,0.15)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.6rem' }}>
                <div>
                  <div style={{ fontSize:'0.82rem', fontWeight:'700', color:'#1a2e22' }}>{selected.name}</div>
                  <div style={{ fontSize:'0.68rem', color:'#6b8c7a' }}>{selected.id} · {selected.district}</div>
                </div>
                <button onClick={()=>setSelected(null)} style={{ background:'none', border:'none', color:'#6b8c7a', cursor:'pointer', fontSize:'1.1rem', lineHeight:1 }}>×</button>
              </div>
              <span className={`badge-${selected.status}`}>{selected.status}</span>
              <div style={{ marginTop:'0.75rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.4rem' }}>
                {[
                  ['AQI', selected.aqi, PRESCRIBED_LIMITS.aqi],
                  ['SO₂ ppm', selected.so2, PRESCRIBED_LIMITS.so2],
                  ['NO₂ ppm', selected.no2, PRESCRIBED_LIMITS.no2],
                  ['PM2.5', selected.pm25, PRESCRIBED_LIMITS.pm25],
                  ['Noise dB', selected.noise, PRESCRIBED_LIMITS.noiseDay],
                  ['Type', selected.type, null],
                ].map(([k, v, lim]) => (
                  <div key={String(k)} style={{ background:'#f7fcf9', border:'1px solid #e8f5ee', borderRadius:'3px', padding:'0.4rem' }}>
                    <div style={{ fontSize:'0.6rem', color:'#6b8c7a', marginBottom:'0.1rem' }}>{k}</div>
                    <div style={{ fontSize:'0.88rem', fontWeight:'700', color: lim!==null&&Number(v)>Number(lim)?'#c0392b':'#1a6b3a' }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:'0.62rem', color:'#6b8c7a', marginTop:'0.5rem' }}>Updated: {selected.lastUpdated}</div>
            </div>
          )}

          {MapComponents ? (
            <MapComponents.MapContainer center={[19.4,75.7]} zoom={7} style={{ height:'calc(100vh - 110px)', width:'100%' }}>
              <MapComponents.TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              {STATIONS.map(station => (
                <MapComponents.CircleMarker
                  key={station.id}
                  center={[station.lat, station.lng]}
                  radius={station.status==='breach'?16:station.status==='warning'?13:10}
                  pathOptions={{ fillColor:getColor(station.status), color:getColor(station.status), fillOpacity:0.75, weight:2 }}
                  eventHandlers={{ click:()=>setSelected(station) }}
                >
                  <MapComponents.Tooltip direction="top">
                    <div style={{ fontSize:'0.75rem', fontWeight:'600', color:'#1a2e22' }}>{station.name}</div>
                    <div style={{ fontSize:'0.7rem', color:'#3d5a48' }}>AQI: {station.aqi} · SO₂: {station.so2} ppm</div>
                  </MapComponents.Tooltip>
                </MapComponents.CircleMarker>
              ))}
            </MapComponents.MapContainer>
          ) : (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', color:'#6b8c7a', fontSize:'0.9rem' }}>
              Loading map...
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
