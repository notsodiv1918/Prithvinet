'use client';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import TopBar from '@/components/TopBar';
import { STATIONS, INDUSTRIES, CHAT_MESSAGES, REPORTS, PRESCRIBED_LIMITS } from '@/data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const [liveData, setLiveData] = useState(STATIONS);

  useEffect(() => {
    const t = setInterval(() => {
      setLiveData(prev => prev.map(s => ({
        ...s,
        aqi: Math.max(30, s.aqi + Math.round((Math.random() - 0.5) * 6)),
        so2: Math.max(10, s.so2 + Math.round((Math.random() - 0.5) * 4)),
      })));
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const breaches = liveData.filter(s => s.status === 'breach').length;
  const warnings = liveData.filter(s => s.status === 'warning').length;
  const avgAqi = Math.round(liveData.reduce((a, s) => a + s.aqi, 0) / liveData.length);
  const unreadMsgs = CHAT_MESSAGES.filter(m => !m.read && m.to === 'Arjun Mehta').length;

  const trendData = INDUSTRIES[0].history.map((h, i) => ({
    date: h.date,
    'Bharat Steel SO₂': h.so2,
    'Textiles NO₂': INDUSTRIES[1].history[i].no2,
    'SO₂ Limit': PRESCRIBED_LIMITS.so2,
  }));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f8f3' }}>
      <AdminSidebar />
      <main style={{ flex: 1, overflow: 'auto' }}>
        <TopBar title="Super Admin Dashboard" subtitle="Full system overview — all regions, all industries" />
        <Toaster position="top-right" toastOptions={{ style: { background: 'white', color: '#1a2e22', border: '1px solid #c8e0d2' } }} />

        <div style={{ background: 'white', borderBottom: '1px solid #e8f5ee', padding: '0.5rem 1.5rem' }}>
          <span style={{ fontSize: '0.7rem', color: '#6b8c7a' }}>Home › </span>
          <span style={{ fontSize: '0.7rem', color: '#1a6b3a', fontWeight: '600' }}>Admin Dashboard</span>
        </div>

        <div style={{ padding: '1.25rem 1.5rem' }}>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
            {[
              { label: 'Active Stations', value: liveData.length, sub: 'Across Maharashtra', color: '#1a6b3a' },
              { label: 'Active Breaches', value: breaches, sub: `${warnings} warnings`, color: '#c0392b' },
              { label: 'Average AQI', value: avgAqi, sub: avgAqi > 100 ? 'Unhealthy range' : 'Moderate', color: avgAqi > 100 ? '#d4680a' : '#1a6b3a' },
              { label: 'Unread Messages', value: unreadMsgs, sub: 'From Regional Officers', color: '#1a4e8a', onClick: () => router.push('/chat') },
            ].map(s => (
              <div key={s.label} className="stat-card" style={{ borderTopColor: s.color, cursor: s.onClick ? 'pointer' : 'default' }} onClick={s.onClick}>
                <div style={{ fontSize: '0.68rem', color: '#6b8c7a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>{s.label}</div>
                <div style={{ fontSize: '2.2rem', fontWeight: '800', color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.7rem', color: '#6b8c7a', marginTop: '0.2rem' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Recent messages preview */}
          <div className="section-card" style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div className="section-title" style={{ marginBottom: 0 }}>Recent Messages — Rajesh Kumar (Regional Officer)</div>
              <button className="btn-outline" style={{ fontSize: '0.72rem', padding: '0.25rem 0.75rem' }} onClick={() => router.push('/chat')}>
                Open Chat →
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {CHAT_MESSAGES.slice(-3).map(m => (
                <div key={m.id} style={{ background: m.read ? '#f7fcf9' : '#e8f0ff', border: `1px solid ${m.read ? '#e8f5ee' : '#b8d0f0'}`, borderRadius: '4px', padding: '0.6rem 0.85rem', display: 'flex', gap: '0.75rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: m.from === 'Arjun Mehta' ? '#1a6b3a' : '#2d6a9f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '700', color: 'white', flexShrink: 0 }}>
                    {m.from.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: '600', color: '#1a2e22' }}>{m.from} <span style={{ color: '#6b8c7a', fontWeight: 400 }}>· {m.timestamp}</span> {!m.read && <span style={{ background: '#1a4e8a', color: 'white', borderRadius: '8px', padding: '1px 6px', fontSize: '0.6rem', marginLeft: '0.4rem' }}>NEW</span>}</div>
                    <div style={{ fontSize: '0.78rem', color: '#3d5a48', marginTop: '0.15rem' }}>{m.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            {/* SO2 trend */}
            <div className="section-card">
              <div className="section-title">7-Day SO₂ Trend vs Prescribed Limit</div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trendData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8f5ee" />
                  <XAxis dataKey="date" tick={{ fill: '#6b8c7a', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#6b8c7a', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: 'white', border: '1px solid #c8e0d2', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="Bharat Steel SO₂" stroke="#c0392b" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Textiles NO₂" stroke="#d4680a" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="SO₂ Limit" stroke="#1a6b3a" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Industry compliance */}
            <div className="section-card">
              <div className="section-title">Industry Compliance Overview</div>
              {INDUSTRIES.map(ind => (
                <div key={ind.id} style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#1a2e22' }}>{ind.name}</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: ind.complianceRate < 50 ? '#c0392b' : ind.complianceRate < 80 ? '#d4680a' : '#1a6b3a' }}>{ind.complianceRate}%</span>
                  </div>
                  <div style={{ background: '#e8f5ee', borderRadius: '3px', height: '8px' }}>
                    <div style={{ height: '100%', width: `${ind.complianceRate}%`, background: ind.complianceRate < 50 ? '#c0392b' : ind.complianceRate < 80 ? '#d4680a' : '#1a6b3a', borderRadius: '3px', transition: 'width 0.5s' }} />
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#6b8c7a', marginTop: '0.15rem' }}>RO: {ind.assignedRO} · SO₂: {ind.currentSo2} · NO₂: {ind.currentNo2}</div>
                </div>
              ))}
              <button className="btn-primary" style={{ width: '100%', marginTop: '0.5rem', fontSize: '0.75rem' }} onClick={() => router.push('/reports')}>
                View All Reports →
              </button>
            </div>
          </div>

          {/* Station table */}
          <div className="section-card">
            <div className="section-title">Live Station Readings — All Maharashtra</div>
            <div style={{ overflowX: 'auto' }}>
              <table className="gov-table">
                <thead>
                  <tr><th>ID</th><th>Station</th><th>District</th><th>AQI</th><th>SO₂</th><th>NO₂</th><th>PM2.5</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {liveData.map(s => (
                    <tr key={s.id}>
                      <td style={{ color: '#1a6b3a', fontFamily: 'monospace', fontSize: '0.78rem' }}>{s.id}</td>
                      <td style={{ fontWeight: '500' }}>{s.name}</td>
                      <td style={{ color: '#6b8c7a' }}>{s.district}</td>
                      <td style={{ fontWeight: '700', color: s.status === 'breach' ? '#c0392b' : s.status === 'warning' ? '#d4680a' : '#1a6b3a' }}>{s.aqi}</td>
                      <td style={{ color: s.so2 > PRESCRIBED_LIMITS.so2 ? '#c0392b' : '#1a2e22', fontWeight: s.so2 > PRESCRIBED_LIMITS.so2 ? '700' : '400' }}>{s.so2}</td>
                      <td style={{ color: s.no2 > PRESCRIBED_LIMITS.no2 ? '#c0392b' : '#1a2e22' }}>{s.no2}</td>
                      <td style={{ color: s.pm25 > PRESCRIBED_LIMITS.pm25 ? '#c0392b' : '#1a2e22' }}>{s.pm25}</td>
                      <td><span className={`badge-${s.status}`}>{s.status}</span></td>
                      <td>
                        {s.status === 'breach' && (
                          <button className="btn-danger" style={{ fontSize: '0.68rem', padding: '0.25rem 0.6rem' }}
                            onClick={() => toast.error(`Inspection scheduled: ${s.district}`, { icon: '📋' })}>
                            Inspect
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
