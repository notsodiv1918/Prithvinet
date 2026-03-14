'use client';
import PageShell from '@/components/PageShell';
import { useAuth } from '@/lib/useAuth';
import { useState, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import { PRESCRIBED_LIMITS, REPORTS } from '@/data/mockData';
import toast, { Toaster } from 'react-hot-toast';
import { generateReportPDF } from '@/lib/pdfUtils';

// ── Memoised input to prevent full re-render on every keystroke ──────────────
const Field = memo(({ label, unit, limit, value, onChange }: {
  label: string; unit: string; limit: number;
  value: string; onChange: (v: string) => void;
}) => {
  const val  = Number(value);
  const over = val > 0 && val > limit;
  return (
    <div>
      <label style={{ display:'block', fontSize:'0.68rem', fontWeight:'700', color:'var(--text-mid)', textTransform:'uppercase', letterSpacing:'0.07em', fontFamily:'Arial', marginBottom:'0.35rem' }}>
        {label} ({unit}) *
        <span style={{ marginLeft:'0.5rem', color:'var(--text-muted)', fontWeight:400, fontSize:'0.65rem', textTransform:'none' }}>Limit: {limit}</span>
      </label>
      <input
        type="number"
        placeholder={`Enter ${label}`}
        value={value}
        onChange={e => onChange(e.target.value)}
        required
        style={{ width:'100%', border:`1.5px solid ${over ? '#f5c6cb' : 'var(--border)'}`, borderRadius:'4px', padding:'0.5rem 0.75rem', color:'var(--text-dark)', fontSize:'0.875rem', fontFamily:'Arial', background:'var(--off-white)', outline:'none', boxSizing:'border-box' }}
      />
      {over && (
        <div style={{ fontSize:'0.68rem', color:'var(--danger)', marginTop:'0.25rem', background:'#fdf0ee', padding:'0.2rem 0.5rem', borderRadius:'3px', fontFamily:'Arial' }}>
          Exceeds limit by {val - limit} {unit}
        </div>
      )}
    </div>
  );
});
Field.displayName = 'Field';

// ── PDF preview modal ────────────────────────────────────────────────────────
function PDFModal({ pdfUrl, refNo, onClose }: { pdfUrl: string; refNo: string; onClose: () => void }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
      <div style={{ background:'white', borderRadius:'10px', width:'100%', maxWidth:'820px', maxHeight:'90vh', display:'flex', flexDirection:'column', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>
        {/* Modal header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 1.25rem', borderBottom:'1px solid var(--border)', flexShrink:0 }}>
          <div>
            <div style={{ fontSize:'0.85rem', fontWeight:'700', color:'var(--navy)', fontFamily:'Georgia' }}>Report Submitted Successfully</div>
            <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', fontFamily:'Arial', marginTop:'0.1rem' }}>Reference: <strong style={{ color:'var(--accent-blue)' }}>{refNo}</strong> · PDF preview below</div>
          </div>
          <div style={{ display:'flex', gap:'0.5rem' }}>
            <a href={pdfUrl} download={`Report-${refNo}.pdf`}
              style={{ background:'var(--navy)', color:'white', border:'none', borderRadius:'4px', padding:'0.4rem 0.9rem', fontSize:'0.75rem', fontFamily:'Arial', fontWeight:'600', cursor:'pointer', textDecoration:'none' }}>
              Download PDF
            </a>
            <button onClick={onClose}
              style={{ background:'var(--light-gray)', color:'var(--text-dark)', border:'1px solid var(--border)', borderRadius:'4px', padding:'0.4rem 0.75rem', fontSize:'0.75rem', fontFamily:'Arial', cursor:'pointer' }}>
              Close
            </button>
          </div>
        </div>
        {/* PDF iframe */}
        <iframe src={pdfUrl} style={{ flex:1, border:'none', borderRadius:'0 0 10px 10px', minHeight:'500px' }} title="Report PDF" />
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function SubmitPage() {
  const router = useRouter();
  const { user, mounted } = useAuth({ allowedRoles:['Industry User'] });

  const [so2,   setSo2]   = useState('');
  const [no2,   setNo2]   = useState('');
  const [pm25,  setPm25]  = useState('');
  const [noise, setNoise] = useState('');
  const [notes, setNotes] = useState('');
  const [date,  setDate]  = useState(new Date().toISOString().split('T')[0]);

  const [loading,  setLoading]  = useState(false);
  const [pdfModal, setPdfModal] = useState<{ url: string; refNo: string } | null>(null);

  const handleSo2   = useCallback((v: string) => setSo2(v),   []);
  const handleNo2   = useCallback((v: string) => setNo2(v),   []);
  const handlePm25  = useCallback((v: string) => setPm25(v),  []);
  const handleNoise = useCallback((v: string) => setNoise(v), []);

  if (!mounted || !user) return <PageShell loading />;

  const monthlySubmitted = REPORTS.some(r => r.type === 'Monthly' && r.date.startsWith('2024-07'));

  const determineStatus = () => {
    const vals = [
      { v: Number(so2),   limit: PRESCRIBED_LIMITS.so2 },
      { v: Number(no2),   limit: PRESCRIBED_LIMITS.no2 },
      { v: Number(pm25),  limit: PRESCRIBED_LIMITS.pm25 },
      { v: Number(noise), limit: PRESCRIBED_LIMITS.noiseDay },
    ];
    if (vals.some(x => x.v > x.limit)) return 'Non-Compliant';
    return 'Compliant';
  };

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const refNo  = 'RPT-' + Math.floor(Math.random() * 9000 + 1000);
    const status = determineStatus();

    const report = {
      id:          refNo,
      industry:    'Bharat Steel Works',
      type:        'Monthly' as const,
      date:        date,
      parameters:  `SO2: ${so2} ppm, NO2: ${no2} ppm, PM2.5: ${pm25} µg/m³, Noise: ${noise} dB(A)`,
      status:      status as 'Compliant' | 'Non-Compliant' | 'Pending',
      submittedBy: user.name,
    };

    // Generate PDF and show modal
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const W = 210; const margin = 14; const contentW = W - margin * 2;

      // Tricolour
      doc.setFillColor(255, 107, 0);  doc.rect(0, 0, 70, 5, 'F');
      doc.setFillColor(255, 255, 255); doc.rect(70, 0, 70, 5, 'F');
      doc.setFillColor(19, 136, 8);   doc.rect(140, 0, 70, 5, 'F');

      // Header
      doc.setFillColor(45, 58, 92); doc.rect(0, 5, W, 26, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(13); doc.setFont('helvetica', 'bold');
      doc.text('PRITHVINET', margin, 16);
      doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
      doc.setTextColor(168, 180, 204);
      doc.text('Maharashtra State Pollution Control Board', margin, 21);
      doc.text('Government of Maharashtra', margin, 26);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10); doc.setFont('helvetica', 'bold');
      doc.text('EMISSIONS COMPLIANCE REPORT', W - margin, 16, { align: 'right' });
      doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
      doc.setTextColor(168, 180, 204);
      doc.text('Monthly Submission — Industry Portal', W - margin, 21, { align: 'right' });
      doc.text('Generated: ' + new Date().toLocaleString('en-IN'), W - margin, 26, { align: 'right' });

      // Status banner
      let y = 40;
      const isCompliant = status === 'Compliant';
      doc.setFillColor(isCompliant ? 212 : 254, isCompliant ? 234 : 226, isCompliant ? 212 : 226);
      doc.roundedRect(margin, y, contentW, 13, 2, 2, 'F');
      doc.setTextColor(isCompliant ? 22 : 153, isCompliant ? 101 : 27, isCompliant ? 52 : 27);
      doc.setFontSize(10); doc.setFont('helvetica', 'bold');
      doc.text(isCompliant ? 'COMPLIANT — Within Prescribed Limits' : 'NON-COMPLIANT — Exceeds Prescribed Limits', W / 2, y + 8.5, { align: 'center' });
      y += 20;

      // Ref box
      doc.setFillColor(238, 244, 251); doc.setDrawColor(45, 58, 92);
      doc.roundedRect(margin, y, contentW, 13, 2, 2, 'FD');
      doc.setTextColor(45, 58, 92);
      doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
      doc.text('REFERENCE NUMBER', margin + 4, y + 5);
      doc.setFontSize(12);
      doc.text(refNo, margin + 4, y + 11);
      doc.setTextColor(100, 100, 100); doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
      doc.text('Submitted by: ' + user.name, W - margin, y + 5, { align: 'right' });
      doc.text('Reporting period: ' + date, W - margin, y + 11, { align: 'right' });
      y += 20;

      // Section helper
      const sH = (title: string) => {
        doc.setFillColor(238, 240, 245); doc.rect(margin, y, contentW, 7, 'F');
        doc.setDrawColor(45, 58, 92); doc.setLineWidth(0.5);
        doc.line(margin, y, margin, y + 7);
        doc.setTextColor(45, 58, 92); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
        doc.text(title.toUpperCase(), margin + 4, y + 5);
        y += 12;
      };
      const rowF = (label: string, value: string, measured: number, limit: number, unit: string) => {
        const exceeded = measured > limit;
        doc.setTextColor(100, 116, 139); doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
        doc.text(label, margin + 4, y);
        doc.setTextColor(exceeded ? 192 : 30, exceeded ? 0 : 42, exceeded ? 43 : 69);
        doc.setFont('helvetica', 'bold');
        doc.text(`${measured} ${unit}`, margin + 55, y);
        doc.setTextColor(100, 116, 139); doc.setFont('helvetica', 'normal');
        doc.text(`Limit: ${limit} ${unit}`, margin + 95, y);
        if (exceeded) {
          doc.setTextColor(192, 0, 43);
          doc.text(`(+${measured - limit} above limit)`, margin + 135, y);
        }
        y += 8;
      };

      sH('Emissions Readings');
      rowF('Sulphur Dioxide (SO2)',         Number(so2),   PRESCRIBED_LIMITS.so2,      'ppm');
      rowF('Nitrogen Dioxide (NO2)',         Number(no2),   PRESCRIBED_LIMITS.no2,      'ppm');
      rowF('Fine Particulate Matter (PM2.5)', Number(pm25), PRESCRIBED_LIMITS.pm25,     'µg/m³');
      rowF('Noise Level (Day)',              Number(noise), PRESCRIBED_LIMITS.noiseDay,  'dB(A)');
      y += 4;

      sH('Facility Information');
      doc.setTextColor(100, 116, 139); doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
      doc.text('Industry', margin + 4, y); doc.setTextColor(30, 42, 69); doc.setFont('helvetica', 'bold'); doc.text('Bharat Steel Works', margin + 55, y); y += 8;
      doc.setTextColor(100, 116, 139); doc.setFont('helvetica', 'normal');
      doc.text('District', margin + 4, y); doc.setTextColor(30, 42, 69); doc.setFont('helvetica', 'bold'); doc.text('Nagpur', margin + 55, y); y += 8;
      doc.setTextColor(100, 116, 139); doc.setFont('helvetica', 'normal');
      doc.text('Assigned RO', margin + 4, y); doc.setTextColor(30, 42, 69); doc.setFont('helvetica', 'bold'); doc.text('Rajesh Kumar — Regional Officer, Nagpur', margin + 55, y); y += 8;
      doc.setTextColor(100, 116, 139); doc.setFont('helvetica', 'normal');
      doc.text('Report Type', margin + 4, y); doc.setTextColor(30, 42, 69); doc.setFont('helvetica', 'bold'); doc.text('Monthly Emissions Report', margin + 55, y); y += 12;

      if (notes.trim()) {
        sH('Operational Notes / Remarks');
        doc.setTextColor(45, 58, 92); doc.setFontSize(8); doc.setFont('helvetica', 'normal');
        const noteLines = doc.splitTextToSize(notes.trim(), contentW - 8);
        doc.text(noteLines, margin + 4, y);
        y += noteLines.length * 5 + 8;
      }

      sH('Prescribed Limits Reference (MPCB)');
      [['SO2', '80 ppm'], ['NO2', '60 ppm'], ['PM2.5', '60 µg/m³'], ['Noise Day', '55 dB(A)'], ['Noise Night', '45 dB(A)']].forEach(([p, l]) => {
        doc.setTextColor(100, 116, 139); doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
        doc.text(p, margin + 4, y);
        doc.setTextColor(30, 42, 69); doc.setFont('helvetica', 'bold');
        doc.text(l, margin + 55, y);
        y += 7;
      });

      y += 6;
      doc.setFillColor(238, 244, 251); doc.roundedRect(margin, y, contentW, 18, 2, 2, 'F');
      doc.setTextColor(30, 74, 138); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
      doc.text('OFFICIAL COMPLIANCE STATEMENT', W / 2, y + 6, { align: 'center' });
      doc.setFont('helvetica', 'normal'); doc.setTextColor(45, 58, 92);
      const stmt = doc.splitTextToSize('This report has been submitted under the Environment (Protection) Act, 1986. The data is subject to verification by Maharashtra State Pollution Control Board. False reporting is punishable under Section 15 of the Act.', contentW - 8);
      doc.text(stmt, W / 2, y + 12, { align: 'center' });

      doc.setFillColor(45, 58, 92); doc.rect(0, 280, W, 17, 'F');
      doc.setTextColor(168, 180, 204); doc.setFontSize(7); doc.setFont('helvetica', 'normal');
      doc.text('Maharashtra State Pollution Control Board  |  MPCB Helpline: 1800-233-3535  |  helpdesk@mpcb.gov.in', W / 2, 287, { align: 'center' });
      doc.text('Computer-generated document — PrithviNet Compliance Portal  |  Environment (Protection) Act, 1986', W / 2, 292, { align: 'center' });

      const blob = doc.output('blob');
      const url  = URL.createObjectURL(blob);
      setLoading(false);
      setPdfModal({ url, refNo });
      toast.success('Report submitted — Ref: ' + refNo, { duration: 4000 });
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error('PDF generation failed. Please try again.');
    }
  };

  const inpStyle: React.CSSProperties = { border: '1.5px solid var(--border)', borderRadius: '4px', padding: '0.5rem 0.75rem', color: 'var(--text-dark)', fontSize: '0.875rem', fontFamily: 'Arial', background: 'var(--off-white)', outline: 'none' };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.68rem', fontWeight: '700', color: 'var(--text-mid)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: 'Arial', marginBottom: '0.35rem' };

  return (
    <PageShell>
      <Toaster position="top-right" toastOptions={{ style: { background: 'white', color: 'var(--text-dark)', border: '1px solid var(--border)', fontFamily: 'Arial', fontSize: '0.82rem' } }} />

      {pdfModal && (
        <PDFModal
          pdfUrl={pdfModal.url}
          refNo={pdfModal.refNo}
          onClose={() => { setPdfModal(null); setSo2(''); setNo2(''); setPm25(''); setNoise(''); setNotes(''); setDate(new Date().toISOString().split('T')[0]); }}
        />
      )}

      <div className="breadcrumb">
        <span>Home</span><span>›</span>
        <a onClick={() => router.push('/industry-dashboard')} style={{ cursor: 'pointer' }}>My Dashboard</a>
        <span>›</span>
        <span style={{ color: 'var(--navy)', fontWeight: '700' }}>Submit Report</span>
      </div>
      <div className="live-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="live-dot" />
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#22c55e', fontFamily: 'Arial' }}>LIVE</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Arial', marginLeft: '0.35rem' }}>
            Bharat Steel Works, Nagpur · Monthly Report Portal
          </span>
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Arial' }}>Industry User Portal</span>
      </div>

      <div className="main-content" style={{ maxWidth: '740px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        <div className="alert-critical">
          <strong style={{ fontSize: '0.8rem', color: '#721c24' }}>Compliance Notice — Immediate Action Required</strong>
          <div style={{ fontSize: '0.75rem', color: '#721c24', marginTop: '0.25rem', lineHeight: 1.7 }}>
            Your facility has exceeded prescribed SO2 limits on 5 of the last 7 days. Monthly report is due by 31 July 2024. Submitting accurate data is mandatory under the Environment (Protection) Act, 1986.
          </div>
        </div>

        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '4px', padding: '0.85rem 1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(26,39,68,0.06)' }}>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)', fontFamily: 'Georgia' }}>July 2024 Monthly Report</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Arial', marginTop: '0.1rem' }}>Period: 1 July - 31 July 2024 · Due: 31 July 2024</div>
          </div>
          <span className={monthlySubmitted ? 'badge-compliant' : 'badge-pending'}>
            {monthlySubmitted ? 'Submitted' : 'Pending'}
          </span>
        </div>

        <div className="section-card">
          <div className="section-title">Monthly Emissions Report Form</div>
          <form onSubmit={handle}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Reporting Period *</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                style={{ ...inpStyle, width: '210px' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <Field label="SO2"          unit="ppm"   limit={PRESCRIBED_LIMITS.so2}      value={so2}   onChange={handleSo2} />
              <Field label="NO2"          unit="ppm"   limit={PRESCRIBED_LIMITS.no2}      value={no2}   onChange={handleNo2} />
              <Field label="PM2.5"        unit="µg/m³" limit={PRESCRIBED_LIMITS.pm25}     value={pm25}  onChange={handlePm25} />
              <Field label="Noise Level"  unit="dB(A)" limit={PRESCRIBED_LIMITS.noiseDay} value={noise} onChange={handleNoise} />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Remarks / Operational Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder="Maintenance activities, equipment issues, or explanations for any exceedances..."
                style={{ ...inpStyle, width: '100%', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
              <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '0.6rem 2rem' }}>
                {loading ? 'Generating PDF...' : 'Submit Monthly Report'}
              </button>
              <button type="button" className="btn-outline"
                onClick={() => { setSo2(''); setNo2(''); setPm25(''); setNoise(''); setNotes(''); setDate(new Date().toISOString().split('T')[0]); }}>
                Clear Form
              </button>
            </div>

            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'Arial', background: 'var(--off-white)', padding: '0.6rem 0.85rem', borderRadius: '4px', border: '1px solid var(--border)', lineHeight: 1.8 }}>
              By submitting, you certify this data is accurate under the Environment (Protection) Rules, 1986. False reporting is punishable under Section 15 of the Act.
            </div>
          </form>
        </div>

        <div className="section-card">
          <div className="section-title">Prescribed Limits Reference</div>
          <table className="gov-table">
            <thead><tr><th>Parameter</th><th>Prescribed Limit</th><th>Unit</th><th>Regulatory Authority</th></tr></thead>
            <tbody>
              {[
                ['SO2',         PRESCRIBED_LIMITS.so2,      'ppm',    'MPCB / CPCB'],
                ['NO2',         PRESCRIBED_LIMITS.no2,      'ppm',    'MPCB / CPCB'],
                ['PM2.5',       PRESCRIBED_LIMITS.pm25,     'µg/m³',  'MPCB / CPCB'],
                ['Noise (Day)', PRESCRIBED_LIMITS.noiseDay, 'dB(A)',  'Noise Pollution Rules, 2000'],
              ].map(([p, v, u, a]) => (
                <tr key={String(p)}>
                  <td style={{ fontWeight: '600' }}>{p}</td>
                  <td style={{ color: 'var(--danger)', fontWeight: '800', fontFamily: 'Georgia' }}>{v}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{u}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{a}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </PageShell>
  );
}
