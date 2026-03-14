// ─────────────────────────────────────────────────────────────────────────────
// pdfUtils.ts — shared PDF generation helpers using jsPDF
// Used by: complaint PDF, report downloads
// Does NOT modify any existing file
// ─────────────────────────────────────────────────────────────────────────────

export async function getJsPDF() {
  const { default: jsPDF } = await import('jspdf');
  return jsPDF;
}

// ── Shared header for all PDFs ─────────────────────────────────────────────
function addHeader(doc: any, title: string, subtitle: string) {
  // Tricolour bar
  doc.setFillColor(255, 107, 0);   // saffron
  doc.rect(0, 0, 70, 6, 'F');
  doc.setFillColor(255, 255, 255); // white
  doc.rect(70, 0, 70, 6, 'F');
  doc.setFillColor(19, 136, 8);    // green
  doc.rect(140, 0, 70, 6, 'F');

  // Header background
  doc.setFillColor(45, 58, 92);
  doc.rect(0, 6, 210, 28, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PRITHVINET', 14, 18);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(168, 180, 204);
  doc.text('Maharashtra State Pollution Control Board', 14, 24);
  doc.text('Government of Maharashtra — Environment (Protection) Act, 1986', 14, 29);

  // Document title right-aligned
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 196, 18, { align: 'right' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(168, 180, 204);
  doc.text(subtitle, 196, 24, { align: 'right' });

  // Generated date
  const now = new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' });
  doc.text(`Generated: ${now}`, 196, 29, { align: 'right' });
}

// ── Section heading ─────────────────────────────────────────────────────────
function sectionHead(doc: any, text: string, y: number) {
  doc.setFillColor(238, 240, 245);
  doc.rect(14, y - 4, 182, 8, 'F');
  doc.setDrawColor(45, 58, 92);
  doc.setLineWidth(0.5);
  doc.line(14, y - 4, 14, y + 4);
  doc.setTextColor(45, 58, 92);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(text.toUpperCase(), 18, y + 0.5);
  return y + 10;
}

// ── Row helper ──────────────────────────────────────────────────────────────
function row(doc: any, label: string, value: string, y: number, highlight = false) {
  if (highlight) {
    doc.setFillColor(255, 248, 235);
    doc.rect(14, y - 4, 182, 7, 'F');
  }
  doc.setTextColor(120, 130, 150);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(label, 18, y);
  doc.setTextColor(30, 42, 69);
  doc.setFont('helvetica', 'bold');
  doc.text(value || '—', 80, y);
  return y + 8;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. COMPLAINT PDF
// ─────────────────────────────────────────────────────────────────────────────
export async function generateComplaintPDF(complaint: {
  refNo: string;
  category: string;
  district: string;
  location: string;
  description: string;
  submittedBy: string;
  submitterEmail?: string;
  datetime: string;
  photoBase64?: string;
}) {
  const JsPDF = await getJsPDF();
  const doc = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  addHeader(doc, 'COMPLAINT RECEIPT', 'Official Acknowledgement');

  let y = 46;

  // Reference box
  doc.setFillColor(212, 234, 212);
  doc.roundedRect(14, y, 182, 16, 2, 2, 'F');
  doc.setDrawColor(22, 101, 52);
  doc.setLineWidth(0.5);
  doc.roundedRect(14, y, 182, 16, 2, 2, 'D');
  doc.setTextColor(22, 101, 52);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('REFERENCE NUMBER', 105, y + 5, { align: 'center' });
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(complaint.refNo, 105, y + 12, { align: 'center' });

  y += 24;

  // Notice
  doc.setFillColor(255, 251, 235);
  doc.rect(14, y, 182, 10, 'F');
  doc.setTextColor(146, 64, 14);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('This document is an official acknowledgement of your complaint filed with Maharashtra State Pollution Control Board.', 105, y + 4, { align: 'center' });
  doc.text('Please keep this receipt for your records. Your complaint will be reviewed within 3 working days.', 105, y + 8.5, { align: 'center' });
  y += 18;

  // Complaint details
  y = sectionHead(doc, 'Complaint Details', y);
  y = row(doc, 'Category', complaint.category, y, true);
  y = row(doc, 'District', complaint.district, y);
  y = row(doc, 'Location', complaint.location, y, true);
  y = row(doc, 'Date & Time', new Date(complaint.datetime).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' }), y);
  y += 4;

  y = sectionHead(doc, 'Description', y);
  doc.setTextColor(45, 58, 92);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const descLines = doc.splitTextToSize(complaint.description, 170);
  doc.text(descLines, 18, y);
  y += descLines.length * 5 + 8;

  y = sectionHead(doc, 'Complainant Information', y);
  y = row(doc, 'Filed By', complaint.submittedBy, y, true);
  if (complaint.submitterEmail) {
    y = row(doc, 'Email', complaint.submitterEmail, y);
  }
  y += 4;

  // Photo if present
  if (complaint.photoBase64 && y < 220) {
    y = sectionHead(doc, 'Attached Photo Evidence', y);
    try {
      doc.addImage(complaint.photoBase64, 'JPEG', 14, y, 60, 45);
      y += 52;
    } catch {}
  }

  // What happens next
  y = sectionHead(doc, 'What Happens Next', y);
  const steps = [
    '1. Your complaint has been assigned to the Regional Officer for your district.',
    '2. An officer will review the complaint within 3 working days.',
    '3. If an inspection is required, you will be notified via the tracking portal.',
    '4. Track your complaint status at: prithvinet.gov.in/my-complaints',
  ];
  doc.setTextColor(45, 58, 92);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  steps.forEach(s => {
    doc.text(s, 18, y);
    y += 6;
  });

  // Footer
  doc.setFillColor(45, 58, 92);
  doc.rect(0, 280, 210, 17, 'F');
  doc.setTextColor(168, 180, 204);
  doc.setFontSize(7);
  doc.text('Maharashtra State Pollution Control Board  |  MPCB Helpline: 1800-233-3535 (Toll Free)  |  helpdesk@mpcb.gov.in', 105, 287, { align: 'center' });
  doc.text('This is a computer-generated document. No signature required.', 105, 292, { align: 'center' });

  // Open in new tab
  const blob = doc.output('blob');
  const url  = URL.createObjectURL(blob);
  window.open(url, '_blank');
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. REPORT PDF — for both staff and industry
// ─────────────────────────────────────────────────────────────────────────────
export async function generateReportPDF(report: {
  id: string;
  industry: string;
  type: string;
  date: string;
  parameters: string;
  status: string;
  submittedBy: string;
}, downloadedBy: string) {
  const JsPDF = await getJsPDF();
  const doc = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  addHeader(doc, 'COMPLIANCE REPORT', report.type + ' Emissions Report');

  let y = 46;

  // Status banner
  const isCompliant = report.status === 'Compliant';
  const isPending   = report.status === 'Pending';
  doc.setFillColor(isCompliant ? 212 : isPending ? 219 : 254, isCompliant ? 234 : isPending ? 234 : 226, isCompliant ? 212 : isPending ? 253 : 226);
  doc.roundedRect(14, y, 182, 14, 2, 2, 'F');
  doc.setTextColor(isCompliant ? 22 : isPending ? 30 : 153, isCompliant ? 101 : isPending ? 74 : 27, isCompliant ? 52 : isPending ? 138 : 27);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  const statusLabel = isCompliant ? 'COMPLIANT — Within Prescribed Limits' : isPending ? 'PENDING — Awaiting Review' : 'NON-COMPLIANT — Exceeds Prescribed Limits';
  doc.text(statusLabel, 105, y + 9, { align: 'center' });
  y += 22;

  y = sectionHead(doc, 'Report Information', y);
  y = row(doc, 'Report ID',      report.id,          y, true);
  y = row(doc, 'Industry',       report.industry,    y);
  y = row(doc, 'Report Type',    report.type,        y, true);
  y = row(doc, 'Report Date',    report.date,        y);
  y = row(doc, 'Parameters',     report.parameters,  y, true);
  y = row(doc, 'Submitted By',   report.submittedBy, y);
  y = row(doc, 'Status',         report.status,      y, true);
  y += 4;

  y = sectionHead(doc, 'Prescribed Limits Reference', y);
  y = row(doc, 'SO2',   '80 ppm (as per EP Act Schedule)', y, true);
  y = row(doc, 'NO2',   '60 ppm (as per EP Act Schedule)', y);
  y = row(doc, 'PM2.5', '60 ug/m3 (as per CPCB norms)',    y, true);
  y = row(doc, 'Noise (Day)',   '55 dB(A)',  y);
  y = row(doc, 'Noise (Night)', '45 dB(A)',  y, true);
  y += 4;

  y = sectionHead(doc, 'Document Information', y);
  y = row(doc, 'Downloaded By', downloadedBy, y, true);
  y = row(doc, 'Download Time', new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' }), y);
  y = row(doc, 'Portal', 'PrithviNet — Maharashtra SPCB', y, true);

  // Compliance statement
  y += 4;
  doc.setFillColor(238, 244, 251);
  doc.roundedRect(14, y, 182, 22, 2, 2, 'F');
  doc.setTextColor(30, 74, 138);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL COMPLIANCE STATEMENT', 105, y + 6, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(45, 58, 92);
  const stmt = 'This report has been submitted in accordance with the Environment (Protection) Act, 1986 and the rules framed thereunder. The data presented is subject to verification by Maharashtra State Pollution Control Board.';
  const stmtLines = doc.splitTextToSize(stmt, 170);
  doc.text(stmtLines, 105, y + 12, { align: 'center' });

  // Footer
  doc.setFillColor(45, 58, 92);
  doc.rect(0, 280, 210, 17, 'F');
  doc.setTextColor(168, 180, 204);
  doc.setFontSize(7);
  doc.text('Maharashtra State Pollution Control Board  |  MPCB Helpline: 1800-233-3535 (Toll Free)', 105, 287, { align: 'center' });
  doc.text('This is a computer-generated document. Official record of submission to Maharashtra SPCB.', 105, 292, { align: 'center' });

  const blob = doc.output('blob');
  const url  = URL.createObjectURL(blob);
  window.open(url, '_blank');
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. ESCALATION / ALERT SUMMARY PDF
// ─────────────────────────────────────────────────────────────────────────────
export async function generateEscalationPDF(cases: any[], alerts: any[], generatedBy: string) {
  const JsPDF = await getJsPDF();
  const doc = new JsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  addHeader(doc, 'ESCALATION SUMMARY', 'Compliance Enforcement Report');

  let y = 46;

  // Summary stats
  const open     = cases.filter(c => c.status === 'Open').length;
  const resolved = cases.filter(c => c.status === 'Resolved').length;
  const unacked  = alerts.filter(a => !a.acknowledged).length;

  doc.setFillColor(238, 240, 245);
  doc.roundedRect(14, y, 56, 20, 2, 2, 'F');
  doc.roundedRect(77, y, 56, 20, 2, 2, 'F');
  doc.roundedRect(140, y, 56, 20, 2, 2, 'F');

  [[open, 'Open Cases', 14], [resolved, 'Resolved', 77], [unacked, 'Unacked Alerts', 140]].forEach(([val, lbl, x]: any) => {
    doc.setTextColor(45, 58, 92);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(String(val), x + 28, y + 11, { align: 'center' });
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 130, 150);
    doc.text(lbl.toUpperCase(), x + 28, y + 17, { align: 'center' });
  });
  y += 28;

  // Cases table
  y = sectionHead(doc, 'Escalation Cases', y);
  doc.setFillColor(45, 58, 92);
  doc.rect(14, y - 2, 182, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  ['ID', 'Industry', 'Pollutant', 'Level', 'Status', 'Days'].forEach((h, i) => {
    doc.text(h, [18, 38, 82, 122, 152, 185][i], y + 3);
  });
  y += 8;

  cases.slice(0, 8).forEach((c, i) => {
    if (i % 2 === 0) { doc.setFillColor(248, 247, 244); doc.rect(14, y - 3, 182, 7, 'F'); }
    doc.setTextColor(45, 58, 92);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(c.id || '', 18, y + 1);
    doc.text((c.industryName || '').slice(0, 22), 38, y + 1);
    doc.text(c.pollutant || '', 82, y + 1);
    doc.text(c.level || '', 122, y + 1);
    doc.text(c.status || '', 152, y + 1);
    doc.text(String(c.daysExceeded || 0), 185, y + 1);
    y += 7;
  });
  y += 6;

  // Alerts table
  if (alerts.length > 0 && y < 240) {
    y = sectionHead(doc, 'System Alerts', y);
    doc.setFillColor(45, 58, 92);
    doc.rect(14, y - 2, 182, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    ['Station', 'Rule', 'Value', 'Severity', 'Status'].forEach((h, i) => {
      doc.text(h, [18, 68, 118, 148, 175][i], y + 3);
    });
    y += 8;

    alerts.slice(0, 6).forEach((a, i) => {
      if (i % 2 === 0) { doc.setFillColor(248, 247, 244); doc.rect(14, y - 3, 182, 7, 'F'); }
      doc.setTextColor(45, 58, 92);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text((a.stationName || '').slice(0, 24), 18, y + 1);
      doc.text((a.ruleName || '').slice(0, 18), 68, y + 1);
      doc.text(`${a.triggeredValue}${a.unit}`, 118, y + 1);
      doc.text(a.severity || '', 148, y + 1);
      doc.text(a.acknowledged ? 'Acknowledged' : 'Pending', 175, y + 1);
      y += 7;
    });
  }

  y += 6;
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 130, 150);
  doc.text(`Report generated by: ${generatedBy}  |  ${new Date().toLocaleString('en-IN')}`, 14, y);

  doc.setFillColor(45, 58, 92);
  doc.rect(0, 280, 210, 17, 'F');
  doc.setTextColor(168, 180, 204);
  doc.setFontSize(7);
  doc.text('Maharashtra State Pollution Control Board  |  PrithviNet Compliance Portal', 105, 287, { align: 'center' });
  doc.text('Confidential — For internal MPCB use only', 105, 292, { align: 'center' });

  const blob = doc.output('blob');
  const url  = URL.createObjectURL(blob);
  window.open(url, '_blank');
}
