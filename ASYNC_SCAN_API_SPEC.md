# Async Scan Backend API Specification

## Overview

The backend must implement two new endpoints to support asynchronous scanning:
1. `POST /scan/initiate` - Start a scan immediately (returns scanId)
2. `GET /scan/:scanId` - Fetch current scan state and progressive results

## Endpoint 1: Initiate Scan

### Request

**Method:** POST  
**URL:** `/scan/initiate`  
**Authentication:** Bearer token (required)  
**Content-Type:** application/json

**Payload:**
```json
{
  "input": "example.com",
  "type": "domain"
}
```

**Parameters:**
- `input` (string, required): Domain, URL, IP, or text to scan
- `type` (string, required): One of `'domain'`, `'url'`, `'ip'`, `'text'`

### Response

**Status:** 200 OK

```json
{
  "success": true,
  "scanId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing",
  "input": "example.com",
  "created_at": "2026-05-13T12:00:00Z"
}
```

**Response Fields:**
- `success` (boolean): Operation successful
- `scanId` (string, UUID): Unique scan identifier for polling
- `status` (string): Initial status is always `"processing"`
- `input` (string): The scanned input (echoed back)
- `created_at` (ISO string): Scan creation timestamp

### Error Responses

**Status:** 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid input format"
}
```

**Status:** 401 Unauthorized
```json
{
  "success": false,
  "error": "Authentication required"
}
```

**Status:** 429 Too Many Requests
```json
{
  "success": false,
  "error": "Rate limit exceeded. Try again in 60 seconds."
}
```

**Status:** 500 Internal Server Error
```json
{
  "success": false,
  "error": "Failed to initiate scan"
}
```

---

## Endpoint 2: Get Scan Data

### Request

**Method:** GET  
**URL:** `/scan/:scanId`  
**Authentication:** Bearer token (required)  
**Query Parameters:** (optional)
- `fields`: Comma-separated field names to retrieve (e.g., `?fields=scoring,recon_data`)

### Response

**Status:** 200 OK

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
      "domain_info": {
        "domain": "example.com",
        "registered": true,
        "registrar": "Example Registrar",
        "created_date": "2020-01-15"
      },
      "dns_records": {
        "A": ["93.184.216.34"],
        "MX": ["mail.example.com"],
        "NS": ["ns1.example.com", "ns2.example.com"]
      },
      "whois_data": {
        "registrant": "Privacy Protected",
        "registrar_email": "abuse@example-registrar.com"
      },
      "ssl_cert": {
        "valid": true,
        "issuer": "Let's Encrypt",
        "expiry_date": "2027-05-13T12:00:00Z",
        "common_name": "example.com",
        "san": ["www.example.com", "mail.example.com"]
      },
      "asn_info": {
        "asn_number": "AS15169",
        "organization": "Google LLC",
        "country": "US"
      },
      "geoip_info": {
        "country": "US",
        "country_code": "US",
        "city": "Los Angeles",
        "latitude": 34.0522,
        "longitude": -118.2437,
        "timezone": "America/Los_Angeles"
      }
    },
    
    "threat_intelligence": {
      "reputation_feeds": {
        "abuseipdb": {
          "detected": false,
          "confidence": 0
        },
        "alienvault": {
          "detected": false,
          "pulses": []
        },
        "urlhaus": {
          "detected": false,
          "malware_family": null
        },
        "phishtank": {
          "detected": false,
          "phish_detail_page": null
        }
      },
      "ioc_relationships": [
        {
          "type": "IP",
          "indicator": "93.184.216.34",
          "context": "Hosting infrastructure"
        },
        {
          "type": "ASN",
          "indicator": "AS15169",
          "context": "ISP information"
        }
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
        },
        {
          "id": "93.184.216.34",
          "label": "93.184.216.34",
          "type": "ip",
          "risk_level": "LOW",
          "metadata": {
            "reputation": 90,
            "geoip": "US",
            "asn": "AS15169",
            "threat_score": 8,
            "tags": ["google", "content-delivery"],
            "vt_detections": 0,
            "linked_entities": 12,
            "abuse_reports": 0
          }
        }
      ],
      "edges": [
        {
          "source": "example.com",
          "target": "93.184.216.34",
          "relationship": "RESOLVES_TO"
        }
      ]
    },
    
    "scoring": {
      "risk_score": 8,
      "confidence_score": 98,
      "risk_level": "LOW",
      "factors": [
        {
          "factor": "Known legitimate organization",
          "contribution": -15,
          "evidence": "WHOIS matches ICANN verified registrant"
        },
        {
          "factor": "Valid SSL certificate",
          "contribution": -5,
          "evidence": "Certificate from trusted CA (Let's Encrypt)"
        },
        {
          "factor": "No reputation feed detections",
          "contribution": -10,
          "evidence": "Clean across VirusTotal, AbuseIPDB, URLhaus"
        },
        {
          "factor": "Long registration history",
          "contribution": -8,
          "evidence": "Domain registered since 2020"
        }
      ]
    },
    
    "ai_summary": {
      "summary": "This domain represents a legitimate, well-established web property with strong security indicators. The organization behind it maintains proper security practices and is widely recognized as trustworthy.",
      "verdict": "SAFE",
      "key_findings": [
        "Domain is owned and operated by a legitimate organization",
        "SSL/TLS certificate is valid and properly configured",
        "No detections across major reputation feeds",
        "Good long-term registration history",
        "Proper DNS configuration with redundancy"
      ],
      "recommendations": [
        "This domain is safe to visit and interact with",
        "Follow normal web security practices (avoid sharing sensitive data unless needed)",
        "Monitor for phishing emails impersonating this domain"
      ],
      "generated_at": "2026-05-13T12:00:15Z"
    },
    
    "errors": []
  }
}
```

### Status Values

The `status` field indicates the current scan phase:

| Status | Meaning | Data Ready |
|--------|---------|-----------|
| `pending` | Scan queued, waiting to start | None |
| `processing` | Initial setup and validation | None |
| `recon` | Reconnaissance phase active | (partial) `recon_data` |
| `threat_intelligence` | TI gathering in progress | `recon_data` (full), (partial) `threat_intelligence` |
| `graph_building` | Building relationship graph | Previous + (partial) `graph_data` |
| `ai_enrichment` | AI analysis running | All previous + (partial) `ai_summary` |
| `completed` | Scan finished successfully | All fields complete |
| `failed` | Scan encountered unrecoverable error | Available data + `errors` array |

### Progress Field

- `progress` (number): 0-100 indicating overall scan completion
- Incremented as each phase completes
- Example progression:
  - 0-25: recon phase
  - 25-50: threat intelligence gathering
  - 50-75: graph building
  - 75-95: AI enrichment
  - 95-100: finalization

### Partial Field Documentation

Fields may be partially populated during active phases:

**recon_data:**
- `domain_info`: Available from phase start
- `dns_records`: Available immediately
- `whois_data`: Available after DNS records
- `ssl_cert`: Available once certificate fetched
- `asn_info`: Available with IP resolution
- `geoip_info`: Available with IP resolution

**threat_intelligence:**
- `reputation_feeds`: Built up during this phase
- `ioc_relationships`: Accumulated from all IOCs found
- `campaigns`, `threat_actors`, `malware_associations`: Added as discovered

**graph_data:**
- `nodes`: Populated as entities are discovered
- `edges`: Populated as relationships are found

**scoring:**
- `risk_score`: Available once initial analysis done
- `confidence_score`: Updated as more data arrives
- `risk_level`: Finalized once scoring complete
- `factors`: Added as scoring logic processes data

### Response Codes

**Status:** 200 OK  
Scan exists and returning current state (even if in progress)

**Status:** 404 Not Found  
```json
{
  "success": false,
  "error": "Scan not found"
}
```

**Status:** 410 Gone  
```json
{
  "success": false,
  "error": "Scan has expired and been deleted"
}
```

**Status:** 401 Unauthorized  
```json
{
  "success": false,
  "error": "Authentication required or unauthorized to view this scan"
}
```

**Status:** 429 Too Many Requests  
```json
{
  "success": false,
  "error": "Polling too frequently. Wait before next request."
}
```

---

## Implementation Requirements

### Scan Storage

- **Lifetime**: Scans stored for minimum 24-48 hours
- **Access**: Users can only view their own scans
- **Cleanup**: Old scans automatically purged

### Performance Requirements

- **Initiation**: < 100ms response time
- **Polling**: < 200ms response time
- **Throughput**: Handle 100+ concurrent scans

### Data Consistency

- **Atomicity**: Each field either fully available or omitted (no partial fields)
- **Ordering**: Fields returned in dependency order
- **Validation**: All returned data validated before sending

### Error Handling

- **Recoverable Errors**: Logged in `errors` array, scan continues
- **Fatal Errors**: Status set to `failed`, final response sent
- **Timeout**: If phase takes > 5 minutes, mark as timeout error

### Rate Limiting

- **Polling**: 1 request per 500ms minimum
- **Initiation**: 10 scans per minute per user
- **Burst**: Allow 3 requests then enforce cooldown

---

## Example Flow

### Request 1: Initiate (t=0s)
```bash
curl -X POST https://api.hackura.app/scan/initiate \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"input":"example.com","type":"domain"}'
```

**Response:** scanId = `550e8400-e29b-41d4-a716-446655440000`

### Request 2: Poll (t=1.5s)
```bash
curl https://api.hackura.app/scan/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer TOKEN"
```

**Response:** `status: "recon"`, `progress: 20`, `recon_data: {...}`

### Request 3: Poll (t=3s)
**Response:** `status: "threat_intelligence"`, `progress: 45`, all previous + `threat_intelligence: {...}`

### Request 4: Poll (t=4.5s)
**Response:** `status: "graph_building"`, `progress: 70`, all previous + `graph_data: {...}`

### Request 5: Poll (t=6s)
**Response:** `status: "ai_enrichment"`, `progress: 88`, all previous + `ai_summary: {...}`

### Request 6: Poll (t=8s)
**Response:** `status: "completed"`, `progress: 100`, all fields finalized
