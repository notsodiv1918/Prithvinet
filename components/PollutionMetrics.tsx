'use client';

export interface Metric {
  label: string;
  value: string | number;
  unit: string;
  limit?: string;
  isBreached?: boolean;
}

interface Props {
  metrics: Metric[];
  accentColor: string;
}

export default function PollutionMetrics({ metrics, accentColor }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.5rem' }}>
      {metrics.map(m => (
        <div key={m.label} style={{
          background: m.isBreached ? '#fdf0ee' : 'white',
          border: `1px solid ${m.isBreached ? '#f5c6cb' : '#dde2ec'}`,
          borderTop: `3px solid ${m.isBreached ? '#c0392b' : accentColor}`,
          borderRadius: '6px',
          padding: '0.6rem 0.75rem',
        }}>
          <div style={{ fontSize: '0.6rem', color: '#6b7a96', fontFamily: 'Arial', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>
            {m.label}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: '800', fontFamily: 'Georgia', color: m.isBreached ? '#c0392b' : '#1a2744', lineHeight: 1 }}>
              {m.value}
            </span>
            <span style={{ fontSize: '0.6rem', color: '#6b7a96', fontFamily: 'Arial' }}>{m.unit}</span>
          </div>
          {m.limit && (
            <div style={{ fontSize: '0.58rem', color: m.isBreached ? '#c0392b' : '#94a3b8', fontFamily: 'Arial', marginTop: '0.15rem', fontWeight: m.isBreached ? '700' : '400' }}>
              {m.isBreached ? '⚠ ' : ''}Limit: {m.limit}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
