'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';

/**
 * useAuth — handles localStorage hydration safely.
 * Returns { user, mounted } where mounted=false means we're still
 * in SSR/hydration and should show a skeleton, not redirect.
 *
 * allowedRoles: if provided, any other role is redirected to their home.
 * redirectTo:   where to send unauthenticated users (default: '/')
 */
export function useAuth(opts?: {
  allowedRoles?: string[];
  redirectUnauthTo?: string;
}) {
  const router = useRouter();
  const [user, setUser]       = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const u = getUser();
    if (!u) {
      router.replace(opts?.redirectUnauthTo ?? '/');
      return;
    }
    if (opts?.allowedRoles && !opts.allowedRoles.includes(u.role)) {
      // Send each role to their home
      if (u.role === 'Industry User') router.replace('/industry-dashboard');
      else if (u.role === 'Citizen')   router.replace('/public');
      else                              router.replace('/dashboard');
      return;
    }
    setUser(u);
  }, []);

  return { user, mounted };
}
