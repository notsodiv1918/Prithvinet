'use client';
import PageShell from '@/components/PageShell';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { REPORTS } from '@/data/mockData';
import toast, { Toaster } from 'react-hot-toast';

export default function IndustryReports() {
  const router = useRouter();
  const { user, mounted } = useAuth({ allowedRoles:['Industry User'] });

  if (!mounted || !user) return <PageShell loading />;

  const myReports    = REPORTS.filter(r => r.industry === 'Bharat Steel Works');
  const compliant    = myReports.filter(r => r.status === 'Compliant').length;
  const nonCompliant = myReports.filter(r => r.status === 'Non-Compliant').length;
  const rate         = Math.round((compliant / myReports.length) * 100);

  return (
    <PageShell>
      <Toaster position="top-right" toastOptions={{ style:{ background:'white', color:'var(--text-dark)', border:'1px solid var(--border)', fontFamily:'Arial', fontSize:'0.82rem' } }} />
      <div className="breadcrumb">
        <span>Home</span><span>›</span>
        <a onClick={() => router.push('/industry-dashboard')} style={{ cursor:'pointer' }}>My Dashboard</a>
        <span>›</span>
        <span style={{ color:'var(--navy)', fontWeight:'700' }}>Past Reports</span>
      </div>
      <div className="live-bar">
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <span className="live-dot" />
          <span style={{ fontSize:'0.72rem', fontWeight:'700', color:'#22c55e', fontFamily:'Arial' }}>LIVE</span>
          <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'Arial', marginLeft:'0.35rem' }}>
            {myReports.length} submissions · {rate}% compliance rate · Bharat Steel Works
          </span>
        </div>
        <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'Arial' }}>Industry Compliance History</span>
      </div>
      <div className="main-content" style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem' }}>
          {[
            { label:'Total Reports',   value:myReports.length, color:'var(--accent-blue)'  },
            { label:'Compliant',       value:compliant,        color:'var(--accent-green)' },
            { label:'Non-Compliant',   value:nonCompliant,     color:'var(--danger)'       },
            { label:'Compliance Rate', value:`${rate}%`,       color:rate<50?'var(--danger)':'#d4680a' },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ borderTopColor:s.color }}>
              <div style={{ fontSize:'0.63rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'0.3rem', fontFamily:'Arial' }}>{s.label}</div>
              <div style={{ fontSize:'2rem', fontWeight:'800', color:s.color, lineHeight:1, fontFamily:'Georgia' }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="alert-warning">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <strong style={{ fontSize:'0.82rem', color:'#856404' }}>Monthly Report Due: 31 July 2024</strong>
              <div style={{ fontSize:'0.72rem', color:'#856404', marginTop:'0.2rem', lineHeight:1.7 }}>
                Your monthly emissions report has not been submitted yet. Failure to submit by the deadline may result in non-compliance action.
              </div>
            </div>
            <button className="btn-primary" style={{ flexShrink:0, marginLeft:'1.25rem' }} onClick={() => router.push('/submit')}>Submit Now</button>
          </div>
        </div>

        <div className="section-card">
          <div className="section-title">Submission History — Bharat Steel Works</div>
          <div style={{ overflowX:'auto' }}>
            <table className="gov-table">
              <thead><tr><th>Report ID</th><th>Type</th><th>Date</th><th>Parameters</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {myReports.map(r => (
                  <tr key={r.id}>
                    <td style={{ color:'var(--accent-green)', fontFamily:'monospace', fontWeight:'600', fontSize:'0.78rem' }}>{r.id}</td>
                    <td>
                      <span style={{ background:r.type==='Monthly'?'#e8f0f8':'#e8f5ee', color:r.type==='Monthly'?'var(--accent-blue)':'var(--accent-green)', padding:'2px 9px', borderRadius:'10px', fontSize:'0.67rem', fontWeight:'700', fontFamily:'Arial', border:`1px solid ${r.type==='Monthly'?'#c8d4e8':'#c8e0d2'}` }}>
                        {r.type}
                      </span>
                    </td>
                    <td style={{ color:'var(--text-muted)', fontSize:'0.8rem' }}>{r.date}</td>
                    <td style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{r.parameters}</td>
                    <td><span className={r.status==='Compliant'?'badge-compliant':r.status==='Non-Compliant'?'badge-noncompliant':'badge-pending'}>{r.status}</span></td>
                    <td><button className="btn-outline" style={{ fontSize:'0.7rem', padding:'0.22rem 0.6rem' }} onClick={() => toast(`Report ${r.id} downloaded`, { icon:'📄' })}>Download</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="section-card" style={{ borderLeft:'4px solid var(--danger)', background:'#fef8f8' }}>
          <div className="section-title" style={{ color:'var(--danger)' }}>Notice from Regional Officer</div>
          <p style={{ fontSize:'0.82rem', color:'#721c24', lineHeight:1.8, fontFamily:'Arial' }}>
            Your facility has recorded <strong>non-compliant emissions on 5 of the last 7 reporting days</strong>. SO₂ levels have consistently exceeded the prescribed limit of 80 ppm. You are required to submit a corrective action plan within 7 days and ensure all pollution control equipment is functioning. Failure to comply may result in a formal show-cause notice under the Environment (Protection) Act, 1986.
          </p>
          <div style={{ marginTop:'0.75rem', fontSize:'0.72rem', color:'#721c24', fontWeight:'700', fontFamily:'Arial' }}>
            — Rajesh Kumar, Regional Officer, Nagpur · 15 July 2024
          </div>
        </div>

      </div>
    </PageShell>
  );
}
