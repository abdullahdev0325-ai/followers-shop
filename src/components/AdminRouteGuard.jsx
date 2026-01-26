/**
 * Admin Route Guard Component
 * Wraps admin routes and logs access attempts
 */

'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/authContext';
import { logAdminAccess } from '@/lib/routeLogger';

export default function AdminRouteGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('🛡️  [ADMIN GUARD] Component Mounted');
    console.log(`📍 Current Path: ${pathname}`);
    console.log(`🔐 Authenticated: ${isAuthenticated}`);
    console.log(`👤 User: ${user?.email || 'No user'}`);
    console.log(`🎯 Role: ${user?.role?.toUpperCase() || 'NO ROLE'}`);

    if (isAuthenticated && user) {
      logAdminAccess(user.role);

      if (user.role !== 'admin') {
        console.log('\n═══════════════════════════════════════════════════════════');
        console.log('🚫 [ADMIN GUARD] ACCESS DENIED - Not an admin user!');
        console.log(`⚠️  Redirecting non-admin user to home...`);
        console.log('═══════════════════════════════════════════════════════════\n');
        router.push('/');
      }
    }
  }, [pathname, isAuthenticated, user, router]);

  return <>{children}</>;
}
