# 🛡️ Backend Integration Guide - Week 1

## Overview
This guide provides step-by-step instructions for integrating your Hackura Sentinel AI frontend with the backend services hosted on **api.hackura.app** (Ollama AI brain).

---

## 📋 What's Ready

✅ Frontend dashboard fully built and tested  
✅ Environment variables configured in `.env.local`  
✅ API client structure in place (`src/lib/api.ts`)  
✅ Mock data for testing all features  
✅ Types defined for all API responses (`src/types/index.ts`)  

---

## 🔧 Backend Setup Checklist

### 1. Ollama AI Brain Setup (api.hackura.app)

**Requirements:**
- Ollama 0.1.x or higher
- Mistral model (or your preferred LLM)
- CORS enabled for sentinel.hackura.app
- SSL/TLS certificate for api.hackura.app

**Installation:**
```bash
# Install Ollama
curl https://ollama.ai/install.sh | sh

# Pull the model
ollama pull mistral

# Run Ollama with CORS
OLLAMA_ORIGINS="https://sentinel.hackura.app" ollama serve

# Test endpoint
curl -X GET http://localhost:11434/api/tags
```

**Configuration:**
```bash
# Set environment variables on your server
export OLLAMA_ORIGINS="https://sentinel.hackura.app"
export OLLAMA_NUM_PARALLEL=4
export OLLAMA_NUM_THREAD=8
```

---

### 2. API Endpoints to Implement

Your `api.hackura.app` backend needs to expose these endpoints:

#### **POST /scan**
Perform threat analysis on a URL, domain, or text.

**Request:**
```typescript
{
  "input": "https://example.com",
  "type": "url" | "domain" | "text"
}
```

**Response:**
```typescript
{
  "id": "scan_123",
  "input": "https://example.com",
  "type": "url",
  "risk_score": 42,
  "risk_level": "MEDIUM",
  "confidence_score": 92,
  "ai_explanation": "This domain shows signs of legitimate business...",
  "risk_signals": [
    "recently_registered",
    "suspicious_tld"
  ],
  "recommendations": [
    "Verify domain ownership",
    "Check SSL certificate validity"
  ],
  "timestamp": "2026-05-10T13:14:23Z"
}
```

**Implementation:**
```python
# Python/FastAPI example
from fastapi import FastAPI
from ollama import Client

app = FastAPI()
ollama = Client(host='http://localhost:11434')

@app.post("/scan")
async def scan_threat(input: str, type: str):
    prompt = f"""Analyze this {type} for security threats: {input}
    
Provide response in JSON format with:
- risk_score (0-100)
- risk_level (LOW/MEDIUM/HIGH)
- confidence_score (0-100)
- ai_explanation (brief analysis)
- risk_signals (list of detected signals)
- recommendations (list of actions)
"""
    
    response = ollama.generate(model="mistral", prompt=prompt)
    # Parse response and return JSON
    return parse_response(response)
```

---

#### **GET /graph/{entity}**
Get threat relationship graph for an entity.

**Request:**
```
GET /graph/example.com
```

**Response:**
```typescript
{
  "entity": "example.com",
  "nodes": [
    {
      "id": "example.com",
      "label": "example.com",
      "type": "domain",
      "risk_level": "MEDIUM",
      "description": "Primary domain"
    },
    {
      "id": "192.168.1.1",
      "label": "192.168.1.1",
      "type": "ip",
      "risk_level": "LOW",
      "description": "IP address"
    }
  ],
  "edges": [
    {
      "source": "example.com",
      "target": "192.168.1.1",
      "relationship": "resolves_to",
      "weight": 1
    }
  ],
  "statistics": {
    "total_nodes": 2,
    "total_edges": 1,
    "network_density": 1.0
  }
}
```

**Implementation:**
```python
from neo4j import GraphDatabase

driver = GraphDatabase.driver(
    "neo4j+s://your-db.databases.neo4j.io",
    auth=("neo4j", "password")
)

@app.get("/graph/{entity}")
async def get_graph(entity: str):
    with driver.session() as session:
        nodes = session.run(
            "MATCH (n) WHERE n.name CONTAINS $entity RETURN n",
            entity=entity
        ).data()
        edges = session.run(
            "MATCH (a)-[r]->(b) RETURN a, r, b"
        ).data()
        return format_graph(nodes, edges)
```

---

#### **GET /health**
Health check endpoint.

**Response:**
```typescript
{
  "status": "ok",
  "timestamp": "2026-05-10T13:14:23Z",
  "version": "1.0.0"
}
```

**Implementation:**
```python
@app.get("/health")
async def health():
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }
```

---

### 3. Database Setup (Optional but Recommended)

#### Neo4j AuraDB Configuration

Already configured in `.env.local`:
```
NEO4J_URI=neo4j+s://2729dc1b.databases.neo4j.io
NEO4J_USERNAME=2729dc1b
NEO4J_PASSWORD=wMDBcD6Ry67cCTUVBxcObI5peWe8Emfpd0_OwhvnYoc
```

**Initialize graph schema:**
```cypher
// Create node labels
CREATE CONSTRAINT domain_unique IF NOT EXISTS FOR (d:Domain) REQUIRE d.name IS UNIQUE;
CREATE CONSTRAINT ip_unique IF NOT EXISTS FOR (i:IP) REQUIRE i.address IS UNIQUE;

// Create relationships
CREATE (d:Domain {name: "example.com", risk_level: "MEDIUM"})
CREATE (i:IP {address: "192.168.1.1", risk_level: "LOW"})
CREATE (d)-[:RESOLVES_TO]->(i)
```

---

### 4. Supabase Authentication

Already configured in `.env.local`. Your backend should:

1. **Verify JWT tokens** from requests
2. **Store scan history** in Supabase
3. **Manage user sessions**

**Implementation:**
```python
from supabase import create_client, Client

SUPABASE_URL = "https://drgcuoiytgwbaoxxsasl.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Store scan result
def save_scan(user_id: str, scan_result: dict):
    return supabase.table("scans").insert({
        "user_id": user_id,
        "input": scan_result["input"],
        "risk_score": scan_result["risk_score"],
        "created_at": datetime.now().isoformat()
    }).execute()
```

---

## 📱 Frontend Configuration Status

### Current Settings (src/lib/api.ts):

```typescript
// API endpoint - points to your Ollama AI brain
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.hackura.app';

// Available functions:
- performScan(input: string)     // POST /scan
- getGraphData(entity: string)    // GET /graph/{entity}
- checkApiHealth()                // GET /health
```

### Environment Variables (.env.local):

```
NEXT_PUBLIC_API_URL=https://api.hackura.app
NEXT_PUBLIC_WEBSITE_URL=https://sentinel.hackura.app
OLLAMA_API_URL=https://api.hackura.app
OLLAMA_MODEL=mistral
```

---

## 🧪 Testing Workflow

### 1. Test API Endpoints Locally

```bash
# Start Ollama locally
OLLAMA_ORIGINS="*" ollama serve

# Test in another terminal
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mistral",
    "prompt": "Analyze this domain for threats: example.com",
    "stream": false
  }'
```

### 2. Test Frontend with Mock Data

Frontend currently uses mock data, so all pages work without a backend:

```bash
# Start dev server
cd apps/web
npm run dev

# Visit http://localhost:3000/dashboard
# All features work with mock data
```

### 3. Test with Real Backend

Once your backend is ready:

1. Update `.env.local` with your `api.hackura.app` endpoint
2. Restart dev server: `npm run dev`
3. Click "Scan" → enter a URL → should call your backend

### 4. Expected Behavior

**Before Backend:**
- Click "Scan" → Shows mock result in 1 second

**After Backend:**
- Click "Scan" → Shows real API response from Ollama

---

## 🔒 Security Checklist

### CORS Configuration
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://sentinel.hackura.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Rate Limiting
```python
from slowapi import Limiter

limiter = Limiter(key_func=get_remote_address)

@app.post("/scan")
@limiter.limit("10/minute")
async def scan_threat(request: Request, input: str):
    # Implementation
```

### Input Validation
```python
from pydantic import BaseModel, validator

class ScanRequest(BaseModel):
    input: str
    type: str
    
    @validator('input')
    def validate_input(cls, v):
        if len(v) > 1000:
            raise ValueError('Input too long')
        return v
```

### Authentication
```python
from fastapi.security import HTTPBearer

security = HTTPBearer()

@app.post("/scan")
async def scan_threat(credentials: HTTPAuthCredentials = Depends(security)):
    token = credentials.credentials
    # Verify JWT token
```

---

## 📅 Week 1 Timeline

### Day 1-2: Backend Setup
- [ ] Set up Ollama on api.hackura.app
- [ ] Pull mistral model
- [ ] Test Ollama locally
- [ ] Set up FastAPI/Flask server

### Day 3-4: API Implementation
- [ ] Implement `/scan` endpoint
- [ ] Implement `/graph/{entity}` endpoint
- [ ] Implement `/health` endpoint
- [ ] Test all endpoints with curl

### Day 5: Integration Testing
- [ ] Configure CORS for sentinel.hackura.app
- [ ] Connect frontend to backend
- [ ] Test scanning functionality
- [ ] Debug any issues

### Day 6-7: Database & Refinement
- [ ] Set up Neo4j schema (optional)
- [ ] Implement scan history storage
- [ ] Add rate limiting
- [ ] Performance optimization

---

## 🚀 Deployment Instructions

### Deploy to api.hackura.app

1. **SSH into your server:**
```bash
ssh user@api.hackura.app
```

2. **Install Ollama:**
```bash
curl https://ollama.ai/install.sh | sh
```

3. **Create systemd service** (`/etc/systemd/system/ollama.service`):
```ini
[Unit]
Description=Ollama Service
After=network.target

[Service]
Type=simple
User=ollama
WorkingDirectory=/home/ollama
EnvironmentFile=/home/ollama/.env
ExecStart=/usr/bin/ollama serve
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

4. **Pull and run model:**
```bash
ollama pull mistral
systemctl start ollama
```

5. **Set up reverse proxy** (Nginx):
```nginx
server {
    listen 443 ssl;
    server_name api.hackura.app;

    ssl_certificate /etc/ssl/certs/api.hackura.app.crt;
    ssl_certificate_key /etc/ssl/private/api.hackura.app.key;

    location / {
        proxy_pass http://localhost:11434;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' 'https://sentinel.hackura.app';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'Content-Type';
    }
}
```

6. **Start nginx:**
```bash
systemctl restart nginx
```

---

## 📞 API Response Examples

### Successful Scan Response

```json
{
  "id": "scan_abc123",
  "input": "https://suspicious-site.com",
  "type": "url",
  "risk_score": 87,
  "risk_level": "HIGH",
  "confidence_score": 94,
  "ai_explanation": "This URL exhibits multiple indicators of a phishing campaign. The domain was registered recently, SSL certificate is self-signed, and content matches known phishing templates.",
  "risk_signals": [
    "recently_registered",
    "self_signed_certificate",
    "phishing_template_match",
    "suspicious_domain_name"
  ],
  "recommendations": [
    "Do not visit this website",
    "Report to browser vendor",
    "Block domain in firewall",
    "Alert users about threat"
  ],
  "timestamp": "2026-05-10T13:14:23Z"
}
```

### Error Response

```json
{
  "error": "Invalid URL format",
  "code": "INVALID_INPUT",
  "timestamp": "2026-05-10T13:14:23Z"
}
```

---

## ❓ Troubleshooting

### Issue: CORS Errors

**Solution:** Add CORS headers to your API responses
```python
@app.post("/scan")
async def scan_threat(request: Request):
    response.headers["Access-Control-Allow-Origin"] = "https://sentinel.hackura.app"
    return response
```

### Issue: Slow Ollama Responses

**Solution:** Optimize model loading
```bash
# Use GPU acceleration
export CUDA_VISIBLE_DEVICES=0

# Increase RAM allocation
export OLLAMA_NUM_PARALLEL=4
```

### Issue: SSL Certificate Errors

**Solution:** Use Let's Encrypt
```bash
certbot certonly --standalone -d api.hackura.app
```

---

## 📚 Next Resources

- [Ollama Documentation](https://ollama.ai/docs)
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [Neo4j Python Driver](https://neo4j.com/docs/python-manual/current/)
- [Supabase Python Client](https://supabase.com/docs/reference/python/introduction)

---

## ✅ Success Criteria

By end of Week 1, you should have:

- [x] Hackura Sentinel AI frontend ready to deploy
- [ ] Ollama AI brain running on api.hackura.app
- [ ] `/scan` endpoint working with real threat analysis
- [ ] Frontend successfully calling backend API
- [ ] All 6 dashboard pages showing real data
- [ ] Database storing scan history (optional)

---

## 🎯 Week 2+ Plans

- Advanced threat intelligence features
- Real-time monitoring dashboard
- Automated threat feeds integration
- Machine learning model fine-tuning
- Mobile app development

---

**Last Updated:** May 10, 2026  
**Version:** 1.0.0  
**Status:** Ready for Backend Integration
