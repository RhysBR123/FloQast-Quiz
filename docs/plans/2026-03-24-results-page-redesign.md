# Results Page Redesign — Design Document
**Date:** 2026-03-24
**Status:** Approved

## Summary

Redesign the quiz results page to improve spacing, visual hierarchy, and reader engagement. The page is embedded as an iframe in FloQast's website. No structural changes to section order. No major style overhaul — existing colours, fonts, and component language are preserved.

## Goals

- Fix cramped spacing (both between cards and within cards)
- Add visual/graphic engagement (icons, score arc, tooltips, hover states)
- Add interactivity (card hovers, dimension bar tooltips, callout animations)
- Add "From the playbook" guide explainers drawn from the FloQast AI Playbook PDF

## Approach: Breathing Room + Inline Explainers

### 1. Spacing & Layout

- Results grid gap: 22px → 40px
- All card internal padding: 28–32px → 40px
- Score display padding: bumped to ~70px top/bottom
- Results section `max-width` breaks out to 760px (slightly wider than 680px quiz container)

### 2. Score Display

- Score `%` font size: 4.5rem → 6rem
- Profile name font size: 1.5rem → 1.75rem
- Animated SVG arc/ring draws in behind the score on reveal
- Subtle decorative dot-grid background pattern in the score card

### 3. Dimension Bars

- SVG icon added left of each dimension label:
  - Strategic → target/compass icon
  - Operational → gear/settings icon
  - Execution → lightning bolt icon
  - Sustainability → refresh/cycle icon
- CSS tooltip on hover beneath each bar (no JS required), with guide-derived copy:
  - Strategic: "Every successful AI initiative starts with a clear vision — one that aligns your team and anchors your strategy."
  - Operational: "Mapping your current processes is how you uncover where AI can have the biggest impact."
  - Execution: "A strategic pilot lets you validate AI's value before committing to full-scale change."
  - Sustainability: "AI isn't a one-and-done project — continuous improvement ensures it stays relevant as your business evolves."
- Bar rows: hover lift (translateY -2px + deeper shadow)
- `cursor: pointer` on hover

### 4. "From the Playbook" Callouts

New `.playbook-callout` component: lavender background (`--pale`), left border in `--purple`, small eyebrow "From the playbook", italic serif body text.

Placed in three locations:

1. **Below dimension bars** (inside `.dimensions-card`):
   > "Before you can improve the way your team works, you need to understand where it is today. These four dimensions reveal exactly that — and where AI can have the biggest impact."

2. **After maturity 5-stage journey** (inside `.maturity-card`):
   > "A well-executed pilot builds confidence in the technology and creates a roadmap for scaling AI across your organisation. Start small, then expand."

3. **Inside `.insight-analysis` card** (appended after existing content):
   > "AI isn't just a finance initiative — it's a cross-functional effort. Aligning goals across finance, audit, and IT ensures collaboration and buy-in from all stakeholders."

### 5. Interactive Details

- All `.insight-card`, `.dimensions-card`, `.maturity-card`: hover lift (translateY -3px, box-shadow deepens), 0.2s ease
- Maturity steps: verify hover states are smooth
- Dimension bar tooltips: CSS-only (`:hover` on `.dim-row`)
- "From the playbook" callouts: subtle left-border pulse animation on scroll-in

### 6. Visual Finishing

- Section eyebrow numbers (01, 02, 03…) added to major card headers
- Radar chart: subtle pulse-glow after draw-in completes
- Score count-up animation: same mechanism, more dramatic (slower, bigger number)

## Source Material

FloQast AI Playbook — "Your AI Playbook for Accounting: A Step-by-Step Guide to Transforming Your Workflows" (September 2025)

Dimension-to-guide mapping:
- Strategic → Step 01 (Define Vision), Step 04 (Build Business Case)
- Operational → Step 02 (Map Processes), Step 03 (AI Fit Assessment)
- Execution → Step 05 (Evaluate Providers), Step 06 (Strategic Pilot Plan)
- Sustainability → Step 07 (Operationalize Change), Step 08 (Measure Success)

## Deployment

Netlify — existing project at floqast-quiz-v2.netlify.app. Deploy via Netlify CLI after changes are complete.
