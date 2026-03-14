'use client';
import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import CitizenPageHeader from '@/components/CitizenPageHeader';
import CitizenAIWidget from '@/components/CitizenAIWidget';
import { getComplaints, getComplaintsByEmail, Complaint, ComplaintStatus } from '@/lib/complaintStore';

const STATUS_STEPS: ComplaintStatus[] = [
  'Submitted', 'Under Review', 'Assigned to RO', 'Inspection Ordered', 'Resolved',
];

const STATUS_META: Record<ComplaintStatus, { color: string; bg: string; icon: string }> = {
  'Submitted':          { color: '#1a4e8a', bg: '#e8f0f8', icon: '◎' },
  'Under Review':       { color: '#856404', bg: '#fff3cd', icon: '◈' },
  'Assigned to RO':     { color: '#d4680a', bg: '#fef6ee', icon: '◉' },
  'Inspection Ordered': { color: '#c0392b', bg: '#fdf0ee', icon: '⊙' },
  'Resolved':           { color: '#1a6b3a', bg: '#d4edda', icon: '✓' },
};

const CAT_ICON: Record<string, string> = {
  'Air Pollution': '◎', 'Water Pollution': '◎', 'Noise Pollution': '◎',
  'Illegal Dumping': '◎', 'Other': '◎',
};

function StatusTimeline({ current }: { current: ComplaintStatus }) {
  const idx = STATUS_STEPS.indexOf(current);
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
      {STATUS_STEPS.map((step, i) => {
        const done   = i < idx;
        const active = i === idx;
        const meta   = STATUS_META[step];
        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: i > idx ? '#f0f2f5' : meta.bg, border: `2px solid ${i > idx ? '#dde2ec' : meta.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700', color: i > idx ? '#94a3b8' : meta.color }}>
                {done ? '✓' : active ? meta.icon : '○'}
              </div>
              <div style={{ fontSize: '0.52rem', color: i > idx ? '#94a3b8' : meta.color, fontFamily: 'Arial', fontWeight: active ? '700' : '400', textAlign: 'center', maxWidth: '58px', lineHeight: 1.3 }}>
                {step}
              </div>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div style={{ width: '20px', height: '2px', background: i < idx ? '#1a6b3a' : '#dde2ec', marginBottom: '18px', flexShrink: 0 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Inner component that uses useSearchParams ─────────────────────────────────
function MyComplaintsInner() {
  const searchParams = useSearchParams();
  const emailFromURL = searchParams.get('email') || '';

  const [email,      setEmail]      = useState(emailFromURL);
  const [refSearch,  setRefSearch]  = useState('');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searched,   setSearched]   = useState(false);

  useEffect(() => {
    if (emailFromURL) {
      setComplaints(getComplaintsByEmail(emailFromURL));
      setSearched(true);
    }
  }, [emailFromURL]);

  const searchByEmail = () => {
    if (!email.trim()) return;
    setComplaints(getComplaintsByEmail(email.trim()));
    setSearched(true);
  };

  const searchByRef = () => {
    if (!refSearch.trim()) return;
    const all = getComplaints();
    setComplaints(all.filter(c => c.refNo === refSearch.trim()));
    setSearched(true);
  };

  const fmtDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    } catch { return iso; }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '1.5rem', width: '100%' }}>

      <div style={{ marginBottom: '1rem' }}>
        <a href="/file-complaint" style={{ fontSize: '0.72rem', color: '#1a5280', textDecoration: 'none' }}>
          ← File a Complaint
        </a>
      </div>

      <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1a2744', fontFamily: 'Georgia', marginBottom: '0.25rem' }}>
        Track My Complaints
      </div>
      <div style={{ fontSize: '0.75rem', color: '#6b7a96', marginBottom: '1.25rem', lineHeight: 1.7 }}>
        Enter your email address or reference number to track your complaint status.
      </div>

      {/* Search */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 10px rgba(26,39,68,0.08)', marginBottom: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: '700', color: '#3d4f6b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem', fontFamily: 'Arial' }}>By Email</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="email" placeholder="your@email.com" value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && searchByEmail()}
                style={{ flex: 1, border: '1.5px solid #dde2ec', borderRadius: '6px', padding: '0.45rem 0.75rem', fontSize: '0.82rem', fontFamily: 'Arial', outline: 'none', color: '#1a2744', background: '#f8f9fa' }} />
              <button onClick={searchByEmail}
                style={{ background: '#1a2744', color: 'white', border: 'none', borderRadius: '6px', padding: '0.45rem 0.85rem', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Arial', fontWeight: '600', whiteSpace: 'nowrap' }}>
                Search
              </button>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.68rem', fontWeight: '700', color: '#3d4f6b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem', fontFamily: 'Arial' }}>By Reference Number</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="text" placeholder="PVN-2026-XXXX-XXXX" value={refSearch}
                onChange={e => setRefSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && searchByRef()}
                style={{ flex: 1, border: '1.5px solid #dde2ec', borderRadius: '6px', padding: '0.45rem 0.75rem', fontSize: '0.82rem', fontFamily: 'Arial', outline: 'none', color: '#1a2744', background: '#f8f9fa' }} />
              <button onClick={searchByRef}
                style={{ background: '#1a2744', color: 'white', border: 'none', borderRadius: '6px', padding: '0.45rem 0.85rem', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'Arial', fontWeight: '600', whiteSpace: 'nowrap' }}>
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {!searched ? (
        <div style={{ background: 'white', borderRadius: '12px', padding: '2.5rem', textAlign: 'center', boxShadow: '0 2px 10px rgba(26,39,68,0.08)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>◎</div>
          <div style={{ fontSize: '0.82rem', color: '#6b7a96', lineHeight: 1.7 }}>
            Enter your email or reference number above to see your complaints and their status.
          </div>
        </div>
      ) : complaints.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '12px', padding: '2.5rem', textAlign: 'center', boxShadow: '0 2px 10px rgba(26,39,68,0.08)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>◈</div>
          <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#1a2744', fontFamily: 'Georgia', marginBottom: '0.35rem' }}>No complaints found</div>
          <div style={{ fontSize: '0.75rem', color: '#6b7a96', lineHeight: 1.7 }}>
            No complaints match that email or reference number. Double-check the details or file a new complaint.
          </div>
          <a href="/file-complaint" style={{ display: 'inline-block', marginTop: '1rem', background: '#1a2744', color: 'white', borderRadius: '8px', padding: '0.55rem 1.25rem', fontSize: '0.8rem', fontFamily: 'Arial', fontWeight: '600', textDecoration: 'none' }}>
            File a Complaint →
          </a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#6b7a96', fontFamily: 'Arial' }}>
            Found <strong style={{ color: '#1a2744' }}>{complaints.length}</strong> complaint{complaints.length > 1 ? 's' : ''}
          </div>
          {complaints.map(c => {
            const sm = STATUS_META[c.status];
            return (
              <div key={c.id} style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 10px rgba(26,39,68,0.08)', borderLeft: `4px solid ${sm.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.65rem', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: '#1a4e8a', fontWeight: '700', marginBottom: '0.15rem' }}>{c.refNo}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1a2744', fontFamily: 'Georgia' }}>{c.category}</div>
                    <div style={{ fontSize: '0.7rem', color: '#6b7a96', marginTop: '0.1rem' }}>
                      {c.location} · {fmtDate(c.submittedAt)}
                    </div>
                  </div>
                  <span style={{ background: sm.bg, color: sm.color, padding: '3px 12px', borderRadius: '12px', fontSize: '0.68rem', fontWeight: '700', fontFamily: 'Arial', whiteSpace: 'nowrap' }}>
                    {sm.icon} {c.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.75rem', color: '#3d4f6b', background: '#f8f9fa', borderRadius: '6px', padding: '0.6rem 0.75rem', marginBottom: '0.75rem', lineHeight: 1.6 }}>
                  {c.description}
                </div>

                {c.photoBase64 && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <img src={c.photoBase64} alt="Your photo" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #dde2ec' }} />
                  </div>
                )}

                <StatusTimeline current={c.status} />

                {c.actionNote && (
                  <div style={{ marginTop: '0.75rem', background: '#e8f5ee', border: '1px solid #c8e0d2', borderRadius: '6px', padding: '0.55rem 0.75rem', fontSize: '0.72rem', color: '#1a6b3a', lineHeight: 1.6 }}>
                    <strong>Officer Update:</strong> {c.actionNote}
                    {c.resolvedAt && <> · Resolved on: {c.resolvedAt}</>}
                  </div>
                )}

                {c.assignedRO && (
                  <div style={{ marginTop: '0.4rem', fontSize: '0.63rem', color: '#94a3b8', fontFamily: 'Arial' }}>
                    Assigned to: {c.assignedRO}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Page wrapper with required Suspense boundary ──────────────────────────────
export default function MyComplaintsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', display: 'flex', flexDirection: 'column', fontFamily: 'Arial' }}>
      <CitizenPageHeader activeTab="air" stationCount={0} />
      <Suspense fallback={
        <div style={{ maxWidth: '720px', margin: '2rem auto', padding: '1.5rem', width: '100%', textAlign: 'center', color: '#6b7a96', fontFamily: 'Arial', fontSize: '0.85rem' }}>
          Loading...
        </div>
      }>
        <MyComplaintsInner />
      </Suspense>
      <CitizenAIWidget />
    </div>
  );
}
