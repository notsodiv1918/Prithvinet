'use client';
import PageShell from '@/components/PageShell';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface TelegramComplaint {
  id: string;
  refNo: string;
  telegramId: number;
  username: string;
  message: string;
  category: string;
  submittedAt: string;
  status: 'Submitted' | 'Under Review' | 'Resolved';
}

export default function TelegramComplaintsPage() {
  const router = useRouter();
  const { user, mounted } = useAuth({ allowedRoles: ['Super Admin', 'Regional Officer'] });
  const [complaints, setComplaints] = useState<TelegramComplaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch('/api/telegram');
        const data = await res.json();
        setComplaints(data.complaints || []);
      } catch {
        setComplaints([]);
      }
      setLoading(false);
    };
    fetchComplaints();
    const interval = setInterval(fetchComplaints, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted || !user) return <PageShell loading />;

  const statusColor = (s: string) => {
    if (s === 'Resolved')     return { bg: '#d4edda', color: '#1a6b3a' };
    if (s === 'Under Review') return { bg: '#fff3cd', color: '#856404' };
    return                           { bg: '#e8f0f8', color: '#1a4e8a' };
  };

  return (
    <PageShell>
      <div className="breadcrumb">
        <span>Home</span><span>›</span>
        <a onClick={() => router.push('/dashboard')} style={{ cursor: 'pointer' }}>Dashboard</a>
        <span>›</span>
        <span style={{ color: 'var(--navy)', fontWeight: '700' }}>Telegram Complaints</span>
      </div>

      <div className="live-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="live-dot" />
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#22c55e', fontFamily: 'Arial' }}>LIVE</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Arial', marginLeft: '0.35rem' }}>
            {complaints.length} complaints via Telegram bot - Auto-refreshes every 10s
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#229ED9' }} />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Arial' }}>@Pritvinet_Bot</span>
        </div>
      </div>

      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {[
            { label: 'Total Received', value: complaints.length,                                        color: 'var(--accent-blue)'  },
            { label: 'Pending Review', value: complaints.filter(c => c.status === 'Submitted').length,  color: 'var(--danger)'       },
            { label: 'Resolved',       value: complaints.filter(c => c.status === 'Resolved').length,   color: 'var(--accent-green)' },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ borderTopColor: s.color }}>
              <div style={{ fontSize: '0.63rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.3rem', fontFamily: 'Arial' }}>{s.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: s.color, lineHeight: 1, fontFamily: 'Georgia' }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#e8f4fb', border: '1px solid #b8d8f0', borderRadius: '8px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#229ED9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1a2744' }}>Pritvinet_Bot is active</div>
            <div style={{ fontSize: '0.7rem', color: '#4a6280', marginTop: '0.1rem' }}>Citizens can message <strong>@Pritvinet_Bot</strong> on Telegram to file complaints. They appear here in real-time.</div>
          </div>
          <a href="https://t.me/Pritvinet_Bot" target="_blank" rel="noopener noreferrer"
            style={{ background: '#229ED9', color: 'white', borderRadius: '5px', padding: '0.4rem 0.85rem', fontSize: '0.72rem', fontFamily: 'Arial', fontWeight: '600', textDecoration: 'none', flexShrink: 0 }}>
            Open Bot
          </a>
        </div>

        <div className="section-card">
          <div className="section-title">Complaints Received via Telegram</div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontFamily: 'Arial', fontSize: '0.82rem' }}>Loading...</div>
          ) : complaints.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--text-muted)', fontFamily: 'Arial' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '0.35rem' }}>No Telegram complaints yet</div>
              <div style={{ fontSize: '0.75rem' }}>Citizens can message @Pritvinet_Bot to file complaints</div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="gov-table">
                <thead>
                  <tr><th>Ref No</th><th>From</th><th>Category</th><th>Message</th><th>Filed At</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {complaints.map(c => {
                    const sm = statusColor(c.status);
                    return (
                      <tr key={c.id}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--accent-blue)', fontWeight: '600' }}>{c.refNo}</td>
                        <td style={{ fontSize: '0.8rem', fontWeight: '600' }}>{c.username}</td>
                        <td><span style={{ background: '#e8f0f8', color: 'var(--accent-blue)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.67rem', fontWeight: '700' }}>{c.category}</span></td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: '300px' }}>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }} title={c.message}>{c.message}</div>
                        </td>
                        <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.submittedAt}</td>
                        <td><span style={{ background: sm.bg, color: sm.color, padding: '2px 9px', borderRadius: '10px', fontSize: '0.67rem', fontWeight: '700' }}>{c.status}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
