# AZmovies

A movie discovery catalog and proposed **authorized external-page redirect portal**. A private editorial admin is planned for a later phase, not yet implemented.

> **Project status: Phase 2 — static fixture-based visual prototype.** The reference-matched mobile-first shell is implemented locally and scoped tests have passed. It uses synthetic fixtures only: no live movie API, database, authentication, external redirect or metadata integration. Owner visual approval is required before Phase 3.

## Product boundaries

AZmovies is not a hosting, streaming or download service. It must never distribute or link to unauthorized copyrighted movie downloads. External movie links require explicit authorization and validation. The brand is AZmovies; MOVIES4U is a visual reference only.

Current prototype interface:

- Compact dark header, AZmovies branding, labeled search and category buttons.
- Two-column movie poster grid with synthetic title/year/language/quality metadata.
- Local fixture search/category filtering, pagination, side drawer, footer and inert Telegram treatment.
- Static fixture detail pages, safe intermediate handoff and honest loading/empty/error/not-found surfaces.
- An isolated link-manager demo with session-only add/edit/disable/delete controls. It has no access to real stored destinations and cannot change public pages or server mappings.

The Page 3 Continue control is natively disabled. Planned later interfaces remain authenticated private admin, manual catalog management, authorized destination review and optional permitted metadata import.

## Quickstart

```bash
npm ci
npm run build
npm run start -- --port 3000
```

Useful checks:

```bash
npm run format:check
npm run typecheck
npm run lint
npm run verify:static
npm run verify:public-boundary  # after npm run build
npm run test
npm run test:coverage
npx playwright test
npm run test:a11y
npm run test:responsive
npm run analyze:references
npm run capture:prototype
npm run compare:visual
```

The owner reported that the local preview is visible. Separately, an unauthenticated external request to this sandbox's E2B preview URL returned 403 “Missing traffic access token”; the actual Arena iframe request and gateway logs were not observable, so no gateway fix is claimed. See BUG-014. Do not place gateway credentials in source or browser URLs or weaken sandbox access restrictions.

The Playwright/capture scripts use `@sparticuz/chromium` and expect the prototype at `http://127.0.0.1:3000` unless `PROTOTYPE_URL` is set. Reference JPEGs are internal-only and ignored by Git; place owner-supplied files in `docs/references/` before running reference analysis.

## Pages in the prototype

| Route                           | Page                                                                |
| ------------------------------- | ------------------------------------------------------------------- |
| `/`                             | Homepage catalog; owner visual approval pending                     |
| `/movies/{slug}/`               | Movie detail                                                        |
| `/go/{movieSlug}/{optionSlug}/` | Page 3 with movie, quality, provider and a disabled Continue button |
| `/r/{movieSlug}/{optionSlug}/`  | Server-resolved Continue endpoint; denies in prototype mode         |
| `/admin/links/`                 | Isolated session demo only; unauthenticated, not production admin   |

## Verified Phase 2 evidence

Final refinement checks in the sandbox: **52/52** Vitest unit/component tests, **36/36** Playwright Chromium tests, **3/3** axe-tagged and **19/19** responsive-tagged tests, and a production build generating **532** static pages. The subset counts overlap the full Playwright run. Format, typecheck, lint, static boundary, public-build boundary and runtime audit passed; the public-build check inspected 19 static assets and 2,660 generated HTML/RSC payloads. See [PAGE3_REPORT.md](PAGE3_REPORT.md) and [PHASE2_REPORT.md](PHASE2_REPORT.md).

Prototype screenshots and reference comparisons are in ignored `.artifacts/phase2/`. Runtime `npm audit --omit=dev` reported 0 vulnerabilities at execution time.

See [PHASE2_REPORT.md](PHASE2_REPORT.md), [TEST_CASES.md](TEST_CASES.md) and [BUG_TRACKER.md](BUG_TRACKER.md) for exact artifacts, deviations and remaining blockers. Firefox/WebKit, real devices, screen-reader smoke, Lighthouse/Core Web Vitals, database/auth/live-provider and production security tests are **not** claimed.

## Recommended foundation

Next.js App Router, React and strict TypeScript; hand-authored CSS Modules; PostgreSQL with Drizzle; Better Auth; Vitest/Testing Library and Playwright/axe/Lighthouse. See [ARCHITECTURE.md](ARCHITECTURE.md) for boundaries and tradeoffs. PostgreSQL/Drizzle/Better Auth remain future-phase proposals, not installed Phase 2 dependencies.

**Metadata permission is unresolved.** TMDB is a candidate only. Its current terms can require a written commercial agreement for a traffic-driving discovery site. Live integration stays disabled until the owner confirms appropriate permission. Manual catalog functionality is the fallback.

## Project brain

| Document                                               | Purpose                                                      |
| ------------------------------------------------------ | ------------------------------------------------------------ |
| [AGENTS.md](AGENTS.md)                                 | Agent rules, scope gates and truthful reporting contract     |
| [AI_CONTEXT.md](AI_CONTEXT.md)                         | Verified project memory, decisions and unresolved inputs     |
| [PROJECT_PLAN.md](PROJECT_PLAN.md)                     | Seven-phase roadmap, dependencies and acceptance gates       |
| [ARCHITECTURE.md](ARCHITECTURE.md)                     | Stack, implemented prototype modules and future boundaries   |
| [UI_GUIDELINES.md](UI_GUIDELINES.md)                   | Reference inventory, measured tokens and visual matching     |
| [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)               | Proposed relational model, constraints and migration policy  |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md)           | Planned HTTP contracts; no live endpoint implemented yet     |
| [SECURITY.md](SECURITY.md)                             | Auth, authorization, redirect, secret and content safeguards |
| [TESTING_STRATEGY.md](TESTING_STRATEGY.md)             | Required layers, environments and evidence rules             |
| [TEST_CASES.md](TEST_CASES.md)                         | Traceable cases and actual execution status                  |
| [BUG_TRACKER.md](BUG_TRACKER.md)                       | Defects, resolved blockers and open delivery gates           |
| [PERFORMANCE.md](PERFORMANCE.md)                       | Budgets, image strategy and measurement procedure            |
| [PHASE2_REPORT.md](PHASE2_REPORT.md)                   | Phase 2 deliverable, comparison, tests and remaining issues  |
| [PAGE3_REPORT.md](PAGE3_REPORT.md)                     | Handoff, privacy and isolated-manager details                |
| [CHANGELOG.md](CHANGELOG.md)                           | Completed, dated project changes                             |
| [TASKS.md](TASKS.md)                                   | Phase checklist and immediate approval queue                 |
| [docs/references/README.md](docs/references/README.md) | Owner-supplied reference manifest                            |
| README.md                                              | Entry point and current status                               |

## Repository preparation

- `.gitignore` excludes secrets, dependencies, builds, test artifacts, local data and raw reference images.
- `.env.example` names future configuration without usable credentials.
- `.nvmrc` records the inspected Node runtime.
- Work belongs on `arena/9177d6f3-azmovies`; do not push directly to `main`.
- The GitHub repository is public. Do not add real environment files, movie media, database dumps or credentials. A reuse licence has not been selected by the owner.

## Next action

Owner review is requested for the homepage/detail prototype and for Page 3 (`PAGE3_REPORT.md`), including the disclosed deviations. Continue stays inert until authorized provider URLs and per-link evidence are supplied. After explicit approval, the persistence phase may begin with approved PostgreSQL, private admin and authentication. Do not begin it merely because this README exists.
