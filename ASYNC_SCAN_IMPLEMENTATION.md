# Async Scan Implementation Guide

## Overview

The Hackura Sentinel AI frontend has been refactored to support **asynchronous scanning with live progress updates**. The frontend no longer blocks while waiting for the backend to complete full AI analysis.

## Architecture

### New Scan Flow

```
User Input → Frontend Initiates Scan
                    ↓
            Backend Returns scanId (immediate)
                    ↓
        Frontend Redirects to /dashboard/scan/[scanId]
                    ↓
        Frontend Polls /scan/:scanId (live updates)
                    ↓
            UI Updates Progressively
         (recon → threat intel → graph → AI)
                    ↓
            Scan Complete
```

### Key Components

#### 1. **Types** (`src/types/index.ts`)
New async scan types:
- `ScanStatus`: Enum for scan states (pending, processing, recon, threat_intelligence, graph_building, ai_enrichment, completed, failed)
- `ScanInitResponse`: Response from scan initiation
- `ScanStatusUpdate`: Progressive status updates
- `LiveScanData`: Composite data structure with progressive fields

#### 2. **API Functions** (`src/lib/api.ts`)
New async endpoints:
- `initiateScan(input)`: Starts scan, returns scanId immediately
- `getLiveScanData(scanId)`: Fetches current scan state and partial results

#### 3. **Polling Hook** (`src/hooks/useLiveScanPolling.ts`)
Custom React hook that:
- Polls scan status at configurable intervals
- Implements exponential backoff on failure
- Handles network interruptions gracefully
- Stops when scan completes or max retries exceeded

**Usage:**
```typescript
const { data, loading, error, isComplete, isFailed } = useLiveScanPolling({
  scanId: 'abc-123',
  initialPollInterval: 1500,
  maxRetries: 10,
  enableBackoff: true,
});
```

#### 4. **Live Results Page** (`src/app/dashboard/scan/[scanId]/page.tsx`)
SOC-style interface displaying:
- **Threat Score** with live updates
- **Verdict** determination
- **Confidence Score** with progress bar
- **Processing Stages** indicator
- **DNS Intelligence** data
- **GeoIP & ASN** information
- **SSL Analysis** with validity status
- **Reputation Feeds** from multiple sources
- **IOC Relationships** with detailed cards
- **Threat Relationship Graph** visualization
- **AI Threat Summary** with key findings
- **Processing Notices** for any warnings

#### 5. **Error Handling** (`src/lib/scan-error-handler.ts`)
Comprehensive error utilities:
- `classifyError()`: Categorize error types
- `isRetryableError()`: Determine if error can be retried
- `calculateBackoffDelay()`: Exponential backoff with jitter
- `getErrorMessage()`: User-friendly error strings
- `withRetry()`: Generic retry wrapper

#### 6. **Scan Submission** (`src/app/dashboard/scan/page.tsx`)
Updated to:
- Call `initiateScan()` instead of `performScan()`
- Show brief initialization loading state
- Redirect to live results page on success
- Display clear error messages on failure

## Loading States

The UI displays different loading states for each analysis phase:

```
Threat Engine Initializing
↓
Processing Stages:
  ✓ Recon (complete)
  ⟳ Threat Intel (in progress)
  ⊘ Graph (pending)
  ⊘ AI Summary (pending)
```

## Error Handling

### Network Interruptions
- Automatic retry with exponential backoff (up to 10 attempts)
- Jitter added to prevent thundering herd
- Graceful degradation when retries exhausted

### Polling Failures
- Continues displaying last known state
- User can manually retry
- Clear error messages in UI

### Partial Scan Completion
- Displays available data immediately
- Shows "Analyzing..." for pending sections
- Prevents crashes from missing data

### Graph Rendering Safety
- Validates all graph data before rendering
- Handles undefined nodes/edges gracefully
- Shows empty state when no data available
- Implements proper error boundaries

## Data Flow

### Progressive Data Structure

```typescript
interface LiveScanData {
  scanId: string;
  status: ScanStatus;
  progress: number; // 0-100
  
  recon_data?: {
    domain_info?: Record<string, any>;
    dns_records?: Record<string, any>;
    whois_data?: Record<string, any>;
    ssl_cert?: Record<string, any>;
    asn_info?: Record<string, any>;
    geoip_info?: Record<string, any>;
  };
  
  threat_intelligence?: {
    reputation_feeds?: Record<string, any>;
    ioc_relationships?: Array<{ type, indicator, context }>;
    campaigns?: string[];
    threat_actors?: string[];
    malware_associations?: string[];
  };
  
  graph_data?: GraphData;
  
  scoring?: {
    risk_score?: number;
    confidence_score?: number;
    risk_level?: 'LOW' | 'MEDIUM' | 'HIGH';
    factors?: Array<{ factor, contribution, evidence }>;
  };
  
  ai_summary?: {
    summary: string;
    verdict: string;
    key_findings: string[];
    recommendations: string[];
  };
  
  errors?: Array<{ phase, message, recoverable }>;
}
```

## UI Components

### SOC-Style Dashboard Cards

1. **ScoringCard**: Displays threat score with color-coded intensity
2. **VerdictCard**: Shows verdict with animated loading state
3. **ConfidenceCard**: Animated confidence progress bar
4. **StatusIndicatorsCard**: Shows completion status of each phase
5. **DNSIntelligenceCard**: DNS records and resolution data
6. **GeoIPCard**: Geographic and ASN information
7. **SSLAnalysisCard**: Certificate validation and details
8. **ReputationFeedsCard**: Multi-source reputation checks
9. **IOCRelationshipsCard**: Indicator relationships
10. **AISummaryCard**: AI-generated threat analysis

All cards include:
- Loading skeletons while data loads
- Graceful fallbacks for missing data
- Live updates as data becomes available
- Color-coded risk indicators

## Polling Configuration

Default polling settings:
```typescript
{
  scanId: 'string',
  initialPollInterval: 1500,  // milliseconds
  maxRetries: 10,
  enableBackoff: true,
}
```

Backoff calculation:
- Delay = min(1500 * 1.5^attempt, 5000)
- ±20% jitter added
- Exponential backoff slows requests naturally

## Migration Notes

### For Backend Implementation
Backend should implement:

1. **POST /scan/initiate**
   ```json
   {
     "input": "example.com",
     "type": "domain"
   }
   ```
   Response:
   ```json
   {
     "success": true,
     "scanId": "uuid",
     "status": "processing",
     "created_at": "2026-05-13T00:00:00Z"
   }
   ```

2. **GET /scan/:scanId**
   Return `LiveScanData` structure with progressive fields

3. **Status Values**:
   - `pending`: Scan queued
   - `processing`: Initial analysis
   - `recon`: Reconnaissance phase
   - `threat_intelligence`: TI gathering
   - `graph_building`: Relationship mapping
   - `ai_enrichment`: AI analysis
   - `completed`: Finished successfully
   - `failed`: Error occurred

## Performance Optimizations

1. **Poll Interval Management**:
   - Starts at 1.5 seconds
   - Increases exponentially to 5 seconds max
   - Reduces server load during long scans

2. **Graph Rendering**:
   - Lazy-loaded with dynamic imports
   - Properly validates data before rendering
   - Handles large datasets efficiently

3. **Memory Management**:
   - Polling stops automatically when scan completes
   - Proper cleanup on component unmount
   - Aborts pending requests to prevent memory leaks

## Testing Scenarios

### Scenario 1: Fast Scan (< 10 seconds)
- User submits domain
- Frontend receives scanId immediately
- Polls every 1.5s
- All data arrives within 2-3 polls
- Graph renders automatically

### Scenario 2: Slow Scan (> 60 seconds)
- Poll interval backs off to 5 seconds
- UI shows progressive updates
- User can refresh/navigate without losing state
- Scan continues in background

### Scenario 3: Network Interruption
- Polling fails
- Auto-retry with backoff
- After 10 attempts, shows error
- User can manually retry
- Last known state displayed

### Scenario 4: Partial Failure
- Recon completes
- Threat Intel fails but recovers
- Graph still builds from available data
- AI summary attempts with partial data
- Error logged but UI doesn't crash

## Security Considerations

1. **Scan ID Privacy**: ScanID is UUID, not sequential
2. **Rate Limiting**: Polling respects server rate limits with backoff
3. **Authentication**: All requests include auth token
4. **Data Validation**: All backend data validated before rendering
5. **XSS Prevention**: React escapes all user input

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE11: ❌ Not supported (Next.js 16 requirement)

## Known Limitations

1. **WebSocket Support**: Currently uses polling, WebSocket upgrade available
2. **Offline Mode**: Scans cannot be initiated offline
3. **Graph Size**: Very large graphs (10,000+ nodes) may render slowly
4. **Concurrent Scans**: One active scan per browser tab

## Future Enhancements

1. WebSocket upgrade for real-time updates
2. Persistent scan history with timestamps
3. Export scan results as PDF/JSON
4. Scheduled scans and automation
5. Advanced filtering and search on graph
6. Scan comparison and diff tools
7. Custom alerting rules
8. Integration with SIEM systems
