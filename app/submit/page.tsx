'use client';
import { useState } from 'react';
import IndustrySidebar from '@/components/IndustrySidebar';
import TopBar from '@/components/TopBar';
import { PRESCRIBED_LIMITS } from '@/data/mockData';
import toast, { Toaster } from 'react-hot-toast';

export default function SubmitPage() {
  const [form, setForm] = useState({ so2: '', no2: '', pm25: '', noise: '', notes: '', month: new Date().toISOString().slice(0, 7) });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); toast.success('Monthly report submitted. Ref: RPT-' + Math.floor(Math.random() * 9000 + 1000), { duration: 4000 }); }, 800);
  };

  const fields = [
    { key: 'so2', label: 'SO₂', unit: 'ppm', limit: PRESCRIBED_LIMITS.so2 },
    { key: 'no2', label: 'NO₂', unit: 'ppm', limit: PRESCRIBED_LIMITS.no2 },
    { key: 'pm25', label: 'PM2.5', unit: 'µg/m³', limit: PRESCRIBED_LIMITS.pm25 },
    { key: 'noise', label: 'Noise Level', unit: 'dB(A)', limit: PRESCRIBED_LIMITS.noiseDay },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f8f3' }}>
      <IndustrySidebar />
      <main style={{ flex: 1, overflow: 'auto' }}>
        <TopBar title="Submit Monthly Report" subtitle="Bharat Steel Works, Nagpur — Monthly emissions submission" />
        <div style={{ background: 'white', borderBottom: '1px solid #e8f5ee', padding: '0.5rem 1.5rem' }}>
          <span style={{ fontSize: '0.7rem', color: '#6b8c7a' }}>Home › My Dashboard › </span>
          <span style={{ fontSize: '0.7rem', color: '#1a6b3a', fontWeight: '600' }}>Submit Report</span>
        </div>
        <Toaster position="top-right" toastOptions={{ style: { background: 'white', color: '#1a2e22', border: '1px solid #c8e0d2' } }} />
        <div style={{ padding: '1.25rem 1.5rem', maxWidth: '700px' }}>
          <div style={{ background: '#fdf0ee', border: '1px solid #f5c6cb', borderLeft: '4px solid #c0392b', borderRadius: '4px', padding: '0.75rem 1rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#721c24', fontWeight: '600', marginBottom: '0.2rem' }}>⚠ Compliance Notice</div>
            <div style={{ fontSize: '0.78rem', color: '#721c24', lineHeight: 1.6 }}>Your facility has exceeded prescribed SO₂ limits for 3 of the last 6 months. Monthly reports must be submitted by the 1st of each following month under the Environment (Protection) Act, 1986.</div>
          </div>
          <div className="section-card">
            <div className="section-title">Monthly Emissions Report Form</div>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem', background: '#f0f8f3', borderRadius: '4px', border: '1px solid #c8e0d2' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✅</div>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: '#1a6b3a', marginBottom: '0.4rem' }}>Report Submitted Successfully</div>
                <div style={{ fontSize: '0.8rem', color: '#6b8c7a', marginBottom: '1.25rem' }}>Assigned to Regional Officer Rajesh Kumar for review.</div>
                <button className="btn-primary" onClick={() => setSubmitted(false)}>Submit Another</button>
              </div>
            ) : (
              <form onSubmit={handle}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '600', color: '#3d5a48', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Reporting Month *</label>
                  <input type="month" value={form.month} onChange={e => setForm(f => ({ ...f, month: e.target.value }))}
                    style={{ border: '1px solid #a0c8b4', borderRadius: '3px', padding: '0.5rem 0.75rem', color: '#1a2e22', fontSize: '0.875rem', background: 'white', width: '220px' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  {fields.map(f => {
                    const val = Number((form as any)[f.key]);
                    const over = val > 0 && val > f.limit;
                    return (
                      <div key={f.key}>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '600', color: '#3d5a48', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {f.label} ({f.unit}) * <span style={{ color: '#6b8c7a', fontWeight: 400, fontSize: '0.65rem', textTransform: 'none' }}>Limit: {f.limit}</span>
                        </label>
                        <input type="number" placeholder={`Monthly avg ${f.label}`} value={(form as any)[f.key]}
                          onChange={e => setForm(fv => ({ ...fv, [f.key]: e.target.value }))} required
                          style={{ width: '100%', border: `1px solid ${over ? '#f5c6cb' : '#a0c8b4'}`, borderRadius: '3px', padding: '0.5rem 0.75rem', color: '#1a2e22', fontSize: '0.875rem', background: 'white' }} />
                        {over && <div style={{ fontSize: '0.7rem', color: '#c0392b', marginTop: '0.2rem' }}>⚠ Exceeds limit by {val - f.limit} {f.unit}</div>}
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '600', color: '#3d5a48', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Remarks / Notes</label>
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3}
                    placeholder="Maintenance, equipment issues, corrective actions..."
                    style={{ width: '100%', border: '1px solid #a0c8b4', borderRadius: '3px', padding: '0.55rem 0.75rem', color: '#1a2e22', fontSize: '0.875rem', background: 'white', resize: 'vertical', fontFamily: 'inherit' }} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                  <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '0.6rem 2rem' }}>{loading ? 'Submitting...' : 'Submit Monthly Report'}</button>
                  <button type="button" className="btn-outline" onClick={() => setForm({ so2: '', no2: '', pm25: '', noise: '', notes: '', month: new Date().toISOString().slice(0, 7) })}>Clear</button>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#6b8c7a', background: '#f7fcf9', padding: '0.6rem 0.75rem', borderRadius: '3px', border: '1px solid #e8f5ee', lineHeight: 1.7 }}>
                  By submitting, you certify this data is accurate under the Environment (Protection) Rules, 1986.
                </div>
              </form>
            )}
          </div>
          <div className="section-card">
            <div className="section-title">Prescribed Limits — Reference</div>
            <table className="gov-table">
              <thead><tr><th>Parameter</th><th>Limit</th><th>Unit</th><th>Authority</th></tr></thead>
              <tbody>
                {[['SO₂', PRESCRIBED_LIMITS.so2, 'ppm', 'MPCB/CPCB'],['NO₂', PRESCRIBED_LIMITS.no2, 'ppm', 'MPCB/CPCB'],['PM2.5', PRESCRIBED_LIMITS.pm25, 'µg/m³', 'MPCB/CPCB'],['Noise (Day)', PRESCRIBED_LIMITS.noiseDay, 'dB(A)', 'Noise Rules 2000']].map(([p,v,u,a]) => (
                  <tr key={String(p)}><td style={{ fontWeight:'600' }}>{p}</td><td style={{ color:'#c0392b', fontWeight:'700' }}>{v}</td><td style={{ color:'#6b8c7a' }}>{u}</td><td style={{ color:'#6b8c7a', fontSize:'0.78rem' }}>{a}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
