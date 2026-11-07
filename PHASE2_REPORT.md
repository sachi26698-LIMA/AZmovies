# AZmovies — Phase 2 Static Prototype Report

**Date:** 2026-11-07
**Branch:** `arena/9177d6f3-azmovies`
**Implementation commits:** `3f0120d12f9066ae5a8db6c273aa3f614a5ee474`, `f1edf53404f9104e5fbcb28db4cbc0773078d802`
**Status:** completed locally; **awaiting owner visual approval before Phase 3**. No GitHub push performed.

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

## 7. Approval request

Review the live preview and `.artifacts/phase2/comparison-primary-top.png`. Approve Phase 2 as-is, request specific visual changes, or approve the listed deviations before Phase 3 begins. The agent will stop here and wait for that decision.
