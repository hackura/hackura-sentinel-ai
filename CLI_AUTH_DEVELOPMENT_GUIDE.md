# CLI Authentication Portal - Development & Testing Guide

## Quick Start

### 1. Local Development Setup

```bash
# Navigate to project
cd /home/karl/hackura-sentinel-ai

# Install dependencies (if needed)
npm install

# Set up environment variables (see .env.example or below)
# Create .env.local with Supabase credentials

# Start dev server
npm run dev

# Open browser to test the portal
# http://localhost:3000/cli/login?device_id=test-device-abc123
```

### 2. Environment Configuration

Create `.env.local` in project root:

```bash
# Supabase - Get these from https://app.supabase.com
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Frontend URL (for OAuth redirects and links)
NEXT_PUBLIC_WEBSITE_URL=http://localhost:3000

# Backend API endpoint (for fallback confirmation)
NEXT_PUBLIC_API_URL=https://api.hackura.app

# Optional: Environment indicator
NEXT_PUBLIC_ENVIRONMENT=development
```

### 3. Supabase Setup

#### Create Tables

```sql
-- Create cli_device_sessions table
CREATE TABLE IF NOT EXISTS cli_device_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id VARCHAR(256) NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id),
  email VARCHAR(255),
  token TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  authenticated_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP + INTERVAL '15 minutes',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_cli_device_sessions_device_id ON cli_device_sessions(device_id);
CREATE INDEX idx_cli_device_sessions_status ON cli_device_sessions(status);
CREATE INDEX idx_cli_device_sessions_user_id ON cli_device_sessions(user_id);
```

#### Enable RLS (Row Level Security)

```sql
-- Enable RLS
ALTER TABLE cli_device_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated to update pending sessions" ON cli_device_sessions;

-- Create RLS policy
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

-- Allow anyone to read (for polling from CLI)
CREATE POLICY "Allow authenticated to read own sessions"
  ON cli_device_sessions
  FOR SELECT
  USING (
    user_id = auth.uid() OR (
      user_id IS NULL AND auth.uid() IS NULL
    )
  );

-- Allow unauthenticated inserts (CLI creates the session)
-- This assumes the CLI backend creates pending sessions
CREATE POLICY "Allow backend to insert sessions"
  ON cli_device_sessions
  FOR INSERT
  WITH CHECK (status = 'pending' AND user_id IS NULL);
```

#### Configure OAuth Providers

In Supabase Console (Authentication > Providers):

1. **GitHub**
   - Get Client ID & Secret from: https://github.com/settings/developers
   - Add to Supabase settings
   - Authorized redirect URLs:
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/cli/login`
     - `https://sentinel.hackura.app/auth/callback`
     - `https://sentinel.hackura.app/cli/login`

2. **Google**
   - Get Client ID & Secret from: https://console.cloud.google.com
   - Add to Supabase settings
   - Authorized redirect URLs:
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/cli/login`
     - `https://sentinel.hackura.app/auth/callback`
     - `https://sentinel.hackura.app/cli/login`

## Testing Scenarios

### Scenario 1: Email Login Flow

```bash
# 1. Start dev server
npm run dev

# 2. Open browser
open "http://localhost:3000/cli/login?device_id=test-email-001"

# 3. Fill in test credentials:
# Email: test@example.com (must exist in Supabase)
# Password: [user's password]

# 4. Click "Continue with Email"

# Expected: Redirects to /cli/success page
# Verify: cli_device_sessions table shows status='authenticated'
```

### Scenario 2: GitHub OAuth Flow

```bash
# 1. Navigate to login page
open "http://localhost:3000/cli/login?device_id=test-github-001"

# 2. Click "Continue with GitHub" button

# 3. You'll be redirected to GitHub login
# Login with your test GitHub account

# 4. Authorize the application

# Expected: Redirected back to /cli/login?device_id=test-github-001
# The useEffect should detect the session and auto-confirm
# Then redirect to /cli/success

# Verify: cli_device_sessions table shows:
# - device_id: test-github-001
# - status: authenticated
# - user_id: [your user id]
# - token: [jwt token]
```

### Scenario 3: Google OAuth Flow

```bash
# 1. Navigate to login page
open "http://localhost:3000/cli/login?device_id=test-google-001"

# 2. Click "Continue with Google" button

# 3. Complete Google login in popup

# 4. Automatically redirected back

# Expected: Same as GitHub flow
# Verify: cli_device_sessions shows authenticated status with token
```

### Scenario 4: Invalid Device ID

```bash
# 1. Try with empty device_id
open "http://localhost:3000/cli/login"

# Expected: Redirects to /cli/error?reason=invalid-device

# 2. Try with invalid characters
open "http://localhost:3000/cli/login?device_id=invalid@device!"

# Expected: Same redirect to error page
```

### Scenario 5: Session Already Authenticated

```bash
# 1. Log in via email or OAuth first
# Let the browser maintain the session

# 2. Open a new tab and navigate to:
open "http://localhost:3000/cli/login?device_id=test-already-auth"

# Expected: Immediately shows confirmation page
# useEffect detects existing session and confirms authorization
# Redirects to /cli/success within 2-3 seconds
```

## Database Queries for Testing

### View Pending Sessions

```sql
SELECT device_id, status, created_at FROM cli_device_sessions 
WHERE status = 'pending' 
ORDER BY created_at DESC 
LIMIT 10;
```

### View Authenticated Sessions

```sql
SELECT device_id, user_id, email, status, authenticated_at, token 
FROM cli_device_sessions 
WHERE status = 'authenticated' 
ORDER BY authenticated_at DESC 
LIMIT 10;
```

### View Session for Specific Device

```sql
SELECT * FROM cli_device_sessions 
WHERE device_id = 'test-device-001';
```

### Clean Up Test Sessions

```sql
DELETE FROM cli_device_sessions 
WHERE device_id LIKE 'test-%' 
  AND created_at < NOW() - INTERVAL '1 day';
```

### Verify JWT in Session (Advanced)

```sql
SELECT 
  device_id,
  status,
  user_id,
  LENGTH(token) as token_length,
  authenticated_at
FROM cli_device_sessions 
WHERE token IS NOT NULL 
ORDER BY authenticated_at DESC 
LIMIT 5;

-- Decode token manually in JWT debugger:
-- 1. Copy the token value
-- 2. Go to jwt.io
-- 3. Paste in "Encoded" section
-- 4. Verify sub (user_id) matches user_id column
```

## Browser DevTools Testing

### 1. Check Supabase Session

In browser console:

```javascript
// Import and check
import { supabase } from '@/lib/supabase'
const { data: { session } } = await supabase.auth.getSession()
console.log('Session:', session)
console.log('JWT:', session?.access_token)
```

### 2. Monitor Network Requests

Open DevTools > Network tab and look for:
- `POST /auth/v1/token` - OAuth token exchange
- `POST /rest/v1/cli_device_sessions` - RLS policy test
- `PATCH /rest/v1/cli_device_sessions` - Session update

### 3. Check Local Storage

DevTools > Application > Storage > Local Storage
- Look for keys starting with `sb-` (Supabase session)

### 4. Check Cookies

DevTools > Application > Cookies
- Look for `sb-*` HTTP-only cookies

## CLI Integration Testing

### Simulate CLI Device Polling

```javascript
// Run this in browser console on /cli/success page

const supabaseUrl = 'https://xxxxxxxxxxxx.supabase.co'
const anonKey = 'your-anon-key'
const deviceId = 'test-device-001' // Use a device from /cli/login

// Create Supabase client
const { createClient } = window.supabase
const supabase = createClient(supabaseUrl, anonKey)

// Poll for token (like CLI would do)
for (let i = 0; i < 10; i++) {
  const { data, error } = await supabase
    .from('cli_device_sessions')
    .select('token, status')
    .eq('device_id', deviceId)
    .single()

  console.log(`Poll ${i + 1}:`, data, error)
  
  if (data?.token) {
    console.log('✅ Got token:', data.token.slice(0, 20) + '...')
    break
  }

  // Wait 3 seconds before retry
  await new Promise(r => setTimeout(r, 3000))
}
```

## Error Scenario Testing

### 1. Test RLS Policy Failure (Simulating Fallback)

```bash
# 1. Temporarily disable RLS policy:
# In Supabase: Authentication > Policies (disable the update policy)

# 2. Try to authenticate through the portal
# Expected: 
# - Supabase direct update fails
# - Fallback to backend API is attempted
# - Check console logs for both attempts

# 3. Re-enable the RLS policy after testing
```

### 2. Test Missing Token

```sql
-- Simulate missing token scenario
UPDATE cli_device_sessions 
SET token = NULL 
WHERE device_id = 'test-device-001';

-- Then try to authenticate and check error handling
```

### 3. Test Expired Session

```sql
-- Mark session as expired
UPDATE cli_device_sessions 
SET status = 'expired' 
WHERE device_id = 'test-device-001';

-- Then try to access it
```

## Performance Testing

### 1. Measure Login Flow Time

```javascript
// In browser console on /cli/login page
const start = performance.now()

// Perform login
// ...

const end = performance.now()
console.log(`Login flow took: ${(end - start) / 1000} seconds`)
```

### 2. Check Network Waterfall

DevTools > Network > slow 3G or 4G (throttle)
- Observe page load time
- Check how many requests are parallel
- Verify critical path performance

### 3. Monitor Memory Usage

DevTools > Memory > Heap snapshot
- Before login: X MB
- After login: Y MB
- Check for memory leaks

## Debugging Tips

### 1. Enable Verbose Logging

Edit `src/lib/cli-auth.ts` and `src/components/cli-auth/cli-login-page.tsx`:
- Look for `console.log` statements with `[CLI Auth]` prefix
- Check browser console for detailed flow information

### 2. Check Supabase Logs

In Supabase Console:
- Go to Logs > API (for REST API calls)
- Go to Logs > Auth (for authentication events)
- Look for errors related to RLS policies or auth

### 3. Verify Device ID Format

```javascript
// Test device ID validation in console
const isValidDeviceId = (deviceId) => 
  /^[A-Za-z0-9._:-]{8,256}$/.test(deviceId)

console.log(isValidDeviceId('test-device-001'))        // true
console.log(isValidDeviceId('valid.device:123'))       // true
console.log(isValidDeviceId('invalid@device'))         // false
console.log(isValidDeviceId('short'))                  // false
```

## Production Deployment Testing

### Pre-Production Checklist

- [ ] Environment variables set in production
- [ ] Supabase OAuth URLs include production domain
- [ ] HTTPS enforced (Vercel auto-enables)
- [ ] Database tables and RLS policies deployed
- [ ] Backend API `/cli/auth/confirm` endpoint working
- [ ] CDN caching configured (if applicable)
- [ ] Error tracking (Sentry) configured
- [ ] Rate limiting enabled on API
- [ ] Database backups scheduled

### Smoke Tests (Run After Deploy)

```bash
# 1. Test page loads
curl -I https://sentinel.hackura.app/cli/login?device_id=smoke-test

# 2. Test with valid device ID
curl -I "https://sentinel.hackura.app/cli/login?device_id=a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4"

# 3. Test error page
curl -I "https://sentinel.hackura.app/cli/error?reason=invalid-device"

# 4. Check SSL certificate
openssl s_client -connect sentinel.hackura.app:443
```

### End-to-End Test (Manual)

1. Open https://sentinel.hackura.app/cli/login?device_id=e2e-test-001
2. Complete full login (email, GitHub, or Google)
3. Verify redirected to success page
4. Check database for authenticated session with token
5. Verify CLI could retrieve token from database

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Blank page loads | Environment vars missing | Check `.env.local` and `.env.production` |
| "No session found" error | Supabase not initialized | Verify NEXT_PUBLIC_SUPABASE_URL and ANON_KEY |
| OAuth redirect loop | Callback URL not in Supabase settings | Add all OAuth URLs to Supabase provider settings |
| "RLS policy denied" | Policy not created or wrong | Re-create RLS policy for `cli_device_sessions` |
| Device ID always invalid | Wrong regex or format | Use 32-char hex or alphanumeric with allowed chars |
| Token not in session | Session not persisted | Check Supabase cookies in browser |
| Success page appears briefly then disappears | Auto-close timer (8 sec) | Expected behavior - test CLI token retrieval |
| Slow performance | Network throttling or API latency | Test with DevTools throttling disabled |

## Testing Tools & Resources

### Useful Links
- **Supabase Dashboard:** https://app.supabase.com
- **JWT Debugger:** https://jwt.io
- **OAuth Test:** https://oauthplayground.com
- **HTTPS Certificate Checker:** https://www.sslshopper.com/ssl-checker.html
- **Performance Testing:** https://web.dev/measure/

### Testing Framework (Future)

```bash
# When ready, add testing framework
npm install --save-dev vitest @testing-library/react

# Create test file
# tests/cli-auth.test.ts
# - Test device ID validation
# - Test error message generation
# - Test OAuth redirect URL building
```

## Support & Escalation

If you encounter issues:
1. Check browser console for errors (F12)
2. Check Supabase logs for API errors
3. Verify environment variables match configuration
4. Test in incognito/private mode (clear cookies)
5. Check network requests in DevTools
6. Compare with production vs. development config
7. Review logs in `/memories/session/` for context
