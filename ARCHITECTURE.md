# Hackura Sentinel AI - Architecture & Flow Diagrams

## Application Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     HACKURA SENTINEL AI                          │
│                     Web Dashboard (Next.js)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   FRONTEND LAYER                          │  │
│  │                                                            │  │
│  │  Pages:                  Components:                      │  │
│  │  ├─ / (Landing)          ├─ Sidebar                      │  │
│  │  ├─ /dashboard           ├─ GlassCard                    │  │
│  │  ├─ /dashboard/scan      ├─ RiskBadge                    │  │
│  │  ├─ /dashboard/graph     ├─ Button                       │  │
│  │  ├─ /dashboard/history   ├─ ScanInput                    │  │
│  │  └─ /dashboard/settings  ├─ GraphVisualizer             │  │
│  │                          ├─ OverviewCard                │  │
│  │  Styling:               └─ ScanCard                     │  │
│  │  • TailwindCSS v4                                         │  │
│  │  • Framer Motion                                          │  │
│  │  • Dark Cybersecurity Theme                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                    │
│                              │                                    │
│  ┌──────────────────────────▼─────────────────────────────────┐ │
│  │                    STATE & LOGIC LAYER                      │ │
│  │                                                              │ │
│  │  ├─ React Hooks (useState, useEffect)                      │ │
│  │  ├─ API Client (Axios)                                     │ │
│  │  ├─ Auth (Supabase)                                        │ │
│  │  └─ Type Definitions (TypeScript)                          │ │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                    │
│                              │                                    │
│  ┌──────────────────────────▼─────────────────────────────────┐ │
│  │                    API INTEGRATION LAYER                    │ │
│  │                                                              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │ │
│  │  │  Supabase    │  │   API        │  │  Neo4j       │    │ │
│  │  │  - Auth      │  │  - Scans     │  │  AuraDB      │    │ │
│  │  │  - Database  │  │  - Graph     │  │  - Graph     │    │ │
│  │  └──────────────┘  │  - Health    │  │    Data      │    │ │
│  │                    └──────────────┘  └──────────────┘    │ │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
USER INTERACTION
       │
       ▼
┌─────────────────────┐
│  User Input/Action  │
│  - Scan URL         │
│  - Explore Graph    │
│  - View History     │
└─────────────────────┘
       │
       ▼
┌─────────────────────┐
│ React Component     │
│ State Update        │
└─────────────────────┘
       │
       ▼
┌─────────────────────┐
│ API Client Call     │
│ (axios)             │
└─────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│        Backend API (api.hackura.app)    │
├─────────────────────────────────────────┤
│  ├─ POST /scan                          │
│  ├─ GET /graph/{entity}                 │
│  └─ GET /health                         │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│   Database & Intelligence Layer         │
├─────────────────────────────────────────┤
│  ├─ Supabase (Auth & Scan History)     │
│  ├─ Neo4j AuraDB (Graph Data)          │
│  └─ AI Models (Threat Detection)       │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────────────┐
│ API Response (JSON) │
└─────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Parse & Update React State   │
│ - ScanResult data            │
│ - GraphData structure        │
│ - Loading states             │
└──────────────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Render Components with       │
│ - Framer Motion Animations   │
│ - TailwindCSS Styling        │
│ - Dynamic Data               │
└──────────────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Display in Browser           │
│ Update DOM                   │
│ Show Results to User         │
└──────────────────────────────┘
```

---

## Page Navigation Flow

```
                          ┌─────────────────┐
                          │  Landing Page   │
                          │      (/)        │
                          └────────┬────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
            ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
            │    Learn     │ │   Features   │ │   Launch     │
            │   More       │ │   Section    │ │   Dashboard  │
            └──────────────┘ └──────────────┘ └────────┬─────┘
                                                       │
                    ┌──────────────────────────────────┘
                    │
                    ▼
        ┌─────────────────────────────────┐
        │   Dashboard Layout              │
        │   (with Sidebar)                │
        ├─────────────────────────────────┤
        │  Sidebar Routes:                │
        │  ├─ 📊 Dashboard (home)         │
        │  ├─ 🔍 Scan (/scan)            │
        │  ├─ 🕸️  Graph (/graph)         │
        │  ├─ 📜 History (/history)      │
        │  └─ ⚙️  Settings (/settings)   │
        └──────────┬──────────────────────┘
                   │
        ┌──────────┴──────────────────────────────┐
        │                                          │
        ▼                                          ▼
    ┌─────────────┐                         ┌─────────────┐
    │  Dashboard  │◄────────────────────────►│    Scan     │
    │  (Overview) │                         │  (Engine)   │
    └────────┬────┘                         └──────┬──────┘
             │                                     │
    ┌────────┴──────────────────────────────────┬─┴──────┐
    │                                            │        │
    ▼                                            ▼        ▼
┌──────────────┐  ┌────────────────┐  ┌─────────────────────┐
│   History    │  │   Graph        │  │   Settings          │
│  (View Logs) │  │ (Visualize)    │  │ (Profile & API)     │
└──────────────┘  └────────────────┘  └─────────────────────┘
```

---

## Component Tree

```
RootLayout
├── page.tsx (Landing)
│   ├── Navigation
│   ├── Hero Section
│   ├── Features Grid
│   └── Footer
│
└── dashboard/layout.tsx (DashboardLayout)
    ├── Sidebar
    │   ├── Logo
    │   ├── Navigation Menu
    │   │   ├── Dashboard
    │   │   ├── Scan
    │   │   ├── Graph
    │   │   ├── History
    │   │   └── Settings
    │   └── Footer Info
    │
    └── Page Content
        ├── dashboard/page.tsx (Dashboard Home)
        │   ├── Header
        │   ├── OverviewCard (x4)
        │   ├── SimpleRiskChart
        │   └── ScanCard[] (Recent)
        │
        ├── scan/page.tsx (Scan Engine)
        │   ├── Header
        │   ├── ScanInput
        │   └── ScanResult
        │       ├── Risk Score Circle
        │       ├── RiskBadge
        │       ├── AI Explanation
        │       ├── Risk Signals
        │       └── Recommendations
        │
        ├── graph/page.tsx (Graph Explorer)
        │   ├── Header
        │   ├── Search Input
        │   ├── GraphVisualizer
        │   ├── Nodes Panel
        │   ├── Edges Panel
        │   └── Stats Panel
        │
        ├── history/page.tsx (Scan History)
        │   ├── Header
        │   ├── Filter Buttons
        │   ├── ScanCard[] (Expandable)
        │   └── Statistics
        │
        └── settings/page.tsx (Settings)
            ├── User Profile
            ├── API Status
            ├── Preferences
            ├── API Keys
            └── Danger Zone
```

---

## Authentication Flow

```
User Landing Page
       │
       ├─► Not Authenticated
       │   └─ Show public pages
       │      ├─ Landing page
       │      └─ Features
       │
       └─► Wants to Access Dashboard
           │
           ▼
       Sign In / Sign Up
       ├─ Email/Password
       └─ Google OAuth
           │
           ▼
       Supabase Auth
       └─ Create session
           │
           ▼
       Redirect to Dashboard
       │
       ▼
       Protected Routes
       ├─ Check auth token
       ├─ If valid → Allow access
       └─ If invalid → Redirect to login
           │
           ▼
       Dashboard Available
       ├─ Access /dashboard
       ├─ Access /scan
       ├─ Access /graph
       ├─ Access /history
       └─ Access /settings
           │
           ▼
       Logout
       └─ Clear session
           │
           ▼
       Redirect to Landing Page
```

---

## Scan Workflow

```
User enters URL
    │
    ▼
Input Validation
├─ Check format
├─ Detect type (URL/domain/text)
└─ Valid?
    │
    ├─ No → Show error
    │
    └─ Yes → Continue
        │
        ▼
    Submit to API
    ├─ POST /scan
    ├─ With input + type
    └─ Show loading spinner
        │
        ▼
    API Processing
    ├─ AI threat detection
    ├─ Risk calculation
    ├─ Signal analysis
    └─ Generate explanation
        │
        ▼
    Receive Response
    ├─ risk_score (0-100)
    ├─ risk_level (LOW/MEDIUM/HIGH)
    ├─ ai_explanation
    ├─ risk_signals[]
    └─ confidence_score
        │
        ▼
    Display Results
    ├─ Animated risk circle
    ├─ Risk signals badges
    ├─ AI explanation text
    ├─ Recommendations
    └─ Save to history
        │
        ▼
    User Actions
    ├─ View full report
    ├─ Rescan
    ├─ Share result
    └─ Explore graph
```

---

## Graph Exploration Workflow

```
User Searches for Entity
    │
    ▼
Input Entity Name
├─ Domain
├─ IP address
├─ Campaign name
└─ Malware hash
    │
    ▼
API Query
├─ GET /graph/{entity}
└─ Request graph structure
    │
    ▼
Neo4j AuraDB
├─ Find entity node
├─ Traverse relationships
├─ Collect connected nodes
└─ Return edges
    │
    ▼
Receive GraphData
├─ nodes[]
│   ├─ id
│   ├─ label
│   ├─ type
│   └─ risk_level
└─ edges[]
    ├─ source
    ├─ target
    └─ relationship
    │
    ▼
Render Visualization
├─ Calculate positions (circular layout)
├─ Draw edges (SVG lines)
├─ Draw nodes (SVG circles)
├─ Add labels
└─ Color by risk level
    │
    ▼
Display Interactive Graph
├─ Show nodes panel
├─ Show edges panel
├─ Show statistics
└─ Allow user interaction
    │
    ▼
User Actions
├─ Click node for details
├─ Export graph
├─ Perform new search
└─ Explore different entity
```

---

## Responsive Design Breakpoints

```
Mobile (< 640px)
├─ Sidebar hidden (hamburger menu)
├─ Single column layout
├─ Stacked cards
└─ Full-width inputs

Tablet (640px - 1024px)
├─ Sidebar collapsible
├─ 2-column grid
├─ Larger touch targets
└─ Optimized spacing

Desktop (> 1024px)
├─ Fixed sidebar
├─ Multi-column layouts
├─ Hover effects
└─ Full feature set
```

---

## Performance Optimization Strategy

```
Code Splitting
├─ Per-page bundling
├─ Dynamic imports for modals
└─ Lazy load components

Asset Optimization
├─ SVG for graphics
├─ No external images
├─ TailwindCSS purging
└─ Minified bundle

Caching
├─ Browser cache headers
├─ Service Worker (future)
├─ Redis cache backend (future)
└─ Database query cache

Loading Strategy
├─ Skeleton states
├─ Progressive enhancement
├─ Graceful degradation
└─ Error boundaries
```

---

## Security Architecture

```
Frontend Security
├─ Input validation
├─ Output encoding
├─ CSRF protection
├─ XSS prevention
└─ CSP headers

Authentication
├─ Supabase Auth
├─ Session tokens
├─ HTTP-only cookies
└─ HTTPS enforcement

API Security
├─ Rate limiting
├─ API key validation
├─ CORS configuration
└─ Request verification

Data Protection
├─ Encrypted transmission
├─ Secure storage
├─ User isolation
└─ Audit logging
```

---

**Generated:** May 10, 2026
**Version:** 1.0.0
