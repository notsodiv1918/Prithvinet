'use client';
import PageShell from '@/components/PageShell';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { PRESCRIBED_LIMITS } from '@/data/mockData';
import toast, { Toaster } from 'react-hot-toast';

const ACTIVE_ALERTS = [
  { id:'A001', pollutant:'SO₂', current:142, limit:80,  unit:'ppm', since:'5 days ago', action:'Inspection Notice Issued' },
  { id:'A002', pollutant:'AQI', current:267, limit:100, unit:'',    since:'Today',      action:'Submit Report Required'  },
];
const RESOLVED = [
  { id:'R001', pollutant:'PM2.5', peak:78, limit:60, unit:'µg/m³', resolved:'Jan 2026', days:4 },
  { id:'R002', pollutant:'NO₂',   peak:72, limit:60, unit:'ppm',   resolved:'Nov 2025', days:2 },
  { id:'R003', pollutant:'SO₂',   peak:95, limit:80, unit:'ppm',   resolved:'Sep 2025', days:7 },
];

export default function IndustryAlertsPage() {
  const router = useRouter();
  const { user, mounted } = useAuth({ allowedRoles:['Industry User'] });

  if (!mounted || !user) return <PageShell loading />;

  return (
    <PageShell>
      <Toaster position="top-right" />
      <div className="breadcrumb">
        <span>Home</span><span>›</span>
        <a onClick={() => router.push('/industry-dashboard')} style={{ cursor:'pointer' }}>My Dashboard</a>
        <span>›</span>
        <span style={{ color:'var(--danger)', fontWeight:'700' }}>My Alerts</span>
      </div>
      <div className="live-bar">
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <span className="live-dot" />
          <span style={{ fontSize:'0.72rem', fontWeight:'700', color:'var(--danger)', fontFamily:'Arial', letterSpacing:'0.05em' }}>{ACTIVE_ALERTS.length} ACTIVE ALERTS</span>
        </div>
        <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'Arial' }}>Bharat Steel Works, Nagpur</div>
      </div>
      <div className="main-content" style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>

        <div className="section-card">
          <div className="section-title" style={{ color:'var(--danger)' }}>Active Alerts — Immediate Attention Required</div>
          {ACTIVE_ALERTS.map(a => (
            <div key={a.id} style={{ background:'#fdf0ee', border:'1px solid #f5c6cb', borderLeft:'5px solid var(--danger)', borderRadius:'4px', padding:'1rem 1.25rem', marginBottom:'0.85rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontSize:'0.88rem', fontWeight:'700', color:'#721c24', marginBottom:'0.25rem' }}>
                  {a.pollutant} Limit Breach — {a.current}{a.unit} (Limit: {a.limit}{a.unit})
                </div>
                <div style={{ fontSize:'0.72rem', color:'#721c24', display:'flex', gap:'1.5rem', fontFamily:'Arial' }}>
                  <span>Since: {a.since}</span>
                  <span>Required Action: {a.action}</span>
                  <span>Excess: +{a.current - a.limit}{a.unit}</span>
                </div>
              </div>
              <button className="btn-danger" style={{ flexShrink:0, marginLeft:'1rem' }}
                onClick={() => { toast.error(`Navigating to Submit Report for ${a.pollutant}`); setTimeout(() => router.push('/submit'), 800); }}>
                Submit Report
              </button>
            </div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem' }}>
          {[
            { label:'Active Breaches',     value:ACTIVE_ALERTS.length, color:'var(--danger)'        },
            { label:'Resolved This Year',  value:RESOLVED.length,      color:'var(--accent-green)'  },
            { label:'Compliance Rate',     value:'28%',                 color:'#856404'              },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ borderTopColor:s.color, textAlign:'center' }}>
              <div style={{ fontSize:'0.63rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'0.3rem', fontFamily:'Arial' }}>{s.label}</div>
              <div style={{ fontSize:'2.2rem', fontWeight:'800', color:s.color, fontFamily:'Georgia' }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="section-card">
          <div className="section-title" style={{ color:'var(--accent-green)' }}>Resolved Alerts — Historical</div>
          <table className="gov-table">
            <thead><tr><th>Pollutant</th><th>Peak Value</th><th>Prescribed Limit</th><th>Duration</th><th>Resolved</th></tr></thead>
            <tbody>
              {RESOLVED.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight:'600' }}>{r.pollutant}</td>
                  <td style={{ color:'#856404', fontWeight:'700' }}>{r.peak} {r.unit}</td>
                  <td style={{ color:'var(--text-muted)' }}>{r.limit} {r.unit}</td>
                  <td>{r.days} days</td>
                  <td><span className="badge-compliant">{r.resolved}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="alert-info">
          <strong style={{ fontSize:'0.82rem', color:'#1a2e4a' }}>Compliance Advisory</strong>
          <div style={{ fontSize:'0.75rem', color:'#3d5a6a', marginTop:'0.3rem', lineHeight:1.8 }}>
            Persistent SO₂ breaches for more than 7 consecutive days may result in an <strong>Inspection Notice</strong> from Regional Officer Rajesh Kumar. Submit monthly reports on time and ensure all pollution control equipment is operational. For queries, contact your Regional Officer via the Messages portal.
          </div>
        </div>

      </div>
    </PageShell>
  );
}
