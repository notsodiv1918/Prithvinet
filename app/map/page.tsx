'use client';
import PageShell from '@/components/PageShell';
import { useAuth } from '@/lib/useAuth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { STATIONS, PRESCRIBED_LIMITS } from '@/data/mockData';

export default function MapPage() {
  const router = useRouter();
  const { user, mounted } = useAuth({ allowedRoles:['Super Admin','Regional Officer','Monitoring Team'] });
  const [MapComponents, setMapComponents] = useState<any>(null);
  const [selected, setSelected]           = useState<typeof STATIONS[0] | null>(null);

  useEffect(() => {
    Promise.all([import('react-leaflet'), import('leaflet')]).then(([rl, L]) => {
      (L.default.Icon.Default.prototype as any)._getIconUrl = undefined;
      setMapComponents(rl);
    });
  }, []);

  if (!mounted || !user) return <PageShell loading />;

  const getColor = (status: string) =>
    status === 'breach' ? '#c0392b' : status === 'warning' ? '#d4680a' : '#1a6b3a';

  return (
    <PageShell>
      <div className="breadcrumb">
        <span>🏠 Home</span><span>›</span>
        <a onClick={() => router.push('/dashboard')} style={{ cursor:'pointer' }}>Dashboard</a>
        <span>›</span>
        <span style={{ color:'var(--navy)', fontWeight:'700' }}>◎ Pollution Map</span>
      </div>
      <div className="live-bar">
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <span className="live-dot" />
          <span style={{ fontSize:'0.72rem', fontWeight:'700', color:'#22c55e', fontFamily:'Arial', letterSpacing:'0.05em' }}>LIVE MAP</span>
          <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'Arial', marginLeft:'0.35rem' }}>
            · {STATIONS.length} monitoring stations · Maharashtra
          </span>
        </div>
        <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'Arial' }}>Click any station for details</span>
      </div>

      {/* Map area — full remaining height */}
      <div style={{ flex:1, position:'relative', minHeight:'500px' }}>

        {/* Legend */}
        <div style={{ position:'absolute', top:'1rem', right:'1rem', zIndex:1000, background:'white', border:'1px solid var(--border)', borderRadius:'4px', padding:'0.85rem 1rem', minWidth:'170px', boxShadow:'0 2px 8px rgba(26,39,68,0.12)' }}>
          <div style={{ fontSize:'0.6rem', fontWeight:'700', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.6rem', fontFamily:'Arial' }}>AQI Status</div>
          {[['Safe','#1a6b3a','AQI < 100'],['Warning','#d4680a','AQI 100–200'],['Breach','#c0392b','AQI > 200']].map(([l,c,r]) => (
            <div key={l} style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.45rem' }}>
              <div style={{ width:'13px', height:'13px', borderRadius:'50%', background:c, flexShrink:0 }} />
              <span style={{ fontSize:'0.75rem', color:'var(--text-dark)', flex:1, fontFamily:'Arial' }}>{l}</span>
              <span style={{ fontSize:'0.65rem', color:'var(--text-muted)', fontFamily:'Arial' }}>{r}</span>
            </div>
          ))}
        </div>

        {/* Station detail panel */}
        {selected && (
          <div style={{ position:'absolute', top:'1rem', left:'1rem', zIndex:1000, background:'white', border:`2px solid ${getColor(selected.status)}`, borderRadius:'4px', padding:'1rem', minWidth:'240px', maxWidth:'270px', boxShadow:'0 2px 12px rgba(26,39,68,0.15)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.75rem' }}>
              <div>
                <div style={{ fontSize:'0.85rem', fontWeight:'700', color:'var(--navy)', fontFamily:'Georgia' }}>{selected.name}</div>
                <div style={{ fontSize:'0.65rem', color:'var(--text-muted)', fontFamily:'Arial', marginTop:'0.1rem' }}>{selected.id} · {selected.district}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:'1.1rem', lineHeight:1 }}>×</button>
            </div>
            <span className={`badge-${selected.status}`}>{selected.status.toUpperCase()}</span>
            <div style={{ marginTop:'0.85rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem' }}>
              {[
                ['AQI',selected.aqi,PRESCRIBED_LIMITS.aqi],['SO₂ ppm',selected.so2,PRESCRIBED_LIMITS.so2],
                ['NO₂ ppm',selected.no2,PRESCRIBED_LIMITS.no2],['PM2.5',selected.pm25,PRESCRIBED_LIMITS.pm25],
                ['Noise dB',selected.noise,PRESCRIBED_LIMITS.noiseDay],['Type',selected.type,null],
              ].map(([k,v,lim]) => (
                <div key={String(k)} style={{ background:'var(--light-gray)', borderRadius:'3px', padding:'0.45rem 0.5rem', border:'1px solid var(--border)' }}>
                  <div style={{ fontSize:'0.6rem', color:'var(--text-muted)', marginBottom:'0.1rem', fontFamily:'Arial' }}>{k}</div>
                  <div style={{ fontSize:'0.88rem', fontWeight:'700', fontFamily:'Georgia', color:lim!==null&&Number(v)>Number(lim)?'var(--danger)':'var(--navy)' }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize:'0.62rem', color:'var(--text-muted)', marginTop:'0.6rem', fontFamily:'Arial' }}>Updated: {selected.lastUpdated}</div>
          </div>
        )}

        {MapComponents ? (
          <MapComponents.MapContainer center={[19.4,75.7]} zoom={7} style={{ height:'100%', width:'100%', minHeight:'500px' }}>
            <MapComponents.TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution="&copy; CartoDB" />
            {STATIONS.map(station => (
              <MapComponents.CircleMarker key={station.id} center={[station.lat,station.lng]}
                radius={station.status==='breach'?17:station.status==='warning'?13:10}
                pathOptions={{ fillColor:getColor(station.status), color:getColor(station.status), fillOpacity:0.75, weight:2 }}
                eventHandlers={{ click:()=>setSelected(station) }}>
                <MapComponents.Tooltip permanent={false} direction="top">
                  <div style={{ fontSize:'0.78rem', fontWeight:'700', fontFamily:'Arial' }}>{station.name}</div>
                  <div style={{ fontSize:'0.7rem', fontFamily:'Arial' }}>AQI: {station.aqi} · SO₂: {station.so2} ppm</div>
                </MapComponents.Tooltip>
              </MapComponents.CircleMarker>
            ))}
          </MapComponents.MapContainer>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'400px', gap:'1rem' }}>
            <div style={{ fontSize:'2rem' }}>🗺</div>
            <div style={{ fontSize:'0.85rem', color:'var(--text-muted)', fontFamily:'Arial' }}>Loading interactive map…</div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
