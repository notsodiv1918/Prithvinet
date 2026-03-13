'use client';

export interface Precaution {
  icon: string;
  text: string;
}

export interface LocationCardProps {
  name: string;
  district: string;
  statusLabel: string;
  statusColor: string;
  statusBg: string;
  lastUpdated: string;
  precautions: Precaution[];
  domain: 'air' | 'water' | 'noise';
  onClose: () => void;
}

export default function LocationDetailsCard({
  name, district, statusLabel, statusColor, statusBg,
  lastUpdated, precautions, domain, onClose,
}: LocationCardProps) {
  const domainIcon = domain === 'air' ? '💨' : domain === 'water' ? '💧' : '🔊';

  return (
    <div style={{
      background: 'white',
      border: `2px solid ${statusColor}`,
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(26,39,68,0.12)',
    }}>
      {/* Header strip */}
      <div style={{ background: statusColor, padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Arial', marginBottom: '0.15rem' }}>
            {domainIcon} Selected Location
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'white', fontFamily: 'Georgia', lineHeight: 1.2 }}>{name}</div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.85)', fontFamily: 'Arial', marginTop: '0.15rem' }}>📍 {district}</div>
        </div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.25)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', color: 'white', fontSize: '1rem', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          ×
        </button>
      </div>

      {/* Status badge row */}
      <div style={{ padding: '0.65rem 1rem', borderBottom: '1px solid #f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: statusBg, border: `1px solid ${statusColor}40`, borderRadius: '20px', padding: '0.25rem 0.75rem' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: statusColor, animation: 'pulse-dot 2s infinite' }} />
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: statusColor, fontFamily: 'Arial', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {statusLabel}
          </span>
        </div>
        <span style={{ fontSize: '0.62rem', color: '#94a3b8', fontFamily: 'Arial' }}>Updated: {lastUpdated}</span>
      </div>

      {/* Precautions */}
      {precautions.length > 0 && (
        <div style={{ padding: '0.75rem 1rem' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#6b7a96', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Arial', marginBottom: '0.5rem' }}>
            ⚠ Recommended Precautions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {precautions.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.75rem', color: '#3d4f6b', fontFamily: 'Arial', lineHeight: 1.5 }}>
                <span style={{ flexShrink: 0 }}>{p.icon}</span>
                <span>{p.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse-dot { 0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(0,0,0,0.2)} 50%{opacity:.8;box-shadow:0 0 0 4px rgba(0,0,0,0)} }
      `}</style>
    </div>
  );
}
