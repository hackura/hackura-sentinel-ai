# API Reference & Integration Guide

## Backend API Endpoints

### Base URL
```
https://api.hackura.app
```

## Endpoints

### 1. Perform Scan
```http
POST /scan
Content-Type: application/json

{
  "input": "https://example.com or example.com or text",
  "type": "url" | "domain" | "text"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "url": "https://example.com",
    "risk_score": 45,
    "risk_level": "LOW",
    "ai_explanation": "This domain appears legitimate...",
    "risk_signals": ["Signal 1", "Signal 2"],
    "confidence_score": 0.95,
    "created_at": "2026-05-10T12:00:00Z",
    "metadata": {}
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Invalid input"
}
```

---

### 2. Get Graph Data
```http
GET /graph/{entity}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "nodes": [
      {
        "id": "node-1",
        "label": "example.com",
        "type": "domain",
        "risk_level": "HIGH"
      }
    ],
    "edges": [
      {
        "source": "node-1",
        "target": "node-2",
        "relationship": "hosted_on"
      }
    ]
  }
}
```

---

### 3. API Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-05-10T12:00:00Z",
  "uptime": 3600
}
```

---

## TypeScript Types

### ScanResult
```typescript
interface ScanResult {
  id: string;                    // Unique scan ID
  url: string;                   // Input URL/domain
  risk_score: number;            // 0-100
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  ai_explanation: string;        // Natural language explanation
  risk_signals: string[];        // Detected threat indicators
  confidence_score: number;      // 0.0-1.0 (percentage)
  created_at: string;            // ISO 8601 timestamp
  metadata?: Record<string, any>; // Optional extra data
}
```

### GraphNode
```typescript
interface GraphNode {
  id: string;
  label: string;                 // Display name
  type: 'domain' | 'ip' | 'campaign' | 'malware';
  risk_level?: 'LOW' | 'MEDIUM' | 'HIGH';
}
```

### GraphEdge
```typescript
interface GraphEdge {
  source: string;               // Node ID
  target: string;               // Node ID
  relationship: string;         // Relationship type
}
```

### GraphData
```typescript
interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
```

---

## Mock Data Examples

### Scan Results
```typescript
[
  {
    id: '1',
    url: 'https://secure-payment-update.com',
    risk_score: 87,
    risk_level: 'HIGH',
    ai_explanation: 'Domain impersonation detected. Similarity to legitimate payment gateway exceeds 95%.',
    risk_signals: [
      'Domain Spoofing',
      'SSL Certificate Mismatch',
      'Phishing Template Match'
    ],
    confidence_score: 0.94,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    url: 'https://github.com/torvalds/linux',
    risk_score: 8,
    risk_level: 'LOW',
    ai_explanation: 'Legitimate repository. No threats detected.',
    risk_signals: [],
    confidence_score: 0.99,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    url: 'suspicious-crypto-airdrop.net',
    risk_score: 92,
    risk_level: 'HIGH',
    ai_explanation: 'Classic crypto scam indicators. Unsolicited token distribution promises.',
    risk_signals: [
      'Scam Pattern',
      'Wallet Draining Scheme',
      'False Promise'
    ],
    confidence_score: 0.97,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  }
]
```

### Graph Data
```typescript
{
  nodes: [
    { id: '1', label: 'phishing.com', type: 'domain', risk_level: 'HIGH' },
    { id: '2', label: '192.168.1.1', type: 'ip', risk_level: 'HIGH' },
    { id: '3', label: 'Campaign-2024', type: 'campaign', risk_level: 'HIGH' },
    { id: '4', label: 'malware.exe', type: 'malware', risk_level: 'HIGH' },
  ],
  edges: [
    { source: '1', target: '2', relationship: 'hosted_on' },
    { source: '2', target: '3', relationship: 'part_of' },
    { source: '3', target: '4', relationship: 'distributes' },
  ]
}
```

---

## Integration Steps

### Step 1: Update API URL
Edit `src/lib/api.ts`:
```typescript
const API_BASE_URL = 'https://api.hackura.app'; // Your backend URL
```

### Step 2: Replace Mock Calls
**Before:**
```typescript
// Mock delay for demo
await new Promise(resolve => setTimeout(resolve, 1500));
const mockResult: ScanResult = {...};
setResult(mockResult);
```

**After:**
```typescript
// Call real API
const result = await performScan(input);
setResult(result);
```

### Step 3: Error Handling
Add proper error handling:
```typescript
try {
  const result = await performScan(input);
  setResult(result);
} catch (error) {
  setError('Scan failed. Please try again.');
  console.error(error);
}
```

### Step 4: Test Integration
1. Start dev server: `npm run dev`
2. Open dashboard
3. Perform a scan
4. Check browser DevTools > Network tab
5. Verify API response format

---

## CORS Configuration

If backend is on different domain, configure CORS:

```javascript
// Backend (Node.js/Express example)
app.use(cors({
  origin: ['http://localhost:3000', 'https://hackura.app'],
  credentials: true
}));
```

---

## Authentication Integration

### Using Supabase Auth

1. **Sign Up User**
```typescript
const { data, error } = await signUpWithEmail(email, password);
```

2. **Sign In User**
```typescript
const { data, error } = await signInWithEmail(email, password);
```

3. **Get Current User**
```typescript
const user = await getCurrentUser();
if (!user) redirect('/');
```

4. **Sign Out**
```typescript
await signOut();
```

### Adding Auth Header to API Calls

```typescript
// In lib/api.ts
const token = await getAuthToken();
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

---

## Rate Limiting

Recommended rate limits:
- Scans: 100 per minute per user
- Graph queries: 50 per minute per user
- Health checks: No limit

---

## Response Time Goals

- Scan: < 3 seconds
- Graph query: < 2 seconds
- Health check: < 500ms

---

## Error Codes

```
200 OK              - Success
400 Bad Request     - Invalid input
401 Unauthorized    - Auth required
403 Forbidden       - Access denied
429 Too Many Req.   - Rate limited
500 Server Error    - Backend error
503 Unavailable     - Service down
```

---

## Testing with cURL

### Test Scan Endpoint
```bash
curl -X POST https://api.hackura.app/scan \
  -H "Content-Type: application/json" \
  -d '{"input":"https://example.com","type":"url"}'
```

### Test Graph Endpoint
```bash
curl https://api.hackura.app/graph/example.com
```

### Test Health
```bash
curl https://api.hackura.app/health
```

---

## API Client Library

The dashboard uses **Axios** for HTTP requests. See `src/lib/api.ts` for the client wrapper.

### Using the API
```typescript
import { performScan, getGraphData, checkApiHealth } from '@/lib/api';

// Perform scan
const result = await performScan('https://example.com');

// Get graph
const graph = await getGraphData('phishing-campaign');

// Check health
const isHealthy = await checkApiHealth();
```

---

## Logging

Enable debug logging:
```typescript
// In lib/api.ts
api.interceptors.response.use(
  response => {
    console.log('[API]', response.config.url, response.status);
    return response;
  },
  error => {
    console.error('[API Error]', error.message);
    return Promise.reject(error);
  }
);
```

---

## Next Steps

1. ✅ Frontend dashboard complete
2. ⏳ Connect to backend API
3. ⏳ Integrate Supabase auth
4. ⏳ Connect to Neo4j AuraDB
5. ⏳ Deploy to production

---

**Last Updated:** May 10, 2026
