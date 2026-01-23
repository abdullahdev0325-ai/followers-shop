# Middleware Architecture & Diagrams

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                               │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ User navigates to route (e.g., /checkout)                   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↓                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Browser sends HTTP request with cookies                     │  │
│  │ Cookie: token=eyJhbGc...                                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────┘
                             ↓
          ┌──────────────────────────────────┐
          │   NEXT.JS MIDDLEWARE LAYER       │
          │   (src/app/middleware.js)        │
          │                                  │
          │  1. Check route type             │
          │  2. Extract token from cookies   │
          │  3. Verify token signature       │
          │  4. Check user role              │
          │  5. Allow or Redirect            │
          └──────────────────────────────────┘
                             ↓
          ┌──────────────────────────────────┐
          │   VERIFICATION LAYER             │
          │   (src/lib/auth.js)              │
          │                                  │
          │  verifyToken() → JWT validation  │
          └──────────────────────────────────┘
                             ↓
          ┌──────────────────────────────────┐
          │   DECISION                       │
          │                                  │
          │  ✅ ALLOW → Continue to route   │
          │  ❌ DENY → Redirect to /        │
          │  🚫 REJECT → Redirect to /login │
          └──────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│                     NEXT.JS SERVER                                  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Route handler processes request                             │  │
│  │ (e.g., /checkout/page.jsx)                                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                             ↓
          ┌──────────────────────────────────┐
          │   HTTP RESPONSE                  │
          │                                  │
          │  ✅ 200 OK + Page HTML          │
          │  ❌ 307 Redirect to /           │
          │  🚫 307 Redirect to /login      │
          └──────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                               │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Page renders (either requested page or redirect target)     │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Request Processing Flow

### Admin Route Request Flow

```
Request: /admin
    ↓
[middleware.js]
├─ Log: 📍 Processing /admin
├─ Check route type → 🔴 ADMIN ROUTE
├─ Extract token from cookies
│   ├─ Token found? → YES ✅
│   └─ Token valid? → YES ✅
├─ Decode token
│   ├─ User ID: 507f1f77bcf86cd799439011
│   └─ Role: admin
├─ Check role requirement
│   └─ Requires: admin, Has: admin → MATCH ✅
└─ Decision: ALLOW ✅
    ↓
[browser]
├─ Load /admin page
├─ Display dashboard
└─ Log: ✅ [ALLOW] Access Granted
```

### User Route Request Flow (No Token)

```
Request: /checkout (NO TOKEN)
    ↓
[middleware.js]
├─ Log: 📍 Processing /checkout
├─ Check route type → 🟡 USER ROUTE
├─ Extract token from cookies
│   └─ Token found? → NO ❌
├─ Log: 🔑 Token Status: ❌ NOT FOUND
├─ This is protected route → Need login
└─ Decision: REDIRECT to /login 🚫
    ↓
[browser]
├─ 307 Redirect response
├─ Load /auth/login page
└─ Log: 🚫 [REDIRECT] Redirecting to /login
```

### User Route Request Flow (Wrong Role)

```
Request: /checkout (ADMIN USER)
    ↓
[middleware.js]
├─ Log: 📍 Processing /checkout
├─ Check route type → 🟡 USER ROUTE
├─ Extract token from cookies
│   ├─ Token found? → YES ✅
│   └─ Token valid? → YES ✅
├─ Decode token
│   ├─ User ID: 507f1f77bcf86cd799439012
│   └─ Role: admin
├─ Check role requirement
│   └─ Requires: user, Has: admin → NO MATCH ❌
└─ Decision: DENY (redirect to /) 🚫
    ↓
[browser]
├─ 307 Redirect response
├─ Load home page (/)
└─ Log: 🚫 [DENY] Access Denied - Wrong role
```

### Public Route Request Flow

```
Request: /product
    ↓
[middleware.js]
├─ Check matcher config
├─ Route matches ['/admin/:path*', '/order/:path*', '/checkout/:path*']?
├─ NO → Not protected
└─ Skip middleware, continue to handler
    ↓
[browser]
├─ Load /product page
├─ No middleware logs (public route)
└─ Fast load (no security checks needed)
```

---

## Token Verification Flow

```
Middleware calls verifyToken(token)
    ↓
[auth.js - verifyToken()]
├─ JWT Signature Verification
│   ├─ Extract header.payload.signature
│   ├─ Verify signature using SECRET_KEY
│   ├─ Valid? → YES ✅
│   └─ Continue
├─ Check Token Expiration
│   ├─ Current time vs exp claim
│   ├─ Expired? → NO ✅
│   └─ Continue
├─ Decode Payload
│   ├─ userId: "507f1f77bcf86cd799439011"
│   ├─ role: "user"
│   ├─ email: "user@example.com"
│   └─ exp: 1735689600
├─ Return decoded object ✅
├─ Log: 🔐 [VerifyToken] ✅ Token verified
└─ Log User Info
       ├─ User ID
       ├─ Role
       └─ Email
    ↓
Middleware uses verified user data for role check
```

---

## Route Protection Decision Tree

```
                        REQUEST → Route?
                              ↓
                    ┌─────────┴─────────┐
                    ↓                   ↓
            Admin Route?          User Route?
            (/admin/*)             (/order, /checkout)
            ↓                       ↓
         Protected             Protected
            ↓                       ↓
      Public Route?           Check Token
         (/etc)                     ↓
            ↓              ┌────────┴────────┐
         PUBLIC            ↓                 ↓
            ↓           Token?           No Token
         ALLOW           Found?              ↓
            ↓              ↓             REDIRECT
         Continue     ┌──┴──┐           to LOGIN
                      ↓     ↓
                   YES    NO
                      ↓     ↓
                  Verify  REDIRECT
                  Token   to LOGIN
                      ↓
                 ┌──┴──┐
                 ↓     ↓
              Valid  Invalid
                 ↓     ↓
            Check   REDIRECT
            Role    to LOGIN
                 ↓
          ┌──────┴──────┐
          ↓             ↓
       MATCH          NO MATCH
      (✅ Admin        (❌ User has
       has admin)      user role)
          ↓             ↓
       ALLOW         REDIRECT
          ↓           to HOME
       Continue
       to /admin
```

---

## Console Logging Flow

```
User navigates to protected route
         ↓
Middleware starts
         ↓
═══════════════════════════════════════════════════════════
         ↓
Log: 📍 [MIDDLEWARE] Processing request to: /checkout
         ↓
Calculate route type (Admin/User/Public)
         ↓
Log: 📌 Route Type: 🟡 USER
         ↓
Extract token from cookies
         ↓
IF token exists:
   ├─ Log: 🔑 Token Status: ✅ FOUND
   ├─ Call verifyToken()
   │   └─ Log: 🔐 [VerifyToken] ✅ Token verified
   │       ├─ Log: └─ User ID: ...
   │       ├─ Log: └─ Role: user
   │       └─ Log: └─ Email: user@example.com
   ├─ Log: ✅ Token Validation: SUCCESS
   ├─ Extract role from token
   ├─ Log: 👤 User Role: USER
   ├─ Check if role matches requirement
   └─ Log: ✅ [ALLOW] Access Granted
ELSE:
   ├─ Log: 🔑 Token Status: ❌ NOT FOUND
   ├─ Check if route is protected
   └─ Log: 🚫 [REDIRECT] Redirecting to /login
         ↓
═══════════════════════════════════════════════════════════
         ↓
Return response (allow/redirect)
```

---

## Role-Based Access Control (RBAC) Matrix

```
┌─────────────┬──────────────┬──────────────┬──────────────┐
│ User Role   │ /admin route │ /order route │ /checkout    │
│             │              │              │              │
├─────────────┼──────────────┼──────────────┼──────────────┤
│ Not Logged  │ ❌ REDIRECT  │ ❌ REDIRECT  │ ❌ REDIRECT  │
│ In          │ to LOGIN     │ to LOGIN     │ to LOGIN     │
│             │ 🚫           │ 🚫           │ 🚫           │
├─────────────┼──────────────┼──────────────┼──────────────┤
│ user        │ ❌ REDIRECT  │ ✅ ALLOW     │ ✅ ALLOW     │
│             │ to HOME      │ 🟡 YES       │ 🟡 YES       │
│             │ 🚫           │              │              │
├─────────────┼──────────────┼──────────────┼──────────────┤
│ admin       │ ✅ ALLOW     │ ❌ REDIRECT  │ ❌ REDIRECT  │
│             │ 🔴 YES       │ to HOME      │ to HOME      │
│             │              │ 🚫           │ 🚫           │
└─────────────┴──────────────┴──────────────┴──────────────┘

Legend:
✅ = Access Allowed
❌ = Access Denied / Redirected
🚫 = Blocked with redirect
🔴 = Admin route
🟡 = User route
🟢 = Public route
```

---

## Token Structure & Verification

### JWT Token Format

```
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTcwMzM5NjgwMCwiZXhwIjoxNzA0MDAxNjAwfQ.abcd1234...

         ↓ Split by dots (.)

┌────────────────────────────────────────────┐
│         Header (Base64 decoded)            │
├────────────────────────────────────────────┤
│ {                                          │
│   "alg": "HS256",                          │
│   "typ": "JWT"                             │
│ }                                          │
└────────────────────────────────────────────┘
         ↓ DECODED & VERIFIED ✅

┌────────────────────────────────────────────┐
│         Payload (Base64 decoded)           │
├────────────────────────────────────────────┤
│ {                                          │
│   "userId": "507f1f77bcf86cd799439011",  │
│   "email": "user@example.com",             │
│   "role": "user",                          │
│   "iat": 1703396800,    (issued at)       │
│   "exp": 1704001600     (expires in 7d)   │
│ }                                          │
└────────────────────────────────────────────┘
         ↓ Used for Access Control

┌────────────────────────────────────────────┐
│    Signature (HMAC-SHA256 verified)        │
├────────────────────────────────────────────┤
│ HMACSHA256(                                │
│   base64UrlEncode(header) + "." +         │
│   base64UrlEncode(payload),               │
│   SECRET_KEY                               │
│ )                                          │
└────────────────────────────────────────────┘
```

### Verification Steps

```
1. EXTRACT
   ├─ Get token from request cookies
   └─ token = req.cookies.get('token')?.value

2. VERIFY SIGNATURE
   ├─ Use SECRET_KEY from environment
   ├─ JWT library checks signature
   └─ If fails → return null

3. CHECK EXPIRATION
   ├─ Compare current time vs exp claim
   ├─ If expired → throw TokenExpiredError
   └─ If valid → continue

4. DECODE PAYLOAD
   ├─ Extract user data
   ├─ userId: "507f1f77bcf86cd799439011"
   ├─ role: "user"
   └─ email: "user@example.com"

5. RETURN DECODED
   └─ Use decoded object for role checks
```

---

## Error Handling Flow

```
Request with invalid/expired token
         ↓
Try to verify token
         ↓
    JWT library throws error
         ↓
    ┌────────────────────┐
    │ Error Type?        │
    └──┬─────────────────┘
       ├─ TokenExpiredError
       │  └─ Log: 🔐 [VerifyToken] ❌ Token expired
       │
       ├─ JsonWebTokenError
       │  └─ Log: 🔐 [VerifyToken] ❌ Invalid token
       │
       └─ Other Error
          └─ Log: 🔐 [VerifyToken] ❌ Verification failed: [message]
         ↓
    verifyToken returns null
         ↓
    Middleware checks for null
         ↓
    Log: ⚠️ Token Validation: ❌ INVALID or EXPIRED
         ↓
    Log: 🚫 [REDIRECT] Redirecting to /login
         ↓
    Return redirect response
         ↓
    User sent to /auth/login
```

---

## Protected Routes Configuration

### Middleware Matcher

```javascript
export const config = {
  matcher: ['/admin/:path*', '/order/:path*', '/checkout/:path*'],
};

// This means middleware ONLY runs for these routes:
✅ Checked:   /admin, /admin/blogs, /admin/categories, etc.
✅ Checked:   /order, /order/[id], etc.
✅ Checked:   /checkout, /checkout/success, etc.
❌ Skipped:   / (home)
❌ Skipped:   /product
❌ Skipped:   /blog
❌ Skipped:   /auth/login
// Performance benefit: Public routes bypass middleware entirely
```

### Route Protection Configuration

```javascript
// Admin routes - only accessible by admins
const adminPaths = ['/admin', '/admin/'];
✅ /admin
✅ /admin/blogs
✅ /admin/blogs/create
✅ /admin/categories
✅ /admin/occasions
✅ /admin/orders
✅ /admin/product
❌ /product (different route)

// User routes - only accessible by authenticated users
const userPaths = ['/order', '/order/', '/checkout', '/checkout/'];
✅ /order
✅ /order/123
✅ /checkout
✅ /checkout/success
❌ /checkout/order (doesn't start with exactly /checkout/)
```

---

## Performance Optimization

```
Request Flow with Performance Considerations

Public Route Request:
  /product
       ↓
Middleware checks matcher config
       ↓
/product NOT in matcher
       ↓
SKIP ENTIRE MIDDLEWARE ⚡
       ↓
Go directly to route handler
       ↓
RESULT: Fast response, no security overhead


Protected Route Request:
  /admin
       ↓
Middleware matcher MATCHES (/admin/:path*)
       ↓
RUN MIDDLEWARE 🛡️
  ├─ Extract cookie (~1ms)
  ├─ Verify JWT signature (~2ms)
  ├─ Check role (~1ms)
  └─ Total: ~4ms
       ↓
Allow or redirect
       ↓
RESULT: Small overhead, high security
```

---

## Development vs Production

```
DEVELOPMENT (NODE_ENV=development)
├─ npm run dev
├─ NODE_ENV automatically set to 'development'
├─ DEBUG flag = true
├─ ✅ ALL console logs enabled
├─ ✅ Detailed middleware output
├─ ✅ Token verification logs
├─ ✅ Access decision reasons
└─ Perfect for debugging & testing

PRODUCTION (NODE_ENV=production)
├─ npm run build && npm run start
├─ NODE_ENV = 'production'
├─ DEBUG flag = false
├─ ❌ ALL console logs disabled
├─ ✅ Middleware still works (no logs)
├─ ✅ Same security enforcement
├─ ✅ Better performance
└─ No information leakage
```

---

## Complete Request Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. USER INITIATES REQUEST                                       │
│    User clicks link or types URL                                │
│    Browser: GET /checkout HTTP/1.1                              │
│    Cookies: token=eyJ...                                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. MIDDLEWARE INTERCEPTS                                        │
│    middleware.js handles all requests                           │
│    Runs BEFORE route handler                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. SECURITY CHECKS                                              │
│    a) Check if route is protected                               │
│    b) Extract token from cookies                                │
│    c) Verify token signature                                    │
│    d) Check user role                                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────┴─────────┐
                    ↓                   ↓
            ✅ ALLOWED              ❌ DENIED/INVALID
                    ↓                   ↓
        ┌───────────────────┐  ┌──────────────────┐
        │ 4a. CONTINUE      │  │ 4b. REDIRECT     │
        │ to route handler  │  │                  │
        └───────────────────┘  │ Redirect to:     │
                ↓               │ - /login (no token)│
        ┌───────────────────┐  │ - / (wrong role) │
        │ 5. ROUTE HANDLER  │  │                  │
        │ Processes request │  └──────────────────┘
        │ Generates response│          ↓
        └───────────────────┘  ┌──────────────────┐
                ↓               │ 5b. SEND REDIRECT│
        ┌───────────────────┐  │ HTTP 307         │
        │ 6. RESPONSE       │  │ Location: /login │
        │ Status: 200 OK    │  └──────────────────┘
        │ Body: Page HTML   │          ↓
        └───────────────────┘  ┌──────────────────┐
                ↓               │ 6b. BROWSER      │
        ┌───────────────────┐  │ Follows redirect │
        │ 7. BROWSER        │  │ Loads new page   │
        │ Renders page      │  │                  │
        │ Displays content  │  └──────────────────┘
        └───────────────────┘
```

---

## Summary Diagram

```
                    ┌──────────────────────┐
                    │   USER NAVIGATES     │
                    │   to Protected Route  │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │   MIDDLEWARE RUNS    │
                    │  (middleware.js)     │
                    └──────────┬───────────┘
                               ↓
                    ┌──────────────────────┐
                    │  CHECK TOKEN         │
                    │  (src/lib/auth.js)   │
                    └──────────┬───────────┘
                    ┌──────────┴──────────┐
                    ↓                     ↓
          ┌──────────────────┐  ┌──────────────────┐
          │ TOKEN VALID      │  │ TOKEN INVALID    │
          │ ROLE MATCHES     │  │ ROLE MISMATCH    │
          │                  │  │ TOKEN MISSING    │
          └──────────┬───────┘  └──────────┬───────┘
                     ↓                     ↓
            ┌─────────────────┐  ┌──────────────────┐
            │ ✅ ALLOW        │  │ 🚫 REDIRECT      │
            │ Load requested  │  │ to /login or /   │
            │ page            │  │                  │
            └─────────────────┘  └──────────────────┘
                     ↓                     ↓
            ┌─────────────────┐  ┌──────────────────┐
            │ 200 OK Response │  │ 307 Redirect     │
            │ Page loaded     │  │ Response         │
            └─────────────────┘  └──────────────────┘
```

---

**This diagram guide helps visualize how middleware works at every level!**
