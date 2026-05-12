# Hackura Sentinel AI - Web Dashboard

A production-grade cybersecurity intelligence dashboard built with Next.js 14+, TypeScript, TailwindCSS, and Framer Motion.

## Features

- **🔍 URL Scanning**: Analyze URLs, domains, and text for threats
- **🕸️ Graph Explorer**: Visualize threat relationships using Neo4j AuraDB
- **📊 Risk Dashboard**: Monitor threats and risk trends in real-time
- **📜 Scan History**: Track and review all previous analyses
- **⚙️ Settings**: Manage user profile, API status, and preferences
- **🎨 Dark Cybersecurity UI**: Enterprise SOC dashboard aesthetic with glassmorphism and neon accents

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **Animations**: Framer Motion
- **Backend API**: Supabase + Neo4j AuraDB
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
cp .env.example .env.local
```

3. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=https://api.hackura.app
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout
│   └── dashboard/
│       ├── layout.tsx           # Dashboard layout with sidebar
│       ├── page.tsx             # Dashboard home
│       ├── scan/page.tsx        # Scan engine
│       ├── graph/page.tsx       # Graph explorer
│       ├── history/page.tsx     # Scan history
│       └── settings/page.tsx    # Settings
├── components/
│   ├── ui.tsx                   # Base UI components
│   ├── dashboard.tsx            # Dashboard components
│   ├── graph.tsx                # Graph visualization
│   └── sidebar.tsx              # Navigation
├── lib/
│   ├── supabase.ts             # Supabase client
│   └── api.ts                   # Backend API
└── types/
    └── index.ts                 # TypeScript types
```

## Pages

### Landing Page (`/`)
- Hero section with call-to-action
- Feature highlights
- Professional cybersecurity branding

### Dashboard Home (`/dashboard`)
- Overview statistics (Total Scans, Risk Alerts, etc.)
- Risk distribution chart
- Recent scan cards
- Quick stats panel

### Scan Engine (`/dashboard/scan`)
- URL/domain/text input with autocomplete examples
- Mock scan results
- Risk score (0-100) visualization
- AI explanation of findings
- Risk signals display
- Actionable recommendations

### Graph Explorer (`/dashboard/graph`)
- Entity search box
- SVG-based circular graph visualization
- Node and relationship listing
- Network statistics (density, node count, etc.)
- Suggested queries

### Scan History (`/dashboard/history`)
- Filterable scan list (LOW/MEDIUM/HIGH)
- Expandable result details
- Rescan functionality
- Statistics summary

### Settings (`/dashboard/settings`)
- User profile management
- API health status
- Preferences (notifications, 2FA, etc.)
- API key management
- System information

## Components

### UI Components
- **GlassCard**: Glassmorphism card with hover animations
- **RiskBadge**: Risk level indicator (LOW/MEDIUM/HIGH)
- **Button**: Animated primary/secondary/danger button
- **LoadingSpinner**: Rotating Framer Motion spinner

### Dashboard Components
- **OverviewCard**: Statistics card with trend indicator
- **ScanCard**: Scan result preview card
- **SimpleRiskChart**: Animated risk distribution chart
- **ScanInput**: Search input with async submit

### Graph Components
- **GraphVisualizer**: SVG graph with circular node layout

## API Integration

Backend API endpoints (replace with your backend):

```typescript
// Scans
POST https://api.hackura.app/scan
{ input: string, type: 'url' | 'domain' | 'text' }

// Graph data
GET https://api.hackura.app/graph/{entity}

// Health check
GET https://api.hackura.app/health
```

API module: `src/lib/api.ts`

## Styling

**TailwindCSS v4** with dark theme:
- Primary: Purple (#9333ea)
- High Risk: Red (#dc2626)
- Medium Risk: Yellow (#eab308)
- Low Risk: Green (#16a34a)
- Background: Black/Zinc shades
- Glass effect: `backdrop-blur-xl` with transparent backgrounds

## Animations

**Framer Motion** throughout:
- Page transitions (`initial`, `animate`, `exit`)
- Staggered container animations
- Hover/tap effects on interactive elements
- SVG circle animations for risk scores
- Loading spinners

## Environment Variables

Create `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Backend API
NEXT_PUBLIC_API_URL=https://api.hackura.app
```

## Authentication

Supabase auth (`src/lib/supabase.ts`):
- Email/password signup and login
- Google OAuth integration
- Session management

## Demo Data

The application uses mock data for demonstration:
- Dashboard stats
- Scan results
- Graph relationships
- API health status

Replace with real API calls in `src/lib/api.ts` for production.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Performance

- Next.js automatic code splitting
- TailwindCSS CSS purging
- Framer Motion GPU animations
- Responsive SVG graphs

## Deployment

### Vercel
```bash
npm run build
vercel deploy
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["npm", "start"]
```

## Troubleshooting

**Missing dependencies**: `npm install`

**Supabase connection**: Check `.env.local` variables

**API errors**: Verify backend is running and CORS is configured

## Future Enhancements

- [ ] Real-time threat feeds (WebSocket)
- [ ] Advanced graph filtering
- [ ] PDF/CSV report export
- [ ] Custom dashboard widgets
- [ ] SIEM integrations
- [ ] Mobile responsive optimization
- [ ] Theme toggle

## License

© 2026 Hackura Sentinel AI
