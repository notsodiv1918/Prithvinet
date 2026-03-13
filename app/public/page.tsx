'use client';
import { STATIONS } from '@/data/mockData';

export default function PublicPage() {
  const avgAqi = Math.round(STATIONS.reduce((a,s)=>a+s.aqi,0)/STATIONS.length);
  const breaches = STATIONS.filter(s=>s.status==='breach');

  const getAqiInfo = (aqi: number) => {
    if (aqi<=50) return { label:'Good', color:'#1a6b3a', bg:'#d4edda', advice:'Air quality is satisfactory. No restrictions.' };
    if (aqi<=100) return { label:'Moderate', color:'#856404', bg:'#fff3cd', advice:'Acceptable quality. Sensitive individuals take care.' };
    if (aqi<=150) return { label:'Unhealthy for Sensitive Groups', color:'#d4680a', bg:'#fef0e0', advice:'Sensitive groups should limit outdoor activity.' };
    if (aqi<=200) return { label:'Unhealthy', color:'#c0392b', bg:'#fdf0ee', advice:'Everyone may experience health effects. Limit exertion.' };
    if (aqi<=300) return { label:'Very Unhealthy', color:'#7b0000', bg:'#f8d7da', advice:'Health alert. Avoid outdoor activities.' };
    return { label:'Hazardous', color:'#4a0000', bg:'#f5c6cb', advice:'Emergency conditions. Stay indoors.' };
  };

  const overall = getAqiInfo(avgAqi);

  return (
    <div style={{ minHeight:'100vh', background:'#f0f8f3', fontFamily:'Segoe UI, Arial, sans-serif' }}>

      {/* India flag stripe */}
      <div style={{ height:'5px', background:'linear-gradient(90deg,#FF9933 33.33%,#ffffff 33.33%,#ffffff 66.66%,#138808 66.66%)' }} />

      {/* Header */}
      <div style={{ background:'#1a6b3a', padding:'0.75rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <span style={{ fontSize:'2rem' }}>🌿</span>
          <div>
            <div style={{ fontSize:'0.65rem', color:'#a8d5bc', letterSpacing:'0.1em', textTransform:'uppercase' }}>Government of Maharashtra</div>
            <div style={{ fontSize:'1.05rem', fontWeight:'800', color:'white' }}>PrithviNet — Public Air Quality Information</div>
            <div style={{ fontSize:'0.65rem', color:'#a8d5bc' }}>Maharashtra State Pollution Control Board</div>
          </div>
        </div>
        <div style={{ textAlign:'right', fontSize:'0.68rem', color:'#a8d5bc' }}>
          Data updated: {new Date().toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'})}<br/>
          Helpline: 1800-233-3535 (Toll Free)
        </div>
      </div>

      <div style={{ background:'#145530', borderBottom:'3px solid #f0a500', padding:'0.35rem 2rem' }}>
        <span style={{ fontSize:'0.7rem', color:'#d4edda' }}>📋 This is a public information portal. Data sourced from CAAQMS monitoring stations across Maharashtra.</span>
      </div>

      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'1.5rem 2rem' }}>

        {/* Health advisory */}
        {breaches.length>0 && (
          <div style={{ background:'#fdf0ee', border:'1px solid #f5c6cb', borderLeft:'5px solid #c0392b', borderRadius:'4px', padding:'1rem 1.25rem', marginBottom:'1.5rem', display:'flex', gap:'0.75rem', alignItems:'flex-start' }}>
            <span style={{ fontSize:'1.25rem' }}>⚠️</span>
            <div>
              <div style={{ fontWeight:'700', color:'#721c24', marginBottom:'0.25rem', fontSize:'0.9rem' }}>Health Advisory — Poor Air Quality Alert</div>
              <div style={{ fontSize:'0.8rem', color:'#721c24', lineHeight:1.7 }}>
                Air quality is currently <strong>Very Unhealthy</strong> in {breaches.length} monitoring zones.
                Sensitive groups (elderly, children, people with respiratory conditions) should avoid all outdoor activities.
                General public should limit prolonged outdoor exertion and keep windows closed.
              </div>
            </div>
          </div>
        )}

        {/* Overall AQI */}
        <div style={{ background:'white', border:`2px solid ${overall.color}`, borderRadius:'6px', padding:'1.5rem 2rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'2rem', boxShadow:'0 2px 8px rgba(26,107,58,0.1)' }}>
          <div style={{ textAlign:'center', minWidth:'120px' }}>
            <div style={{ fontSize:'0.7rem', color:'#6b8c7a', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.25rem' }}>Maharashtra Avg AQI</div>
            <div style={{ fontSize:'4.5rem', fontWeight:'900', color:overall.color, lineHeight:1 }}>{avgAqi}</div>
            <div style={{ fontSize:'0.85rem', fontWeight:'700', color:overall.color }}>{overall.label}</div>
          </div>
          <div style={{ flex:1, borderLeft:`2px solid ${overall.bg}`, paddingLeft:'2rem' }}>
            <div style={{ background:overall.bg, borderRadius:'4px', padding:'0.75rem 1rem', marginBottom:'0.5rem' }}>
              <div style={{ fontSize:'0.8rem', color:overall.color, fontWeight:'600' }}>Health Recommendation</div>
              <div style={{ fontSize:'0.78rem', color:overall.color, marginTop:'0.2rem' }}>{overall.advice}</div>
            </div>
            <div style={{ fontSize:'0.72rem', color:'#6b8c7a' }}>Based on readings from {STATIONS.length} CAAQMS stations · {breaches.length} stations in breach · {STATIONS.filter(s=>s.status==='safe').length} stations safe</div>
          </div>
        </div>

        {/* Station grid */}
        <h2 style={{ fontSize:'0.82rem', fontWeight:'700', color:'#1a6b3a', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'1rem', borderBottom:'2px solid #e8f5ee', paddingBottom:'0.5rem' }}>
          Air Quality Index by Location
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))', gap:'1rem', marginBottom:'1.5rem' }}>
          {STATIONS.map(s=>{
            const info = getAqiInfo(s.aqi);
            return (
              <div key={s.id} style={{ background:'white', border:`1px solid ${s.status==='breach'?'#f5c6cb':s.status==='warning'?'#ffd966':'#c8e0d2'}`, borderTop:`3px solid ${info.color}`, borderRadius:'4px', padding:'1rem', boxShadow:'0 1px 3px rgba(26,107,58,0.08)' }}>
                <div style={{ fontSize:'0.85rem', fontWeight:'700', color:'#1a2e22', marginBottom:'0.1rem' }}>{s.district}</div>
                <div style={{ fontSize:'0.65rem', color:'#6b8c7a', marginBottom:'0.75rem' }}>{s.name}</div>
                <div style={{ display:'flex', alignItems:'baseline', gap:'0.4rem', marginBottom:'0.2rem' }}>
                  <span style={{ fontSize:'2.2rem', fontWeight:'900', color:info.color, lineHeight:1 }}>{s.aqi}</span>
                  <span style={{ fontSize:'0.68rem', color:'#6b8c7a' }}>AQI</span>
                </div>
                <div style={{ fontSize:'0.72rem', fontWeight:'700', color:info.color, marginBottom:'0.5rem' }}>{info.label}</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.3rem' }}>
                  {[['SO₂',s.so2,'ppm'],['NO₂',s.no2,'ppm']].map(([k,v,u])=>(
                    <div key={String(k)} style={{ background:'#f7fcf9', border:'1px solid #e8f5ee', borderRadius:'3px', padding:'0.3rem 0.4rem' }}>
                      <div style={{ fontSize:'0.58rem', color:'#6b8c7a' }}>{k}</div>
                      <div style={{ fontSize:'0.8rem', fontWeight:'700', color:'#1a2e22' }}>{v} <span style={{ fontSize:'0.58rem', color:'#6b8c7a' }}>{u}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* AQI scale */}
        <div style={{ background:'white', border:'1px solid #c8e0d2', borderRadius:'4px', padding:'1.25rem', marginBottom:'1.5rem' }}>
          <h3 style={{ fontSize:'0.78rem', fontWeight:'700', color:'#1a6b3a', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.75rem' }}>AQI Scale Guide</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))', gap:'0.5rem' }}>
            {[
              ['0–50','Good','#1a6b3a','No health impact'],
              ['51–100','Moderate','#856404','Sensitive groups take care'],
              ['101–200','Unhealthy','#d4680a','Limit outdoor activity'],
              ['201–300','Very Unhealthy','#c0392b','Avoid outdoor activity'],
              ['300+','Hazardous','#7b0000','Stay indoors'],
            ].map(([range,label,color,advice])=>(
              <div key={range} style={{ borderLeft:`4px solid ${color}`, padding:'0.5rem 0.75rem', background:'#f7fcf9', borderRadius:'0 3px 3px 0' }}>
                <div style={{ fontSize:'0.72rem', fontWeight:'700', color }}>{range} — {label}</div>
                <div style={{ fontSize:'0.65rem', color:'#6b8c7a', marginTop:'0.1rem' }}>{advice}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign:'center', fontSize:'0.68rem', color:'#6b8c7a', borderTop:'1px solid #e8f5ee', paddingTop:'1rem', lineHeight:1.8 }}>
          © 2024 Maharashtra State Pollution Control Board · PrithviNet Environmental Portal<br />
          Data sourced from CAAQMS monitoring stations · For emergencies: <strong>1800-233-3535</strong> (Toll Free)<br />
          Ministry of Environment, Forest and Climate Change · Government of India
        </div>
      </div>
    </div>
  );
}
