'use client';
import { useState } from 'react';
import ROSidebar from '@/components/ROSidebar';
import TopBar from '@/components/TopBar';
import { STATIONS, INDUSTRIES, PRESCRIBED_LIMITS, CHAT_MESSAGES } from '@/data/mockData';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

const MISSING = [
  { industry: 'Vidarbha Coal Ltd', district: 'Nagpur', due: '2024-07-13' },
  { industry: 'Konkan Fertilizers', district: 'Ratnagiri', due: '2024-07-12' },
];

export default function RODashboard() {
  const router = useRouter();
  const [reminded, setReminded] = useState<Set<string>>(new Set());
  const [inspected, setInspected] = useState<Set<string>>(new Set());

  // RO only sees their assigned district (Nagpur)
  const myStations = STATIONS.filter(s => s.district === 'Nagpur' || s.district === 'Navi Mumbai');
  const myIndustries = INDUSTRIES.filter(i => i.assignedRO === 'Rajesh Kumar');
  const breaches = myStations.filter(s => s.status === 'breach');
  const unread = CHAT_MESSAGES.filter(m => !m.read && m.to === 'Rajesh Kumar').length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f8f3' }}>
      <ROSidebar />
      <main style={{ flex: 1, overflow: 'auto' }}>
        <TopBar title="Regional Officer Dashboard" subtitle="Nagpur Zone — Assigned industries and stations" />
        <Toaster position="top-right" toastOptions={{ style: { background: 'white', color: '#1a2e22', border: '1px solid #c8e0d2' } }} />

        <div style={{ background: 'white', borderBottom: '1px solid #e8f5ee', padding: '0.5rem 1.5rem' }}>
          <span style={{ fontSize: '0.7rem', color: '#6b8c7a' }}>Home › </span>
          <span style={{ fontSize: '0.7rem', color: '#1a6b3a', fontWeight: '600' }}>RO Dashboard</span>
        </div>

        <div style={{ padding: '1.25rem 1.5rem' }}>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
            {[
              { label: 'My Stations', value: myStations.length, sub: 'Nagpur zone', color: '#1a6b3a' },
              { label: 'Breaches', value: breaches.length, sub: 'Need action', color: '#c0392b' },
              { label: 'Industries Assigned', value: myIndustries.length, sub: 'Under my supervision', color: '#7d4e00' },
              { label: 'Unread from Admin', value: unread, sub: 'Click to view', color: '#1a4e8a', onClick: () => router.push('/chat') },
            ].map(s => (
              <div key={s.label} className="stat-card" style={{ borderTopColor: s.color, cursor: s.onClick ? 'pointer' : 'default' }} onClick={s.onClick}>
                <div style={{ fontSize: '0.68rem', color: '#6b8c7a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>{s.label}</div>
                <div style={{ fontSize: '2.2rem', fontWeight: '800', color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.7rem', color: '#6b8c7a', marginTop: '0.2rem' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Message from admin preview */}
          {unread > 0 && (
            <div style={{ background: '#e8f0ff', border: '1px solid #b8d0f0', borderLeft: '4px solid #2d6a9f', borderRadius: '4px', padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#1a4e8a' }}>📩 {unread} new message{unread > 1 ? 's' : ''} from Super Admin (Arjun Mehta)</div>
                <div style={{ fontSize: '0.72rem', color: '#3d5a78', marginTop: '0.15rem' }}>{CHAT_MESSAGES.filter(m => !m.read && m.to === 'Rajesh Kumar').slice(-1)[0]?.message.slice(0, 80)}...</div>
              </div>
              <button className="btn-outline" style={{ fontSize: '0.72rem', whiteSpace: 'nowrap', marginLeft: '1rem' }} onClick={() => router.push('/chat')}>
                Reply →
              </button>
            </div>
          )}

          {/* My assigned industries */}
          <div className="section-card">
            <div className="section-title">My Assigned Industries — Compliance Actions</div>
            {myIndustries.map(ind => {
              const isBreach = ind.currentSo2 > PRESCRIBED_LIMITS.so2 || ind.currentNo2 > PRESCRIBED_LIMITS.no2 || ind.currentPm25 > PRESCRIBED_LIMITS.pm25;
              return (
                <div key={ind.id} style={{ background: isBreach ? '#fdf0ee' : '#f7fcf9', border: `1px solid ${isBreach ? '#f5c6cb' : '#c8e0d2'}`, borderRadius: '4px', padding: '1rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1a2e22' }}>{ind.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#6b8c7a' }}>{ind.type} · {ind.district} · Contact: {ind.contactPerson} · {ind.phone}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: '800', color: ind.complianceRate < 50 ? '#c0392b' : ind.complianceRate < 80 ? '#d4680a' : '#1a6b3a' }}>{ind.complianceRate}%</div>
                      <div style={{ fontSize: '0.62rem', color: '#6b8c7a' }}>compliance</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    {[['SO₂ ppm', ind.currentSo2, PRESCRIBED_LIMITS.so2], ['NO₂ ppm', ind.currentNo2, PRESCRIBED_LIMITS.no2], ['PM2.5', ind.currentPm25, PRESCRIBED_LIMITS.pm25]].map(([k, v, lim]) => (
                      <div key={String(k)} style={{ background: 'white', border: `1px solid ${Number(v) > Number(lim) ? '#f5c6cb' : '#e8f5ee'}`, borderRadius: '3px', padding: '0.4rem 0.6rem' }}>
                        <div style={{ fontSize: '0.62rem', color: '#6b8c7a' }}>{k}</div>
                        <div style={{ fontSize: '1rem', fontWeight: '700', color: Number(v) > Number(lim) ? '#c0392b' : '#1a6b3a' }}>{v}</div>
                        <div style={{ fontSize: '0.58rem', color: '#94a3b8' }}>Limit: {lim}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {inspected.has(ind.id) ? (
                      <span style={{ fontSize: '0.75rem', color: '#1a6b3a', fontWeight: '600', background: '#d4edda', padding: '0.35rem 0.75rem', borderRadius: '3px', border: '1px solid #b8dfc4' }}>✓ Inspection Scheduled</span>
                    ) : (
                      <button className="btn-danger" style={{ fontSize: '0.75rem', padding: '0.35rem 0.9rem' }}
                        onClick={() => { setInspected(p => new Set(p).add(ind.id)); toast.error(`Inspection scheduled for ${ind.name}`, { icon: '📋' }); }}>
                        Schedule Inspection
                      </button>
                    )}
                    {reminded.has(ind.id) ? (
                      <span style={{ fontSize: '0.75rem', color: '#1a4e8a', fontWeight: '600', background: '#e2eeff', padding: '0.35rem 0.75rem', borderRadius: '3px', border: '1px solid #b8d0f0' }}>✓ Reminder Sent</span>
                    ) : (
                      <button className="btn-outline" style={{ fontSize: '0.75rem', padding: '0.35rem 0.9rem' }}
                        onClick={() => { setReminded(p => new Set(p).add(ind.id)); toast(`Reminder sent to ${ind.name}`, { icon: '📧' }); }}>
                        Send Reminder
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Missing reports */}
          <div className="section-card">
            <div className="section-title">Missing Monthly Reports — Follow Up</div>
            <table className="gov-table">
              <thead><tr><th>Industry</th><th>District</th><th>Due Date</th><th>Days Overdue</th><th>Action</th></tr></thead>
              <tbody>
                {MISSING.map(r => (
                  <tr key={r.industry}>
                    <td style={{ fontWeight: '600' }}>{r.industry}</td>
                    <td style={{ color: '#6b8c7a' }}>{r.district}</td>
                    <td style={{ color: '#d4680a' }}>{r.due}</td>
                    <td style={{ color: '#c0392b', fontWeight: '700' }}>{Math.round((new Date('2024-07-15').getTime() - new Date(r.due).getTime()) / 86400000)} days</td>
                    <td>
                      {reminded.has(r.industry) ? (
                        <span style={{ fontSize: '0.75rem', color: '#1a6b3a', fontWeight: '600' }}>✓ Sent</span>
                      ) : (
                        <button className="btn-outline" style={{ fontSize: '0.72rem', padding: '0.25rem 0.7rem' }}
                          onClick={() => { setReminded(p => new Set(p).add(r.industry)); toast(`Reminder sent to ${r.industry}`, { icon: '📧' }); }}>
                          Send Reminder
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* My stations */}
          <div className="section-card">
            <div className="section-title">My Zone Stations</div>
            <table className="gov-table">
              <thead><tr><th>Station</th><th>District</th><th>AQI</th><th>SO₂</th><th>NO₂</th><th>Status</th></tr></thead>
              <tbody>
                {myStations.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: '500' }}>{s.name}</td>
                    <td style={{ color: '#6b8c7a' }}>{s.district}</td>
                    <td style={{ fontWeight: '700', color: s.status === 'breach' ? '#c0392b' : s.status === 'warning' ? '#d4680a' : '#1a6b3a' }}>{s.aqi}</td>
                    <td style={{ color: s.so2 > PRESCRIBED_LIMITS.so2 ? '#c0392b' : '#1a2e22', fontWeight: s.so2 > PRESCRIBED_LIMITS.so2 ? '700' : '400' }}>{s.so2}</td>
                    <td>{s.no2}</td>
                    <td><span className={`badge-${s.status}`}>{s.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  );
}
