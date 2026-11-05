# Design system for this site

The site follows the "Nordic Industrial Corporate" style prompt below. That prompt is the source of truth for all visual work. Where this site departs from it on purpose, the decision is recorded here first.

## Project adaptations (read before the spec)

| Spec | This site | Why |
|---|---|---|
| `--orange` #EB6631 button fill | `--accent` #C2510E, hover `--accent-strong` #A3440B | White 16px bold text on #EB6631 is 3.2:1 and fails WCAG AA. #C2510E reaches 4.7:1. |
| `--orange-deep` #CC4E12 headings, rules, utility nav | `--accent-strong` #A3440B | Same accessibility reason. Also the hover colour of buttons. |
| `--orange-light` / decorative orange | `--highlight` #EA761F (logo orange) | Used only for carets, line icons, list markers and the focus outline. Never for text. |
| `--taupe` #7A6E65 footer, mobile menu | `--inverse` #13714F (logo green) | The MBR logo is green and orange; green is the brand's dark colour. |
| `--teal` data strip, used once | Key-figures strip on the home page, in logo green | Same role as the ticker: one data strip on the site. |
| Hero: full-bleed video/photo with bottom title band | Home opens on the logo: a white veil fades out, then a blurred copy of the logo pulls into focus. Header and the rest appear on scroll. | Requested by the client. This is the only animation and the only motion longer than 0.3s. |
| Tier 2 header: "Search" on the right | "Begär offert" pill button | The site has no search. |
| Mega menu | Not used | Only five main sections. |
| Badge row, press releases, ticker | Not used | No content for them. |
| News lists on home | Not used | No real posts yet. |
| Horizontal process timeline | Vertical when a timeline has more than 5 steps | Seven steps do not fit side by side in 960px. |

Tokens live in `src/styles/global.css`. Shared modules: `Button` (pill), `Section`, `Container` (960px), `PhotoBanner` (6.4), `RoutingTile` (6.3), `ProjectCard` (6.6), `.rule-heading` (6.8), `.caret` (6.9).

---

# STYLE PROMPT — "Nordic Industrial Corporate" (reverse-engineered from peab.se)

You are redesigning a website. Apply the following design system EXACTLY. Do not add trends (glassmorphism, big radii, gradients on UI, neon, dark mode, oversized hero type, animations on scroll). This style wins by restraint, flatness, and real photography. Every value below is measured from the reference site.

---

## 1. VIBE / FEEL (read first, obey everywhere)

- Nordic, sober, trustworthy, industrial-corporate. A large, serious construction company that builds roads, bridges, homes. Feels solid, practical, unpretentious, "Scandinavian public-sector clean".
- Flat. No card shadows, no rounded cards, no decorative shapes. Square corners on everything except buttons (pills).
- Light grey canvas with white rectangular content blocks floating on it. The grey gaps ARE the layout.
- Photography carries all emotion: real workers in hi-vis orange jackets and helmets, city aerials, bridges, interiors, executive portraits. The brand orange in the photos is echoed by the UI orange — that link is the whole identity.
- One warm accent color (orange) used sparingly for headings-as-links, rules, and buttons. Everything else is charcoal, white, grey, and a warm taupe-brown.
- Narrow, centered, fixed content column (960px). Generous breathing room between blocks, compact inside blocks.
- Copy tone: plain, factual, short. Headlines are often questions ("Looking for a home?", "Want to build?", "Want to work with us?").
- Slightly classic enterprise-CMS structure (stacked modules), but executed cleanly. Not trendy, not startup-y. Confident and calm.

---

## 2. COLOR TOKENS

```css
:root {
  /* Canvas & surfaces */
  --bg-page:        #F4F4F4;  /* page background, always */
  --surface:        #FFFFFF;  /* cards, panels, header */
  --grey-100:       #E6E6E6;  /* hairline dividers, list separators */
  --grey-200:       #CCCCCC;  /* secondary borders, inputs */
  --grey-300:       #B3B3B3;  /* subtle outlines, tiny glow on badges */
  --grey-500:       #808080;  /* muted/disabled text */

  /* Text */
  --text:           #333333;  /* ALL body text and dark headings (never pure black) */
  --text-on-dark:   #FFFFFF;
  --text-on-dark-2: rgba(255,255,255,0.64); /* secondary text on dark/photo */

  /* Brand accent — orange family */
  --orange:         #EB6631;  /* buttons, back-to-top, active fills */
  --orange-deep:    #CC4E12;  /* accent headings/links, utility nav, section rules, active nav underline */
  --orange-light:   #EF8256;  /* icons/hover accents inside dark menus */

  /* Secondary neutrals / accents */
  --taupe:          #7A6E65;  /* mega menu, footer, search submit button — warm brown-grey */
  --teal:           #2D8289;  /* single data strip (stock ticker); used once, never elsewhere */

  /* Overlays */
  --overlay-grad:   linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0));
  --overlay-chip:   rgba(0,0,0,0.30);   /* behind photo credit text */
  --overlay-dim:    rgba(0,0,0,0.48);   /* modal/menu backdrop */

  --shadow-header:  0 2px 8px rgba(0,0,0,0.16); /* ONLY the sticky header gets a shadow */
}
```

Rules:
- Orange is ~5% of the screen max. Never orange backgrounds on large areas except buttons.
- Accent headings use --orange-deep (darker, more legible), filled buttons use --orange (brighter).
- Taupe is the "dark mode" of this brand: footer + dropdowns. Not black, not navy.
- No gradients anywhere except the black photo-readability gradient.

---

## 3. TYPOGRAPHY

Font: **Source Sans Pro / Source Sans 3** (Google Fonts), fallback `Arial, sans-serif`. Weights used: 400, 600, 700. One family only.

| Role | Size / Line-height | Weight | Color | Notes |
|---|---|---|---|---|
| Body | 16px / 24px (1.5) | 400 | #333 | default everywhere |
| Hero title (on video) | 36px / 43.2px (1.2) | 700 | #FFF | sits on dark band |
| H1 page/section intro | 32px / 38.4px (1.2) | 700 | #333 | |
| Banner title (on photo) | 26px / 31.2px (1.2) | 700 | #FFF | |
| Section heading w/ rule | 22–26px / 1.2 | 700 | #333 | orange rule beneath |
| Card / teaser title | 22px / 26.4px (1.2) | 700 | #CC4E12 | links, hyphenate long words |
| Box / footer heading | 16–18px / 1.2 | 700 | #FFF on taupe | |
| Main nav | 16px / 60px row | 700 | #333 | |
| Utility nav | 16px / 24px | 400 | #CC4E12 | |
| Dropdown links | 14px / 21px | 400 | #FFF | |
| Meta / dates | 14px / 21px | 400 | #333 | |
| Photo credit | 12px / 18px | 400 | #FFF | "Photo: Name" |
| Button | 16px / 16px | 700 | #FFF | |
| Data value (ticker) | 22px / 33px | 400 | #FFF | |

Rules:
- Headings line-height 1.2, body 1.5. Letter-spacing: normal everywhere. NO uppercase, NO tracking, NO italics.
- Sentence case for all headings and buttons.
- `hyphens: auto` on titles (narrow cards break words with a hyphen — part of the look).
- Inline body links: #333, underlined (not orange).
- Lead paragraphs can be 16px 700 #333 directly under a section heading.
- Max ~3 type sizes visible in any single viewport.

---

## 4. LAYOUT & SPACING

- Content container: `max-width: 960px; margin: 0 auto;` (wide screens show big grey side gutters — intentional). Outer max 1280px for full-bleed header contents if needed.
- Grid: 4-up cards = 4 × 216px with 32px gaps. 2-up = 2 × 464px with 32px gap. 50/50 split modules = 480 + 480 no gap.
- Gutter: 32px between grid items.
- Vertical rhythm between modules: 48px (consistent, every module separated by plain grey gap).
- Inside white panels: 24px padding (text panels), 16–24px in compact cards.
- Text inside photo banners is inset ~112px from the left edge of the banner, vertically centered or lower-third.
- Base spacing scale: 4, 8, 12, 16, 24, 32, 48, 64.
- Mobile: container becomes 100% with 16px side padding; all grids collapse to 1 column; split modules stack image-on-top.

---

## 5. HEADER (two-tier, sticky)

Total height 140px, white, full width, content aligned to the 960 container.

- **Tier 1 (80px):** logo left (bold wordmark, brand colors). Right side: utility links (Press, Investors, Suppliers, Careers, Contact) — 16px, regular, --orange-deep, 32px apart, no underline. Far right: "Choose site ⌄" with tiny chevron + small flag icon.
- 1px #E6E6E6 hairline between tiers (or none — keep very subtle).
- **Tier 2 (60px):** main nav left — 16px, 700, #333, 32px gap. Right: "Search" label 16px 600 + bold black magnifier icon.
- Active/open nav item: text turns --orange-deep + 3px solid orange bar flush at bottom of the 60px row.
- Sticky on scroll with `--shadow-header`. Nothing else on the site has a shadow.

### Mega menu (on nav hover/click)
- Full-width panel, background --taupe (#7A6E65), drops directly under header, no radius, no shadow.
- 5 columns aligned to the container. Column heading: thin white line icon + 16px 400 white label. Below: 14px/21px white links, ~6px between items, long items wrap.
- Hover on links: --orange-light.

---

## 6. COMPONENTS

### 6.1 Hero
- Full-bleed autoplay muted video/photo, ~448px tall. No overlay over the whole image.
- Title (36px bold white) placed bottom-right inside a dark bottom band (black gradient 0.85 → 0). Short, one line.

### 6.2 Intro block
- H1 32px bold #333 on the grey canvas (no white panel), followed by 16px body with an inline underlined link.

### 6.3 Service cards (4-up)
- White, square, ~216 × 243px, no border, no shadow.
- Top: centered thin-line ORANGE isometric illustration icon (~64px, outline style, 1.5px stroke, isometric buildings/cranes/plant).
- Bottom-left: title 22px 700 --orange-deep, often a question, can wrap to 3 lines with hyphenation. Padding 16–24px.
- Hover: grey gradient wash fades over the icon area (top half), title gets underline. Transition 0.3s ease-out.

### 6.4 Photo banner (full container width)
- 250–250px tall, edge-to-edge in the 960 column, square corners.
- Photo + `--overlay-grad` from bottom (or a flat dark tint for busy photos).
- Inset text: title 26px 700 white, subtitle 16px white below, optional pill button under it (16px gap).
- Whole banner is a link.

### 6.5 Split media module (news/feature)
- 50/50: photo half + white text half, height ~240px. Alternate image left/right down the page.
- Text half: 24px padding, title 22px 700 --orange-deep (link, underlines on hover), body 16/24 #333, truncated with "…" if long.
- Photo credit bottom-left of image: 12px white "Photo: Name" on --overlay-chip, 16px inset.
- Occasional small rotated sticker/badge on photo (yellow starburst) — playful exception, use max once.

### 6.6 Project cards (2-up)
- Image on top (~240px tall) with photo/architect credit in bottom-left, white body below with 24px padding: title 22px orange-deep, body 16/24.
- Equal heights in row. Below the grid, right-aligned pill button "More projects".

### 6.7 Pill button (the only rounded thing)
```css
.btn {
  display:inline-block; background:#EB6631; color:#fff;
  font:700 16px/16px "Source Sans 3", Arial, sans-serif;
  padding:12px 24px; border:2px solid #EB6631; border-radius:22px;
  transition: background .2s ease-out, color .2s ease-out, border-color .3s ease-out;
}
.btn:hover { background:#CC4E12; border-color:#CC4E12; }
```
- Height ~43px. Sentence case. No icons in buttons. Left-aligned under lists, right-aligned under grids.
- Back-to-top: same orange pill, 65 × 40px, small white arrow, sits at the top-right edge of the footer.

### 6.8 Section heading with rule
- Heading 22–26px 700 #333, 12px below it a full-width 3px solid --orange-deep line. Used for "Press releases", "News", "Financial information". Content starts 24px below the rule.

### 6.9 News / press lists (2 columns)
- Each item: small solid orange right-pointing triangle caret (▸, ~6px) left of title, title 16px 400 #333 (link), date 14px #333 on next line (format "28 Oct 2026 08:00").
- Items separated by 1px #E6E6E6 divider, ~14px padding top/bottom. No backgrounds, sits on grey canvas.
- "Show more" pill button below each column.

### 6.10 Data strip (stock ticker)
- Full container width, ~80px, background --teal, faint lighter-teal geometric line pattern (very low contrast).
- Left: "TICKER B" 22px 700 white. Right: "+1.05 SEK / 93.60 SEK" 22px 400 white. 24px horizontal padding.

### 6.11 Badge row
- White panel, row of round, glossy, light-grey 3D-ish product badges with thin outline type. (Only skeuomorphic element on the site — optional.)

### 6.12 Footer
- Background --taupe. 3 columns aligned to container, ~64px top padding.
- Column heading 16px 700 white. Links 14px white, each with a tiny white ▸ caret, 6–8px line gap.
- Contact column: address lines plain, then phone, then caret links.
- Bottom bar: 1px rgba(255,255,255,0.3) top border, "Cookies" left 14px white, social icons right (Facebook, YouTube, LinkedIn, Instagram) white, ~20px, 24px apart.

---

## 7. IMAGERY

- Real, documentary-style photography, natural light, slightly desaturated except hi-vis orange.
- Subjects: workers in orange workwear and helmets (smiling, mid-task), aerial towns and harbours, bridges, construction sites, calm Scandinavian interiors, executive portraits in front of green walls.
- Always show photographer credit "Photo: Firstname Lastname" in 12px white bottom-left.
- Icons: thin outline, orange, isometric for service cards; white thin-line for dark menus. Never filled, never colored multi-tone.
- No stock illustrations, no 3D blobs, no abstract gradients.

---

## 8. INTERACTION & MOTION

- Transitions: 0.2s–0.3s ease-out (transform, margin, border-color, background). Nothing longer.
- Link hover: underline appears (titles) or color shifts to orange-light (dark menus).
- Card hover: subtle grey gradient wash + title underline. No lift, no scale, no shadow.
- No scroll-triggered animations, no parallax, no carousels auto-moving except the hero video.
- Focus states: visible 2px orange outline.

---

## 9. HARD DON'Ts

- No border-radius on cards, images, panels, inputs (0px). Only buttons are pills (22px).
- No box-shadows except the sticky header.
- No pure black text, no pure white page background (canvas is #F4F4F4).
- No uppercase labels, no letter-spacing, no second font.
- No colored section backgrounds besides taupe (footer/menu) and the single teal strip.
- No icons inside buttons, no ghost/outline buttons as primary.
- Don't widen the container beyond 960px for content.

---

## 10. PAGE ORDER TEMPLATE (homepage)

1. Sticky two-tier header
2. Full-bleed hero video with bottom title band
3. H1 intro + short paragraph
4. 4-up service question cards
5. Full-width photo banner (headline news)
6. Split media module (image right)
7. Full-width photo banner (podcast/feature)
8. Split media modules ×3 alternating
9. Photo banner with pill CTA
10. "Current projects" 2-up cards + right-aligned "More projects" pill
11. Product section: H2 + bold lead + badge row panel
12. Press releases | News — 2 columns with orange rules and caret lists + "Show more" pills
13. Careers photo banner, then second dark banner
14. "Financial information" rule heading + teal ticker strip + 2-up photo cards
15. Taupe footer, 3 columns + bottom bar, orange back-to-top pill
