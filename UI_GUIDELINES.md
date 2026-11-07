# AZmovies — Reference Matching and UI Rules

## 1. Reference status: missing, not inspected

The brief names supplied MOVIES4U screenshots, but no screenshot attachment/image/PDF was available in the workspace during Phase 1. The inventory below comes **only from the written brief**. We have not sampled colors, measured spacing, identified a font or verified the original layout. No visual-match result is claimed.

Required before final Phase 2 sign-off:

- Original, unmodified desktop home screenshot and its viewport width if known.
- Mobile home screenshot, ideally 360/375/390 CSS-pixel widths.
- Detail page and expanded sidebar/category/search states if available.
- Any pagination/footer close-ups needed to read labels and spacing.
- Permission to use the images as internal design references; do not ship them as site assets.

Store approved references under `docs/references/` with a small manifest recording source, capture date, dimensions, page/state and rights/usage note. That directory does not exist yet.

## 2. Preserve these elements

| Region | Required behavior/content | Avoid |
| --- | --- | --- |
| Brand/header | AZmovies name, compact dark branding, immediate access to search | Oversized hero, marketing tagline, large sticky navigation |
| Search | Visible labeled field, submit control, query retained in URL/results | Search hidden behind an unexplained icon or modal on desktop |
| Category navigation | Horizontal, compact, readable category links; active state | Mega menus, unrelated tags, animated carousels |
| Catalog | Two poster columns; title, release year, language, quality | Download badges/buttons, invented ratings, extra promotional cards |
| Pagination | Numbered/previous-next navigation appropriate to the reference; current page clear | Infinite scroll replacing the requested pagination |
| Sidebar | Compact navigation groups consistent with supplied reference | Widgets, advertisements, newsletter panels or trend charts not in reference |
| Detail | Poster/title/year/language/quality and factual synopsis; authorized external-page action | Embedded player, download counts, fake streaming availability |
| Footer | Compact site/legal/navigation area and required provider attribution when applicable | SEO link dumps or copied MOVIES4U branding |
| Telegram | Floating icon only when an official owner-provided destination is configured | Invented channel, notification popup or forced subscription |

The explicit brief says two columns. Keep two at both mobile and desktop in the initial plan. If screenshots show a different desktop count, ask the owner to resolve the conflict; do not silently reinterpret it.

## 3. Provisional design tokens — not observed screenshot values

These are implementation starting proposals only. Replace/confirm them through reference inspection before claiming fidelity.

| Token | Proposed starting value | Purpose |
| --- | --- | --- |
| `--color-bg` | `#090909` | Near-black page background |
| `--color-surface` | `#141414` | Cards/header/sidebar panels |
| `--color-border` | `#292929` | Low-contrast separators |
| `--color-text` | `#f4f4f4` | Primary text |
| `--color-muted` | `#a6a6a6` | Secondary metadata, still contrast-checked |
| `--color-focus` | Finalize from reference; visible fallback required | Keyboard focus, not brand guessing |
| Accent | Unresolved | Sample from actual reference; do not invent a purple/blue gradient |
| Font | Reference font if permitted; otherwise owner-approved system/locally hosted fallback | No unverified claim about the original font |
| Poster ratio | Start 2:3, confirm from reference | Prevent layout shift |
| Page width | Start around 1120 px, confirm | Compact catalog rather than an expansive dashboard |
| Sidebar | Start around 240–260 px desktop, confirm | Main grid remains dominant |
| Grid gap | Start 12–16 px, confirm | Compact poster rhythm |
| Touch target | At least 44×44 px preferred | Comfortable mobile interaction; verify compact nav spacing |

Do not introduce gradients, glass effects, large rounded cards, decorative statistics or animation unless present in the reference. Prefer small radii and restrained borders. The goal is a deliberately developed production catalog, not a generic landing page.

## 4. Layout and responsive procedure

- Use semantic `header`, `nav`, `main`, `aside` and `footer`; one page-level `h1`.
- CSS Modules own component layout; global tokens/reset own shared primitives.
- CSS Grid: two `minmax(0, 1fr)` poster tracks, with a separate main/sidebar desktop layout.
- On narrow screens, move sidebar navigation into the reference-approved placement/disclosure without losing links.
- Test 320, 375, 390, 768, 1024, 1440 and 1920 px widths; include short-height and landscape cases.
- At 200% text zoom and 320 CSS-pixel reflow, no essential text/control may be clipped. Category overflow must remain keyboard accessible.
- Reserve poster dimensions and metadata line space. Long titles may clamp visually only when the full title remains available on the detail page/accessible name.
- Use stable pagination dimensions for one- and three-digit page numbers.
- Header stickiness, mobile disclosure behavior and Telegram position must follow the actual reference, not assumptions.

## 5. Content honesty

- Year comes from the actual release date, not import time.
- Language labels distinguish original, spoken and editorially verified displayed editions. Do not equate Hindi language with Bollywood or infer a dubbed track.
- Quality vocabulary requires owner agreement. Proposed labels: SD, HD, FHD, 4K, or “Quality not specified.” These are editorial descriptors, not evidence of an available file.
- Never populate quality from a guessed filename or TMDB field that does not supply it.
- Use permitted posters with useful alt text; a missing poster gets a neutral local fallback, not a scraped image.
- External action wording should describe the actual destination, e.g. “View on [provider]” or “Visit official page,” with an external/new-tab indication when applicable. Never label an unverified link “Watch now.”

## 6. Accessibility acceptance

- Target WCAG 2.2 AA: normal text contrast >=4.5:1, large text >=3:1, meaningful non-text controls >=3:1.
- Visible focus, logical tab order, skip link, accessible search label, descriptive links and correct current-page/category state.
- Keyboard-operated navigation/disclosures/forms; focus trapping and return only where a real dialog exists.
- Form errors adjacent to fields and announced; do not rely on color alone.
- Respect reduced motion; no flashing or autoplay. Floating Telegram must not cover pagination or essential controls.
- Axe checks supplement, not replace, manual keyboard/zoom/screen-reader checks. Record actual assistive technology used.

## 7. Visual matching workflow after approval

1. **Inventory:** annotate reference regions, labels, alignment, columns, states and visible content density.
2. **Extract:** record measurable colors, type sizes/weights, spacing, radii, poster ratios and breakpoints; distinguish estimates from exact values.
3. **Resolve:** ask about missing states/conflicts; update this document before implementation.
4. **Build:** fixture-only components with deterministic content and permitted assets; no unrelated UI additions.
5. **Capture:** Playwright full-page and region screenshots at documented viewports, DPR 1 initially, stable fonts and reduced motion.
6. **Compare:** place reference and implementation in a review report; use aligned region geometry and annotated differences. Different movie data means raw whole-image pixel difference is not a valid fidelity score.
7. **Review:** owner checks header density, grid rhythm, typography, metadata, sidebar, pagination, footer and Telegram placement.
8. **Lock:** after approval, commit generated baselines for the same fixtures; investigate intentional changes rather than blindly updating snapshots.

Initial geometry aim: key spacing/alignment within roughly 2 px at the same viewport, font size within 1 px, exact agreed colors and correct region order. These are review tolerances, **not achieved results**. Any deviation needs a reason and owner acceptance. After baseline lock, use a low pixel-difference threshold appropriate to each stable region and mask only documented dynamic content.

## 8. Required states and evidence

Catalog: populated, empty search, no category matches, invalid query, loading, data error, missing poster. Detail: published, unavailable/archived, no authorized link. Admin: validation, stale edit, permission denied, save success/failure. Navigation: active category, first/middle/last page, mobile disclosure.

Every state needs a test case ID and viewport evidence where visual. Phase 1 has **no captures and no visual tests executed**. Missing references/browser execution are tracked in `BUG_TRACKER.md`; do not report a visual pass until those are resolved and the comparison actually occurs.
