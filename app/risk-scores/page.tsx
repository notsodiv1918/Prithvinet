'use client';
import PageShell from '@/components/PageShell';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { RISK_SCORES, RiskScore } from '@/data/newModulesData';

const riskColor = (level: RiskScore['riskLevel']) =>
  level === 'Critical' ? '#c0392b' : level === 'High' ? '#d4680a' : level === 'Medium' ? '#856404' : '#1a6b3a';
const riskBg = (level: RiskScore['riskLevel']) =>
  level === 'Critical' ? '#fdf0ee' : level === 'High' ? '#fef6ee' : level === 'Medium' ? '#fff3cd' : '#d4edda';

function RiskBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  return (
    <div style={{ background: 'var(--border)', borderRadius: '3px', height: '7px', width: '100%' }}>
      <div style={{ height: '100%', width: `${Math.min(100, (value / max) * 100)}%`, background: color, borderRadius: '3px', transition: 'width 0.4s' }} />
    </div>
  );
}

export default function RiskScoresPage() {
  const router = useRouter();
  const { user, mounted } = useAuth({ allowedRoles: ['Super Admin', 'Regional Officer'] });

  if (!mounted || !user) return <PageShell loading />;

  const isRO = user.role === 'Regional Officer';
  const scores = isRO ? RISK_SCORES.filter(r => r.assignedRO === 'Rajesh Kumar') : RISK_SCORES;

  const critical = scores.filter(r => r.riskLevel === 'Critical').length;
  const high     = scores.filter(r => r.riskLevel === 'High').length;

  return (
    <PageShell>
      <div className="breadcrumb">
        <span>🏠 Home</span><span>›</span>
        <a onClick={() => router.push('/dashboard')} style={{ cursor: 'pointer' }}>Dashboard</a>
        <span>›</span>
        <span style={{ color: 'var(--navy)', fontWeight: '700' }}>⚡ Industry Risk Scores</span>
      </div>
      <div className="live-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="live-dot" />
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: critical > 0 ? '#c0392b' : '#22c55e', fontFamily: 'Arial' }}>
            {critical > 0 ? `${critical} CRITICAL` : 'LIVE'}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Arial', marginLeft: '0.35rem' }}>
            Composite risk score = Emission (50%) + Proximity (25%) + Trend (25%)
          </span>
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Arial' }}>Updated: 14 Mar 2026</span>
      </div>

      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
          {[
            { label: 'Industries Tracked', value: scores.length,                                        color: 'var(--accent-blue)'  },
            { label: 'Critical Risk',      value: critical,                                              color: '#c0392b'             },
            { label: 'High Risk',          value: high,                                                  color: '#d4680a'             },
            { label: 'Avg Risk Score',     value: Math.round(scores.reduce((a,r) => a+r.totalRisk,0)/scores.length), color: '#856404' },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ borderTopColor: s.color }}>
              <div style={{ fontSize: '0.63rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.3rem', fontFamily: 'Arial' }}>{s.label}</div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: s.color, lineHeight: 1, fontFamily: 'Georgia' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {!isRO && (
          <div className="alert-info">
            <strong style={{ fontSize: '0.78rem' }}>ℹ Risk Score Methodology</strong>
            <div style={{ fontSize: '0.73rem', color: 'var(--text-mid)', marginTop: '0.2rem', lineHeight: 1.7 }}>
              Emission Score: how far current emissions exceed prescribed limits. &nbsp;|&nbsp;
              Proximity Score: density of nearby population centres. &nbsp;|&nbsp;
              Trend Score: number of recent non-compliant days (7-day window). &nbsp;|&nbsp;
              Higher score = higher inspection priority.
            </div>
          </div>
        )}

        {/* League table */}
        <div className="section-card">
          <div className="section-title">⚡ Industry Risk League Table — Ranked by Composite Score</div>
          <div style={{ overflowX: 'auto' }}>
            <table className="gov-table">
              <thead>
                <tr>
                  <th>#</th><th>Industry</th><th>District</th><th>Risk Level</th>
                  <th>Composite Score</th><th>Emission</th><th>Proximity</th><th>Trend</th>
                  <th>SO₂ ppm</th><th>Compliance %</th><th>RO</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((r, i) => (
                  <tr key={r.industryId}>
                    <td style={{ fontWeight: '800', color: i < 2 ? '#c0392b' : 'var(--text-muted)', fontFamily: 'Georgia' }}>{i + 1}</td>
                    <td style={{ fontWeight: '700' }}>{r.industryName}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{r.district}</td>
                    <td>
                      <span style={{ background: riskBg(r.riskLevel), color: riskColor(r.riskLevel), padding: '2px 10px', borderRadius: '2px', fontSize: '0.68rem', fontWeight: '700', fontFamily: 'Arial', textTransform: 'uppercase' }}>
                        {r.riskLevel}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '110px' }}>
                        <span style={{ fontWeight: '800', color: riskColor(r.riskLevel), fontFamily: 'Georgia', minWidth: '28px' }}>{r.totalRisk}</span>
                        <RiskBar value={r.totalRisk} color={riskColor(r.riskLevel)} />
                      </div>
                    </td>
                    <td><RiskBar value={r.emissionScore}  color="#c0392b" /></td>
                    <td><RiskBar value={r.proximityScore} color="#d4680a" /></td>
                    <td><RiskBar value={r.trendScore}     color="#856404" /></td>
                    <td style={{ color: r.currentSo2 > 80 ? '#c0392b' : 'var(--text-dark)', fontWeight: r.currentSo2 > 80 ? '700' : '400' }}>{r.currentSo2}</td>
                    <td style={{ color: r.complianceRate < 50 ? '#c0392b' : r.complianceRate < 80 ? '#d4680a' : '#1a6b3a', fontWeight: '700', fontFamily: 'Georgia' }}>{r.complianceRate}%</td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.assignedRO}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </PageShell>
  );
}
