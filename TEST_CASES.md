# AZmovies — Test Case and Evidence Register

**Application status:** Phase 2 static fixture prototype executed locally. Homepage and movie-detail scoped checks have run; later-phase cases remain acceptance criteria, not observations. Foundation checks are recorded separately with their actual scope.

## 1. Foundation checks

| ID     | Check / procedure                                                                                                    | Expected                                                      | Status  | Evidence                                                                                                                                                             |
| ------ | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FND-01 | Inspect starting repository and required final document inventory                                                    | Original README inspected; all 15 requested documents present | Pass    | 2026-11-07: original one-line README inspected; 15 required documents found; 18 intended files staged                                                                |
| FND-02 | Validate Markdown local links, fenced blocks, UTF-8 and required headings                                            | No broken local links or malformed checked structure          | Pass    | 2026-11-07: inline Python validator; 15 local links resolved; headings/fences/UTF-8/unfinished-marker checks passed                                                  |
| FND-03 | Inspect example variables and staged content for usable secrets                                                      | Empty secret fields; no real env/data files staged            | Pass    | 2026-11-07: 13 unique example variables, sensitive fields blank, provider off; 18 text files had no targeted credential-pattern matches; not a comprehensive scanner |
| FND-04 | `git check-ignore` with representative secret/build/dependency/report paths; ensure example/lockfile are not ignored | Secrets/artifacts excluded; safe example/lockfile trackable   | Pass    | 2026-11-07: `git check-ignore -q --no-index`; 12 sensitive/artifact probes ignored and 7 safe probes trackable                                                       |
| FND-05 | `git diff --cached --check` after staging all new files                                                              | No whitespace errors                                          | Pass    | 2026-11-07: command exited 0 for all 18 staged foundation files                                                                                                      |
| FND-06 | `gh auth status`; read-only `gh api repos/sachi26698-LIMA/AZmovies`                                                  | Actual auth/read result, no token disclosure or write claim   | Pass    | 2026-11-07: both succeeded; CLI 2.23.0; repository public/default main; no push attempted                                                                            |
| FND-07 | Runtime/executable/resource inventory                                                                                | Record actual availability, not assumed tools                 | Pass    | 2026-11-07: Node 22.22.3/npm 10.9.8/Git 2.39.5; no DB/Docker/browser executables; details in AI_CONTEXT.md                                                           |
| FND-08 | Bounded terminal HTTPS probes to metadata API and browser CDN                                                        | Record actual connectivity limitation                         | Blocked | 2026-11-07: both curl probes exited 35 during TLS connection; no application integration/browser launch tested                                                       |
| FND-09 | npm registry metadata reads for candidate packages                                                                   | Actual registry/version/engine information                    | Pass    | 2026-11-07: metadata reads succeeded; no packages installed and no compatibility/build test claimed                                                                  |

FND-06/07/09 verify inspection capabilities only. FND-08 is an environment blocker, not a passed security/connectivity test. Final foundation validation results are recorded above and in the execution log below.

## 2. Component cases (Phase 2+)

| ID     | Scenario                                 | Expected result                                                              | Status  |
| ------ | ---------------------------------------- | ---------------------------------------------------------------------------- | ------- |
| CMP-01 | Header/brand/search render               | AZmovies branding, labeled search and compact semantic landmarks             | Pass    |
| CMP-02 | Category navigation/active state         | Correct links/current state; overflow remains accessible                     | Pass    |
| CMP-03 | Movie card complete metadata             | Title/year/language/quality and poster link render accurately                | Pass    |
| CMP-04 | Missing poster/unknown quality/language  | Honest fallbacks, no fabricated metadata or broken image                     | Not run |
| CMP-05 | Long/Unicode title                       | No overflow; full title accessible on detail/name                            | Partial |
| CMP-06 | Two-column grid                          | Two tracks at approved viewports, stable card geometry                       | Pass    |
| CMP-07 | Pagination first/middle/last/single page | Correct links/disabled states/current-page announcement                      | Pass    |
| CMP-08 | Sidebar/mobile disclosure                | All required links retained; keyboard/focus behavior correct                 | Pass    |
| CMP-09 | Footer/Telegram configured and unset     | Required footer; safe link only when configured; no invented channel         | Pass    |
| CMP-10 | Loading/empty/error states               | Geometry preserved; useful retry/reset; no private error details             | Pass    |
| CMP-11 | Admin movie form                         | Field labels/errors, required fields, pending submit and stale-edit feedback | Not run |
| CMP-12 | Link review form                         | Evidence required; target edit clears approval; revoke feedback truthful     | Not run |

### Phase 2 movie-detail component/unit cases

| ID      | Scenario                            | Expected result                                                                                                           | Status |
| ------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------ |
| CMP-13  | Detail fixture sections render      | Shared shell, trending, title/info, gallery, quality/watch options, related movies and footer render from static fixtures | Pass   |
| CMP-14  | Provider/watch/trailer placeholders | No external `href`; controls are `aria-disabled` placeholders with honest notes                                           | Pass   |
| CMP-15  | Detail gallery and related grid     | Gallery is vertically scrollable; related grid keeps two columns without page overflow                                    | Pass   |
| UNIT-01 | Detail fixtures for all slugs       | Every movie slug has genres/cast/stills/options/related; unknown slug returns undefined                                   | Pass   |

### Page 3 intermediate link cases (executed 2026-11-08)

| ID     | Scenario                             | Expected result                                                                                                                                 | Status                               |
| ------ | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| LNK-01 | Every option has its own link record | 480 records; unique id and unique destination per link                                                                                          | Pass                                 |
| LNK-02 | Selected link mapping                | Page 3 shows the exact stored URL, movie title, quality and provider for that id across two providers/movies                                    | Pass                                 |
| LNK-03 | Exact destination on Continue        | `resolveContinue` returns the stored URL unchanged when every gate passes                                                                       | Pass (unit only; activation off)     |
| LNK-04 | Invalid/unsafe destination corpus    | http, javascript, data, file, relative, userinfo, odd port, control chars, over-length, traversal/encoded path all rejected with specific codes | Pass                                 |
| LNK-05 | Non-approved host / lookalike        | Exact-host allowlist rejects suffix, prefix and subdomain lookalikes and IP/localhost literals                                                  | Pass                                 |
| LNK-06 | Disabled link                        | Detail row inert; Page 3 shows "Disabled by administrator"; `/r/` returns 410 with no Location                                                  | Pass                                 |
| LNK-07 | Unknown/removed link                 | Safe "Link not available" panel, no destination shown; `/r/` returns 404                                                                        | Pass                                 |
| LNK-08 | Open-redirect injection              | `?url=`/`?target=` on `/go/` and `/r/` cannot change the destination; no external anchor rendered                                               | Pass                                 |
| LNK-09 | Activation gate                      | Shipped constant is false; every fixture link denied; `/r/` 403 with no Location                                                                | Pass                                 |
| LNK-10 | No dark patterns                     | No auto-redirect, countdown, pop-up or `meta refresh`; Continue is a single explicit action                                                     | Pass                                 |
| LNK-11 | Navigation journey                   | Homepage → detail → quality option → Page 3 → Back to Movie Details returns to the source page                                                  | Pass                                 |
| LNK-12 | Admin add/edit/disable/enable/delete | Each operation affects only the targeted link and is reflected on the public Page 3                                                             | Pass (prototype store)               |
| LNK-13 | Admin URL validation                 | Form rejects invalid/non-approved destinations and creates nothing                                                                              | Pass                                 |
| LNK-14 | Page 3 accessibility                 | axe: no serious/critical violations on enabled, disabled and manager screens                                                                    | Pass                                 |
| LNK-15 | Page 3 responsive                    | 320/768/1440: no horizontal overflow; Continue and Back reachable                                                                               | Pass                                 |
| LNK-16 | Real authorized provider handoff     | Continue opens the owner-approved live URL                                                                                                      | Not run — no authorized URL supplied |
| LNK-17 | Persisted/authenticated admin CRUD   | Server-side authorization, durability, audit trail                                                                                              | Not run — prototype store only       |

## 3. Public API and database cases (Phase 3/4)

| ID     | Scenario                                               | Expected result                                                                          | Status  |
| ------ | ------------------------------------------------------ | ---------------------------------------------------------------------------------------- | ------- |
| API-01 | Health/live/ready                                      | Minimal status; required dependency failure sanitized; optional provider outage isolated | Not run |
| API-02 | Catalog default/list DTO                               | Only published fields; no evidence/raw targets/private records                           | Not run |
| API-03 | Combined search/category/language/year/quality filters | AND semantics and correct totals                                                         | Not run |
| API-04 | Invalid/oversized query, unknown sort/quality          | Bounded validation error; no unbounded SQL                                               | Not run |
| API-05 | Literal `%`/`_`/quotes/Unicode search                  | Safe literal handling and expected matches                                               | Not run |
| API-06 | Pagination bounds/stable ties                          | No duplicates/omissions under documented ordering; max size enforced                     | Not run |
| API-07 | Empty/out-of-range page                                | One documented behavior consistently in API/UI                                           | Not run |
| API-08 | Published/draft/archived/missing detail                | Published data only; indistinguishable unavailable responses                             | Not run |
| API-09 | Admin CRUD and taxonomy transaction                    | Valid draft/create/edit; audit agrees; failed transaction not reported successful        | Not run |
| API-10 | Slug/provider-ID/category uniqueness                   | Constraints enforced; useful conflict response                                           | Not run |
| API-11 | Mass assignment/server-owned fields                    | Role/status/approval/creator/sync fields cannot be injected                              | Not run |
| API-12 | Missing/stale/current `If-Match`                       | 428/409/success respectively; no lost update                                             | Not run |
| API-13 | Publish/archive lifecycle                              | Required metadata checked; public visibility/cache changes correctly                     | Not run |
| API-14 | Body size/method/content type                          | Explicit bounded errors; unsupported methods rejected                                    | Not run |
| API-15 | Authenticated/private cache headers                    | No public caching of admin/session/draft responses                                       | Not run |

## 4. Authentication and authorization cases (Phase 3+)

| ID      | Scenario                                       | Expected result                                                                      | Status  |
| ------- | ---------------------------------------------- | ------------------------------------------------------------------------------------ | ------- |
| AUTH-01 | Valid owner login through real handler         | Correct session/cookie; generic error policy preserved                               | Not run |
| AUTH-02 | Invalid/unknown/oversized credentials          | No login; sanitized response; bounded verification cost                              | Not run |
| AUTH-03 | Public signup including role=admin             | No account/session created                                                           | Not run |
| AUTH-04 | Anonymous/non-admin/admin route matrix         | Private pages/APIs denied before data access; admin allowed only after MFA policy    | Not run |
| AUTH-05 | Forged/expired/revoked session                 | Denied at server boundary despite cookie presence                                    | Not run |
| AUTH-06 | Logout/password change                         | Current/other sessions revoked as configured; cookies cleared appropriately          | Not run |
| AUTH-07 | Cookie attributes in HTTPS deployment          | Secure/HttpOnly/SameSite/host scope verified                                         | Not run |
| AUTH-08 | MFA enrollment/challenge/invalid code/recovery | No editorial bypass; recovery code single-use; secrets never returned/logged         | Not run |
| AUTH-09 | Cross-origin/missing-origin mutation           | Untrusted sensitive writes rejected                                                  | Not run |
| AUTH-10 | Spoofed forwarding headers                     | Trusted client identity follows actual proxy topology only                           | Not run |
| AUTH-11 | Repeated/distributed login attempts            | Persistent IP and account controls behave as approved; no permanent attacker lockout | Not run |
| AUTH-12 | Bootstrap/recovery                             | No HTTP setup route/default password; emergency reset audited and revokes sessions   | Not run |
| AUTH-13 | Generated auth schema compatibility            | Pinned library works against migrated PostgreSQL schema                              | Not run |

## 5. Redirect and content safety cases (Phase 3/4)

| ID     | Scenario                                                          | Expected result                                                                     | Status  |
| ------ | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------- |
| RED-01 | Approved link on published movie                                  | Fresh 303 to exact stored HTTPS destination; no-store/referrer headers              | Not run |
| RED-02 | Caller-supplied `url`/return target                               | Cannot influence destination                                                        | Not run |
| RED-03 | Missing/pending/revoked/expired link                              | Safe denial; no target/evidence disclosure                                          | Not run |
| RED-04 | Draft/archived movie with formerly approved link                  | Public redirect denied                                                              | Not run |
| RED-05 | Inactive destination or changed target                            | Denied until reviewed; approval not inherited                                       | Not run |
| RED-06 | Lookalike host/suffix/userinfo/subdomain                          | Exact policy rejects deceptive target                                               | Not run |
| RED-07 | HTTP/javascript/data/file/magnet/torrent/download                 | Rejected by policy and never proxied                                                | Not run |
| RED-08 | Unexpected port/control chars/encoded traversal                   | Canonical validation rejects unsafe ambiguity                                       | Not run |
| RED-09 | Per-link evidence/approver missing                                | Cannot approve/publish action                                                       | Not run |
| RED-10 | Telegram unset/invalid/valid                                      | Hidden/rejected/safe official link respectively                                     | Not run |
| RED-11 | Anonymous click count                                             | Aggregate only; no visitor identifiers; counting failure does not weaken policy     | Not run |
| RED-12 | Availability checker follows changed destination (if implemented) | Every hop bounded/validated; no automatic reauthorization or internal-network fetch | Not run |

## 6. Metadata cases (Phase 5, conditional)

| ID      | Scenario                                  | Expected result                                                                | Status  |
| ------- | ----------------------------------------- | ------------------------------------------------------------------------------ | ------- |
| META-01 | Permission/credential absent              | Integration disabled; manual catalog unaffected; no secret leakage             | Not run |
| META-02 | Mock provider search/detail contract      | Strict normalized DTO; no raw response persistence                             | Not run |
| META-03 | Import/duplicate/retry                    | Idempotent draft creation; duplicate active job prevented                      | Not run |
| META-04 | Refresh with editorial locks              | Locked title/language/quality/poster preserved; approval/status unchanged      | Not run |
| META-05 | Timeout/429/5xx/401/403/malformed payload | Bounded retry/error behavior; no publication or credential disclosure          | Not run |
| META-06 | Language/quality mapping                  | Original/spoken/display distinction; no invented dubbing/quality               | Not run |
| META-07 | Attribution/expiry/purge                  | Approved branding/notice; stale content refreshed/purged under permitted terms | Not run |
| META-08 | Scheduler authentication/concurrency      | Unauthorized calls denied; bounded jobs and recoverable leases                 | Not run |
| META-09 | Actual permitted provider smoke test      | Real authorized response mapped successfully; distinct from mocks              | Not run |
| META-10 | Public page with provider unavailable     | Local published catalog still renders; no browser/provider credential exposure | Not run |

## 7. Functional, responsive and browser cases

| ID      | Scenario                                       | Expected result                                                                 | Status                                                                                        |
| ------- | ---------------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| FUN-01  | Browse→search→filter→detail→approved page      | Complete journey with correct URL state and truthful destination label          | Partial                                                                                       |
| FUN-02  | Admin create→edit→approve link→publish→archive | Authorized lifecycle works; public visibility/audit correct                     | Not run                                                                                       |
| FUN-03  | Back/forward/reload/deep link                  | Search/filter/page state restored without stale private data                    | Partial — detail deep link and back-to-catalog passed; full state matrix not run              |
| FUN-04  | No results/invalid filter/data failure         | Useful recovery; no fabricated content                                          | Pass                                                                                          |
| RES-01  | 320/375/390 px mobile                          | Required two-column layout, readable metadata, no essential horizontal overflow | Pass                                                                                          |
| RES-02  | 768/1024 px tablet                             | Approved sidebar/grid behavior and accessible navigation                        | Pass                                                                                          |
| RES-03  | 1440/1920 px desktop                           | Reference density/alignment; no invented extra columns                          | Pass                                                                                          |
| RES-04  | 200% zoom/320 px reflow/landscape              | Essential content/controls available; Telegram does not obscure actions         | Partial                                                                                       |
| VIS-01  | Owner-reference comparison                     | Documented region geometry/colors/type; owner approves differences              | Executed — owner approval pending                                                             |
| VIS-02  | Locked fixture visual regression               | No unreviewed snapshot changes                                                  | Not run                                                                                       |
| A11Y-01 | Axe across public/admin states                 | No serious/critical violations; all findings reviewed                           | Partial — Chromium axe home/drawer/detail passed; admin not run                               |
| A11Y-02 | Keyboard/skip link/dialog/form errors          | Logical focus, visible indicator, correct announcements and focus return        | Partial — drawer/search/detail navigation keyboard checks passed; screen-reader smoke not run |
| A11Y-03 | Contrast/reduced motion/touch targets          | Agreed accessibility thresholds met                                             | Not run                                                                                       |
| A11Y-04 | Actual screen-reader smoke                     | Record tool/version and observed core journey; not inferred from axe            | Not run                                                                                       |
| BRW-01  | Chromium engine                                | Core public/admin journeys and responsive checks pass                           | Pass                                                                                          |
| BRW-02  | Firefox engine                                 | Same scoped matrix, actual engine version recorded                              | Not run                                                                                       |
| BRW-03  | WebKit engine                                  | Same scoped matrix; not labeled real iOS Safari                                 | Not run                                                                                       |
| BRW-04  | Real Android Chrome/iOS Safari if available    | Separately recorded device/OS results or explicit blocker                       | Not run                                                                                       |

### Preview connectivity investigation (BUG-014)

- **Local simulated iframe:** Chromium loaded the homepage, movie detail and `/go/lnk-0001/` in a separate sandboxed iframe. All three were visually inspected; no page/console/request errors or failed asset responses were observed. Captures: `.artifacts/preview-diagnostics/{home,detail,page3}-local-iframe.png`. These ephemeral captures are not of the actual Arena preview.
- **Public proxy:** An external fetch without an authentication header of all three routes and a Next.js static chunk returned E2B's 403 “Missing traffic access token”. Chromium inside the sandbox could not reach the public host (`net::ERR_CONNECTION_CLOSED`); this is not the user's browser result.
- **Actual Arena iframe:** Not verified. Browser network details, authenticated proxy behavior and platform proxy logs are inaccessible from the sandbox. The reported grey frame remains open pending platform investigation and owner-visible verification.

## 8. Security, performance and regression cases

| ID      | Scenario                               | Expected result                                                                      | Status                         |
| ------- | -------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------ |
| SEC-01  | SQL/XSS/HTML/script payload corpus     | Parameterized/escaped handling; no script execution/raw HTML                         | Not run                        |
| SEC-02  | CSP/security headers/CORS/framing      | Production policy verified; preview exception not present in production              | Not run                        |
| SEC-03  | Secret/dependency scans                | Actual reports reviewed; no usable secrets committed                                 | Partial — runtime audit only   |
| SEC-04  | Backup restore/emergency recovery      | Documented recovery works without exposing credentials or retaining revoked sessions | Not run                        |
| PERF-01 | 10k catalog representative queries     | Agreed warm DB/API latency budgets; reviewed query plans                             | Not run                        |
| PERF-02 | Mobile home/detail lab run             | Recorded LCP/CLS/transfer/JS budgets; no claimed field INP from lab proxy            | Not run                        |
| PERF-03 | Cold/warm image/cache behavior         | Reserved geometry, optimized posters, lazy loading and correct invalidation          | Partial — assets/geometry only |
| PERF-04 | Staging concurrent browse/load         | Error/latency/resource results recorded with exact environment                       | Not run                        |
| PERF-05 | Metadata job/resource bounds           | No unbounded requests/memory or public-page dependency                               | Not run                        |
| REG-01  | Every prior critical flow after change | Existing browse/admin/auth/redirect behavior preserved                               | Not run                        |
| REG-02  | Each fixed bug reproducer              | Fails before fix where reproducible, passes after, remains in suite                  | Pass                           |
| REG-03  | Migration/auth/dependency upgrade      | Schema compatibility and full affected regression matrix rerun                       | Not run                        |

## 9. Execution log

- **2026-11-07, environment inspection:** FND-06/07/09 passed within their stated inspection-only scope; FND-08 blocked by actual terminal TLS failures. No application, database, browser, live metadata or production security test ran.
- **2026-11-07, final foundation validation:** inline Python filesystem/Markdown/example validator passed (15 documents, 15 local links, 13 unique example variables); targeted credential-pattern review of 18 staged text files found no matches; `git check-ignore -q --no-index` passed 12 ignored and 7 trackable probes; `git diff --cached --check` exited 0. Environment: Node 22.22.3, Git 2.39.5, foundation changes based on commit `662694163ddf11337fa5a7cceea83bacdd4472d8`. No application code was executed. The pattern review is limited, not a comprehensive secret scanner.

- **2026-11-07, local checkpoint:** after the final checks above, `git commit` created `13ad936a25e236985068fa5d422f64aafdb04afa` on `arena/9177d6f3-azmovies` (18 files). No GitHub push was attempted. This is a Git checkpoint result, not an application test.

- **2026-11-07, Phase 2 static prototype execution:** on commits `3f0120d`/`f1edf53` (before final documentation checkpoint), Node 22.22.3 / Next.js 16.4.5 / Chromium via `@sparticuz/chromium`: `npm run format:check`, `npm run typecheck`, `npm run lint`, `npm run verify:static` passed; `npm run test` passed 16/16 Vitest tests; `npm run build` passed with 51 static pages; `npx playwright test` passed 15/15 Chromium tests including axe home/drawer/detail and responsive widths 320/375/390/768/1024/1440/1920 plus 320 reflow/landscape. `npm run capture:prototype` and `npm run compare:visual` executed; artifacts: `.artifacts/phase2/prototype-*.png`, `prototype-metrics.json`, `comparison-primary-top.png`, `visual-comparison.json`, `playwright-results.json`, `static-boundary.json`. Runtime `npm audit --omit=dev` reported 0 vulnerabilities. VIS-01 is executed but not owner-approved; admin/auth/API/DB/live-provider/Firefox/WebKit/real-device/screen-reader/Lighthouse cases remain Not run.

- **2026-11-07, Phase 2 movie-detail execution:** Node 22.22.3 / Next.js 16.4.5 / Chromium via `@sparticuz/chromium`: `npm run format:check`, `npm run typecheck`, `npm run lint`, `npm run verify:static` passed; `npm run test` passed 21/21 Vitest tests; `npm run build` passed with 51 static pages; `npm run test:e2e` passed 19/19 Chromium tests including homepage→detail→back, detail toolbar search, detail axe, detail responsive 320/768/1440 and existing homepage checks. `npm run analyze:references`, `npm run capture:prototype`, `npm run compare:visual` executed; detail artifacts include `.artifacts/phase2/prototype-360-detail-top.png`, `prototype-360-detail-gallery.png`, `prototype-360-detail-options.png`, `comparison-detail-top.png` and `prototype-metrics.json` (`detail360`: scrollWidth 360, gallery scrollHeight 558/clientHeight 420, relatedCards 4, externalLinks 0). Runtime `npm audit --omit=dev` reported 0 vulnerabilities. Owner visual approval remains pending; admin/auth/API/DB/live-provider/Firefox/WebKit/real-device/screen-reader/Lighthouse cases remain Not run.

- **2026-11-08, Page 3 intermediate link execution:** Node 22.22.3 / Next.js 16.4.5 / Chromium via `@sparticuz/chromium`. `npm run format:check`, `npm run typecheck`, `npm run lint`, `npm run verify:static` passed (34 source files); `npm run test` passed **52/52** across 9 files; `npm run build` passed with **532 static pages**; `npx playwright test` passed **30/30** including LNK-01…LNK-15; `npm run capture:prototype` executed; runtime `npm audit --omit=dev` reported 0 vulnerabilities. Artifacts: `.artifacts/phase2/playwright-results.json`, `prototype-360-link-top.png`, `prototype-360-link-full.png`, `prototype-360-link-continue-denied.png`, `prototype-360-link-disabled.png`, `prototype-360-admin-links.png`, `prototype-768-link-full.png`, `prototype-1440-link-full.png`, `prototype-metrics.json` (`link360`: scrollWidth 360, Continue 328×56, external anchors 0, meta refresh 0). Four first-run failures were fixed and re-tested (BUG-008…BUG-011). LNK-16/LNK-17 remain Not run; no test contacted a real external provider.

Future entries must include exact command, commit, environment, counts/results and sanitized artifact path. A planned case is never marked Pass to make a phase appear complete.
