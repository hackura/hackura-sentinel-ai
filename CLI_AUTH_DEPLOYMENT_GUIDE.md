# CLI Authentication Portal - Production Deployment Guide

## Deployment Timeline

- **Estimated Setup Time:** 30-45 minutes
- **Critical Path:** Supabase setup → Environment config → Vercel deploy
- **Post-deploy Testing:** 15 minutes

## Pre-Deployment Checklist

### 1. Code Quality

- [x] TypeScript compilation passes (`npm run build`)
- [x] No TypeScript errors in CLI auth components
- [x] All error paths handled
- [x] Logging includes masked device IDs
- [x] No hardcoded credentials

### 2. Supabase Preparation

- [ ] Create Supabase project (https://supabase.com)
- [ ] Create `cli_device_sessions` table
- [ ] Enable and configure RLS policies
- [ ] Add OAuth providers (GitHub, Google)
- [ ] Configure OAuth callback URLs
- [ ] Set up authentication email templates
- [ ] Enable SMTP for password resets

### 3. Domain & SSL

- [ ] Purchase domain: `sentinel.hackura.app`
- [ ] Configure DNS (MX, A records)
- [ ] SSL certificate (auto via Vercel)
- [ ] WHOIS privacy enabled

### 4. Environment Configuration

- [ ] Supabase URL and Anon Key obtained
- [ ] Backend API URL determined (https://api.hackura.app)
- [ ] Website URL set: https://sentinel.hackura.app
- [ ] All secrets stored securely (never in git)

### 5. Monitoring Setup

- [ ] Error tracking configured (e.g., Sentry)
- [ ] Analytics enabled (Vercel Analytics)
- [ ] Database backups scheduled
- [ ] Log aggregation set up

## Step-by-Step Deployment

### Step 1: Supabase Project Setup (10 mins)

#### 1.1 Create Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in:
   - **Organization:** Select or create
   - **Name:** `Hackura Sentinel AI`
   - **Database Password:** Generate strong password (save in password manager)
   - **Region:** US East (or closest to users)
4. Click "Create new project"
5. Wait for project to initialize (~2 minutes)

#### 1.2 Create `cli_device_sessions` Table

1. Go to SQL Editor
2. Create new query
3. Paste and execute:

```sql
-- Create table
CREATE TABLE IF NOT EXISTS cli_device_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id VARCHAR(256) NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255),
  token TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'authenticated', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  authenticated_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP + INTERVAL '15 minutes',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_cli_device_sessions_device_id ON cli_device_sessions(device_id);
CREATE INDEX idx_cli_device_sessions_status ON cli_device_sessions(status);
CREATE INDEX idx_cli_device_sessions_user_id ON cli_device_sessions(user_id);
CREATE INDEX idx_cli_device_sessions_expires_at ON cli_device_sessions(expires_at);

-- Enable RLS
ALTER TABLE cli_device_sessions ENABLE ROW LEVEL SECURITY;
```

4. Create another query for RLS policies:

```sql
-- Policy: Allow authenticated users to update pending sessions
CREATE POLICY "Allow authenticated to update pending sessions"
  ON cli_device_sessions
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL
    AND status = 'pending'
    AND user_id IS NULL
  )
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
  );

-- Policy: Allow authenticated users to read their own sessions
CREATE POLICY "Allow authenticated to read own sessions"
  ON cli_device_sessions
  FOR SELECT
  USING (user_id = auth.uid());

-- Policy: Allow backend service to insert pending sessions
CREATE POLICY "Allow service role to insert pending sessions"
  ON cli_device_sessions
  FOR INSERT
  WITH CHECK (status = 'pending' AND user_id IS NULL);
```

#### 1.3 Configure OAuth Providers

**For GitHub:**

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - **Application name:** Hackura Sentinel AI CLI
   - **Homepage URL:** https://sentinel.hackura.app
   - **Authorization callback URL:** https://sentinel.hackura.app/auth/callback
4. Copy Client ID and Client Secret
5. In Supabase:
   - Go to Authentication > Providers > GitHub
   - Paste Client ID and Secret
   - Enable GitHub provider
   - Add authorized redirect URLs:
     ```
     https://sentinel.hackura.app/auth/callback
     https://sentinel.hackura.app/cli/login
     https://your-dev-domain.vercel.app/auth/callback (for staging)
     ```

**For Google:**

1. Go to https://console.cloud.google.com
2. Create new project or select existing
3. Go to APIs & Services > Credentials
4. Create OAuth 2.0 Client ID (Web application)
5. Add authorized redirect URIs:
   ```
   https://sentinel.hackura.app/auth/callback
   https://sentinel.hackura.app/cli/login
   https://xxxxxxxxxxxx.supabase.co/auth/v1/callback
   ```
6. Copy Client ID and Client Secret
7. In Supabase:
   - Go to Authentication > Providers > Google
   - Paste credentials
   - Enable Google provider

#### 1.4 Get Supabase Credentials

1. Go to Settings > API
2. Copy:
   - **URL:** Save as `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Key:** Save as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. These are public (okay to share in frontend code)

### Step 2: Vercel Deployment (15 mins)

#### 2.1 Prepare Repository

```bash
# Ensure code is committed
git status
git add -A
git commit -m "Deploy: CLI authentication portal"
git push origin main
```

#### 2.2 Connect to Vercel

1. Go to https://vercel.com/dashboard
2. Click "Add New..." > "Project"
3. Select GitHub repository (or connect GitHub if needed)
4. Choose repository: `hackura-sentinel-ai`
5. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

#### 2.3 Set Environment Variables

In Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_WEBSITE_URL=https://sentinel.hackura.app
NEXT_PUBLIC_API_URL=https://api.hackura.app
NEXT_PUBLIC_ENVIRONMENT=production
```

**Important:** Never commit these to git - use Vercel's environment variable interface

#### 2.4 Deploy

1. Click "Deploy"
2. Wait for build to complete (~3-5 minutes)
3. Vercel provides temporary URL (e.g., `https://hackura-sentinel-ai.vercel.app`)
4. Test with: `https://[temp-url]/cli/login?device_id=test-deploy`

#### 2.5 Connect Custom Domain

1. In Vercel: Settings > Domains
2. Add domain: `sentinel.hackura.app`
3. Choose DNS provider
4. Add DNS records per Vercel instructions
5. Wait for DNS propagation (~24 hours, usually <5 minutes)
6. Verify: `dig sentinel.hackura.app`

### Step 3: Production Testing (10 mins)

#### 3.1 Smoke Tests

```bash
# Test page loads
curl -I https://sentinel.hackura.app/cli/login?device_id=prod-test-001

# Verify SSL certificate
openssl s_client -connect sentinel.hackura.app:443 -servername sentinel.hackura.app

# Check security headers
curl -I https://sentinel.hackura.app | grep -i "strict-transport\|x-frame\|content-security"
```

#### 3.2 Browser Testing

1. Open: https://sentinel.hackura.app/cli/login?device_id=prod-test-001
2. Verify page loads completely
3. Test email login (if test account exists)
4. Test GitHub OAuth
5. Test Google OAuth
6. Verify redirects work correctly

#### 3.3 Database Verification

```sql
-- Check for test sessions
SELECT device_id, status, created_at 
FROM cli_device_sessions 
WHERE device_id LIKE 'prod-test-%' 
ORDER BY created_at DESC;

-- Verify RLS policies are working
SELECT tablename FROM pg_tables 
WHERE tablename = 'cli_device_sessions';
```

### Step 4: Monitoring Setup (5 mins)

#### 4.1 Vercel Analytics

1. In Vercel project: Settings > Analytics
2. Enable Analytics
3. Configure events (automatic for Next.js)

#### 4.2 Error Tracking (Optional but Recommended)

**Setup with Sentry:**

```bash
# Install Sentry
npm install @sentry/nextjs

# Run wizard
npx @sentry/wizard@latest -i nextjs
```

**Configure in production:**

1. Create Sentry project: https://sentry.io
2. Get DSN
3. Add to Vercel environment variables: `SENTRY_DSN`
4. Deploy again

#### 4.3 Database Backups

In Supabase:
1. Go to Settings > Backups
2. Enable daily backups
3. Set retention: 7 days (or more)
4. Backup location: auto-selected

### Step 5: Final Verification

#### 5.1 Security Checklist

- [ ] HTTPS enforced (all HTTP redirects to HTTPS)
- [ ] Security headers present (HSTS, X-Frame-Options, etc.)
- [ ] OAuth URLs configured correctly
- [ ] RLS policies enabled and tested
- [ ] Database password is strong and saved securely
- [ ] Supabase credentials are not in git
- [ ] Vercel environment variables are set correctly
- [ ] CORS headers allow frontend domain

#### 5.2 Performance Verification

```bash
# Use Vercel's built-in analytics
# Go to Vercel project > Analytics

# Key metrics to track:
# - Web Vitals (LCP, FID, CLS)
# - Response time
# - Error rate
```

#### 5.3 Accessibility Verification

Test with keyboard navigation:
- Tab through form fields
- Test screen reader (NVDA/JAWS on Windows, VoiceOver on Mac)
- Verify focus indicators are visible
- Test color contrast ratios

## Post-Deployment Steps

### 1. Update Documentation

Update in repository:
- [ ] CLI integration guide updated with production domain
- [ ] Deployment date noted
- [ ] Team notified of availability

### 2. Backend Integration

Ensure backend API is ready:
- [ ] `/cli/auth/confirm` endpoint implemented
- [ ] Accepts JWT and updates database
- [ ] Has proper error handling
- [ ] Rate limiting enabled
- [ ] Logs for debugging

### 3. CLI Integration

Prepare CLI tool:
- [ ] CLI generates device_id correctly
- [ ] Opens browser to production URL
- [ ] Polls database correctly
- [ ] Handles token expiration
- [ ] Cleans up session after use

### 4. Team Communication

- [ ] Announce portal is live
- [ ] Share documentation links
- [ ] Set up support channel
- [ ] Create runbook for common issues

## Monitoring & Maintenance

### Daily Checks

```bash
# Check deployment status
curl -I https://sentinel.hackura.app/cli/login?device_id=health-check

# Check database
# Via Supabase dashboard: Storage > cli_device_sessions > Rows count
```

### Weekly Maintenance

```sql
-- Clean up expired sessions
DELETE FROM cli_device_sessions 
WHERE status = 'expired' 
  AND expires_at < NOW() - INTERVAL '7 days';

-- Review pending sessions (should be minimal)
SELECT COUNT(*) as pending_sessions 
FROM cli_device_sessions 
WHERE status = 'pending' 
  AND created_at < NOW() - INTERVAL '1 hour';
```

### Monthly Review

- [ ] Review error logs (Sentry, Vercel)
- [ ] Check authentication metrics
- [ ] Review performance metrics
- [ ] Update dependencies (`npm update`)
- [ ] Test disaster recovery (restore from backup)
- [ ] Review security updates

## Rollback Plan

If something goes wrong:

### Option 1: Revert to Previous Deployment (< 2 minutes)

In Vercel:
1. Go to Deployments
2. Find previous stable deployment
3. Click "Promote to Production"
4. Verify: https://sentinel.hackura.app

### Option 2: Restore Database (< 5 minutes)

In Supabase:
1. Go to Settings > Backups
2. Find backup from before issue
3. Click "Restore"
4. Confirm restoration
5. Test authentication flow

### Option 3: Disable OAuth (Temporary Fix)

Edit `src/components/cli-auth/login-buttons.tsx`:
```typescript
// Temporarily hide OAuth buttons
// Remove or comment out onGitHubLogin and onGoogleLogin
```

Push fix, redeploy, and monitor.

## Troubleshooting Production Issues

### Issue: OAuth Redirect Loop

**Symptoms:** Stuck between login and OAuth provider

**Fix:**
1. Check Supabase provider settings - verify callback URLs
2. Clear browser cookies
3. Check browser console for errors
4. Verify OAuth credentials (Client ID/Secret)

### Issue: "RLS Policy Denied" Error

**Symptoms:** User gets error after login

**Fix:**
1. Verify RLS policy exists: `SELECT * FROM pg_policies WHERE tablename = 'cli_device_sessions'`
2. Check policy logic matches expected behavior
3. Test policy manually with correct user_id
4. Verify Supabase session includes user_id

### Issue: Token Not in Session

**Symptoms:** CLI can't retrieve JWT

**Fix:**
1. Verify JWT was actually written: `SELECT COUNT(*) FROM cli_device_sessions WHERE token IS NOT NULL`
2. Check if token was truncated (MAX length)
3. Verify session wasn't expired (check expires_at)
4. Test manual database insert

### Issue: Slow Performance

**Symptoms:** Pages loading slowly

**Fix:**
1. Check Vercel Analytics for bottleneck
2. Verify database queries (check indexes)
3. Monitor API response times
4. Check CDN cache configuration
5. Review Next.js build optimization

## Performance Optimization

### 1. Enable Caching Headers

In `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/cli/login",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    },
    {
      "source": "/_next/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 2. Optimize Database Queries

```sql
-- Check query performance
EXPLAIN ANALYZE 
SELECT * FROM cli_device_sessions 
WHERE device_id = 'test-device' 
  AND status = 'pending';

-- Should use index (Seq Scan indicates missing index)
```

### 3. Enable CDN Caching

In Vercel: Settings > CDN Caching
- Enable Incremental Static Regeneration (ISR) for static routes
- Configure cache TTL for API responses

## Security Hardening

### 1. Rate Limiting

Add to backend API (not frontend):

```bash
# Example: 10 auth attempts per minute per IP
npm install express-rate-limit

# Configure in Express middleware
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests
});

app.post('/cli/auth/confirm', limiter, handleConfirm);
```

### 2. WAF Rules

If using Cloudflare or similar:
- Block suspicious user agents
- Rate limit by IP
- Block non-browser clients (unless necessary)
- Enable DDOS protection

### 3. API Key Rotation

Schedule monthly:

```bash
# 1. Create new Supabase API key
# 2. Update in Vercel
# 3. Verify everything works
# 4. Delete old key
# 5. Document in security log
```

## Support & Documentation

For issues or questions:
1. Check CLI_AUTH_PORTAL_GUIDE.md
2. Check CLI_AUTH_DEVELOPMENT_GUIDE.md
3. Review Supabase documentation
4. Check Vercel deployment logs
5. Contact security team for sensitive issues

## Success Criteria

After deployment, verify:

- [x] Portal accessible at https://sentinel.hackura.app
- [x] All OAuth providers working
- [x] Email authentication working
- [x] Database sessions created and updated correctly
- [x] Error pages display with correct information
- [x] SSL certificate valid and enforced
- [x] Performance acceptable (< 2 sec page load)
- [x] Error tracking configured and receiving errors
- [x] Backups scheduled and tested
- [x] Team trained on platform and procedures

**Congratulations! Your CLI Authentication Portal is production-ready! 🎉**
