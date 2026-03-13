'use client';
import PageShell from '@/components/PageShell';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ESCALATION_CASES, EscalationCase } from '@/data/newModulesData';
import toast, { Toaster } from 'react-hot-toast';

const levelColor = (l: EscalationCase['level']) =>
  l === 'Closure Recommended' ? '#7b1a1a' : l === 'Show Cause' ? '#c0392b' : l === 'Notice' ? '#d4680a' : '#856404';
const statusColor = (s: EscalationCase['status']) =>
  s === 'Resolved' ? '#1a6b3a' : s === 'Escalated' ? '#c0392b' : s === 'In Progress' ? '#1a4e8a' : s === 'Acknowledged' ? '#856404' : '#c0392b';

export default function EscalationsPage() {
  const router = useRouter();
  const { user, mounted } = useAuth({ allowedRoles: ['Super Admin', 'Regional Officer'] });
  const [cases, setCases]           = useState<EscalationCase[]>(ESCALATION_CASES);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [note, setNote]             = useState('');

  if (!mounted || !user) return <PageShell loading />;

  const isRO  = user.role === 'Regional Officer';
  const shown = isRO ? cases.filter(c => c.assignedRO === 'Rajesh Kumar') : cases;
  const open  = shown.filter(c => c.status === 'Open').length;
  const escalatedToAdmin = shown.filter(c => c.escalatedToAdmin).length;

  const acknowledge = (id: string) => {
    setCases(prev => prev.map(c => c.id === id
      ? { ...c, status: 'Acknowledged' as const, acknowledgedAt: new Date().toLocaleString('en-IN') }
      : c));
    toast('Case acknowledged', { icon: '✅' });
    setSelectedId(null);
  };

  const markInProgress = (id: string) => {
    if (!note.trim()) { toast.error('Please add an action note first.'); return; }
    setCases(prev => prev.map(c => c.id === id
      ? { ...c, status: 'In Progress' as const, actionNote: note }
      : c));
    toast.success('Status updated to In Progress');
    setNote(''); setSelectedId(null);
  };

  const escalateToAdmin = (id: string) => {
    setCases(prev => prev.map(c => c.id === id
      ? { ...c, status: 'Escalated' as const, escalatedToAdmin: true }
      : c));
    toast.error('Case escalated to Super Admin', { icon: '🚨' });
    setSelectedId(null);
  };

  const resolve = (id: string) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, status: 'Resolved' as const } : c));
    toast.success('Case marked as Resolved');
    setSelectedId(null);
  };

  const sel = cases.find(c => c.id === selectedId);

  return (
    <PageShell>
      <Toaster position="top-right" />
      <div className="breadcrumb">
        <span>🏠 Home</span><span>›</span>
        <a onClick={() => router.push('/dashboard')} style={{ cursor: 'pointer' }}>Dashboard</a>
        <span>›</span>
        <span style={{ color: '#c0392b', fontWeight: '700' }}>📋 Escalation Workflow</span>
      </div>
      <div className="live-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="live-dot" />
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: open > 0 ? '#c0392b' : '#22c55e', fontFamily: 'Arial' }}>
            {open} OPEN CASE{open !== 1 ? 'S' : ''}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Arial', marginLeft: '0.35rem' }}>
            · {escalatedToAdmin} escalated to Super Admin · Warning → Notice → Show Cause → Closure
          </span>
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Arial' }}>
          {isRO ? 'Nagpur Zone' : 'All Zones'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', padding: '1.25rem 1.5rem' }}>

        {/* Cases list */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
            {[
              { label: 'Open',        value: shown.filter(c=>c.status==='Open').length,        color: '#c0392b' },
              { label: 'In Progress', value: shown.filter(c=>c.status==='In Progress').length, color: '#1a4e8a' },
              { label: 'Escalated',   value: shown.filter(c=>c.escalatedToAdmin).length,       color: '#d4680a' },
              { label: 'Resolved',    value: shown.filter(c=>c.status==='Resolved').length,    color: '#1a6b3a' },
            ].map(s => (
              <div key={s.label} className="stat-card" style={{ borderTopColor: s.color }}>
                <div style={{ fontSize: '0.63rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.3rem', fontFamily: 'Arial' }}>{s.label}</div>
                <div style={{ fontSize: '2.2rem', fontWeight: '800', color: s.color, lineHeight: 1, fontFamily: 'Georgia' }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div className="section-card">
            <div className="section-title">📋 All Escalation Cases</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {shown.map(c => (
                <div key={c.id}
                  onClick={() => setSelectedId(selectedId === c.id ? null : c.id)}
                  style={{ border: `1px solid ${selectedId === c.id ? levelColor(c.level) : 'var(--border)'}`, borderLeft: `5px solid ${levelColor(c.level)}`, borderRadius: '4px', padding: '0.85rem 1rem', cursor: 'pointer', background: selectedId === c.id ? '#fafcff' : 'white', transition: 'all 0.1s' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: 'var(--accent-blue)', fontWeight: '700' }}>{c.id}</span>
                        <span style={{ background: riskBg_esc(c.level), color: levelColor(c.level), padding: '1px 8px', borderRadius: '2px', fontSize: '0.65rem', fontWeight: '700', fontFamily: 'Arial', textTransform: 'uppercase' }}>{c.level}</span>
                        {c.escalatedToAdmin && <span style={{ background: '#fdf0ee', color: '#c0392b', padding: '1px 8px', borderRadius: '2px', fontSize: '0.6rem', fontWeight: '700', fontFamily: 'Arial' }}>⬆ ADMIN</span>}
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dark)', fontFamily: 'Georgia' }}>{c.industryName}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'Arial', marginTop: '0.15rem' }}>
                        📍 {c.district} · {c.pollutant !== 'Missing Monthly Report' ? `${c.pollutant}: ${c.currentValue}${c.unit} (Limit: ${c.limit}${c.unit}) · ` : ''}{c.daysExceeded} days · Deadline: {c.deadline}
                      </div>
                      {c.actionNote && <div style={{ fontSize: '0.7rem', color: '#1a4e8a', fontFamily: 'Arial', marginTop: '0.25rem', fontStyle: 'italic' }}>Note: {c.actionNote}</div>}
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: '700', color: statusColor(c.status), fontFamily: 'Arial', textTransform: 'uppercase' }}>{c.status}</span>
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: 'Arial', marginTop: '0.15rem' }}>Opened: {c.openedAt}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action panel */}
        {sel && (
          <div style={{ width: '280px', flexShrink: 0 }}>
            <div className="section-card" style={{ position: 'sticky', top: '1rem' }}>
              <div className="section-title" style={{ color: levelColor(sel.level) }}>⚡ Actions — {sel.id}</div>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-dark)', fontFamily: 'Georgia', marginBottom: '0.5rem' }}>{sel.industryName}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Arial', marginBottom: '1rem', lineHeight: 1.7 }}>
                Status: <strong style={{ color: statusColor(sel.status) }}>{sel.status}</strong><br />
                Level: <strong style={{ color: levelColor(sel.level) }}>{sel.level}</strong><br />
                Assigned RO: {sel.assignedRO}
              </div>

              <textarea value={note} onChange={e => setNote(e.target.value)} rows={3}
                placeholder="Add action note (required for In Progress)…"
                style={{ width: '100%', border: '1.5px solid var(--border)', borderRadius: '4px', padding: '0.5rem', fontSize: '0.75rem', fontFamily: 'Arial', resize: 'vertical', marginBottom: '0.75rem', outline: 'none', boxSizing: 'border-box' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {sel.status === 'Open' && (
                  <button className="btn-outline" onClick={() => acknowledge(sel.id)} style={{ width: '100%', fontSize: '0.75rem' }}>✅ Acknowledge</button>
                )}
                {(sel.status === 'Open' || sel.status === 'Acknowledged') && (
                  <button className="btn-primary" onClick={() => markInProgress(sel.id)} style={{ width: '100%', fontSize: '0.75rem' }}>🔄 Mark In Progress</button>
                )}
                {sel.status !== 'Resolved' && !sel.escalatedToAdmin && !isRO && (
                  <button className="btn-danger" onClick={() => escalateToAdmin(sel.id)} style={{ width: '100%', fontSize: '0.75rem' }}>⬆ Escalate to Admin</button>
                )}
                {sel.status !== 'Resolved' && (
                  <button onClick={() => resolve(sel.id)} style={{ width: '100%', fontSize: '0.75rem', background: '#1a6b3a', color: 'white', border: 'none', borderRadius: '3px', padding: '0.4rem', cursor: 'pointer', fontFamily: 'Arial', fontWeight: '600' }}>✓ Mark Resolved</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}

function riskBg_esc(level: EscalationCase['level']) {
  return level === 'Closure Recommended' ? '#f8d7da' : level === 'Show Cause' ? '#fdf0ee' : level === 'Notice' ? '#fef6ee' : '#fff3cd';
}
