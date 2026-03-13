'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { STATIONS, INDUSTRIES, PRESCRIBED_LIMITS } from '@/data/mockData';
import toast, { Toaster } from 'react-hot-toast';

const MISSING = [
  { industry:'Vidarbha Coal Ltd', district:'Nagpur', due:'2024-07-13', type:'Daily' },
  { industry:'Konkan Fertilizers', district:'Ratnagiri', due:'2024-07-12', type:'Monthly' },
  { industry:'Latur Cement Works', district:'Latur', due:'2024-07-10', type:'Daily' },
];

export default function AlertsPage() {
  const [escalated, setEscalated] = useState<Set<string>>(new Set());
  const [reminded, setReminded] = useState<Set<string>>(new Set());

  const breachStations = STATIONS.filter(s => s.status==='breach');
  const warnStations = STATIONS.filter(s => s.status==='warning');

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#f0f8f3' }}>
      <Sidebar />
      <main style={{ flex:1, overflow:'auto' }}>
        <TopBar title="Alerts & Compliance" subtitle="Active breach alerts, escalation workflow and missing reports" />
        <div style={{ background:'white', borderBottom:'1px solid #e8f5ee', padding:'0.5rem 1.5rem' }}>
          <span style={{ fontSize:'0.7rem', color:'#6b8c7a' }}>Home › </span>
          <span style={{ fontSize:'0.7rem', color:'#1a6b3a', fontWeight:'600' }}>Alerts & Compliance</span>
        </div>
        <Toaster position="top-right" toastOptions={{ style:{ background:'white', color:'#1a2e22', border:'1px solid #c8e0d2' } }} />

        <div style={{ padding:'1.25rem 1.5rem' }}>

          {/* Summary cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'1.25rem' }}>
            {[
              { label:'Active Breaches', value:breachStations.length, color:'#c0392b', bg:'#fdf0ee', border:'#f5c6cb' },
              { label:'Active Warnings', value:warnStations.length, color:'#d4680a', bg:'#fef6ee', border:'#ffd966' },
              { label:'Missing Reports', value:MISSING.length, color:'#1a4e8a', bg:'#e8f0ff', border:'#b8d0f0' },
            ].map(s => (
              <div key={s.label} style={{ background:s.bg, border:`1px solid ${s.border}`, borderLeft:`4px solid ${s.color}`, borderRadius:'4px', padding:'1rem', display:'flex', alignItems:'center', gap:'1rem' }}>
                <div style={{ fontSize:'2.5rem', fontWeight:'800', color:s.color, lineHeight:1 }}>{s.value}</div>
                <div style={{ fontSize:'0.82rem', fontWeight:'600', color:s.color }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Breach alert banner */}
          {breachStations.length > 0 && (
            <div style={{ background:'#fdf0ee', border:'1px solid #f5c6cb', borderLeft:'4px solid #c0392b', borderRadius:'4px', padding:'0.75rem 1rem', marginBottom:'1.25rem', display:'flex', gap:'0.75rem' }}>
              <span style={{ fontSize:'1rem' }}>⚠️</span>
              <div style={{ fontSize:'0.8rem', color:'#721c24', lineHeight:1.6 }}>
                <strong>{breachStations.length} monitoring stations</strong> are currently recording values above prescribed limits.
                Immediate action is required. Please escalate to the concerned Regional Officer.
              </div>
            </div>
          )}

          {/* Active Breaches Table */}
          <div className="section-card">
            <div className="section-title" style={{ color:'#c0392b', borderBottomColor:'#f8d7da' }}>Active Breaches — Immediate Action Required</div>
            <div style={{ overflowX:'auto' }}>
              <table className="gov-table">
                <thead>
                  <tr><th>Station Name</th><th>District</th><th>Parameter</th><th>Current Value</th><th>Prescribed Limit</th><th>Excess %</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {breachStations.map(s => {
                    const params = [
                      s.so2>PRESCRIBED_LIMITS.so2?['SO₂',s.so2,PRESCRIBED_LIMITS.so2]:null,
                      s.no2>PRESCRIBED_LIMITS.no2?['NO₂',s.no2,PRESCRIBED_LIMITS.no2]:null,
                      s.pm25>PRESCRIBED_LIMITS.pm25?['PM2.5',s.pm25,PRESCRIBED_LIMITS.pm25]:null,
                    ].filter(Boolean);
                    return params.slice(0,1).map(param => (
                      <tr key={s.id}>
                        <td style={{ fontWeight:'600' }}>{s.name}</td>
                        <td style={{ color:'#6b8c7a' }}>{s.district}</td>
                        <td style={{ color:'#1a6b3a', fontWeight:'600' }}>{param![0]} ppm</td>
                        <td style={{ color:'#c0392b', fontWeight:'700' }}>{param![1]}</td>
                        <td style={{ color:'#6b8c7a' }}>{param![2]}</td>
                        <td style={{ color:'#c0392b', fontWeight:'700' }}>+{Math.round(((Number(param![1])-Number(param![2]))/Number(param![2]))*100)}%</td>
                        <td><span className="badge-breach">BREACH</span></td>
                        <td>
                          {escalated.has(s.id) ? (
                            <span style={{ fontSize:'0.75rem', color:'#1a6b3a', fontWeight:'600' }}>✓ Escalated</span>
                          ) : (
                            <button className="btn-danger" style={{ fontSize:'0.72rem', padding:'0.3rem 0.8rem' }}
                              onClick={() => { setEscalated(p=>new Set(p).add(s.id)); toast.error(`Alert escalated to RO for ${s.name}`,{icon:'📋'}); }}>
                              Escalate to RO
                            </button>
                          )}
                        </td>
                      </tr>
                    ));
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Warnings Table */}
          <div className="section-card">
            <div className="section-title" style={{ color:'#d4680a', borderBottomColor:'#fff3cd' }}>Active Warnings — Monitor Closely</div>
            <div style={{ overflowX:'auto' }}>
              <table className="gov-table">
                <thead><tr><th>Station</th><th>District</th><th>AQI</th><th>SO₂</th><th>NO₂</th><th>PM2.5</th><th>Status</th></tr></thead>
                <tbody>
                  {warnStations.map(s=>(
                    <tr key={s.id}>
                      <td style={{ fontWeight:'600' }}>{s.name}</td>
                      <td style={{ color:'#6b8c7a' }}>{s.district}</td>
                      <td style={{ color:'#d4680a', fontWeight:'700' }}>{s.aqi}</td>
                      <td>{s.so2}</td><td>{s.no2}</td><td>{s.pm25}</td>
                      <td><span className="badge-warning">WARNING</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Industry non-compliance */}
          <div className="section-card">
            <div className="section-title">Industry Non-Compliance Tracker</div>
            <div style={{ overflowX:'auto' }}>
              <table className="gov-table">
                <thead><tr><th>Industry</th><th>Type</th><th>District</th><th>Compliance</th><th>SO₂</th><th>NO₂</th><th>Days Breached (7d)</th><th>Assigned RO</th></tr></thead>
                <tbody>
                  {INDUSTRIES.filter(i=>i.complianceRate<80).map(ind=>{
                    const days=ind.history.filter(h=>h.so2>PRESCRIBED_LIMITS.so2).length;
                    return (
                      <tr key={ind.id}>
                        <td style={{ fontWeight:'600' }}>{ind.name}</td>
                        <td style={{ color:'#6b8c7a', fontSize:'0.78rem' }}>{ind.type}</td>
                        <td style={{ color:'#6b8c7a' }}>{ind.district}</td>
                        <td style={{ color:ind.complianceRate<50?'#c0392b':'#d4680a', fontWeight:'700' }}>{ind.complianceRate}%</td>
                        <td style={{ color:ind.currentSo2>PRESCRIBED_LIMITS.so2?'#c0392b':'#1a2e22', fontWeight:'600' }}>{ind.currentSo2}</td>
                        <td style={{ color:ind.currentNo2>PRESCRIBED_LIMITS.no2?'#c0392b':'#1a2e22' }}>{ind.currentNo2}</td>
                        <td style={{ color:'#c0392b', fontWeight:'700' }}>{days}/7</td>
                        <td style={{ color:'#1a6b3a', fontSize:'0.78rem' }}>{ind.assignedRO}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Missing Reports */}
          <div className="section-card">
            <div className="section-title">Missing Reports — Follow-up Required</div>
            <div style={{ overflowX:'auto' }}>
              <table className="gov-table">
                <thead><tr><th>Industry</th><th>District</th><th>Report Type</th><th>Due Date</th><th>Days Overdue</th><th>Action</th></tr></thead>
                <tbody>
                  {MISSING.map(r=>(
                    <tr key={r.industry}>
                      <td style={{ fontWeight:'600' }}>{r.industry}</td>
                      <td style={{ color:'#6b8c7a' }}>{r.district}</td>
                      <td>{r.type}</td>
                      <td style={{ color:'#d4680a' }}>{r.due}</td>
                      <td style={{ color:'#c0392b', fontWeight:'700' }}>
                        {Math.round((new Date('2024-07-15').getTime()-new Date(r.due).getTime())/86400000)} days
                      </td>
                      <td>
                        {reminded.has(r.industry) ? (
                          <span style={{ fontSize:'0.75rem', color:'#1a6b3a', fontWeight:'600' }}>✓ Reminder Sent</span>
                        ) : (
                          <button className="btn-outline" style={{ fontSize:'0.72rem', padding:'0.3rem 0.8rem' }}
                            onClick={()=>{ setReminded(p=>new Set(p).add(r.industry)); toast(`Reminder sent to ${r.industry}`,{icon:'📧'}); }}>
                            Send Reminder
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
