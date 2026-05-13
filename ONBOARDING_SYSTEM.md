# Onboarding System Documentation

## Overview

This document describes the modern onboarding system for Hackura Sentinel AI. The system is designed to automatically guide first-time users through a streamlined onboarding flow, regardless of the authentication method used.

## Architecture

### Key Features

✅ **Multi-Auth Support**: Works with email/password, Google OAuth, GitHub OAuth, and any future providers
✅ **Automatic First-Time Detection**: Automatically detects first-time users and redirects to onboarding
✅ **Direct Supabase Integration**: Frontend reads/writes directly to Supabase using Row Level Security
✅ **No Backend API Routes**: All onboarding logic runs on the frontend
✅ **Personalized Dashboard**: Shows user's display name in dashboard greeting after onboarding
✅ **Beautiful UI**: Modern cybersecurity SaaS design with glassmorphism and purple accents

### Tech Stack

- **Framework**: Next.js 16.x with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Auth**: Supabase Auth (built-in with multiple providers)
- **Database**: Supabase PostgreSQL with Row Level Security

## Database Schema

### Profiles Table

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text not null,
  username text unique,
  role text,
  discovery_source text,
  interest_reason text,
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### Row Level Security (RLS)

**Enabled**: Yes
**Policies**:
- Users can read their own profile
- Users can insert their own profile (on first signup)
- Users can update their own profile
- Users cannot delete (prevents accidental data loss)

See `supabase/migrations/create_profiles_table.sql` for full migration script.

## Onboarding Flow

### Step 1: Welcome
- Display welcome message
- Show app description
- Single "Continue" button

### Step 2: Display Name
- Required field: Display Name (min 2 chars)
- Optional field: Username (must be unique)
- Form validation on submit

### Step 3: Role Selection
- 10 predefined roles
- User selects one (or skips)
- Roles: Security Researcher, Pentester, SOC Analyst, Developer, Student, IT Administrator, Bug Bounty Hunter, Enterprise Team, Educator, Other

### Step 4: Discovery Source
- Where user heard about Sentinel
- 11 predefined sources
- User selects one (or skips)
- Sources: ChatGPT, Google, GitHub, LinkedIn, Facebook, Instagram, TikTok, YouTube, Friend/Colleague, Conference/Event, Other

### Step 5: Optional Feedback
- Text area for user feedback (max 300 chars)
- Optional field
- Shows character count

### Step 6: Completion
- Animated success screen
- Shows user's display name
- "Enter Dashboard" button
- Saves all data to Supabase
- Marks onboarding as complete
- Redirects to dashboard

## Authentication Flow

### Email + Password Flow

```
1. User visits /auth/login
2. Enters email + password
3. Submits form
4. Frontend calls supabase.auth.signInWithPassword()
5. Session established
6. Redirects to /auth/callback
7. Callback page:
   - Gets session
   - Fetches/creates user profile
   - Checks if onboarding_completed = false
   - If false → redirect to /onboarding
   - If true → redirect to /dashboard
```

### OAuth Flow (GitHub, Google, etc.)

```
1. User clicks "Sign in with [Provider]"
2. Frontend calls supabase.auth.signInWithOAuth()
3. User redirected to OAuth provider
4. User grants permissions
5. OAuth provider redirects to /auth/callback
6. Callback page:
   - Gets session from URL
   - Fetches/creates user profile
   - Checks if onboarding_completed = false
   - If false → redirect to /onboarding
   - If true → redirect to /dashboard
```

### Session Restoration

```
1. User has valid session cookie
2. Visits protected page (/dashboard)
3. AuthProvider loads session from Supabase
4. ProtectedRoute checks auth status
5. useOnboardingRedirect hook:
   - Checks if onboarding is complete
   - If false → redirect to /onboarding
   - If true → stay on page
```

## File Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── callback/page.tsx          # OAuth & email login callback
│   │   ├── login/page.tsx              # Email login form
│   │   └── signup/page.tsx             # Email signup form
│   ├── onboarding/
│   │   └── page.tsx                    # Onboarding page wrapper
│   ├── dashboard/
│   │   ├── layout.tsx                  # Dashboard layout with onboarding check
│   │   └── page.tsx                    # Dashboard home (uses greeting)
│   └── layout.tsx                      # Root layout with AuthProvider
│
├── components/
│   ├── onboarding-flow.tsx             # Main onboarding component (6 steps)
│   ├── dashboard-greeting.tsx          # Personalized dashboard greeting
│   ├── protected-route.tsx             # Route protection wrapper
│   └── ...others...
│
├── context/
│   ├── auth-context.tsx                # Auth state management
│   └── sidebar-context.tsx
│
├── hooks/
│   ├── useOnboardingRedirect.ts        # Onboarding detection hook
│   └── useLiveScanPolling.ts
│
├── lib/
│   ├── onboarding.ts                   # Onboarding helper functions
│   ├── supabase.ts                     # Supabase client
│   ├── api.ts
│   └── ...others...
│
└── types/
    └── index.ts
```

## Component APIs

### useOnboardingRedirect Hook

Detects if user needs onboarding and auto-redirects.

```typescript
const { needsOnboarding, isChecking, userProfile } = useOnboardingRedirect(
  publicRoutes = ['/onboarding', '/auth/callback']
);
```

**Usage**:
```typescript
'use client';

function MyDashboard() {
  const { needsOnboarding } = useOnboardingRedirect();
  
  if (needsOnboarding) {
    return <div>Redirecting to onboarding...</div>;
  }
  
  return <div>Dashboard content</div>;
}
```

### OnboardingFlow Component

Main onboarding UI component with all 6 steps.

```typescript
<OnboardingFlow />
```

**Features**:
- Animated step transitions
- Progress indicator
- Form validation
- Direct Supabase writes
- Auto-redirect on completion

### DashboardGreeting Component

Personalized greeting that fetches user's display name.

```typescript
// Large greeting (for dashboard hero)
<DashboardGreeting className="mb-4" />

// Inline greeting (for sidebar, etc.)
<DashboardGreetingInline className="text-sm" />
```

## Onboarding Helper Functions

Located in `src/lib/onboarding.ts`:

### getUserProfile(userId: string)
Get user's profile from Supabase

### createUserProfile(userId: string, email: string, displayName?: string)
Create a new user profile (called on first auth)

### updateUserProfile(userId: string, updates: Partial<ProfileData>)
Update user profile (called during onboarding steps)

### isOnboardingComplete(userId: string)
Check if onboarding is complete

### completeOnboarding(userId: string)
Mark onboarding as complete

### isUsernameAvailable(username: string)
Check if username is available (for unique constraint)

## Security Considerations

### Row Level Security (RLS)
All profile data is protected by Supabase RLS:
- Users can only read their own profile
- Users can only update their own profile
- Enforced at the database level (not just API)

### Authentication
- Supabase Auth handles all authentication
- Session tokens are secure (httpOnly cookies)
- All Supabase calls use authenticated client

### No Backend Exposure
- No backend API routes for onboarding
- All reads/writes go directly to Supabase
- Frontend uses Supabase's built-in security

## User Flow Diagrams

### First-Time Email Signup

```
[Signup Form] 
    ↓
[Create Account]
    ↓
[Redirect to Login] ← (Email confirmation)
    ↓
[Login Form]
    ↓
[Sign In]
    ↓
[/auth/callback]
    ↓
[Check Profile] ← (New user, no profile yet)
    ↓
[Create Profile] (with onboarding_completed = false)
    ↓
[Redirect to /onboarding]
    ↓
[Onboarding Flow] ← (6 steps)
    ↓
[Complete] (save data, set onboarding_completed = true)
    ↓
[/dashboard] ← (with greeting)
```

### First-Time GitHub OAuth

```
[Login Page]
    ↓
[Click "Sign in with GitHub"]
    ↓
[GitHub OAuth Flow]
    ↓
[User grants permissions]
    ↓
[Redirect to /auth/callback?code=...]
    ↓
[Exchange code for session]
    ↓
[Check Profile] ← (New user, no profile)
    ↓
[Create Profile] (with display_name from GitHub if available)
    ↓
[Redirect to /onboarding]
    ↓
[Onboarding Flow]
    ↓
[/dashboard]
```

### Returning User

```
[Browser with session cookie]
    ↓
[Visit /dashboard]
    ↓
[AuthProvider loads session] ← (httpOnly cookie)
    ↓
[useOnboardingRedirect checks status]
    ↓
[Profile has onboarding_completed = true]
    ↓
[Stay on /dashboard] ← (skip onboarding)
    ↓
[Dashboard with Greeting]
```

## Testing the Onboarding System

### Test Case 1: Email Signup + Onboarding

1. Navigate to `/auth/signup`
2. Enter email and password
3. Click "Create Account"
4. Should redirect to `/auth/login`
5. Log back in with same credentials
6. Should redirect to `/auth/callback`
7. Should redirect to `/onboarding`
8. Complete all 6 steps
9. Should redirect to `/dashboard`
10. Verify dashboard greeting shows your display name

### Test Case 2: GitHub OAuth + Onboarding

1. Navigate to `/auth/login`
2. Click "Sign in with GitHub"
3. Grant permissions
4. Should be redirected back and auto-redirect to `/onboarding`
5. Complete all 6 steps
6. Should redirect to `/dashboard`
7. Verify greeting shows display name (or GitHub username)

### Test Case 3: Session Restoration

1. Complete onboarding as above
2. Navigate away from `/dashboard`
3. Close browser (or wait > 5 minutes)
4. Visit website again
5. Should detect existing session and go directly to `/dashboard`
6. Should NOT redirect to onboarding

### Test Case 4: Incomplete Onboarding

1. Sign up via email
2. Reach `/onboarding`
3. Complete steps 1-3 only
4. Close browser WITHOUT completing onboarding
5. Log back in
6. Should redirect to `/onboarding`
7. Should show all steps available (not remember progress)

### Test Case 5: Direct URL Navigation

1. Complete onboarding
2. Try to visit `/onboarding` directly
3. Should allow access (component renders)
4. Clicking "Continue" should see that onboarding is already complete
5. Or redirect to dashboard (behavior depends on implementation preference)

## Customization

### Changing Onboarding Steps

Edit `src/components/onboarding-flow.tsx`:
- Modify `ROLES` array
- Modify `DISCOVERY_SOURCES` array
- Adjust step titles and subtitles
- Add/remove step content

### Styling

All styling uses TailwindCSS and Framer Motion:
- Dark mode (black/zinc palette)
- Purple accents (`text-purple-500`, `bg-purple-600`)
- Glassmorphism (`backdrop-blur-xl`, `border-purple-500/20`)
- Smooth transitions (Framer Motion)

To customize colors:
1. Edit color values in `onboarding-flow.tsx`
2. Update `tailwind.config.ts` if needed
3. Use same color palette in `dashboard-greeting.tsx`

### Dashboard Greeting Text

Edit `src/components/dashboard-greeting.tsx`:
- Modify `greetings` array for different messages
- Add conditional logic for time-based greetings
- Customize styling and animation

## Troubleshooting

### User stuck on onboarding

**Symptom**: User cannot proceed past a step
**Solution**: 
- Check browser console for errors
- Verify Supabase connection is working
- Check RLS policies are correctly configured
- Ensure user has database access

### Onboarding not showing for first-time user

**Symptom**: User completes login but goes straight to dashboard
**Solution**:
- Check `auth/callback/page.tsx` is working correctly
- Verify profile creation logic is running
- Check Supabase profiles table has the user's record
- Ensure `onboarding_completed` is set to `false`

### Dashboard greeting not showing user name

**Symptom**: Greeting shows "User" instead of display name
**Solution**:
- Verify `getUserProfile` is fetching from correct user ID
- Check Supabase table has correct data
- Verify RLS policies allow read access
- Check network requests in DevTools

### Session not persisting

**Symptom**: User needs to log in every time
**Solution**:
- Verify browser allows cookies (check privacy settings)
- Check Supabase session configuration
- Ensure session timeout is set appropriately
- Check for third-party cookie restrictions

## Environment Setup

### Required Supabase Configuration

1. Create Supabase project
2. Run migration: `supabase/migrations/create_profiles_table.sql`
3. Enable email authentication
4. Configure OAuth providers (GitHub, Google, etc.)
5. Add redirect URLs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Production Deployment

### Pre-deployment Checklist

- [ ] Run migration in production Supabase
- [ ] Configure RLS policies
- [ ] Add production domain to Supabase OAuth redirects
- [ ] Test email authentication in production
- [ ] Test OAuth in production
- [ ] Verify greeting component works with real profiles
- [ ] Test session persistence
- [ ] Monitor for errors in Sentry/similar

### Monitoring

Monitor these metrics:
- Onboarding completion rate
- Time spent on each step
- Step abandonment rate
- Error rates during profile creation
- Session restoration success rate

## Future Enhancements

Potential improvements:
- [ ] Multi-language support for onboarding
- [ ] Onboarding progress persistence (resume mid-flow)
- [ ] A/B testing different onboarding flows
- [ ] Email verification step
- [ ] Team/organization setup during onboarding
- [ ] Profile picture upload
- [ ] Onboarding analytics dashboard
- [ ] Personalized product recommendations based on role
- [ ] Email preferences setup
- [ ] Dark/light mode preference

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review component source code
3. Check browser DevTools Console
4. Check Supabase Dashboard for database issues
5. Test with a fresh user account
