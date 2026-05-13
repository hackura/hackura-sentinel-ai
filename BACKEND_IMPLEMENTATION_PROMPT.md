# Backend Implementation Task: Async Scan Endpoints

## Overview
The frontend has been refactored to support asynchronous scanning. You need to implement two new API endpoints to support this flow.

**Live Backend:** `api.hackura.app`

---

## Endpoint 1: Initiate Scan (POST)

### Route
```
POST /scan/initiate
```

### Authentication
- Bearer token required (same as existing /scan endpoint)

### Request Body
```json
{
  "input": "example.com",
  "type": "domain"
}
```

**Fields:**
- `input` (string, required): Domain, URL, IP, or text to scan
- `type` (string, required): One of `domain`, `url`, `ip`, `text`

### Response (200 OK)
```json
{
  "success": true,
  "scanId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing",
  "input": "example.com",
  "created_at": "2026-05-13T12:00:00Z"
}
```

### Error Responses
- **400 Bad Request**: Invalid input
- **401 Unauthorized**: Missing/invalid auth token
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

### Requirements
1. Generate a unique UUID for `scanId`
2. Queue the scan for processing (don't wait for completion)
3. Return immediately with scanId
4. Store scan metadata (input, user, timestamp)
5. Start background processing asynchronously

---

## Endpoint 2: Get Scan Status (GET)

### Route
```
GET /scan/:scanId
```

### Authentication
- Bearer token required
- User can only access their own scans

### Query Parameters (Optional)
- `fields`: Comma-separated field names (e.g., `?fields=scoring,recon_data`)

### Response (200 OK)
Complete response with all available data for the current phase:

```json
{
  "success": true,
  "data": {
    "scanId": "550e8400-e29b-41d4-a716-446655440000",
    "input": "example.com",
    "status": "threat_intelligence",
    "progress": 45,
    "created_at": "2026-05-13T12:00:00Z",
    "updated_at": "2026-05-13T12:00:15Z",
    
    "recon_data": {
      "domain_info": { "domain": "example.com", "registered": true, ... },
      "dns_records": { "A": ["93.184.216.34"], "MX": [...], ... },
      "whois_data": { "registrant": "...", ... },
      "ssl_cert": { "valid": true, "issuer": "Let's Encrypt", ... },
      "asn_info": { "asn_number": "AS15169", ... },
      "geoip_info": { "country": "US", "city": "Los Angeles", ... }
    },
    
    "threat_intelligence": {
      "reputation_feeds": {
        "abuseipdb": { "detected": false, "confidence": 0 },
        "alienvault": { "detected": false, "pulses": [] },
        "urlhaus": { "detected": false, "malware_family": null },
        "phishtank": { "detected": false, ... }
      },
      "ioc_relationships": [
        { "type": "IP", "indicator": "93.184.216.34", "context": "Hosting infrastructure" }
      ],
      "campaigns": [],
      "threat_actors": [],
      "malware_associations": []
    },
    
    "graph_data": {
      "nodes": [
        {
          "id": "example.com",
          "label": "example.com",
          "type": "domain",
          "risk_level": "LOW",
          "metadata": {
            "reputation": 95,
            "geoip": "US",
            "asn": "AS15169",
            "threat_score": 5,
            "tags": ["legitimate", "cdn"],
            "vt_detections": 0,
            "linked_entities": 3,
            "abuse_reports": 0
          }
        }
      ],
      "edges": [
        { "source": "example.com", "target": "93.184.216.34", "relationship": "RESOLVES_TO" }
      ]
    },
    
    "scoring": {
      "risk_score": 8,
      "confidence_score": 98,
      "risk_level": "LOW",
      "factors": [
        { "factor": "Known legitimate organization", "contribution": -15, "evidence": "WHOIS matches ICANN" }
      ]
    },
    
    "ai_summary": {
      "summary": "This domain represents a legitimate, well-established web property...",
      "verdict": "SAFE",
      "key_findings": ["Domain is owned by legitimate organization", "SSL certificate is valid", ...],
      "recommendations": ["This domain is safe to visit", ...],
      "generated_at": "2026-05-13T12:00:15Z"
    },
    
    "errors": []
  }
}
```

### Status Values

| Status | Meaning | Data Ready |
|--------|---------|-----------|
| `pending` | Scan queued, waiting | None |
| `processing` | Initial setup | None |
| `recon` | Running recon phase | (partial) `recon_data` |
| `threat_intelligence` | TI gathering | Full `recon_data` + (partial) `threat_intelligence` |
| `graph_building` | Building graph | Previous + (partial) `graph_data` |
| `ai_enrichment` | AI analyzing | All previous + (partial) `ai_summary` |
| `completed` | Finished successfully | All fields complete |
| `failed` | Error occurred | Available data + `errors` |

### Progress Field
- 0-25: recon phase
- 25-50: threat intelligence
- 50-75: graph building
- 75-95: AI enrichment
- 95-100: finalization

### Response Codes
- **200 OK**: Scan exists, returning current state
- **404 Not Found**: Scan doesn't exist or expired
- **410 Gone**: Scan has been deleted
- **401 Unauthorized**: Auth failed or not scan owner
- **429 Too Many Requests**: Polling too frequently

---

## Implementation Strategy

### Phase 1: Basic Endpoints (Day 1)
1. Implement `POST /scan/initiate`
   - Generate UUID
   - Store scan metadata
   - Queue async job
   - Return immediately

2. Implement `GET /scan/:scanId`
   - Return current scan state
   - Support `pending` and `processing` statuses only
   - Mock/stub the detailed fields for now

### Phase 2: Progressive Data (Day 2-3)
1. Implement background scan processor
2. Populate `recon_data` (DNS, WHOIS, SSL, GeoIP, ASN)
3. Update status to `recon` → `threat_intelligence` → `graph_building` → `ai_enrichment`
4. Return partial data during each phase

### Phase 3: Complete Analysis (Day 4-5)
1. Implement threat intelligence gathering
2. Build relationship graph
3. Calculate scoring
4. Generate AI summary
5. Set final status to `completed`

---

## Testing the Integration

### Test 1: Basic Initiation
```bash
curl -X POST https://api.hackura.app/scan/initiate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"input":"example.com","type":"domain"}'
```

Expected: `200 OK` with scanId

### Test 2: Poll Status
```bash
curl https://api.hackura.app/scan/SCAN_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: Current scan state with progressive data

### Test 3: Full Flow
1. Initiate scan → Get scanId
2. Poll every 1.5s for 2 minutes
3. Verify data populates progressively
4. Verify status changes through phases
5. Verify final `completed` status

---

## Frontend Integration

Once implemented, the frontend will automatically:
1. Call `POST /scan/initiate` 
2. Receive scanId and redirect to `/dashboard/scan/[scanId]`
3. Poll `GET /scan/:scanId` every 1.5s with exponential backoff
4. Display data as it becomes available
5. Stop polling when status is `completed` or `failed`

No frontend changes needed - just implement these two endpoints.

---

## Important Notes

- **Backward Compatible**: Existing `/scan` endpoint should remain unchanged
- **Data Consistency**: Only return fully populated fields (no partial objects)
- **Rate Limiting**: Enforce limits to prevent polling abuse
- **Retention**: Keep scans for minimum 24-48 hours
- **Error Handling**: Include recoverable errors in `errors` array
- **Timestamps**: Use ISO 8601 format with timezone

---

## Reference Files

- Full API spec: `/ASYNC_SCAN_API_SPEC.md`
- Implementation guide: `/ASYNC_SCAN_IMPLEMENTATION.md`
- Summary: `/ASYNC_SCAN_SUMMARY.md`

---

## Questions?

Check the documentation files above, they contain:
- Detailed request/response examples
- Data structure specifications
- Error handling requirements
- Performance targets
- Security considerations
