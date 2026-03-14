'use client';
import PageShell from '@/components/PageShell';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { callAI, SETUP_MESSAGE, FALLBACK_STAFF } from '@/lib/useAI';

interface Msg { role: 'user' | 'assistant'; content: string; ts: string; }

const SUGGESTIONS = [
  { label: 'Emission reduction',  prompt: 'If Bharat Steel reduces SO₂ by 30%, what is the expected AQI change in Nagpur over 7 days?' },
  { label: 'Festival shutdown',   prompt: 'Shut down the top 2 high-risk industries during Gudi Padwa (30 March). What is the projected AQI improvement?' },
  { label: 'Best compliance ROI', prompt: 'Which single industry, if made fully compliant, would most reduce regional AQI risk? Show the numbers.' },
  { label: 'Health risk summary', prompt: 'Give a health risk exposure summary for Nagpur residents this week based on current emission levels.' },
  { label: 'Missing report risk', prompt: 'Which industries have missing reports and what is their combined estimated AQI contribution?' },
  { label: 'Pune NO₂ scenario',  prompt: 'What happens to Pune AQI if Maharashtra Textiles reduces NO₂ by 50% over 5 days?' },
];

function Bubble({ msg }: { msg: Msg }) {
  const mine = msg.role === 'user';
  return (
    <div style={{ display:'flex', justifyContent:mine?'flex-end':'flex-start', marginBottom:'1rem', gap:'0.5rem', alignItems:'flex-start' }}>
      {!mine && (
        <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'linear-gradient(135deg,#1a2744,#1a5280)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0, marginTop:'2px' }}>🤖</div>
      )}
      <div style={{ maxWidth:'78%' }}>
        <div style={{ padding:'0.7rem 1rem', borderRadius:mine?'16px 16px 4px 16px':'16px 16px 16px 4px', background:mine?'var(--navy)':'white', color:mine?'white':'var(--text-dark)', border:mine?'none':'1px solid var(--border)', fontSize:'0.82rem', fontFamily:'Arial', lineHeight:1.65, boxShadow:'0 1px 4px rgba(26,39,68,0.08)', whiteSpace:'pre-wrap' }}>
          {msg.content}
        </div>
        <div style={{ fontSize:'0.58rem', color:'var(--text-muted)', fontFamily:'Arial', marginTop:'0.2rem', textAlign:mine?'right':'left', paddingInline:'0.2rem' }}>{msg.ts}</div>
      </div>
      {mine && (
        <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'var(--light-gray)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0, marginTop:'2px' }}>👤</div>
      )}
    </div>
  );
}

export default function CopilotPage() {
  const router = useRouter();
  const { user, mounted } = useAuth({ allowedRoles:['Super Admin','Regional Officer','Monitoring Team','Industry User'] });
  const ts = () => new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });

  const [msgs,         setMsgs]         = useState<Msg[]>([{
    role: 'assistant',
    content: '👋 Hello! I\'m the PrithviNet AI Compliance Copilot.\n\nI can simulate what-if scenarios, analyse regional risk, and project AQI changes from emission interventions — using live station and industry data.\n\nTry a suggested prompt, or type your own question.',
    ts: ts(),
  }]);
  const [input,        setInput]        = useState('');
  const [loading,      setLoading]      = useState(false);
  const [setupNeeded,  setSetupNeeded]  = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs]);

  if (!mounted || !user) return <PageShell loading />;

  const send = async (text: string) => {
    const q = text.trim(); if (!q || loading) return;
    const userMsg: Msg = { role:'user', content:q, ts:ts() };
    setMsgs(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history = [
      ...msgs.slice(1).map(m => ({ role: m.role as 'user'|'assistant', content: m.content })),
      { role: 'user' as const, content: q },
    ];

    const result = await callAI({
      messages: history,
      userRole: user.role,
      mode:     'staff',
    });

    if (result.isMissingKey) {
      setSetupNeeded(true);
      setMsgs(prev => [...prev, { role:'assistant', content: SETUP_MESSAGE, ts:ts() }]);
    } else if (result.error) {
      toast('AI temporarily unavailable — showing fallback data', { icon:'ℹ️' });
      setMsgs(prev => [...prev, { role:'assistant', content: FALLBACK_STAFF, ts:ts() }]);
    } else {
      setMsgs(prev => [...prev, { role:'assistant', content: result.reply, ts:ts() }]);
    }

    setLoading(false);
  };

  return (
    <PageShell>
      <Toaster position="top-right" toastOptions={{ style:{ background:'white', color:'var(--text-dark)', border:'1px solid var(--border)', fontFamily:'Arial', fontSize:'0.82rem' } }} />
      <div className="breadcrumb">
        <span>🏠 Home</span><span>›</span>
        <a onClick={() => router.push('/dashboard')} style={{ cursor:'pointer' }}>Dashboard</a>
        <span>›</span>
        <span style={{ color:'var(--navy)', fontWeight:'700' }}>🤖 AI Compliance Copilot</span>
      </div>
      <div className="live-bar">
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <span className="live-dot" />
          <span style={{ fontSize:'0.72rem', fontWeight:'700', color: setupNeeded ? '#d4680a' : '#22c55e', fontFamily:'Arial' }}>
            {setupNeeded ? 'SETUP REQUIRED' : 'LIVE'}
          </span>
          <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'Arial', marginLeft:'0.35rem' }}>
            {setupNeeded
              ? 'Add ANTHROPIC_API_KEY to .env.local to activate'
              : 'PrithviNet AI · Causal emission model · Live data'}
          </span>
        </div>
        <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'Arial' }}>{user.role}</span>
      </div>

      {/* Setup banner */}
      {setupNeeded && (
        <div style={{ margin:'0 1.5rem', padding:'0.75rem 1rem', background:'#fff8e8', border:'1px solid #ffd966', borderLeft:'4px solid #d4680a', borderRadius:'4px', fontSize:'0.78rem', fontFamily:'Arial', color:'#856404', lineHeight:1.7 }}>
          <strong>⚙ API Key Required</strong> — The AI Copilot needs an Anthropic API key.
          Create <code style={{ background:'#fff3cd', padding:'1px 5px', borderRadius:'3px' }}>.env.local</code> in your project root and add:&nbsp;
          <code style={{ background:'#fff3cd', padding:'1px 5px', borderRadius:'3px' }}>ANTHROPIC_API_KEY=sk-ant-...</code>
          &nbsp;then restart the dev server. See the chat for full instructions.
        </div>
      )}

      <div style={{ display:'flex', gap:'1.25rem', padding:'1.25rem 1.5rem', height:'calc(100vh - 210px)', minHeight:'450px' }}>

        {/* Suggestions */}
        <div style={{ width:'225px', flexShrink:0, display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          <div className="section-card" style={{ padding:'0.85rem', flex:1, overflow:'auto' }}>
            <div style={{ fontSize:'0.62rem', fontWeight:'700', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:'Arial', marginBottom:'0.65rem' }}>💡 Try These</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => send(s.prompt)} disabled={loading}
                  style={{ background:'var(--light-gray)', border:'1px solid var(--border)', borderRadius:'5px', padding:'0.5rem 0.6rem', fontSize:'0.68rem', color:'var(--text-dark)', cursor:loading?'not-allowed':'pointer', textAlign:'left', lineHeight:1.5, fontFamily:'Arial', opacity:loading?0.55:1 }}
                  onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background='#e8eef8'; }}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background='var(--light-gray)'}>
                  <div style={{ fontSize:'0.6rem', fontWeight:'700', color:'var(--accent-blue)', marginBottom:'0.1rem' }}>{s.label}</div>
                  {s.prompt.length > 65 ? s.prompt.slice(0,65)+'…' : s.prompt}
                </button>
              ))}
            </div>
          </div>
          <div className="section-card" style={{ padding:'0.85rem' }}>
            <div style={{ fontSize:'0.62rem', fontWeight:'700', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:'Arial', marginBottom:'0.4rem' }}>ℹ Model</div>
            <div style={{ fontSize:'0.63rem', color:'var(--text-muted)', fontFamily:'Arial', lineHeight:1.7 }}>
              Causal emission-to-AQI model with live station and industry data. Confidence: ±15%.
            </div>
          </div>
        </div>

        {/* Chat */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', background:'white', border:'1px solid var(--border)', borderRadius:'8px', overflow:'hidden', boxShadow:'0 2px 8px rgba(26,39,68,0.08)' }}>
          <div style={{ padding:'0.75rem 1.1rem', borderBottom:'1px solid var(--border)', background:'linear-gradient(135deg,#1a2744,#1a4e8a)', display:'flex', alignItems:'center', gap:'0.75rem' }}>
            <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', border:'2px solid rgba(255,255,255,0.3)' }}>🤖</div>
            <div>
              <div style={{ fontSize:'0.85rem', fontWeight:'700', color:'white', fontFamily:'Georgia' }}>AI Compliance Copilot</div>
              <div style={{ fontSize:'0.62rem', color:'rgba(255,255,255,0.7)', fontFamily:'Arial', display:'flex', alignItems:'center', gap:'0.3rem' }}>
                <div style={{ width:'5px', height:'5px', borderRadius:'50%', background: setupNeeded ? '#fbbf24' : '#22c55e' }} />
                {setupNeeded ? 'Setup required' : `Live data · ${user.role}`}
              </div>
            </div>
            <button onClick={() => { setMsgs([msgs[0]]); setSetupNeeded(false); }}
              style={{ marginLeft:'auto', background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.3)', borderRadius:'4px', color:'white', fontSize:'0.65rem', padding:'0.25rem 0.6rem', cursor:'pointer', fontFamily:'Arial' }}>
              Clear
            </button>
          </div>

          <div style={{ flex:1, overflowY:'auto', padding:'1.1rem', background:'#f8f9fb' }}>
            {msgs.map((m, i) => <Bubble key={i} msg={m} />)}
            {loading && (
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem' }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'linear-gradient(135deg,#1a2744,#1a5280)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>🤖</div>
                <div style={{ background:'white', border:'1px solid var(--border)', borderRadius:'16px 16px 16px 4px', padding:'0.7rem 1rem', display:'flex', gap:'4px' }}>
                  {[0,1,2].map(i => <div key={i} style={{ width:'7px', height:'7px', borderRadius:'50%', background:'var(--text-muted)', animation:`bounce 1.2s ${i*0.2}s infinite` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding:'0.85rem 1rem', borderTop:'1px solid var(--border)', background:'white', display:'flex', gap:'0.6rem', alignItems:'flex-end' }}>
            <textarea value={input} onChange={e => setInput(e.target.value)} rows={2}
              placeholder='Ask a what-if question… e.g. "If the top 2 industries shut down, what is the AQI impact on Nagpur?"'
              onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
              disabled={loading}
              style={{ flex:1, border:'1.5px solid var(--border)', borderRadius:'6px', padding:'0.5rem 0.75rem', fontSize:'0.82rem', color:'var(--text-dark)', background:loading?'var(--light-gray)':'var(--off-white)', resize:'none', fontFamily:'Arial', lineHeight:1.5, outline:'none' }} />
            <button onClick={() => send(input)} disabled={!input.trim()||loading} className="btn-primary"
              style={{ padding:'0.55rem 1.1rem', fontSize:'0.82rem', flexShrink:0, opacity:(!input.trim()||loading)?0.45:1, cursor:(!input.trim()||loading)?'default':'pointer' }}>
              {loading ? '⏳' : 'Send →'}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}`}</style>
    </PageShell>
  );
}
