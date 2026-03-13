'use client';
import PageShell from '@/components/PageShell';
import { useAuth } from '@/lib/useAuth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { STATIONS, INDUSTRIES, PRESCRIBED_LIMITS } from '@/data/mockData';
import toast, { Toaster } from 'react-hot-toast';

const MISSING = [
  { industry:'Vidarbha Coal Ltd',    district:'Nagpur',     due:'2024-07-13', type:'Monthly' },
  { industry:'Konkan Fertilizers',   district:'Ratnagiri',  due:'2024-07-12', type:'Monthly' },
  { industry:'Latur Cement Works',   district:'Latur',      due:'2024-07-10', type:'Daily'   },
];

export default function AlertsPage() {
  const router = useRouter();
  const { user, mounted } = useAuth({ allowedRoles:['Super Admin','Regional Officer','Monitoring Team'] });
  const [escalated,   setEscalated]   = useState<Set<string>>(new Set());
  const [reminded,    setReminded]    = useState<Set<string>>(new Set());
  const [inspections, setInspections] = useState<Set<string>>(new Set());

  if (!mounted || !user) return <PageShell loading />;

  const isRO           = user.role === 'Regional Officer';
  const breachStations = STATIONS.filter(s => s.status === 'breach');
  const warnStations   = STATIONS.filter(s => s.status === 'warning');
  const myIndustries   = isRO ? INDUSTRIES.filter(i => i.assignedRO === 'Rajesh Kumar') : INDUSTRIES;
  const myMissing      = isRO ? MISSING.filter(m => m.district === 'Nagpur') : MISSING;

  return (
    <PageShell>
      <Toaster position="top-right" toastOptions={{ style:{ background:'white', color:'var(--text-dark)', border:'1px solid var(--border)', fontFamily:'Arial', fontSize:'0.82rem' } }} />
      <div className="breadcrumb">
        <span>🏠 Home</span><span>›</span>
        <a onClick={() => router.push('/dashboard')} style={{ cursor:'pointer' }}>Dashboard</a>
        <span>›</span>
        <span style={{ color:'var(--danger)', fontWeight:'700' }}>⚐ Alerts &amp; Notices</span>
      </div>
      <div className="live-bar">
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <span className="live-dot" />
          <span style={{ fontSize:'0.72rem', fontWeight:'700', color:'var(--danger)', fontFamily:'Arial', letterSpacing:'0.05em' }}>
            {breachStations.length} ACTIVE BREACH{breachStations.length !== 1 ? 'ES' : ''}
          </span>
          <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'Arial', marginLeft:'0.35rem' }}>
            · {warnStations.length} warnings · {myMissing.length} missing reports
          </span>
        </div>
        <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'Arial' }}>
          {isRO ? 'Nagpur Zone' : 'Maharashtra — All Zones'}
        </span>
      </div>
      <div className="main-content" style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>

        {isRO && (
          <div className="alert-info">
            <strong style={{ fontSize:'0.78rem' }}>ℹ Regional Officer — Nagpur Zone</strong>
            <div style={{ fontSize:'0.73rem', marginTop:'0.2rem', lineHeight:1.7 }}>
              You can send reminders and schedule inspections for your assigned region. For system-wide actions, contact the Super Admin via <strong>Messages</strong>.
            </div>
          </div>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem' }}>
          {[
            { label:'Active Breaches', value:breachStations.length, color:'var(--danger)',      bg:'#fdf0ee', bdr:'#f5c6cb' },
            { label:'Active Warnings', value:warnStations.length,   color:'#d4680a',            bg:'#fef6ee', bdr:'#ffd966' },
            { label:'Missing Reports', value:myMissing.length,       color:'var(--accent-blue)', bg:'#e8f0f8', bdr:'#c8d4e8' },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ borderTopColor:s.color, display:'flex', alignItems:'center', gap:'1rem' }}>
              <div style={{ fontSize:'2.6rem', fontWeight:'800', color:s.color, lineHeight:1, fontFamily:'Georgia' }}>{s.value}</div>
              <div style={{ fontSize:'0.8rem', fontWeight:'700', color:s.color, fontFamily:'Arial' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="section-card">
          <div className="section-title" style={{ color:'var(--danger)' }}>🚨 Active Breaches — Immediate Action Required</div>
          <div style={{ overflowX:'auto' }}>
            <table className="gov-table">
              <thead><tr><th>Station</th><th>District</th><th>AQI</th><th>SO₂ ppm</th><th>NO₂ ppm</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {breachStations.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight:'600' }}>{s.name}</td>
                    <td style={{ color:'var(--text-muted)' }}>{s.district}</td>
                    <td style={{ color:'var(--danger)', fontWeight:'800', fontFamily:'Georgia' }}>{s.aqi}</td>
                    <td style={{ color:s.so2>PRESCRIBED_LIMITS.so2?'var(--danger)':'var(--text-dark)', fontWeight:s.so2>PRESCRIBED_LIMITS.so2?'700':'400' }}>{s.so2}</td>
                    <td>{s.no2}</td>
                    <td><span className="badge-breach">Breach</span></td>
                    <td>
                      {isRO ? (
                        inspections.has(s.id)
                          ? <span style={{ fontSize:'0.73rem', color:'var(--accent-green)', fontWeight:'700', fontFamily:'Arial' }}>✓ Inspection Scheduled</span>
                          : <button className="btn-danger" style={{ fontSize:'0.7rem', padding:'0.25rem 0.65rem' }}
                              onClick={() => { setInspections(p => new Set(p).add(s.id)); toast.error(`Inspection scheduled: ${s.name}`, { icon:'📋' }); }}>
                              Schedule Inspection
                            </button>
                      ) : (
                        escalated.has(s.id)
                          ? <span style={{ fontSize:'0.73rem', color:'var(--accent-green)', fontWeight:'700', fontFamily:'Arial' }}>✓ Escalated to RO</span>
                          : <button className="btn-danger" style={{ fontSize:'0.7rem', padding:'0.25rem 0.65rem' }}
                              onClick={() => { setEscalated(p => new Set(p).add(s.id)); toast.error(`Escalated: ${s.name}`, { icon:'🚨' }); }}>
                              Escalate to RO
                            </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="section-card">
          <div className="section-title">🏭 {isRO ? 'My Industry Compliance Actions' : 'Industry Non-Compliance Tracker'}</div>
          <div style={{ overflowX:'auto' }}>
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Industry</th><th>District</th><th>Compliance</th>
                  <th>SO₂ ppm</th><th>NO₂ ppm</th>
                  {!isRO && <th>Assigned RO</th>}
                  <th>Reminder</th><th>Inspection</th>
                </tr>
              </thead>
              <tbody>
                {myIndustries.filter(i => i.complianceRate < 80).map(ind => (
                  <tr key={ind.id}>
                    <td style={{ fontWeight:'600' }}>{ind.name}</td>
                    <td style={{ color:'var(--text-muted)' }}>{ind.district}</td>
                    <td style={{ color:ind.complianceRate<50?'var(--danger)':'#d4680a', fontWeight:'800', fontFamily:'Georgia' }}>{ind.complianceRate}%</td>
                    <td style={{ color:ind.currentSo2>PRESCRIBED_LIMITS.so2?'var(--danger)':'var(--text-dark)', fontWeight:ind.currentSo2>PRESCRIBED_LIMITS.so2?'700':'400' }}>{ind.currentSo2}</td>
                    <td>{ind.currentNo2}</td>
                    {!isRO && <td style={{ fontSize:'0.78rem', color:'var(--accent-green)' }}>{ind.assignedRO}</td>}
                    <td>
                      {reminded.has(ind.id+'-rem')
                        ? <span style={{ fontSize:'0.73rem', color:'var(--accent-green)', fontWeight:'700', fontFamily:'Arial' }}>✓ Sent</span>
                        : <button className="btn-outline" style={{ fontSize:'0.7rem', padding:'0.25rem 0.65rem' }}
                            onClick={() => { setReminded(p => new Set(p).add(ind.id+'-rem')); toast(`Reminder sent to ${ind.name}`, { icon:'📧' }); }}>
                            Send Reminder
                          </button>
                      }
                    </td>
                    <td>
                      {inspections.has(ind.id)
                        ? <span style={{ fontSize:'0.73rem', color:'var(--accent-green)', fontWeight:'700', fontFamily:'Arial' }}>✓ Scheduled</span>
                        : <button className="btn-danger" style={{ fontSize:'0.7rem', padding:'0.25rem 0.65rem' }}
                            onClick={() => { setInspections(p => new Set(p).add(ind.id)); toast.error(`Inspection: ${ind.name}`, { icon:'📋' }); }}>
                            Inspect
                          </button>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="section-card">
          <div className="section-title">📋 Missing Compliance Reports</div>
          <div style={{ overflowX:'auto' }}>
            <table className="gov-table">
              <thead><tr><th>Industry</th><th>District</th><th>Report Type</th><th>Due Date</th><th>Days Overdue</th><th>Reminder</th></tr></thead>
              <tbody>
                {myMissing.map(r => (
                  <tr key={r.industry}>
                    <td style={{ fontWeight:'600' }}>{r.industry}</td>
                    <td style={{ color:'var(--text-muted)' }}>{r.district}</td>
                    <td>{r.type}</td>
                    <td style={{ color:'#d4680a', fontWeight:'600' }}>{r.due}</td>
                    <td style={{ color:'var(--danger)', fontWeight:'800', fontFamily:'Georgia' }}>
                      {Math.round((new Date('2024-07-15').getTime()-new Date(r.due).getTime())/86400000)} days
                    </td>
                    <td>
                      {reminded.has(r.industry)
                        ? <span style={{ fontSize:'0.73rem', color:'var(--accent-green)', fontWeight:'700', fontFamily:'Arial' }}>✓ Reminder Sent</span>
                        : <button className="btn-outline" style={{ fontSize:'0.7rem', padding:'0.25rem 0.65rem' }}
                            onClick={() => { setReminded(p => new Set(p).add(r.industry)); toast(`Reminder sent to ${r.industry}`, { icon:'📧' }); }}>
                            Send Reminder
                          </button>
                      }
                    </td>
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
