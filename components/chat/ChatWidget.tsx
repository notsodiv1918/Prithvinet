'use client';
import { useState } from 'react';
import { CHAT_MESSAGES, ChatMessage } from '@/data/mockData';

interface Props {
  currentUser: string;
  currentRole: string;
  otherUser: string;
  otherRole: string;
}

export default function ChatWidget({ currentUser, currentRole, otherUser, otherRole }: Props) {
  const safeInit: ChatMessage[] = Array.isArray(CHAT_MESSAGES) ? [...CHAT_MESSAGES] : [];
  const [messages, setMessages] = useState<ChatMessage[]>(safeInit);
  const [input, setInput] = useState('');

  const thread = messages.filter(m =>
    (m.from === currentUser && m.to === otherUser) ||
    (m.from === otherUser && m.to === currentUser)
  );

  const send = () => {
    if (!input.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now(),
      from: currentUser, fromRole: currentRole,
      to: otherUser, toRole: otherRole,
      message: input.trim(),
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
      read: false,
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '480px', background: 'white', border: '1px solid #c8e0d2', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(26,107,58,0.1)' }}>
      <div style={{ background: '#1a6b3a', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#2d8653', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: '700', color: 'white', flexShrink: 0 }}>
          {otherUser.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
        </div>
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'white' }}>{otherUser}</div>
          <div style={{ fontSize: '0.65rem', color: '#a8d5bc' }}>{otherRole} · PrithviNet Portal</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80' }} />
          <span style={{ fontSize: '0.65rem', color: '#a8d5bc' }}>Online</span>
        </div>
      </div>

      <div style={{ background: '#f0f8f3', borderBottom: '1px solid #c8e0d2', padding: '0.4rem 1rem', fontSize: '0.65rem', color: '#6b8c7a', textAlign: 'center' }}>
        Official internal communication channel — messages are logged and auditable
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#fafcfb' }}>
        {thread.length === 0 && (
          <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', marginTop: '2rem' }}>No messages yet.</div>
        )}
        {thread.map(msg => {
          const isMine = msg.from === currentUser;
          return (
            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '78%' }}>
                {!isMine && <div style={{ fontSize: '0.65rem', color: '#6b8c7a', marginBottom: '0.2rem', paddingLeft: '0.25rem' }}>{msg.from}</div>}
                <div style={{ background: isMine ? '#1a6b3a' : 'white', color: isMine ? 'white' : '#1a2e22', border: isMine ? 'none' : '1px solid #c8e0d2', borderRadius: isMine ? '12px 12px 2px 12px' : '12px 12px 12px 2px', padding: '0.6rem 0.85rem', fontSize: '0.82rem', lineHeight: 1.55 }}>
                  {msg.message}
                </div>
                <div style={{ fontSize: '0.6rem', color: '#94a3b8', marginTop: '0.2rem', paddingLeft: '0.25rem' }}>
                  {msg.timestamp}
                  {isMine && <span style={{ marginLeft: '0.4rem', color: msg.read ? '#1a6b3a' : '#94a3b8' }}>{msg.read ? '✓✓' : '✓'}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid #c8e0d2', background: 'white', display: 'flex', gap: '0.6rem', alignItems: 'flex-end' }}>
        <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
          placeholder="Type a message… (Enter to send)" rows={2}
          style={{ flex: 1, border: '1px solid #a0c8b4', borderRadius: '4px', padding: '0.5rem 0.75rem', fontSize: '0.82rem', color: '#1a2e22', background: 'white', resize: 'none', fontFamily: 'inherit', lineHeight: 1.5 }} />
        <button onClick={send} disabled={!input.trim()}
          style={{ padding: '0.5rem 1.1rem', background: input.trim() ? '#1a6b3a' : '#c8e0d2', color: input.trim() ? 'white' : '#6b8c7a', border: 'none', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '700', cursor: input.trim() ? 'pointer' : 'default', whiteSpace: 'nowrap' }}>
          Send
        </button>
      </div>
    </div>
  );
}
