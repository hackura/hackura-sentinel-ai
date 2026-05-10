# Deploy Backend to api.hackura.app — Step-by-Step

## Pre-requisites
- Server `api.hackura.app` running Ubuntu 22.04+ or similar
- Node.js 18+ installed (`node -v` should show >= 18)
- Git installed
- Domain `api.hackura.app` DNS points to your server IP

---

## Step 1: SSH into Server

```bash
ssh YOUR_USER@api.hackura.app
cd ~
```

---

## Step 2: Clone Repository (if not already)

```bash
git clone https://github.com/hackura/hackura-sentinel-ai.git
cd hackura-sentinel-ai/backend
```

---

## Step 3: Install Dependencies

```bash
npm ci --production
```

---

## Step 4: Configure Environment

```bash
cp .env.example .env
nano .env   # or use vim/your editor
```

Fill in:
```
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ... (from Supabase → Settings → API → service_role)
OLLAMA_API_URL=http://localhost:11434 (if Ollama on same server)
OLLAMA_MODEL=mistral
ALLOWED_ORIGINS=https://sentinel.hackura.app
```

Save and exit.

---

## Step 5: Build

```bash
npm run build
```

This compiles TypeScript to `dist/`.

---

## Step 6: Test Locally (optional)

```bash
node dist/index.js
```

In another terminal:
```bash
curl http://localhost:3000/health
# Expected: {"status":"ok","timestamp":"..."}
```

Press `Ctrl+C` to stop.

---

## Step 7: Install & Start PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start the API
pm2 start dist/index.js --name hackura-api

# Check logs
pm2 logs hackura-api

# Save for auto-restart
pm2 save
pm2 startup   # Follow instructions to enable on boot
```

---

## Step 8: Set Up Ollama (if not installed)

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull model
ollama pull mistral

# Create systemd service (optional, run as daemon)
sudo tee /etc/systemd/system/ollama.service > /dev/null <<'EOF'
[Unit]
Description=Ollama Service
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
```

---

## Step 9: Configure Firewall (if enabled)

```bash
# Allow port 3000 (internal)
sudo ufw allow 3000

# If using Nginx (recommended), bind 80/443 only
```

---

## Step 10: Nginx Reverse Proxy (Recommended)

If you want HTTPS (you should), install Nginx + Certbot:

```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx

# Configure site
sudo tee /etc/nginx/sites-available/api.hackura.app > /dev/null <<'EOF'
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
    ssl_protocols TLSv1.2 TLSv1.3;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/api.hackura.app /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default  # if exists
sudo nginx -t && sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d api.hackura.app
```

---

## Step 11: Verify Production Deployment

```bash
# From your local machine
curl https://api.hackura.app/health
# Should return: {"status":"ok","timestamp":"2026-05-10T..."}

# Test a scan (requires auth token from frontend)
# Log into sentinel.hackura.app, open DevTools → Application → Cookies
# Copy the sb-access-token, then:
curl -H "Authorization: Bearer <sb-access-token>" \
  https://api.hackura.app/scan \
  -H "Content-Type: application/json" \
  -d '{"input":"example.com","type":"domain"}'
```

---

## Step 12: Monitor

```bash
# PM2
pm2 monit
pm2 logs hackura-api

# System resource usage
htop

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## Step 13: Update Frontend `.env.local`

On the frontend server (`sentinel.hackura.app`), ensure:

```env
NEXT_PUBLIC_API_URL=https://api.hackura.app
```

Remove or set `NEXT_PUBLIC_USE_MOCK_ON_ERROR=false` to use real API.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `SUPABASE_URL not defined` | Check `.env` is in `backend/` directory and `npm run build` was run |
| `Ollama connection refused` | `ollama serve` must be running; check `curl http://localhost:11434/api/tags` |
| CORS errors | Ensure `ALLOWED_ORIGINS` env var includes `https://sentinel.hackura.app` |
| 401 Unauthorized | Frontend must send Supabase access token in `Authorization: Bearer` header |
| Port already in use | Change `PORT` in `.env`, restart PM2 |
| PM2 not starting after reboot | Run `pm2 startup` and `pm2 save` |

---

## Done!

Your backend is now live at `api.hackura.app`. The frontend will automatically use it once `NEXT_PUBLIC_API_URL` points there.
