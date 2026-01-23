# Middleware Quick Reference

## Route Protection Summary

| Route | Type | Requires Auth | Role Required | Protected |
|-------|------|---|---|---|
| `/admin/*` | Protected | ✅ Yes | `admin` | 🔴 ADMIN ONLY |
| `/order/*` | Protected | ✅ Yes | `user` | 🟡 USER ONLY |
| `/checkout/*` | Protected | ✅ Yes | `user` | 🟡 USER ONLY |
| `/` | Public | ❌ No | - | 🟢 NO |
| `/product/*` | Public | ❌ No | - | 🟢 NO |
| `/blog/*` | Public | ❌ No | - | 🟢 NO |
| `/auth/login` | Public | ❌ No | - | 🟢 NO |
| `/auth/register` | Public | ❌ No | - | 🟢 NO |
| `/auth/otp` | Public | ❌ No | - | 🟢 NO |

## Console Debug Symbols

| Symbol | Meaning | Example |
|--------|---------|---------|
| 📍 | Request entry point | `📍 [MIDDLEWARE] Processing request to: /admin` |
| 📌 | Route type classification | `📌 Route Type: 🔴 ADMIN` |
| 🔑 | Token status | `🔑 Token Status: ✅ FOUND` |
| ✅ | Success/Allowed | `✅ Token Validation: SUCCESS` |
| ❌ | Failed/Error | `❌ NOT FOUND` |
| 🚫 | Access denied/Redirecting | `🚫 [DENY]` or `🚫 [REDIRECT]` |
| 👤 | User information | `👤 User Role: ADMIN` |
| 🔴 | Admin route | `🔴 ADMIN` |
| 🟡 | User route | `🟡 USER` |
| 🟢 | Public route | `🟢 PUBLIC` |
| 🔐 | Token verification | `🔐 [VerifyToken]` |

## Access Decision Matrix

```
                          Has Valid Token?
                         /               \
                       NO               YES
                      /                   \
                     /                     \
              Public Route?          Check User Role
              /         \             /    |    \
            YES         NO         Admin  User  Other
            |           |           |     |      |
          ALLOW    REDIRECT to    ADMIN Check CHECK
                    /login       ALLOWED  if=user CHECK
                                           ALLOWED    DENY
```

## Expected Middleware Console Output Patterns

### ✅ Successful Access
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

### ❌ Insufficient Permissions
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

### ❌ No Authentication Token
```
═══════════════════════════════════════════════════════════
📍 [MIDDLEWARE] Processing request to: /checkout
═══════════════════════════════════════════════════════════
📌 Route Type: 🟡 USER
🔑 Token Status: ❌ NOT FOUND
🚫 [REDIRECT] Redirecting to /login (protected route requires authentication)
═══════════════════════════════════════════════════════════
```

### ⚠️ Invalid/Expired Token
```
═══════════════════════════════════════════════════════════
📍 [MIDDLEWARE] Processing request to: /order
═══════════════════════════════════════════════════════════
📌 Route Type: 🟡 USER
🔑 Token Status: ✅ FOUND
⚠️  Token Validation: ❌ INVALID or EXPIRED
🚫 [REDIRECT] Redirecting to /login (token verification failed)
═══════════════════════════════════════════════════════════
```

### 🟢 Public Route (No Middleware Check)
```
═══════════════════════════════════════════════════════════
📍 [MIDDLEWARE] Processing request to: /
═══════════════════════════════════════════════════════════
📌 Route Type: 🟢 PUBLIC
✅ [ALLOW] Public route - access granted
═══════════════════════════════════════════════════════════
```

## Token Verification Details

```
🔐 [VerifyToken] ✅ Token verified successfully
   └─ User ID: 507f1f77bcf86cd799439011
   └─ Role: admin
   └─ Email: admin@example.com
```

## Quick Testing Commands

### Test Admin Access
1. Login as admin user
2. Navigate to `/admin`
3. Check console for: `✅ [ALLOW] Access Granted - User is ADMIN`

### Test User Can't Access Admin
1. Login as regular user
2. Navigate to `/admin`
3. Check console for: `🚫 [DENY] Access Denied - Admin route requires admin role`
4. Should redirect to home (`/`)

### Test Public Route
1. Don't login (or logout)
2. Navigate to `/`
3. Check console for: `📌 Route Type: 🟢 PUBLIC`
4. Should load without redirect

### Test Protected Route Without Token
1. Don't login (or logout)
2. Navigate to `/checkout`
3. Check console for: `❌ NOT FOUND` and redirect to `/login`

## Files Modified

1. **`src/app/middleware.js`** (59 → 151 lines)
   - Enhanced route protection with detailed console logging
   - Clear visual feedback for debugging
   - Route type classification system
   - Comprehensive access decision logging

2. **`src/lib/auth.js`** (12 → 42 lines)
   - Enhanced `verifyToken()` with debugging
   - Token verification success/failure logging
   - User information logging on verification

3. **`MIDDLEWARE_DEBUGGING_GUIDE.md`** (NEW)
   - Comprehensive debugging guide
   - Console output examples
   - Troubleshooting tips
   - Architecture diagrams

## Environment Detection

Debug logs automatically enabled when:
- ✅ `NODE_ENV=development` (default for `npm run dev`)
- ✅ Browser DevTools console is open (F12)

Debug logs automatically disabled when:
- ✅ `NODE_ENV=production` (for production builds)

## How to View Logs

1. Open browser DevTools: **F12** or **Ctrl+Shift+I**
2. Go to **Console** tab
3. Navigate to a protected route
4. Look for logs with 📍 emoji marker
5. Follow the flow with ✅/❌ indicators

## Common Issues & Debug Output

| Problem | Console Output | Fix |
|---------|---|---|
| Can't access admin | `🚫 [DENY]... admin role required` | User needs admin role in DB |
| Redirect to login | `🚫 [REDIRECT]... /login` | Login required - token missing/expired |
| Public route slow | No middleware logs | Correct - public routes bypass middleware |
| Always redirects | Check role in output | Verify user role matches route requirement |

---

**Status:** ✅ Middleware enhanced with comprehensive debugging
**Debug Level:** Development (auto-disabled in production)
**Protected Routes:** 3 route groups (Admin, User, Public)
