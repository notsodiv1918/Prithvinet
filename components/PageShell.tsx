'use client';
import GovHeader from '@/components/GovHeader';
import LeftSidebar from '@/components/LeftSidebar';

interface Props {
  children: React.ReactNode;
  /** If true, renders a content skeleton while user is loading */
  loading?: boolean;
}

/**
 * PageShell wraps every authenticated page.
 * GovHeader + LeftSidebar render on the FIRST paint —
 * they don't depend on auth state — so the gov UI is always visible
 * immediately, preventing the blank/old-UI flash.
 */
export default function PageShell({ children, loading = false }: Props) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--light-gray)' }}>
      {/* Always rendered — no auth dependency */}
      <GovHeader />
      <div className="portal-layout">
        <LeftSidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          {loading ? (
            // Skeleton shown during SSR hydration — same layout, no flash
            <div style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '0.45rem 1.5rem', marginBottom: '0.5rem', borderRadius: '4px', height: '28px', animation: 'skeleton-pulse 1.5s ease-in-out infinite', opacity: 0.6 }} />
              <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '0.4rem 1.5rem', marginBottom: '1rem', borderRadius: '4px', height: '36px', animation: 'skeleton-pulse 1.5s ease-in-out infinite', opacity: 0.5 }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ background: 'white', borderRadius: '4px', height: '90px', animation: 'skeleton-pulse 1.5s ease-in-out infinite', opacity: 0.4 + i * 0.05 }} />
                ))}
              </div>
              <div style={{ background: 'white', borderRadius: '4px', height: '240px', animation: 'skeleton-pulse 1.5s ease-in-out infinite', opacity: 0.4 }} />
            </div>
          ) : children}
        </div>
      </div>
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.75; }
        }
      `}</style>
    </div>
  );
}
