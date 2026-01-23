# Middleware Debugging Guide

## Overview
The middleware system is now enhanced with comprehensive debugging console logs to help identify which routes are protected and how access control works.

## Protected Routes Configuration

### 🔴 ADMIN ROUTES (Admin Role Only)
These routes require user to have `role: 'admin'`
- `/admin/*` - All admin dashboard routes
  - `/admin/blogs/*`
  - `/admin/categories/*`
  - `/admin/occasions/*`
  - `/admin/orders/*`
  - `/admin/product/*`

### 🟡 USER ROUTES (User Role Only)
These routes require user to have `role: 'user'`
- `/order/*` - User order history and management
- `/order/` - User orders page
- `/checkout/*` - Checkout process
- `/checkout/` - Checkout page

### 🟢 PUBLIC ROUTES (No Authentication Required)
These routes are accessible to everyone:
- `/` - Home page
- `/product/*` - Product listings
- `/blog/*` - Blog posts
- `/occasions/*` - Occasion pages
- `/auth/login` - Login page
- `/auth/register` - Register page
- `/auth/otp` - OTP verification page

## Debugging Console Output

When you access any protected route, you'll see comprehensive debug logs in the browser DevTools console:

### Example: Admin Route Access

#### ✅ Successful Admin Access
```
═══════════════════════════════════════════════════════════
📍 [MIDDLEWARE] Processing request to: /admin
═══════════════════════════════════════════════════════════
📌 Route Type: 🔴 ADMIN
🔑 Token Status: ✅ FOUND
✅ Token Validation: SUCCESS
👤 User Role: ADMIN
✅ [ALLOW] Access Granted - User is ADMIN
═══════════════════════════════════════════════════════════
```

#### ❌ Failed Admin Access (User Role)
```
═══════════════════════════════════════════════════════════
📍 [MIDDLEWARE] Processing request to: /admin
═══════════════════════════════════════════════════════════
📌 Route Type: 🔴 ADMIN
🔑 Token Status: ✅ FOUND
✅ Token Validation: SUCCESS
👤 User Role: USER
🚫 [DENY] Access Denied - Admin route requires admin role (user has: user)
🚫 [REDIRECT] Redirecting to home page
═══════════════════════════════════════════════════════════
```

### Example: Public Route Access

```
═══════════════════════════════════════════════════════════
📍 [MIDDLEWARE] Processing request to: /
═══════════════════════════════════════════════════════════
📌 Route Type: 🟢 PUBLIC
✅ [ALLOW] Public route - access granted
═══════════════════════════════════════════════════════════
```

### Example: Protected Route Without Token

```
═══════════════════════════════════════════════════════════
📍 [MIDDLEWARE] Processing request to: /checkout
═══════════════════════════════════════════════════════════
📌 Route Type: 🟡 USER
🔑 Token Status: ❌ NOT FOUND
🚫 [REDIRECT] Redirecting to /login (protected route requires authentication)
═══════════════════════════════════════════════════════════
```

## How to View Debug Logs

### In Browser
1. Open DevTools (F12 or Ctrl+Shift+I)
2. Go to the Console tab
3. Navigate to protected routes
4. Check console for middleware logs with visual indicators:
   - 🔴 Red emoji = Admin route
   - 🟡 Yellow emoji = User route
   - 🟢 Green emoji = Public route
   - ✅ Green checkmark = Success
   - ❌ Red X = Failure
   - 🚫 No entry sign = Access denied
   - 🔑 Key = Token status
   - 🔐 Lock = Token verification

### In Server Terminal
During development, if using `next dev`, middleware logs also appear in the terminal.

## Console Log Hierarchy

```
📍 [MIDDLEWARE] Processing request     ← Request entry point
  ├─ 📌 Route Type: (ADMIN/USER/PUBLIC)
  ├─ 🔑 Token Status: (FOUND/NOT FOUND)
  ├─ ✅ Token Validation: (SUCCESS/INVALID/EXPIRED)
  ├─ 👤 User Role: (ADMIN/USER)
  └─ Result: (ALLOW/DENY/REDIRECT)
```

## Debug Features

### Token Verification Logging
When token is verified, you'll see:
```
🔐 [VerifyToken] ✅ Token verified successfully
   └─ User ID: 507f1f77bcf86cd799439011
   └─ Role: admin
   └─ Email: admin@example.com
```

### Token Verification Failures
Different error types are logged:
```
🔐 [VerifyToken] ❌ Token expired
🔐 [VerifyToken] ❌ Invalid token
🔐 [VerifyToken] ❌ Token verification failed: [error message]
```

## Files Updated

### 1. `/src/app/middleware.js`
- Enhanced console logging with visual indicators
- Comprehensive route type detection
- Token status logging
- Role-based access decision logging
- Redirect reason logging

**Protected Routes Matcher:**
```javascript
export const config = {
  matcher: ['/admin/:path*', '/order/:path*', '/checkout/:path*'],
};
```

### 2. `/src/lib/auth.js`
- Added debugging to `verifyToken()` function
- Token verification success/failure logging
- User role and email logging on success

## Testing Checklist

### Test Admin Route Protection
- [ ] Admin user accessing `/admin` → Should allow (✅ [ALLOW])
- [ ] Regular user accessing `/admin` → Should redirect to home (🚫 [DENY])
- [ ] No token accessing `/admin` → Should redirect to /login (🚫 [REDIRECT])

### Test User Route Protection
- [ ] Authenticated user accessing `/checkout` → Should allow (✅ [ALLOW])
- [ ] No token accessing `/checkout` → Should redirect to /login (🚫 [REDIRECT])

### Test Public Routes
- [ ] Any user accessing `/` → Should allow without token
- [ ] Any user accessing `/product/*` → Should allow without token
- [ ] Anonymous user accessing `/auth/login` → Should allow without token

## Disabling Debug Logs

Debug logs are only shown when `NODE_ENV !== 'production'`. To disable:

1. Set `NODE_ENV=production` in your `.env.local`
2. Or build for production: `npm run build && npm run start`

To enable during development:
1. Ensure `NODE_ENV=development` (default for `npm run dev`)
2. Clear browser cache if needed
3. Check DevTools console with F12

## Architecture

```
Request → Middleware (middleware.js)
  ├─ Check if route is protected
  ├─ Extract token from cookies
  ├─ Verify token signature (auth.js)
  ├─ Check user role requirements
  └─ Allow/Redirect
```

## Flow Diagram

```
Client Request to Protected Route
           ↓
┌─────────────────────────────────┐
│ Middleware Processes Request    │
│ 📍 Route Type Check             │
└─────────────────────────────────┘
           ↓
    ┌──────┴──────┐
    ↓             ↓
Protected?    Public?
 (Yes)         (Yes)
   ↓             ↓
 ┌──────────────────┐
 │ Check Token      │
 └──────────────────┘
   ↓
┌──────────────────────┐
│ Token Found?         │
└──────────────────────┘
  ↓ (Yes)      ↓ (No)
Verify      Redirect
Token       to /login
  ↓
┌──────────────────────┐
│ Valid Token?         │
└──────────────────────┘
  ↓ (Yes)      ↓ (No)
Check      Redirect
Role       to /login
  ↓
┌──────────────────────┐
│ Correct Role?        │
└──────────────────────┘
  ↓ (Yes)      ↓ (No)
Allow      Redirect
Request    to /
```

## Common Debug Scenarios

### Scenario 1: User Can't Access Admin Panel
**Expected Console Output:**
```
🚫 [DENY] Access Denied - Admin route requires admin role (user has: user)
```
**Solution:** Verify user's database role is set to 'admin'

### Scenario 2: User Logged Out Then Gets Redirected
**Expected Console Output:**
```
🚫 [REDIRECT] Redirecting to /login (protected route requires authentication)
```
**Solution:** Token expired or not found in cookies - user must login again

### Scenario 3: Public Route Loads Instantly
**Expected Console Output:**
```
📌 Route Type: 🟢 PUBLIC
✅ [ALLOW] Public route - access granted
```
**Solution:** Correct behavior - no middleware checks needed

## Troubleshooting

| Issue | Check | Solution |
|-------|-------|----------|
| Debug logs not showing | Check DevTools Console tab | Press F12 and go to Console |
| Debug logs not appearing | Check NODE_ENV | Set NODE_ENV=development in .env.local |
| All routes show as public | Check matcher config | Verify middleware.js matcher is configured |
| Can't access admin panel | Check browser console | Look for [DENY] or [REDIRECT] messages |
| Token keeps expiring | Check token lifetime | Token expires in 7 days by default |

## Next Steps

1. ✅ Monitor console logs during development
2. ✅ Verify all protected routes show correct access decisions
3. ✅ Test with different user roles (admin vs user)
4. ✅ Test with expired or missing tokens
5. ✅ Build and deploy to production (logs disabled automatically)

---

**Last Updated:** 2024
**Middleware Status:** ✅ Enhanced with Debugging
**Protected Routes:** 3 types (Admin, User, Public)
