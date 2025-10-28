# BIAS - Behavioral Intelligence Audit System

## Overview

BIAS (Behavioral Intelligence Audit System) is an advanced analytics platform designed to analyze TikTok creator profiles and live streamer behavior. It scrapes public TikTok data and applies an 8-layer behavioral analysis framework (Visual, Audio, Energy, Interaction, Linguistic, Contextual, Environmental, and Governance) to generate comprehensive insights. The platform provides AI-powered insights, governance integrity scores (bot detection), data visualizations, and tools for growth strategies and video analysis to help creators understand performance and behavioral patterns.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend

The frontend is built with React 18 and TypeScript using Vite. It uses Wouter for routing, Radix UI and shadcn/ui for components following a Material Design + Linear-inspired minimalism. State management is handled by TanStack Query for server state and React Context for theme management. CSS variables manage theming, and Recharts is used for data visualization.

### Backend

The backend uses Node.js with Express.js in ESM format, exposing a comprehensive REST API with 25+ endpoints. Core endpoints include profile analysis (`POST /api/analyze`), livestream analysis (`POST /api/livestream/analyze`), competitor comparison (`POST /api/competitor/analyze`), AI chat with streaming (`POST /api/chat`), trend data (`GET /api/trends`), analytics history (`GET /api/history/:username`), and full CRUD for calendar events, collaborations, and export reports. Services include `tiktok-scraper.ts`, `behavioral-analyzer.ts`, `ai-insights.ts`, `livestream-analyzer.ts`, `trend-seeder.ts`, and extended `storage.ts` with 40+ CRUD methods. The `/api/chat` endpoint supports Server-Sent Events (SSE) for real-time streaming responses from Google Gemini 2.0 Flash (FREE tier: 15 RPM, 1M tokens/month), with comprehensive context enrichment from three data sources: trending sounds/hashtags (top 5 with viral/growth scores), recent profile analyses (last 3 with behavioral scores and follower metrics), and competitor comparisons (up to 2 from most recently analyzed profile with engagement rates). Centralized error handling is implemented across all routes.

**Public API for ChatGPT Integration**: BIAS exposes 4 public GET endpoints designed for ChatGPT Custom GPT Builder integration and third-party applications. All endpoints support CORS (`Access-Control-Allow-Origin: *`) and return pure JSON responses. Endpoints include: `GET /api/analyze?username=@username` (real-time TikTok profile analysis with 8 behavioral layers), `GET /api/trends` (trending sounds/hashtags with viral scores and opportunity levels), `GET /api/competitors?username=@username` (competitor intelligence data), and `GET /api/live?username=@username` (live stream analytics). Complete API documentation available in `BIAS_API_Documentation.md`, GPT Builder manifest in `gpt-builder-manifest.json`, and setup guide in `GPT_Builder_Setup_Guide.md`. All endpoints validated and architect-approved with proper error handling, parameter validation, and response format consistency.

### Data Storage

The current implementation uses in-memory storage (MemStorage) with comprehensive data structures for all features. The system is designed for PostgreSQL with Drizzle ORM, with schema definitions for 9 tables: `users`, `analyses`, `livestreamSessions`, `competitors`, `trends`, `analyticsHistory`, `calendarEvents`, `collaborations`, and `exportReports`. All schemas are ready for migration using the `DATABASE_URL` environment variable with proper TypeScript typing via drizzle-zod.

### Authentication and Authorization

While authentication infrastructure (user model, schema) is prepared for future implementation, the system currently operates without active user authentication.

### UI/UX Decisions

The design system implements Material Design + Linear-inspired minimalism for data clarity and professional polish. It features a comprehensive CSS variable system for theming, supporting light and dark modes, with a color palette optimized for analytics dashboards and specific colors mapped to each behavioral layer. All new features adhere to established design guidelines, ensuring consistency, responsiveness, and dark mode optimization.

**Internationalization**: The platform features full **Indonesian language UI** (Bahasa Indonesia) throughout all pages, with casual and friendly tone to ensure accessibility for non-English speaking users. Core user-facing pages (home, analysis, growth strategies, video analyzer, video comparison) are 100% translated, while advanced features have Indonesian content with partial UI translation.

### Feature Specifications

BIAS now offers **13 comprehensive features** organized into analysis tools and utility features:

**Core Analysis Features:**

1. **Profile Analysis (8-Layer System)**: Each of the 8 behavioral layers is clickable, opening a detail drawer with personalized, actionable insights based on scores, follower count, and profile characteristics.

2. **Growth Strategies Dashboard**: Provides tools like a follower milestone tracker, monetization readiness score, brand deal value calculator, growth projection, weekly action plan, viral formula builder, and content ideas generator.

3. **Video Analyzer Tool**: Features a drag-and-drop file upload for video analysis, providing AI-powered scores (Hook, Visual, Audio, Energy, Viral) and comprehensive insights across categories, along with an actionable editing checklist.

4. **Video Comparison Tool**: Multi-video comparison feature supporting 2-5 videos simultaneously. Analyzes each video individually then generates AI-powered comparative insights including side-by-side score tables, radar chart overlays, best performer identification, weakest area analysis, cross-learnings matrix, and actionable recommendations. Includes comparison history for reviewing past analyses.

**Advanced Intelligence Features:**

5. **Live Stream Performance Analyzer**: Upload recorded live streams to analyze peak viewers, total gifts received, average retention rate, viewer engagement patterns. Includes peak moments timeline visualization, chat sentiment analysis with keywords, and AI-generated performance insights.

6. **Competitor Intelligence Dashboard**: Comprehensive multi-account comparison system with **5-tab interface** (Overview, Behavioral Analysis, Growth & Engagement, Content Strategy, Strategic Insights). Compare up to 5 competitor profiles with detailed metrics including followers, engagement, videos, posting frequency, 8-layer behavioral scores, historical growth trends (4-week tracking), content themes, top formats, posting schedules, and audience segments. Features AI-generated per-competitor strengths/weaknesses analysis, competitive advantages identification, content gap analysis, and cross-competitor synthesis with metric leaders and strategic opportunities. Includes comparison tables, dual-line charts, radar charts, and comprehensive insight cards.

7. **Trend Radar**: Real-time trending sounds and hashtags display with viral scores (0-100), growth velocity metrics, saturation levels, and peak predictions. Shows best posting times, top creators using trends, and personalized opportunity-level recommendations with filters for sound/hashtag categories.

8. **Analytics History Tracker**: Historical performance tracking with follower/video/likes growth visualizations, milestone detection system (growth spikes, score improvements, engagement breakthroughs), and time-series line charts for behavioral scores over time using Recharts.

**Utility & Productivity Features:**

9. **Content Calendar**: Full calendar interface with month navigation for scheduling viral content. CRUD operations for events with titles, descriptions, dates, times, hashtag management, and viral score predictions. Displays upcoming events with edit/delete capabilities.

10. **Collaboration Finder**: Discover potential collaborators with match score calculations (0-100), category filters (education, entertainment, lifestyle, tech, beauty, fitness). Shows creator cards with avatars, follower counts, shared audience metrics, engagement compatibility, and collaboration ideas with contact status tracking.

11. **Export Reports**: Export analysis data to PDF or Excel formats. Supports multiple export types (profile analysis, livestream data, competitor comparisons, trend reports) with export history tracking showing status (completed, processing, pending) and download management.

**Educational & Reference Features:**

12. **Glossary/Perpustakaan Istilah**: Comprehensive glossary with 35+ curated terms across 6 categories: TikTok Platform (FYP, Creator Fund, Shadow Ban), BIAS Analysis (Behavioral Score, Governance Score, Viral Formula), Audio/Video (Hook, B-Roll, Jump Cut), TikTok Slang 2025 (NPC, Gyatt, Rizz, Delulu, Slay), Live Streaming (Gifting, Battle/PK, Premium Gifts), and Content Strategy (Engagement Rate, Algorithm, Niche Down, Trending Sounds). Each term includes detailed definition, effects & impact, and advantages & benefits. Features real-time search across all terms and definitions, category-based filtering, alphabetical sorting, and expandable card UI for detailed insights. Fully integrated with AI Assistant Widget for contextual help. All content curated by BIAS AI and updated regularly to reflect current TikTok trends and platform features. Accessible via homepage card with gradient blue styling.

**AI-Powered Features:**

13. **AI Discussion Assistant**: Real-time conversational AI chat interface powered by Google Gemini 2.0 Flash for discussing TikTok strategies, content ideas, growth tactics, and performance analysis. Features Server-Sent Events (SSE) streaming responses for natural conversation flow, quick prompt suggestions for common topics (Growth, Content, Strategy, Analytics), context-aware answers integrating comprehensive BIAS data (trending sounds/hashtags, recent profile analyses with scores, and competitor comparisons), and unlimited free access leveraging Gemini's generous free tier (15 RPM, 1M tokens/month). The AI assistant provides personalized, actionable recommendations in casual Indonesian language. **Endpoint**: `POST /api/chat` with JSON body `{"message": "string"}` returns SSE stream with `data: {"content": "chunk"}\n\n` format. Context includes: top 5 trending items with viral/growth scores, last 3 analyzed profiles with follower counts and behavioral scores, and up to 2 competitor comparisons (from most recently analyzed profile) with engagement metrics. Available as floating widget on all post-analysis pages and as dedicated full-page experience at `/ai-discussion`.

## External Dependencies

*   **TikTok Data Scraping**: Direct HTTP requests to public TikTok profile pages, parsing data via regex.
*   **Google Gemini Integration**: Gemini 2.0 Flash model for AI-powered chat assistant with real-time streaming responses. FREE tier provides 15 requests/minute and 1 million tokens/month. Configured via `GEMINI_API_KEY`.
*   **Neon Database**: PostgreSQL-compatible serverless database (prepared, not active) for persistent storage, using `@neondatabase/serverless` and Drizzle ORM.
*   **Google Fonts**: Inter and JetBrains Mono loaded via CDN.
*   **Recharts**: For responsive data visualizations.
*   **Replit Development Tools**: Specific plugins for the Replit development environment (e.g., `vite-plugin-cartographer`).