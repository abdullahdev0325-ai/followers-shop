# 📋 Console Output Examples

## 🖥️ Server Console (Terminal)

### Example 1: Admin User Accesses /admin
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

### Example 2: Regular User Tries /admin
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

### Example 3: No Token (Not Logged In)
```
═══════════════════════════════════════════════════════════
📍 [MIDDLEWARE] Processing request to: /admin
═══════════════════════════════════════════════════════════
📌 Route Type: 🔴 ADMIN
🔑 Token Status: ❌ NOT FOUND
🚫 [REDIRECT] Redirecting to /login (protected route requires authentication)
═══════════════════════════════════════════════════════════

```

### Example 4: Public Route
```
═══════════════════════════════════════════════════════════
📍 [MIDDLEWARE] Processing request to: /product
═══════════════════════════════════════════════════════════
📌 Route Type: 🟢 PUBLIC
✅ [ALLOW] Public route - access granted
═══════════════════════════════════════════════════════════

```

---

## 🌐 Browser Console (DevTools)

### Example 1: Login Flow (Complete)
```
═══════════════════════════════════════════════════════════
🔓 [CLIENT FORM] Login button clicked
📧 Email: admin@followers.com
═══════════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
🔐 [CLIENT] Login Request Initiated
📧 Email: admin@followers.com

✅ [CLIENT] Login Response Received: {
  success: true,
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: {
    id: "507f1f77bcf86cd799439011",
    email: "admin@followers.com",
    role: "admin"
  }
}
✅ [CLIENT] Token Stored in localStorage
👤 User Role: ADMIN
📍 User ID: 507f1f77bcf86cd799439011
═══════════════════════════════════════════════════════════

⏳ [REDUX] Login Pending...

✅ [REDUX] Login Successful!
👤 User: admin@followers.com
🎯 Role: ADMIN
═══════════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
✅ [CLIENT FORM] Login Successful!
👤 User: admin@followers.com
🎯 Role: ADMIN
🚪 [CLIENT FORM] Admin detected! Checking admin route access...
═══════════════════════════════════════════════════════════

🔀 [CLIENT FORM] Navigating to: /
```

### Example 2: Navigation to Admin Page
```
═══════════════════════════════════════════════════════════
📍 [CLIENT NAVIGATION] Route Attempt: /admin
🎯 Route Type: 🔴 ADMIN
👤 User Role: ADMIN
✅ [ALLOWED] User is ADMIN - access permitted
═══════════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
🛡️  [ADMIN GUARD] Component Mounted
📍 Current Path: /admin
🔐 Authenticated: true
👤 User: admin@followers.com
🎯 Role: ADMIN
👤 Current User Role: ADMIN
✅ Access: ✓ GRANTED
═══════════════════════════════════════════════════════════
```

### Example 3: Regular User Tries Admin (Blocked)
```
═══════════════════════════════════════════════════════════
📍 [CLIENT NAVIGATION] Route Attempt: /admin
🎯 Route Type: 🔴 ADMIN
👤 User Role: USER
❌ [BLOCKED] This is an ADMIN route but user is USER
⚠️  Middleware will redirect to home page
═══════════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
🛡️  [ADMIN GUARD] Component Mounted
📍 Current Path: /admin
🔐 Authenticated: true
👤 User: user@followers.com
🎯 Role: USER

═══════════════════════════════════════════════════════════
🚫 [ADMIN GUARD] ACCESS DENIED - Not an admin user!
⚠️  Redirecting non-admin user to home...
═══════════════════════════════════════════════════════════
```

### Example 4: Regular User Login
```
═══════════════════════════════════════════════════════════
🔐 [CLIENT] Login Request Initiated
📧 Email: customer@followers.com

✅ [CLIENT] Login Response Received: {
  success: true,
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: {
    id: "507f1f77bcf86cd799439012",
    email: "customer@followers.com",
    role: "user"
  }
}
✅ [CLIENT] Token Stored in localStorage
👤 User Role: USER
📍 User ID: 507f1f77bcf86cd799439012
═══════════════════════════════════════════════════════════

✅ [REDUX] Login Successful!
👤 User: customer@followers.com
🎯 Role: USER
═══════════════════════════════════════════════════════════

✅ [CLIENT FORM] Login Successful!
👤 User: customer@followers.com
🎯 Role: USER
═══════════════════════════════════════════════════════════
```

---

## 🔍 What Each Log Means

| Log | Meaning |
|-----|---------|
| `📍 [MIDDLEWARE]` | Server middleware processing |
| `🔴 ADMIN` | This is an admin route |
| `🟡 USER` | This is a user-only route |
| `🟢 PUBLIC` | This is a public route |
| `✅ FOUND` | Token found in cookies |
| `❌ NOT FOUND` | No token found |
| `✅ [ALLOW]` | Access granted |
| `🚫 [DENY]` | Access blocked |
| `🚫 [REDIRECT]` | User redirected |
| `👤 User Role: ADMIN` | User is admin |
| `👤 User Role: USER` | User is regular user |
| `🛡️  [ADMIN GUARD]` | Client-side guard component |
| `✅ Access: ✓ GRANTED` | Admin component allowed access |

---

## 🎯 Reading the Logs

### **Server Console - What to Look For:**

```
1. First Line: Shows which URL is being accessed
   📍 [MIDDLEWARE] Processing request to: /admin

2. Route Detection: What type of route is it
   📌 Route Type: 🔴 ADMIN

3. Token Status: Is user logged in?
   ✅ Token Status: ✅ FOUND  (or ❌ NOT FOUND)

4. Token Validation: Is token valid?
   ✅ Token Validation: SUCCESS  (or ❌ INVALID)

5. User Role: What is the user's role?
   👤 User Role: ADMIN  (or USER or other)

6. Decision: Will access be allowed?
   ✅ [ALLOW] Access Granted  (or 🚫 [DENY])
```

### **Browser Console - What to Look For:**

```
1. Client action: What did the user do?
   🔓 [CLIENT FORM] Login button clicked

2. Request sent: What data was sent?
   📧 Email: admin@followers.com

3. Response: What did the server send back?
   ✅ [CLIENT] Login Response Received

4. Storage: Was token saved?
   ✅ [CLIENT] Token Stored in localStorage

5. Redux: What happened in state?
   ✅ [REDUX] Login Successful!

6. User Info: Who logged in and what's their role?
   👤 User: admin@followers.com
   🎯 Role: ADMIN
```

---

## 🚦 Success Indicators

### ✅ **Good Signs (Admin Access):**
- Server: `✅ [ALLOW] Access Granted - User is ADMIN`
- Browser: `✅ [ALLOWED] User is ADMIN - access permitted`
- Result: Admin page loads successfully
- URL: Stays on /admin

### ❌ **Good Signs (User Blocked):**
- Server: `🚫 [DENY] Access Denied - Admin route requires admin role`
- Browser: `❌ [BLOCKED] This is an ADMIN route but user is USER`
- Result: Redirected to home page
- URL: Changes from /admin to /

### ⚠️ **Bad Signs (Something Wrong):**
- No logs appearing at all → Check DevTools (F12)
- Logs showing token as invalid → Check token expiry
- Role showing as `undefined` → Check database user record
- No role assigned to user → Add role to user in database

---

## 📊 Example Test Session

### **Complete User Journey:**

```
STEP 1: Fresh Start (No Login)
═══════════════════════════════════════════════════════════
[Try to access /admin]
  ❌ Server: Token Status: ❌ NOT FOUND
  ❌ Browser: Redirected to /login
  ✓ Result: Login page shown


STEP 2: User Logs In (Regular User)
═══════════════════════════════════════════════════════════
[Enter email: user@example.com]
[Enter password: ****]
[Click Login]
  ✅ Browser: 🔐 [CLIENT FORM] Login button clicked
  ✅ Browser: 📧 Email: user@example.com
  ✅ Browser: ✅ [CLIENT] Token Stored in localStorage
  ✅ Browser: 👤 User Role: USER
  ✓ Result: User logged in with role: USER


STEP 3: User Tries Admin Page
═══════════════════════════════════════════════════════════
[Type /admin in URL]
[Press Enter]
  ❌ Server: 📌 Route Type: 🔴 ADMIN
  ❌ Server: 👤 User Role: USER
  ❌ Server: 🚫 [DENY] Access Denied (requires admin role)
  ❌ Browser: 📍 Route Attempt: /admin
  ❌ Browser: ❌ [BLOCKED] This is an ADMIN route but user is USER
  ✓ Result: Redirected to home page


STEP 4: Different Session - Admin User Logs In
═══════════════════════════════════════════════════════════
[Enter email: admin@example.com]
[Enter password: ****]
[Click Login]
  ✅ Browser: 🔐 [CLIENT FORM] Login button clicked
  ✅ Browser: 📧 Email: admin@example.com
  ✅ Browser: ✅ [CLIENT] Token Stored in localStorage
  ✅ Browser: 👤 User Role: ADMIN
  ✓ Result: Admin logged in with role: ADMIN


STEP 5: Admin Accesses Admin Page
═══════════════════════════════════════════════════════════
[Navigate to /admin]
  ✅ Server: 📌 Route Type: 🔴 ADMIN
  ✅ Server: 👤 User Role: ADMIN
  ✅ Server: ✅ [ALLOW] Access Granted - User is ADMIN
  ✅ Browser: 📍 Route Attempt: /admin
  ✅ Browser: ✅ [ALLOWED] User is ADMIN - access permitted
  ✓ Result: Admin dashboard loads successfully
```

---

## 💡 Tips for Debugging

1. **Open DevTools Early:** Do this before logging in
2. **Keep Console Visible:** Don't close it during testing
3. **Watch Both Consoles:** Check server (terminal) AND browser
4. **Clear Logs:** Use `clear()` to clean up
5. **Timestamp:** Note the time of each action
6. **Test Multiple Users:** Try admin, user, and guest scenarios
7. **Check Cookies:** Open DevTools → Application → Cookies → Check token

---

**Last Updated:** January 23, 2026
