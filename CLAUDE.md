# CLAUDE.md - Flare Landing Page

## Project Context
Static landing page for **Flare** — "Event Triggers for DeFi Agents"

**Narrative:** AI agents need reliable blockchain event sources. Flare provides composable signal monitoring that watches the chain while you sleep. Built by the Monarch team.

## Design System
**MUST match Monarch's style** (see `/Users/anton/projects/monarch/` for reference)

### Colors
- Primary: `#ff6b35` (flare orange)
- Accent: `#ff9f1c` (ember yellow)
- Dark BG: `#16181a`, Secondary: `#202426`
- Light BG: `#f0f2f7`

### Typography
- Headings: `font-zen` (Zen Kaku Gothic New) - imported in globals.css
- Body: Inter (default)
- Code: Victor Mono / monospace

### Key Classes (from globals.css)
- `bg-dot-grid` - dot texture background
- `bg-line-grid` - line texture background
- `bg-gradient-flare` - orange-yellow gradient
- `text-gradient-flare` - gradient text
- `bg-surface` - card background
- `bg-main` - page background
- `font-zen` - heading font

### Roundness
- Buttons: `rounded-md` (6px)
- Cards: `rounded-lg` (8px)
- Small elements: `rounded-sm` (2px)

## Page Sections

### 1. Header
- Logo: "🔥 Flare" (left)
- Nav: Docs | GitHub | Discord (right)
- Dark mode toggle
- Sticky, transparent initially, solid on scroll
- Mobile: hamburger menu

### 2. Hero
- Section tag: "Event Infrastructure for Agents"
- Headline: `<h1 class="font-zen text-4xl md:text-5xl">Watch the Chain<br/>While You Sleep</h1>`
- Subline with typing effect showing use cases
- CTAs: "View Docs" (primary), "Try Simulator" (secondary)
- Background: bg-dot-grid with radial fade

### 3. How It Works (3 cards)
1. **Define** - "Write conditions in simple JSON DSL"
2. **Deploy** - "Register your signal via API"
3. **React** - "Receive webhooks when triggered"

### 4. Features Grid (2x2 on desktop)
- Multi-Condition Logic (AND/OR groups)
- Time Windows (track changes over 1h to 30d)
- Protocol-Native Metrics (Morpho data)
- Battle-Tested (built by Monarch)

### 5. Code Examples
Real DSL examples with syntax highlighting:
```json
{
  "name": "Whale Exit Alert",
  "conditions": [{
    "type": "change",
    "metric": "Morpho.Position.supplyShares",
    "direction": "decrease",
    "by": { "percent": 20 }
  }]
}
```

### 6. For Agents Section
- Explain OpenClaw integration
- Show webhook → agent action flow
- Link to agent-friendly docs

### 7. API Quick Reference
Simple table:
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /signals | Create signal |
| GET | /signals/:id | Get status |
| POST | /simulate | Test signal |

### 8. Footer
- Links: Docs, GitHub, Discord
- "Built by Monarch" badge with link
- Copyright

## Component Structure
```
components/
├── Header.tsx
├── Hero.tsx
├── HowItWorks.tsx
├── Features.tsx
├── CodeExamples.tsx
├── ForAgents.tsx
├── ApiReference.tsx
├── Footer.tsx
└── ui/
    ├── Button.tsx
    ├── SectionTag.tsx
    ├── Card.tsx
    └── CodeBlock.tsx
```

## Mobile Requirements
- All sections stack vertically
- Code blocks horizontally scrollable
- Touch-friendly buttons (min-h-11)
- Font sizes: body 16px+, headings scale appropriately
- Test at 375px width

## Animation Guidelines
- Use Framer Motion sparingly
- Fade in sections on scroll
- Typing effect for hero subline
- No heavy animations that hurt performance

## Commands
```bash
pnpm dev      # Start dev server
pnpm build    # Production build
pnpm lint     # Check linting
```

## Quality Checklist
- [ ] Matches Monarch visual style
- [ ] Dark mode works correctly
- [ ] Mobile responsive (375px - 1440px)
- [ ] All links work
- [ ] Code examples are accurate
- [ ] Lighthouse score 90+
- [ ] No TypeScript errors
- [ ] No console errors

## Reference Files
- Monarch global.css: `/Users/anton/projects/monarch/app/global.css`
- Monarch home: `/Users/anton/projects/monarch/src/features/home/home-view.tsx`
- Flare docs: `/Users/anton/projects/flare/docs/ARCHITECTURE.md`
- Flare API: `/Users/anton/projects/flare/docs/API.md`
