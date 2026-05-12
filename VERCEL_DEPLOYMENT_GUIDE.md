# Vercel Deployment Guide

This guide helps you deploy the Hackura Sentinel AI frontend to Vercel with proper backend API integration.

## Quick Start for Vercel Deployment

### 1. Connect to Vercel

```bash
# Login to Vercel (if not already)
npm i -g vercel
vercel login

# Deploy your project
vercel --prod
```

### 2. Configure Environment Variables

In your Vercel Project Settings → **Environment Variables**, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://drgcuoiytgwbaoxxsasl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZ2N1b2l5dGd3YmFveHhzYXNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNTI4MDYsImV4cCI6MjA5MzkyODgwNn0.CXUz6kOll_lYS4GR9lT71Y3yTaBOO067RFeqr5mFzzk
NEXT_PUBLIC_API_URL=https://api.hackura.app
NEXT_PUBLIC_ENVIRONMENT=production
```

**Important:** Environment variables starting with `NEXT_PUBLIC_` are exposed to the browser.

### 3. Update Backend API URL

If your backend is on a different URL (not `https://api.hackura.app`):

1. Set `NEXT_PUBLIC_API_URL` in Vercel Environment Variables
2. The frontend will automatically use this URL for all API calls
3. Ensure CORS is properly configured on your backend

## Backend Integration

### API Configuration

The frontend connects to the backend using the `NEXT_PUBLIC_API_URL` environment variable.

**File:** `src/lib/api.ts`

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.hackura.app';
```

### Features:
- ✅ Automatic token injection from Supabase authentication
- ✅ Timeout handling (30 seconds)
- ✅ Error handling and logging
- ✅ CORS support
- ✅ Request/response interceptors

### API Endpoints

All endpoints assume the backend API URL:

- `GET /health` - Health check
- `GET /dashboard/stats` - Dashboard statistics
- `GET /scans` - List scans
- `GET /scan/{id}` - Get scan details
- `POST /scan` - Perform new scan
- `GET /graph/{entity}` - Get graph data
- `GET /settings` - User settings
- `PATCH /settings` - Update settings
- `POST /settings/api-keys` - Generate API key

## Troubleshooting

### CORS Errors

If you see CORS errors in the console:

1. Ensure your backend allows requests from your Vercel domain
2. Add to backend CORS configuration:
   ```
   Allowed Origins: https://your-domain.vercel.app
   ```

### 404 Errors on API Calls

Check that `NEXT_PUBLIC_API_URL` is correctly set:
- Use the full URL (including `https://`)
- No trailing slash
- Example: `https://api.hackura.app` ✅
- Example: `https://api.hackura.app/` ❌

### Timeouts

If requests timeout:
1. Check backend is running and accessible
2. Check network tab in browser DevTools
3. Increase timeout in `src/lib/api.ts` if needed

## Local Development

For local development with a local backend:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://drgcuoiytgwbaoxxsasl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZ2N1b2l5dGd3YmFveHhzYXNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNTI4MDYsImV4cCI6MjA5MzkyODgwNn0.CXUz6kOll_lYS4GR9lT71Y3yTaBOO067RFeqr5mFzzk
```

Then run:
```bash
npm run dev
```

## Performance Notes

1. **Build optimization** is configured in `next.config.ts`
2. **Source maps disabled** in production for faster builds
3. **Chunk splitting** optimized for Vercel deployment
4. **Turbopack experimental** features for faster builds

## Security

- ✅ X-Content-Type-Options header set to `nosniff`
- ✅ X-Frame-Options header set to `SAMEORIGIN`
- ✅ Auth token automatically injected
- ✅ Supabase anon key used (read-only by default)

## Further Help

For more information:
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
