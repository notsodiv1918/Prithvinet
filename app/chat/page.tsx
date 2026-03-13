'use client';
import PageShell from '@/components/PageShell';
import { useAuth } from '@/lib/useAuth';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Message { id:number; from:'admin'|'ro'; fromName:string; text:string; time:string; }

const SEED: Message[] = [
  { id:1, from:'admin', fromName:'Arjun Mehta',  text:'Rajesh, please give me an update on the Bharat Steel inspection. They have breached SO₂ limits 5 days in a row.', time:'10:15 AM' },
  { id:2, from:'ro',    fromName:'Rajesh Kumar', text:'Good morning sir. I have already sent them a formal reminder yesterday. Planning an on-site inspection this Thursday.', time:'10:22 AM' },
  { id:3, from:'admin', fromName:'Arjun Mehta',  text:'Good. Also check Nagpur Butibori station — AQI crossed 267 last night.', time:'10:24 AM' },
  { id:4, from:'ro',    fromName:'Rajesh Kumar', text:'Noted. I will coordinate with the monitoring team and file a report by end of day.', time:'10:31 AM' },
  { id:5, from:'admin', fromName:'Arjun Mehta',  text:'Monthly compliance report is due Friday. Make sure all your industries have submitted.', time:'11:05 AM' },
  { id:6, from:'ro',    fromName:'Rajesh Kumar', text:'Understood. Vidarbha Coal and Latur Cement are still pending. I will follow up immediately.', time:'11:12 AM' },
];
const AUTO: Record<string,string[]> = {
  admin:['Understood. I will look into this right away.','Thank you for the update. Please file a detailed report.','Acknowledged. Keep me posted on the inspection outcome.','Good work. Escalate if the situation does not improve.'],
  ro:   ['Rajesh, please action this at the earliest.','Please confirm once the inspection is complete.','Noted. Send me the compliance data when ready.','Make sure the industry receives a formal notice.'],
};

export default function ChatPage() {
  const router = useRouter();
  const { user, mounted } = useAuth({ allowedRoles:['Super Admin','Regional Officer'] });
  const [messages, setMessages] = useState<Message[]>(SEED);
  const [input, setInput]       = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);

  if (!mounted || !user) return <PageShell loading />;

  const myRole:'admin'|'ro' = user.role === 'Super Admin' ? 'admin' : 'ro';
  const otherLabel = myRole === 'admin' ? 'Rajesh Kumar — Regional Officer, Nagpur' : 'Arjun Mehta — Super Admin, MPCB';

  const send = () => {
    const text = input.trim(); if (!text) return;
    const now = new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});
    setMessages(p => [...p, { id:Date.now(), from:myRole, fromName:user.name, text, time:now }]);
    setInput('');
    setTimeout(() => {
      const pool = AUTO[myRole==='admin'?'ro':'admin'];
      const rf:'admin'|'ro' = myRole==='admin'?'ro':'admin';
      setMessages(p => [...p, { id:Date.now()+1, from:rf, fromName:myRole==='admin'?'Rajesh Kumar':'Arjun Mehta', text:pool[Math.floor(Math.random()*pool.length)], time:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}) }]);
    }, 1500);
  };

  return (
    <PageShell>
      <div className="breadcrumb">
        <span>🏠 Home</span><span>›</span>
        <a onClick={() => router.push('/dashboard')} style={{ cursor:'pointer' }}>Dashboard</a>
        <span>›</span>
        <span style={{ color:'var(--navy)', fontWeight:'700' }}>✉ Internal Messages</span>
      </div>
      <div className="live-bar">
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#22c55e' }} />
          <span style={{ fontSize:'0.72rem', fontWeight:'700', color:'#22c55e', fontFamily:'Arial' }}>Online</span>
          <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'Arial', marginLeft:'0.2rem' }}>· {otherLabel}</span>
        </div>
        <span style={{ fontSize:'0.65rem', color:'var(--text-muted)', fontFamily:'Arial', background:'var(--light-gray)', border:'1px solid var(--border)', padding:'0.15rem 0.6rem', borderRadius:'3px' }}>
          🔒 SPCB Secure Internal Network
        </span>
      </div>

      <div style={{ flex:1, display:'flex', overflow:'hidden', padding:'1rem 1.5rem', gap:'1rem', minHeight:0, maxHeight:'calc(100vh - 220px)' }}>
        {/* Main chat */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', background:'white', border:'1px solid var(--border)', borderRadius:'4px', overflow:'hidden', boxShadow:'0 1px 4px rgba(26,39,68,0.08)' }}>
          <div style={{ padding:'0.7rem 1rem', borderBottom:'2px solid var(--border)', background:'var(--off-white)', display:'flex', alignItems:'center', gap:'0.75rem', flexShrink:0 }}>
            <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:myRole==='admin'?'#e8f0f8':'#e8f5ee', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', border:`2px solid ${myRole==='admin'?'#c8d4e8':'#c8e0d2'}` }}>
              {myRole==='admin'?'👮':'🏢'}
            </div>
            <div>
              <div style={{ fontSize:'0.85rem', fontWeight:'700', color:'var(--navy)', fontFamily:'Georgia' }}>{otherLabel}</div>
              <div style={{ fontSize:'0.62rem', color:'var(--accent-green)', fontFamily:'Arial', display:'flex', alignItems:'center', gap:'0.3rem' }}>
                <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'var(--accent-green)' }} /> Active · SPCB Internal Network
              </div>
            </div>
            <div style={{ marginLeft:'auto', fontSize:'0.65rem', color:'var(--text-muted)', fontFamily:'Arial', background:'var(--light-gray)', padding:'0.2rem 0.65rem', borderRadius:'3px', border:'1px solid var(--border)' }}>Encrypted</div>
          </div>
          <div style={{ flex:1, overflowY:'auto', padding:'1rem', display:'flex', flexDirection:'column', gap:'0.75rem', background:'var(--off-white)' }}>
            <div style={{ textAlign:'center', fontSize:'0.62rem', color:'var(--text-muted)', margin:'0.25rem 0' }}>
              <span style={{ background:'white', padding:'0.2rem 0.85rem', borderRadius:'10px', border:'1px solid var(--border)', fontFamily:'Arial' }}>Today — 15 July 2024</span>
            </div>
            {messages.map(msg => {
              const mine = msg.from === myRole;
              return (
                <div key={msg.id} style={{ display:'flex', justifyContent:mine?'flex-end':'flex-start', gap:'0.45rem', alignItems:'flex-end' }}>
                  {!mine && <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:msg.from==='admin'?'#e8f0f8':'#e8f5ee', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', flexShrink:0, border:'1px solid var(--border)' }}>{msg.from==='admin'?'🏢':'👮'}</div>}
                  <div style={{ maxWidth:'65%' }}>
                    {!mine && <div style={{ fontSize:'0.6rem', color:'var(--text-muted)', marginBottom:'0.15rem', marginLeft:'0.2rem', fontFamily:'Arial' }}>{msg.fromName}</div>}
                    <div style={{ padding:'0.55rem 0.9rem', borderRadius:mine?'12px 12px 3px 12px':'12px 12px 12px 3px', background:mine?'var(--navy)':'white', color:mine?'white':'var(--text-dark)', border:mine?'none':'1px solid var(--border)', fontSize:'0.82rem', lineHeight:1.6, fontFamily:'Arial', boxShadow:'0 1px 3px rgba(26,39,68,0.07)' }}>
                      {msg.text}
                    </div>
                    <div style={{ fontSize:'0.58rem', color:'var(--text-muted)', marginTop:'0.15rem', fontFamily:'Arial', textAlign:mine?'right':'left', marginLeft:mine?0:'0.2rem' }}>{msg.time}{mine&&' ✓✓'}</div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
          <div style={{ padding:'0.75rem 1rem', borderTop:'2px solid var(--border)', background:'white', display:'flex', gap:'0.6rem', alignItems:'flex-end', flexShrink:0 }}>
            <textarea value={input} onChange={e => setInput(e.target.value)} rows={2}
              placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
              onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              style={{ flex:1, border:'1.5px solid var(--border)', borderRadius:'4px', padding:'0.5rem 0.75rem', fontSize:'0.82rem', color:'var(--text-dark)', background:'var(--off-white)', resize:'none', fontFamily:'Arial', lineHeight:1.5, outline:'none' }} />
            <button onClick={send} disabled={!input.trim()} className="btn-primary" style={{ padding:'0.55rem 1.1rem', fontSize:'0.82rem', flexShrink:0, opacity:input.trim()?1:0.45, cursor:input.trim()?'pointer':'default' }}>Send</button>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ width:'228px', flexShrink:0, display:'flex', flexDirection:'column', gap:'1rem' }}>
          <div className="section-card" style={{ marginBottom:0 }}>
            <div className="section-title">✉ Quick Templates</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
              {['Please submit the outstanding compliance report.','Inspection scheduled for your facility this week.','AQI breach detected — immediate action required.','Please confirm status of the pending follow-up.'].map(t => (
                <button key={t} onClick={() => setInput(t)}
                  style={{ background:'var(--off-white)', border:'1px solid var(--border)', borderRadius:'3px', padding:'0.4rem 0.6rem', fontSize:'0.7rem', color:'var(--text-mid)', cursor:'pointer', textAlign:'left', lineHeight:1.5, fontFamily:'Arial' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background='var(--light-gray)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background='var(--off-white)'}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="section-card" style={{ marginBottom:0 }}>
            <div className="section-title">⚐ Live Alerts</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
              {[['Bharat Steel SO₂: 142 ppm','var(--danger)','#fdf0ee'],['Nagpur AQI: 267','var(--danger)','#fdf0ee'],['3 reports overdue','#d4680a','#fef6ee']].map(([l,c,bg]) => (
                <div key={l} style={{ background:bg, borderRadius:'3px', padding:'0.38rem 0.65rem', fontSize:'0.7rem', color:c, fontWeight:'700', fontFamily:'Arial', border:`1px solid ${c}30` }}>{l}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
