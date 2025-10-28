# BIAS Platform Design Guidelines

## Design Approach: System-Based (Analytics Dashboard)

**Selected System**: Material Design + Linear-inspired minimalism  
**Justification**: Analytics platforms require clarity, scannable data hierarchies, and professional polish. Material Design provides robust data visualization patterns, while Linear's aesthetic adds modern refinement.

**Key Design Principles**:
- Data clarity over decoration
- Purposeful use of color to highlight insights
- Consistent visual rhythm for quick scanning
- Professional credibility through restrained design

---

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary)**:
- Background: `222 15% 10%` (deep charcoal)
- Surface: `222 15% 14%` (card backgrounds)
- Surface elevated: `222 15% 18%` (hover states, dropdowns)
- Border: `222 10% 25%` (subtle divisions)
- Text primary: `0 0% 98%`
- Text secondary: `0 0% 70%`

**Brand & Accent Colors**:
- Primary (TikTok-inspired): `348 90% 58%` (vibrant pink-red for CTAs, key metrics)
- Success (positive metrics): `142 76% 45%` (behavioral health indicators)
- Warning (attention needed): `38 92% 50%` (governance alerts)
- Info (neutral insights): `217 91% 60%` (behavioral data points)
- Muted accent: `262 52% 58%` (secondary actions, backgrounds)

**Light Mode**:
- Background: `0 0% 98%`
- Surface: `0 0% 100%`
- Border: `220 13% 91%`
- Text primary: `222 15% 15%`
- Text secondary: `222 13% 45%`

**Chart Colors** (8-layer model visualization):
- Visual: `348 90% 58%` (pink-red)
- Audio: `262 52% 58%` (purple)
- Energy: `38 92% 50%` (orange)
- Interaction: `217 91% 60%` (blue)
- Linguistic: `142 76% 45%` (green)
- Contextual: `280 70% 60%` (violet)
- Environmental: `190 70% 50%` (cyan)
- Governance: `24 85% 55%` (amber)

---

### B. Typography

**Font Families**:
- Primary: Inter (Google Fonts) - all UI text, metrics, labels
- Monospace: JetBrains Mono - numerical data, timestamps, IDs

**Type Scale**:
- Display (Dashboard titles): `text-4xl font-bold tracking-tight`
- Heading 1 (Section headers): `text-2xl font-semibold`
- Heading 2 (Card titles): `text-lg font-semibold`
- Heading 3 (Subsections): `text-base font-medium`
- Body: `text-sm font-normal`
- Small (Metadata, captions): `text-xs font-normal`
- Metrics (Large numbers): `text-3xl font-bold font-mono tabular-nums`
- Micro metrics: `text-lg font-semibold font-mono tabular-nums`

---

### C. Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12** for consistency.
- Tight spacing: `gap-2, p-2` (within components)
- Standard spacing: `gap-4, p-4, m-4` (between elements)
- Section spacing: `gap-6, p-6` (card padding)
- Major spacing: `p-8, gap-8` (dashboard sections)
- Extra spacing: `p-12, gap-12` (page-level separation)

**Grid System**:
- Dashboard layout: Sidebar (260px fixed) + Main content (flex-1)
- Card grids: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- Metrics row: `grid-cols-2 md:grid-cols-4 gap-4`
- Analysis sections: Single column with max-w-7xl container

---

### D. Component Library

**Navigation**:
- Fixed sidebar: Dark surface with logo, main navigation, user profile
- Top bar: Search, notifications, settings, profile dropdown, dark mode toggle
- Breadcrumbs: Show current location in analytics hierarchy

**Data Display Components**:
- **Metric Cards**: Rounded corners (`rounded-lg`), subtle shadow, icon + label + large number + trend indicator (↑↓)
- **Behavioral Radar Chart**: 8-axis radar showing all behavioral layers, filled with 20% opacity, stroke with full brand colors
- **Line Charts**: Historical metrics with gradient fill below line, minimal gridlines, interactive tooltips
- **Bar Charts**: Horizontal bars for comparison, colored by performance tier (red/yellow/green zones)
- **Score Gauge**: Circular progress indicator for governance integrity score (0-100)
- **Data Tables**: Striped rows on hover, sortable headers, sticky header on scroll, monospace numbers

**Input Components**:
- **Search Bar**: Prominent placement, placeholder "Enter TikTok username or URL", rounded-full design with icon
- **Analysis Card**: White/dark surface with input field + "Analyze" CTA button in primary color
- **Filters/Tabs**: Underlined active state, subtle hover background

**Status Indicators**:
- **Badges**: Small rounded pills for categories (Governance Alert, High Energy, etc.)
- **Progress Bars**: Thin horizontal bars showing behavioral score ranges
- **Health Icons**: Checkmark/Warning/Error icons with semantic colors

**Overlays**:
- **Insights Panel**: Slide-in drawer from right showing AI-generated recommendations
- **Profile Comparison Modal**: Full-screen overlay with side-by-side behavioral breakdowns
- **Loading States**: Skeleton screens for cards, animated pulse effect

---

### E. Animations

**Minimal, Purposeful Motion**:
- Card hover: `transition-shadow duration-200` subtle shadow lift
- Chart animations: Smooth data entry (500ms ease-out) on first render only
- Page transitions: Fade-in content with `transition-opacity duration-300`
- Drawer/Modal: Slide-in from edge with `transition-transform duration-300`
- **No**: Auto-playing carousels, parallax effects, decorative animations

---

## Dashboard-Specific Patterns

**Analysis Input Page**:
- Centered layout with generous whitespace
- Large, friendly input field with example placeholder
- Quick access to recently analyzed profiles (horizontal scrollable cards)
- Minimal hero: Clean typography stating platform purpose

**Profile Analysis View**:
- Top section: Profile header (avatar, username, follower count, analyze timestamp)
- Governance score prominently displayed (large gauge + interpretation)
- 8-Layer Behavioral Breakdown: Grid of 8 cards, each with score, mini visualization, and quick insight
- Detailed charts section: Radar chart + historical line graphs
- AI Insights panel: Expandable section with bullet-point recommendations
- Action footer: Export report, Compare with other profile, Track this creator

**Comparison Dashboard**:
- Split-screen layout: Two profiles side-by-side
- Overlay radar charts for direct visual comparison
- Difference indicators (+/-) for each metric
- Summary table highlighting key behavioral gaps

**Historical Tracking**:
- Timeline view with line chart showing metric evolution
- Behavioral consistency score trending over time
- Event markers for significant changes (follower spikes, content shifts)

---

## Images

**Hero Section**: No large hero image needed for this analytics platform. Use clean typography and the analysis input form as the hero element.

**Profile Avatars**: Display TikTok profile pictures fetched from scraping in circular frames (`rounded-full, w-20 h-20` for large view, `w-10 h-10` for cards).

**Empty States**: Use simple illustrations or icons (from Heroicons) with helpful text when no data exists yet ("No profiles analyzed yet - enter a TikTok username to start").