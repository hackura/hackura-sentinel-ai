# Backend Integration & Setup Guide

## Current Status

Your **frontend is production-ready** and properly configured to connect to the backend at:
- **Production**: `https://api.hackura.app`
- **Development**: `http://localhost:8000` (or any URL via `NEXT_PUBLIC_API_URL`)

## Development Note

If `npm run dev` previously hit a Turbopack panic, the default dev script now uses Webpack instead. That keeps local development stable while preserving `next dev` as the command you run day to day.

If you want to retry Turbopack explicitly, use `npm run dev:turbopack`.

For frontend-to-backend routing, keep `NEXT_PUBLIC_API_URL` pointed at your live backend in production and at your local backend during development.

## Backend Requirements Checklist

Your frontend expects the backend to provide these endpoints:

### Health & Status
```
GET /health
Response: { status: 'ok' } or similar
```

### Dashboard Endpoints
```
GET /dashboard/stats
Response: {
  data: {
    total_scans: number,
    risk_alerts: number,
    malicious_urls: number,
    safe_browsing: number,
    risk_distribution: { HIGH: number, MEDIUM: number, LOW: number },
    trend?: { value: number, isPositive: boolean }
  }
}

GET /scans?limit=5
Response: {
  data: [{
    id: string,
    input: string,
    type: 'url' | 'domain' | 'text',
    risk_level: 'HIGH' | 'MEDIUM' | 'LOW',
    risk_score: number,
    created_at: string,
    summary?: string
  }]
}
```

### Scan Operations
```
GET /scan/:id
Response: {
  data: {
    id: string,
    input: string,
    type: 'url' | 'domain' | 'text',
    risk_level: 'HIGH' | 'MEDIUM' | 'LOW',
    risk_score: number,
    details: any,
    created_at: string
  }
}

POST /scan
Body: {
  input: string,
  type: 'url' | 'domain' | 'text'
}
Response: {
  data: {
    id: string,
    input: string,
    type: string,
    risk_level: string,
    risk_score: number,
    details: any,
    created_at: string
  }
}
```

### Graph/Intelligence Endpoints
```
GET /graph/:entity
Response: {
  data: {
    nodes: [{ id: string, label: string, type: string }],
    edges: [{ source: string, target: string, label: string }],
    metadata: any
  }
}
```

### User Settings
```
GET /settings
Response: {
  data: {
    name: string,
    email: string,
    email_notifications: boolean,
    two_factor_enabled: boolean,
    api_key_last4?: string,
    api_key_created_at?: string
  }
}

PATCH /settings
Body: {
  name?: string,
  email?: string,
  email_notifications?: boolean,
  two_factor_enabled?: boolean
}
Response: { data: { ...updated settings } }

POST /settings/api-keys
Response: {
  data: {
    key: string,
    last4: string,
    created_at: string
  }
}
```

## CORS Configuration Required

Your backend **must allow requests from**:

### Development
```
http://localhost:3000
http://192.168.174.213:3000
```

### Production (Vercel)
```
https://your-domain.vercel.app
https://your-custom-domain.com
```

Configure CORS headers:
```
Access-Control-Allow-Origin: https://your-domain.vercel.app
Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

## Authentication

### Supabase JWT Token
The frontend automatically injects Supabase JWT tokens in the `Authorization` header:
```
Authorization: Bearer <supabase-access-token>
```

Your backend should:
1. Verify the JWT token is valid
2. Extract the user ID from the token
3. Use it for authorization checks

### Token Validation Example (Node.js/Express)
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error) throw error;
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
```

## Environment Variables (Backend)

Set these on your backend server:

```bash
# Supabase (for token verification)
SUPABASE_URL=https://drgcuoiytgwbaoxxsasl.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://your-domain.vercel.app

# AI/ML Services
OLLAMA_MODEL=mistral
OLLAMA_API_URL=http://localhost:11434

# Neo4j (for graph data)
NEO4J_URI=neo4j+s://your-auradb.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=<password>

# Other services
DATABASE_URL=<your-db>
API_PORT=8000
NODE_ENV=production
```

## Testing the Backend Connection

### From Frontend (in browser console)
```javascript
// Check if API is reachable
fetch('https://api.hackura.app/health')
  .then(r => r.json())
  .then(data => console.log('✅ Backend is up:', data))
  .catch(e => console.error('❌ Backend is down:', e));
```

### From Terminal
```bash
# Test health endpoint
curl -X GET https://api.hackura.app/health

# Test with auth (replace TOKEN)
curl -X GET https://api.hackura.app/dashboard/stats \
  -H "Authorization: Bearer TOKEN"
```

## Troubleshooting

### 404 Errors
- Verify endpoint paths match exactly
- Check API response format (should have `data` wrapper)

### 401 Unauthorized
- Verify Supabase token is valid
- Check token is being sent in `Authorization` header
- Verify backend is validating token correctly

### CORS Errors
- Add your domain to `ALLOWED_ORIGINS`
- Ensure backend sends proper CORS headers
- Check browser console for exact error

### Timeout Errors
- Frontend has 30 second timeout
- Check backend is responding within this time
- Increase timeout in `src/lib/api.ts` if needed

### Empty Data
- Check response format includes `data` key
- Fallback values handle missing `data` key, but explicit is better

## Performance Tips

1. **Use pagination** for `/scans` endpoint
2. **Cache frequently accessed data** (dashboard stats)
3. **Implement request rate limiting**
4. **Use CDN for static assets**
5. **Monitor response times** (aim for <100ms)

## Security Best Practices

✅ Verify JWT tokens from Supabase
✅ Validate all input from frontend
✅ Use HTTPS in production
✅ Set appropriate CORS headers
✅ Don't expose sensitive data
✅ Rate limit API endpoints
✅ Log all authentication attempts
✅ Use environment variables for secrets

## Deployment

### Vercel Frontend
```bash
vercel --prod
```

### Backend Options
- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repo
- **Render**: Connect GitHub repo
- **AWS/GCP/Azure**: Use appropriate CLI

Make sure to set `NEXT_PUBLIC_API_URL` in Vercel to your backend URL!

## Next Steps

1. ✅ Frontend is ready
2. ⏳ Verify backend has all required endpoints
3. ⏳ Test CORS configuration
4. ⏳ Test authentication flow
5. ⏳ Deploy to production
6. ⏳ Monitor error logs

---

**Frontend Status**: ✅ Production Ready  
**Backend Status**: ⏳ Awaiting verification  
**Connected**: Yes (via `NEXT_PUBLIC_API_URL`)

Questions? Check [VERCEL_DEPLOYMENT_GUIDE.md](VERCEL_DEPLOYMENT_GUIDE.md) for more details.
