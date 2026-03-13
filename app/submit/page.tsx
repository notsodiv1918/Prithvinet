'use client';
import PageShell from '@/components/PageShell';
import { useAuth } from '@/lib/useAuth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PRESCRIBED_LIMITS, REPORTS } from '@/data/mockData';
import toast, { Toaster } from 'react-hot-toast';

export default function SubmitPage() {
  const router = useRouter();
  const { user, mounted } = useAuth({ allowedRoles:['Industry User'] });
  const [form, setForm] = useState({ so2:'', no2:'', pm25:'', noise:'', notes:'', date:new Date().toISOString().split('T')[0] });
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  if (!mounted || !user) return <PageShell loading />;

  const monthlySubmitted = REPORTS.some(r => r.type==='Monthly' && r.date.startsWith('2024-07'));

  const handle = (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); toast.success('Report submitted. Ref: RPT-' + Math.floor(Math.random()*9000+1000), { duration:4000 }); }, 800);
  };

  const fields = [
    { key:'so2',   label:'SO₂',         unit:'ppm',   limit:PRESCRIBED_LIMITS.so2 },
    { key:'no2',   label:'NO₂',         unit:'ppm',   limit:PRESCRIBED_LIMITS.no2 },
    { key:'pm25',  label:'PM2.5',       unit:'µg/m³', limit:PRESCRIBED_LIMITS.pm25 },
    { key:'noise', label:'Noise Level', unit:'dB(A)', limit:PRESCRIBED_LIMITS.noiseDay },
  ];

  return (
    <PageShell>
      <Toaster position="top-right" toastOptions={{ style:{ background:'white', color:'var(--text-dark)', border:'1px solid var(--border)', fontFamily:'Arial', fontSize:'0.82rem' } }} />
      <div className="breadcrumb">
        <span>Home</span><span>›</span>
        <a onClick={() => router.push('/industry-dashboard')} style={{ cursor:'pointer' }}>My Dashboard</a>
        <span>›</span>
        <span style={{ color:'var(--navy)', fontWeight:'700' }}>Submit Report</span>
      </div>
      <div className="live-bar">
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <span className="live-dot" />
          <span style={{ fontSize:'0.72rem', fontWeight:'700', color:'#22c55e', fontFamily:'Arial' }}>LIVE</span>
          <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'Arial', marginLeft:'0.35rem' }}>
            Bharat Steel Works, Nagpur · Monthly Report Portal
          </span>
        </div>
        <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'Arial' }}>Industry User Portal</span>
      </div>
      <div className="main-content" style={{ maxWidth:'740px', display:'flex', flexDirection:'column', gap:'1.25rem' }}>

        <div className="alert-critical">
          <strong style={{ fontSize:'0.8rem', color:'#721c24' }}>Compliance Notice — Immediate Action Required</strong>
          <div style={{ fontSize:'0.75rem', color:'#721c24', marginTop:'0.25rem', lineHeight:1.7 }}>
            Your facility has exceeded prescribed SO2 limits on 5 of the last 7 days. Monthly report is due by 31 July 2024. Submitting accurate data is mandatory under the Environment (Protection) Act, 1986.
          </div>
        </div>

        <div style={{ background:'white', border:'1px solid var(--border)', borderRadius:'4px', padding:'0.85rem 1.1rem', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 1px 3px rgba(26,39,68,0.06)' }}>
          <div>
            <div style={{ fontSize:'0.82rem', fontWeight:'700', color:'var(--text-dark)', fontFamily:'Georgia' }}>July 2024 Monthly Report</div>
            <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'Arial', marginTop:'0.1rem' }}>Period: 1 July - 31 July 2024 · Due: 31 July 2024</div>
          </div>
          <span className={monthlySubmitted ? 'badge-compliant' : 'badge-pending'}>
            {monthlySubmitted ? 'Submitted' : 'Pending'}
          </span>
        </div>

        <div className="section-card">
          <div className="section-title">Monthly Emissions Report Form</div>
          {submitted ? (
            <div style={{ textAlign:'center', padding:'2.5rem 1rem', background:'#f0f8f3', borderRadius:'4px', border:'1px solid #c8dfc8' }}>
              <div style={{ fontSize:'3rem', marginBottom:'0.75rem' }}>✅</div>
              <div style={{ fontSize:'1rem', fontWeight:'700', color:'var(--accent-green)', fontFamily:'Georgia', marginBottom:'0.4rem' }}>Report Submitted Successfully</div>
              <div style={{ fontSize:'0.8rem', color:'var(--text-muted)', fontFamily:'Arial', marginBottom:'1.5rem' }}>Assigned to Rajesh Kumar (Regional Officer, Nagpur) for review.</div>
              <div style={{ display:'flex', gap:'0.6rem', justifyContent:'center' }}>
                <button className="btn-primary" onClick={() => setSubmitted(false)}>Submit Another</button>
                <button className="btn-outline" onClick={() => router.push('/industry-reports')}>View My Reports</button>
              </div>
            </div>
          ) : (
            <form onSubmit={handle}>
              <div style={{ marginBottom:'1rem' }}>
                <label style={{ display:'block', fontSize:'0.68rem', fontWeight:'700', color:'var(--text-mid)', textTransform:'uppercase', letterSpacing:'0.07em', fontFamily:'Arial', marginBottom:'0.35rem' }}>
                  Reporting Period *
                </label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({...f,date:e.target.value}))}
                  style={{ border:'1.5px solid var(--border)', borderRadius:'4px', padding:'0.5rem 0.75rem', color:'var(--text-dark)', fontSize:'0.875rem', fontFamily:'Arial', background:'var(--off-white)', width:'210px', outline:'none' }} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
                {fields.map(f => {
                  const val = Number((form as any)[f.key]);
                  const over = val > 0 && val > f.limit;
                  return (
                    <div key={f.key}>
                      <label style={{ display:'block', fontSize:'0.68rem', fontWeight:'700', color:'var(--text-mid)', textTransform:'uppercase', letterSpacing:'0.07em', fontFamily:'Arial', marginBottom:'0.35rem' }}>
                        {f.label} ({f.unit}) *
                        <span style={{ marginLeft:'0.5rem', color:'var(--text-muted)', fontWeight:400, fontSize:'0.65rem', textTransform:'none' }}>Limit: {f.limit}</span>
                      </label>
                      <input type="number" placeholder={`Enter ${f.label}`} value={(form as any)[f.key]}
                        onChange={e => setForm(fv => ({...fv,[f.key]:e.target.value}))} required
                        style={{ width:'100%', border:`1.5px solid ${over?'#f5c6cb':'var(--border)'}`, borderRadius:'4px', padding:'0.5rem 0.75rem', color:'var(--text-dark)', fontSize:'0.875rem', fontFamily:'Arial', background:'var(--off-white)', outline:'none' }} />
                      {over && <div style={{ fontSize:'0.68rem', color:'var(--danger)', marginTop:'0.25rem', background:'#fdf0ee', padding:'0.2rem 0.5rem', borderRadius:'3px', fontFamily:'Arial' }}>Exceeds limit by {val - f.limit} {f.unit}</div>}
                    </div>
                  );
                })}
              </div>
              <div style={{ marginBottom:'1.25rem' }}>
                <label style={{ display:'block', fontSize:'0.68rem', fontWeight:'700', color:'var(--text-mid)', textTransform:'uppercase', letterSpacing:'0.07em', fontFamily:'Arial', marginBottom:'0.35rem' }}>Remarks / Operational Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({...f,notes:e.target.value}))} rows={3}
                  placeholder="Maintenance activities, equipment issues, or explanations for any exceedances..."
                  style={{ width:'100%', border:'1.5px solid var(--border)', borderRadius:'4px', padding:'0.55rem 0.75rem', color:'var(--text-dark)', fontSize:'0.875rem', fontFamily:'Arial', background:'var(--off-white)', resize:'vertical', outline:'none' }} />
              </div>
              <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1rem' }}>
                <button type="submit" disabled={loading} className="btn-primary" style={{ padding:'0.6rem 2rem' }}>
                  {loading ? 'Submitting...' : 'Submit Monthly Report'}
                </button>
                <button type="button" className="btn-outline" onClick={() => setForm({ so2:'', no2:'', pm25:'', noise:'', notes:'', date:new Date().toISOString().split('T')[0] })}>Clear Form</button>
              </div>
              <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', fontFamily:'Arial', background:'var(--off-white)', padding:'0.6rem 0.85rem', borderRadius:'4px', border:'1px solid var(--border)', lineHeight:1.8 }}>
                By submitting, you certify this data is accurate under the Environment (Protection) Rules, 1986. False reporting is punishable under Section 15 of the Act.
              </div>
            </form>
          )}
        </div>

        <div className="section-card">
          <div className="section-title">Prescribed Limits Reference</div>
          <table className="gov-table">
            <thead><tr><th>Parameter</th><th>Prescribed Limit</th><th>Unit</th><th>Regulatory Authority</th></tr></thead>
            <tbody>
              {[['SO₂',PRESCRIBED_LIMITS.so2,'ppm','MPCB / CPCB'],['NO₂',PRESCRIBED_LIMITS.no2,'ppm','MPCB / CPCB'],['PM2.5',PRESCRIBED_LIMITS.pm25,'µg/m³','MPCB / CPCB'],['Noise (Day)',PRESCRIBED_LIMITS.noiseDay,'dB(A)','Noise Pollution Rules, 2000']].map(([p,v,u,a]) => (
                <tr key={String(p)}>
                  <td style={{ fontWeight:'600' }}>{p}</td>
                  <td style={{ color:'var(--danger)', fontWeight:'800', fontFamily:'Georgia' }}>{v}</td>
                  <td style={{ color:'var(--text-muted)' }}>{u}</td>
                  <td style={{ color:'var(--text-muted)', fontSize:'0.75rem' }}>{a}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </PageShell>
  );
}
