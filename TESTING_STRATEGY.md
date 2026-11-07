# AZmovies — Testing Strategy

## 1. Evidence before claims

Testing is mandatory for every implementation phase. Phase 1 has no application to test. Foundation documentation/configuration checks are distinct from component/API/auth/browser/security/performance results.

Allowed statuses: **Not run**, **Blocked**, **Pass**, **Fail**, **Not applicable**. Every Pass/Fail records date, exact command/procedure, environment/commit, actual result and artifact location when applicable. Never infer a pass from code inspection, package installation, a mocked provider or a successful build. Record skipped tests and reasons.

## 2. Test layers and tools

| Layer | Tool/environment | AZmovies focus |
| --- | --- | --- |
| Static | Prettier, ESLint, strict TypeScript, dependency/secret review | Type/DTO boundaries, server-only imports, formatting and unsafe patterns |
| Component | Vitest + Testing Library + jsdom | Header/search/categories/cards/sidebar/pagination/footer/Telegram and admin forms |
| Unit | Vitest | URL policy, metadata mapping, filter parsing, language/quality honesty, field locks |
| API/database integration | Vitest + actual HTTP server + disposable PostgreSQL | Status/headers/DTOs, constraints, transactions, auth/roles, drafts and cache isolation |
| Authentication | Real Better Auth handler + PostgreSQL + browser flow | Login/MFA/sessions/cookies/CSRF/revocation/rate limits/closed signup |
| Functional E2E | Playwright | Browse→search→filter→detail→approved external-page action; admin create→review→publish→archive |
| Responsive/visual | Playwright screenshots at documented viewports | Two-column reference geometry, sidebar/header/footer states, overflow and zoom |
| Cross-browser | Playwright Chromium/Firefox/WebKit; real devices when available | Engine differences plus honest mobile-device coverage |
| Accessibility | axe + keyboard/zoom/manual assistive checks | Labels/focus/announcements/contrast/reflow and unobscured controls |
| Security | Negative HTTP/E2E corpus, header/cookie inspection, scanners | Redirects, authz, injection, CSRF, secrets, private cache leakage |
| Performance | Lighthouse CI, HTTP timings, EXPLAIN/fixture load | Poster loading, Core Web Vitals targets, catalog query latency and bounded jobs |
| Regression | CI suite + selected prior defect cases | All previously working core behavior after every change |

Mock external metadata responses in deterministic tests, but run a separate permitted live smoke test before claiming provider integration. WebKit automation is not a real iPhone/Safari test; label it accurately.

## 3. Environment strategy

### Available now

Node 22.22.3/npm/Git/GitHub CLI are present. No application dependencies, PostgreSQL server, Docker or browser executables were found. Terminal TMDB and Playwright CDN probes failed. npm registry reads and GitHub read-only API access succeeded.

### Required after approval

- **Local/preview:** fixture-only Phase 2 server bound to `0.0.0.0`; exact preview origin configured; no browser-facing localhost API calls.
- **Integration:** disposable real PostgreSQL database with a separate least-privilege test role. No production credentials or shared production data. Provision through an approved host/install method; do not silently substitute SQLite.
- **Browser:** install Playwright engines through an approved reachable source or use a CI runner with network access. Verify installation and actual launch before reporting browser coverage.
- **Staging:** production-like HTTPS/proxy/cookies/image delivery/database pool and synthetic load data. Repeat performance/security checks here; the shared 2-CPU workspace is not production capacity evidence.
- **Provider:** mocked contract suite always; live TMDB only after permission, secret injection and application egress verification.

Use independent test records/transactions or a reset disposable schema per worker. With approximately 3.8 GiB RAM/2 CPUs, start with one integration/browser worker and measure before increasing concurrency. Never run seed/reset/migration-destructive scripts against production.

## 4. Planned commands — not available in Phase 1

Phase 2 must create these scripts and verify them:

```text
npm ci
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run test:coverage
npm run build
npm run dev -- --hostname 0.0.0.0
```

Phase 3+ adds, with environment guards:

```text
npm run test:integration
npm run test:e2e
npm run test:a11y
npm run test:security
npm run test:visual
npm run test:performance
npm run db:check
```

Do not paste these into a Phase 1 “passed” report. They are planned interfaces. Exact browser installation, database setup, visual update and migration commands will be documented after the toolchain/provider is selected. Avoid auto-updating visual baselines in CI.

## 5. Continuous integration plan

Create workflows only after the scaffold/scripts exist. Proposed GitHub Actions gates:

1. **Static/component:** clean npm install from lockfile, format/lint/typecheck, unit/component tests and build.
2. **Integration:** disposable PostgreSQL service, reviewed migrations, API/auth/database/security tests.
3. **Browser:** build/start production-like app, Chromium/Firefox/WebKit functional/responsive/accessibility checks; approved fixture data only.
4. **Visual/performance:** stable viewport captures and Lighthouse on representative pages; retain reports as CI artifacts, not committed sensitive traces.
5. **Supply chain:** npm audit and approved secret scanner; dependency update review.

Use least-privilege workflow permissions and protected secrets. A GitHub Actions YAML file is not evidence that a workflow ran; link the actual run and commit. Real iOS/Android checks remain separate until devices/services are available.

## 6. Test data and reference rules

- Synthetic titles such as “Sample Film” are clearly fictional fixtures; no scraped posters or licensed API payloads committed before permission.
- Cover long/Unicode titles, missing posters, unknown language/quality, duplicate provider IDs, stale edits, empty categories and first/last pagination.
- Redirect corpus includes userinfo, deceptive host suffixes, encoded traversal, unexpected schemes/ports, inactive destinations, expired/revoked approval and changed targets. Use safe example destinations in automated tests; no unauthorized live movie URLs.
- Auth fixtures use generated test-only credentials injected into the test environment, never hardcoded reusable production passwords.
- Screenshots/traces may contain admin cookies/content: store as restricted artifacts, ignore in Git, redact before sharing.
- Visual baselines require actual supplied references and owner approval. Do not compare against an invented screenshot.

## 7. Mandatory scenario coverage

- **Component:** rendering, metadata fallbacks, links, active states, form validation, loading/error/empty states.
- **API:** schema/status/error contracts, bounds, combined filters, stable pagination, server-owned fields, concurrency and transaction failures.
- **Authentication:** valid/invalid login, closed signup, role escalation, MFA, expiry/revocation, cookies, origin/CSRF and persistent throttling.
- **Functional:** manual CRUD, taxonomy, import/override preservation, publish/archive, search/filter/detail, approved redirect and Telegram configuration.
- **Responsive:** 320/375/390/768/1024/1440/1920 widths, zoom/reflow, landscape/short height and touch targets.
- **Cross-browser:** required engines and separately recorded real-device coverage.
- **Security:** redirect allowlist/evidence/approval, injection/XSS/mass assignment, private cache leakage, headers/CSP, secrets/dependencies and recovery.
- **Performance:** 10k-record catalog, 24-card page, cold/warm poster loading, query plans, mobile lab budgets and bounded metadata jobs.
- **Regression:** all critical prior flows plus a reproducer for every fixed bug.

## 8. Gates, severity and exit criteria

- Critical: credential/secret exposure, authorization bypass, unauthorized download/redirect behavior, destructive data loss. Stop release and fix/retest immediately.
- High: broken login/MFA, public draft leakage, unsafe link after revocation, major inaccessible/broken core flow. Fix before release.
- Medium: isolated UI/metadata/performance issue with a safe workaround. Owner may accept a documented exception.
- Low: cosmetic/minor documentation issue; track and schedule.

Initial coverage aim: at least 90% statements/branches for security-sensitive pure policy/validation modules, with mandatory negative cases; do not use a global percentage as a substitute for integration/E2E coverage. Actual coverage thresholds are configured and measured in Phase 2/3.

A phase exits only when its scoped checks run, failures are resolved or explicitly blocked, reference/security gates are satisfied and the report distinguishes real results from remaining work. Owner approval is still required before proceeding.

## 9. Reporting and artifacts

Keep the case register in `TEST_CASES.md`. Future restricted reports can live under `docs/test-runs/<date>-<commit>/` with sanitized summaries; raw Playwright traces, coverage and Lighthouse output stay in ignored artifact directories/CI storage. Record browser/engine/OS/viewport, Node/dependency versions, database major, dataset size, network/CPU profile and exact commit.

For failures, open a `BUG_TRACKER.md` entry with reproducer, expected/actual, severity, evidence and retest case. For blockers, record what was attempted and what input/environment is needed. Never turn a blocked test into a pass by removing the assertion.
