'use client';
import PageShell from '@/components/PageShell';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CALENDAR_EVENTS, CalendarEvent } from '@/data/newModulesData';
import toast, { Toaster } from 'react-hot-toast';

const TYPE_META = {
  report_due:  { icon: '📋', color: '#1a4e8a', bg: '#e8f0f8', label: 'Report Due'  },
  inspection:  { icon: '🔍', color: '#d4680a', bg: '#fef6ee', label: 'Inspection'  },
  festival:    { icon: '🎉', color: '#856404', bg: '#fff3cd', label: 'Festival'     },
  deadline:    { icon: '⏰', color: '#c0392b', bg: '#fdf0ee', label: 'Deadline'     },
  hearing:     { icon: '⚖️', color: '#5a3500', bg: '#fff8ee', label: 'Hearing'      },
};

function pad(n: number) { return String(n).padStart(2, '0'); }

export default function CalendarPage() {
  const router = useRouter();
  const { user, mounted } = useAuth({ allowedRoles: ['Super Admin', 'Regional Officer'] });
  const [events, setEvents] = useState<CalendarEvent[]>(CALENDAR_EVENTS);
  const [filter, setFilter] = useState<string>('all');
  const [view,   setView  ] = useState<'list' | 'calendar'>('calendar');

  // Calendar state — March 2026
  const [year,  setYear ] = useState(2026);
  const [month, setMonth] = useState(2); // 0-indexed: 2 = March

  if (!mounted || !user) return <PageShell loading />;

  const isRO = user.role === 'Regional Officer';
  const shown = isRO
    ? events.filter(e => !e.assignedRO || e.assignedRO === 'Rajesh Kumar')
    : events;
  const filtered = filter === 'all' ? shown : shown.filter(e => e.type === filter);

  const markDone = (id: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, completed: true } : e));
    toast.success('Event marked complete');
  };

  // Build calendar grid
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells       = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1);
  const monthName   = new Date(year, month, 1).toLocaleString('en-IN', { month: 'long' });

  const eventsOnDay = (day: number) => {
    const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
    return shown.filter(e => e.date === dateStr);
  };

  const today = `${new Date().getFullYear()}-${pad(new Date().getMonth()+1)}-${pad(new Date().getDate())}`;

  return (
    <PageShell>
      <Toaster position="top-right" />
      <div className="breadcrumb">
        <span>🏠 Home</span><span>›</span>
        <a onClick={() => router.push('/dashboard')} style={{ cursor: 'pointer' }}>Dashboard</a>
        <span>›</span>
        <span style={{ color: 'var(--navy)', fontWeight: '700' }}>📅 Compliance Calendar</span>
      </div>
      <div className="live-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="live-dot" />
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#22c55e', fontFamily: 'Arial' }}>LIVE</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Arial', marginLeft: '0.35rem' }}>
            {shown.filter(e => !e.completed).length} upcoming events · {shown.filter(e => e.priority === 'high' && !e.completed).length} high priority
          </span>
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Arial' }}>{isRO ? 'Nagpur Zone' : 'All Zones'}</span>
      </div>

      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {['all', ...Object.keys(TYPE_META)].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ fontSize: '0.72rem', fontFamily: 'Arial', fontWeight: filter === f ? '700' : '500', padding: '0.25rem 0.75rem', borderRadius: '15px', border: '1.5px solid', borderColor: filter === f ? 'var(--navy)' : 'var(--border)', background: filter === f ? 'var(--navy)' : 'white', color: filter === f ? 'white' : 'var(--text-mid)', cursor: 'pointer' }}>
                {f === 'all' ? 'All' : (TYPE_META as any)[f].icon + ' ' + (TYPE_META as any)[f].label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {[['calendar', '📅 Calendar'], ['list', '☰ List']].map(([v, l]) => (
              <button key={v} onClick={() => setView(v as any)}
                style={{ fontSize: '0.72rem', fontFamily: 'Arial', fontWeight: view === v ? '700' : '500', padding: '0.25rem 0.75rem', borderRadius: '3px', border: '1.5px solid', borderColor: view === v ? 'var(--navy)' : 'var(--border)', background: view === v ? 'var(--navy)' : 'white', color: view === v ? 'white' : 'var(--text-mid)', cursor: 'pointer' }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {view === 'calendar' ? (
          <div className="section-card">
            {/* Month nav */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <button onClick={() => { const d = new Date(year, month-1); setYear(d.getFullYear()); setMonth(d.getMonth()); }} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '3px', padding: '0.25rem 0.65rem', cursor: 'pointer', fontSize: '0.8rem' }}>‹</button>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--navy)', fontFamily: 'Georgia' }}>{monthName} {year}</div>
              <button onClick={() => { const d = new Date(year, month+1); setYear(d.getFullYear()); setMonth(d.getMonth()); }} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '3px', padding: '0.25rem 0.65rem', cursor: 'pointer', fontSize: '0.8rem' }}>›</button>
            </div>
            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px', marginBottom: '2px' }}>
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)', fontFamily: 'Arial', padding: '0.25rem 0' }}>{d}</div>
              ))}
            </div>
            {/* Cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px' }}>
              {cells.map((day, i) => {
                if (!day) return <div key={i} />;
                const dayEvents = eventsOnDay(day);
                const dateStr   = `${year}-${pad(month+1)}-${pad(day)}`;
                const isToday   = dateStr === today;
                return (
                  <div key={i} style={{ minHeight: '72px', border: `1px solid ${isToday ? 'var(--navy)' : 'var(--border)'}`, borderRadius: '4px', padding: '0.3rem', background: isToday ? '#f0f4ff' : 'white', position: 'relative' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: isToday ? '800' : '500', color: isToday ? 'var(--navy)' : 'var(--text-muted)', fontFamily: 'Arial', marginBottom: '0.25rem' }}>{day}{isToday && <span style={{ marginLeft: '3px', fontSize: '0.55rem', color: 'var(--accent-blue)', fontWeight: '700' }}>TODAY</span>}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {dayEvents.slice(0, 3).map(e => {
                        const m = (TYPE_META as any)[e.type];
                        return (
                          <div key={e.id} style={{ fontSize: '0.58rem', background: m.bg, color: m.color, borderRadius: '2px', padding: '1px 4px', fontFamily: 'Arial', fontWeight: '600', lineHeight: 1.3, opacity: e.completed ? 0.5 : 1, textDecoration: e.completed ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {m.icon} {e.title}
                          </div>
                        );
                      })}
                      {dayEvents.length > 3 && <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', fontFamily: 'Arial' }}>+{dayEvents.length-3} more</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="section-card">
            <div className="section-title">Upcoming Events</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {filtered.sort((a,b) => a.date.localeCompare(b.date)).map(e => {
                const m = (TYPE_META as any)[e.type];
                const isPast = e.date < today;
                return (
                  <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', border: `1px solid ${e.priority==='high'&&!e.completed?m.color+'40':'var(--border)'}`, borderLeft: `4px solid ${m.color}`, borderRadius: '4px', background: e.completed ? '#f8f9fa' : 'white', opacity: e.completed ? 0.65 : 1 }}>
                    <div style={{ fontSize: '1.4rem', flexShrink: 0 }}>{m.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)', fontFamily: 'Georgia', textDecoration: e.completed ? 'line-through' : 'none' }}>{e.title}</span>
                        <span style={{ background: m.bg, color: m.color, padding: '1px 7px', borderRadius: '2px', fontSize: '0.62rem', fontWeight: '700', fontFamily: 'Arial' }}>{m.label}</span>
                        {e.priority === 'high' && !e.completed && <span style={{ background: '#fdf0ee', color: '#c0392b', padding: '1px 7px', borderRadius: '2px', fontSize: '0.6rem', fontWeight: '700', fontFamily: 'Arial' }}>HIGH</span>}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'Arial' }}>
                        📅 {new Date(e.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                        {e.industry && ` · ${e.industry}`}
                        {e.district && ` · ${e.district}`}
                        {isPast && !e.completed && <span style={{ color: '#c0392b', fontWeight: '700', marginLeft: '0.4rem' }}>OVERDUE</span>}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-mid)', fontFamily: 'Arial', marginTop: '0.2rem' }}>{e.description}</div>
                    </div>
                    {!e.completed && (
                      <button onClick={() => markDone(e.id)} style={{ fontSize: '0.68rem', padding: '0.22rem 0.6rem', background: '#d4edda', color: '#1a6b3a', border: '1px solid #c8e0d2', borderRadius: '3px', cursor: 'pointer', fontFamily: 'Arial', fontWeight: '600', flexShrink: 0 }}>
                        ✓ Done
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
