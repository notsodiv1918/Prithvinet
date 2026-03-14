'use client';
import PageShell from '@/components/PageShell';
import { useAuth } from '@/lib/useAuth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { REPORTS, INDUSTRIES } from '@/data/mockData';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';
import { generateReportPDF } from '@/lib/pdfUtils';

export default function ReportsPage() {
  const router = useRouter();
  const { user, mounted } = useAuth({ allowedRoles:['Super Admin','Regional Officer','Monitoring Team'] });
  const [filter, setFilter] = useState('All');

  if (!mounted || !user) return <PageShell loading />;

  const industries   = ['All', ...Array.from(new Set(REPORTS.map(r => r.industry)))];
  const filtered     = filter === 'All' ? REPORTS : REPORTS.filter(r => r.industry === filter);
  const compliant    = REPORTS.filter(r => r.status === 'Compliant').length;
  const nonCompliant = REPORTS.filter(r => r.status === 'Non-Compliant').length;
  const pending      = REPORTS.filter(r => r.status === 'Pending').length;
  const overallRate  = Math.round((compliant / REPORTS.length) * 100);
  const pieData      = [
    { name:'Compliant',     value:compliant,    color:'#1a6b3a' },
    { name:'Non-Compliant', value:nonCompliant, color:'#c0392b' },
    { name:'Pending',       value:pending,      color:'#1a4e8a' },
  ];

  return (
    <PageShell>
      <Toaster position="top-right" toastOptions={{ style:{ background:'white', color:'var(--text-dark)', border:'1px solid var(--border)', fontFamily:'Arial', fontSize:'0.82rem' } }} />
      <div className="breadcrumb">
        <span>🏠 Home</span><span>›</span>
        <a onClick={() => router.push('/dashboard')} style={{ cursor:'pointer' }}>Dashboard</a>
        <span>›</span>
        <span style={{ color:'var(--navy)', fontWeight:'700' }}>☰ Industry Reports</span>
      </div>
      <div className="live-bar">
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <span className="live-dot" />
          <span style={{ fontSize:'0.72rem', fontWeight:'700', color:'#22c55e', fontFamily:'Arial', letterSpacing:'0.05em' }}>LIVE</span>
          <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'Arial', marginLeft:'0.35rem' }}>
            {REPORTS.length} total submissions · {overallRate}% overall compliance
          </span>
        </div>
        <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'Arial' }}>All Industries — Maharashtra</span>
      </div>
      <div className="main-content" style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:'1.25rem' }}>
          <div className="section-card">
            <div className="section-title">📊 Compliance Summary</div>
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={52} outerRadius={78} dataKey="value" paddingAngle={3}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background:'white', border:'1px solid var(--border)', fontSize:'12px', fontFamily:'Arial' }} />
                <Legend wrapperStyle={{ fontSize:'12px', fontFamily:'Arial' }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ textAlign:'center', marginTop:'0.25rem' }}>
              <div style={{ fontSize:'1.7rem', fontWeight:'800', fontFamily:'Georgia', color:overallRate<50?'var(--danger)':overallRate<80?'#d4680a':'var(--accent-green)' }}>{overallRate}%</div>
              <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'Arial' }}>Overall compliance rate</div>
            </div>
          </div>
          <div className="section-card">
            <div className="section-title">🏭 Industry Compliance Status</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
              {INDUSTRIES.map(ind => (
                <div key={ind.id} style={{ display:'flex', alignItems:'center', gap:'1rem', background:'var(--light-gray)', borderRadius:'4px', padding:'0.75rem 1rem', border:'1px solid var(--border)' }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'0.82rem', fontWeight:'700', color:'var(--text-dark)', fontFamily:'Arial' }}>{ind.name}</div>
                    <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', fontFamily:'Arial', marginTop:'0.1rem' }}>{ind.type} · RO: {ind.assignedRO}</div>
                  </div>
                  <div style={{ textAlign:'right', minWidth:'48px' }}>
                    <div style={{ fontSize:'1.1rem', fontWeight:'800', fontFamily:'Georgia', color:ind.complianceRate<50?'var(--danger)':ind.complianceRate<80?'#d4680a':'var(--accent-green)' }}>{ind.complianceRate}%</div>
                    <div style={{ fontSize:'0.6rem', color:'var(--text-muted)', fontFamily:'Arial' }}>compliance</div>
                  </div>
                  <div style={{ width:'90px', background:'var(--border)', borderRadius:'3px', height:'8px', flexShrink:0 }}>
                    <div style={{ height:'100%', borderRadius:'3px', width:`${ind.complianceRate}%`, background:ind.complianceRate<50?'var(--danger)':ind.complianceRate<80?'#d4680a':'var(--accent-green)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="section-card">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
            <div className="section-title" style={{ marginBottom:0 }}>📋 Submitted Reports</div>
            <select value={filter} onChange={e => setFilter(e.target.value)}
              style={{ background:'white', border:'1.5px solid var(--border)', borderRadius:'4px', color:'var(--text-dark)', fontSize:'0.78rem', padding:'0.35rem 0.65rem', cursor:'pointer', fontFamily:'Arial', outline:'none' }}>
              {industries.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table className="gov-table">
              <thead><tr><th>Report ID</th><th>Industry</th><th>Type</th><th>Date</th><th>Parameters</th><th>Submitted By</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td style={{ color:'var(--accent-blue)', fontFamily:'monospace', fontSize:'0.78rem', fontWeight:'600' }}>{r.id}</td>
                    <td style={{ fontWeight:'600' }}>{r.industry}</td>
                    <td style={{ fontSize:'0.8rem' }}>{r.type}</td>
                    <td style={{ color:'var(--text-muted)', fontSize:'0.78rem' }}>{r.date}</td>
                    <td style={{ color:'var(--text-muted)', fontSize:'0.75rem' }}>{r.parameters}</td>
                    <td style={{ fontSize:'0.78rem' }}>{r.submittedBy}</td>
                    <td><span className={r.status==='Compliant'?'badge-compliant':r.status==='Non-Compliant'?'badge-noncompliant':'badge-pending'}>{r.status}</span></td>
                    <td><button className="btn-outline" style={{ fontSize:'0.7rem', padding:'0.22rem 0.6rem' }} onClick={async () => { toast.loading('Generating PDF...'); await generateReportPDF(r, user.name); toast.dismiss(); }}>Download PDF</button></td>
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
