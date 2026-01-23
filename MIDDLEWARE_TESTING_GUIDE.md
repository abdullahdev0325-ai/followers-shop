# Middleware Testing Guide

## Complete Test Scenarios

Run these test cases to verify middleware protection is working correctly.

### Test Suite 1: Admin Route Protection

#### Test 1.1: Admin User Accessing Admin Panel ✅
**Setup:**
- Login with admin account (role: 'admin')
- Token is stored in cookies

**Steps:**
1. Click on "Admin Panel" in navbar
2. Or navigate directly to: `http://localhost:3000/admin`

**Expected Result:**
```
✅ Admin dashboard loads successfully
✅ Console shows:
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

---

#### Test 1.2: Regular User Trying to Access Admin Panel ❌
**Setup:**
- Login with regular user account (role: 'user')
- Token is stored in cookies

**Steps:**
1. Manually type in URL: `http://localhost:3000/admin`
2. Press Enter

**Expected Result:**
```
❌ Redirects to home page (/)
❌ Console shows:
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

---

#### Test 1.3: Logged Out User Trying to Access Admin Panel ❌
**Setup:**
- Clear cookies/logout
- No token in browser

**Steps:**
1. Press Ctrl+Shift+Delete to clear cookies (or logout)
2. Navigate to: `http://localhost:3000/admin`

**Expected Result:**
```
❌ Redirects to login page (/auth/login)
❌ Console shows:
═══════════════════════════════════════════════════════════
📍 [MIDDLEWARE] Processing request to: /admin
═══════════════════════════════════════════════════════════
📌 Route Type: 🔴 ADMIN
🔑 Token Status: ❌ NOT FOUND
🚫 [REDIRECT] Redirecting to /login (protected route requires authentication)
═══════════════════════════════════════════════════════════
```

---

### Test Suite 2: User Route Protection (Checkout)

#### Test 2.1: Authenticated User Accessing Checkout ✅
**Setup:**
- Login with user account
- Add items to cart
- Token is stored in cookies

**Steps:**
1. Click "Checkout" button
2. Or navigate to: `http://localhost:3000/checkout`

**Expected Result:**
```
✅ Checkout page loads successfully
✅ Console shows:
═══════════════════════════════════════════════════════════
📍 [MIDDLEWARE] Processing request to: /checkout
═══════════════════════════════════════════════════════════
📌 Route Type: 🟡 USER
🔑 Token Status: ✅ FOUND
✅ Token Validation: SUCCESS
👤 User Role: USER
✅ [ALLOW] Access Granted - User is authenticated USER
═══════════════════════════════════════════════════════════
```

---

#### Test 2.2: Logged Out User Trying to Access Checkout ❌
**Setup:**
- Clear cookies/logout
- No token in browser

**Steps:**
1. Clear cookies (Ctrl+Shift+Delete)
2. Navigate to: `http://localhost:3000/checkout`

**Expected Result:**
```
❌ Redirects to login page (/auth/login)
❌ Console shows:
═══════════════════════════════════════════════════════════
📍 [MIDDLEWARE] Processing request to: /checkout
═══════════════════════════════════════════════════════════
📌 Route Type: 🟡 USER
🔑 Token Status: ❌ NOT FOUND
🚫 [REDIRECT] Redirecting to /login (protected route requires authentication)
═══════════════════════════════════════════════════════════
```

---

#### Test 2.3: Admin User Accessing Checkout ❌
**Setup:**
- Login with admin account (role: 'admin')
- Token is stored in cookies

**Steps:**
1. Navigate to: `http://localhost:3000/checkout`

**Expected Result:**
```
❌ Redirects to home page (/)
❌ Console shows:
═══════════════════════════════════════════════════════════
📍 [MIDDLEWARE] Processing request to: /checkout
═══════════════════════════════════════════════════════════
📌 Route Type: 🟡 USER
🔑 Token Status: ✅ FOUND
✅ Token Validation: SUCCESS
👤 User Role: ADMIN
🚫 [DENY] Access Denied - User route requires user role (user has: admin)
🚫 [REDIRECT] Redirecting to home page
═══════════════════════════════════════════════════════════
```

---

### Test Suite 3: Public Routes (No Protection)

#### Test 3.1: Accessing Home Page Without Login ✅
**Setup:**
- No login, clear cookies
- Fresh browser state

**Steps:**
1. Navigate to: `http://localhost:3000`
2. Open DevTools Console (F12)

**Expected Result:**
```
✅ Home page loads successfully
✅ Console shows: (Minimal or no middleware logs)
   OR shows:
═══════════════════════════════════════════════════════════
📍 [MIDDLEWARE] Processing request to: /
═══════════════════════════════════════════════════════════
📌 Route Type: 🟢 PUBLIC
✅ [ALLOW] Public route - access granted
═══════════════════════════════════════════════════════════
```

---

#### Test 3.2: Accessing Product Page Without Login ✅
**Setup:**
- No login, clear cookies

**Steps:**
1. Navigate to: `http://localhost:3000/product`
2. Open DevTools Console (F12)

**Expected Result:**
```
✅ Product page loads successfully
✅ Console: No middleware logs for public routes
   (Middleware matcher only triggers for /admin, /order, /checkout)
```

---

#### Test 3.3: Accessing Login Page Without Login ✅
**Setup:**
- Clear cookies/logout

**Steps:**
1. Navigate to: `http://localhost:3000/auth/login`
2. Open DevTools Console (F12)

**Expected Result:**
```
✅ Login page loads successfully
✅ Console: No middleware logs
   (Public route - not in matcher)
```

---

### Test Suite 4: Order History Route Protection

#### Test 4.1: Authenticated User Accessing Orders ✅
**Setup:**
- Login with user account
- Token is stored in cookies

**Steps:**
1. Click on "My Orders" or navigate to: `http://localhost:3000/order`

**Expected Result:**
```
✅ Orders page loads successfully
✅ Console shows:
═══════════════════════════════════════════════════════════
📍 [MIDDLEWARE] Processing request to: /order
═══════════════════════════════════════════════════════════
📌 Route Type: 🟡 USER
🔑 Token Status: ✅ FOUND
✅ Token Validation: SUCCESS
👤 User Role: USER
✅ [ALLOW] Access Granted - User is authenticated USER
═══════════════════════════════════════════════════════════
```

---

#### Test 4.2: Logged Out User Trying to Access Orders ❌
**Setup:**
- Clear cookies/logout

**Steps:**
1. Navigate to: `http://localhost:3000/order`

**Expected Result:**
```
❌ Redirects to login page (/auth/login)
❌ Console shows:
═══════════════════════════════════════════════════════════
📍 [MIDDLEWARE] Processing request to: /order
═══════════════════════════════════════════════════════════
📌 Route Type: 🟡 USER
🔑 Token Status: ❌ NOT FOUND
🚫 [REDIRECT] Redirecting to /login (protected route requires authentication)
═══════════════════════════════════════════════════════════
```

---

### Test Suite 5: Token Expiration

#### Test 5.1: Accessing Protected Route with Expired Token ❌
**Setup:**
- Token has expired (> 7 days old)
- Token still exists in cookies

**Steps:**
1. Navigate to: `http://localhost:3000/checkout`

**Expected Result:**
```
❌ Redirects to login page (/auth/login)
❌ Console shows:
═══════════════════════════════════════════════════════════
📍 [MIDDLEWARE] Processing request to: /checkout
═══════════════════════════════════════════════════════════
📌 Route Type: 🟡 USER
🔑 Token Status: ✅ FOUND
⚠️  Token Validation: ❌ INVALID or EXPIRED
🚫 [REDIRECT] Redirecting to /login (token verification failed)
═══════════════════════════════════════════════════════════

🔐 [VerifyToken] ❌ Token expired
```

---

### Test Suite 6: Token Verification Details

#### Test 6.1: Successful Token Verification Logging ✅
**Setup:**
- Login with valid credentials
- Keep browser open

**Steps:**
1. Open DevTools Console (F12)
2. Navigate to protected route (e.g., `/checkout`)
3. Look for token verification logs

**Expected Result:**
```
🔐 [VerifyToken] ✅ Token verified successfully
   └─ User ID: 507f1f77bcf86cd799439011
   └─ Role: user
   └─ Email: user@example.com
```

---

#### Test 6.2: Invalid Token Format ❌
**Setup:**
- Manually set invalid token in cookies (for testing)

**Steps:**
1. Open DevTools → Application → Cookies
2. Edit 'token' value to: `invalid.token.format`
3. Navigate to: `http://localhost:3000/checkout`

**Expected Result:**
```
❌ Redirects to login
❌ Console shows:
═══════════════════════════════════════════════════════════
📍 [MIDDLEWARE] Processing request to: /checkout
═══════════════════════════════════════════════════════════
📌 Route Type: 🟡 USER
🔑 Token Status: ✅ FOUND
⚠️  Token Validation: ❌ INVALID or EXPIRED
🚫 [REDIRECT] Redirecting to /login (token verification failed)
═══════════════════════════════════════════════════════════

🔐 [VerifyToken] ❌ Invalid token
```

---

## Test Results Summary Table

| Test Case | Route | User | Expected | Console Output |
|---|---|---|---|---|
| 1.1 | `/admin` | Admin | ✅ Allow | Admin role verified |
| 1.2 | `/admin` | User | ❌ Redirect / | Insufficient permissions |
| 1.3 | `/admin` | None | ❌ Redirect /login | Token missing |
| 2.1 | `/checkout` | User | ✅ Allow | User role verified |
| 2.2 | `/checkout` | None | ❌ Redirect /login | Token missing |
| 2.3 | `/checkout` | Admin | ❌ Redirect / | Wrong role |
| 3.1 | `/` | Any | ✅ Allow | No middleware check |
| 3.2 | `/product` | Any | ✅ Allow | No middleware check |
| 3.3 | `/auth/login` | Any | ✅ Allow | No middleware check |
| 4.1 | `/order` | User | ✅ Allow | User role verified |
| 4.2 | `/order` | None | ❌ Redirect /login | Token missing |
| 5.1 | `/checkout` | Expired | ❌ Redirect /login | Token expired |
| 6.1 | `/checkout` | Valid | ✅ Allow | Token verified + user info |
| 6.2 | `/checkout` | Invalid | ❌ Redirect /login | Invalid token format |

---

## Debugging Console Logs

### Enable/Disable Logs

**Logs are automatically:**
- ✅ **ENABLED** when: `NODE_ENV=development` (default for `npm run dev`)
- ✅ **DISABLED** when: `NODE_ENV=production` (for production builds)

**To manually force logs:**
1. Edit `.env.local`
2. Add/change: `NODE_ENV=development`
3. Restart dev server: `npm run dev`

### View Logs

1. Open DevTools: **F12** or **Ctrl+Shift+I**
2. Go to **Console** tab
3. Set filter to: `MIDDLEWARE` or `Verify`
4. Navigate to protected route
5. Watch logs in real-time

---

## Quick Check Checklist

Use this checklist to verify middleware is working:

### ✅ Admin Protection
- [ ] Admin can access `/admin`
- [ ] User cannot access `/admin` (redirects to /)
- [ ] Logged-out cannot access `/admin` (redirects to /login)

### ✅ User Protection  
- [ ] User can access `/checkout`
- [ ] Admin cannot access `/checkout` (redirects to /)
- [ ] Logged-out cannot access `/checkout` (redirects to /login)

### ✅ Public Routes
- [ ] Everyone can access `/` without login
- [ ] Everyone can access `/product` without login
- [ ] Everyone can access `/auth/login` without login

### ✅ Token Handling
- [ ] Valid token allows access to protected routes
- [ ] Expired token redirects to /login
- [ ] Invalid token redirects to /login
- [ ] Missing token redirects to /login

### ✅ Logging
- [ ] Console logs appear when navigating
- [ ] Logs show correct route type (ADMIN/USER/PUBLIC)
- [ ] Logs show token status (FOUND/NOT FOUND)
- [ ] Logs show user role (ADMIN/USER)
- [ ] Logs show access decision (ALLOW/DENY/REDIRECT)

---

## Troubleshooting Test Failures

| If Test Fails | Check This | Solution |
|---|---|---|
| Logs don't appear | DevTools open? | Press F12 and go to Console tab |
| Always allows access | NODE_ENV=production? | Change to development mode |
| Always redirects to login | Token valid? | Login again and check token in cookies |
| Admin can access /checkout | Role check broken? | Restart dev server `npm run dev` |
| Public route shows logs | Matcher config? | Check middleware.js matcher config |

---

**Test Suite Version:** 1.0
**Last Updated:** 2024
**Status:** ✅ Ready for Testing
