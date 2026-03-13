'use client';
import { useState } from 'react';
import CitizenPageHeader from '@/components/CitizenPageHeader';

const CATEGORIES = ['Air Pollution', 'Water Pollution', 'Noise Pollution', 'Illegal Dumping', 'Other'];
const DISTRICTS  = ['Mumbai','Pune','Nagpur','Thane','Nashik','Aurangabad','Solapur','Kolhapur','Amravati','Navi Mumbai','Ratnagiri','Chandrapur','Latur','Akola','Yavatmal','Jalgaon','Gondia','Satara','Osmanabad','Amravati'];

function genRef() {
  const d = new Date();
  return `PVN-${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${Math.floor(Math.random()*900+100)}`;
}

export default function FileComplaintPage() {
  const [form, setForm] = useState({ name:'', anonymous: false, category:'Air Pollution', district:'', location:'', description:'' });
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [loading,   setLoading  ] = useState(false);
  const [errors,    setErrors   ] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.anonymous && !form.name.trim()) e.name = 'Name is required (or choose anonymous)';
    if (!form.district)     e.district    = 'Please select your district';
    if (!form.location.trim()) e.location = 'Please describe the location';
    if (form.description.trim().length < 20) e.description = 'Please provide more details (min 20 characters)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(genRef());
    }, 800);
  };

  const F = ({ id, label, children, error }: any) => (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#3d4f6b', fontFamily: 'Arial', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>{label}</label>
      {children}
      {error && <div style={{ fontSize: '0.68rem', color: '#c0392b', fontFamily: 'Arial', marginTop: '0.2rem' }}>{error}</div>}
    </div>
  );

  const inputStyle: React.CSSProperties = { width: '100%', border: '1.5px solid #dde2ec', borderRadius: '6px', padding: '0.5rem 0.75rem', fontSize: '0.875rem', fontFamily: 'Arial', background: '#f8f9fa', outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', display: 'flex', flexDirection: 'column', fontFamily: 'Arial' }}>
      <CitizenPageHeader activeTab="air" stationCount={0} />

      <div style={{ maxWidth: '660px', margin: '0 auto', padding: '1.5rem', width: '100%' }}>

        {submitted ? (
          <div style={{ background: 'white', borderRadius: '12px', padding: '2.5rem 2rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(26,39,68,0.1)' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✅</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a6b3a', fontFamily: 'Georgia', marginBottom: '0.5rem' }}>Complaint Submitted Successfully</div>
            <div style={{ fontSize: '0.75rem', color: '#6b7a96', marginBottom: '1rem', lineHeight: 1.7 }}>
              Your complaint has been received and will be reviewed by the concerned Regional Officer within 3 working days.
            </div>
            <div style={{ background: '#e8f0f8', borderRadius: '8px', padding: '0.75rem 1.5rem', display: 'inline-block', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.62rem', color: '#6b7a96', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Your Reference Number</div>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1a4e8a', fontFamily: 'Georgia' }}>{submitted}</div>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#6b7a96', marginBottom: '1.5rem', lineHeight: 1.7 }}>
              Save this reference number to track your complaint.<br />
              For urgent issues call MPCB: <strong>1800-233-3535</strong> (Toll Free)
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={() => { setSubmitted(null); setForm({ name:'', anonymous:false, category:'Air Pollution', district:'', location:'', description:'' }); }}
                style={{ background: '#1a2744', color: 'white', border: 'none', borderRadius: '6px', padding: '0.55rem 1.25rem', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'Arial', fontWeight: '600' }}>
                File Another
              </button>
              <a href="/public" style={{ background: 'white', color: '#1a2744', border: '1.5px solid #1a2744', borderRadius: '6px', padding: '0.55rem 1.25rem', fontSize: '0.8rem', fontFamily: 'Arial', fontWeight: '600', textDecoration: 'none' }}>
                Back to Map
              </a>
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1a2744', fontFamily: 'Georgia', marginBottom: '0.3rem' }}>📬 File a Pollution Complaint</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7a96', lineHeight: 1.7 }}>
                Report pollution incidents directly to Maharashtra SPCB. Your complaint will be routed to the concerned Regional Officer and actioned within 3 working days.
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(26,39,68,0.09)' }}>
              <form onSubmit={submit}>

                <F label="Your Name" error={errors.name}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <input type="text" placeholder="Your name" value={form.name} onChange={e => setForm(f => ({...f,name:e.target.value}))} disabled={form.anonymous} style={{ ...inputStyle, flex: 1, opacity: form.anonymous ? 0.5 : 1 }} />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: '#6b7a96', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      <input type="checkbox" checked={form.anonymous} onChange={e => setForm(f => ({...f, anonymous: e.target.checked, name: e.target.checked ? '' : f.name}))} style={{ cursor: 'pointer' }} />
                      Anonymous
                    </label>
                  </div>
                </F>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <F label="Complaint Category" error={errors.category}>
                    <select value={form.category} onChange={e => setForm(f => ({...f,category:e.target.value}))} style={{ ...inputStyle }}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </F>
                  <F label="District" error={errors.district}>
                    <select value={form.district} onChange={e => setForm(f => ({...f,district:e.target.value}))} style={{ ...inputStyle }}>
                      <option value="">-- Select District --</option>
                      {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </F>
                </div>

                <F label="Exact Location" error={errors.location}>
                  <input type="text" placeholder="e.g. Near Butibori MIDC gate, Nagpur" value={form.location} onChange={e => setForm(f => ({...f,location:e.target.value}))} style={inputStyle} />
                </F>

                <F label="Description of Complaint" error={errors.description}>
                  <textarea rows={5} placeholder="Describe the pollution issue in detail — what you see/smell/hear, how long it has been happening, and any health impacts…" value={form.description} onChange={e => setForm(f => ({...f,description:e.target.value}))} style={{ ...inputStyle, resize: 'vertical' }} />
                  <div style={{ fontSize: '0.62rem', color: form.description.length < 20 ? '#c0392b' : '#94a3b8', marginTop: '0.2rem', fontFamily: 'Arial', textAlign: 'right' }}>
                    {form.description.length} / min 20 characters
                  </div>
                </F>

                <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '6px', padding: '0.65rem 0.85rem', marginBottom: '1.25rem', fontSize: '0.7rem', color: '#856404', lineHeight: 1.7 }}>
                  ⚠ Filing a false complaint is an offence under the Environment (Protection) Act, 1986. All complaints are reviewed by certified MPCB officers.
                </div>

                <button type="submit" disabled={loading}
                  style={{ width: '100%', background: loading ? '#94a3b8' : '#1a2744', color: 'white', border: 'none', borderRadius: '8px', padding: '0.75rem', fontSize: '0.88rem', fontFamily: 'Arial', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? '⏳ Submitting…' : '📬 Submit Complaint'}
                </button>
              </form>
            </div>

            <div style={{ marginTop: '1rem', background: 'white', borderRadius: '10px', padding: '1rem 1.25rem', boxShadow: '0 1px 6px rgba(26,39,68,0.07)' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#1a2744', marginBottom: '0.4rem' }}>📞 Alternative ways to report:</div>
              <div style={{ fontSize: '0.7rem', color: '#6b7a96', lineHeight: 1.8 }}>
                MPCB Toll Free: <strong>1800-233-3535</strong> &nbsp;·&nbsp;
                Police: <strong>100</strong> &nbsp;·&nbsp;
                Email: <strong>helpdesk@mpcb.gov.in</strong> &nbsp;·&nbsp;
                Portal: sampark.maharashtra.gov.in
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
