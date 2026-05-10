# 📋 DEPLOYMENT CHECKLIST - Print & Use

## 🚀 30-Minute Production Deployment

---

## STEP 1: GitHub OAuth Setup (5 min)

- [ ] Go to GitHub → Settings → Developer settings
- [ ] Click "OAuth Apps" → "New OAuth App"
- [ ] Fill in form:
  - **Application name:** Hackura Sentinel AI
  - **Homepage URL:** https://sentinel.hackura.app
  - **Authorization callback URL:** https://drgcuoiytgwbaoxxsasl.supabase.co/auth/v1/callback?provider=github
- [ ] Click "Register application"
- [ ] **SAVE:** Client ID = `________________`
- [ ] **SAVE:** Client Secret = `________________`

---

## STEP 2: Supabase Configuration (5 min)

### A. Enable GitHub Provider
- [ ] Open Supabase Dashboard
- [ ] Go to Authentication → Providers
- [ ] Find GitHub and click to expand
- [ ] Click toggle to enable ✓
- [ ] Paste Client ID from Step 1
- [ ] Paste Client Secret from Step 1
- [ ] Click "Save"

### B. Configure URLs
- [ ] Go to Authentication → URL Configuration
- [ ] Set Site URL: `https://sentinel.hackura.app`
- [ ] Add Redirect URLs (click "Add URL" 4 times):
  - [ ] `https://sentinel.hackura.app/auth/callback`
  - [ ] `https://sentinel.hackura.app/auth/login`
  - [ ] `https://sentinel.hackura.app/dashboard`
  - [ ] `http://localhost:3001/auth/callback`
- [ ] Click "Save"

---

## STEP 3: Database Tables (10 min)

- [ ] Open Supabase Dashboard → SQL Editor
- [ ] Click "New Query"
- [ ] Copy ALL SQL from `SUPABASE_SETUP.md`
- [ ] Paste into query editor
- [ ] Click "Run" or press Ctrl+Enter
- [ ] Wait for completion ✓
- [ ] Verify no errors

---

## STEP 4: Local Testing (5 min)

```bash
# Terminal 1: Start dev server
cd apps/web
npm run dev

# Terminal 2: Visit in browser
http://localhost:3001/auth/signup
```

**Test Cases:**
- [ ] Signup page loads
- [ ] Can enter email and password
- [ ] Password confirmation works
- [ ] "Create Account" button works
- [ ] Redirected to login after signup
- [ ] Can sign in with credentials
- [ ] Dashboard loads when authenticated
- [ ] Can sign out

---

## STEP 5: Production Build (3 min)

```bash
# In apps/web directory
npm run build
npm start
```

**Check:**
- [ ] Build completes (no errors)
- [ ] "ready - started server on" message
- [ ] Can visit http://localhost:3001/auth/login

---

## STEP 6: Deploy to Production (5 min)

### Option A: Vercel (Recommended)
```bash
# Install Vercel CLI if not already
npm i -g vercel

# Deploy
vercel

# Set environment variables on Vercel dashboard:
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```
- [ ] Deployment successful
- [ ] Visit your-domain/auth/login
- [ ] Pages load

### Option B: Docker / Self-Hosted
```bash
docker build -t hackura-sentinel .
docker run -p 3000:3000 hackura-sentinel
```
- [ ] Container builds successfully
- [ ] Service running on port 3000
- [ ] Can access /auth/login

---

## STEP 7: Production Verification (3 min)

- [ ] Visit `https://sentinel.hackura.app/auth/login`
- [ ] Page loads (no errors)
- [ ] Email field visible
- [ ] Password field visible
- [ ] "Sign In" button visible
- [ ] Google button visible
- [ ] GitHub button visible
- [ ] "Sign up" link visible

**Test Signup:**
- [ ] Visit `https://sentinel.hackura.app/auth/signup`
- [ ] Create test account
- [ ] Redirected to login
- [ ] Sign in with credentials
- [ ] Dashboard loads ✓

**Test GitHub OAuth:**
- [ ] Click "Sign in with GitHub"
- [ ] Authorizes on GitHub
- [ ] Redirected to dashboard ✓

---

## ✅ SUCCESS INDICATORS

When you see these, you're ready:

- ✅ Login page loads at production URL
- ✅ Can create account with email/password
- ✅ Can sign in with credentials
- ✅ Dashboard accessible after login
- ✅ GitHub OAuth redirects work
- ✅ No console errors
- ✅ No broken links
- ✅ Forms validate properly

---

## ⏱️ TIMELINE TRACKING

| Step | Task | Time | Status |
|------|------|------|--------|
| 1 | GitHub OAuth | 5 min | □ |
| 2 | Supabase Config | 5 min | □ |
| 3 | Database Tables | 10 min | □ |
| 4 | Local Testing | 5 min | □ |
| 5 | Production Build | 3 min | □ |
| 6 | Deploy | 5 min | □ |
| 7 | Verification | 3 min | □ |
| | **TOTAL** | **36 min** | |

---

## 🆘 QUICK TROUBLESHOOTING

### "Can't signup"
- [ ] Check Supabase email provider is enabled
- [ ] Check internet connection
- [ ] Check NEXT_PUBLIC_SUPABASE_URL is correct

### "GitHub OAuth not working"
- [ ] Verify redirect URL in Supabase matches GitHub app
- [ ] Check Client ID & Secret are correct
- [ ] Check GitHub provider is enabled in Supabase

### "Dashboard won't load"
- [ ] Check you're signed in
- [ ] Check cookies are enabled
- [ ] Try signing out and back in

### "Build failed"
- [ ] Check Node.js version (14+)
- [ ] Run `npm install` again
- [ ] Check for TypeScript errors: `npx tsc --noEmit`

---

## 📞 SUPPORT

**Need help?**
- Check `AUTH_QUICKSTART.md` for detailed instructions
- Check `SUPABASE_SETUP.md` for database help
- Check `AUTH_IMPLEMENTATION.md` for architecture questions

---

## 🎯 SAVE THIS CHECKLIST

Bookmark or print this checklist. You'll need it for:
- Deployment day
- Team onboarding
- Future reference

---

**Ready to deploy? Good luck! 🚀**

**Total time to production: 30-45 minutes**
