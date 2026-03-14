'use client';
import { useState, useRef, useEffect } from 'react';
import { callAI, FALLBACK_CITIZEN, SETUP_MESSAGE } from '@/lib/useAI';

// ── Citizen AI Widget ─────────────────────────────────────────────────────────
// Floats on all three public pages (air, water, noise).
// Uses mode='citizen' so the server applies the public-safe system prompt.
// NEVER receives or displays internal compliance/enforcement data.
// ─────────────────────────────────────────────────────────────────────────────

interface Msg { role: 'user' | 'assistant'; content: string; }

const QUICK_QUESTIONS = [
  'What does AQI mean?',
  'Is it safe to exercise outside today?',
  'What is PM2.5 and why is it harmful?',
  'How do I know if river water is safe?',
  'What causes noise pollution?',
  'How to protect my family from bad air?',
];

export default function CitizenAIWidget() {
  const [open,    setOpen]    = useState(false);
  const [msgs,    setMsgs]    = useState<Msg[]>([{
    role: 'assistant',
    content: '👋 Hi! I\'m your PrithviNet Environment Assistant.\n\nAsk me anything about air quality, water safety, noise pollution, or how to protect your health.',
  }]);
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, open]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || loading) return;

    setMsgs(prev => [...prev, { role: 'user', content: q }]);
    setInput('');
    setLoading(true);

    const history = [
      ...msgs.slice(1).map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user' as const, content: q },
    ];

    const result = await callAI({
      messages: history,
      mode:     'citizen',   // server uses the public-safe system prompt
    });

    if (result.isMissingKey) {
      // Show a simplified setup message — don't expose internal details
      setMsgs(prev => [...prev, {
        role: 'assistant',
        content: ' The AI assistant is not yet configured by the administrator. Please try again later.\n\nFor urgent help: MPCB Helpline 1800-233-3535 (Toll Free)',
      }]);
    } else if (result.error) {
      setMsgs(prev => [...prev, { role: 'assistant', content: FALLBACK_CITIZEN }]);
    } else {
      setMsgs(prev => [...prev, { role: 'assistant', content: result.reply }]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Open Environment Assistant"
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
          width: '56px', height: '56px', borderRadius: '50%',
          background: open ? '#1a2744' : 'linear-gradient(135deg,#1a5280,#1a2744)',
          border: 'none', cursor: 'pointer', fontSize: '1.4rem',
          boxShadow: '0 4px 20px rgba(26,39,68,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}
      >
        {open ? '✕' : '🌿'}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '92px', right: '24px', zIndex: 9998,
          width: '360px', maxHeight: '520px',
          background: 'white', borderRadius: '16px',
          boxShadow: '0 8px 40px rgba(26,39,68,0.25)',
          border: '1px solid #dde2ec',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>

          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg,#1a2744,#1a5280)', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', border: '2px solid rgba(255,255,255,0.3)' }}>🌿</div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'white', fontFamily: 'Arial' }}>Environment Assistant</div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'Arial' }}>PrithviNet · Public health & environment info</div>
            </div>
            <button
              onClick={() => setMsgs([msgs[0]])}
              style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px', color: 'white', fontSize: '0.6rem', padding: '0.2rem 0.5rem', cursor: 'pointer', fontFamily: 'Arial', flexShrink: 0 }}
            >
              Clear
            </button>
          </div>

          {/* Quick questions — only shown before any real conversation */}
          {msgs.length <= 1 && (
            <div style={{ padding: '0.6rem 0.85rem', borderBottom: '1px solid #f0f2f5', background: '#f8f9fa', flexShrink: 0 }}>
              <div style={{ fontSize: '0.6rem', color: '#6b7a96', fontFamily: 'Arial', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Quick Questions
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                {QUICK_QUESTIONS.map(q => (
                  <button key={q} onClick={() => send(q)} disabled={loading}
                    style={{ fontSize: '0.62rem', background: 'white', border: '1px solid #dde2ec', borderRadius: '12px', padding: '0.2rem 0.6rem', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Arial', color: '#1a2744', transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#e8f0f8'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'white'}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.85rem', background: '#f8f9fb', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {msgs.map((m, i) => {
              const mine = m.role === 'user';
              return (
                <div key={i} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', gap: '0.4rem', alignItems: 'flex-end' }}>
                  {!mine && (
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg,#1a2744,#1a5280)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>
                      🌿
                    </div>
                  )}
                  <div style={{
                    maxWidth: '82%', padding: '0.55rem 0.8rem',
                    borderRadius: mine ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background: mine ? '#1a2744' : 'white',
                    color: mine ? 'white' : '#1a2744',
                    border: mine ? 'none' : '1px solid #dde2ec',
                    fontSize: '0.78rem', fontFamily: 'Arial', lineHeight: 1.6,
                    whiteSpace: 'pre-wrap', boxShadow: '0 1px 3px rgba(26,39,68,0.08)',
                  }}>
                    {m.content}
                  </div>
                  {mine && (
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e8f0f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0, border: '1px solid #dde2ec' }}>
                      👤
                    </div>
                  )}
                </div>
              );
            })}
            {loading && (
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-end' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg,#1a2744,#1a5280)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', flexShrink: 0 }}>🌿</div>
                <div style={{ background: 'white', border: '1px solid #dde2ec', borderRadius: '14px 14px 14px 4px', padding: '0.55rem 0.8rem', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94a3b8', animation: `cwbounce 1.2s ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '0.65rem 0.75rem', borderTop: '1px solid #f0f2f5', background: 'white', display: 'flex', gap: '0.4rem', alignItems: 'flex-end', flexShrink: 0 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); send(input); } }}
              placeholder="Type your question…"
              disabled={loading}
              style={{ flex: 1, border: '1.5px solid #dde2ec', borderRadius: '20px', padding: '0.45rem 0.85rem', fontSize: '0.78rem', fontFamily: 'Arial', outline: 'none', background: loading ? '#f8f9fa' : 'white', color: '#1a2744' }}
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              style={{ width: '34px', height: '34px', borderRadius: '50%', background: input.trim() && !loading ? '#1a2744' : '#dde2ec', border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' }}
            >
              {loading ? '⏳' : '➤'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes cwbounce {
          0%, 60%, 100% { transform: translateY(0); }
          30%            { transform: translateY(-5px); }
        }
      `}</style>
    </>
  );
}
