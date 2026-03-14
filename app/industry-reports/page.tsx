'use client';
import PageShell from '@/components/PageShell';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { REPORTS } from '@/data/mockData';
import toast, { Toaster } from 'react-hot-toast';
import { generateReportPDF } from '@/lib/pdfUtils';

// ── PDF preview modal ────────────────────────────────────────────────────────
function PDFModal({ pdfUrl, reportId, onClose }: { pdfUrl: string; reportId: string; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ background: 'white', borderRadius: '10px', width: '100%', maxWidth: '820px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--navy)', fontFamily: 'Georgia' }}>Report Preview</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'Arial', marginTop: '0.1rem' }}>
              Report ID: <strong style={{ color: 'var(--accent-blue)' }}>{reportId}</strong>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <a href={pdfUrl} download={`${reportId}.pdf`}
              style={{ background: 'var(--navy)', color: 'white', border: 'none', borderRadius: '4px', padding: '0.4rem 0.9rem', fontSize: '0.75rem', fontFamily: 'Arial', fontWeight: '600', cursor: 'pointer', textDecoration: 'none' }}>
              Download PDF
            </a>
            <button onClick={onClose}
              style={{ background: 'var(--light-gray)', color: 'var(--text-dark)', border: '1px solid var(--border)', borderRadius: '4px', padding: '0.4rem 0.75rem', fontSize: '0.75rem', fontFamily: 'Arial', cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </div>
        <iframe src={pdfUrl} style={{ flex: 1, border: 'none', borderRadius: '0 0 10px 10px', minHeight: '500px' }} title="Report PDF" />
      </div>
    </div>
  );
}

export default function IndustryReports() {
  const router = useRouter();
  const { user, mounted } = useAuth({ allowedRoles: ['Industry User'] });
  const [pdfModal, setPdfModal] = useState<{ url: string; reportId: string } | null>(null);
  const [generating, setGenerating] = useState<string | null>(null);

  if (!mounted || !user) return <PageShell loading />;

  const myReports    = REPORTS.filter(r => r.industry === 'Bharat Steel Works');
  const compliant    = myReports.filter(r => r.status === 'Compliant').length;
  const nonCompliant = myReports.filter(r => r.status === 'Non-Compliant').length;
  const rate         = Math.round((compliant / myReports.length) * 100);

  const handleDownload = async (r: typeof REPORTS[0]) => {
    setGenerating(r.id);
    try {
      // Generate blob URL instead of opening new tab
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
      doc.text('Government of Maharashtra — Environment (Protection) Act, 1986', margin, 26);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10); doc.setFont('helvetica', 'bold');
      doc.text('EMISSIONS COMPLIANCE REPORT', W - margin, 16, { align: 'right' });
      doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
      doc.setTextColor(168, 180, 204);
      doc.text(r.type + ' Report', W - margin, 21, { align: 'right' });
      doc.text('Generated: ' + new Date().toLocaleString('en-IN'), W - margin, 26, { align: 'right' });

      let y = 40;

      // Status banner
      const isC = r.status === 'Compliant'; const isP = r.status === 'Pending';
      doc.setFillColor(isC ? 212 : isP ? 219 : 254, isC ? 234 : isP ? 234 : 226, isC ? 212 : isP ? 253 : 226);
      doc.roundedRect(margin, y, contentW, 13, 2, 2, 'F');
      doc.setTextColor(isC ? 22 : isP ? 30 : 153, isC ? 101 : isP ? 74 : 27, isC ? 52 : isP ? 138 : 27);
      doc.setFontSize(10); doc.setFont('helvetica', 'bold');
      doc.text(isC ? 'COMPLIANT — Within Prescribed Limits' : isP ? 'PENDING — Awaiting Review' : 'NON-COMPLIANT — Exceeds Prescribed Limits', W / 2, y + 8.5, { align: 'center' });
      y += 20;

      // Report ID box
      doc.setFillColor(238, 244, 251); doc.setDrawColor(45, 58, 92);
      doc.roundedRect(margin, y, contentW, 13, 2, 2, 'FD');
      doc.setTextColor(45, 58, 92);
      doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
      doc.text('REPORT ID', margin + 4, y + 5);
      doc.setFontSize(12); doc.text(r.id, margin + 4, y + 11);
      doc.setTextColor(100, 100, 100); doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
      doc.text('Downloaded by: ' + user.name, W - margin, y + 5, { align: 'right' });
      doc.text('Date: ' + new Date().toLocaleDateString('en-IN'), W - margin, y + 11, { align: 'right' });
      y += 20;

      const sH = (title: string) => {
        doc.setFillColor(238, 240, 245); doc.rect(margin, y, contentW, 7, 'F');
        doc.setDrawColor(45, 58, 92); doc.setLineWidth(0.5); doc.line(margin, y, margin, y + 7);
        doc.setTextColor(45, 58, 92); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
        doc.text(title.toUpperCase(), margin + 4, y + 5);
        y += 12;
      };
      const rowF = (label: string, value: string, highlight = false) => {
        if (highlight) { doc.setFillColor(248, 247, 244); doc.rect(margin, y - 4, contentW, 7, 'F'); }
        doc.setTextColor(120, 130, 150); doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
        doc.text(label, margin + 4, y);
        doc.setTextColor(30, 42, 69); doc.setFont('helvetica', 'bold');
        doc.text(value || '—', margin + 55, y);
        y += 8;
      };

      sH('Report Information');
      rowF('Report ID',    r.id,          true);
      rowF('Industry',     r.industry);
      rowF('Report Type',  r.type,        true);
      rowF('Report Date',  r.date);
      rowF('Parameters',   r.parameters,  true);
      rowF('Submitted By', r.submittedBy);
      rowF('Status',       r.status,      true);
      y += 4;

      sH('Prescribed Limits Reference (MPCB)');
      rowF('SO2',          '80 ppm',   true);
      rowF('NO2',          '60 ppm');
      rowF('PM2.5',        '60 µg/m³', true);
      rowF('Noise Day',    '55 dB(A)');
      rowF('Noise Night',  '45 dB(A)', true);
      y += 8;

      doc.setFillColor(238, 244, 251); doc.roundedRect(margin, y, contentW, 20, 2, 2, 'F');
      doc.setTextColor(30, 74, 138); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
      doc.text('OFFICIAL COMPLIANCE STATEMENT', W / 2, y + 6, { align: 'center' });
      doc.setFont('helvetica', 'normal'); doc.setTextColor(45, 58, 92);
      const stmt = doc.splitTextToSize('This report was submitted in accordance with the Environment (Protection) Act, 1986. Data is subject to verification by Maharashtra State Pollution Control Board.', contentW - 8);
      doc.text(stmt, W / 2, y + 12, { align: 'center' });

      doc.setFillColor(45, 58, 92); doc.rect(0, 280, W, 17, 'F');
      doc.setTextColor(168, 180, 204); doc.setFontSize(7); doc.setFont('helvetica', 'normal');
      doc.text('Maharashtra State Pollution Control Board  |  PrithviNet Compliance Portal', W / 2, 287, { align: 'center' });
      doc.text('This is an official computer-generated document.', W / 2, 292, { align: 'center' });

      const blob = doc.output('blob');
      const url  = URL.createObjectURL(blob);
      setPdfModal({ url, reportId: r.id });
    } catch {
      toast.error('Failed to generate PDF');
    }
    setGenerating(null);
  };

  return (
    <PageShell>
      <Toaster position="top-right" toastOptions={{ style: { background: 'white', color: 'var(--text-dark)', border: '1px solid var(--border)', fontFamily: 'Arial', fontSize: '0.82rem' } }} />

      {pdfModal && <PDFModal pdfUrl={pdfModal.url} reportId={pdfModal.reportId} onClose={() => setPdfModal(null)} />}

      <div className="breadcrumb">
        <span>Home</span><span>›</span>
        <a onClick={() => router.push('/industry-dashboard')} style={{ cursor: 'pointer' }}>My Dashboard</a>
        <span>›</span>
        <span style={{ color: 'var(--navy)', fontWeight: '700' }}>Past Reports</span>
      </div>
      <div className="live-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="live-dot" />
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#22c55e', fontFamily: 'Arial' }}>LIVE</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Arial', marginLeft: '0.35rem' }}>
            {myReports.length} submissions · {rate}% compliance rate · Bharat Steel Works
          </span>
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Arial' }}>Industry Compliance History</span>
      </div>

      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
          {[
            { label: 'Total Reports',   value: myReports.length, color: 'var(--accent-blue)'  },
            { label: 'Compliant',       value: compliant,        color: 'var(--accent-green)' },
            { label: 'Non-Compliant',   value: nonCompliant,     color: 'var(--danger)'       },
            { label: 'Compliance Rate', value: `${rate}%`,       color: rate < 50 ? 'var(--danger)' : '#d4680a' },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ borderTopColor: s.color }}>
              <div style={{ fontSize: '0.63rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.3rem', fontFamily: 'Arial' }}>{s.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: s.color, lineHeight: 1, fontFamily: 'Georgia' }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="alert-warning">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '0.82rem', color: '#856404' }}>Monthly Report Due: 31 July 2024</strong>
              <div style={{ fontSize: '0.72rem', color: '#856404', marginTop: '0.2rem', lineHeight: 1.7 }}>
                Your monthly emissions report has not been submitted yet. Failure to submit by the deadline may result in non-compliance action.
              </div>
            </div>
            <button className="btn-primary" style={{ flexShrink: 0, marginLeft: '1.25rem' }} onClick={() => router.push('/submit')}>Submit Now</button>
          </div>
        </div>

        <div className="section-card">
          <div className="section-title">Submission History — Bharat Steel Works</div>
          <div style={{ overflowX: 'auto' }}>
            <table className="gov-table">
              <thead>
                <tr><th>Report ID</th><th>Type</th><th>Date</th><th>Parameters</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {myReports.map(r => (
                  <tr key={r.id}>
                    <td style={{ color: 'var(--accent-green)', fontFamily: 'monospace', fontWeight: '600', fontSize: '0.78rem' }}>{r.id}</td>
                    <td>
                      <span style={{ background: r.type === 'Monthly' ? '#e8f0f8' : '#e8f5ee', color: r.type === 'Monthly' ? 'var(--accent-blue)' : 'var(--accent-green)', padding: '2px 9px', borderRadius: '10px', fontSize: '0.67rem', fontWeight: '700', fontFamily: 'Arial', border: `1px solid ${r.type === 'Monthly' ? '#c8d4e8' : '#c8e0d2'}` }}>
                        {r.type}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{r.date}</td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.parameters}</td>
                    <td><span className={r.status === 'Compliant' ? 'badge-compliant' : r.status === 'Non-Compliant' ? 'badge-noncompliant' : 'badge-pending'}>{r.status}</span></td>
                    <td>
                      <button
                        className="btn-outline"
                        style={{ fontSize: '0.7rem', padding: '0.22rem 0.7rem', minWidth: '90px' }}
                        disabled={generating === r.id}
                        onClick={() => handleDownload(r)}>
                        {generating === r.id ? 'Loading...' : 'View PDF'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="section-card" style={{ borderLeft: '4px solid var(--danger)', background: '#fef8f8' }}>
          <div className="section-title" style={{ color: 'var(--danger)' }}>Notice from Regional Officer</div>
          <p style={{ fontSize: '0.82rem', color: '#721c24', lineHeight: 1.8, fontFamily: 'Arial' }}>
            Your facility has recorded <strong>non-compliant emissions on 5 of the last 7 reporting days</strong>. SO2 levels have consistently exceeded the prescribed limit of 80 ppm. You are required to submit a corrective action plan within 7 days and ensure all pollution control equipment is functioning. Failure to comply may result in a formal show-cause notice under the Environment (Protection) Act, 1986.
          </p>
          <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: '#721c24', fontWeight: '700', fontFamily: 'Arial' }}>
            — Rajesh Kumar, Regional Officer, Nagpur · 15 July 2024
          </div>
        </div>

      </div>
    </PageShell>
  );
}
