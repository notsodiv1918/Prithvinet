'use client';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import ROSidebar from '@/components/ROSidebar';
import TopBar from '@/components/TopBar';
import ChatWidget from '@/components/chat/ChatWidget';
import { getUser } from '@/lib/auth';

export default function ChatPage() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => { setUser(getUser()); }, []);

  if (!user) return null;

  const isAdmin = user.role === 'Super Admin';
  const Sidebar = isAdmin ? AdminSidebar : ROSidebar;

  const chatProps = isAdmin
    ? { currentUser: 'Arjun Mehta', currentRole: 'Super Admin', otherUser: 'Rajesh Kumar', otherRole: 'Regional Officer' }
    : { currentUser: 'Rajesh Kumar', currentRole: 'Regional Officer', otherUser: 'Arjun Mehta', otherRole: 'Super Admin' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f8f3' }}>
      <Sidebar />
      <main style={{ flex: 1, overflow: 'auto' }}>
        <TopBar title="Internal Messages" subtitle={isAdmin ? 'Communicating with Regional Officers' : 'Communicating with Super Admin'} />
        <div style={{ background: 'white', borderBottom: '1px solid #e8f5ee', padding: '0.5rem 1.5rem' }}>
          <span style={{ fontSize: '0.7rem', color: '#6b8c7a' }}>Home › </span>
          <span style={{ fontSize: '0.7rem', color: '#1a6b3a', fontWeight: '600' }}>Messages</span>
        </div>

        <div style={{ padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.25rem' }}>

            {/* Left panel — conversation list */}
            <div>
              <div style={{ background: 'white', border: '1px solid #c8e0d2', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ background: '#f0f8f3', padding: '0.65rem 1rem', borderBottom: '1px solid #c8e0d2' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#1a6b3a', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Conversations</div>
                </div>
                {/* Single thread shown for demo */}
                <div style={{ padding: '0.75rem 1rem', background: '#e8f5ee', borderLeft: '3px solid #1a6b3a', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: isAdmin ? '#2d6a9f' : '#1a6b3a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '700', color: 'white', flexShrink: 0 }}>
                      {chatProps.otherUser.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1a2e22' }}>{chatProps.otherUser}</div>
                      <div style={{ fontSize: '0.65rem', color: '#6b8c7a' }}>{chatProps.otherRole}</div>
                    </div>
                    {!isAdmin && (
                      <span style={{ background: '#c0392b', color: 'white', borderRadius: '10px', padding: '1px 6px', fontSize: '0.6rem', fontWeight: '700' }}>1</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Info box */}
              <div style={{ marginTop: '1rem', background: '#f0f8f3', border: '1px solid #c8e0d2', borderRadius: '4px', padding: '0.75rem', fontSize: '0.7rem', color: '#6b8c7a', lineHeight: 1.7 }}>
                <div style={{ fontWeight: '700', color: '#1a6b3a', marginBottom: '0.3rem' }}>About this channel</div>
                This is an official internal communication channel between Super Admin and Regional Officers. All messages are logged and subject to audit under RTI Act. Do not share sensitive data externally.
              </div>
            </div>

            {/* Chat widget */}
            <div style={{ height: '580px' }}>
              <ChatWidget {...chatProps} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
