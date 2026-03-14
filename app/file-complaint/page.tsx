'use client';
import { useState, useRef } from 'react';
import CitizenPageHeader from '@/components/CitizenPageHeader';
import CitizenAIWidget from '@/components/CitizenAIWidget';
import { addComplaint, ComplaintCategory } from '@/lib/complaintStore';
import { generateComplaintPDF } from '@/lib/pdfUtils';

const CATEGORIES: ComplaintCategory[] = ['Air Pollution','Water Pollution','Noise Pollution','Illegal Dumping','Other'];
const DISTRICTS = ['Mumbai','Pune','Nagpur','Thane','Nashik','Aurangabad','Solapur','Kolhapur','Amravati','Navi Mumbai','Ratnagiri','Chandrapur','Latur','Akola','Yavatmal','Jalgaon','Gondia','Satara','Osmanabad'];

interface FormState {
  name: string; anonymous: boolean; email: string;
  category: ComplaintCategory; district: string;
  location: string; description: string;
  photoBase64: string; photoName: string;
  datetime: string;
}

export default function FileComplaintPage() {
  const [form, setForm] = useState<FormState>({
    name:'', anonymous:false, email:'', category:'Air Pollution',
    district:'', location:'', description:'', photoBase64:'', photoName:'',
    datetime: new Date().toISOString().slice(0,16),
  });
  const [submitted, setSubmitted] = useState<{refNo:string;email:string}|null>(null);
  const [loading,   setLoading]   = useState(false);
  const [errors,    setErrors]    = useState<Record<string,string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const e: Record<string,string> = {};
    if (!form.anonymous && !form.name.trim()) e.name = 'Enter your name or choose Anonymous';
    if (!form.district)                        e.district = 'Please select a district';
    if (!form.location.trim())                 e.location = 'Describe the specific location';
    if (form.description.trim().length < 20)   e.description = 'Please give more detail (min 20 characters)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setErrors(prev => ({...prev, photo:'Photo must be under 2MB'})); return; }
    const reader = new FileReader();
    reader.onload = ev => setForm(f => ({ ...f, photoBase64: ev.target?.result as string, photoName: file.name }));
    reader.readAsDataURL(file);
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const complaint = addComplaint({
      category:       form.category,
      location:       form.location,
      district:       form.district,
      description:    form.description,
      submittedBy:    form.anonymous ? 'Anonymous' : form.name.trim(),
      submitterEmail: form.anonymous ? undefined : form.email.trim() || undefined,
      photoBase64:    form.photoBase64 || undefined,
    });
    // Auto-generate and open complaint PDF in new tab
    await generateComplaintPDF({
      refNo:          complaint.refNo,
      category:       form.category,
      district:       form.district,
      location:       form.location,
      description:    form.description,
      submittedBy:    form.anonymous ? 'Anonymous' : form.name.trim(),
      submitterEmail: form.anonymous ? undefined : form.email.trim() || undefined,
      photoBase64:    form.photoBase64 || undefined,
      datetime:       form.datetime,
    });
    setLoading(false);
    setSubmitted({ refNo: complaint.refNo, email: form.email.trim() });
  };

  const inp: React.CSSProperties = { width:'100%', border:'1.5px solid #dde2ec', borderRadius:'6px', padding:'0.5rem 0.75rem', fontSize:'0.875rem', fontFamily:'Arial', background:'#f8f9fa', outline:'none', boxSizing:'border-box', color:'#1a2744' };
  const F = ({ label, error, children }: { label:string; error?:string; children:React.ReactNode }) => (
    <div style={{ marginBottom:'1rem' }}>
      <label style={{ display:'block', fontSize:'0.7rem', fontWeight:'700', color:'#3d4f6b', fontFamily:'Arial', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'0.3rem' }}>{label}</label>
      {children}
      {error && <div style={{ fontSize:'0.67rem', color:'#c0392b', fontFamily:'Arial', marginTop:'0.2rem' }}>⚠ {error}</div>}
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#f0f2f5', display:'flex', flexDirection:'column', fontFamily:'Arial' }}>
      <CitizenPageHeader activeTab="air" stationCount={0} />

      <div style={{ maxWidth:'680px', margin:'0 auto', padding:'1.5rem', width:'100%' }}>

        {/* Back link */}
        <div style={{ marginBottom:'1rem' }}>
          <a href="/public" style={{ fontSize:'0.72rem', color:'#1a5280', fontFamily:'Arial', textDecoration:'none' }}>← Back to Air Quality Map</a>
        </div>

        {/* Telegram option */}
        <div style={{ background:'#e8f4fb', border:'1px solid #b8d8f0', borderRadius:'10px', padding:'1rem 1.25rem', marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:'1rem' }}>
          <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:'#229ED9', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
            </svg>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:'0.82rem', fontWeight:'700', color:'#1a2744', fontFamily:'Arial' }}>File via Telegram Bot</div>
            <div style={{ fontSize:'0.7rem', color:'#4a6280', marginTop:'0.1rem', fontFamily:'Arial' }}>Send your complaint directly on Telegram — instant, easy, no form needed</div>
          </div>
          <a href="https://t.me/Pritvinet_Bot" target="_blank" rel="noopener noreferrer"
            style={{ background:'#229ED9', color:'white', border:'none', borderRadius:'6px', padding:'0.45rem 1rem', fontSize:'0.75rem', fontFamily:'Arial', fontWeight:'700', textDecoration:'none', flexShrink:0 }}>
            Open Bot
          </a>
        </div>

        {submitted ? (
          /* ── Success screen ── */
          <div style={{ background:'white', borderRadius:'16px', padding:'2.5rem 2rem', textAlign:'center', boxShadow:'0 4px 20px rgba(26,39,68,0.1)' }}>
            <div style={{ fontSize:'3.5rem', marginBottom:'1rem' }}>✅</div>
            <div style={{ fontSize:'1.1rem', fontWeight:'700', color:'#1a6b3a', fontFamily:'Georgia', marginBottom:'0.5rem' }}>Complaint Submitted!</div>
            <div style={{ fontSize:'0.78rem', color:'#6b7a96', marginBottom:'1.25rem', lineHeight:1.7 }}>
              Your complaint has been received and routed to the concerned Regional Officer. You will be notified within 3 working days.
            </div>
            <div style={{ background:'#e8f0ff', borderRadius:'10px', padding:'0.85rem 1.5rem', display:'inline-block', marginBottom:'1.5rem' }}>
              <div style={{ fontSize:'0.62rem', color:'#6b7a96', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.2rem' }}>Your Reference Number</div>
              <div style={{ fontSize:'1.1rem', fontWeight:'800', color:'#1a4e8a', fontFamily:'Georgia' }}>{submitted.refNo}</div>
            </div>
            {submitted.email && (
              <div style={{ fontSize:'0.72rem', color:'#6b7a96', marginBottom:'1rem' }}>
                Track your complaint at{' '}
                <a href={`/my-complaints?email=${encodeURIComponent(submitted.email)}`} style={{ color:'#1a5280', fontWeight:'700' }}>
                  My Complaints →
                </a>
              </div>
            )}
            <div style={{ fontSize:'0.72rem', color:'#6b7a96', marginBottom:'1.5rem' }}>
              Save this reference number. For urgent issues: <strong>1800-233-3535</strong>
            </div>
            <div style={{ display:'flex', gap:'0.75rem', justifyContent:'center', flexWrap:'wrap' }}>
              <button onClick={() => { setSubmitted(null); setForm({ name:'', anonymous:false, email:'', category:'Air Pollution', district:'', location:'', description:'', photoBase64:'', photoName:'', datetime:new Date().toISOString().slice(0,16) }); }}
                style={{ background:'#1a2744', color:'white', border:'none', borderRadius:'8px', padding:'0.6rem 1.25rem', fontSize:'0.82rem', cursor:'pointer', fontFamily:'Arial', fontWeight:'600' }}>
                File Another
              </button>
              <a href="/public" style={{ background:'white', color:'#1a2744', border:'1.5px solid #1a2744', borderRadius:'8px', padding:'0.6rem 1.25rem', fontSize:'0.82rem', fontFamily:'Arial', fontWeight:'600', textDecoration:'none' }}>
                Back to Map
              </a>
              {submitted.email && (
                <a href={`/my-complaints?email=${encodeURIComponent(submitted.email)}`} style={{ background:'#e8f5ee', color:'#1a6b3a', border:'1.5px solid #c8e0d2', borderRadius:'8px', padding:'0.6rem 1.25rem', fontSize:'0.82rem', fontFamily:'Arial', fontWeight:'600', textDecoration:'none' }}>
                  Track Status →
                </a>
              )}
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom:'1.25rem' }}>
              <div style={{ fontSize:'1.2rem', fontWeight:'800', color:'#1a2744', fontFamily:'Georgia', marginBottom:'0.3rem' }}>📬 Report a Pollution Issue</div>
              <div style={{ fontSize:'0.75rem', color:'#6b7a96', lineHeight:1.7 }}>
                Your complaint will be reviewed by a Regional Officer within 3 working days. All reports are confidential.
              </div>
            </div>

            <div style={{ background:'white', borderRadius:'12px', padding:'1.5rem', boxShadow:'0 2px 12px rgba(26,39,68,0.09)' }}>
              <form onSubmit={submit}>

                {/* Name + anonymous */}
                <F label="Your Name" error={errors.name}>
                  <div style={{ display:'flex', gap:'0.75rem', alignItems:'center' }}>
                    <input type="text" placeholder="Your full name" value={form.name} onChange={e => setForm(f => ({...f,name:e.target.value}))} disabled={form.anonymous} style={{ ...inp, flex:1, opacity:form.anonymous?0.5:1 }} />
                    <label style={{ display:'flex', alignItems:'center', gap:'0.35rem', fontSize:'0.72rem', color:'#6b7a96', cursor:'pointer', whiteSpace:'nowrap', userSelect:'none' }}>
                      <input type="checkbox" checked={form.anonymous} onChange={e => setForm(f => ({...f,anonymous:e.target.checked,name:e.target.checked?'':f.name}))} style={{ cursor:'pointer', width:'14px', height:'14px' }} />
                      Stay Anonymous
                    </label>
                  </div>
                </F>

                {!form.anonymous && (
                  <F label="Email (for tracking — optional)">
                    <input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({...f,email:e.target.value}))} style={inp} />
                    <div style={{ fontSize:'0.62rem', color:'#94a3b8', fontFamily:'Arial', marginTop:'0.15rem' }}>Used only to let you track your complaint status. Never shared.</div>
                  </F>
                )}

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                  <F label="Complaint Type" error={errors.category}>
                    <select value={form.category} onChange={e => setForm(f => ({...f,category:e.target.value as ComplaintCategory}))} style={inp}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </F>
                  <F label="District" error={errors.district}>
                    <select value={form.district} onChange={e => setForm(f => ({...f,district:e.target.value}))} style={inp}>
                      <option value="">-- Select District --</option>
                      {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </F>
                </div>

                <F label="Exact Location" error={errors.location}>
                  <input type="text" placeholder="e.g. Near Butibori MIDC gate, opposite petrol pump" value={form.location} onChange={e => setForm(f => ({...f,location:e.target.value}))} style={inp} />
                </F>

                <F label="Date & Time of Incident">
                  <input type="datetime-local" value={form.datetime} onChange={e => setForm(f => ({...f,datetime:e.target.value}))} style={{ ...inp, width:'auto' }} />
                </F>

                <F label="Description" error={errors.description}>
                  <textarea rows={5} placeholder="Describe what you see, smell, or hear. Include how long it has been happening and any health impacts you've noticed…"
                    value={form.description} onChange={e => setForm(f => ({...f,description:e.target.value}))}
                    style={{ ...inp, resize:'vertical' }} />
                  <div style={{ fontSize:'0.62rem', color:form.description.length<20?'#c0392b':'#94a3b8', fontFamily:'Arial', textAlign:'right', marginTop:'0.2rem' }}>
                    {form.description.length} chars (min 20)
                  </div>
                </F>

                {/* Photo upload */}
                <F label="Photo Evidence (optional)" error={errors.photo}>
                  <div style={{ border:'2px dashed #dde2ec', borderRadius:'8px', padding:'1rem', textAlign:'center', cursor:'pointer', background:'#f8f9fa' }}
                    onClick={() => fileRef.current?.click()}>
                    {form.photoBase64 ? (
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.75rem' }}>
                        <img src={form.photoBase64} alt="preview" style={{ width:'60px', height:'60px', objectFit:'cover', borderRadius:'6px', border:'1px solid #dde2ec' }} />
                        <div style={{ textAlign:'left' }}>
                          <div style={{ fontSize:'0.72rem', color:'#1a6b3a', fontWeight:'600', fontFamily:'Arial' }}>✓ {form.photoName}</div>
                          <div style={{ fontSize:'0.62rem', color:'#94a3b8', fontFamily:'Arial', marginTop:'0.1rem' }}>Click to change</div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize:'1.5rem', marginBottom:'0.35rem' }}>📷</div>
                        <div style={{ fontSize:'0.72rem', color:'#6b7a96', fontFamily:'Arial' }}>Click to upload a photo (max 2MB)</div>
                      </>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handlePhoto} />
                </F>

                <div style={{ background:'#fffbeb', border:'1px solid #fde68a', borderRadius:'6px', padding:'0.65rem 0.85rem', marginBottom:'1.25rem', fontSize:'0.7rem', color:'#92400e', lineHeight:1.7 }}>
                  ⚠ Filing a false complaint is punishable under the Environment (Protection) Act, 1986. All submissions are reviewed by certified MPCB officers.
                </div>

                <button type="submit" disabled={loading} style={{ width:'100%', background:loading?'#94a3b8':'#1a2744', color:'white', border:'none', borderRadius:'8px', padding:'0.75rem', fontSize:'0.88rem', fontFamily:'Arial', fontWeight:'700', cursor:loading?'not-allowed':'pointer', transition:'background 0.15s' }}>
                  {loading ? '⏳ Submitting…' : '📬 Submit Complaint'}
                </button>
              </form>
            </div>

            {/* Emergency contacts */}
            <div style={{ marginTop:'1rem', background:'white', borderRadius:'10px', padding:'1rem 1.25rem', boxShadow:'0 1px 6px rgba(26,39,68,0.07)' }}>
              <div style={{ fontSize:'0.7rem', fontWeight:'700', color:'#1a2744', marginBottom:'0.35rem' }}>📞 Other ways to report:</div>
              <div style={{ fontSize:'0.7rem', color:'#6b7a96', lineHeight:1.8 }}>
                MPCB Toll Free: <strong>1800-233-3535</strong> &nbsp;·&nbsp; Police: <strong>100</strong> &nbsp;·&nbsp; Email: <strong>helpdesk@mpcb.gov.in</strong>
              </div>
            </div>
          </>
        )}
      </div>

      <CitizenAIWidget />
    </div>
  );
}
