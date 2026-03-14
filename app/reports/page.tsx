'use client';
import PageShell from '@/components/PageShell';
import { useAuth } from '@/lib/useAuth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { REPORTS, INDUSTRIES } from '@/data/mockData';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';

// ── PDF preview modal ────────────────────────────────────────────────────────
function PDFModal({ pdfUrl, reportId, industry, onClose }: { pdfUrl: string; reportId: string; industry: string; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ background: 'white', borderRadius: '10px', width: '100%', maxWidth: '860px', maxHeight: '92vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--navy)', fontFamily: 'Georgia' }}>{industry} — Report Preview</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'Arial', marginTop: '0.1rem' }}>
              Report ID: <strong style={{ color: 'var(--accent-blue)' }}>{reportId}</strong> · Official MPCB document
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <a href={pdfUrl} download={`${reportId}.pdf`}
              style={{ background: 'var(--navy)', color: 'white', border: 'none', borderRadius: '4px', padding: '0.45rem 1rem', fontSize: '0.75rem', fontFamily: 'Arial', fontWeight: '600', cursor: 'pointer', textDecoration: 'none' }}>
              Download PDF
            </a>
            <button onClick={onClose}
              style={{ background: 'var(--light-gray)', color: 'var(--text-dark)', border: '1px solid var(--border)', borderRadius: '4px', padding: '0.45rem 0.85rem', fontSize: '0.75rem', fontFamily: 'Arial', cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </div>
        <iframe src={pdfUrl} style={{ flex: 1, border: 'none', borderRadius: '0 0 10px 10px', minHeight: '520px' }} title="Report PDF" />
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const router = useRouter();
  const { user, mounted } = useAuth({ allowedRoles: ['Super Admin', 'Regional Officer', 'Monitoring Team'] });
  const [filter,     setFilter]     = useState('All');
  const [pdfModal,   setPdfModal]   = useState<{ url: string; reportId: string; industry: string } | null>(null);
  const [generating, setGenerating] = useState<string | null>(null);

  if (!mounted || !user) return <PageShell loading />;

  const industries   = ['All', ...Array.from(new Set(REPORTS.map(r => r.industry)))];
  const filtered     = filter === 'All' ? REPORTS : REPORTS.filter(r => r.industry === filter);
  const compliant    = REPORTS.filter(r => r.status === 'Compliant').length;
  const nonCompliant = REPORTS.filter(r => r.status === 'Non-Compliant').length;
  const pending      = REPORTS.filter(r => r.status === 'Pending').length;
  const overallRate  = Math.round((compliant / REPORTS.length) * 100);
  const pieData      = [
    { name: 'Compliant',     value: compliant,    color: '#1a6b3a' },
    { name: 'Non-Compliant', value: nonCompliant, color: '#c0392b' },
    { name: 'Pending',       value: pending,      color: '#1a4e8a' },
  ];

  const handleDownload = async (r: typeof REPORTS[0]) => {
    setGenerating(r.id);
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
      doc.text('Government of Maharashtra — Environment (Protection) Act, 1986', margin, 26);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10); doc.setFont('helvetica', 'bold');
      doc.text('INDUSTRY COMPLIANCE REPORT', W - margin, 16, { align: 'right' });
      doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
      doc.setTextColor(168, 180, 204);
      doc.text('Downloaded by: ' + user.name + ' (' + user.role + ')', W - margin, 21, { align: 'right' });
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
      doc.setTextColor(45, 58, 92); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
      doc.text('REPORT ID', margin + 4, y + 5);
      doc.setFontSize(12); doc.text(r.id, margin + 4, y + 11);
      doc.setTextColor(100, 100, 100); doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
      doc.text('Accessed by: ' + user.name, W - margin, y + 5, { align: 'right' });
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
      rowF('Report ID',    r.id,           true);
      rowF('Industry',     r.industry);
      rowF('Report Type',  r.type,         true);
      rowF('Report Date',  r.date);
      rowF('Parameters',   r.parameters,   true);
      rowF('Submitted By', r.submittedBy);
      rowF('Status',       r.status,       true);
      y += 4;

      sH('Prescribed Limits Reference (MPCB)');
      rowF('SO2',          '80 ppm',    true);
      rowF('NO2',          '60 ppm');
      rowF('PM2.5',        '60 µg/m³',  true);
      rowF('Noise Day',    '55 dB(A)');
      rowF('Noise Night',  '45 dB(A)',  true);
      y += 4;

      sH('Access Log');
      rowF('Downloaded By',  user.name,                              true);
      rowF('Role',           user.role);
      rowF('Download Time',  new Date().toLocaleString('en-IN'),     true);
      rowF('Portal',         'PrithviNet — Maharashtra SPCB');
      y += 8;

      doc.setFillColor(238, 244, 251); doc.roundedRect(margin, y, contentW, 20, 2, 2, 'F');
      doc.setTextColor(30, 74, 138); doc.setFontSize(7.5); doc.setFont('helvetica', 'bold');
      doc.text('OFFICIAL COMPLIANCE STATEMENT', W / 2, y + 6, { align: 'center' });
      doc.setFont('helvetica', 'normal'); doc.setTextColor(45, 58, 92);
      const stmt = doc.splitTextToSize('This document is an official record downloaded from the PrithviNet Compliance Portal under the Environment (Protection) Act, 1986. This record may be used for regulatory proceedings by MPCB officers.', contentW - 8);
      doc.text(stmt, W / 2, y + 12, { align: 'center' });

      doc.setFillColor(45, 58, 92); doc.rect(0, 280, W, 17, 'F');
      doc.setTextColor(168, 180, 204); doc.setFontSize(7); doc.setFont('helvetica', 'normal');
      doc.text('Maharashtra State Pollution Control Board  |  PrithviNet Compliance Portal  |  Official Document', W / 2, 287, { align: 'center' });
      doc.text('Environment (Protection) Act, 1986  |  Confidential — For MPCB Use', W / 2, 292, { align: 'center' });

      const blob = doc.output('blob');
      const url  = URL.createObjectURL(blob);
      setPdfModal({ url, reportId: r.id, industry: r.industry });
    } catch {
      toast.error('Failed to generate PDF');
    }
    setGenerating(null);
  };

  return (
    <PageShell>
      <Toaster position="top-right" toastOptions={{ style: { background: 'white', color: 'var(--text-dark)', border: '1px solid var(--border)', fontFamily: 'Arial', fontSize: '0.82rem' } }} />

      {pdfModal && <PDFModal pdfUrl={pdfModal.url} reportId={pdfModal.reportId} industry={pdfModal.industry} onClose={() => setPdfModal(null)} />}

      <div className="breadcrumb">
        <span>Home</span><span>›</span>
        <a onClick={() => router.push('/dashboard')} style={{ cursor: 'pointer' }}>Dashboard</a>
        <span>›</span>
        <span style={{ color: 'var(--navy)', fontWeight: '700' }}>Industry Reports</span>
      </div>
      <div className="live-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="live-dot" />
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#22c55e', fontFamily: 'Arial', letterSpacing: '0.05em' }}>LIVE</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Arial', marginLeft: '0.35rem' }}>
            {REPORTS.length} total submissions · {overallRate}% overall compliance
          </span>
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Arial' }}>All Industries — Maharashtra</span>
      </div>

      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem' }}>
          <div className="section-card">
            <div className="section-title">Compliance Summary</div>
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={52} outerRadius={78} dataKey="value" paddingAngle={3}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'white', border: '1px solid var(--border)', fontSize: '12px', fontFamily: 'Arial' }} />
                <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'Arial' }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ textAlign: 'center', marginTop: '0.25rem' }}>
              <div style={{ fontSize: '1.7rem', fontWeight: '800', fontFamily: 'Georgia', color: overallRate < 50 ? 'var(--danger)' : overallRate < 80 ? '#d4680a' : 'var(--accent-green)' }}>{overallRate}%</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Arial' }}>Overall compliance rate</div>
            </div>
          </div>
          <div className="section-card">
            <div className="section-title">Industry Compliance Status</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {INDUSTRIES.map(ind => (
                <div key={ind.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--light-gray)', borderRadius: '4px', padding: '0.75rem 1rem', border: '1px solid var(--border)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)', fontFamily: 'Arial' }}>{ind.name}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'Arial', marginTop: '0.1rem' }}>{ind.type} · RO: {ind.assignedRO}</div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '48px' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', fontFamily: 'Georgia', color: ind.complianceRate < 50 ? 'var(--danger)' : ind.complianceRate < 80 ? '#d4680a' : 'var(--accent-green)' }}>{ind.complianceRate}%</div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: 'Arial' }}>compliance</div>
                  </div>
                  <div style={{ width: '90px', background: 'var(--border)', borderRadius: '3px', height: '8px', flexShrink: 0 }}>
                    <div style={{ height: '100%', borderRadius: '3px', width: `${ind.complianceRate}%`, background: ind.complianceRate < 50 ? 'var(--danger)' : ind.complianceRate < 80 ? '#d4680a' : 'var(--accent-green)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="section-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div className="section-title" style={{ marginBottom: 0 }}>Submitted Reports</div>
            <select value={filter} onChange={e => setFilter(e.target.value)}
              style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '4px', color: 'var(--text-dark)', fontSize: '0.78rem', padding: '0.35rem 0.65rem', cursor: 'pointer', fontFamily: 'Arial', outline: 'none' }}>
              {industries.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="gov-table">
              <thead>
                <tr><th>Report ID</th><th>Industry</th><th>Type</th><th>Date</th><th>Parameters</th><th>Submitted By</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td style={{ color: 'var(--accent-blue)', fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: '600' }}>{r.id}</td>
                    <td style={{ fontWeight: '600' }}>{r.industry}</td>
                    <td style={{ fontSize: '0.8rem' }}>{r.type}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{r.date}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{r.parameters}</td>
                    <td style={{ fontSize: '0.78rem' }}>{r.submittedBy}</td>
                    <td><span className={r.status === 'Compliant' ? 'badge-compliant' : r.status === 'Non-Compliant' ? 'badge-noncompliant' : 'badge-pending'}>{r.status}</span></td>
                    <td>
                      <button
                        className="btn-outline"
                        style={{ fontSize: '0.7rem', padding: '0.22rem 0.7rem', minWidth: '80px' }}
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

      </div>
    </PageShell>
  );
}
