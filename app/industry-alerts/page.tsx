'use client';
import IndustrySidebar from '@/components/IndustrySidebar';
import TopBar from '@/components/TopBar';
import { INDUSTRIES, PRESCRIBED_LIMITS } from '@/data/mockData';

const IND = INDUSTRIES[0];

const ALERTS = [
  {
    id: 'ALT001', type: 'AQI Breach', severity: 'breach', timestamp: '2024-07-15 14:25',
    message: 'AQI at Nagpur Butibori MIDC has reached 267 — 167% above prescribed limit of 100.',
    action: 'Inspection may be triggered if sustained for 2+ hours. Check emission controls immediately.',
    resolved: false,
  },
  {
    id: 'ALT002', type: 'SO₂ Exceedance', severity: 'breach', timestamp: '2024-07-15 10:10',
    message: 'SO₂ reading of 156 ppm recorded — 95% above prescribed limit of 80 ppm.',
    action: 'Regional Officer Rajesh Kumar has been notified. Submit corrective action report.',
    resolved: false,
  },
  {
    id: 'ALT003', type: 'Inspection Notice', severity: 'warning', timestamp: '2024-07-14 16:45',
    message: 'Regional Officer has scheduled a site inspection for 17th July 2024 at 10:00 AM.',
    action: 'Ensure all records, equipment logs and emission reports are ready for review.',
    resolved: false,
  },
  {
    id: 'ALT004', type: 'Report Overdue', severity: 'warning', timestamp: '2024-07-13 09:00',
    message: 'Monthly emissions report for June 2024 was submitted 2 days after the deadline.',
    action: 'Future delays may result in a formal notice. Submit reports by the 1st of each month.',
    resolved: true,
  },
  {
    id: 'ALT005', type: 'AQI Spike', severity: 'warning', timestamp: '2024-07-11 07:30',
    message: 'AQI spike to 284 recorded during morning hours — likely linked to blast furnace operation.',
    action: 'Consider staggering blast furnace activity to avoid rush-hour emissions overlap.',
    resolved: true,
  },
  {
    id: 'ALT006', type: 'Compliance Milestone', severity: 'safe', timestamp: '2024-07-12 00:00',
    message: 'All parameters were within prescribed limits on July 12 — first compliant day in 7 days.',
    action: 'Good progress. Continue current emission control practices.',
    resolved: true,
  },
];

export default function IndustryAlerts() {
  const active = ALERTS.filter(a => !a.resolved);
  const resolved = ALERTS.filter(a => a.resolved);

  const severityColor = (s: string) => s === 'breach' ? '#c0392b' : s === 'warning' ? '#d4680a' : '#1a6b3a';
  const severityBg = (s: string) => s === 'breach' ? '#fdf0ee' : s === 'warning' ? '#fef6ee' : '#f0f8f3';
  const severityBorder = (s: string) => s === 'breach' ? '#f5c6cb' : s === 'warning' ? '#ffd966' : '#c8e0d2';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f8f3' }}>
      <IndustrySidebar />
      <main style={{ flex: 1, overflow: 'auto' }}>
        <TopBar title="My Alerts" subtitle="Bharat Steel Works — AQI breach alerts, inspection notices and compliance flags" />
        <div style={{ background: 'white', borderBottom: '1px solid #e8f5ee', padding: '0.5rem 1.5rem' }}>
          <span style={{ fontSize: '0.7rem', color: '#6b8c7a' }}>Home › My Dashboard › </span>
          <span style={{ fontSize: '0.7rem', color: '#1a6b3a', fontWeight: '600' }}>My Alerts</span>
        </div>

        <div style={{ padding: '1.25rem 1.5rem' }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
            {[
              { label: 'Active Alerts', value: active.length, color: '#c0392b' },
              { label: 'Breach Alerts', value: active.filter(a => a.severity === 'breach').length, color: '#c0392b' },
              { label: 'Resolved (7d)', value: resolved.length, color: '#1a6b3a' },
            ].map(s => (
              <div key={s.label} className="stat-card" style={{ borderTopColor: s.color }}>
                <div style={{ fontSize: '0.68rem', color: '#6b8c7a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>{s.label}</div>
                <div style={{ fontSize: '2.2rem', fontWeight: '800', color: s.color, lineHeight: 1 }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Active alerts */}
          <div className="section-card">
            <div className="section-title" style={{ color: '#c0392b', borderBottomColor: '#f8d7da' }}>Active Alerts — Action Required</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {active.map(a => (
                <div key={a.id} style={{ background: severityBg(a.severity), border: `1px solid ${severityBorder(a.severity)}`, borderLeft: `4px solid ${severityColor(a.severity)}`, borderRadius: '4px', padding: '0.85rem 1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                      <span className={a.severity === 'breach' ? 'badge-breach' : 'badge-warning'}>{a.type}</span>
                      <span style={{ fontSize: '0.65rem', color: '#6b8c7a' }}>{a.timestamp}</span>
                    </div>
                    <span style={{ fontSize: '0.62rem', fontFamily: 'monospace', color: '#94a3b8' }}>{a.id}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: severityColor(a.severity), fontWeight: '600', marginBottom: '0.3rem' }}>{a.message}</div>
                  <div style={{ fontSize: '0.75rem', color: '#3d5a48', background: 'rgba(255,255,255,0.6)', padding: '0.4rem 0.6rem', borderRadius: '3px', lineHeight: 1.6 }}>
                    <strong>Recommended Action:</strong> {a.action}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resolved alerts */}
          <div className="section-card">
            <div className="section-title" style={{ color: '#6b8c7a' }}>Resolved / Past Alerts</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {resolved.map(a => (
                <div key={a.id} style={{ background: '#f7fcf9', border: '1px solid #e8f5ee', borderLeft: `4px solid ${severityColor(a.severity)}`, borderRadius: '4px', padding: '0.75rem 1rem', opacity: 0.8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                      <span className={a.severity === 'safe' ? 'badge-safe' : 'badge-warning'}>{a.type}</span>
                      <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{a.timestamp}</span>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: '#1a6b3a', fontWeight: '600', background: '#d4edda', padding: '1px 8px', borderRadius: '8px', border: '1px solid #b8dfc4' }}>Resolved</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#3d5a48' }}>{a.message}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#f7fcf9', border: '1px solid #c8e0d2', borderRadius: '4px', padding: '0.85rem 1rem', fontSize: '0.75rem', color: '#3d5a48', lineHeight: 1.8 }}>
            <strong style={{ color: '#1a6b3a' }}>How alerts work:</strong> Alerts are automatically generated when your facility's AQI or emission readings exceed prescribed limits.
            Breach alerts that persist for more than 2 hours are escalated to your assigned Regional Officer (<strong>Rajesh Kumar, Nagpur</strong>).
            An inspection can be triggered after 3 consecutive breach days. Ensure emission controls are operational at all times.
          </div>

        </div>
      </main>
    </div>
  );
}
