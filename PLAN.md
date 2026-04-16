# Megabat Landing Page - Implementation Plan

## Overview
Static landing page for Megabat — "Event Triggers for DeFi Agents"

**Narrative:** AI agents need reliable blockchain event sources. Megabat provides composable signal monitoring that watches the chain while you sleep.

## Design System (Match Monarch)

### Colors
- **Megabat Primary:** `#ff6b35` (fire orange, slightly more vibrant than Monarch's #f45f2d)
- **Megabat Accent:** `#ff9f1c` (ember yellow for gradients)
- **Dark BG:** `#16181a` (same as Monarch)
- **Dark Secondary:** `#202426`
- **Light BG:** `#f0f2f7`

### Typography
- **Headings:** Zen Kaku Gothic New (same as Monarch)
- **Body:** Inter
- **Code:** Victor Mono / monospace

### Spacing & Roundness
- Border radius: sm=2px, md=6px, lg=8px (same as Monarch)
- Container padding: px-6 sm:px-8 md:px-12 lg:px-16
- Grid textures: bg-dot-grid, bg-line-grid with fade masks

## Page Structure

### 1. Hero Section
- Tag: "Event Infrastructure for Agents"
- Headline: "Watch the Chain While You Sleep"
- Subline: Typing animation showing use cases:
  - "Alert when a whale exits"
  - "Track position drops in real-time"  
  - "Trigger webhooks on-chain events"
- CTA: "Read the Docs" / "Try Simulator"
- Visual: Animated signal flow diagram or code snippet

### 2. How It Works (3 Steps)
1. **Define** - Write conditions in simple DSL
2. **Deploy** - Register signal via API
3. **React** - Receive webhooks when triggered

### 3. Feature Cards
- **Multi-Condition Logic** - AND/OR groups, nested conditions
- **Time Windows** - Track changes over 1h, 7d, 30d
- **Protocol-Native Metrics** - Morpho positions, markets, events
- **Battle-Tested** - Built by Monarch team

### 4. Code Examples
Show real DSL examples:
- Whale position drop alert
- Utilization spike warning
- Supply/withdraw event aggregation

### 5. For Agents Section
- OpenClaw integration example
- SKILL.md format for agent consumption
- Webhook → Agent action flow

### 6. API Reference (Quick)
- POST /signals - Create signal
- GET /signals/:id - Check status
- POST /simulate - Test without deploying

### 7. Footer
- Links: Docs, GitHub, Discord, Monarch
- "Built by Monarch" badge

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS 4
- **Fonts:** Google Fonts (Inter, Zen Kaku Gothic New) + local Victor Mono
- **Icons:** react-icons (Remix Icons)
- **Animations:** Framer Motion (subtle)
- **Deployment:** Vercel (megabat.monarch.xyz)

## File Structure
```
megabat-landing/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── global.css
│   └── fonts.ts
├── components/
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── HowItWorks.tsx
│   ├── Features.tsx
│   ├── CodeExamples.tsx
│   ├── ForAgents.tsx
│   ├── ApiReference.tsx
│   ├── Footer.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── SectionTag.tsx
│       ├── CodeBlock.tsx
│       └── GridTexture.tsx
├── public/
│   └── imgs/
├── tailwind.config.ts
├── package.json
└── README.md
```

## Mobile Optimization
- Responsive grid: 1 col mobile, 2 col desktop
- Touch-friendly buttons (min 44px)
- Readable font sizes (16px+ body)
- Collapsible code examples on mobile
- Sticky header with hamburger menu

## Implementation Phases

### Phase 1: Setup (30 min) ✅
- [x] Create Next.js project
- [x] Configure Tailwind with Monarch colors
- [x] Set up fonts (Inter, JetBrains Mono, Zen Kaku Gothic New)
- [x] Create global.css with theme variables

### Phase 2: Components (2 hours) ✅
- [x] Header with logo + nav + dark mode toggle
- [x] Hero section with typing animation
- [x] How It Works section (3 steps)
- [x] Feature cards grid (4 features)
- [x] Code examples with syntax highlighting + tabs

### Phase 3: Polish (1 hour) ✅
- [x] For Agents section
- [x] API quick reference table
- [x] Footer
- [x] Dark/light mode toggle

### Phase 4: Mobile (1 hour) ✅
- [x] Responsive testing
- [x] Touch optimization
- [x] Performance audit (build passes, edge-compatible)

### Phase 5: Content (30 min) ✅
- [x] Final copy review
- [x] Meta tags / SEO (full metadata, JSON-LD)
- [x] Social preview image (OG + Twitter generated)

## Hourly Check-in Schedule
- 00:00 - Project setup complete
- 01:00 - Hero + Header done
- 02:00 - Features + How It Works done
- 03:00 - Code examples + For Agents done
- 04:00 - Mobile optimization done
- 05:00 - Final polish + deploy ready
- 06:00 - Review and handoff

### Phase 6: Deployment ✅
- [x] GitHub repo created: monarch-xyz/megabat-landing
- [x] ESLint errors fixed
- [x] Build passes clean
- [ ] Deploy to Vercel (megabat.monarch.xyz) — **READY**

## Deployment

**Repository:** https://github.com/monarch-xyz/megabat-landing

**To deploy:**
1. Import to Vercel: https://vercel.com/new
2. Select `monarch-xyz/megabat-landing`
3. Set custom domain: `megabat.monarch.xyz`
4. Deploy

## Notes
- Keep it STATIC — no backend, no auth, just info
- Optimize for agents reading (clear structure, code-first)
- Match Monarch's premium feel but with Megabat's identity
