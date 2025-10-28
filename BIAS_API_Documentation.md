# BIAS Public API Documentation
**For ChatGPT GPT Builder Integration**

---

## 📖 OVERVIEW

BIAS (Behavioral Intelligence Audit System) provides a public REST API for TikTok creator analysis, trending data, competitor intelligence, and live stream analytics. This API is designed for integration with ChatGPT Custom GPTs and other external applications.

**Base URL:** `https://bias23.replit.app`

**Authentication:** None required (public endpoints)

**Rate Limiting:** None (subject to change)

**Response Format:** JSON

---

## 🔗 AVAILABLE ENDPOINTS

### 1. Profile Analysis
**Endpoint:** `GET /api/analyze`

**Description:** Analyze a TikTok creator profile and return comprehensive behavioral insights.

**Parameters:**
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `username` | string | Yes | TikTok username (with or without @) | `@newsmaker23_talk` |

**Example Request:**
```bash
curl "https://bias23.replit.app/api/analyze?username=@newsmaker23_talk"
```

**Example Response:**
```json
{
  "username": "@newsmaker23_talk",
  "profile": {
    "nickname": "NEWS MAKER²³ TALK",
    "bio": "SPEED-ACCURACY-FRIENDLY\n🔴 LIVE 09.00, 13.30, 19.00 WIB",
    "followers": 59800,
    "following": 306,
    "videos": 140,
    "total_likes": 78700,
    "likes_per_video": 562,
    "engagement_rate": 0.94,
    "is_verified": true
  },
  "layers": {
    "VBM": 78,
    "ABM": 75,
    "BIFS": 40,
    "EPM": 43,
    "NLP": 65,
    "BRM": 38,
    "EnvTech": 85,
    "BMIL": 100
  },
  "insights": [
    {
      "type": "strength",
      "title": "Exceptional Governance Performance",
      "description": "Excellent authenticity with organic growth patterns"
    }
  ],
  "governance": {
    "score": 100,
    "alerts": [],
    "bot_detection": 0.03,
    "brand_safety": "high"
  },
  "ai_summary": "Profile analysis summary with actionable insights"
}
```

**Layer Abbreviations:**
- **VBM:** Visual Behavioral Metrics (Video quality, composition, aesthetics)
- **ABM:** Audio Behavioral Metrics (Sound quality, music choice, voice clarity)
- **BIFS:** Behavioral Interaction & Follower Signals (Energy, pacing, enthusiasm)
- **EPM:** Engagement & Participation Metrics (Comments, shares, interactions)
- **NLP:** Natural Language Processing (Caption quality, hashtags, messaging)
- **BRM:** Brand Relevance Metrics (Contextual alignment with trends)
- **EnvTech:** Environmental & Technical Metrics (Lighting, setting, production)
- **BMIL:** Bot/Manipulation Integrity Level (Authenticity, fake follower detection)

---

### 2. Trending Sounds & Hashtags
**Endpoint:** `GET /api/trends`

**Description:** Get current trending TikTok sounds and hashtags with viral scores.

**Parameters:** None

**Example Request:**
```bash
curl "https://bias23.replit.app/api/trends"
```

**Example Response:**
```json
{
  "success": true,
  "trends": [
    {
      "type": "sound",
      "name": "Cupid - FIFTY FIFTY (Sped Up)",
      "category": "Audio",
      "viral_score": 95,
      "growth_velocity": 85,
      "saturation_level": 45,
      "peak_prediction": 7,
      "best_posting_times": ["19:00", "21:00", "14:00"],
      "top_creators": [
        {
          "username": "charlidamelio",
          "followers": 152000000
        }
      ],
      "opportunity_level": "High"
    }
  ],
  "total": 8,
  "last_updated": "2025-10-24T07:20:15.293Z"
}
```

**Opportunity Levels:**
- **Very High:** Low saturation, high growth - ideal for early adoption
- **High:** Moderate saturation, strong growth - still good timing
- **Medium-High:** Decent opportunity with some competition
- **Medium:** Balanced saturation and growth
- **Medium-Low:** High saturation, slower growth
- **Low:** Oversaturated trend

---

### 3. Competitor Analysis
**Endpoint:** `GET /api/competitors`

**Description:** Get competitor intelligence data for a specific TikTok account.

**Parameters:**
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `username` | string | Yes | Main TikTok username to get competitors for | `@newsmaker23_talk` |

**Example Request:**
```bash
curl "https://bias23.replit.app/api/competitors?username=@newsmaker23_talk"
```

**Example Response:**
```json
{
  "username": "@newsmaker23_talk",
  "competitors": [
    {
      "username": "@competitor1",
      "followers": 75000,
      "videos": 200,
      "avg_likes_per_video": 850,
      "avg_views_per_video": 12750,
      "engagement_rate": 1.13,
      "growth_rate": 12,
      "posting_frequency": 8,
      "behavioral_scores": {
        "visual": 82,
        "audio": 79,
        "energy": 85,
        "interaction": 78,
        "linguistic": 71,
        "contextual": 75,
        "environmental": 88,
        "governance": 92
      },
      "content_themes": ["Tutorial", "Review", "Lifestyle"],
      "top_formats": ["Trending Sounds", "Duets", "Challenges"],
      "strengths": [
        {
          "area": "Visual Quality",
          "evidence": "Consistent 4K quality dengan lighting profesional",
          "score": 95
        }
      ],
      "weaknesses": [
        {
          "area": "Posting Consistency",
          "evidence": "Jadwal upload tidak teratur, miss peak hours",
          "score": 45
        }
      ]
    }
  ],
  "total_analyzed": 3,
  "last_updated": "2025-10-24T07:20:15.293Z"
}
```

**Note:** Competitor data must be analyzed via the web app first before being available through the API.

---

### 4. Live Stream Analytics
**Endpoint:** `GET /api/live`

**Description:** Get live stream performance data for a TikTok creator.

**Parameters:**
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `username` | string | Yes | TikTok username | `@newsmaker23_talk` |

**Example Request:**
```bash
curl "https://bias23.replit.app/api/live?username=@newsmaker23_talk"
```

**Example Response:**
```json
{
  "username": "@newsmaker23_talk",
  "live_streams": [
    {
      "stream_id": "ls_abc123",
      "duration_minutes": 120,
      "peak_viewers": 5420,
      "avg_viewers": 3200,
      "total_views": 38400,
      "total_gifts": 12500,
      "gift_value_idr": 3750000,
      "total_comments": 8900,
      "total_shares": 450,
      "retention_rate": 0.68,
      "engagement_score": 85,
      "energy_score": 92,
      "interaction_score": 88,
      "audio_quality": 78,
      "peak_moments": [
        {
          "timestamp": "00:45:30",
          "viewers": 5420,
          "event": "Gift rain started"
        }
      ],
      "chat_sentiment": {
        "positive": true,
        "keywords": ["mantap", "keren", "lanjut"]
      },
      "ai_insights": [
        "Peak viewers saat Q&A session - consider more interactive formats",
        "Retention rate turun di menit 80 - pertimbangkan durasi maksimal 90 menit"
      ],
      "analyzed_at": "2025-10-23T19:30:00.000Z"
    }
  ],
  "total_analyzed": 5,
  "last_updated": "2025-10-24T07:20:15.293Z"
}
```

**Note:** Live stream data must be uploaded and analyzed via the web app first.

---

## 🔧 CORS & ACCESS

All endpoints support CORS and can be accessed from any origin:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

---

## ⚠️ ERROR HANDLING

**Error Response Format:**
```json
{
  "error": "Error message",
  "details": "Detailed error description"
}
```

**Common HTTP Status Codes:**
| Code | Meaning | Description |
|------|---------|-------------|
| 200 | Success | Request successful |
| 400 | Bad Request | Missing or invalid parameters |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

**Example Error:**
```json
{
  "error": "Missing required parameter: username (e.g., ?username=@newsmaker23_talk)"
}
```

---

## 🎯 USE CASES

### ChatGPT Custom GPT Integration
Use these endpoints to create a BIAS-powered ChatGPT assistant that can:
- Analyze TikTok profiles on demand
- Provide trending content recommendations
- Compare competitor strategies
- Review live stream performance

### Third-Party Applications
Integrate BIAS intelligence into:
- Creator dashboards
- Agency tools
- Analytics platforms
- Content planning systems

---

## 📊 DATA FRESHNESS

| Endpoint | Data Source | Update Frequency |
|----------|-------------|------------------|
| `/api/analyze` | Live TikTok scraping | Real-time (on request) |
| `/api/trends` | Seeded data | Every 15 minutes |
| `/api/competitors` | Stored analyses | On-demand (via web app) |
| `/api/live` | Stored analyses | On-demand (via web app) |

---

## 🚀 QUICK START

**1. Test the API:**
```bash
# Analyze a profile
curl "https://bias23.replit.app/api/analyze?username=@charlidamelio"

# Get trending sounds
curl "https://bias23.replit.app/api/trends"
```

**2. Integrate with ChatGPT:**
See `gpt-builder-manifest.json` for GPT Builder configuration.

**3. Build your own app:**
Use these endpoints as a backend for custom TikTok analytics tools.

---

## 📝 NOTES

- **No API Key Required:** All endpoints are public and free to use
- **No Rate Limiting:** Currently unlimited (subject to change)
- **Data Privacy:** Only public TikTok data is accessed and returned
- **Best Practices:**
  - Cache responses when appropriate
  - Handle errors gracefully
  - Respect TikTok's data usage policies

---

## 📞 SUPPORT

For issues or questions:
- **Platform:** https://bias23.replit.app
- **Documentation:** This file
- **Version:** 1.0.0
- **Last Updated:** October 24, 2025

---

**Built with ❤️ by BIAS Team**
