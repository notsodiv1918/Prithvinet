'use client';
import IndustrySidebar from '@/components/IndustrySidebar';
import TopBar from '@/components/TopBar';
import { MONTHLY_REPORTS, PRESCRIBED_LIMITS } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';

export default function IndustryReports() {
  const chartData = [...MONTHLY_REPORTS].reverse().map(r => ({
    month: r.month.slice(0, 3),
    SO2: r.so2Avg, NO2: r.no2Avg, PM25: r.pm25Avg,
  }));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f8f3' }}>
      <IndustrySidebar />
      <main style={{ flex: 1, overflow: 'auto' }}>
        <TopBar title="Past Monthly Reports" subtitle="Bharat Steel Works — submission history and compliance record" />
        <div style={{ background: 'white', borderBottom: '1px solid #e8f5ee', padding: '0.5rem 1.5rem' }}>
          <span style={{ fontSize: '0.7rem', color: '#6b8c7a' }}>Home › My Dashboard › </span>
          <span style={{ fontSize: '0.7rem', color: '#1a6b3a', fontWeight: '600' }}>Past Reports</span>
        </div>
        <Toaster position="top-right" toastOptions={{ style: { background: 'white', color: '#1a2e22', border: '1px solid #c8e0d2' } }} />

        <div style={{ padding: '1.25rem 1.5rem' }}>

          {/* Summary stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
            {[
              { label: 'Total Reports', value: MONTHLY_REPORTS.length, sub: 'Last 6 months', color: '#1a6b3a' },
              { label: 'Compliant', value: MONTHLY_REPORTS.filter(r => r.status === 'Compliant').length, sub: 'Months in compliance', color: '#1a6b3a' },
              { label: 'Non-Compliant', value: MONTHLY_REPORTS.filter(r => r.status === 'Non-Compliant').length, sub: 'Months with breaches', color: '#c0392b' },
            ].map(s => (
              <div key={s.label} className="stat-card" style={{ borderTopColor: s.color }}>
                <div style={{ fontSize: '0.68rem', color: '#6b8c7a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>{s.label}</div>
                <div style={{ fontSize: '2.2rem', fontWeight: '800', color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.7rem', color: '#6b8c7a', marginTop: '0.2rem' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="section-card">
            <div className="section-title">6-Month Average Emissions Trend</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8f5ee" />
                <XAxis dataKey="month" tick={{ fill: '#6b8c7a', fontSize: 11 }} />
                <YAxis tick={{ fill: '#6b8c7a', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'white', border: '1px solid #c8e0d2', fontSize: '12px' }} />
                <ReferenceLine y={PRESCRIBED_LIMITS.so2} stroke="#c0392b" strokeDasharray="4 4" label={{ value: 'SO₂ Limit', fill: '#c0392b', fontSize: 9 }} />
                <Bar dataKey="SO2" name="SO₂ Avg" radius={[2, 2, 0, 0]}>
                  {chartData.map((entry, i) => <Cell key={i} fill={entry.SO2 > PRESCRIBED_LIMITS.so2 ? '#c0392b' : '#1a6b3a'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Reports table */}
          <div className="section-card">
            <div className="section-title">Monthly Report History</div>
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Month / Year</th>
                  <th>Avg SO₂ (ppm)</th>
                  <th>Avg NO₂ (ppm)</th>
                  <th>Avg PM2.5</th>
                  <th>Max SO₂</th>
                  <th>Avg Noise (dB)</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Notes</th>
                  <th>Download</th>
                </tr>
              </thead>
              <tbody>
                {MONTHLY_REPORTS.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: '700' }}>{r.month} {r.year}</td>
                    <td style={{ color: r.so2Avg > PRESCRIBED_LIMITS.so2 ? '#c0392b' : '#1a2e22', fontWeight: r.so2Avg > PRESCRIBED_LIMITS.so2 ? '700' : '400' }}>{r.so2Avg}</td>
                    <td style={{ color: r.no2Avg > PRESCRIBED_LIMITS.no2 ? '#c0392b' : '#1a2e22' }}>{r.no2Avg}</td>
                    <td style={{ color: r.pm25Avg > PRESCRIBED_LIMITS.pm25 ? '#c0392b' : '#1a2e22' }}>{r.pm25Avg}</td>
                    <td style={{ color: r.so2Max > PRESCRIBED_LIMITS.so2 ? '#c0392b' : '#1a2e22', fontSize: '0.78rem' }}>{r.so2Max}</td>
                    <td>{r.noiseAvg}</td>
                    <td><span className={r.status === 'Compliant' ? 'badge-compliant' : 'badge-noncompliant'}>{r.status}</span></td>
                    <td style={{ color: '#6b8c7a', fontSize: '0.78rem' }}>{r.submittedOn}</td>
                    <td style={{ fontSize: '0.72rem', color: '#6b8c7a', maxWidth: '160px' }}>{r.notes}</td>
                    <td>
                      <button className="btn-outline" style={{ fontSize: '0.68rem', padding: '0.2rem 0.6rem' }}
                        onClick={() => toast(`Report ${r.month} ${r.year} downloaded`, { icon: '📄' })}>
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Important notice */}
          <div style={{ background: '#f7fcf9', border: '1px solid #c8e0d2', borderRadius: '4px', padding: '1rem', fontSize: '0.75rem', color: '#3d5a48', lineHeight: 1.8 }}>
            <strong style={{ color: '#1a6b3a' }}>Reporting Obligation:</strong> Monthly emissions reports must be submitted by the 1st of each following month as per the Environment (Protection) Rules, 1986.
            Failure to submit within 15 days of the due date may result in a formal notice from your Regional Officer ({' '}
            <strong>Rajesh Kumar, Nagpur Zone</strong>).
            Persistent non-compliance can lead to temporary suspension of Consent to Operate (CTO) under the Water (Prevention and Control of Pollution) Act, 1974.
          </div>

        </div>
      </main>
    </div>
  );
}
