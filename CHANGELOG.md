# AZmovies — Changelog

All notable completed project changes are recorded here. This is a phase-controlled project, not a claim of released software versions. Dates use YYYY-MM-DD.

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
