# AZmovies — AI Context

**Checkpoint:** 2026-11-08 · Phase 2 homepage + movie detail + Page 3 intermediate link page delivered locally · **Awaiting owner approval before the persistence/admin phase**

This is the concise project memory. Read `AGENTS.md` before acting. Plans below are not claims of implemented functionality.

## 1. Product and immutable boundaries

AZmovies is a professional dark-themed movie discovery site with manual catalog management, optional permitted metadata integration, search/category filtering, detail pages, approved external-page redirects and a private admin. It is not a streaming/download site. The reference requires a compact header, search, horizontal categories, a two-column poster grid with title/year/language/quality, pagination, sidebar, footer and floating Telegram icon.

The owner has explicitly prohibited unnecessary redesign and premature implementation. No unauthorized copyrighted movie downloads may be hosted, distributed or linked.

## 2. Verified repository and tooling snapshot

| Item                     | Actual observation on 2026-11-07                                                                                                                                                                                                   |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Checkout                 | `/home/user/AZmovies`                                                                                                                                                                                                              |
| Session branch           | `arena/9177d6f3-azmovies`                                                                                                                                                                                                          |
| Starting commit          | `662694163ddf11337fa5a7cceea83bacdd4472d8` (`Initial commit`)                                                                                                                                                                      |
| Foundation commit        | `13ad936a25e236985068fa5d422f64aafdb04afa` — local only; a follow-up checkpoint records validation evidence                                                                                                                        |
| Starting tracked content | `README.md` only, containing `# AZmovies`; inspected before expansion                                                                                                                                                              |
| Starting worktree        | Clean                                                                                                                                                                                                                              |
| Remote                   | `https://github.com/sachi26698-LIMA/AZmovies.git`                                                                                                                                                                                  |
| GitHub CLI               | 2.23.0; authenticated as `sachi26698-LIMA` through an existing environment token, never printed                                                                                                                                    |
| GitHub API               | Read-only repository request succeeded; public, unarchived, default branch `main`; API reported push/admin permissions                                                                                                             |
| GitHub writes            | No push, PR, merge or remote configuration change performed                                                                                                                                                                        |
| Git                      | 2.39.5; local commit identity configured                                                                                                                                                                                           |
| OS/resources             | Linux x86_64; 2 CPUs; approximately 3.8 GiB RAM; approximately 20 GiB free disk at inspection                                                                                                                                      |
| Node/npm                 | Node 22.22.3 / npm 10.9.8; npm registry metadata reads succeeded                                                                                                                                                                   |
| Other runtimes           | Python 3.11.2; Yarn 1.22.22; pnpm/Bun absent                                                                                                                                                                                       |
| Database/browser tools   | No `psql`, `sqlite3`, Docker, Chromium, Chrome or Firefox executable found                                                                                                                                                         |
| Visual references        | Fifteen owner-supplied JPEGs inspected and mapped: six homepage files (two primary MOVIES4U, four HDHub4u) and nine detail files (eight crops + one full page); raw images ignored by Git                                          |
| Application              | Fixture prototype implemented: homepage, movie detail, Page 3 `/go/{linkId}/`, locked Continue endpoint `/r/{linkId}/` and prototype link manager `/admin/links/`; no database/auth/real redirect; local checkpoints only, no push |

The GitHub CLI rejected the newer `--active` flag; plain `gh auth status` succeeded. This is a CLI-version limitation, not an authentication failure.

### Network evidence

- Terminal probes to `api.themoviedb.org` and `cdn.playwright.dev` failed during TLS connection (curl exit 35). No live metadata response or browser binary was obtained.
- The environment permits terminal access to GitHub, npm and Python package hosts. Browser downloads and production database connectivity remain unverified.
- The user reported a blank grey Arena preview frame. A direct external fetch of the public E2B URL, without a traffic-access header, returned 403 “Missing traffic access token”; this response came from the proxy before the app. The actual Arena iframe request headers and proxy logs were not accessible, so its exact failure is unconfirmed. The sandbox cannot reach the public URL directly (curl TLS exit 35). See BUG-014; owner-visible preview confirmation remains pending.
- IPv4 `0.0.0.0` and a temporary dual-stack `::` bind both served the app locally; there is no evidence that IPv6 binding caused the reported iframe failure. Do not weaken sandbox access restrictions or add tokens to source/URLs to work around the proxy.
- Official TMDB/Better Auth documentation was retrieved through the separate web research tool. That does **not** prove future server-side TMDB connectivity.
- npm metadata included Next 16.4.5, React 19.3.1, Better Auth 1.7.18 and Drizzle 0.45.4. Registry availability/engine metadata is not an installed compatibility test.

## 3. Agent capabilities available here

- Inspect/read/search files; create files; make targeted edits; retain changes in the checkout.
- Run bounded shell commands, inspect Git diffs/history/status and create local commits.
- Use authenticated `gh`/GitHub API capabilities; a reported permission is not proof that a particular write has succeeded.
- Start long-lived preview processes in later phases, bind to `0.0.0.0`, and inspect their logs/ports.
- Use web research, browser-oriented test tooling after installation, and image/file presentation tools.
- No connected third-party app tools are currently enabled. GitHub CLI access is separately verified above.

## 4. Proposed decisions (owner approval pending)

| ID   | Decision                                                                      | Reason/qualification                                                                                                              |
| ---- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| D-01 | Next.js App Router + React + strict TypeScript                                | Server-rendered discovery/detail pages and private admin/API in one modular codebase                                              |
| D-02 | Hand-authored CSS Modules and global design tokens                            | Direct control of reference spacing/typography without a recognizable template or UI-kit theme                                    |
| D-03 | PostgreSQL + Drizzle migrations/query layer                                   | Relational catalog, transactions, constraints, full approval/audit history; same database engine in test/staging                  |
| D-04 | Better Auth email/password, database sessions, closed registration, admin MFA | Maintained auth primitives instead of handwritten password/session crypto; production requires TOTP setup and recovery procedures |
| D-05 | Provider-neutral metadata boundary; TMDB candidate only                       | Manual operation remains usable; live TMDB requires an appropriate permission/licence and working egress                          |
| D-06 | Opaque-ID redirect route + exact destination policy + per-link approval       | No arbitrary `?url=` redirect; authorization is checked at click time                                                             |
| D-07 | Vitest/Testing Library, Playwright engines, axe, Lighthouse, CI               | Covers component/API/auth/functional/responsive/security/regression layers; actual runs still required                            |
| D-08 | Two poster columns pending reference clarification                            | Preserves the explicit brief; desktop/mobile screenshot evidence must resolve any conflict before visual sign-off                 |

Runtime baseline: use the available Node 22.22.3 and npm lockfile. Conservative TypeScript 5.9.3 is proposed while surrounding tooling compatibility is checked; npm also reports TypeScript 7.0.2, which is not yet selected. Exact dependency resolution belongs to Phase 2, not this document-only phase.

## 5. Important external-policy finding

TMDB's current API terms restrict caching beyond six months and require attribution. They also describe covered revenue/traffic-driving destination websites as commercial use requiring a written agreement; an old forum answer about advertising must not override the current terms. [1](https://www.themoviedb.org/api-terms-of-use)

The FAQ separately describes free noncommercial use and attribution/branding requirements. [1](https://developer.themoviedb.org/docs/faq)

**Action:** owner must confirm intended monetization and the appropriate TMDB permission, or choose another licensed provider. Do not request a key in chat, enable live calls, or cache real TMDB content in fixtures before that decision. AZmovies itself is not an AI/ML application; these “AI Brain” files are development documentation, not a TMDB-trained model or chatbot.

## 6. Outstanding questions / blockers

| ID   | Question / missing input                                                                                                                                       | Blocks                                                                              | Default until answered                                                                                      |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Q-01 | Homepage and detail references received and inspected; optional missing third MOVIES4U capture remains BLK-011; detail four-vs-nine count mismatch is BLK-012. | Owner visual approval of executed homepage/detail comparisons                       | Proceed with documented references and disclosed deviations                                                 |
| Q-02 | Approve the proposed stack and Phase 2 scope?                                                                                                                  | All website scaffolding                                                             | No implementation                                                                                           |
| Q-03 | Is two columns intended on desktop as well as mobile?                                                                                                          | Final grid breakpoints                                                              | Plan two columns, not an invented five-column redesign                                                      |
| Q-04 | Which external providers/pages are authorized, and what evidence supports each link?                                                                           | Activating Continue on Page 3; publishable redirects/production content             | `EXTERNAL_ACTIVATION_ENABLED = false` and every fixture link is `fixture-placeholder`; Continue stays inert |
| Q-05 | Will the site monetize, and is an appropriate TMDB agreement available?                                                                                        | Live TMDB integration                                                               | Manual-first; provider disabled                                                                             |
| Q-06 | Which hosting platform, domain and PostgreSQL provider will be used?                                                                                           | Deployment-specific cookies, proxy trust, cron, browser CI and database integration | Local/preview configuration only after approval                                                             |
| Q-07 | What is the official Telegram destination?                                                                                                                     | Floating link activation                                                            | Hide unconfigured link rather than invent a channel                                                         |
| Q-08 | Which languages, category labels and quality vocabulary should be used?                                                                                        | Reference/content acceptance                                                        | Editable taxonomy; unknown quality is explicit, never fabricated                                            |
| Q-09 | Who owns admin recovery, and is authenticator-based MFA acceptable?                                                                                            | Production admin rollout                                                            | Single admin; no public signup or unverified email recovery                                                 |
| Q-10 | Expected catalog size/import cadence and poster rights/source?                                                                                                 | Capacity, storage and import scheduling                                             | Initial performance fixture target: 10,000 movies; no bulk copyrighted assets committed                     |

## 7. Current evidence and next action

Phase 2 application checks executed on 2026-11-07 after the movie-detail addition: `npm run format:check`, `npm run typecheck`, `npm run lint`, `npm run verify:static`, `npm run test` (21 Vitest tests passed), `npm run build` (51 static pages), `npm run test:e2e` (19 Chromium tests passed), `npm run analyze:references`, `npm run capture:prototype`, `npm run compare:visual`, and runtime `npm audit --omit=dev` (0 reported vulnerabilities). Artifacts are under `.artifacts/phase2/`, including `comparison-primary-top.png`, `comparison-detail-top.png`, `prototype-360-detail-top.png`, `prototype-360-detail-gallery.png`, `prototype-360-detail-options.png`, `prototype-metrics.json`, `playwright-results.json`, `static-boundary.json` and `reference-analysis.json`.

Browser execution was resolved through `@sparticuz/chromium` with bundled AL2023 library extraction and omission of the unstable `--single-process` flag in this sandbox. Firefox/WebKit, real devices, screen-reader smoke, Lighthouse/Core Web Vitals, database/auth/API/live-metadata and production security checks remain **Not run**. Owner visual approval remains **pending**.

### Page 3 increment (2026-11-08)

Executed after adding the intermediate link page: `npm run format:check`, `npm run typecheck`,
`npm run lint`, `npm run verify:static` (34 source files) passed; `npm run test` **52/52** Vitest;
`npm run build` **532 static pages**; `npx playwright test` **30/30** Chromium; `npm run
capture:prototype` executed; runtime `npm audit --omit=dev` **0**. Page 3 evidence lives in
`.artifacts/phase2/prototype-360-link-*.png`, `prototype-360-admin-links*.png` and
`prototype-metrics.json` (`link360`, `admin360`). Details: `PAGE3_REPORT.md`.

Two independent locks keep external navigation off: `EXTERNAL_ACTIVATION_ENABLED = false` and
per-link `authorization: 'fixture-placeholder'`. The link manager is a **sessionStorage prototype
with no auth, no server write and no database**; it is not the real admin.

Next action: wait for owner approval of Page 3 (and the still-pending homepage/detail approval).
Do not start persistence/authenticated admin merely because the prototype builds. Do not activate
real destinations until the owner supplies authorized URLs and per-link evidence.
