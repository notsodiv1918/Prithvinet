'use client';
import { useRouter, usePathname } from 'next/navigation';
import { getUser, logout } from '@/lib/auth';
import { useEffect, useState } from 'react';

type Portal = 'air' | 'water' | 'noise' | null;

const PORTAL_NAV: Record<string, Record<string, { href:string; label:string; icon:string; badge?:number }[]>> = {
  'Super Admin': {
    air: [
      { href:'/dashboard', label:'Dashboard', icon:'⊞' },
      { href:'/map', label:'Pollution Map', icon:'◎' },
      { href:'/alerts', label:'Alerts', icon:'⚐', badge:3 },
      { href:'/reports', label:'Reports', icon:'☰' },
      { href:'/forecast', label:'Forecast', icon:'◈' },
      { href:'/chat', label:'Messages', icon:'✉', badge:2 },
    ],
    water: [
      { href:'/dashboard', label:'Dashboard', icon:'⊞' },
      { href:'/chat', label:'Messages', icon:'✉', badge:2 },
    ],
    noise: [
      { href:'/dashboard', label:'Dashboard', icon:'⊞' },
      { href:'/chat', label:'Messages', icon:'✉', badge:2 },
    ],
  },
  'Regional Officer': {
    air: [
      { href:'/dashboard', label:'Dashboard', icon:'⊞' },
      { href:'/map', label:'Pollution Map', icon:'◎' },
      { href:'/alerts', label:'Alerts', icon:'⚐', badge:3 },
      { href:'/chat', label:'Messages', icon:'✉', badge:1 },
    ],
    water: [
      { href:'/dashboard', label:'Dashboard', icon:'⊞' },
      { href:'/chat', label:'Messages', icon:'✉', badge:1 },
    ],
    noise: [
      { href:'/dashboard', label:'Dashboard', icon:'⊞' },
      { href:'/chat', label:'Messages', icon:'✉', badge:1 },
    ],
  },
  'Industry User': {
    air: [
      { href:'/industry-dashboard', label:'My Dashboard', icon:'⊞' },
      { href:'/submit', label:'Submit Report', icon:'✎' },
      { href:'/industry-reports', label:'Past Reports', icon:'☰' },
      { href:'/industry-forecast', label:'AQI Forecast', icon:'◈' },
      { href:'/industry-alerts', label:'My Alerts', icon:'⚐', badge:2 },
    ],
    water: [
      { href:'/industry-dashboard', label:'My Dashboard', icon:'⊞' },
      { href:'/submit', label:'Submit Report', icon:'✎' },
      { href:'/industry-reports', label:'Past Reports', icon:'☰' },
    ],
    noise: [
      { href:'/industry-dashboard', label:'My Dashboard', icon:'⊞' },
      { href:'/submit', label:'Submit Report', icon:'✎' },
      { href:'/industry-reports', label:'Past Reports', icon:'☰' },
    ],
  },
  'Monitoring Team': {
    air: [
      { href:'/dashboard', label:'Dashboard', icon:'⊞' },
      { href:'/map', label:'Pollution Map', icon:'◎' },
      { href:'/alerts', label:'Alerts', icon:'⚐' },
      { href:'/forecast', label:'Forecast', icon:'◈' },
    ],
    water: [{ href:'/dashboard', label:'Dashboard', icon:'⊞' }],
    noise: [{ href:'/dashboard', label:'Dashboard', icon:'⊞' }],
  },
};

const BASE_NAV: Record<string, { href:string; label:string; icon:string }> = {
  'Super Admin':      { href:'/dashboard',          label:'Dashboard', icon:'⊞' },
  'Regional Officer': { href:'/dashboard',          label:'Dashboard', icon:'⊞' },
  'Industry User':    { href:'/industry-dashboard', label:'Dashboard', icon:'⊞' },
  'Monitoring Team':  { href:'/dashboard',          label:'Dashboard', icon:'⊞' },
};

const PC: Record<string,{accent:string;bg:string;border:string;icon:string;label:string}> = {
  air:   { accent:'#1a6b3a', bg:'#f0f8f3', border:'#c8e0d2', icon:'💨', label:'Air Quality' },
  water: { accent:'#1a5280', bg:'#f0f5ff', border:'#c8d8f0', icon:'💧', label:'Water Quality' },
  noise: { accent:'#5a3500', bg:'#fff8ee', border:'#f0d8a0', icon:'🔊', label:'Noise Levels' },
};

const key = (email:string) => `pvportal_${email}`;

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [portal, setPortal] = useState<Portal>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push('/'); return; }
    setUser(u);
    const saved = localStorage.getItem(key(u.email)) as Portal | null;
    if (saved) setPortal(saved);
  }, []);

  useEffect(() => {
    const h = (e: Event) => setPortal((e as CustomEvent).detail as Portal);
    window.addEventListener('pvPortalChange', h);
    return () => window.removeEventListener('pvPortalChange', h);
  }, []);

  const handleSwitch = () => {
    setPortal(null);
    if (user) localStorage.removeItem(key(user.email));
    window.dispatchEvent(new CustomEvent('pvPortalChange', { detail: null }));
    const home = user?.role === 'Industry User' ? '/industry-dashboard' : '/dashboard';
    if (pathname !== home) router.push(home);
  };

  const roleNavs = user ? (PORTAL_NAV[user.role] || PORTAL_NAV['Monitoring Team']) : {};
  const navItems = portal
    ? (roleNavs[portal] || [])
    : (user ? [BASE_NAV[user.role] || BASE_NAV['Monitoring Team']] : []);

  const pc = portal ? PC[portal] : { accent:'#1a6b3a', bg:'#f0f8f3', border:'#c8e0d2', icon:'', label:'' };

  return (
    <aside style={{ width:'220px', minWidth:'220px', background:'white', borderRight:'2px solid #c8e0d2', display:'flex', flexDirection:'column', height:'100vh', position:'sticky', top:0, boxShadow:'2px 0 8px rgba(26,107,58,0.07)' }}>
      <div style={{ padding:'1rem', borderBottom:'2px solid #e8f5ee', background:'#1a6b3a' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.2rem' }}>
          <span style={{ fontSize:'1.5rem' }}>🌿</span>
          <span style={{ fontSize:'1.05rem', fontWeight:'800', color:'white' }}>PrithviNet</span>
        </div>
        <div style={{ fontSize:'0.6rem', color:'#a8d5bc', lineHeight:1.4, paddingLeft:'2.1rem' }}>Maharashtra SPCB<br/>Environmental Portal</div>
      </div>

      {portal && (
        <div style={{ background:pc.bg, borderBottom:`1px solid ${pc.border}`, padding:'0.4rem 1rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontSize:'0.7rem', fontWeight:'700', color:pc.accent }}>{pc.icon} {pc.label}</span>
          <button onClick={handleSwitch} title="Change domain" style={{ background:'none', border:`1px solid ${pc.border}`, borderRadius:'3px', padding:'0.1rem 0.4rem', fontSize:'0.6rem', color:pc.accent, cursor:'pointer', fontWeight:'700' }}>↩</button>
        </div>
      )}

      <nav style={{ flex:1, padding:'0.5rem 0', overflowY:'auto' }}>
        {navItems.map((item,i) => {
          const active = pathname === item.href;
          return (
            <button key={i} onClick={() => router.push(item.href)}
              style={{ width:'100%', display:'flex', alignItems:'center', gap:'0.65rem', padding:'0.6rem 1rem', background:active?pc.bg:'transparent', borderLeft:active?`3px solid ${pc.accent}`:'3px solid transparent', color:active?pc.accent:'#3d5a48', fontSize:'0.82rem', fontWeight:active?'700':'400', cursor:'pointer', border:'none', textAlign:'left', transition:'all 0.12s' }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = pc.bg; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
              <span style={{ fontSize:'0.95rem', opacity:0.75 }}>{item.icon}</span>
              <span style={{ flex:1 }}>{item.label}</span>
              {(item as any).badge && <span style={{ background:'#c0392b', color:'white', borderRadius:'10px', padding:'1px 7px', fontSize:'0.65rem', fontWeight:'700' }}>{(item as any).badge}</span>}
            </button>
          );
        })}
      </nav>

      {user && (
        <div style={{ padding:'0.75rem 1rem', borderTop:'2px solid #e8f5ee', background:'#f7fcf9' }}>
          <div style={{ fontSize:'0.62rem', marginBottom:'0.1rem', textTransform:'uppercase', letterSpacing:'0.05em', fontWeight:'700', color:pc.accent }}>{user.role}</div>
          <div style={{ fontSize:'0.82rem', fontWeight:'700', color:'#1a2e22', marginBottom:'0.6rem' }}>{user.name}</div>
          <button onClick={() => { logout(); router.push('/'); }} className="btn-outline" style={{ width:'100%', fontSize:'0.72rem', padding:'0.3rem' }}>Logout</button>
        </div>
      )}
    </aside>
  );
}
