'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { REPORTS, INDUSTRIES } from '@/data/mockData';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';

export default function ReportsPage() {
  const [filter, setFilter] = useState('All');
  const industries = ['All', ...Array.from(new Set(REPORTS.map(r=>r.industry)))];
  const filtered = filter==='All'?REPORTS:REPORTS.filter(r=>r.industry===filter);

  const compliant = REPORTS.filter(r=>r.status==='Compliant').length;
  const nonCompliant = REPORTS.filter(r=>r.status==='Non-Compliant').length;
  const pending = REPORTS.filter(r=>r.status==='Pending').length;

  const pieData = [
    { name:'Compliant', value:compliant, color:'#1a6b3a' },
    { name:'Non-Compliant', value:nonCompliant, color:'#c0392b' },
    { name:'Pending', value:pending, color:'#1a4e8a' },
  ];

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#f0f8f3' }}>
      <Sidebar />
      <main style={{ flex:1, overflow:'auto' }}>
        <TopBar title="Reports" subtitle="Industry monitoring reports and compliance analytics" />
        <div style={{ background:'white', borderBottom:'1px solid #e8f5ee', padding:'0.5rem 1.5rem' }}>
          <span style={{ fontSize:'0.7rem', color:'#6b8c7a' }}>Home › </span>
          <span style={{ fontSize:'0.7rem', color:'#1a6b3a', fontWeight:'600' }}>Reports</span>
        </div>
        <Toaster position="top-right" toastOptions={{ style:{ background:'white', color:'#1a2e22', border:'1px solid #c8e0d2' } }} />

        <div style={{ padding:'1.25rem 1.5rem' }}>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:'1.25rem', marginBottom:'1.25rem' }}>
            <div className="section-card">
              <div className="section-title">Compliance Summary</div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                    {pieData.map((e,i)=><Cell key={i} fill={e.color}/>)}
                  </Pie>
                  <Tooltip contentStyle={{ background:'white', border:'1px solid #c8e0d2', fontSize:'12px' }} />
                  <Legend wrapperStyle={{ fontSize:'12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ textAlign:'center', marginTop:'0.5rem' }}>
                <div style={{ fontSize:'1.6rem', fontWeight:'800', color:'#1a6b3a' }}>{Math.round((compliant/REPORTS.length)*100)}%</div>
                <div style={{ fontSize:'0.72rem', color:'#6b8c7a' }}>Overall compliance rate</div>
              </div>
            </div>

            <div className="section-card">
              <div className="section-title">Industry Status</div>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                {INDUSTRIES.map(ind=>(
                  <div key={ind.id} style={{ display:'flex', alignItems:'center', gap:'1rem', background:'#f7fcf9', border:'1px solid #e8f5ee', borderRadius:'4px', padding:'0.75rem' }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:'0.82rem', fontWeight:'700', color:'#1a2e22' }}>{ind.name}</div>
                      <div style={{ fontSize:'0.7rem', color:'#6b8c7a' }}>{ind.type} · RO: {ind.assignedRO}</div>
                    </div>
                    <div style={{ textAlign:'right', minWidth:'60px' }}>
                      <div style={{ fontSize:'1.1rem', fontWeight:'800', color:ind.complianceRate<50?'#c0392b':ind.complianceRate<80?'#d4680a':'#1a6b3a' }}>{ind.complianceRate}%</div>
                      <div style={{ fontSize:'0.62rem', color:'#6b8c7a' }}>compliance</div>
                    </div>
                    <div style={{ width:'90px', background:'#e8f5ee', borderRadius:'3px', height:'8px' }}>
                      <div style={{ height:'100%', width:`${ind.complianceRate}%`, background:ind.complianceRate<50?'#c0392b':ind.complianceRate<80?'#d4680a':'#1a6b3a', borderRadius:'3px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="section-card">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
              <div className="section-title" style={{ marginBottom:0 }}>Submitted Reports</div>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                <label style={{ fontSize:'0.75rem', color:'#6b8c7a' }}>Filter by Industry:</label>
                <select value={filter} onChange={e=>setFilter(e.target.value)}
                  style={{ background:'white', border:'1px solid #a0c8b4', borderRadius:'3px', color:'#1a2e22', fontSize:'0.8rem', padding:'0.3rem 0.5rem', cursor:'pointer' }}>
                  {industries.map(i=><option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>
            <div style={{ overflowX:'auto' }}>
              <table className="gov-table">
                <thead><tr><th>Report ID</th><th>Industry</th><th>Type</th><th>Date</th><th>Parameters</th><th>Submitted By</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {filtered.map(r=>(
                    <tr key={r.id}>
                      <td style={{ color:'#1a6b3a', fontFamily:'monospace', fontSize:'0.78rem', fontWeight:'600' }}>{r.id}</td>
                      <td style={{ fontWeight:'500' }}>{r.industry}</td>
                      <td>{r.type}</td>
                      <td style={{ color:'#6b8c7a', fontSize:'0.8rem' }}>{r.date}</td>
                      <td style={{ color:'#6b8c7a', fontSize:'0.78rem' }}>{r.parameters}</td>
                      <td style={{ fontSize:'0.78rem' }}>{r.submittedBy}</td>
                      <td><span className={r.status==='Compliant'?'badge-compliant':r.status==='Non-Compliant'?'badge-noncompliant':'badge-pending'}>{r.status}</span></td>
                      <td>
                        <button className="btn-outline" style={{ fontSize:'0.7rem', padding:'0.25rem 0.6rem' }}
                          onClick={()=>toast(`Report ${r.id} downloaded`,{icon:'📄'})}>
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
