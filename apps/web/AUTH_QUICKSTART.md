# ⚡ Authentication Quick Start Guide

**Estimated Time:** 30 minutes  
**Status:** Ready to Deploy

---

## 🎯 3-Step Setup (Fast Track)

### Step 1️⃣: GitHub OAuth Configuration (5 min)

#### A. Create GitHub OAuth App
1. Go to **GitHub** → **Settings** → **Developer settings** → **OAuth Apps**
2. Click **"New OAuth App"**
3. Fill in these fields:
   ```
   Application name: Hackura Sentinel AI
   Homepage URL: https://sentinel.hackura.app
   Authorization callback URL: https://drgcuoiytgwbaoxxsasl.supabase.co/auth/v1/callback?provider=github
   ```
4. Click **"Register application"**
5. **Copy** the Client ID and Client Secret (you'll need these)

#### B. Add to Supabase
1. Open **Supabase Dashboard** → **Authentication** → **Providers**
2. Find **GitHub** and click to expand
3. Enable the toggle ✓
4. Paste:
   - **Client ID** from GitHub
   - **Client Secret** from GitHub
5. Click **"Save"**

### Step 2️⃣: Configure Redirect URLs (2 min)

1. In Supabase → **Authentication** → **URL Configuration**
2. Set **Site URL**:
   ```
   https://sentinel.hackura.app
   ```
3. Add **Redirect URLs** (click "Add URL" for each):
   ```
   https://sentinel.hackura.app/auth/callback
   https://sentinel.hackura.app/auth/login
   https://sentinel.hackura.app/dashboard
   http://localhost:3001/auth/callback
   ```

### Step 3️⃣: Create Database Tables (10 min)

1. Open **Supabase Dashboard** → **SQL Editor**
2. Click **"New Query"**
3. Copy-paste **all SQL code** from `SUPABASE_SETUP.md`
4. Click **"Run"** (or Ctrl+Enter)
5. Tables should show as created ✓

---

## 🧪 Test Authentication (3 min)

### Local Testing

```bash
# Start dev server
cd apps/web
npm run dev
```

Visit in browser:
1. http://localhost:3001/auth/signup → Sign up with email/password
2. http://localhost:3001/auth/login → Sign in with email/password
3. http://localhost:3001/dashboard → Should show dashboard if authenticated

### Test Cases

✅ **Email/Password Signup**
- Click "Create Account" on signup page
- Enter email and password
- Should redirect to login
- Sign in with same credentials
- Should show dashboard

✅ **GitHub OAuth** (When configured)
- Click "Sign in with GitHub"
- Authorize app on GitHub
- Should redirect to dashboard

✅ **Protected Routes**
- Without auth, visit `/dashboard`
- Should redirect to `/auth/login`

---

## 📁 Files Ready to Use

### Authentication Pages (Already Built)
```
✅ src/app/auth/login/page.tsx       - Login form
✅ src/app/auth/signup/page.tsx      - Signup form  
✅ src/app/auth/callback/page.tsx    - OAuth callback
✅ src/context/auth-context.tsx      - Auth state management
✅ src/components/protected-route.tsx - Route protection
```

### Updated Files
```
✅ src/lib/supabase.ts        - Added GitHub OAuth
✅ src/app/layout.tsx         - Added AuthProvider
✅ src/app/dashboard/layout.tsx - Added ProtectedRoute
```

### Documentation
```
✅ SUPABASE_SETUP.md           - Full database setup guide (3,000 words)
✅ AUTH_IMPLEMENTATION.md      - Auth system overview
✅ This file                   - Quick start guide
```

---

## 📊 Architecture Overview

```
User Visits App
    ↓
AuthProvider checks session
    ↓
User authenticated? 
    ├─ YES → Can access /dashboard
    └─ NO → Redirect to /auth/login
           ├─ Sign up with Email/Password
               └─ Creates account in Supabase
               └─ Redirects to login
               └─ Sign in with credentials
                   └─ Session created
                   └─ Redirects to /dashboard
               
           ├─ Sign in with Email/Password
               └─ Validates credentials
               └─ Creates session
               └─ Redirects to /dashboard
               
           └─ Sign in with GitHub
               └─ OAuth redirect to GitHub
               └─ User authorizes app
               └─ Callback to /auth/callback
               └─ Session created
               └─ Redirects to /dashboard
                   ↓
                ProtectedRoute checks auth
                    ↓
                Dashboard loads with user data
```

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] GitHub OAuth Client ID and Secret configured in Supabase
- [ ] Site URL set to `https://sentinel.hackura.app`
- [ ] Redirect URLs configured (all 4 URLs)
- [ ] Email provider enabled in Supabase
- [ ] Database tables created with RLS enabled
- [ ] HTTPS enabled on production domain
- [ ] Environment variables configured on production server
- [ ] Cookies are marked as secure in production

---

## ⚠️ Common Issues & Fixes

### "Cannot find module '@/context/auth-context'"
**Fix**: Make sure all files are created. Run `npm run build` to check.

### "GitHub OAuth redirect URL mismatch"
**Fix**: Check the URL in Supabase exactly matches: `https://drgcuoiytgwbaoxxsasl.supabase.co/auth/v1/callback?provider=github`

### "User already exists"
**Fix**: This is normal. Try logging in instead. Or delete user from Supabase and create new account.

### "Session not persisting after page refresh"
**Fix**: Check browser cookies are enabled. Tokens stored in localStorage.

### "Auth token undefined in API calls"
**Fix**: User needs to be authenticated first. Check ProtectedRoute is working.

---

## 🚀 Deployment Steps

### Local Development
```bash
npm run dev
# Test at http://localhost:3001/auth/login
```

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configure environment variables on Vercel dashboard
# Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Deploy to Other Platforms
- **Docker**: Build with `npm run build`, run `npm start`
- **AWS**: Deploy via Amplify or EC2
- **Google Cloud**: Deploy via Cloud Run
- **Self-hosted**: Same as Docker

---

## 📋 Environment Variables

These are already configured in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://drgcuoiytgwbaoxxsasl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NODE_ENV=production
NEXT_PUBLIC_ENVIRONMENT=production
```

**For production**, update `NEXT_PUBLIC_SUPABASE_URL` if you're using a different Supabase project.

---

## ✅ Success Criteria

After setup, verify:

✓ Can sign up with email/password  
✓ Can sign in with email/password  
✓ Can sign in with GitHub  
✓ Session persists after refresh  
✓ Can't access /dashboard without auth  
✓ Dashboard loads when authenticated  
✓ Logout clears session  
✓ No console errors  
✓ No sensitive data in localStorage  

---

## 📚 Full Documentation

For more details, see:
- **SUPABASE_SETUP.md** - Detailed database setup
- **AUTH_IMPLEMENTATION.md** - Complete architecture
- **BACKEND_INTEGRATION.md** - API integration

---

## 🎯 Next Steps After Auth Setup

1. ✅ Setup authentication (this guide)
2. Configure GitHub OAuth (5 min)
3. Create database tables (10 min)
4. Test locally (5 min)
5. Deploy to production
6. **Then:** Connect backend API (Week 2)

---

## 💬 Quick Reference

### Test Account (for development)
```
Email: test@example.com
Password: password123
```

### Admin Dashboard
Supabase → Authentication → Users (view all accounts)

### Database Tables
Supabase → Table Editor → View tables (user_profiles, scans, etc.)

### Session Check
Browser DevTools → Application → Cookies → sb-* (Supabase token)

---

## ⏱️ Estimated Timeline

- **Setup GitHub OAuth**: 5 minutes
- **Configure Supabase**: 5 minutes  
- **Create Database Tables**: 10 minutes
- **Test Locally**: 5 minutes
- **Deploy to Production**: 5 minutes
- **Total**: ~30 minutes

---

**Status**: Ready to deploy! 🚀  
**Difficulty**: Beginner friendly  
**Support**: See troubleshooting section above
