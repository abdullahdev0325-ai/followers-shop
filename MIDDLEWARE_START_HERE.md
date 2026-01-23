# Middleware - Quick Start Guide

## 🚀 Start Here

Your middleware is now enhanced with comprehensive debugging! Follow these steps to see it in action.

## Step 1: Start Development Server

```bash
npm run dev
```

Your app runs on `http://localhost:3000`

---

## Step 2: Open DevTools Console

**Keyboard Shortcut:**
- Windows/Linux: `F12` or `Ctrl+Shift+I`
- Mac: `Cmd+Option+I`

**Or:** Right-click → Inspect → Console tab

---

## Step 3: Try These Routes & Watch Console

### ✅ Test 1: Access Public Route (No Protection)
1. Go to: `http://localhost:3000`
2. Check Console
3. Expected: No middleware logs (public routes skip middleware)

---

### 🔐 Test 2: Access Protected Route Without Login
1. Go to: `http://localhost:3000/checkout`
2. Check Console
3. Expected Output:
```
═══════════════════════════════════════════════════════════
📍 [MIDDLEWARE] Processing request to: /checkout
═══════════════════════════════════════════════════════════
📌 Route Type: 🟡 USER
🔑 Token Status: ❌ NOT FOUND
🚫 [REDIRECT] Redirecting to /login (protected route requires authentication)
═══════════════════════════════════════════════════════════
```
4. Result: 🔄 Redirects to `/auth/login`

---

### 👤 Test 3: Login & Access Protected Route
1. Go to: `http://localhost:3000/auth/login`
2. Login with credentials (or create account)
3. Try to access: `http://localhost:3000/checkout`
4. Check Console
5. Expected Output:
```
═══════════════════════════════════════════════════════════
📍 [MIDDLEWARE] Processing request to: /checkout
═══════════════════════════════════════════════════════════
📌 Route Type: 🟡 USER
🔑 Token Status: ✅ FOUND
✅ Token Validation: SUCCESS
👤 User Role: USER
✅ [ALLOW] Access Granted - User is authenticated USER
═══════════════════════════════════════════════════════════

🔐 [VerifyToken] ✅ Token verified successfully
   └─ User ID: 507f1f77bcf86cd799439011
   └─ Role: user
   └─ Email: user@example.com
```
6. Result: ✅ Page loads successfully

---

## 🎯 Protected Routes

### Routes That Need Login
| Route | Role Required | Try Going To |
|---|---|---|
| `/admin` | admin | Not allowed if user role |
| `/admin/blogs` | admin | Not allowed if user role |
| `/admin/categories` | admin | Not allowed if user role |
| `/admin/orders` | admin | Not allowed if user role |
| `/admin/product` | admin | Not allowed if user role |
| `/checkout` | user | Redirects to login if not logged in |
| `/order` | user | Redirects to login if not logged in |

### Routes That Don't Need Login
| Route | Try Going To |
|---|---|
| `/` | Always works |
| `/product` | Always works |
| `/blog` | Always works |
| `/auth/login` | Always works |
| `/auth/register` | Always works |

---

## 📊 Console Debug Symbols

When you navigate, look for these symbols:

| Symbol | Meaning | Color |
|--------|---------|-------|
| 📍 | Route being accessed | - |
| 📌 | Route type (Admin/User/Public) | - |
| 🔑 | Token found or not | 🟢/🔴 |
| ✅ | Success/Allowed | 🟢 Green |
| ❌ | Error/Not found | 🔴 Red |
| 🚫 | Access blocked/Redirecting | 🔴 Red |
| 👤 | User information | 👤 |
| 🔴 | Admin route | 🔴 Red |
| 🟡 | User route | 🟡 Yellow |
| 🟢 | Public route | 🟢 Green |

---

## 🔍 How to Read Console Output

### Pattern 1: ✅ Access Allowed
```
═══════════════════════════════════════════════════════════
📍 [MIDDLEWARE] Processing request to: /checkout
═══════════════════════════════════════════════════════════
📌 Route Type: 🟡 USER                     ← Yellow = User route
🔑 Token Status: ✅ FOUND                  ← Green checkmark = Token exists
✅ Token Validation: SUCCESS                ← Verified successfully
👤 User Role: USER                          ← Has correct role
✅ [ALLOW] Access Granted                   ← Green = Allowed
═══════════════════════════════════════════════════════════
```
**Result:** ✅ Page loads, no redirect

---

### Pattern 2: ❌ Access Denied (Wrong Role)
```
═══════════════════════════════════════════════════════════
📍 [MIDDLEWARE] Processing request to: /admin
═══════════════════════════════════════════════════════════
📌 Route Type: 🔴 ADMIN                    ← Red = Admin route
🔑 Token Status: ✅ FOUND                  ← Token exists
✅ Token Validation: SUCCESS                ← Valid token
👤 User Role: USER                          ← But role is USER
🚫 [DENY] Access Denied - Admin route...   ← Red X = Denied
🚫 [REDIRECT] Redirecting to home page     ← Redirects to /
═══════════════════════════════════════════════════════════
```
**Result:** ❌ Redirects to `/` (home)

---

### Pattern 3: ❌ Not Logged In
```
═══════════════════════════════════════════════════════════
📍 [MIDDLEWARE] Processing request to: /checkout
═══════════════════════════════════════════════════════════
📌 Route Type: 🟡 USER                     ← User route
🔑 Token Status: ❌ NOT FOUND               ← Red X = No token
🚫 [REDIRECT] Redirecting to /login         ← Goes to login
═══════════════════════════════════════════════════════════
```
**Result:** ❌ Redirects to `/auth/login`

---

## ⚡ Quick Test Checklist

Use this to verify everything works:

### Basic Flow
- [ ] Can access home (`/`) without login
- [ ] Cannot access checkout (`/checkout`) without login → Redirects to `/auth/login`
- [ ] Can login successfully
- [ ] Can access checkout (`/checkout`) after login
- [ ] Console shows access logs

### Role-Based Access
- [ ] Regular user cannot access `/admin` → Redirects to home
- [ ] Console shows "🚫 [DENY]" for unauthorized access
- [ ] Admin user can access `/admin` (if admin account exists)

### Console Visibility
- [ ] See `📍 [MIDDLEWARE]` logs in console
- [ ] See `✅` for successful access
- [ ] See `❌` for failures
- [ ] See `🔑 Token Status: ✅ FOUND` when logged in

---

## 🛠️ Troubleshooting

### Logs Don't Appear in Console
**Problem:** Can't see middleware logs  
**Solution:**
1. Open DevTools Console tab (`F12`)
2. Make sure you're in the right tab
3. Refresh page (`Ctrl+R`)
4. Try accessing a protected route

### Always Redirects to Login
**Problem:** Can't access checkout even after login  
**Solution:**
1. Check console for error details
2. Make sure you actually logged in (check navbar for user name)
3. Refresh page after login
4. Check browser cookies (DevTools → Application → Cookies)

### No Token in Cookies
**Problem:** "Token Status: ❌ NOT FOUND" even after login  
**Solution:**
1. Try logging in again
2. Check if login page shows any errors
3. Restart dev server: `npm run dev`
4. Clear browser cookies: `Ctrl+Shift+Delete`

---

## 📚 Want More Details?

See these files for complete information:

1. **[MIDDLEWARE_QUICK_REFERENCE.md](./MIDDLEWARE_QUICK_REFERENCE.md)**
   - Route protection summary table
   - Console symbols guide
   - Common issues

2. **[MIDDLEWARE_DEBUGGING_GUIDE.md](./MIDDLEWARE_DEBUGGING_GUIDE.md)**
   - Comprehensive debugging guide
   - Architecture diagrams
   - Console output examples

3. **[MIDDLEWARE_TESTING_GUIDE.md](./MIDDLEWARE_TESTING_GUIDE.md)**
   - Complete test scenarios
   - Step-by-step test cases
   - Expected results for each test

4. **[MIDDLEWARE_IMPLEMENTATION_SUMMARY.md](./MIDDLEWARE_IMPLEMENTATION_SUMMARY.md)**
   - What was changed
   - How everything works
   - Development workflow

---

## 🎓 Understanding the Flow

```
You Navigate to /checkout
           ↓
Middleware Checks:
  1. Is this a protected route? YES (🟡 USER)
  2. Do you have a token? NO ❌
           ↓
Middleware Logs & Decides:
  🚫 [REDIRECT] You need to login
           ↓
You Get Sent to /auth/login
```

---

```
You Navigate to /checkout (After Login)
           ↓
Middleware Checks:
  1. Is this a protected route? YES (🟡 USER)
  2. Do you have a token? YES ✅
  3. Is token valid? YES ✅
  4. Do you have 'user' role? YES 👤
           ↓
Middleware Logs & Decides:
  ✅ [ALLOW] You can access this page
           ↓
Page Loads Successfully
```

---

## 📍 Next Steps

1. **Run Dev Server:** `npm run dev`
2. **Open Console:** Press `F12`
3. **Test Routes:** Try the scenarios above
4. **Watch Logs:** See middleware working in real-time
5. **Read Guides:** Check the 4 documentation files for details

---

## 💡 Pro Tips

### Console Filtering
In DevTools console, type to filter logs:
```
filter: MIDDLEWARE
filter: VerifyToken
filter: ALLOW
filter: DENY
```

### Keep Console Open
Press `F12` then keep DevTools docked while navigating to see real-time logs

### Test with Different Users
Create multiple test accounts with different roles to verify access control

### Check Token in Cookies
DevTools → Application → Cookies → Look for `token` cookie

---

**Ready?** Start your dev server with `npm run dev` and watch the logs!

