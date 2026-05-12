# 🛡️ Supabase Authentication Setup Guide

## Overview

This guide walks you through setting up Supabase for **Hackura Sentinel AI** with:
- Email/Password authentication
- GitHub OAuth login/signup
- User profiles and scan history storage

---

## 📋 Prerequisites

- Supabase project already created
- Access to Supabase dashboard at https://app.supabase.com
- GitHub OAuth app created (for GitHub sign-in)

**Current Configuration:**
```
Project URL: https://drgcuoiytgwbaoxxsasl.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔄 Step 1: Reset Existing Database (Optional)

If you want to start fresh and remove all existing tables:

### Option A: Via Supabase Dashboard

1. Go to **SQL Editor** → **Quickstarts**
2. Select **Reset** to delete all custom tables (keeps auth tables)

### Option B: Via SQL Commands

Run these SQL commands in **SQL Editor**:

```sql
-- Drop all existing tables (CAUTION: This is permanent)
DROP TABLE IF EXISTS scans CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS threat_nodes CASCADE;
DROP TABLE IF EXISTS threat_relationships CASCADE;
DROP TABLE IF EXISTS api_logs CASCADE;

-- Verify tables are deleted
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

---

## ✅ Step 2: Create Required Tables

Run these SQL commands in Supabase **SQL Editor** to create the database schema:

### User Profiles Table

```sql
-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  company TEXT,
  role TEXT DEFAULT 'analyst',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);
```

### Scans Table

```sql
-- Create scans table for storing threat scan results
CREATE TABLE IF NOT EXISTS scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  input TEXT NOT NULL,
  input_type TEXT NOT NULL CHECK (input_type IN ('url', 'domain', 'text')),
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_level TEXT CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
  ai_explanation TEXT,
  risk_signals TEXT[] DEFAULT ARRAY[]::TEXT[],
  recommendations TEXT[] DEFAULT ARRAY[]::TEXT[],
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

-- Users can read their own scans
CREATE POLICY "Users can read own scans" ON scans
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create scans
CREATE POLICY "Users can create scans" ON scans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_scans_user_id ON scans(user_id);
CREATE INDEX idx_scans_created_at ON scans(created_at DESC);
CREATE INDEX idx_scans_risk_level ON scans(risk_level);
```

### Threat Nodes Table (Optional)

```sql
-- Create threat_nodes table for graph data
CREATE TABLE IF NOT EXISTS threat_nodes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  node_type TEXT NOT NULL CHECK (node_type IN ('domain', 'ip', 'email', 'campaign')),
  risk_level TEXT CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE threat_nodes ENABLE ROW LEVEL SECURITY;

-- Users can read their own threat nodes
CREATE POLICY "Users can read own threat nodes" ON threat_nodes
  FOR SELECT USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_threat_nodes_user_id ON threat_nodes(user_id);
CREATE INDEX idx_threat_nodes_type ON threat_nodes(node_type);
```

### Threat Relationships Table (Optional)

```sql
-- Create threat_relationships table for graph connections
CREATE TABLE IF NOT EXISTS threat_relationships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_node_id UUID NOT NULL REFERENCES threat_nodes(id) ON DELETE CASCADE,
  target_node_id UUID NOT NULL REFERENCES threat_nodes(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL,
  weight NUMERIC DEFAULT 1.0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE threat_relationships ENABLE ROW LEVEL SECURITY;

-- Users can read their own threat relationships
CREATE POLICY "Users can read own threat relationships" ON threat_relationships
  FOR SELECT USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_threat_relationships_user_id ON threat_relationships(user_id);
CREATE INDEX idx_threat_relationships_source ON threat_relationships(source_node_id);
CREATE INDEX idx_threat_relationships_target ON threat_relationships(target_node_id);
```

---

## 🔐 Step 3: Configure Authentication Methods

### Email/Password Authentication

1. Go to **Authentication** → **Providers**
2. Find **Email** provider - should be enabled by default
3. Click settings ⚙️:
   - Enable "Email confirmed"
   - Email validation: Choose your preference
   - Confirm signup: Enabled by default

### GitHub OAuth Configuration

#### 1. Create GitHub OAuth App

- Go to GitHub → Settings → Developer settings → OAuth Apps
- Click "New OAuth App"
- Fill in:
  - **Application name**: Hackura Sentinel AI
  - **Homepage URL**: https://sentinel.hackura.app
  - **Authorization callback URL**: `https://drgcuoiytgwbaoxxsasl.supabase.co/auth/v1/callback?provider=github`
- Click "Register application"
- Copy **Client ID** and **Client Secret**

#### 2. Add to Supabase

1. Go to **Authentication** → **Providers**
2. Find **GitHub** and enable it
3. Paste:
   - **Client ID** from GitHub OAuth App
   - **Client Secret** from GitHub OAuth App
4. Click "Save"

### Google OAuth Configuration (Optional)

If you want to add Google OAuth later:

1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable "Google+ API"
4. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized redirect URIs: `https://drgcuoiytgwbaoxxsasl.supabase.co/auth/v1/callback?provider=google`
5. Copy Client ID and Client Secret
6. In Supabase → Authentication → Providers → Google → Enable and paste credentials

---

## 🔗 Step 4: Configure Redirect URLs

These tell Supabase where to send users after authentication.

### In Supabase Dashboard:

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**: `https://sentinel.hackura.app`
3. Add **Redirect URLs**:
   ```
   https://sentinel.hackura.app/auth/callback
   https://sentinel.hackura.app/auth/login
   https://sentinel.hackura.app/dashboard
   http://localhost:3000/auth/callback
   http://localhost:3001/auth/callback
   ```

---

## 🧪 Step 5: Test Authentication Locally

### Start Development Server

```bash
cd apps/web
npm run dev
```

### Test Email/Password Signup

1. Visit http://localhost:3001/auth/signup
2. Enter email and password
3. Click "Create Account"
4. You should be redirected to login
5. Sign in with the same email/password
6. You should be redirected to dashboard

### Test GitHub Login

1. Visit http://localhost:3001/auth/login
2. Click "Sign in with GitHub"
3. Authorize the application on GitHub
4. Should redirect to dashboard with authentication

### Troubleshooting

**Error: "Invalid OAuth client"**
- Verify GitHub Client ID and Secret are correct
- Check redirect URL matches exactly

**Error: "Redirect URL mismatch"**
- Make sure URL Configuration in Supabase matches your domain
- For localhost, use `http://localhost:3001`

**Session not persisting**
- Clear browser cookies
- Check browser console for errors
- Verify auth tokens are being stored

---

## 📊 Verify Setup

### Check Tables Created

Run in **SQL Editor**:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected output:
```
user_profiles
scans
threat_nodes
threat_relationships
```

### Check RLS Policies

```sql
SELECT table_name, policy_name, action 
FROM pg_policies 
ORDER BY table_name, policy_name;
```

### Check Auth Users

Go to **Authentication** → **Users** to see created accounts

---

## 🔑 API Integration

### Store User Profile After Signup

In your API backend, create a profile when user signs up:

```python
@app.post("/auth/callback")
async def auth_callback(user_id: str, email: str):
    # Create user profile in Supabase
    response = supabase.table("user_profiles").insert({
        "id": user_id,
        "email": email,
        "created_at": datetime.now().isoformat()
    }).execute()
    return response
```

### Store Scan Results

```python
@app.post("/scan")
async def scan_threat(input: str, user_id: str):
    result = perform_scan(input)
    
    # Store in database
    scan_record = supabase.table("scans").insert({
        "user_id": user_id,
        "input": input,
        "input_type": detect_type(input),
        "risk_score": result["risk_score"],
        "risk_level": result["risk_level"],
        "ai_explanation": result["explanation"],
        "risk_signals": result["signals"]
    }).execute()
    
    return scan_record
```

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Email provider configured and tested
- [ ] GitHub OAuth configured with correct Client ID/Secret
- [ ] Site URL set to production domain (sentinel.hackura.app)
- [ ] Redirect URLs updated for production
- [ ] RLS policies created and tested
- [ ] Database tables verified
- [ ] Backups configured
- [ ] Monitoring enabled

---

## 📝 SQL Commands Reference

### Reset All Data (Keep Tables)

```sql
TRUNCATE TABLE scans CASCADE;
TRUNCATE TABLE user_profiles CASCADE;
TRUNCATE TABLE threat_nodes CASCADE;
TRUNCATE TABLE threat_relationships CASCADE;
```

### Delete All Tables

```sql
DROP TABLE IF EXISTS threat_relationships CASCADE;
DROP TABLE IF EXISTS threat_nodes CASCADE;
DROP TABLE IF EXISTS scans CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
```

### View Table Structure

```sql
\d+ table_name
```

### Check User Roles

```sql
SELECT id, email, created_at FROM auth.users;
```

---

## 🔒 Security Best Practices

1. **Row Level Security (RLS)**
   - All tables have RLS enabled
   - Users can only access their own data
   - Policies are automatically enforced

2. **Secure Passwords**
   - Minimum 6 characters required on frontend
   - Supabase enforces password policies
   - Never store passwords in logs

3. **OAuth Security**
   - Use HTTPS only in production
   - GitHub OAuth tokens are securely stored
   - Redirect URLs whitelist is enforced

4. **Database Backups**
   - Enable automatic backups in Supabase
   - Test restore procedures
   - Keep sensitive data encrypted

---

## 📞 Troubleshooting

### Issue: "User already exists"
**Solution**: In SQL Editor, delete the user from `auth.users` and try again

### Issue: "RLS policy blocks query"
**Solution**: Check RLS policies - ensure user_id matches `auth.uid()`

### Issue: GitHub login not working
**Solution**: Verify callback URL format: `https://drgcuoiytgwbaoxxsasl.supabase.co/auth/v1/callback?provider=github`

### Issue: Session expires after refresh
**Solution**: Check that browser cookies are enabled and not cleared on close

---

## ✅ Success Criteria

After completing this setup:

✓ Users can sign up with email/password  
✓ Users can sign in with email/password  
✓ Users can sign in with GitHub  
✓ OAuth redirects to dashboard  
✓ User profiles are created  
✓ Scan history is stored  
✓ RLS prevents cross-user access  
✓ Passwords are encrypted  

---

## 📚 Next Steps

1. Deploy to production domain (sentinel.hackura.app)
2. Update OAuth redirect URLs for production
3. Set up email verification (optional)
4. Configure email templates for confirmations
5. Add two-factor authentication (2FA)
6. Set up database monitoring
7. Configure automated backups

---

**Last Updated:** May 10, 2026  
**Version:** 1.0.0  
**Status:** Ready for Setup
