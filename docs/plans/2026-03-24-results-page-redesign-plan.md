# Results Page Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve the quiz results page with better spacing, visual hierarchy, interactive dimension tooltips, hover states, and "From the playbook" guide callouts — without restructuring the page or changing the overall style.

**Architecture:** All changes are to the single `index.html` file. CSS changes go in the `<style>` block. New HTML elements are added inside existing result section divs. Minor JS additions are appended inside the existing `<script>` block. No new files are needed.

**Tech Stack:** Vanilla HTML/CSS/JS. Netlify CLI for deployment (`netlify deploy --prod`).

---

## Context: File Structure

Everything lives in one file: `/Users/rhys/Desktop/FloQast quiz - claude/index.html`

Key CSS sections to know (by line number, approximate):
- `:root` variables: ~line 9
- `.results-section`: ~line 407
- `.score-display`: ~line 416
- `.dimensions-card` / `.dim-row`: ~line 688
- `.maturity-card`: ~line 481
- `.insight-card`: ~line 776
- `@media (max-width: 600px)` results overrides: ~line 1190

Key HTML sections:
- Results container: `<div class="results-section" id="results-section">` ~line 1601
- Score display: ~line 1602
- Dimensions card: ~line 1609
- Maturity card: ~line 1642
- Insight pullout: ~line 1682
- Insight analysis: ~line 1688

There are no automated tests for this project (it's a static HTML page). Verification is done by running the preview server and checking visually. After each task, reload the page, complete the quiz to reach results, and verify the change looks correct.

**To preview locally:** Open `index.html` directly in a browser, or use `python3 -m http.server 8080` from the project directory.

**To deploy:** `cd "/Users/rhys/Desktop/FloQast quiz - claude" && netlify deploy --prod`

---

### Task 1: Increase spacing and padding throughout the results section

**Files:**
- Modify: `index.html` — CSS section, `.results-section.active`, `.score-display`, `.dimensions-card`, `.maturity-card`, `.insight-card`, `.playbook-card`, and their mobile overrides

**Step 1: Find and update results grid gap**

Find this CSS (around line 412):
```css
.results-section.active {
  display: grid;
  gap: 22px;
}
```
Change to:
```css
.results-section.active {
  display: grid;
  gap: 40px;
}
```

**Step 2: Widen the results container**

The results section lives inside `.quiz-container` (max-width: 680px). Add a rule that lets the results section break out slightly. Find the `.quiz-container` rule (~line 244) and add a new rule after it:

```css
.results-section {
  width: calc(100% + 80px);
  margin-left: -40px;
}
```

Wait — the results-section rule already exists (~line 407) with `display: none`. Add the width/margin to `.results-section.active` instead:

```css
.results-section.active {
  display: grid;
  gap: 40px;
  width: calc(100% + 80px);
  margin-left: -40px;
}
```

**Step 3: Increase score display padding**

Find (around line 418):
```css
.score-display {
  ...
  padding: 58px 34px 50px;
  ...
}
```
Change to:
```css
padding: 72px 44px 64px;
```

**Step 4: Increase card padding**

Find `.dimensions-card` (~line 688):
```css
.dimensions-card {
  ...
  padding: 32px;
  ...
}
```
Change to `padding: 40px;`

Find `.maturity-card` (~line 482):
```css
.maturity-card {
  ...
  padding: 32px;
  ...
}
```
Change to `padding: 40px;`

Find `.insight-card` (~line 778):
```css
.insight-card {
  ...
  padding: 28px 30px;
  ...
}
```
Change to `padding: 36px 40px;`

**Step 5: Update mobile overrides**

Find the mobile media query section (~line 1198):
```css
.maturity-card,
.dimensions-card,
.insight-card,
.results-section .floqademy-section {
  padding: 24px 20px;
  border-radius: 18px;
}
```

Also update the gap:
```css
.results-section.active {
  gap: 24px;
  width: 100%;
  margin-left: 0;
}
```

**Step 6: Verify**

Open index.html in browser, complete the quiz, check results page. Cards should feel noticeably more spacious with clear breathing room between each section.

**Step 7: Commit**

```bash
cd /Users/rhys && git add "Desktop/FloQast quiz - claude/index.html" && git commit -m "style: increase results page spacing and card padding"
```

---

### Task 2: Enlarge and enhance the score display

**Files:**
- Modify: `index.html` — `.score-pct`, `.score-profile` CSS, and the score display HTML to add an SVG arc and dot-grid pattern

**Step 1: Increase score number size**

Find (around line 435):
```css
.score-pct {
  font-family: 'Fraunces', serif;
  font-size: 4.5rem;
  ...
}
```
Change `font-size` to `6rem`.

**Step 2: Increase profile name size**

Find (around line 451):
```css
.score-profile {
  font-family: 'Fraunces', serif;
  font-size: 1.5rem;
  ...
}
```
Change `font-size` to `1.75rem`.

**Step 3: Add dot-grid background pattern to score card**

Find `.score-display::before` (~line 426). Add a second pseudo-element `.score-display::after` for the dot grid. Add this CSS after the existing `::before` rule:

```css
.score-display::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
}
```

**Step 4: Add animated SVG arc around the score**

Find the score display HTML (~line 1602):
```html
<div class="score-display results-reveal" style="--delay:0.02s;">
  <div class="score-pct" id="score-pct">0%</div>
  <div class="score-label">AI Readiness Score</div>
  <div class="score-profile" id="score-profile">—</div>
  <p class="score-intro" id="score-intro"></p>
</div>
```

Wrap the score-pct in a new element and add an SVG arc:
```html
<div class="score-display results-reveal" style="--delay:0.02s;">
  <div class="score-arc-wrap">
    <svg class="score-arc-svg" viewBox="0 0 120 120" aria-hidden="true">
      <circle class="score-arc-track" cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="4"/>
      <circle class="score-arc-fill" id="score-arc-fill" cx="60" cy="60" r="52" fill="none" stroke="rgba(200,159,214,0.6)" stroke-width="4" stroke-linecap="round" stroke-dasharray="326.7" stroke-dashoffset="326.7" transform="rotate(-90 60 60)"/>
    </svg>
    <div class="score-pct" id="score-pct">0%</div>
  </div>
  <div class="score-label">AI Readiness Score</div>
  <div class="score-profile" id="score-profile">—</div>
  <p class="score-intro" id="score-intro"></p>
</div>
```

Note: The arc circumference is 2 × π × 52 ≈ 326.7.

**Step 5: Add CSS for the arc wrap**

Add this CSS in the results section CSS area, after `.score-intro`:

```css
.score-arc-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 160px;
  margin: 0 auto 8px;
}
.score-arc-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.score-arc-wrap .score-pct {
  position: relative;
  z-index: 1;
}
@keyframes arcDraw {
  to { stroke-dashoffset: var(--arc-target); }
}
.score-arc-fill {
  transition: stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Step 6: Animate the arc from JS**

Find the JS section where the score percentage is set (search for `score-pct` in the JS ~line 2354). After the count-up animation is triggered, add:

```js
// Animate arc
const arcFill = document.getElementById('score-arc-fill');
if (arcFill) {
  const circumference = 326.7;
  const offset = circumference - (pct / 100) * circumference;
  setTimeout(() => {
    arcFill.style.strokeDashoffset = offset;
  }, 200);
}
```

**Step 7: Verify**

Complete the quiz. The score display should show a large number inside a circular arc that animates in. The dot-grid pattern should be subtly visible in the background.

**Step 8: Commit**

```bash
cd /Users/rhys && git add "Desktop/FloQast quiz - claude/index.html" && git commit -m "feat: enlarge score display with animated arc and dot-grid background"
```

---

### Task 3: Add icons and tooltips to dimension bars

**Files:**
- Modify: `index.html` — CSS for `.dim-row` tooltip behaviour, HTML for each dim-row to add icon + tooltip text

**Step 1: Add tooltip CSS**

Add this CSS after the `.dim-fill` rules (~line 774):

```css
/* Dimension icons */
.dim-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  opacity: 0.75;
}
.dim-icon svg {
  width: 16px;
  height: 16px;
}
.dim-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  margin-bottom: 6px;
  color: var(--text);
  gap: 8px;
}
.dim-label-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Tooltip */
.dim-row {
  position: relative;
  cursor: pointer;
}
.dim-tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 0;
  right: 0;
  background: var(--plum);
  color: rgba(255,255,255,0.9);
  font-size: 0.8rem;
  line-height: 1.5;
  padding: 10px 14px;
  border-radius: 10px;
  pointer-events: none;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.18s ease, transform 0.18s ease;
  z-index: 10;
  font-style: italic;
}
.dim-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 20px;
  border: 6px solid transparent;
  border-top-color: var(--plum);
}
.dim-row:hover .dim-tooltip {
  opacity: 1;
  transform: translateY(0);
}
.dim-row:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(61,25,82,0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
```

**Step 2: Update the dim-row HTML for Strategic**

Find (~line 1622):
```html
<div class="dim-row">
  <div class="dim-label"><span>Strategic Readiness</span><span id="dim-strategic-pct">0%</span></div>
  <div class="dim-track"><div class="dim-fill strategic" id="dim-strategic"></div></div>
</div>
```

Replace with:
```html
<div class="dim-row">
  <div class="dim-tooltip">Every successful AI initiative starts with a clear vision — one that aligns your team and anchors your strategy.</div>
  <div class="dim-label">
    <div class="dim-label-left">
      <span class="dim-icon"><svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="6.5" stroke="#6B2D8B" stroke-width="1.5"/><circle cx="8" cy="8" r="2.5" stroke="#6B2D8B" stroke-width="1.5"/><line x1="8" y1="1.5" x2="8" y2="4" stroke="#6B2D8B" stroke-width="1.5" stroke-linecap="round"/><line x1="8" y1="12" x2="8" y2="14.5" stroke="#6B2D8B" stroke-width="1.5" stroke-linecap="round"/><line x1="1.5" y1="8" x2="4" y2="8" stroke="#6B2D8B" stroke-width="1.5" stroke-linecap="round"/><line x1="12" y1="8" x2="14.5" y2="8" stroke="#6B2D8B" stroke-width="1.5" stroke-linecap="round"/></svg></span>
      <span>Strategic Readiness</span>
    </div>
    <span id="dim-strategic-pct">0%</span>
  </div>
  <div class="dim-track"><div class="dim-fill strategic" id="dim-strategic"></div></div>
</div>
```

**Step 3: Update Operational dim-row**

Find (~line 1626):
```html
<div class="dim-row">
  <div class="dim-label"><span>Operational Readiness</span><span id="dim-operational-pct">0%</span></div>
  <div class="dim-track"><div class="dim-fill operational" id="dim-operational"></div></div>
</div>
```

Replace with:
```html
<div class="dim-row">
  <div class="dim-tooltip">Mapping your current processes is how you uncover where AI can have the biggest impact.</div>
  <div class="dim-label">
    <div class="dim-label-left">
      <span class="dim-icon"><svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 1.5A6.5 6.5 0 1 1 1.5 8" stroke="#3498DB" stroke-width="1.5" stroke-linecap="round"/><path d="M6 6h4v4H6z" stroke="#3498DB" stroke-width="1.5"/><path d="M8 1.5V4M8 12v2.5M1.5 8H4M12 8h2.5" stroke="#3498DB" stroke-width="1.3" stroke-linecap="round"/></svg></span>
      <span>Operational Readiness</span>
    </div>
    <span id="dim-operational-pct">0%</span>
  </div>
  <div class="dim-track"><div class="dim-fill operational" id="dim-operational"></div></div>
</div>
```

**Step 4: Update Execution dim-row**

Find (~line 1630):
```html
<div class="dim-row">
  <div class="dim-label"><span>Execution Readiness</span><span id="dim-execution-pct">0%</span></div>
  <div class="dim-track"><div class="dim-fill execution" id="dim-execution"></div></div>
</div>
```

Replace with:
```html
<div class="dim-row">
  <div class="dim-tooltip">A strategic pilot lets you validate AI's value before committing to full-scale change.</div>
  <div class="dim-label">
    <div class="dim-label-left">
      <span class="dim-icon"><svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 1L5.5 8.5H9L7 15L12.5 6H9L11 1H9Z" stroke="#F39C12" stroke-width="1.5" stroke-linejoin="round"/></svg></span>
      <span>Execution Readiness</span>
    </div>
    <span id="dim-execution-pct">0%</span>
  </div>
  <div class="dim-track"><div class="dim-fill execution" id="dim-execution"></div></div>
</div>
```

**Step 5: Update Sustainability dim-row**

Find (~line 1634):
```html
<div class="dim-row">
  <div class="dim-label"><span>Sustainability Readiness</span><span id="dim-sustainability-pct">0%</span></div>
  <div class="dim-track"><div class="dim-fill sustainability" id="dim-sustainability"></div></div>
</div>
```

Replace with:
```html
<div class="dim-row">
  <div class="dim-tooltip">AI isn't a one-and-done project — continuous improvement ensures it stays relevant as your business evolves.</div>
  <div class="dim-label">
    <div class="dim-label-left">
      <span class="dim-icon"><svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2.5C5 2.5 2.5 5 2.5 8S5 13.5 8 13.5 13.5 11 13.5 8" stroke="#2ECC71" stroke-width="1.5" stroke-linecap="round"/><path d="M11 2l2.5 2.5L11 7" stroke="#2ECC71" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      <span>Sustainability Readiness</span>
    </div>
    <span id="dim-sustainability-pct">0%</span>
  </div>
  <div class="dim-track"><div class="dim-fill sustainability" id="dim-sustainability"></div></div>
</div>
```

**Step 6: Verify**

Complete the quiz to see results. Hover over each dimension bar — a dark tooltip should appear above it with the guide copy. Each bar should have a small icon to the left of its label.

**Step 7: Commit**

```bash
cd /Users/rhys && git add "Desktop/FloQast quiz - claude/index.html" && git commit -m "feat: add icons and hover tooltips to dimension bars"
```

---

### Task 4: Add card hover lift states

**Files:**
- Modify: `index.html` — CSS transitions on `.dimensions-card`, `.maturity-card`, `.insight-card`, `.playbook-card`

**Step 1: Add hover transitions**

Find `.dimensions-card` (~line 688) and add a transition + hover rule:

```css
.dimensions-card {
  ...
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.dimensions-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 50px rgba(61,25,82,0.09);
}
```

Find `.maturity-card` (~line 481) and add:

```css
.maturity-card {
  ...
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.maturity-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 50px rgba(61,25,82,0.09);
}
```

Find `.insight-card` (~line 777) and add:

```css
.insight-card {
  ...
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.insight-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 50px rgba(61,25,82,0.08);
}
```

**Step 2: Verify**

Hover over each card in the results — they should lift slightly. Make sure `.insight-contrast-card` also gets this treatment (find and add the same hover rule).

**Step 3: Commit**

```bash
cd /Users/rhys && git add "Desktop/FloQast quiz - claude/index.html" && git commit -m "style: add hover lift states to result cards"
```

---

### Task 5: Add section eyebrow numbers

**Files:**
- Modify: `index.html` — add eyebrow number spans to main card headers, add CSS for the eyebrow number style

**Step 1: Add CSS for section numbers**

Add after the `.results-reveal` rules (~line 473):

```css
.section-number {
  display: inline-block;
  font-size: 0.7rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--violet);
  margin-bottom: 6px;
}
```

**Step 2: Add eyebrow to dimensions card**

Find (~line 1610):
```html
<div class="dimensions-card results-reveal" style="--delay:0.10s;">
  <h3>Your readiness breakdown</h3>
```

Replace with:
```html
<div class="dimensions-card results-reveal" style="--delay:0.10s;">
  <div class="section-number">01 — Readiness breakdown</div>
  <h3>Your readiness breakdown</h3>
```

**Step 3: Add eyebrow to maturity card**

Find (~line 1642):
```html
<div class="maturity-card results-reveal" style="--delay:0.18s;">
  <div class="maturity-header">
    <div>
      <div class="maturity-eyebrow">Accounting AI Maturity Model</div>
```

Change the maturity-eyebrow text to include the section number:
```html
<div class="maturity-eyebrow">02 — Accounting AI Maturity Model</div>
```

**Step 4: Add section numbers to insight cards (via JS)**

The insight cards are populated dynamically by JS. Search for where `insight-analysis` is built in the JS (~line 2200 area — search for `insight-analysis`). After the card's heading is set, prepend `<div class="section-number">03 — Analysis</div>`. Do the same for `insight-next-steps` (04) and `insight-playbook` (05).

Note: These cards are built in JS so the eyebrow must be injected there, not in the HTML.

**Step 5: Verify**

Check that section numbers appear on the dimensions card and maturity card. Run through the full quiz to check the JS-populated cards also show numbers.

**Step 6: Commit**

```bash
cd /Users/rhys && git add "Desktop/FloQast quiz - claude/index.html" && git commit -m "style: add section eyebrow numbers to results cards"
```

---

### Task 6: Add "From the playbook" callout component

**Files:**
- Modify: `index.html` — add `.playbook-callout` CSS, add three callout instances to the HTML (one in dimensions card, one in maturity card, one in insight-analysis via JS)

**Step 1: Add the callout CSS**

Add this CSS after `.insight-card.emphasis` rules (~line 801):

```css
/* From the playbook callout */
.playbook-callout {
  margin-top: 24px;
  padding: 16px 20px 16px 20px;
  border-left: 3px solid var(--purple);
  background: var(--pale);
  border-radius: 0 12px 12px 0;
}
.playbook-callout-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.68rem;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: var(--purple);
  font-weight: 700;
  margin-bottom: 8px;
}
.playbook-callout-label svg {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}
.playbook-callout p {
  font-family: 'Fraunces', serif;
  font-size: 0.92rem;
  line-height: 1.6;
  color: var(--plum);
  font-style: italic;
  font-weight: 400;
  margin: 0;
}
@keyframes calloutPulse {
  0%, 100% { border-left-color: var(--purple); }
  50% { border-left-color: var(--violet); }
}
.playbook-callout.animate-in {
  animation: calloutPulse 1.2s ease 0.4s 2;
}
```

**Step 2: Add callout inside the dimensions card**

Find the closing `</div>` of `.dimensions-card` (~line 1640). Just before it, add:

```html
        <div class="playbook-callout">
          <div class="playbook-callout-label">
            <svg viewBox="0 0 12 12" fill="none"><rect x="1" y="1" width="10" height="10" rx="1.5" stroke="currentColor" stroke-width="1.2"/><line x1="3.5" y1="4" x2="8.5" y2="4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="3.5" y1="6" x2="8.5" y2="6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="3.5" y1="8" x2="6.5" y2="8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
            From the playbook
          </div>
          <p>"Before you can improve the way your team works, you need to understand where it is today. These four dimensions reveal exactly that — and where AI can have the biggest impact."</p>
        </div>
```

**Step 3: Add callout inside the maturity card**

Find the closing `</div>` of `.maturity-journey` section (~line 1679), just before `</div>` that closes `.maturity-card`. Add after the `maturity-journey` div:

```html
        <div class="playbook-callout">
          <div class="playbook-callout-label">
            <svg viewBox="0 0 12 12" fill="none"><rect x="1" y="1" width="10" height="10" rx="1.5" stroke="currentColor" stroke-width="1.2"/><line x1="3.5" y1="4" x2="8.5" y2="4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="3.5" y1="6" x2="8.5" y2="6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="3.5" y1="8" x2="6.5" y2="8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
            From the playbook
          </div>
          <p>"A well-executed pilot builds confidence in the technology and creates a roadmap for scaling AI across your organisation. Start small, then expand."</p>
        </div>
```

**Step 4: Add callout to insight-analysis via JS**

Find where the `insight-analysis` card HTML is constructed in the JS (search for `insight-analysis` and `innerHTML` near it). At the end of the HTML string being set, append:

```js
const calloutHtml = `<div class="playbook-callout animate-in">
  <div class="playbook-callout-label">
    <svg viewBox="0 0 12 12" fill="none"><rect x="1" y="1" width="10" height="10" rx="1.5" stroke="currentColor" stroke-width="1.2"/><line x1="3.5" y1="4" x2="8.5" y2="4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="3.5" y1="6" x2="8.5" y2="6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="3.5" y1="8" x2="6.5" y2="8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
    From the playbook
  </div>
  <p>"AI isn't just a finance initiative — it's a cross-functional effort. Aligning goals across finance, audit, and IT ensures collaboration and buy-in from all stakeholders."</p>
</div>`;
document.getElementById('insight-analysis').innerHTML += calloutHtml;
```

**Step 5: Add scroll-in animation to callouts**

The callouts inside static HTML will animate when their parent card is revealed (they inherit the card's `resultReveal` animation). The one in `insight-analysis` has an explicit `animate-in` class for the border pulse.

**Step 6: Verify**

After completing the quiz, check:
- Dimensions card shows the callout at the bottom
- Maturity card shows the callout after the 5-stage journey
- Analysis card shows the third callout
- All three are visually consistent (lavender bg, purple left border, italic serif text)
- Hover over callouts — they should be static (no hover lift needed here)

**Step 7: Commit**

```bash
cd /Users/rhys && git add "Desktop/FloQast quiz - claude/index.html" && git commit -m "feat: add From the playbook callouts to results cards"
```

---

### Task 7: Add radar chart glow pulse

**Files:**
- Modify: `index.html` — CSS keyframe for radar glow, applied after the chart is drawn

**Step 1: Add glow keyframe and class**

Add this CSS after `.breakdown-radar` (~line 730):

```css
@keyframes radarGlow {
  0%, 100% { filter: drop-shadow(0 0 4px rgba(107,45,139,0.3)); }
  50% { filter: drop-shadow(0 0 12px rgba(107,45,139,0.6)); }
}
.breakdown-radar.glow-active {
  animation: radarGlow 2s ease-in-out 3;
}
```

**Step 2: Trigger the glow from JS**

Find where the radar chart is drawn in JS (search for `readiness-radar` and the function that populates it, ~line 2125). After the SVG rendering is complete, add:

```js
setTimeout(() => {
  const radar = document.getElementById('readiness-radar');
  if (radar) {
    radar.classList.add('glow-active');
  }
}, 800);
```

**Step 3: Verify**

After completing the quiz, the radar chart should pulse with a purple glow 3 times after drawing in.

**Step 4: Commit**

```bash
cd /Users/rhys && git add "Desktop/FloQast quiz - claude/index.html" && git commit -m "feat: add glow pulse animation to radar chart"
```

---

### Task 8: Final QA and deploy

**Step 1: Full results page walkthrough**

Complete the quiz end-to-end (try both a high score and a low score by answering all 1s or all 5s). Check:
- [ ] Score card: large number, arc animates, dot-grid visible
- [ ] Dimensions card: icons visible, tooltips work on hover, callout at bottom
- [ ] Maturity card: 5-stage journey visible, callout at bottom, spacing generous
- [ ] Insight pullout: 3-column layout holds, cards lift on hover
- [ ] Analysis card: section number visible, callout at bottom
- [ ] Next steps card: section number visible
- [ ] Playbook card: section number visible
- [ ] FloQademy section: unchanged
- [ ] Mobile (resize to 375px): no layout breaks, tooltips readable, spacing ok

**Step 2: Fix any issues found**

Address any visual regressions before deploying.

**Step 3: Deploy to Netlify**

```bash
cd "/Users/rhys/Desktop/FloQast quiz - claude" && netlify deploy --prod
```

Verify the live URL: https://floqast-quiz-v2.netlify.app/

**Step 4: Final commit**

```bash
cd /Users/rhys && git add "Desktop/FloQast quiz - claude/index.html" && git commit -m "feat: deploy results page redesign to production"
```
