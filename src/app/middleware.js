import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

/**
 * PROTECTED ROUTES CONFIGURATION
 * 
 * ADMIN ROUTES (Admin role only):
 * - /admin/*
 * - /admin/blogs/*
 * - /admin/categories/*
 * - /admin/occasions/*
 * - /admin/orders/*
 * - /admin/product/*
 * 
 * USER ROUTES (Authenticated user role only):
 * - /order/*
 * - /order/
 * - /checkout/*
 * - /checkout/
 * 
 * PUBLIC ROUTES (No authentication required):
 * - /
 * - /product/*
 * - /blog/*
 * - /occasions/*
 * - /auth/login
 * - /auth/register
 * - /auth/otp
 */

const adminPaths = ['/admin', '/admin/'];
const userPaths = ['/order', '/order/', '/checkout', '/checkout/'];

const DEBUG = process.env.NODE_ENV !== 'production';

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Log which route is being accessed
  if (DEBUG) {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(`📍 [MIDDLEWARE] Processing request to: ${pathname}`);
    console.log('═══════════════════════════════════════════════════════════');
  }

  // Check if route is protected
  const isAdminRoute = adminPaths.some((path) => pathname.startsWith(path));
  const isUserRoute = userPaths.some((path) => pathname.startsWith(path));
  const isProtectedRoute = isAdminRoute || isUserRoute;

  if (DEBUG) {
    console.log(`📌 Route Type: ${isAdminRoute ? '🔴 ADMIN' : isUserRoute ? '🟡 USER' : '🟢 PUBLIC'}`);
  }

  // Try to get token from cookie or localStorage
  const token = req.cookies.get('token')?.value;

  if (!token) {
    if (DEBUG) {
      console.log('🔑 Token Status: ❌ NOT FOUND');
    }

    // If protected route and no token, redirect to login
    if (isProtectedRoute) {
      if (DEBUG) {
        console.log(`🚫 [REDIRECT] Redirecting to /login (protected route requires authentication)`);
        console.log('═══════════════════════════════════════════════════════════\n');
      }
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Public route, allow access
    if (DEBUG) {
      console.log(`✅ [ALLOW] Public route - access granted`);
      console.log('═══════════════════════════════════════════════════════════\n');
    }
    return NextResponse.next();
  }

  if (DEBUG) {
    console.log('🔑 Token Status: ✅ FOUND');
  }

  // Verify token
  const decoded = verifyToken(token);

  if (!decoded) {
    if (DEBUG) {
      console.log('⚠️  Token Validation: ❌ INVALID or EXPIRED');
      console.log(`🚫 [REDIRECT] Redirecting to /login (token verification failed)`);
      console.log('═══════════════════════════════════════════════════════════\n');
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (DEBUG) {
    console.log(`✅ Token Validation: SUCCESS`);
    console.log(`👤 User Role: ${decoded.role?.toUpperCase()}`);
  }

  // Check admin routes
  if (isAdminRoute) {
    if (decoded.role !== 'admin') {
      if (DEBUG) {
        console.log(`🚫 [DENY] Access Denied - Admin route requires admin role (user has: ${decoded.role})`);
        console.log(`🚫 [REDIRECT] Redirecting to home page`);
        console.log('═══════════════════════════════════════════════════════════\n');
      }
      return NextResponse.redirect(new URL('/', req.url));
    }
    if (DEBUG) {
      console.log(`✅ [ALLOW] Access Granted - User is ADMIN`);
      console.log('═══════════════════════════════════════════════════════════\n');
    }
    return NextResponse.next();
  }

  // Check user routes
  if (isUserRoute) {
    if (decoded.role !== 'user') {
      if (DEBUG) {
        console.log(`🚫 [DENY] Access Denied - User route requires user role (user has: ${decoded.role})`);
        console.log(`🚫 [REDIRECT] Redirecting to home page`);
        console.log('═══════════════════════════════════════════════════════════\n');
      }
      return NextResponse.redirect(new URL('/', req.url));
    }
    if (DEBUG) {
      console.log(`✅ [ALLOW] Access Granted - User is authenticated USER`);
      console.log('═══════════════════════════════════════════════════════════\n');
    }
    return NextResponse.next();
  }

  // Fallback (should not reach here with current matcher config)
  if (DEBUG) {
    console.log(`✅ [ALLOW] Route processing complete`);
    console.log('═══════════════════════════════════════════════════════════\n');
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/order/:path*', '/checkout/:path*'],
};
