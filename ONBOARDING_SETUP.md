# Onboarding System - Setup & Deployment Guide

## Quick Start Checklist

### 1. Database Setup

Run the migration to create the profiles table:

```bash
# Option A: Using Supabase CLI
supabase migration up

# Option B: Using Supabase Dashboard
1. Go to SQL Editor
2. Copy contents of supabase/migrations/create_profiles_table.sql
3. Paste and run the SQL
```

### 2. Verify Supabase Configuration

#### Enable Email Authentication
1. Go to Supabase Dashboard → Authentication
2. Ensure "Email" provider is enabled
3. Configure email templates (optional)

#### Configure OAuth Providers

**GitHub:**
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL to: `https://yourdomain.com/auth/callback`
4. Copy Client ID and Client Secret
5. Go to Supabase → Authentication → Providers → GitHub
6. Enable and paste credentials

**Google:**
1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials (Web application)
3. Add redirect URIs:
   - `https://yourdomain.com/auth/callback`
4. Copy Client ID and Client Secret
5. Go to Supabase → Authentication → Providers → Google
6. Enable and paste credentials

#### Add Redirect URLs

In Supabase Dashboard → Authentication → URL Configuration:

Add these URLs under "Redirect URLs":
- `http://localhost:3000/auth/callback` (development)
- `https://yourdomain.com/auth/callback` (production)

### 3. Environment Variables

Set these in your `.env.local` (development) or deployment environment:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from Supabase Dashboard → Project Settings → API

### 4. Test Locally

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev

# Visit http://localhost:3000
```

#### Test Email Signup
1. Go to http://localhost:3000/auth/signup
2. Enter email and password
3. Submit
4. Go to http://localhost:3000/auth/login
5. Log in with same credentials
6. Should redirect to /onboarding
7. Complete onboarding
8. Should redirect to /dashboard with greeting

#### Test OAuth
1. Go to http://localhost:3000/auth/login
2. Click "Sign in with GitHub"
3. Complete GitHub OAuth flow
4. Should redirect to /onboarding
5. Complete onboarding
6. Should redirect to /dashboard

### 5. Deploy to Vercel

1. Push code to GitHub
2. Connect repo to Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### 6. Post-Deployment Verification

1. Visit deployed site
2. Test email signup/login
3. Test OAuth login
4. Verify onboarding works
5. Verify dashboard greeting shows user name
6. Check Supabase for created profiles

## Common Issues & Fixes

### Issue: "Redirect URI mismatch"

**Error**: When clicking OAuth button, you get "Redirect URI mismatch" error

**Fix**:
1. Get your exact domain with protocol: `https://yourdomain.com` or `http://localhost:3000`
2. Go to Supabase → Authentication → URL Configuration
3. Add `/auth/callback` to "Redirect URLs"
4. Make sure it exactly matches your domain
5. Also update OAuth provider settings (GitHub, Google, etc.)

### Issue: "Profile table not found"

**Error**: "relation 'public.profiles' does not exist"

**Fix**:
1. Verify migration ran successfully
2. In Supabase Dashboard → SQL Editor → run:
   ```sql
   select * from public.profiles limit 1;
   ```
3. If still not found, re-run migration:
   ```sql
   -- Copy entire migration from create_profiles_table.sql
   ```

### Issue: "Permission denied" when saving profile

**Error**: "new row violates row-level security policy"

**Fix**:
1. Verify RLS policies are set (Supabase → Tables → profiles)
2. Should see 4 policies:
   - "Users can read their own profile"
   - "Users can insert their own profile"
   - "Users can update their own profile"
   - (no delete policy)
3. If missing, run migration again

### Issue: Users skip onboarding and go straight to dashboard

**Error**: First-time users not redirected to /onboarding

**Fix**:
1. Check browser console for errors
2. Verify `/auth/callback` page is loading
3. Check Supabase connection works
4. Verify profiles table has user record with `onboarding_completed = false`
5. Check useOnboardingRedirect hook logic

### Issue: Dashboard greeting shows "User" instead of name

**Error**: DashboardGreeting shows generic name

**Fix**:
1. Check that `display_name` is saved in profiles table
2. Verify RLS allows read access to user's own profile
3. Check browser Network tab to see if profile fetch succeeds
4. Clear cache and refresh

## Performance Optimization

### Database Indexes

Already included in migration:
- `idx_profiles_username` - For username uniqueness checks
- `idx_profiles_onboarding_completed` - For onboarding status queries

### Caching Strategy

Consider adding caching for:
- User profile (cache for 5-10 minutes)
- Onboarding status (cache for 1 minute)

Example with React Query (optional enhancement):

```typescript
const { data: profile } = useQuery({
  queryKey: ['profile', userId],
  queryFn: () => getUserProfile(userId),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### Bundle Size

Current components use:
- Framer Motion (already in dependencies)
- TailwindCSS (already in dependencies)
- No additional libraries needed

## Monitoring & Analytics

### Key Metrics to Track

1. **Onboarding Completion Rate**
   ```
   (Users with onboarding_completed = true) / (Total users) * 100
   ```

2. **Onboarding Drop-off Rate**
   - Track which steps users abandon most

3. **Time to Complete**
   - Monitor average time from signup to completion

4. **Error Rate**
   - Monitor profile save failures
   - Monitor RLS policy errors

### SQL Queries for Analytics

```sql
-- Total users who completed onboarding
select count(*) from public.profiles where onboarding_completed = true;

-- Users by role
select role, count(*) from public.profiles group by role;

-- Users by discovery source
select discovery_source, count(*) from public.profiles group by discovery_source;

-- Users without onboarding completed (potential support issue)
select email from public.profiles where onboarding_completed = false;

-- Recent signups
select email, created_at from public.profiles order by created_at desc limit 20;
```

## Scaling Considerations

### Current Limitations

- None! The system is designed to scale
- Supabase handles high-traffic auth
- RLS policies are efficient
- No expensive queries

### When to Optimize

- If you have millions of users:
  - Add caching layer (Redis)
  - Consider denormalizing frequently accessed data
  - Add materialized views for analytics

## Backup & Recovery

### Before Deploying to Production

```bash
# Backup Supabase data
supabase db pull --schema-only

# Creates local migration file for safety
```

### Restore from Backup

```bash
# If something goes wrong
supabase db reset

# Re-run migrations
supabase migration up
```

## Security Checklist

- [ ] RLS policies are enabled on profiles table
- [ ] OAuth redirect URLs are exact (https, no trailing slash)
- [ ] Email authentication is configured
- [ ] Environment variables are set in production
- [ ] No sensitive data is logged
- [ ] Session timeout is appropriate (24 hours default)
- [ ] Supabase project has strong password
- [ ] 2FA is enabled on Supabase account

## Next Steps

1. **Run migration** - Set up database
2. **Configure auth** - Enable email and OAuth providers
3. **Test locally** - Verify all flows work
4. **Deploy** - Push to production
5. **Monitor** - Track completion rates and errors
6. **Iterate** - Gather user feedback and improve

## Support

If you encounter issues:

1. **Check Supabase Status** - https://status.supabase.com
2. **Review Docs** - See ONBOARDING_SYSTEM.md for full docs
3. **Check Logs** - Supabase Dashboard → Logs
4. **Browser Console** - Check for JavaScript errors
5. **Network Tab** - Check API calls are succeeding

## File Reference

- `/supabase/migrations/create_profiles_table.sql` - Database migration
- `src/lib/onboarding.ts` - Helper functions
- `src/hooks/useOnboardingRedirect.ts` - Onboarding detection hook
- `src/components/onboarding-flow.tsx` - UI component
- `src/app/onboarding/page.tsx` - Onboarding page
- `src/app/auth/callback/page.tsx` - Auth callback handler
- `src/components/dashboard-greeting.tsx` - Dashboard personalization
- `ONBOARDING_SYSTEM.md` - Full documentation
