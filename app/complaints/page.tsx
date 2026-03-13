'use client';
import PageShell from '@/components/PageShell';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { COMPLAINTS, CitizenComplaint } from '@/data/newModulesData';
import toast, { Toaster } from 'react-hot-toast';

const STATUS_META: Record<CitizenComplaint['status'], { color: string; bg: string }> = {
  'Submitted':          { color: '#1a4e8a', bg: '#e8f0f8' },
  'Under Review':       { color: '#856404', bg: '#fff3cd' },
  'Assigned to RO':     { color: '#d4680a', bg: '#fef6ee' },
  'Inspection Ordered': { color: '#c0392b', bg: '#fdf0ee' },
  'Resolved':           { color: '#1a6b3a', bg: '#d4edda' },
};

const CAT_ICON: Record<string, string> = {
  'Air Pollution': '💨', 'Water Pollution': '💧', 'Noise Pollution': '🔊',
  'Illegal Dumping': '🗑', 'Other': '📋',
};

export default function ComplaintsPage() {
  const router = useRouter();
  const { user, mounted } = useAuth({ allowedRoles: ['Super Admin', 'Regional Officer'] });
  const [complaints, setComplaints] = useState<CitizenComplaint[]>(COMPLAINTS);
  const [selected,   setSelected  ] = useState<string | null>(null);
  const [actionNote, setActionNote ] = useState('');
  const [filter,     setFilter    ] = useState<string>('all');

  if (!mounted || !user) return <PageShell loading />;

  const isRO = user.role === 'Regional Officer';
  const shown = isRO ? complaints.filter(c => !c.assignedRO || c.assignedRO === 'Rajesh Kumar') : complaints;
  const filtered = filter === 'all' ? shown : filter === 'unresolved'
    ? shown.filter(c => c.status !== 'Resolved')
    : shown.filter(c => c.priority === 'high');

  const sel = complaints.find(c => c.id === selected);

  const assignRO = (id: string) => {
    setComplaints(prev => prev.map(c => c.id === id
      ? { ...c, status: 'Assigned to RO' as const, assignedRO: 'Rajesh Kumar' }
      : c));
    toast('Complaint assigned to RO', { icon: '👮' });
    setSelected(null);
  };

  const orderInspection = (id: string) => {
    setComplaints(prev => prev.map(c => c.id === id
      ? { ...c, status: 'Inspection Ordered' as const, actionNote }
      : c));
    toast.error('Inspection ordered', { icon: '🔍' });
    setActionNote(''); setSelected(null);
  };

  const resolveCase = (id: string) => {
    if (!actionNote.trim()) { toast.error('Add a resolution note first.'); return; }
    setComplaints(prev => prev.map(c => c.id === id
      ? { ...c, status: 'Resolved' as const, actionNote, resolvedAt: new Date().toLocaleDateString('en-IN') }
      : c));
    toast.success('Complaint resolved');
    setActionNote(''); setSelected(null);
  };

  return (
    <PageShell>
      <Toaster position="top-right" />
      <div className="breadcrumb">
        <span>🏠 Home</span><span>›</span>
        <a onClick={() => router.push('/dashboard')} style={{ cursor: 'pointer' }}>Dashboard</a>
        <span>›</span>
        <span style={{ color: 'var(--navy)', fontWeight: '700' }}>📬 Citizen Complaints</span>
      </div>
      <div className="live-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="live-dot" />
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#22c55e', fontFamily: 'Arial' }}>LIVE</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Arial', marginLeft: '0.35rem' }}>
            {shown.filter(c=>c.status!=='Resolved').length} open · {shown.filter(c=>c.priority==='high'&&c.status!=='Resolved').length} high priority
          </span>
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Arial' }}>{isRO ? 'Nagpur Zone' : 'All Zones'}</span>
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', padding: '1.25rem 1.5rem' }}>

        {/* Left: list */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
            {[
              { label: 'Total',      value: shown.length,                                  color: '#1a4e8a' },
              { label: 'High Priority', value: shown.filter(c=>c.priority==='high').length, color: '#c0392b' },
              { label: 'Open',       value: shown.filter(c=>c.status!=='Resolved').length, color: '#d4680a' },
              { label: 'Resolved',   value: shown.filter(c=>c.status==='Resolved').length, color: '#1a6b3a' },
            ].map(s => (
              <div key={s.label} className="stat-card" style={{ borderTopColor: s.color }}>
                <div style={{ fontSize: '0.63rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.3rem', fontFamily: 'Arial' }}>{s.label}</div>
                <div style={{ fontSize: '2.2rem', fontWeight: '800', color: s.color, lineHeight: 1, fontFamily: 'Georgia' }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Filter chips */}
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {[['all','All'],['unresolved','Open'],['high','High Priority']].map(([v,l]) => (
              <button key={v} onClick={() => setFilter(v)}
                style={{ fontSize: '0.72rem', fontFamily: 'Arial', fontWeight: filter===v?'700':'500', padding: '0.25rem 0.75rem', borderRadius: '15px', border: '1.5px solid', borderColor: filter===v?'var(--navy)':'var(--border)', background: filter===v?'var(--navy)':'white', color: filter===v?'white':'var(--text-mid)', cursor: 'pointer' }}>
                {l}
              </button>
            ))}
          </div>

          <div className="section-card">
            <div className="section-title">📬 Citizen Complaints</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {filtered.map(c => {
                const sm = STATUS_META[c.status];
                return (
                  <div key={c.id} onClick={() => setSelected(selected===c.id?null:c.id)}
                    style={{ border: `1px solid ${selected===c.id?'var(--navy)':'var(--border)'}`, borderLeft: `4px solid ${c.priority==='high'?'#c0392b':'var(--border)'}`, borderRadius: '4px', padding: '0.85rem 1rem', cursor: 'pointer', background: selected===c.id?'#f5f7fc':'white', transition: 'all 0.1s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: 'var(--accent-blue)', fontWeight: '700' }}>{c.refNo}</span>
                          <span style={{ background: '#f0f2f5', color: 'var(--text-muted)', padding: '1px 7px', borderRadius: '2px', fontSize: '0.62rem', fontFamily: 'Arial' }}>{CAT_ICON[c.category]} {c.category}</span>
                          {c.priority === 'high' && <span style={{ background: '#fdf0ee', color: '#c0392b', padding: '1px 7px', borderRadius: '2px', fontSize: '0.6rem', fontWeight: '700', fontFamily: 'Arial' }}>HIGH</span>}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dark)', fontFamily: 'Arial', marginBottom: '0.15rem' }}>{c.description.length > 80 ? c.description.slice(0,80)+'…' : c.description}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'Arial' }}>📍 {c.location} · {c.submittedBy} · {c.submittedAt}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <span style={{ background: sm.bg, color: sm.color, padding: '2px 8px', borderRadius: '2px', fontSize: '0.65rem', fontWeight: '700', fontFamily: 'Arial' }}>{c.status}</span>
                        {c.assignedRO && <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>RO: {c.assignedRO}</div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: action panel */}
        {sel && (
          <div style={{ width: '280px', flexShrink: 0 }}>
            <div className="section-card" style={{ position: 'sticky', top: '1rem' }}>
              <div className="section-title">⚡ Actions</div>
              <div style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: 'var(--accent-blue)', marginBottom: '0.25rem' }}>{sel.refNo}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-dark)', fontFamily: 'Arial', marginBottom: '0.25rem' }}>{CAT_ICON[sel.category]} {sel.category}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'Arial', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                <strong>Location:</strong> {sel.location}<br />
                <strong>District:</strong> {sel.district}<br />
                <strong>Filed by:</strong> {sel.submittedBy}<br />
                <strong>Description:</strong> {sel.description}
                {sel.actionNote && <><br /><strong>Action note:</strong> {sel.actionNote}</>}
                {sel.resolvedAt && <><br /><strong>Resolved:</strong> {sel.resolvedAt}</>}
              </div>

              <textarea value={actionNote} onChange={e => setActionNote(e.target.value)} rows={3}
                placeholder="Add action / resolution note…"
                style={{ width: '100%', border: '1.5px solid var(--border)', borderRadius: '4px', padding: '0.5rem', fontSize: '0.75rem', fontFamily: 'Arial', resize: 'vertical', marginBottom: '0.75rem', outline: 'none', boxSizing: 'border-box' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {sel.status === 'Submitted' && !isRO && (
                  <button className="btn-outline" onClick={() => assignRO(sel.id)} style={{ width: '100%', fontSize: '0.75rem' }}>👮 Assign to RO</button>
                )}
                {(sel.status === 'Submitted' || sel.status === 'Under Review' || sel.status === 'Assigned to RO') && (
                  <button className="btn-danger" onClick={() => orderInspection(sel.id)} style={{ width: '100%', fontSize: '0.75rem' }}>🔍 Order Inspection</button>
                )}
                {sel.status !== 'Resolved' && (
                  <button onClick={() => resolveCase(sel.id)} style={{ width: '100%', fontSize: '0.75rem', background: '#1a6b3a', color: 'white', border: 'none', borderRadius: '3px', padding: '0.4rem', cursor: 'pointer', fontFamily: 'Arial', fontWeight: '600' }}>✓ Mark Resolved</button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
