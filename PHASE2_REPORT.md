# AZmovies — Phase 2 Static Prototype Report

**Date:** 2026-11-07
**Branch:** `arena/9177d6f3-azmovies`
**Implementation commits:** homepage `3f0120d12f9066ae5a8db6c273aa3f614a5ee474`, `f1edf53404f9104e5fbcb28db4cbc0773078d802`; movie detail `39f126225307a402f6c1cd999e54595615223610`
**Status:** homepage and movie-detail prototype completed locally; **awaiting owner visual approval before Phase 3**. No GitHub push performed.

## 1. Delivered scope

A mobile-first, static fixture-based visual prototype matching the supplied MOVIES4U mobile references as closely as the static/safety constraints allow:

- Sticky compact header, AZmovies gold branding, menu/search controls.
- Labeled local search and reference category button layout.
- Two-column poster grid with gradient poster borders and synthetic metadata.
- Local fixture search/category filtering and six-item pagination.
- Keyboard-operable side drawer, footer and inert floating Telegram treatment.
- Static fixture detail pages plus not-found/loading/empty/error surfaces.
- Design tokens, reusable components, original synthetic posters and repeatable test/capture scripts.

Explicitly not included: live movie APIs, database, authentication, admin, external redirects, Telegram destination, metadata provider calls or production deployment.

## 2. Reference inspection

All six owner-supplied JPEGs were inspected. They are 1080×2400 files stored ignored under `docs/references/`; the manifest is `docs/references/README.md`.

| File suffix | Actual content            | Role          |
| ----------- | ------------------------- | ------------- |
| 220121      | HDHub4u home top          | Supplementary |
| 220126      | HDHub4u scrolled grid     | Supplementary |
| 220132      | HDHub4u pagination/footer | Supplementary |
| 220137      | HDHub4u drawer            | Supplementary |
| 220156      | MOVIES4U home top         | Primary       |
| 220213      | MOVIES4U scrolled grid    | Primary       |

The user described three MOVIES4U screenshots, but the received primary MOVIES4U set contains two files. The other four are HDHub4u. This mismatch is recorded as BLK-011.

## 3. Measured tokens and geometry

Reference flat-area samples are recorded by `npm run analyze:references` in `.artifacts/phase2/reference-analysis.json`. Implementation tokens are in `src/styles/globals.css`.

| Token/region               | Reference sample                | Prototype implementation | Note                                        |
| -------------------------- | ------------------------------- | ------------------------ | ------------------------------------------- |
| Page/grid gap              | `#111111`                       | `#111111`                | Matched                                     |
| Header                     | `#1b242b`                       | `#1b242b`                | Matched                                     |
| Search background          | `#131313`                       | `#131313`                | Matched                                     |
| Green pill                 | `#00ba00`                       | `#008a00`                | Darkened for WCAG AA white text             |
| Top red pill               | `#ff0000`                       | `#ee0000`                | Darkened for WCAG AA white text             |
| Category red               | `#f00033`                       | `#ed0032`                | Darkened slightly for WCAG AA white text    |
| Blue/orange special pills  | `#00a0e6` / `#eb9600`           | Same samples             | Controls are inert/aria-disabled in Phase 2 |
| Poster border              | `#d53c44` / `#fbc600`           | Same samples             | Gradient frame preserved                    |
| Telegram                   | `#008bd2`                       | `#008bd2`                | Inert; no invented channel                  |
| Drawer                     | `#333333`, row border `#383838` | Same samples             | Matched                                     |
| Pagination active/inactive | `#0075f1` / `#252525`           | `#0073ec` / `#252525`    | Active darkened slightly for contrast       |
| Footer                     | `#000000`                       | `#000000`                | Matched                                     |

Primary prototype metrics at 360 CSS px / DPR 3 (`.artifacts/phase2/prototype-metrics.json`):

- Header: 342×52.5 px at x=9, y=10.
- Search input: 302×36 px at x=29.
- Category pill height: 38 px; reference rows remain three buttons across at 360 px.
- Grid: two 147 px columns, 26 px column gap, 28 px row gap, 20 px horizontal margin.
- First poster row starts at y=552.5 px in the captured prototype.
- Pagination: 320×42 px; footer begins below the catalog.
- Floating Telegram control: 58×58 px; document `scrollWidth` equals 360 px.

These are measured prototype values, not a claim of pixel-perfect equality. The aligned comparison excludes Android browser chrome and uses synthetic posters/titles, so raw whole-image pixel difference is not a valid fidelity score.

## 4. Executed tests and checks

| Command                     | Result                             | Evidence                                                                                          |
| --------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------- |
| `npm run format:check`      | Pass                               | Prettier check output                                                                             |
| `npm run typecheck`         | Pass                               | `tsc --noEmit`                                                                                    |
| `npm run lint`              | Pass                               | ESLint flat config                                                                                |
| `npm run verify:static`     | Pass                               | `.artifacts/phase2/static-boundary.json`; 19 source files, runtime deps only next/react/react-dom |
| `npm run test`              | 16 passed                          | Vitest unit/component files                                                                       |
| `npm run build`             | Pass                               | Next.js 16.4.5; 51 static pages                                                                   |
| `npx playwright test`       | 15 passed                          | `.artifacts/phase2/playwright-results.json`; Chromium via `@sparticuz/chromium`                   |
| `npm run capture:prototype` | Executed                           | `.artifacts/phase2/prototype-*.png`, `prototype-metrics.json`                                     |
| `npm run compare:visual`    | Executed                           | `.artifacts/phase2/comparison-primary-top.png`, `visual-comparison.json`                          |
| `npm audit --omit=dev`      | 0 reported runtime vulnerabilities | `.artifacts/phase2/npm-audit-runtime.json`                                                        |

Browser coverage includes home regions, local search/filter/pagination, drawer focus/Escape, internal fixture detail navigation, static boundary checks, axe home/drawer/detail with no serious/critical violations, and responsive checks at 320/375/390/768/1024/1440/1920 px plus 320 px reflow/landscape.

Chromium required two sandbox workarounds: extract the bundled AL2023 NSS/NSPR libraries and omit `--single-process`, which caused flaky context launches here. These are recorded in `playwright.config.ts`, `scripts/capture-prototype.mjs` and `BUG_TRACKER.md`.

## 5. Documented deviations requiring owner acceptance

1. **Brand:** AZmovies replaces MOVIES4U branding.
2. **Posters/content:** original synthetic posters and fixture titles replace copyrighted reference posters/metadata.
3. **External actions:** JOIN TELEGRAM, DOWNLOAD APP, floating Telegram and footer links are inert/aria-disabled; no external redirect is implemented.
4. **Footer wording:** “How To Watch?” replaces “How To Download?” to avoid implying unauthorized downloads.
5. **Contrast:** green/red/category/active-pagination colors are minimally darkened to pass automated AA contrast while preserving the reference hue/layout.
6. **Empty categories:** ANIME, DESI VIDEOS, FMOVIES and 18+ have no matching synthetic fixtures and intentionally show the empty state.
7. **Reference set:** only two primary MOVIES4U captures were received; drawer/pagination/footer use supplementary HDHub4u evidence.

## 6. Remaining issues / not run

- Owner visual approval: **pending** (BLK-010).
- Missing third primary MOVIES4U screenshot: optional input (BLK-011).
- Firefox/WebKit, real Android/iOS devices and actual screen-reader smoke: not run.
- Lighthouse/Core Web Vitals, 10k-catalog performance, database/auth/API/security integration and live metadata: not run and out of Phase 2 scope.
- PostgreSQL, authorized destination inventory, official Telegram URL, admin recovery/MFA and metadata permission remain open blockers for later phases.

## 7. Movie Detail Page (Page 2) addendum

A separate static fixture detail page is now reachable by clicking a homepage poster/title. It reuses the shared header, drawer, footer and Telegram treatment, and matches the supplied HDHub4u detail references as closely as the static/safety constraints allow.

### Delivered detail sections

- Trending movie poster carousel.
- Secondary toolbar with menu, yellow 4K placeholder and search that returns to homepage fixture search.
- Safe static-fixture notice panel replacing the reference fake-domain/WhatsApp warning.
- Title panel, blue date chip, white genre chips, italic description and large centered poster.
- Centered info block: rating, genre, cast, director, language and quality.
- Scrollable screenshot gallery using three original synthetic 960×540 stills.
- Clearly separated **Quality options**, **Watch options** and **Authorized provider links**. All are `aria-disabled` placeholders with no external `href`.
- Trailer placeholder, storyline/review/reaction placeholders, related movie grid and shared footer.

### Detail reference inspection

Nine detail files were received although the request described four: eight 1080×2400 crops and one 1080×24313 full-page capture. All were inspected and mapped in `docs/references/README.md`; the mismatch is BLK-012.

### Detail tokens and metrics

| Token/region    | Reference sample | Implementation | Note                   |
| --------------- | ---------------- | -------------- | ---------------------- |
| Page background | `#000000`        | `#000000`      | Matched                |
| Title panel     | `#141414`        | `#141414`      | Matched                |
| Date chip       | `#1f88fc`        | `#0073ec`      | AA white-text contrast |
| Link blue       | `#0084eb`        | `#0084eb`      | Matched                |
| Red highlight   | `#fe0000`        | `#ff6b6b`      | AA-safe red on black   |
| Rule            | `#373737`        | `#373737`      | Matched                |
| Muted text      | `#c3c3c3`        | `#c3c3c3`      | Matched                |

Measured detail metrics at 360 CSS px / DPR 3: document `scrollWidth` 360; gallery `scrollHeight` 558 vs `clientHeight` 420 (scrollable); related cards 4; external links 0. Artifacts: `.artifacts/phase2/prototype-360-detail-top.png`, `prototype-360-detail-gallery.png`, `prototype-360-detail-options.png`, `comparison-detail-top.png`.

### Detail executed checks

| Command                                                | Result                             | Evidence                                                                                                                     |
| ------------------------------------------------------ | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `npm run test`                                         | 21 passed                          | Vitest unit/component files, including detail fixtures/components                                                            |
| `npm run build`                                        | Pass                               | 51 static pages; homepage static HTML preserved                                                                              |
| `npm run test:e2e`                                     | 19 passed                          | `.artifacts/phase2/playwright-results.json`; homepage→detail→back, detail search, detail axe, detail responsive 320/768/1440 |
| `npm run capture:prototype` / `npm run compare:visual` | Executed                           | Detail captures and `comparison-detail-top.png`                                                                              |
| `npm run verify:static`                                | Pass                               | 25 source files; runtime deps only next/react/react-dom                                                                      |
| `npm audit --omit=dev`                                 | 0 reported runtime vulnerabilities | `.artifacts/phase2/npm-audit.json`                                                                                           |

### Detail deviations requiring owner acceptance

1. Reference fake-domain warning, WhatsApp promo, betting ads, comments and unauthorized download links are not replicated; safe placeholder sections replace them.
2. Quality/watch/provider/trailer controls are placeholders only; direct external redirection remains disabled until authorized URLs are supplied.
3. Detail stills are original synthetic assets, not copyrighted film screenshots.
4. Red/date-chip colors are minimally adjusted for AA contrast; icons are inline SVG because reference emoji/icon assets were not supplied.
5. Shared AZmovies header/footer replace HDHub4u branding.

## 8. Page 3 superset

The intermediate external link page (Page 3) was added on 2026-11-08 and is reported separately in
[PAGE3_REPORT.md](PAGE3_REPORT.md). It preserves this report's homepage/detail geometry and adds
`/go/{linkId}/`, a locked `/r/{linkId}/` Continue endpoint and a prototype link manager. Test totals
supersede §4 of this report: 52 Vitest, 30 Chromium, 532 static pages.

## 9. Approval request

Review the live preview, `.artifacts/phase2/comparison-primary-top.png` and `.artifacts/phase2/comparison-detail-top.png`. Approve Phase 2 homepage and movie-detail work as-is, request specific visual changes, or approve the listed deviations before Phase 3 begins. The agent will stop here and wait for that decision.
