'use client';
import PageShell from '@/components/PageShell';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface Message { role: 'user' | 'assistant'; content: string; ts: string; }

const SUGGESTIONS = [
  { label: 'Emission reduction impact', prompt: 'If Bharat Steel Works reduces SO₂ emissions by 30%, what is the expected change in Nagpur\'s regional AQI over the next 7 days?' },
  { label: 'Festival shutdown simulation', prompt: 'If we temporarily shut down the top 2 high-risk industries during the Gudi Padwa festival period (30 March), what is the projected AQI improvement across affected districts?' },
  { label: 'Worst polluter analysis', prompt: 'Which single industry, if brought to full compliance, would most reduce district-level air quality risk? Show the numbers.' },
  { label: 'Weekly health risk summary', prompt: 'Give me a health risk exposure summary for Nagpur residents this week based on current emission levels.' },
  { label: 'Missing reports impact', prompt: 'Which industries have missing reports and what is their combined risk contribution to regional AQI?' },
  { label: 'Pollutant X reduction', prompt: 'What happens to Pune\'s AQI if Maharashtra Textiles reduces NO₂ by 50% over 5 days?' },
];

function MsgBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: '1rem', gap: '0.5rem', alignItems: 'flex-start' }}>
      {!isUser && (
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#1a2744,#1a5280)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0, marginTop: '2px' }}>🤖</div>
      )}
      <div style={{ maxWidth: '78%' }}>
        <div style={{
          padding: '0.7rem 1rem',
          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          background: isUser ? 'var(--navy)' : 'white',
          color: isUser ? 'white' : 'var(--text-dark)',
          border: isUser ? 'none' : '1px solid var(--border)',
          fontSize: '0.82rem', fontFamily: 'Arial', lineHeight: 1.65,
          boxShadow: '0 1px 4px rgba(26,39,68,0.08)',
          whiteSpace: 'pre-wrap',
        }}>
          {msg.content}
        </div>
        <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', fontFamily: 'Arial', marginTop: '0.2rem', textAlign: isUser ? 'right' : 'left', paddingInline: '0.2rem' }}>
          {msg.ts}
        </div>
      </div>
      {isUser && (
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--light-gray)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0, marginTop: '2px' }}>👤</div>
      )}
    </div>
  );
}

export default function CopilotPage() {
  const router = useRouter();
  const { user, mounted } = useAuth({ allowedRoles: ['Super Admin', 'Regional Officer', 'Monitoring Team', 'Industry User'] });
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: '👋 Hello! I\'m the PrithviNet AI Compliance Copilot.\n\nI can help you:\n• Simulate what-if scenarios (emission reductions, shutdowns)\n• Analyse regional risk and health impact\n• Identify compliance gaps and escalation priorities\n• Project AQI changes from interventions\n\nTry one of the suggested prompts below, or type your own question.',
    ts: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  }]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  if (!mounted || !user) return <PageShell loading />;

  const ts = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const send = async (text: string) => {
    const q = text.trim(); if (!q || loading) return;
    const userMsg: Message = { role: 'user', content: q, ts: ts() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = [...messages.filter(m => m.role !== 'assistant' || messages.indexOf(m) > 0), userMsg];
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.map(m => ({ role: m.role, content: m.content })),
          userRole: user.role,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply, ts: ts() }]);
    } catch (err: any) {
      toast.error('Copilot error: ' + (err.message || 'Unknown error'));
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠ Sorry, I encountered an error. Please try again.', ts: ts() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <Toaster position="top-right" />
      <div className="breadcrumb">
        <span>🏠 Home</span><span>›</span>
        <a onClick={() => router.push('/dashboard')} style={{ cursor: 'pointer' }}>Dashboard</a>
        <span>›</span>
        <span style={{ color: 'var(--navy)', fontWeight: '700' }}>🤖 AI Compliance Copilot</span>
      </div>
      <div className="live-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="live-dot" />
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#22c55e', fontFamily: 'Arial' }}>LIVE</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Arial', marginLeft: '0.35rem' }}>
            PrithviNet AI · Powered by Claude · Causal emission model active
          </span>
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Arial' }}>{user.role}</span>
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', padding: '1.25rem 1.5rem', height: 'calc(100vh - 200px)', minHeight: '500px' }}>

        {/* LEFT: Suggestions panel */}
        <div style={{ width: '240px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="section-card" style={{ padding: '0.85rem', flex: 1 }}>
            <div style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Arial', marginBottom: '0.65rem' }}>💡 Suggested Queries</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => send(s.prompt)} disabled={loading}
                  style={{ background: 'var(--light-gray)', border: '1px solid var(--border)', borderRadius: '5px', padding: '0.5rem 0.6rem', fontSize: '0.7rem', color: 'var(--text-dark)', cursor: loading ? 'not-allowed' : 'pointer', textAlign: 'left', lineHeight: 1.5, fontFamily: 'Arial', opacity: loading ? 0.6 : 1 }}
                  onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#e8eef8'; }}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--light-gray)'}>
                  <div style={{ fontSize: '0.62rem', fontWeight: '700', color: 'var(--accent-blue)', marginBottom: '0.15rem' }}>{s.label}</div>
                  {s.prompt.length > 60 ? s.prompt.slice(0, 60) + '…' : s.prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="section-card" style={{ padding: '0.85rem' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Arial', marginBottom: '0.5rem' }}>ℹ Model Info</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'Arial', lineHeight: 1.7 }}>
              Uses causal emission-to-AQI model with live station data. Confidence: ±15%. Not a substitute for certified atmospheric modelling.
            </div>
          </div>
        </div>

        {/* RIGHT: Chat panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'white', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(26,39,68,0.08)' }}>

          {/* Header */}
          <div style={{ padding: '0.75rem 1.1rem', borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg,#1a2744 0%,#1a4e8a 100%)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', border: '2px solid rgba(255,255,255,0.3)' }}>🤖</div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'white', fontFamily: 'Georgia' }}>AI Compliance Copilot</div>
              <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'Arial', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e' }} />
                Live emission data · Causal model active · {user.role} session
              </div>
            </div>
            <button onClick={() => setMessages([messages[0]])} style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px', color: 'white', fontSize: '0.65rem', padding: '0.25rem 0.6rem', cursor: 'pointer', fontFamily: 'Arial' }}>
              Clear Chat
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.1rem', background: '#f8f9fb' }}>
            {messages.map((msg, i) => <MsgBubble key={i} msg={msg} />)}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#1a2744,#1a5280)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>🤖</div>
                <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px 16px 16px 4px', padding: '0.7rem 1rem', display: 'flex', gap: '4px' }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--text-muted)', animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '0.85rem 1rem', borderTop: '1px solid var(--border)', background: 'white', display: 'flex', gap: '0.6rem', alignItems: 'flex-end' }}>
            <textarea value={input} onChange={e => setInput(e.target.value)} rows={2}
              placeholder='Ask a what-if question… e.g. "If top 2 industries shut down, what is the AQI impact on Nagpur?"'
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
              disabled={loading}
              style={{ flex: 1, border: '1.5px solid var(--border)', borderRadius: '6px', padding: '0.5rem 0.75rem', fontSize: '0.82rem', color: 'var(--text-dark)', background: loading ? 'var(--light-gray)' : 'var(--off-white)', resize: 'none', fontFamily: 'Arial', lineHeight: 1.5, outline: 'none' }} />
            <button onClick={() => send(input)} disabled={!input.trim() || loading}
              className="btn-primary"
              style={{ padding: '0.55rem 1.1rem', fontSize: '0.82rem', flexShrink: 0, opacity: (!input.trim() || loading) ? 0.45 : 1, cursor: (!input.trim() || loading) ? 'default' : 'pointer' }}>
              {loading ? '⏳' : 'Ask →'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
      `}</style>
    </PageShell>
  );
}
