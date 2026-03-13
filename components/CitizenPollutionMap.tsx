'use client';
import { useEffect, useState } from 'react';

export interface MapStation {
  id: string;
  lat: number;
  lng: number;
  color: string;       // hex fill colour
  outerColor: string;  // slightly transparent outer ring colour
  radius: number;      // metres for outer halo
  innerRadius: number; // metres for solid core
  label: string;       // tooltip title
  statusLabel: string; // e.g. "Hazardous" / "Poor" / "Breach"
}

interface Props {
  stations: MapStation[];
  center: [number, number];
  zoom?: number;
  onSelect: (id: string) => void;
  selectedId: string | null;
  height?: string;
  legendItems: { color: string; label: string; description: string }[];
  domain: 'air' | 'water' | 'noise';
}

export default function CitizenPollutionMap({
  stations, center, zoom = 7, onSelect, selectedId, height = '480px', legendItems, domain,
}: Props) {
  const [MC, setMC] = useState<any>(null); // MapComponents

  useEffect(() => {
    Promise.all([import('react-leaflet'), import('leaflet')]).then(([rl, L]) => {
      (L.default.Icon.Default.prototype as any)._getIconUrl = undefined;
      setMC(rl);
    });
  }, []);

  const domainLabel = domain === 'air' ? 'Air Quality' : domain === 'water' ? 'Water Quality' : 'Noise Level';

  if (!MC) {
    return (
      <div style={{ height, background: '#e8f0f5', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
        <div style={{ textAlign: 'center', color: '#6b7a96', fontFamily: 'Arial' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🗺</div>
          <div style={{ fontSize: '0.85rem' }}>Loading {domainLabel} Map…</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(26,39,68,0.15)' }}>
      <MC.MapContainer
        center={center} zoom={zoom}
        style={{ height, width: '100%' }}
        zoomControl={true}
      >
        {/* Clean light base map — uncluttered for citizens */}
        <MC.TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          attribution="&copy; CartoDB &copy; OpenStreetMap"
          opacity={0.9}
        />
        {/* Subtle label layer on top */}
        <MC.TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
          attribution=""
          opacity={0.7}
          zIndex={2}
        />

        {stations.map(s => {
          const isSelected = s.id === selectedId;
          return (
            <MC.LayerGroup key={s.id}>
              {/* Outer halo — creates the heatmap-style bloom */}
              <MC.Circle
                center={[s.lat, s.lng]}
                radius={s.radius}
                pathOptions={{
                  fillColor: s.color,
                  fillOpacity: isSelected ? 0.22 : 0.13,
                  color: s.color,
                  weight: 0,
                }}
                eventHandlers={{ click: () => onSelect(s.id) }}
              />
              {/* Mid ring */}
              <MC.Circle
                center={[s.lat, s.lng]}
                radius={s.radius * 0.55}
                pathOptions={{
                  fillColor: s.color,
                  fillOpacity: isSelected ? 0.34 : 0.22,
                  color: s.color,
                  weight: 0,
                }}
                eventHandlers={{ click: () => onSelect(s.id) }}
              />
              {/* Solid core dot */}
              <MC.CircleMarker
                center={[s.lat, s.lng]}
                radius={isSelected ? 11 : 8}
                pathOptions={{
                  fillColor: s.color,
                  fillOpacity: 1,
                  color: 'white',
                  weight: isSelected ? 3 : 2,
                }}
                eventHandlers={{ click: () => onSelect(s.id) }}
              >
                <MC.Tooltip direction="top" offset={[0, -10]} permanent={false}>
                  <div style={{ fontSize: '0.78rem', fontWeight: '700', fontFamily: 'Arial', color: '#1a2744', minWidth: '120px' }}>
                    {s.label}
                    <div style={{ fontSize: '0.68rem', fontWeight: '600', color: s.color, marginTop: '2px' }}>{s.statusLabel}</div>
                  </div>
                </MC.Tooltip>
              </MC.CircleMarker>
            </MC.LayerGroup>
          );
        })}
      </MC.MapContainer>

      {/* Legend — overlaid top-right */}
      <div style={{
        position: 'absolute', top: '12px', right: '12px', zIndex: 1000,
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(4px)',
        border: '1px solid #dde2ec', borderRadius: '8px',
        padding: '0.75rem 1rem', minWidth: '155px',
        boxShadow: '0 2px 12px rgba(26,39,68,0.15)',
      }}>
        <div style={{ fontSize: '0.6rem', fontWeight: '800', color: '#6b7a96', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', fontFamily: 'Arial' }}>
          {domainLabel}
        </div>
        {legendItems.map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: item.color, flexShrink: 0, boxShadow: `0 0 6px ${item.color}60` }} />
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#1a2744', fontFamily: 'Arial', lineHeight: 1.1 }}>{item.label}</div>
              <div style={{ fontSize: '0.6rem', color: '#6b7a96', fontFamily: 'Arial' }}>{item.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* "Click a hotspot" hint — bottom left */}
      <div style={{
        position: 'absolute', bottom: '12px', left: '12px', zIndex: 1000,
        background: 'rgba(26,39,68,0.82)', backdropFilter: 'blur(4px)',
        color: 'white', fontFamily: 'Arial', fontSize: '0.65rem',
        padding: '0.35rem 0.65rem', borderRadius: '20px',
      }}>
        👆 Tap any hotspot for details
      </div>
    </div>
  );
}
