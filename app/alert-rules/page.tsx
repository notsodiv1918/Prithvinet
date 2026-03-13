'use client';
import PageShell from '@/components/PageShell';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ALERT_RULES, AUTO_ALERTS, AlertRule, AutoAlert } from '@/data/newModulesData';
import toast, { Toaster } from 'react-hot-toast';

export default function AlertRulesPage() {
  const router   = useRouter();
  const { user, mounted } = useAuth({ allowedRoles: ['Super Admin', 'Regional Officer'] });
  const [rules,  setRules]  = useState<AlertRule[]>(ALERT_RULES);
  const [alerts, setAlerts] = useState<AutoAlert[]>(AUTO_ALERTS);
  const [tab,    setTab]    = useState<'live' | 'rules'>('live');

  if (!mounted || !user) return <PageShell loading />;

  const isRO = user.role === 'Regional Officer';
  const unacked = alerts.filter(a => !a.acknowledged).length;

  const toggleRule = (id: string) => {
    if (isRO) { toast.error('Only Super Admin can modify alert rules.'); return; }
    setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
    toast('Rule updated', { icon: '⚙' });
  };

  const ackAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true, acknowledgedBy: user.name } : a));
    toast('Alert acknowledged', { icon: '✅' });
  };

  const sevColor = (s: AutoAlert['severity'] | AlertRule['severity']) =>
    s === 'critical' ? '#c0392b' : s === 'warning' ? '#d4680a' : '#1a4e8a';
  const sevBg = (s: string) =>
    s === 'critical' ? '#fdf0ee' : s === 'warning' ? '#fef6ee' : '#e8f0f8';
  const domainIcon = (d: string) => d === 'air' ? '💨' : d === 'water' ? '💧' : '🔊';

  return (
    <PageShell>
      <Toaster position="top-right" />
      <div className="breadcrumb">
        <span>🏠 Home</span><span>›</span>
        <a onClick={() => router.push('/dashboard')} style={{ cursor: 'pointer' }}>Dashboard</a>
        <span>›</span>
        <span style={{ color: '#c0392b', fontWeight: '700' }}>⚐ Alert System</span>
      </div>
      <div className="live-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="live-dot" />
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: unacked > 0 ? '#c0392b' : '#22c55e', fontFamily: 'Arial' }}>
            {unacked} UNACKNOWLEDGED
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Arial', marginLeft: '0.35rem' }}>
            · {rules.filter(r => r.active).length} active rules · Auto-fires when limits crossed
          </span>
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Arial' }}>{isRO ? 'View only' : 'Super Admin'}</span>
      </div>

      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
          {[
            { label: 'Active Rules',       value: rules.filter(r=>r.active).length,                                   color: '#1a4e8a'             },
            { label: 'Critical Alerts',    value: alerts.filter(a=>a.severity==='critical'&&!a.acknowledged).length,  color: '#c0392b'             },
            { label: 'Warning Alerts',     value: alerts.filter(a=>a.severity==='warning'&&!a.acknowledged).length,   color: '#d4680a'             },
            { label: 'Acknowledged Today', value: alerts.filter(a=>a.acknowledged).length,                             color: '#1a6b3a'             },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ borderTopColor: s.color }}>
              <div style={{ fontSize: '0.63rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.3rem', fontFamily: 'Arial' }}>{s.label}</div>
              <div style={{ fontSize: '2.2rem', fontWeight: '800', color: s.color, lineHeight: 1, fontFamily: 'Georgia' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid var(--border)' }}>
          {[['live', '⚐ Live Alerts'], ['rules', '⚙ Alert Rules']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key as any)}
              style={{ padding: '0.6rem 1.25rem', fontSize: '0.8rem', fontFamily: 'Arial', fontWeight: tab === key ? '700' : '500', color: tab === key ? 'var(--navy)' : 'var(--text-muted)', background: 'none', border: 'none', borderBottom: tab === key ? '2px solid var(--navy)' : '2px solid transparent', cursor: 'pointer', marginBottom: '-2px' }}>
              {label} {key === 'live' && unacked > 0 && <span style={{ background: '#c0392b', color: 'white', borderRadius: '10px', padding: '1px 6px', fontSize: '0.62rem', marginLeft: '0.3rem' }}>{unacked}</span>}
            </button>
          ))}
        </div>

        {tab === 'live' && (
          <div className="section-card">
            <div className="section-title">⚐ Auto-Fired Alerts — Today</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {alerts.map(a => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', border: `1px solid ${a.acknowledged ? 'var(--border)' : sevColor(a.severity) + '40'}`, borderLeft: `4px solid ${a.acknowledged ? 'var(--border)' : sevColor(a.severity)}`, borderRadius: '4px', background: a.acknowledged ? 'white' : sevBg(a.severity), opacity: a.acknowledged ? 0.65 : 1 }}>
                  <div style={{ fontSize: '1.1rem' }}>{domainIcon(a.domain)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-dark)', fontFamily: 'Georgia' }}>{a.ruleName}</span>
                      <span style={{ background: sevBg(a.severity), color: sevColor(a.severity), padding: '1px 8px', borderRadius: '2px', fontSize: '0.62rem', fontWeight: '700', fontFamily: 'Arial', textTransform: 'uppercase' }}>{a.severity}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'Arial' }}>
                      {a.stationName} · {a.district} · Value: <strong style={{ color: sevColor(a.severity) }}>{a.triggeredValue}{a.unit}</strong> (Threshold: {a.threshold}{a.unit}) · {a.firedAt}
                    </div>
                    {a.acknowledged && <div style={{ fontSize: '0.65rem', color: '#1a6b3a', fontFamily: 'Arial', marginTop: '0.1rem' }}>✓ Acknowledged by {a.acknowledgedBy}</div>}
                  </div>
                  {!a.acknowledged && (
                    <button className="btn-outline" onClick={() => ackAlert(a.id)} style={{ fontSize: '0.7rem', padding: '0.25rem 0.6rem', flexShrink: 0 }}>Acknowledge</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'rules' && (
          <div className="section-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div className="section-title" style={{ marginBottom: 0 }}>⚙ Configured Alert Rules</div>
              {isRO && <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'Arial', background: '#fff3cd', padding: '0.2rem 0.6rem', borderRadius: '3px' }}>⚠ View only — contact Super Admin to modify</span>}
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="gov-table">
                <thead><tr><th>Rule</th><th>Pollutant</th><th>Threshold</th><th>Domain</th><th>Severity</th><th>Notifies</th><th>Status</th>{!isRO && <th>Toggle</th>}</tr></thead>
                <tbody>
                  {rules.map(r => (
                    <tr key={r.id} style={{ opacity: r.active ? 1 : 0.5 }}>
                      <td style={{ fontWeight: '600' }}>{r.name}</td>
                      <td>{r.pollutant}</td>
                      <td style={{ fontWeight: '700', color: sevColor(r.severity), fontFamily: 'Georgia' }}>{r.threshold} {r.unit}</td>
                      <td>{domainIcon(r.domain)} {r.domain}</td>
                      <td><span style={{ background: sevBg(r.severity), color: sevColor(r.severity), padding: '2px 9px', borderRadius: '2px', fontSize: '0.65rem', fontWeight: '700', fontFamily: 'Arial', textTransform: 'uppercase' }}>{r.severity}</span></td>
                      <td style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{r.notifyRoles.join(', ')}</td>
                      <td><span className={r.active ? 'badge-compliant' : 'badge-pending'}>{r.active ? 'Active' : 'Disabled'}</span></td>
                      {!isRO && (
                        <td>
                          <button onClick={() => toggleRule(r.id)}
                            style={{ fontSize: '0.68rem', padding: '0.2rem 0.55rem', background: r.active ? '#fdf0ee' : '#d4edda', color: r.active ? '#c0392b' : '#1a6b3a', border: `1px solid ${r.active ? '#f5c6cb' : '#c8e0d2'}`, borderRadius: '3px', cursor: 'pointer', fontFamily: 'Arial', fontWeight: '600' }}>
                            {r.active ? 'Disable' : 'Enable'}
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
