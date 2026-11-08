# AZmovies — Changelog

All notable completed project changes are recorded here. This is a phase-controlled project, not a claim of released software versions. Dates use YYYY-MM-DD.

## [Unreleased] — Preview gateway investigation (open)

- A direct external request without a traffic-access header reached the E2B proxy and returned 403 “Missing traffic access token”; the actual Arena iframe request and proxy logs have not been observed.
- The three application pages rendered in a simulated local iframe with no observed browser or asset errors. This is not a visual verification of the user's Arena preview.
- No UI or application code was changed. Preview remains blocked pending investigation of the authenticated gateway and an owner-visible retest (BUG-014).

## [Unreleased] — 2026-11-08 — Page 3 intermediate external link page

### Added

- `/go/{linkId}/` intermediate handoff page showing movie title, selected quality, provider name, link status, link reference and the exact stored destination, with a prominent Continue button and Back to Movie Details.
- 480 stored provider-link fixtures (48 movies × 10 options), each with its own opaque id and its own unique destination on IANA-reserved example hosts.
- `/r/{linkId}/` Continue endpoint: fresh server-side policy check, 303 to the exact stored URL only when every gate passes, otherwise 404/410/403 with no `Location` header and `no-store`/`no-referrer`/`noindex`/`nosniff`.
- Shared default-deny destination policy (exact HTTPS host allowlist, no userinfo, default port only, bounded length, control-character and encoded-traversal rejection) used by the admin form, Page 3 and the endpoint.
- `/admin/links/` prototype link manager: add, edit, disable, enable, delete and reset individual links, with shared URL validation and per-link independence.
- Page 3 unit/component/browser tests (mapping, invalid URLs, disabled/unknown links, query-injection resistance, navigation, admin CRUD, axe, responsive) and Page 3 screenshot capture.
- `PAGE3_REPORT.md` evidence and approval report.

### Changed

- Detail-page quality/watch/provider rows now open their own Page 3 instead of being dead placeholders. Detail and homepage layout, typography and colors are unchanged.
- `trailingSlash: true` so the already-used `/…/` hrefs are canonical and `/r/{id}/` answers directly instead of redirecting first.
- Continue uses a chevron affordance rather than a play icon, and the shared header search control opens the drawer on pages without their own search field.
- Test totals: 52 Vitest, 30 Chromium, 532 static pages.

### Verified on 2026-11-08

- `npm run format:check`, `npm run typecheck`, `npm run lint`, `npm run verify:static`: passed.
- `npm run test`: 52 passed. `npm run build`: 532 static pages. `npx playwright test`: 30 passed.
- `npm run capture:prototype`: executed. `npm audit --omit=dev`: 0 reported runtime vulnerabilities.
- Local commit `9ba92ac57f895c5798bc10ef49cda174bab9a056` on `arena/9177d6f3-azmovies`; no GitHub push performed.

### Not added / still locked

- No real external destination is activated: `EXTERNAL_ACTIVATION_ENABLED = false` and every fixture link is `fixture-placeholder`.
- The link manager has no authentication, no server write, no database and no audit history; overrides live in the tab session only.
- No countdown, auto-redirect, pop-up, click counting or provider availability checker.

### Next gate

Owner approval of Page 3 plus authorized provider URLs and per-link evidence before any real handoff is enabled.

## [Unreleased] — 2026-11-07 — Phase 2 movie detail page

### Added

- Static movie detail prototype for all 48 fixture slugs: trending poster carousel, secondary toolbar, title panel, date/genre chips, detailed info block, large poster, scrollable screenshot gallery, separated quality/watch/provider placeholders, trailer placeholder, storyline/review/reaction placeholders, related movies and shared footer.
- Three original synthetic 960×540 cinematic stills under `public/stills/` for the detail gallery.
- Detail fixture helper, detail CSS Module, SVG detail icons, detail component/unit tests and detail Playwright navigation/search/accessibility/responsive tests.
- Nine owner-supplied detail references inspected and mapped in `docs/references/README.md`; detail-top visual comparison artifact.

### Changed

- Homepage remains static and reference-matched; it now accepts a `q` search query from the detail toolbar while preserving static pre-rendered catalog HTML through a Suspense fallback content component.
- Detail external actions are authorized-link placeholders only (`aria-disabled`, no `href`); no fake-domain warning, WhatsApp promo, betting ad or unauthorized download destination was copied.
- Test totals updated to 21 Vitest and 19 Chromium Playwright tests; static build remains 51 pages.

### Verified on 2026-11-07

- `npm run format:check`, `npm run typecheck`, `npm run lint`, `npm run verify:static`: passed.
- `npm run test`: 21 Vitest tests passed.
- `npm run build`: passed; 51 static pages generated.
- `npm run test:e2e`: 19 Chromium tests passed, including homepage→detail→back, detail toolbar search, detail axe and detail responsive checks.
- `npm run analyze:references`, `npm run capture:prototype`, `npm run compare:visual`: executed; detail artifacts under `.artifacts/phase2/`.
- `npm audit --omit=dev`: 0 reported runtime vulnerabilities at execution time.
- Local detail checkpoint `39f126225307a402f6c1cd999e54595615223610` created on `arena/9177d6f3-azmovies`; no GitHub push performed.

### Not added

- No live movie API, database, authentication, admin, external redirect, authorized provider URL, trailer embed, comment system or production deployment.
- No claim of owner visual approval, Firefox/WebKit, real-device, screen-reader or Lighthouse results.

### Next gate

Owner must approve the homepage and movie-detail Phase 2 prototype and documented deviations before Phase 3.

## [Unreleased] — 2026-11-07 — Phase 2 static visual prototype

### Added

- Next.js 16.4.5 App Router, React 19.3.1 and strict TypeScript toolchain with npm lockfile, ESLint, Prettier, Vitest, Testing Library, Playwright and axe.
- Static fixture catalog: 48 synthetic movies, six local original poster assets, local search/category filtering, six-item pagination and static fixture detail pages.
- Reusable reference-matched components: header, search, category buttons, side drawer, movie card/grid, pagination, footer, Telegram treatment and catalog states.
- Measured global design tokens and CSS Modules based on owner-supplied MOVIES4U/HDHub4u screenshots.
- Reference analysis, prototype capture, visual comparison and static-boundary verification scripts.
- Unit/component tests, Chromium functional/accessibility/responsive tests and a Phase 2 evidence report.
- `docs/references/README.md` manifest for the six ignored owner-supplied reference images.

### Changed

- Project status advanced from foundation-only to a locally committed, fixture-only visual prototype awaiting owner visual approval.
- Category pill colors were minimally darkened from reference samples where required to meet WCAG AA white-text contrast; geometry and glow remain reference-based.
- Footer wording uses “How To Watch?” instead of the reference download wording to avoid implying unauthorized downloads.

### Verified on 2026-11-07

- `npm run format:check`, `npm run typecheck`, `npm run lint`, `npm run verify:static`: passed.
- `npm run test`: 16 Vitest tests passed across unit/component files.
- `npm run build`: passed; 51 static pages generated.
- `npx playwright test`: 15 Chromium tests passed, including axe home/drawer/detail and 320–1920 px responsive checks.
- `npm run capture:prototype` and `npm run compare:visual`: executed; artifacts written under `.artifacts/phase2/`.
- `npm audit --omit=dev`: 0 reported runtime vulnerabilities at execution time.
- Local commits `3f0120d12f9066ae5a8db6c273aa3f614a5ee474` and `f1edf53404f9104e5fbcb28db4cbc0773078d802` created on `arena/9177d6f3-azmovies`; no GitHub push performed.

### Not added

- No live movie API, database, authentication, admin, external redirect, Telegram destination, metadata provider integration or production deployment.
- No claim of Firefox/WebKit, real-device, screen-reader, Lighthouse/Core Web Vitals, production security or owner visual approval.

### Next gate

Owner must approve the Phase 2 prototype and documented deviations before Phase 3. Remaining blockers are tracked in `BUG_TRACKER.md` and `PHASE2_REPORT.md`.

## 2026-11-07 — Phase 1 foundation

### Added

- Agent operating contract and verified project context, including actual environment/GitHub/network observations and outstanding owner decisions.
- Seven-phase roadmap with explicit implementation/visual/security/release gates and risk register.
- Proposed Next.js/TypeScript/PostgreSQL/Drizzle/Better Auth architecture and hand-authored CSS approach.
- Reference-specific UI inventory and matching workflow; missing screenshots explicitly recorded at that time.
- Proposed catalog/taxonomy/auth/redirect authorization/audit/import schema and migration rules.
- Planned public/admin/auth/redirect/metadata API contracts, clearly marked unimplemented.
- Security, testing, traceable test cases, blocker tracking and performance budgets/procedures.
- Safe environment example, secret/build/artifact ignore rules and Node runtime pin.

### Changed

- Inspected and expanded the original one-line README into the project entry point and documentation index.

### Verified within foundation scope

- GitHub authentication and read-only repository API access succeeded; no push or remote write performed.
- Node/npm/Git/runtime/resource inventory and npm metadata reads succeeded.
- Terminal TMDB and Playwright CDN probes failed; live provider/browser execution remained blocked at that checkpoint.
- Foundation validation passed: 15 required documents, 15 resolved local links, 18 intended staged files, clean staged whitespace check, safe example variables and 19 ignore-rule probes. Targeted credential-pattern review found no matches; this is not a comprehensive secret scan.
- Local foundation commits `13ad936a25e236985068fa5d422f64aafdb04afa` and `de0e2bf` created on the session branch after validation; no GitHub push performed.

### Not added at that checkpoint

- No website, application dependencies, routes, database, migrations, credentials, live movie links or application test results.
- No claim of screenshot fidelity, TMDB permission, cross-browser coverage or production readiness.
