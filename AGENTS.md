# Repo Agent Guidance

This file defines the default product UI guidance for work in this repository.

Use these rules for the signed-in app experience under `app/(app)` and the shared UI components that support it.

If the user explicitly asks to break one of these rules, follow the user. Otherwise, treat these as defaults.

## Product Posture

- The signed-in app should feel like a serious operating platform, not a consumer onboarding toy.
- Prefer restraint, clarity, and calm hierarchy over decorative surfaces or promotional framing.
- Avoid “hero” treatment inside workspace pages unless the user explicitly asks for a more expressive marketing-style surface.

## Workspace Pages

- Dashboard, Signals, and Telegram pages should stay sparse.
- Show current state and one clear next action.
- Do not fill workspace pages with template galleries, step-by-step walkthroughs, marketing copy, or redundant decision panels.
- If the user has no data yet, prefer a simple empty state with one action.
- Keep instructional detail inside the actual workflow or behind an on-demand help surface such as a dialog.

## Onboarding And Help

- Template education belongs in the builder flow, not the inventory page.
- Telegram setup explanation belongs in a help dialog or dedicated setup flow, not permanently rendered on the main workspace.
- When guidance is necessary, prefer compact contextual help over static multi-card tutorials.

## Typography

- Do not use bold or semibold weights in product UI by default.
- Use regular weight text, spacing, size, and contrast to create hierarchy.
- Keep headings clear but not loud.
- Avoid typography that feels promotional, oversized, or overly dramatic in the app workspace.

## Buttons And Controls

- Primary buttons should feel precise and professional, not loud or playful.
- Avoid saturated, heavy-looking CTA styling when a calmer treatment will work.
- Prefer flatter, darker, more restrained primary actions for the app workspace.
- Secondary actions should look structural and quiet.

## Shape Language

- Keep radii tight across the product UI.
- Avoid pill-shaped buttons, badges, tabs, and links unless there is a strong functional reason.
- Prefer small-radius cards, controls, inputs, and chips.
- Large rounded corners should be rare and reserved for cases where they materially improve the layout.

## Visual Tone

- Prefer clean borders, subtle contrast, and stable spacing over glow, punchy color blocks, or “fancy” treatment.
- The UI should read as production software for monitoring and operations.
- When deciding between expressive and restrained, default to restrained.

## Implementation Pattern

- When changing UI tone, update shared primitives first, then feature components, then page-level layout.
- Before adding a new panel or callout, ask whether the same goal can be met with less surface area.
- If a page already has one clear action, avoid adding another equally prominent action unless the workflow truly requires it.

## Reference

- See [DESIGN.md](./DESIGN.md) for the companion design rules used by the app UI.
