# 🛡️ Hackura Sentinel AI — Backend API

Production-ready Node.js + Express backend for threat intelligence. Provides AI-powered scanning via Ollama and stores results in Supabase. Threat graphs are queried from **Neo4j** first, with Ollama fallback.

---

## 📡 Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | ❌ | Health check |
| `POST` | `/scan` | ✅ | Perform threat analysis |
| `GET` | `/scans` | ✅ | List user's scans (query: `?limit=`) |
| `GET` | `/scan/:id` | ✅ | Get single scan |
| `GET` | `/graph/:entity` | ✅ | Get threat graph (Neo4j → Ollama fallback) |
| `GET` | `/dashboard/stats` | ✅ | Aggregated dashboard stats |

All protected routes require `Authorization: Bearer <supabase-access-token>`.

---

## 🗄️ Database Schema (Supabase)

```sql
-- Scans table
create table if not exists scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  input text not null,
  type text check (type in ('url', 'domain', 'text')),
  risk_score integer not null,
  risk_level text check (risk_level in ('LOW', 'MEDIUM', 'HIGH')) not null,
  confidence_score float not null,
  ai_explanation text not null,
  risk_signals jsonb default '[]',
  created_at timestamp with time zone default now()
);

create index idx_scans_user_id on scans(user_id);
create index idx_scans_created_at on scans(created_at desc);

-- Optional: RPC for fast stats
create or replace function get_dashboard_stats(user_id uuid)
returns jsonb as $$
  select jsonb_build_object(
    'total_scans', count(*),
    'risk_alerts', count(*) filter (where risk_level = 'HIGH'),
    'malicious_urls', count(*) filter (where risk_level in ('HIGH', 'MEDIUM')),
    'safe_browsing', count(*) filter (where risk_level = 'LOW'),
    'risk_distribution', jsonb_build_object(
      'HIGH', count(*) filter (where risk_level = 'HIGH'),
      'MEDIUM', count(*) filter (where risk_level = 'MEDIUM'),
      'LOW', count(*) filter (where risk_level = 'LOW')
    )
  ) from scans where user_id = $1;
$$ language sql stable;
```

## 1. Quick Start on Your Server

You are SSH'd into `api.hackura.app`. Run these:

```bash
# 1. Navigate to home or app directory
cd ~

# 2. Clone or scaffold backend
# Option A: Clone the repo
git clone https://github.com/hackura/hackura-sentinel-ai.git
cd hackura-sentinel-ai/backend

# Option B: Copy files manually (same result)

# 3. Install Node.js 18+ if not present
node --version  # should be >= 18

# 4. Install dependencies
npm ci --production

# 5. Configure environment
cp .env.example .env
nano .env   # Edit with your credentials

# 6. Build
npm run build

# 7. Run (quick test)
node dist/index.js
```

At this point, `curl http://localhost:3000/health` should return `{"status":"ok"}`.

---

## 2. Configure `.env` Variables

| Variable | Description |
|----------|-------------|
| `PORT` | `3000` |
| `NODE_ENV` | `production` |
| `SUPABASE_URL` | From Supabase project settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (keep secret!) |
| `OLLAMA_API_URL` | `http://localhost:11434` (if Ollama runs on same server, or remote URL) |
| `OLLAMA_MODEL` | `mistral` |
| `ALLOWED_ORIGINS` | `https://sentinel.hackura.app` |
| `NEO4J_URI`, `NEO4J_USERNAME`, `NEO4J_PASSWORD` | Optional — for graph queries |

**Important**: `SUPABASE_SERVICE_ROLE_KEY` is required. This backend authenticates users via JWT but writes to Supabase using the service role.

---

## 3. Run with PM2 (Production)

```bash
# Install PM2 if not installed
npm install -g pm2

# Start
pm2 start npm --name "hackura-api" -- start

# Or directly:
pm2 start dist/index.js --name hackura-api

# View logs
pm2 logs hackura-api

# Restart
pm2 restart hackura-api

# Stop
pm2 stop hackura-api
```

**Auto-start on reboot:**
```bash
pm2 startup
pm2 save
```

---

## 4. Systemd Alternative

Create `/etc/systemd/system/hackura-api.service`:

```ini
[Unit]
Description=Hackura Sentinel API
After=network.target

[Service]
Type=simple
User=YOUR_USER
WorkingDirectory=/home/YOUR_USER/hackura-sentinel-ai/backend
ExecStart=/usr/bin/node /home/YOUR_USER/hackura-sentinel-ai/backend/dist/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable hackura-api
sudo systemctl start hackura-api
sudo systemctl status hackura-api
```

---

## 5. Set Up Ollama AI

The backend calls Ollama for threat analysis. Install Ollama on `api.hackura.app`:

```bash
# Install
curl -fsSL https://ollama.ai/install.sh | sh

# Pull the model
ollama pull mistral

# Run Ollama as a service
# Create: /etc/systemd/system/ollama.service
sudo tee /etc/systemd/system/ollama.service > /dev/null <<'EOF'
[Unit]
Description=Ollama
After=network-online.target

[Service]
Environment="OLLAMA_ORIGINS=https://sentinel.hackura.app"
ExecStart=/usr/bin/ollama serve
User=YOUR_USER
Restart=always
RestartSec=10

[Install]
WantedBy=default.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable ollama
sudo systemctl start ollama
sudo systemctl status ollama
```

---

## 6. Nginx Reverse Proxy (Optional)

Expose on port 80/443 with SSL:

```nginx
server {
    listen 80;
    server_name api.hackura.app;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.hackura.app;

    ssl_certificate /etc/letsencrypt/live/api.hackura.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.hackura.app/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $remote_addr;
    }
}
```

---

## 7. Database

The backend expects a Supabase database. Ensure the `scans` table exists:

```sql
create table if not exists scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  input text not null,
  type text check (type in ('url', 'domain', 'text')),
  risk_score integer,
  risk_level text check (risk_level in ('LOW', 'MEDIUM', 'HIGH')),
  confidence_score float,
  ai_explanation text,
  risk_signals jsonb default '[]',
  created_at timestamp with time zone default now()
);

create index idx_scans_user_id on scans(user_id);
create index idx_scans_created_at on scans(created_at desc);
```

---

## 8. Test the API

```bash
# Health
curl https://api.hackura.app/health

# With auth (replace <token> with user's Supabase access token)
curl -H "Authorization: Bearer <token>" https://api.hackura.app/scan \
  -H "Content-Type: application/json" \
  -d '{"input":"example.com","type":"domain"}'

# Graph
curl -H "Authorization: Bearer <token>" "https://api.hackura.app/graph/phishing.com"
```

---

## 9. Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS errors | Check `ALLOWED_ORIGINS` |
| Ollama timeout | Increase timeout in `ollama.ts` |
| Auth fails | Ensure Supabase service role key is correct |
| DB errors | Run the SQL schema above |
| Port 3000 in use | Change `PORT` env var |

---

## 10. Project Structure

```
backend/
├── src/
│   ├── index.ts           # Express app setup
│   ├── types/
│   │   └── index.ts       # Shared TypeScript types
│   ├── routes/
│   │   ├── scan.ts        # POST /scan, GET /scan/:id
│   │   ├── scans.ts       # GET /scans
│   │   ├── graph.ts       # GET /graph/:entity
│   │   └── stats.ts       # GET /dashboard/stats
│   ├── middleware/
│   │   └── auth.ts        # JWT verification via Supabase
│   └── services/
│       ├── ollama.ts      # AI analysis (threat + graph)
│       └── supabase.ts    # Database operations
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

Once deployed, the frontend at `https://sentinel.hackura.app` will fetch real data from `https://api.hackura.app`.
