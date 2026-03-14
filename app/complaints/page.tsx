'use client';
import PageShell from '@/components/PageShell';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getComplaints, updateComplaintStatus, Complaint, ComplaintStatus } from '@/lib/complaintStore';
import toast, { Toaster } from 'react-hot-toast';

const STATUS_META: Record<ComplaintStatus,{color:string;bg:string}> = {
  'Submitted':          { color:'#1a4e8a', bg:'#e8f0f8' },
  'Under Review':       { color:'#856404', bg:'#fff3cd' },
  'Assigned to RO':     { color:'#d4680a', bg:'#fef6ee' },
  'Inspection Ordered': { color:'#c0392b', bg:'#fdf0ee' },
  'Resolved':           { color:'#1a6b3a', bg:'#d4edda' },
};
const CAT_ICON: Record<string,string> = {
  'Air Pollution':'💨','Water Pollution':'💧','Noise Pollution':'🔊','Illegal Dumping':'🗑','Other':'📋',
};
const ALL_STATUSES: ComplaintStatus[] = ['Submitted','Under Review','Assigned to RO','Inspection Ordered','Resolved'];

export default function ComplaintsPage() {
  const router = useRouter();
  const { user, mounted } = useAuth({ allowedRoles:['Super Admin','Regional Officer'] });
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selected,   setSelected  ] = useState<string|null>(null);
  const [actionNote, setActionNote ] = useState('');
  const [newStatus,  setNewStatus  ] = useState<ComplaintStatus>('Under Review');
  const [filter,     setFilter    ] = useState('all');

  // Load from localStorage on mount and whenever component gets focus
  useEffect(() => {
    const load = () => setComplaints(getComplaints());
    load();
    window.addEventListener('focus', load);
    return () => window.removeEventListener('focus', load);
  }, []);

  if (!mounted || !user) return <PageShell loading />;

  const isRO = user.role === 'Regional Officer';
  // RO sees only their district complaints
  const shown = isRO
    ? complaints.filter(c => c.assignedRO === 'Rajesh Kumar')
    : complaints;
  const filtered = filter === 'all'        ? shown
                 : filter === 'open'       ? shown.filter(c => c.status !== 'Resolved')
                 : filter === 'high'       ? shown.filter(c => c.priority === 'high')
                 : shown.filter(c => c.status === filter);

  const sel = complaints.find(c => c.id === selected);

  const applyUpdate = () => {
    if (!selected) return;
    if (!actionNote.trim() && newStatus === 'Resolved') { toast.error('Add a resolution note before resolving.'); return; }
    updateComplaintStatus(selected, newStatus, actionNote.trim() || undefined);
    setComplaints(getComplaints());
    toast.success(`Status updated to "${newStatus}"`);
    setSelected(null); setActionNote('');
  };

  const fmtDate = (iso: string) => {
    try { return new Date(iso).toLocaleDateString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}); }
    catch { return iso; }
  };

  return (
    <PageShell>
      <Toaster position="top-right" toastOptions={{ style:{ background:'white', color:'var(--text-dark)', border:'1px solid var(--border)', fontFamily:'Arial', fontSize:'0.82rem' } }} />
      <div className="breadcrumb">
        <span>🏠 Home</span><span>›</span>
        <a onClick={() => router.push('/dashboard')} style={{ cursor:'pointer' }}>Dashboard</a>
        <span>›</span>
        <span style={{ color:'var(--navy)', fontWeight:'700' }}>📬 Citizen Complaints</span>
      </div>
      <div className="live-bar">
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <span className="live-dot" />
          <span style={{ fontSize:'0.72rem', fontWeight:'700', color:'#22c55e', fontFamily:'Arial' }}>LIVE</span>
          <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'Arial', marginLeft:'0.35rem' }}>
            {shown.filter(c=>c.status!=='Resolved').length} open · {shown.filter(c=>c.priority==='high'&&c.status!=='Resolved').length} high priority · {isRO?'Nagpur Zone':'All Zones'}
          </span>
        </div>
        <button onClick={() => setComplaints(getComplaints())} style={{ fontSize:'0.65rem', color:'var(--text-muted)', background:'none', border:'1px solid var(--border)', borderRadius:'3px', padding:'0.15rem 0.5rem', cursor:'pointer', fontFamily:'Arial' }}>
          ↺ Refresh
        </button>
      </div>

      <div style={{ display:'flex', gap:'1.25rem', padding:'1.25rem 1.5rem' }}>

        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'1rem' }}>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem' }}>
            {[
              { label:'Total',        value:shown.length,                                         color:'#1a4e8a' },
              { label:'High Priority',value:shown.filter(c=>c.priority==='high').length,          color:'#c0392b' },
              { label:'Open',         value:shown.filter(c=>c.status!=='Resolved').length,        color:'#d4680a' },
              { label:'Resolved',     value:shown.filter(c=>c.status==='Resolved').length,        color:'#1a6b3a' },
            ].map(s => (
              <div key={s.label} className="stat-card" style={{ borderTopColor:s.color }}>
                <div style={{ fontSize:'0.63rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'0.3rem', fontFamily:'Arial' }}>{s.label}</div>
                <div style={{ fontSize:'2.2rem', fontWeight:'800', color:s.color, lineHeight:1, fontFamily:'Georgia' }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Filter chips */}
          <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
            {[['all','All'],['open','Open'],['high','High Priority'],['Submitted','Submitted'],['Under Review','Under Review'],['Resolved','Resolved']].map(([v,l]) => (
              <button key={v} onClick={() => setFilter(v)}
                style={{ fontSize:'0.7rem', fontFamily:'Arial', fontWeight:filter===v?'700':'500', padding:'0.22rem 0.65rem', borderRadius:'12px', border:'1.5px solid', borderColor:filter===v?'var(--navy)':'var(--border)', background:filter===v?'var(--navy)':'white', color:filter===v?'white':'var(--text-mid)', cursor:'pointer' }}>
                {l}
              </button>
            ))}
          </div>

          {/* Complaints list */}
          <div className="section-card">
            <div className="section-title">📬 Complaints ({filtered.length})</div>
            {filtered.length === 0 ? (
              <div style={{ padding:'1.5rem', textAlign:'center', color:'var(--text-muted)', fontFamily:'Arial', fontSize:'0.82rem' }}>No complaints match this filter.</div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                {filtered.map(c => {
                  const sm = STATUS_META[c.status];
                  return (
                    <div key={c.id} onClick={() => { setSelected(selected===c.id?null:c.id); setNewStatus(c.status); setActionNote(''); }}
                      style={{ border:`1px solid ${selected===c.id?'var(--navy)':'var(--border)'}`, borderLeft:`4px solid ${c.priority==='high'?'#c0392b':'var(--border)'}`, borderRadius:'4px', padding:'0.85rem 1rem', cursor:'pointer', background:selected===c.id?'#f5f7fc':'white', transition:'all 0.1s' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'1rem' }}>
                        <div style={{ flex:1 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.2rem', flexWrap:'wrap' }}>
                            <span style={{ fontSize:'0.65rem', fontFamily:'monospace', color:'var(--accent-blue)', fontWeight:'700' }}>{c.refNo}</span>
                            <span style={{ fontSize:'0.65rem', fontFamily:'Arial', color:'var(--text-muted)', background:'#f0f2f5', padding:'1px 7px', borderRadius:'2px' }}>{CAT_ICON[c.category]} {c.category}</span>
                            {c.priority==='high' && <span style={{ background:'#fdf0ee', color:'#c0392b', padding:'1px 7px', borderRadius:'2px', fontSize:'0.6rem', fontWeight:'700', fontFamily:'Arial' }}>HIGH</span>}
                          </div>
                          <div style={{ fontSize:'0.78rem', color:'var(--text-dark)', fontFamily:'Arial', marginBottom:'0.15rem' }}>
                            {c.description.length>85?c.description.slice(0,85)+'…':c.description}
                          </div>
                          <div style={{ fontSize:'0.67rem', color:'var(--text-muted)', fontFamily:'Arial' }}>
                            📍 {c.location} · {c.district} · 👤 {c.submittedBy} · {fmtDate(c.submittedAt)}
                          </div>
                          {c.actionNote && <div style={{ fontSize:'0.67rem', color:'#1a4e8a', fontFamily:'Arial', marginTop:'0.15rem', fontStyle:'italic' }}>Note: {c.actionNote}</div>}
                        </div>
                        <div style={{ textAlign:'right', flexShrink:0 }}>
                          <span style={{ background:sm.bg, color:sm.color, padding:'2px 9px', borderRadius:'2px', fontSize:'0.65rem', fontWeight:'700', fontFamily:'Arial', display:'block', marginBottom:'0.15rem', whiteSpace:'nowrap' }}>{c.status}</span>
                          {c.assignedRO && <div style={{ fontSize:'0.6rem', color:'var(--text-muted)', fontFamily:'Arial' }}>RO: {c.assignedRO}</div>}
                        </div>
                      </div>
                      {c.photoBase64 && (
                        <div style={{ marginTop:'0.5rem' }}>
                          <img src={c.photoBase64} alt="Evidence" style={{ width:'48px', height:'48px', objectFit:'cover', borderRadius:'4px', border:'1px solid var(--border)' }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Action panel */}
        {sel && (
          <div style={{ width:'280px', flexShrink:0 }}>
            <div className="section-card" style={{ position:'sticky', top:'1rem' }}>
              <div className="section-title">⚡ Update Status</div>
              <div style={{ fontSize:'0.65rem', fontFamily:'monospace', color:'var(--accent-blue)', marginBottom:'0.25rem' }}>{sel.refNo}</div>
              <div style={{ fontSize:'0.78rem', color:'var(--text-dark)', fontFamily:'Arial', marginBottom:'0.6rem', lineHeight:1.7 }}>
                <strong>{CAT_ICON[sel.category]} {sel.category}</strong><br/>
                📍 {sel.location}, {sel.district}<br/>
                👤 {sel.submittedBy}<br/>
                Current: <strong style={{ color:STATUS_META[sel.status].color }}>{sel.status}</strong>
              </div>

              {sel.photoBase64 && (
                <div style={{ marginBottom:'0.75rem' }}>
                  <div style={{ fontSize:'0.62rem', color:'var(--text-muted)', fontFamily:'Arial', marginBottom:'0.25rem' }}>Attached Photo:</div>
                  <img src={sel.photoBase64} alt="Evidence" style={{ width:'100%', maxHeight:'120px', objectFit:'cover', borderRadius:'6px', border:'1px solid var(--border)' }} />
                </div>
              )}

              <div style={{ marginBottom:'0.6rem' }}>
                <label style={{ fontSize:'0.65rem', fontWeight:'700', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', fontFamily:'Arial', display:'block', marginBottom:'0.25rem' }}>New Status</label>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value as ComplaintStatus)}
                  style={{ width:'100%', border:'1.5px solid var(--border)', borderRadius:'4px', padding:'0.45rem', fontSize:'0.78rem', fontFamily:'Arial', outline:'none', background:'white', color:'var(--text-dark)' }}>
                  {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <textarea value={actionNote} onChange={e => setActionNote(e.target.value)} rows={3}
                placeholder="Add action note (required for Resolved)…"
                style={{ width:'100%', border:'1.5px solid var(--border)', borderRadius:'4px', padding:'0.45rem', fontSize:'0.73rem', fontFamily:'Arial', resize:'vertical', outline:'none', boxSizing:'border-box', marginBottom:'0.75rem' }} />

              <button onClick={applyUpdate} className="btn-primary" style={{ width:'100%', fontSize:'0.78rem' }}>
                ✓ Update Status
              </button>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
