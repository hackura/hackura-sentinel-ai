# Copy-Paste Ready: GoLang CLI Development Prompt

> **How to use this:** Copy everything below the "---" line and paste directly into Claude, ChatGPT, or your AI assistant of choice. This is a self-contained, complete specification for building the CLI.

---

You are an expert Go developer tasked with building a production-grade CLI tool for Hackura Sentinel AI. The CLI must authenticate users through a web portal, perform security scans, and manage device sessions using JWT tokens.

## PROJECT REQUIREMENTS

Build a CLI tool that mirrors a web authentication portal with these exact features:

### 1. Device Authorization Flow
- Generate unique 32-character hex device IDs
- Automatically open web browser to: https://sentinel.hackura.app/cli/login?device_id=<generated-id>
- Poll Supabase database for JWT token (every 6 seconds, timeout 15 minutes)
- Store JWT securely in ~/.sentinel/token (0600 permissions)
- Mask device IDs in all output (show as: a1b2••••••c3d4)
- Provide logout command that revokes session

### 2. Scan Operations
- Accept URLs or domains as input
- Validate input format (HTTP/HTTPS URL or domain name)
- Initiate scans via API with JWT authentication
- Poll for results until completion
- Display results with: risk score, confidence, threat signals, related threat actors
- Support output formats: text, JSON, CSV, PDF
- Support batch scanning from file
- Support async/background scanning

### 3. Authentication Integration
- Add JWT token to all API requests in Authorization header format: "Bearer <token>"
- Check token validity before each request
- Automatically redirect to auth if token invalid/expired
- Handle 401 Unauthorized responses
- Support multiple configuration profiles

### 4. CLI Command Structure
```
sentinel login              # Authenticate via portal
sentinel logout             # Revoke token
sentinel status             # Show current status
sentinel scan <url|domain>       # Scan URL or domain
sentinel scan --file <paths>     # Batch scan
sentinel scan --async            # Background scan
sentinel results list            # Show recent results
sentinel results show <id>       # Show specific result
sentinel config set <key> <val>  # Set config
sentinel version                 # Show version
```

## TECHNICAL SPECIFICATIONS

### Project Structure
```
hackura-cli/
├── cmd/hackura/main.go                 # Entry point
├── internal/auth/device.go             # Device ID generation
├── internal/auth/session.go            # Token polling
├── internal/auth/browser.go            # Browser opening
├── internal/api/client.go              # HTTP client with JWT
├── internal/api/scan.go                # Scan endpoints
├── internal/config/config.go           # Configuration
├── internal/models/                    # Data structures
├── internal/ui/output.go               # Formatted output
├── pkg/supabase/client.go              # Supabase integration
├── pkg/scanner/scanner.go              # Scan orchestration
├── go.mod
├── Makefile
└── README.md
```

### Database Integration
Query the `cli_device_sessions` table from Supabase:
- Fields: device_id, user_id, email, token, status, authenticated_at, expires_at
- Poll until status changes from 'pending' to 'authenticated'
- Extract JWT from token field
- Check expires_at for validity (default 15 minutes)
- Mark as 'expired' when done

### API Integration
- Base URL: https://api.hackura.app
- Authentication: JWT in Authorization header
- Endpoints needed:
  - POST /scan (submit scan request)
  - GET /scan/{id} (check status)
  - GET /results/{id} (retrieve results)

### Supabase SDK
Use github.com/supabase/supabase-go for database access

### CLI Framework
Use github.com/urfave/cli/v2 for command structure

### UI Components
- Use github.com/charmbracelet/lipgloss for styling
- Use spinners for loading states
- Support NO_COLOR environment variable

## SECURITY REQUIREMENTS

✓ Store JWT in secure file with 0600 permissions (user only)
✓ Never log full JWT tokens (only first 20 characters)
✓ Mask all device IDs in output and logs
✓ Use HTTPS for all API calls
✓ Verify SSL certificates
✓ Never hardcode credentials
✓ Clear token from memory after use
✓ Handle token expiration gracefully
✓ Validate all user input
✓ Implement request signing/verification

## ERROR HANDLING

- Show user-friendly error messages
- Log detailed errors for debugging
- Implement retry logic with exponential backoff
- Handle network timeouts (30 second default)
- Gracefully handle missing/invalid tokens
- Provide actionable recovery steps

## TESTING STRATEGY

- Unit tests for device ID generation and validation
- Unit tests for token management
- Integration tests with real Supabase (staging)
- E2E tests for full auth and scan flows
- Mock API responses for testing
- Cross-platform testing (macOS, Linux, Windows)

## PERFORMANCE TARGETS

- CLI startup: < 100ms
- Auth portal open: < 500ms
- First token received: < 30 seconds
- Scan initiation: < 2 seconds
- Results retrieval: < 5 seconds

## OUTPUT EXAMPLES

### Successful Auth
```
$ sentinel login

Opening authorization portal in your browser...
Browser: https://sentinel.hackura.app/cli/login?device_id=a1b2••••••c3d4

Waiting for authorization... ⣿ (2/180s)

✅ Authorization successful!
Token expires in: 14m 58s
Logged in as: user@example.com
```

### Scan Results
```
$ sentinel scan https://example.com

Initializing scan...
Scan ID: scan_12345

[████████░░░░░░░░░░░░░░░░░░░░] 33%  (8/24s)

Scan Results:
─────────────────────────────────────
Domain:           example.com
Risk Score:       7.8/10 (HIGH)
Confidence:       94%

Risk Signals:
  • SSL Certificate Issues (High)
  • Known Infrastructure (Medium)

Related Threats:
  • APT-28 (48% confidence)
  • Carbanak (32% confidence)

Recommendations:
  ✓ Update SSL certificate immediately
  ✓ Block suspicious IP ranges
```

## IMPLEMENTATION PHASES

### Phase 1: MVP (Essential)
- Device ID generation and validation
- Browser opening (os.Exec for cross-platform)
- Supabase polling for JWT token
- Local token storage
- Basic scan command with API integration
- Error handling and logging

### Phase 2: Enhancement
- Batch scanning from file
- Results caching
- Configuration file management
- Colored output and progress indicators
- Multiple output formats (JSON, CSV)

### Phase 3: Polish
- Report generation
- Async background scanning
- Auto-update checking
- Comprehensive help text
- Better error messages

### Phase 4: Optimization
- Performance profiling and tuning
- Security audit and hardening
- Cross-platform binary releases
- CI/CD automation
- Docker support

## SUCCESS CRITERIA

✓ CLI generates unique device IDs (32-char hex format)
✓ Browser automatically opens to auth portal
✓ JWT token successfully retrieved and stored
✓ API requests include proper Authorization header
✓ Scans initiated and results displayed correctly
✓ All commands have helpful --help output
✓ Error messages are clear and actionable
✓ Works on macOS, Linux, and Windows
✓ Performance meets specified targets
✓ Security best practices implemented
✓ Comprehensive error handling
✓ Ready for production use

## ADDITIONAL NOTES

- Follow Go idioms and conventions
- Use structured logging (slog or zap)
- Include comprehensive comments
- Support environment variables for configuration
- Implement graceful shutdown
- Handle SIGINT for clean cancellation
- Test with real Supabase instance (staging)
- Ensure cross-platform compatibility
- Provide detailed README with examples

This is a production-grade CLI tool that must match the security, UX, and functionality of the accompanying web authentication portal.

---

**Ready to implement?** Just paste this entire message into Claude and ask it to build the CLI based on these specifications. It will have everything needed to create a complete, production-ready Go CLI tool!
