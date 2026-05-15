# GoLand CLI Development - Quick Start

## 📍 Location
The complete GoLand prompt is in: **GOLAND_CLI_PROMPT.md**

## 🎯 What This Prompt Covers

The GoLang CLI prompt includes:

### ✅ **Full Architecture**
- Complete project structure with 15+ modules
- Clear separation of concerns
- Production-ready organization

### ✅ **Device Authorization** (Mirrors Web Portal)
- Generate unique device_id (32-char hex)
- Auto-open browser to: `https://sentinel.hackura.app/cli/login?device_id=...`
- Poll Supabase database for JWT token
- Secure local token storage
- Automatic cleanup and logout

### ✅ **Scanning Features**
- Single URL scanning
- Domain-wide scanning
- Batch scanning from files
- Async background scanning
- Results caching and retrieval
- Report generation (PDF, JSON, CSV)

### ✅ **Authentication Integration**
- JWT token management
- Token expiration handling
- Automatic token refresh
- Secure Authorization headers
- Multi-profile support

### ✅ **Command Structure**
```bash
hackura auth login              # Portal-based auth
hackura auth logout             # Revoke token
hackura auth status             # Show status
hackura scan <url>              # Scan URL
hackura results list            # Show results
hackura config set <key> <val>  # Configuration
hackura version                 # Version info
```

### ✅ **Security** (Production-Grade)
- Secure token storage (0600 file permissions)
- Device ID masking in output (`a1b2••••••c3d4`)
- HTTPS enforcement
- SSL certificate verification
- Request signing
- Error handling without leaking secrets

### ✅ **User Experience**
- Colored output (success/error/warning)
- Loading spinners
- Progress indicators
- Formatted tables
- Helpful error messages
- Auto-browser opening

### ✅ **Developer Features**
- Comprehensive error handling
- Debug logging
- Configuration management
- Unit/integration/E2E tests
- Cross-platform builds (macOS, Linux, Windows)
- Docker support

### ✅ **Documentation**
- Full API reference
- CLI output examples
- Configuration guide
- Troubleshooting section
- Development guide

---

## 🚀 How to Use This Prompt

### Option 1: Direct Copy-Paste
1. Copy the entire `GOLAND_CLI_PROMPT.md` file
2. Paste into Claude/ChatGPT/your favorite AI assistant
3. Ask them to implement the CLI based on the prompt

### Option 2: Section by Section
1. Pick a phase (MVP, Enhancement, Polish, Optimization)
2. Copy that section
3. Ask AI to implement just that phase
4. Iterate phase by phase

### Option 3: Use as Reference
1. Start coding your own CLI
2. Reference the prompt sections as you build
3. Follow the architecture and patterns suggested

---

## 📋 What's Included

| Section | Lines | Purpose |
|---------|-------|---------|
| Overview | 50 | Project goals |
| Tech Stack | 20 | Dependencies |
| Architecture | 50 | File structure |
| Features | 100 | Feature descriptions |
| Implementation | 150 | Code examples & functions |
| Security | 40 | Security requirements |
| CLI Output | 80 | User interface examples |
| Testing | 40 | Test strategy |
| Commands | 100 | Command specifications |
| Error Handling | 30 | Error scenarios |
| Documentation | 20 | Docs structure |
| Build & Distribution | 30 | Makefile & builds |
| Integration | 20 | API integration points |
| **TOTAL** | **720+ lines** | Complete specification |

---

## 🎯 Key Features Matched to Web Portal

| Feature | Web Portal | CLI |
|---------|-----------|-----|
| Device Authorization | ✅ Web form | ✅ Auto-browser open |
| OAuth Support | ✅ GitHub/Google | ✅ Portal-based |
| JWT Token Management | ✅ Session storage | ✅ Local secure storage |
| Supabase Integration | ✅ Direct queries | ✅ Polling queries |
| Error Handling | ✅ User-friendly | ✅ User-friendly |
| Masked Device ID | ✅ `dbd4••••03f0` | ✅ `dbd4••••03f0` |
| Security First | ✅ RLS policies | ✅ HTTPS only |
| Logging | ✅ Masked sensitive data | ✅ Masked sensitive data |

---

## 🏗️ Implementation Phases

### Phase 1: MVP (Week 1)
- Device auth flow with portal
- Basic scan command
- JWT token management
- Error handling
- **Time:** ~15-20 hours

### Phase 2: Enhancement (Week 2)
- Batch scanning
- Results caching
- Configuration management
- Colored output
- **Time:** ~10-15 hours

### Phase 3: Polish (Week 3)
- Report generation
- Async scanning
- Auto-update checking
- Comprehensive help
- **Time:** ~8-10 hours

### Phase 4: Optimization (Week 4)
- Performance tuning
- Security hardening
- Cross-platform testing
- Release automation
- **Time:** ~6-8 hours

---

## 💻 Sample Commands After Implementation

```bash
# Authenticate
$ hackura auth login
Opening authorization portal in your browser...
✅ Authorization successful!

# Run a scan
$ hackura scan https://example.com
Initializing scan...
[████████░░░░░░░░░░░░░░░░░░░░] 33%
Risk Score: 7.8/10 (HIGH)

# Check results
$ hackura results list
ID                Status    Domain              Risk    Score
scan_12345       complete  example.com         HIGH    7.8
scan_12346       complete  test.example.com    MEDIUM  4.2

# Batch scan
$ hackura scan --file targets.txt --async
✓ 5 scans queued for background processing
```

---

## 🔍 What Makes This Production-Grade

✅ **Complete Architecture** - All files and modules documented
✅ **Security Focused** - Token management, data masking, HTTPS
✅ **User Friendly** - Colored output, progress bars, helpful errors
✅ **Well Tested** - Unit, integration, and E2E test suggestions
✅ **Cross-Platform** - macOS, Linux, Windows support
✅ **Fully Documented** - 720+ lines of specifications
✅ **Mirrors Web Portal** - Same auth flow, same security standards
✅ **Performance Optimized** - Target metrics provided
✅ **Error Handling** - Clear, actionable error messages
✅ **Extensible** - Easy to add new commands and features

---

## 📚 Related Documentation

The CLI prompt builds on the web portal implementation:
- **Web Portal:** CLI_AUTH_PORTAL_GUIDE.md
- **Architecture:** CLI_AUTH_PORTAL_GUIDE.md
- **Security:** CLI_AUTH_PORTAL_GUIDE.md
- **Deployment:** CLI_AUTH_DEPLOYMENT_GUIDE.md

Both the web portal and CLI use the same:
- ✅ Device ID format (32-char hex)
- ✅ Authorization flow (device linking)
- ✅ JWT token management
- ✅ Supabase database
- ✅ Backend API
- ✅ Security standards

---

## 🎓 Learning Path

If you're new to Go CLI development:

1. **Basics** - Start with simple HTTP client
2. **Authentication** - Implement JWT token flow
3. **CLI Framework** - Use urfave/cli for commands
4. **Supabase** - Add database queries
5. **UI Polish** - Add colors and spinners
6. **Testing** - Write comprehensive tests
7. **Distribution** - Build for multiple platforms

Each is documented in the GOLAND_CLI_PROMPT.md

---

## 🚀 Next Steps

1. **Read** GOLAND_CLI_PROMPT.md completely
2. **Choose** implementation approach (AI-assisted or manual)
3. **Setup** Go project structure
4. **Implement** Phase 1 (MVP)
5. **Test** thoroughly
6. **Deploy** cross-platform binaries
7. **Monitor** usage and errors
8. **Iterate** based on feedback

---

## 📞 Questions?

If you need clarification on any part:
1. Check the specific section in GOLAND_CLI_PROMPT.md
2. Cross-reference with web portal documentation
3. Review CLI output examples provided
4. Check the security and testing sections

---

**Everything you need to build a production-grade Go CLI is in GOLAND_CLI_PROMPT.md!** 🚀

The CLI will mirror all features of the web portal while providing a powerful command-line interface for security scanning and device authorization.
