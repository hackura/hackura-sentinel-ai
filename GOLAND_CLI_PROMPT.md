# Hackura Sentinel AI CLI - GoLang Implementation Prompt

## 🎯 PROJECT OVERVIEW

Build a production-grade CLI tool for Hackura Sentinel AI that mirrors the web authorization portal features. The CLI will authenticate users, manage device sessions, and perform security scans with secure token-based API communication.

---

## 📋 TECH STACK

- **Language:** Go 1.21+
- **Auth:** Supabase SDK for Go
- **Database:** PostgreSQL (via Supabase)
- **Browser Integration:** Open native browser
- **HTTP Client:** Standard net/http with timeout handling
- **Config:** YAML/JSON config files
- **Logging:** Structured logging (slog or similar)
- **Distribution:** Binary executable (cross-platform)

---

## 🏗️ ARCHITECTURE

```
hackura-cli/
├── cmd/
│   └── hackura/
│       └── main.go                    # Entry point
├── internal/
│   ├── auth/
│   │   ├── device.go                 # Device ID generation & validation
│   │   ├── session.go                # Session polling & management
│   │   └── browser.go                # Browser integration
│   ├── api/
│   │   ├── client.go                 # HTTP client with JWT auth
│   │   ├── scan.go                   # Scan API endpoints
│   │   └── errors.go                 # Error handling
│   ├── config/
│   │   ├── config.go                 # Configuration loading
│   │   └── defaults.go               # Default values
│   ├── models/
│   │   ├── device_session.go         # Database models
│   │   ├── scan_result.go            # Scan result structures
│   │   └── risk.go                   # Risk assessment models
│   └── ui/
│       ├── spinner.go                # Loading indicators
│       ├── output.go                 # Formatted output
│       └── colors.go                 # Color schemes
├── pkg/
│   ├── supabase/
│   │   ├── client.go                 # Supabase client
│   │   ├── auth.go                   # Auth operations
│   │   └── query.go                  # Database queries
│   └── scanner/
│       ├── scanner.go                # Scan orchestration
│       ├── validators.go             # URL/domain validation
│       └── results.go                # Result processing
├── go.mod
├── go.sum
├── Makefile
└── README.md
```

---

## 📍 CORE FEATURES

### 1. **Device Authorization Flow**

```go
// Device ID Generation
- Generate unique 32-character hex identifier
- Store device metadata (hostname, OS, version)
- Persist device_id locally (~/.hackura/device_id)

// Authorization Portal
- Generate device_id
- Construct portal URL: https://sentinel.hackura.app/cli/login?device_id=<id>
- Open browser automatically (os.exec on macOS, xdg-open on Linux, start on Windows)
- Display waiting message with masked device ID

// Session Polling
- Poll cli_device_sessions table in Supabase
- Check status: 'pending' → 'authenticated'
- Retrieve JWT token from authenticated session
- Validate token expiration (15 minutes)
- Cache token locally (secure storage)

// Automatic Cleanup
- Mark session as 'expired' when done
- Delete local token cache on logout
- Log all authorization events
```

### 2. **Scan Operations**

```go
// Scan Command: `hackura scan <url|domain>`
- Validate input (URL format, domain validity)
- Check authentication (valid JWT token)
- Submit scan request to backend API
- Show real-time progress with spinner
- Display results with risk scoring
- Generate report (optional)

// Scan Options
- `--url <url>` - Scan specific URL
- `--domain <domain>` - Scan entire domain
- `--format json|text|pdf` - Output format
- `--save <path>` - Save results to file
- `--report` - Generate PDF report
- `--async` - Run in background
- `--confidence-threshold <num>` - Filter by confidence
```

### 3. **Authentication State Management**

```go
// Token Management
- Store JWT in secure local storage (~/.hackura/token)
- Check token validity on each command
- Refresh token if expired (redirects to portal)
- Support multiple profiles (dev, prod, staging)
- Log all auth events with timestamps

// Session Tracking
- Keep track of active device session
- Show last login timestamp
- Display authorization status
- Alert if session about to expire
- Handle session expiration gracefully

// Offline Support
- Cache basic functionality offline
- Queue scans for when online
- Sync on reconnection
```

### 4. **API Client with Token Auth**

```go
// HTTP Client
- Intercept all requests to add JWT Authorization header
- Automatic retry with exponential backoff
- Request/response logging (debug mode)
- Timeout handling (30 seconds default)
- Error response parsing

// Authentication Header
- Format: `Authorization: Bearer <jwt-token>`
- Validate token before each request
- Handle 401 Unauthorized (redirect to auth)
- Handle 403 Forbidden (permission denied)

// Base URLs
- Production: https://api.hackura.app
- Staging: https://staging-api.hackura.app
- Development: http://localhost:3000 (configurable)
```

### 5. **Command Structure**

```bash
# Authentication Commands
hackura auth login              # Open portal for authorization
hackura auth logout             # Revoke token & cleanup
hackura auth status             # Show current auth status
hackura auth refresh            # Refresh token if expired

# Scan Commands
hackura scan <url>              # Scan single URL
hackura scan --domain <domain>  # Scan domain
hackura scan --file <paths>     # Batch scan from file
hackura scan --async            # Async scan mode

# Results Commands
hackura results list            # Show recent scans
hackura results show <scan-id>  # Show specific result
hackura results export <id>     # Export to JSON/PDF
hackura results delete <id>     # Delete result

# Configuration Commands
hackura config set <key> <val>  # Set configuration
hackura config get <key>        # Get configuration
hackura config reset            # Reset to defaults

# Utility Commands
hackura version                 # Show CLI version
hackura help [command]          # Show help
hackura update                  # Check for updates
```

---

## 🔑 KEY IMPLEMENTATIONS

### Device Authorization

```go
// 1. Generate Device ID
func GenerateDeviceID() (string, error) {
    // Use crypto/rand to generate 32-char hex string
    // Format: [a-f0-9]{32}
    // Example: a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4
}

// 2. Open Portal
func OpenPortal(deviceID string) error {
    // Construct URL: https://sentinel.hackura.app/cli/login?device_id=<id>
    // Open in default browser (browser.go)
    // Show waiting message
}

// 3. Poll for Token
func PollForToken(deviceID string, timeout time.Duration) (string, error) {
    // Query cli_device_sessions table
    // Poll every 6 seconds
    // Timeout after 15 minutes
    // Return JWT token when authenticated
}

// 4. Validate Token
func ValidateToken(token string) bool {
    // Decode JWT
    // Check expiration
    // Verify signature
}
```

### Scan Execution

```go
// 1. Initiate Scan
func (c *ScanClient) StartScan(ctx context.Context, url string) (*ScanResponse, error) {
    // POST /scan
    // Include JWT in Authorization header
    // Send URL/domain
    // Receive scan_id
}

// 2. Poll Scan Status
func (c *ScanClient) PollStatus(ctx context.Context, scanID string) (*ScanResult, error) {
    // GET /scan/{id}
    // Poll until status = 'complete'
    // Return full results
}

// 3. Process Results
func ProcessResults(result *ScanResult) {
    // Extract risk score, signals, threats
    // Format for display (colors, tables)
    // Save to local cache
}
```

### Configuration Management

```go
// config.yaml
cli_version: 1.0.0
portal_url: https://sentinel.hackura.app
api_url: https://api.hackura.app
device_id: a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4
auth:
  token_file: ~/.hackura/token
  session_timeout: 15m
  auto_refresh: true
ui:
  color: true
  verbose: false
logging:
  level: info
  format: json
```

---

## 🔐 SECURITY REQUIREMENTS

### Token Management
- [ ] Store JWT in file with 0600 permissions (user-only)
- [ ] Never log full JWT (only first 20 chars)
- [ ] Clear token from memory after use
- [ ] Implement token rotation
- [ ] Handle token expiration gracefully

### Device Session
- [ ] Validate device_id format (32 hex chars)
- [ ] Mask device_id in output: `a1b2••••••c3d4`
- [ ] Use HTTPS for all API calls
- [ ] Verify SSL certificates
- [ ] Implement request signing

### Error Handling
- [ ] Never expose sensitive data in errors
- [ ] Log detailed errors for debugging
- [ ] Show user-friendly error messages
- [ ] Implement retry logic with backoff
- [ ] Handle network timeouts gracefully

### Local Storage
- [ ] Use secure temp directories
- [ ] Clean up temporary files
- [ ] Encrypt sensitive config (optional)
- [ ] Set proper file permissions
- [ ] Audit all file operations

---

## 📊 CLI OUTPUT EXAMPLES

### Auth Login
```
$ hackura auth login

Opening authorization portal in your browser...
Browser: https://sentinel.hackura.app/cli/login?device_id=a1b2••••••c3d4

Waiting for authorization... ⣿ (2/180s)

✅ Authorization successful!
Token expires in: 14m 58s
Logged in as: user@example.com

$ hackura auth status

Status: authenticated
User: user@example.com
Device: a1b2••••••c3d4
Token expires: 14m 58s
Last login: 2 minutes ago
```

### Scan Command
```
$ hackura scan https://example.com

Initializing scan...
Scan ID: scan_12345abcde

[████████░░░░░░░░░░░░░░░░░░░░] 33%  (8/24s)

Scan Results:
─────────────────────────────────────
Domain:           example.com
Risk Score:       7.8/10 (HIGH)
Confidence:       94%
Status:           VULNERABLE

Risk Signals:
  • SSL Certificate Issues (High)
  • Known Infrastructure (Medium)
  • Threat Actor Activity (High)
  • Malware Detection (Low)

Related Threats:
  • APT-28 (48% confidence)
  • Carbanak (32% confidence)

Recommendations:
  ✓ Update SSL certificate immediately
  ✓ Block suspicious IP ranges
  ✓ Monitor for C2 communications

Save results? [y/n]: y
Saved to: ~/.hackura/results/example.com_2026-05-15.json
```

### Batch Scan
```
$ hackura scan --file targets.txt --async

Processing 5 targets...

✓ scanning.example.com (scan_001)
✓ admin.example.com (scan_002)
✓ api.example.com (scan_003)
⏳ mail.example.com (scan_004) - in progress
⏳ cdn.example.com (scan_005) - queued

Background scans queued. Check status with:
  hackura results list --status pending

Track progress with:
  hackura results show scan_001 --watch
```

---

## 🧪 TESTING STRATEGY

### Unit Tests
```go
// Test device ID generation
TestGenerateDeviceID()
TestValidateDeviceIDFormat()
TestMaskDeviceID()

// Test token validation
TestValidateToken()
TestTokenExpiration()
TestTokenRefresh()

// Test API client
TestAPIRequest()
TestErrorHandling()
TestRetryLogic()
```

### Integration Tests
```go
// Test with real Supabase (staging)
TestAuthFlow()
TestScanFlow()
TestTokenManagement()

// Test CLI commands
TestScanCommand()
TestAuthCommand()
TestConfigCommand()
```

### E2E Tests
```bash
# Test full flow
hackura auth login          # Interactive
hackura scan https://...    # Run scan
hackura results show        # Check results
hackura auth logout         # Cleanup
```

---

## 📦 DEPENDENCIES

```go
// go.mod
require (
    github.com/supabase/supabase-go v0.0.0-latest
    github.com/urfave/cli/v2 v2.24.0             // CLI framework
    github.com/pkg/browser v0.0.0-latest          // Open browser
    github.com/charmbracelet/lipgloss v0.8.0     // Terminal UI
    github.com/charmbracelet/bubbles v0.16.0     // UI components
    github.com/jwalton/go-supplicant v1.0.0      // Terminal spinner
    go.uber.org/zap v1.24.0                       // Logging
    github.com/spf13/viper v1.16.0                // Config management
    github.com/golang-jwt/jwt/v5 v5.0.0           // JWT parsing
)
```

---

## 🚀 BUILD & DISTRIBUTION

### Makefile Targets
```makefile
build:              Build for current OS
build-all:          Build for all platforms
test:               Run tests
lint:               Lint code
fmt:                Format code
install:            Install locally
release:            Create release builds
docker-build:       Build Docker image
```

### Cross-Platform Builds
```bash
# macOS (Apple Silicon)
GOOS=darwin GOARCH=arm64 go build -o hackura-darwin-arm64

# macOS (Intel)
GOOS=darwin GOARCH=amd64 go build -o hackura-darwin-amd64

# Linux (x86_64)
GOOS=linux GOARCH=amd64 go build -o hackura-linux-amd64

# Windows (x86_64)
GOOS=windows GOARCH=amd64 go build -o hackura-windows-amd64.exe

# Linux (ARM64)
GOOS=linux GOARCH=arm64 go build -o hackura-linux-arm64
```

---

## 📋 COMMAND SPECIFICATIONS

### `hackura auth login`

**Purpose:** Authenticate CLI with user account

**Flow:**
1. Check if already authenticated
2. Generate device_id (if new)
3. Open portal: https://sentinel.hackura.app/cli/login?device_id=...
4. Poll for token
5. Save token locally
6. Confirm success

**Flags:**
- `--force` - Force re-authentication
- `--profile <name>` - Use alternate profile
- `--no-browser` - Don't auto-open browser

**Output:**
```
✅ Authorization successful!
Token expires in: 14m 58s
Logged in as: user@example.com
```

### `hackura scan <url|domain>`

**Purpose:** Initiate security scan

**Flow:**
1. Validate URL/domain format
2. Check authentication (valid JWT)
3. POST to /scan endpoint
4. Poll for results
5. Display formatted output
6. Optionally save results

**Flags:**
- `--format json|text|csv|pdf` - Output format (default: text)
- `--save <path>` - Save results to file
- `--report` - Generate PDF report
- `--async` - Queue for background execution
- `--confidence <n>` - Min confidence threshold (0-100)

**Example:**
```bash
hackura scan https://example.com --format json --save results.json
```

### `hackura results list`

**Purpose:** Show recent scan results

**Flow:**
1. Query local result cache
2. Filter by status/date/risk
3. Display in table format
4. Show summary statistics

**Flags:**
- `--limit <n>` - Number of results (default: 10)
- `--status <pending|complete|error>` - Filter by status
- `--risk <high|medium|low>` - Filter by risk level
- `--days <n>` - Show last N days

### `hackura results show <scan-id>`

**Purpose:** Display detailed scan result

**Options:**
- `--watch` - Watch for updates (async scans)
- `--export <json|pdf>` - Export to format
- `--raw` - Show raw JSON response

---

## 🔧 ERROR HANDLING

### Authentication Errors
```
Error: Unauthorized (401)
Your authentication token has expired.

Fix: Run: hackura auth login
```

### Scan Errors
```
Error: Invalid URL format
URL must be valid HTTP(S) URL or domain name

Example: hackura scan https://example.com
```

### Network Errors
```
Error: Connection timeout (30s)
Backend API is unreachable.

Retrying in 5 seconds... (Attempt 2/3)
```

---

## 📚 DOCUMENTATION STRUCTURE

```
hackura-cli/
├── README.md                    # Quick start
├── docs/
│   ├── INSTALLATION.md          # Setup instructions
│   ├── AUTHENTICATION.md        # Auth flow details
│   ├── SCANNING.md              # Scan operations
│   ├── API_REFERENCE.md         # API endpoints
│   ├── CONFIGURATION.md         # Config options
│   ├── TROUBLESHOOTING.md       # Common issues
│   └── DEVELOPMENT.md           # Dev guide
└── examples/
    ├── basic-scan.sh            # Simple scan example
    ├── batch-scan.sh            # Batch scanning
    └── automation.yml           # GitHub Actions example
```

---

## 🎯 REQUIREMENTS CHECKLIST

### Authentication
- [ ] Generate unique device_id (32-char hex)
- [ ] Open web portal with device_id
- [ ] Poll database for JWT token
- [ ] Store token locally (secure)
- [ ] Validate token on each request
- [ ] Handle token expiration
- [ ] Support token refresh
- [ ] Implement graceful logout

### Scanning
- [ ] Accept URL or domain input
- [ ] Validate input format
- [ ] Initiate scan via API
- [ ] Poll for results
- [ ] Parse and format results
- [ ] Display risk scoring
- [ ] Show threat intelligence
- [ ] Generate reports (optional)

### API Integration
- [ ] Add JWT to all requests
- [ ] Handle 401 Unauthorized
- [ ] Implement retry logic
- [ ] Support multiple environments
- [ ] Proper error handling
- [ ] Request/response logging
- [ ] Timeout handling

### CLI UX
- [ ] Intuitive command structure
- [ ] Helpful error messages
- [ ] Colored output
- [ ] Progress indicators
- [ ] Pagination for lists
- [ ] Config management
- [ ] Version checking
- [ ] Built-in help

### Security
- [ ] Mask sensitive data
- [ ] Secure token storage
- [ ] HTTPS only
- [ ] SSL verification
- [ ] No plaintext secrets
- [ ] Audit logging
- [ ] Clean up temp files
- [ ] Validate all inputs

---

## 🎨 UI/UX Guidelines

### Colors
```go
// Success: Green (#22c55e)
// Error: Red (#ef4444)
// Warning: Yellow (#eab308)
// Info: Blue (#3b82f6)
// Highlight: Magenta (#d946ef)
```

### Styling
- Use Unicode spinner for loading: ⠋ ⠙ ⠹ ⠸ ⠼ ⠴ ⠦ ⠧ ⠇ ⠏
- Tables for structured data
- Progress bars for long operations
- Color-coded severity levels
- Consistent indentation (2 spaces)

### Accessibility
- Support NO_COLOR environment variable
- Provide plain text alternatives
- Use clear, non-jargon language
- Include examples in help text

---

## 📈 Performance Targets

| Operation | Target | Note |
|-----------|--------|------|
| CLI startup | < 100ms | - |
| Auth portal open | < 500ms | Browser launch |
| Token polling | < 30s | First token received |
| Scan initiation | < 2s | API request + response |
| Results retrieval | < 5s | For typical scan |
| Batch processing | N/A | Process 10 URLs/min |

---

## 🔄 Integration Points

### Web Portal
- Link to: https://sentinel.hackura.app/cli/login?device_id=...
- Receive: JWT token via database polling
- Send: Device info (OS, version, hostname)

### Backend API
- Base: https://api.hackura.app
- Auth: JWT in Authorization header
- Endpoints:
  - `POST /scan` - Initiate scan
  - `GET /scan/{id}` - Check status
  - `GET /results/{id}` - Get results

### Supabase
- Query: `cli_device_sessions` table
- Read: token, status, user_id
- Update: Mark session as expired

---

## 📞 Implementation Priority

**Phase 1: MVP (Week 1)**
- [x] Device auth flow
- [x] Basic scan command
- [x] JWT token management
- [x] Error handling

**Phase 2: Enhancement (Week 2)**
- [x] Batch scanning
- [x] Results caching
- [x] Configuration management
- [x] Colored output

**Phase 3: Polish (Week 3)**
- [x] Report generation
- [x] Async scanning
- [x] Auto-update checker
- [x] Comprehensive help

**Phase 4: Optimization (Week 4)**
- [x] Performance tuning
- [x] Security hardening
- [x] Cross-platform testing
- [x] Release automation

---

## ✅ SUCCESS CRITERIA

- [x] CLI successfully authenticates via web portal
- [x] JWT token retrieved and cached securely
- [x] Scans initiated and results displayed
- [x] All commands have intuitive help text
- [x] Error messages are clear and actionable
- [x] Works on macOS, Linux, and Windows
- [x] Performance meets targets
- [x] Security best practices implemented
- [x] Comprehensive documentation provided
- [x] Ready for production release

---

## 🚀 Suggested First Steps

1. **Create Go project structure** - Follow the architecture above
2. **Implement device authorization** - Auth flow with Supabase
3. **Build API client** - JWT-authenticated HTTP client
4. **Add CLI commands** - Use urfave/cli framework
5. **Implement scan flow** - End-to-end scanning
6. **Add UI polish** - Colors, spinners, formatting
7. **Write tests** - Unit, integration, E2E
8. **Document** - Usage guides and API reference
9. **Release** - Build cross-platform binaries
10. **Monitor** - Track errors and usage

---

**This prompt provides all details needed to build a production-grade CLI that mirrors the web portal's features and security!** 🚀
