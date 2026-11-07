# AZmovies — Controlled Development Roadmap

## Status and scope control

Phase 1 is the foundation deliverable. **No website implementation has begun.** Each phase needs an explicit owner go-ahead; completion of tests does not itself authorize the next phase. Dates are not promised: dependencies such as screenshots, licensing and infrastructure affect sequencing.

## Product acceptance baseline

A released AZmovies must provide:

- Reference-faithful dark branding/header/search/category navigation and two-column poster catalog.
- Title, release year, language and honest quality metadata; pagination and sidebar/footer/Telegram behavior.
- Responsive movie details, local search and category/language filters.
- Manual movie creation/editing/archive and taxonomy management in an authenticated private admin.
- Optional automatic metadata lookup/import/refresh through a permitted provider.
- Only reviewed, authorized external movie-information/watch-provider pages; no unauthorized downloads.
- Executed test evidence, documented security controls, acceptable measured performance and recoverable operations.

## Phase 1 — Foundation (delivered; Phase 2 approved)

**Included:** inspect repository/tools/network/GitHub; recommend architecture; establish all 15 brain documents; prepare ignore/environment/runtime files; define roadmap, UI procedure, test matrix, risks and gates.

**Excluded:** package installation, application scaffold, pages, database deployment, credentials, movie imports and live redirects.

**Exit:** file inventory and actual foundation checks reported; unresolved inputs made visible; owner explicitly approves Phase 2. No application test is described as passed.

## Phase 2 — Toolchain and reference-faithful visual shell

**Status:** delivered locally on 2026-11-07; scoped tests/captures/comparison executed; owner visual approval pending before Phase 3.

**Entry:** Q-01/Q-02/Q-03 sufficiently resolved; screenshots available for meaningful visual sign-off. If not, the owner may approve only nonvisual tooling setup, not final UI fidelity.

**Work:**

1. Inspect any new files, initialize the chosen Next.js/TypeScript toolchain and commit a resolved npm lockfile.
2. Establish strict lint/type/test scripts, CSS tokens, fixture types and accessible primitives.
3. Build only the specified header, search presentation, category strip, two-column cards, sidebar, pagination presentation, footer and configured Telegram-link treatment.
4. Build a fixture-backed detail layout and honest loading/empty/error states; no live movie links.
5. Add component tests, keyboard/focus checks and repeatable viewport captures.
6. Compare against supplied references using `UI_GUIDELINES.md`; document differences rather than redesigning.

**Exit evidence:** actual install/build/lint/type/component results; desktop/mobile captures; owner visual approval. Browser execution blockers must be resolved through an approved environment, not hidden.

## Phase 3 — Persistence, private admin and authentication

**Entry:** Phase 2 approved; PostgreSQL test/staging access and admin ownership/recovery agreed.

**Work:**

1. Generate and review Drizzle migrations for catalog/taxonomy/authorization/audit and Better Auth schemas.
2. Add controlled admin bootstrap; disable public registration; enforce server-side admin authorization.
3. Implement session expiry/revocation, CSRF/origin protections, persistent rate limiting and MFA enrollment/recovery.
4. Implement manual movie/category/language CRUD, draft/published/archived lifecycle and optimistic concurrency.
5. Add destination policy and per-link evidence/approval workflow. Nothing is automatically authorized by metadata import.
6. Add real PostgreSQL integration, authorization, auth, CRUD and audit tests.

**Exit evidence:** migration round-trip on a disposable database; successful and denied auth/role paths; session/password/MFA tests; draft non-disclosure; CRUD/concurrency/audit results. No default credentials or public registration.

## Phase 4 — Discovery catalog and approved redirects

**Entry:** stable schema/admin content workflow and at least safely authorized test destinations.

**Work:**

1. Connect server-rendered home/category/search/detail pages to persisted published records.
2. Implement bounded search, combined filters, stable numeric pagination and URL state.
3. Implement the opaque redirect route with fresh destination/approval checks and safe failure behavior.
4. Add responsive/functional/accessibility tests and cache-leakage checks.
5. Activate only the owner-provided Telegram destination after validation.

**Exit evidence:** end-to-end browse/search/filter/detail/approved-redirect journey; malicious/arbitrary/expired/revoked destination rejection; mobile/desktop results; no download/player routes.

## Phase 5 — Permitted metadata automation (conditional)

**Entry:** provider permission/licence confirmed, server credential supplied through secret storage, application egress verified, Phase 4 catalog secure.

**Work:**

1. Implement the provider adapter with strict response validation, bounded requests, rate-limit handling and sanitized errors.
2. Add admin metadata search/preview/import and refresh jobs for existing movies.
3. Preserve editorial overrides; map genres/language accurately; never infer dubbed languages or source quality.
4. Add scheduled refresh only after hosting scheduler/auth design is verified; imported records remain drafts until reviewed.
5. Implement attribution, content expiry/purge and image optimization within the provider's permission.

**Exit evidence:** mocked contract tests plus actual permitted API smoke test; duplicate/retry/failure tests; override preservation; license/cache/asset review. If permission/egress is unavailable, report this phase as blocked and retain manual operation.

## Phase 6 — Verification and release hardening

**Entry:** scoped features complete in staging with realistic, rights-cleared fixtures/content.

**Work:** execute the full regression matrix; Chromium/Firefox/WebKit and available real devices; accessibility/zoom/reduced-motion; auth/redirect/injection/header/cache security tests; representative load/performance measurements; dependency/secret scans; backup/restore drill; operational runbooks.

**Exit evidence:** dated reports linked from `TEST_CASES.md`; no unresolved critical/high defects; measured budgets or owner-approved documented exceptions; restore proof; staging acceptance. Engine emulation is not labeled as real-device testing.

## Phase 7 — Controlled production release

**Entry:** explicit owner release approval, domain/host/database chosen, production secrets/MFA/recovery configured, authorized content review complete.

**Work:** apply reviewed migrations; deploy; configure exact origins/proxy trust/HTTPS/security headers; verify health/readiness and admin isolation; smoke public journeys and safe redirects; establish monitoring, backup schedule, link review and metadata refresh operations.

**Exit:** actual production smoke results, rollback instructions, known limitations and ownership recorded. Pushing a branch or opening a PR is not a production deployment.

## Dependency and risk register

| ID   | Risk/dependency                                                            | Impact                                         | Mitigation / owner action                                                              | Gate        |
| ---- | -------------------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------- | ----------- |
| R-01 | Screenshots absent from checkout                                           | Cannot verify exact visual fidelity            | Attach references; record dimensions and states                                        | 2           |
| R-02 | TMDB commercial/permission requirements                                    | Live integration may be impermissible          | Confirm current terms and appropriate agreement; provider remains optional             | 5           |
| R-03 | No authorized movie-page inventory                                         | Cannot safely populate redirects               | Owner supplies provider/path evidence; default deny                                    | 4           |
| R-04 | No local DB server or Docker                                               | Real integration tests blocked                 | Provision approved PostgreSQL test/staging environment; do not silently switch engines | 3           |
| R-05 | Browser CDN probe failed; no browsers installed                            | Responsive/cross-browser execution blocked     | Approved browser mirror or CI runner with verified downloads                           | 2/6         |
| R-06 | Latest package metadata is not compatibility proof                         | Install/build/type failures                    | Resolve one lockfile; run smoke checks; record exact versions                          | 2           |
| R-07 | Preview/production proxy and cookie origins differ                         | Login failures or CSRF/trust bypass            | Exact origin allowlist; verified proxy header handling; test both contexts             | 3/7         |
| R-08 | Public GitHub repository                                                   | Accidental secret/content disclosure           | Ignore env/data/reports; pre-commit diff/secret review; no credentials in chat         | Every phase |
| R-09 | Original language ≠ dubbed language; quality not supplied by metadata APIs | Misleading cards                               | Separate editorial language/quality fields; unknown fallback                           | 3/4         |
| R-10 | Poster/brand rights                                                        | Copyright/trademark exposure                   | Use permitted assets; no copied MOVIES4U branding/code; record sources                 | 2/5         |
| R-11 | Large catalog/search and poster payload                                    | Slow pages/database                            | 10k fixture benchmark; bounded pagination; indexed queries; responsive images          | 6           |
| R-12 | Admin lockout/recovery without mail provider                               | Operational loss of access                     | Owner-held authenticator/recovery codes; controlled offline reset runbook              | 3/7         |
| R-13 | Approved destination changes later                                         | Unsafe/stale outbound link                     | Revalidate on click, revoke controls, scheduled review where permitted                 | 4/7         |
| R-14 | Shared 2-CPU/3.8-GiB workspace                                             | Misleading load results or resource exhaustion | Low test concurrency; label local results; repeat benchmarks in staging                | 6           |

## Change control and reporting

A change to layout, stack, content policy, schema or release scope requires a dated decision in `AI_CONTEXT.md`/`CHANGELOG.md` and corresponding task/test updates. Every phase report separates **created/changed**, **executed evidence**, **blocked/not run**, **decisions needed**, and **next gate**. No phase removes existing functionality without permission.
