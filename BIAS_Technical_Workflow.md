# BIAS - Technical Workflow & Development Guide
**For AI Assistants & Developers**

---

## 📋 DOCUMENT PURPOSE

This document provides complete technical context for AI assistants (ChatGPT, Claude, etc.) or developers working on BIAS. After reading this, you should understand:
- What BIAS is and its goals
- System architecture & tech stack
- Development workflow
- How to add new features
- File structure & organization
- API patterns & data flow
- Testing & deployment

---

## 🎯 PROJECT OVERVIEW

### What is BIAS?
**BIAS (Behavioral Intelligence Audit System)** is a comprehensive TikTok creator intelligence platform that provides:
- Profile analysis with 8 behavioral scoring layers
- Growth strategies & monetization calculators
- Video analysis & comparison tools
- Live stream performance analytics
- Competitor intelligence dashboard
- Real-time trend radar
- AI-powered chat assistant
- Content calendar & collaboration finder

### Business Model
- **Current Phase:** 100% FREE (building user base)
- **Future:** Access code system with Midtrans payment (Indonesian market)
- **Target:** TikTok creators, live streamers, agencies (1K-1M followers)

### Platform
- **Development:** Replit (AI-assisted development)
- **Production URL:** bias23.replit.app
- **Future:** Self-hosted on office server (cost savings)

---

## 🏗️ SYSTEM ARCHITECTURE

### Tech Stack

**Frontend:**
```
React 18 + TypeScript
├── Vite (build tool, HMR)
├── Wouter (client-side routing)
├── TanStack Query v5 (server state management)
├── Tailwind CSS + CSS Variables (styling)
├── Radix UI + shadcn/ui (component library)
├── Recharts (data visualizations)
├── Framer Motion (animations)
└── Lucide React (icons)
```

**Backend:**
```
Node.js + Express.js (ESM format)
├── Google Gemini API (Gemini 2.0 Flash - FREE tier: 15 RPM, 1M tokens/month)
├── TikTok Scraper (public data, no API key)
├── In-memory storage (MemStorage)
├── PostgreSQL ready (Drizzle ORM + Neon)
├── Server-Sent Events (SSE for streaming)
└── Session management (prepared, not active)
```

**Key Dependencies:**
- `@neondatabase/serverless` - PostgreSQL client
- `drizzle-orm` + `drizzle-kit` - ORM & migrations
- `@google/genai` - Google Gemini AI integration (FREE tier!)
- `wouter` - Routing
- `@tanstack/react-query` - Data fetching
- `zod` + `drizzle-zod` - Schema validation

---

## 📁 FILE STRUCTURE

```
BIAS/
├── client/                    # Frontend React app
│   ├── src/
│   │   ├── pages/            # Route components
│   │   │   ├── home.tsx              # Homepage
│   │   │   ├── analysis.tsx          # Profile analysis
│   │   │   ├── growth-strategies.tsx # Growth dashboard
│   │   │   ├── video-analyzer.tsx    # Video upload analysis
│   │   │   ├── video-comparison.tsx  # Multi-video comparison
│   │   │   ├── livestream-analyzer.tsx # Live stream analysis
│   │   │   ├── competitor-intelligence.tsx # Competitor dashboard
│   │   │   ├── trends.tsx            # Trend radar
│   │   │   ├── analytics-history.tsx # Historical tracking
│   │   │   ├── content-calendar.tsx  # Event calendar
│   │   │   ├── collaboration-finder.tsx # Collaborator finder
│   │   │   ├── export-reports.tsx    # Export management
│   │   │   ├── ai-discussion.tsx     # AI chat assistant
│   │   │   └── not-found.tsx         # 404 page
│   │   ├── components/       # Reusable components
│   │   │   └── ui/          # shadcn/ui primitives
│   │   ├── lib/             # Utilities
│   │   │   └── queryClient.ts # TanStack Query setup
│   │   ├── hooks/           # Custom React hooks
│   │   ├── App.tsx          # Root component & routing
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Global styles + CSS variables
│   └── index.html
│
├── server/                    # Backend Express app
│   ├── index.ts              # Server entry point
│   ├── routes.ts             # API endpoints (21+ routes)
│   ├── storage.ts            # IStorage interface + MemStorage
│   ├── services/             # Business logic
│   │   ├── tiktok-scraper.ts       # TikTok data extraction
│   │   ├── behavioral-analyzer.ts  # 8-layer scoring
│   │   ├── ai-insights.ts          # OpenAI integration
│   │   ├── livestream-analyzer.ts  # Live stream logic
│   │   └── trend-seeder.ts         # Viral trend seeding
│   └── vite.ts               # Vite dev server integration
│
├── shared/                    # Shared types & schemas
│   └── schema.ts             # Drizzle schemas + Zod validation
│
├── attached_assets/          # User-uploaded files (images, videos)
│
├── design_guidelines.md      # UI/UX design system
├── replit.md                 # Project documentation
├── BIAS_Feature_Documentation.md  # Feature specs
├── BIAS_Technical_Workflow.md     # This file
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite configuration
├── tailwind.config.ts        # Tailwind + color tokens
├── drizzle.config.ts         # Database config
└── postcss.config.js         # PostCSS plugins
```

---

## 🔄 DEVELOPMENT WORKFLOW

### Adding a New Feature (Step-by-Step)

#### 1. **Define Data Schema** (`shared/schema.ts`)
```typescript
// Example: Adding a new "VideoReport" feature
export const videoReports = pgTable("video_reports", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id").notNull(),
  videoUrl: text("video_url").notNull(),
  viralScore: integer("viral_score").notNull(),
  hookScore: integer("hook_score").notNull(),
  analyzedAt: timestamp("analyzed_at").notNull().defaultNow(),
});

// Zod schemas for validation
export const insertVideoReportSchema = createInsertSchema(videoReports).omit({
  id: true,
  analyzedAt: true,
});

export type InsertVideoReport = z.infer<typeof insertVideoReportSchema>;
export type VideoReport = typeof videoReports.$inferSelect;
```

#### 2. **Update Storage Interface** (`server/storage.ts`)
```typescript
// Add to IStorage interface
interface IStorage {
  // ... existing methods
  createVideoReport(report: InsertVideoReport): Promise<VideoReport>;
  getVideoReport(id: string): Promise<VideoReport | undefined>;
  getVideoReportsByUser(userId: string): Promise<VideoReport[]>;
}

// Implement in MemStorage class
class MemStorage implements IStorage {
  private videoReports = new Map<string, VideoReport>();

  async createVideoReport(data: InsertVideoReport): Promise<VideoReport> {
    const report: VideoReport = {
      id: crypto.randomUUID(),
      ...data,
      analyzedAt: new Date(),
    };
    this.videoReports.set(report.id, report);
    return report;
  }
  // ... implement other methods
}
```

#### 3. **Create API Endpoints** (`server/routes.ts`)
```typescript
// POST /api/video-reports - Create new report
app.post("/api/video-reports", async (req, res) => {
  try {
    // Validate request body
    const data = insertVideoReportSchema.parse(req.body);
    
    // Business logic (call service if needed)
    const report = await storage.createVideoReport(data);
    
    // Return response
    res.json(report);
  } catch (error: any) {
    console.error("[BIAS] Video report error:", error.message);
    res.status(500).json({ error: "Failed to create video report" });
  }
});

// GET /api/video-reports/:userId - Get user's reports
app.get("/api/video-reports/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const reports = await storage.getVideoReportsByUser(userId);
    res.json(reports);
  } catch (error: any) {
    console.error("[BIAS] Fetch reports error:", error.message);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});
```

#### 4. **Create Frontend Page** (`client/src/pages/video-reports.tsx`)
```typescript
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";

export default function VideoReports() {
  // Fetch data
  const { data: reports, isLoading } = useQuery({
    queryKey: ["/api/video-reports", "user123"],
  });

  // Create report mutation
  const createReport = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/video-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create report");
      return res.json();
    },
    onSuccess: () => {
      // Invalidate cache to refetch
      queryClient.invalidateQueries({ 
        queryKey: ["/api/video-reports"] 
      });
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Video Reports</h1>
      <Button 
        onClick={() => createReport.mutate({ videoUrl: "..." })}
        disabled={createReport.isPending}
      >
        Create Report
      </Button>
      
      {reports?.map(report => (
        <div key={report.id}>{report.videoUrl}</div>
      ))}
    </div>
  );
}
```

#### 5. **Register Route** (`client/src/App.tsx`)
```typescript
import VideoReports from "@/pages/video-reports";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/video-reports" component={VideoReports} />
      {/* ... other routes */}
    </Switch>
  );
}
```

#### 6. **Update Documentation** (`replit.md`)
```markdown
### Feature #13: Video Reports
**Route:** `/video-reports`
**Description:** Manage video analysis reports
**Endpoints:** 
- POST /api/video-reports
- GET /api/video-reports/:userId
```

---

## 🎨 DESIGN SYSTEM GUIDELINES

### Color Variables (from `index.css`)
```css
:root {
  /* Primary colors */
  --primary: 220 100% 50%;        /* Blue */
  --primary-foreground: 0 0% 100%;
  
  /* 8 Behavioral Layer Colors */
  --visual-layer: 220 100% 50%;      /* Blue */
  --audio-layer: 270 80% 60%;        /* Purple */
  --energy-layer: 38 92% 50%;        /* Orange */
  --interaction-layer: 142 71% 45%;  /* Green */
  --linguistic-layer: 330 81% 60%;   /* Pink */
  --contextual-layer: 174 70% 41%;   /* Teal */
  --environmental-layer: 239 84% 67%; /* Indigo */
  --governance-layer: 0 84% 60%;     /* Red */
}
```

### Component Usage
- Use shadcn/ui components from `@/components/ui/`
- Follow Material Design + Linear minimalism
- Always support dark mode
- Use Indonesian language for UI text

### Data Visualization
- Use Recharts for charts (ResponsiveContainer, LineChart, RadarChart, etc.)
- Color-code by behavioral layers
- Include loading states & empty states

---

## 🔌 API PATTERNS

### Current Endpoints (21+)

#### Profile Analysis
- `POST /api/analyze` - Analyze TikTok profile
- `GET /api/analyses/:id` - Get analysis by ID
- `GET /api/analyses` - Get all analyses

#### Livestream
- `POST /api/livestream/analyze` - Analyze live stream recording
- `GET /api/livestream/:id` - Get livestream analysis

#### Competitor
- `POST /api/competitor/analyze` - Compare with competitor
- `GET /api/competitor/:id` - Get comparison
- `GET /api/competitor/by-username/:username` - Get by main username
- `DELETE /api/competitor/:id` - Delete comparison

#### Trends
- `GET /api/trends` - Get all trends
- `GET /api/trends/seeded` - Get seeded trends

#### Analytics History
- `GET /api/history/:username` - Get historical data

#### Calendar
- `POST /api/calendar` - Create event
- `GET /api/calendar` - Get all events
- `GET /api/calendar/:id` - Get event by ID
- `PATCH /api/calendar/:id` - Update event
- `DELETE /api/calendar/:id` - Delete event

#### Collaboration
- `GET /api/collaborations` - Get all collaborators
- `POST /api/collaborations` - Create collaborator
- `PATCH /api/collaborations/:id` - Update status

#### Export
- `POST /api/export` - Create export
- `GET /api/export` - Get all exports
- `GET /api/export/:id/download` - Download report

#### AI Chat
- `POST /api/chat` - Stream AI response (SSE)

### Request/Response Patterns

**Standard Success Response:**
```json
{
  "id": "uuid-here",
  "field1": "value1",
  "createdAt": "2025-10-23T..."
}
```

**Standard Error Response:**
```json
{
  "error": "Human-readable error message"
}
```

**Validation with Zod:**
```typescript
// Always validate request body
const data = insertSchema.parse(req.body);
```

---

## 🧪 TESTING GUIDELINES

### Manual Testing Checklist
- [ ] Navigate to new page/feature
- [ ] Test form submission (if applicable)
- [ ] Check loading states
- [ ] Verify error handling
- [ ] Test dark mode appearance
- [ ] Check mobile responsiveness
- [ ] Verify Indonesian language text

### Using Playwright (via run_test tool)
```typescript
// Example test plan for AI Assistant to execute
1. [New Context] Create browser context
2. [Browser] Navigate to /your-feature
3. [Verify] Check page loads correctly
4. [Browser] Fill form with test data
5. [Browser] Click submit button
6. [Verify] Confirm success message appears
7. [Verify] Check data displays correctly
```

---

## 📦 DATA FLOW EXAMPLES

### Example 1: Profile Analysis Flow
```
User Input (Username)
  ↓
Frontend (/analysis page)
  ↓ POST /api/analyze
Backend Route
  ↓
TikTok Scraper Service
  ↓ Extract public data
Behavioral Analyzer Service
  ↓ Calculate 8 layer scores
AI Insights Service (OpenAI)
  ↓ Generate recommendations
Storage (MemStorage)
  ↓ Save analysis
Frontend (TanStack Query)
  ↓ Display results
User sees: Profile metrics, radar chart, AI insights
```

### Example 2: AI Chat Flow
```
User Message
  ↓
Frontend (/ai-discussion page)
  ↓ POST /api/chat (SSE)
Backend Route
  ↓
Fetch Context:
  - Get top 5 trends (storage.getAllTrends())
  - Get last 3 analyses (storage.getAllAnalyses())
  - Get competitors (storage.getCompetitorsByUsername())
  ↓
OpenAI API (GPT-4o-mini)
  ↓ Stream chunks
Server-Sent Events
  ↓ data: {"content": "chunk"}\n\n
Frontend EventSource
  ↓ Append to message
User sees: Streaming AI response
```

---

## 🔐 ENVIRONMENT VARIABLES

### Required Secrets (Replit Secrets)
```bash
GEMINI_API_KEY=AIza...          # Google Gemini API key for AI features (FREE tier!)
SESSION_SECRET=random-string     # Session encryption (prepared)
DATABASE_URL=postgresql://...    # PostgreSQL connection (optional)
```

### Accessing Secrets
```typescript
// Backend
const openaiKey = process.env.OPENAI_API_KEY;

// Frontend (must prefix with VITE_)
const publicVar = import.meta.env.VITE_PUBLIC_VAR;
```

---

## 🚀 DEPLOYMENT

### Current Setup
- **Platform:** Replit
- **Workflow:** "Start application" runs `npm run dev`
- **Auto-restart:** On file changes
- **URL:** bias23.replit.app

### Adding New npm Packages
```bash
# DO NOT manually edit package.json
# Use packager_tool instead
```

### Database Migration (Future)
```bash
# When ready to switch from MemStorage to PostgreSQL
npx drizzle-kit push:pg
```

---

## 📝 CODING CONVENTIONS

### TypeScript
- Use strict mode
- Define types from schemas (`typeof table.$inferSelect`)
- Avoid `any` - use proper typing

### React
- Functional components with hooks
- Use TanStack Query for server state
- Extract reusable logic to custom hooks
- Add `data-testid` attributes for testing

### API Routes
- Keep routes thin (delegate to services)
- Always validate with Zod
- Use try-catch for error handling
- Log errors with `[BIAS]` prefix

### Styling
- Use Tailwind utility classes
- Define semantic colors in CSS variables
- Support dark mode (use `dark:` variants)
- Follow design_guidelines.md

### Indonesian Language
- All user-facing text in casual Indonesian
- Use friendly tone: "Lo butuh...", "Gimana cara..."
- Avoid formal/technical jargon

---

## 🐛 COMMON ISSUES & SOLUTIONS

### Issue: TikTok scraper fails
**Cause:** HTML structure changed  
**Solution:** Update regex patterns in `tiktok-scraper.ts`

### Issue: OpenAI API error 401
**Cause:** Invalid API key  
**Solution:** Check OPENAI_API_KEY secret is valid

### Issue: Query not refetching
**Cause:** Missing cache invalidation  
**Solution:** Call `queryClient.invalidateQueries()` after mutation

### Issue: Dark mode colors wrong
**Cause:** Missing `dark:` variant  
**Solution:** Add explicit dark mode classes or use CSS variables

---

## ✅ FEATURE COMPLETION CHECKLIST

When implementing a new feature:
- [ ] Schema defined in `shared/schema.ts`
- [ ] Storage methods in `server/storage.ts`
- [ ] API endpoints in `server/routes.ts`
- [ ] Frontend page in `client/src/pages/`
- [ ] Route registered in `App.tsx`
- [ ] Indonesian UI text
- [ ] Dark mode support
- [ ] Mobile responsive
- [ ] Loading & error states
- [ ] Data testid attributes
- [ ] Documentation in `replit.md`
- [ ] Manual testing completed

---

## 🎯 NEXT STEPS FOR AI ASSISTANTS

If you're working on BIAS, start by:
1. Reading `replit.md` for project context
2. Understanding the 13 existing features (incl. new Glossary)
3. Reviewing this workflow document
4. Checking `design_guidelines.md` for UI patterns
5. Looking at existing pages for code examples

**When asked to add a feature:**
1. Understand requirements
2. Follow the "Adding a New Feature" workflow above
3. Test thoroughly
4. Update documentation
5. Use architect tool for code review

**Key Principles:**
- Put logic in backend, UI in frontend
- Use existing patterns & components
- Keep it simple & maintainable
- Indonesian language for users
- Always support dark mode

---

**Document Version:** 1.0  
**Last Updated:** 23 Oktober 2025  
**Platform:** bias23.replit.app

---

## 📚 ADDITIONAL RESOURCES

- **Project Docs:** `replit.md`
- **Feature Specs:** `BIAS_Feature_Documentation.md`
- **Design System:** `design_guidelines.md`
- **API Reference:** `server/routes.ts` (comments in code)
- **Schema Definitions:** `shared/schema.ts`

---

**Ready to build? Follow the workflow, maintain quality, and ship features! 🚀**
