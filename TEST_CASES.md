# AZmovies — Test Case and Evidence Register

**Application status:** final Phase 2 static-fixture homepage, detail, handoff and isolated manager were tested locally. Later-phase cases remain acceptance criteria, not observations. Foundation checks are recorded separately.

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

### Phase 2 detail and handoff cases (final sandbox run)

| ID      | Scenario                         | Expected / observed                                                                                                                                                  | Status                                                      |
| ------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| CMP-13  | Detail fixture sections          | Shared shell, title/info, gallery, options and related movies render                                                                                                 | Pass                                                        |
| CMP-14  | Fixture options                  | Enabled choices use descriptive local Page 3 routes; disabled choices are natively disabled; no external href                                                        | Pass                                                        |
| CMP-15  | Gallery and related grid         | Continuous image stack and two related columns without page overflow                                                                                                 | Pass                                                        |
| UNIT-01 | Detail fixtures                  | All 48 slugs have fixture data; unknown slug returns undefined; single-language metadata is not called multi-audio                                                   | Pass                                                        |
| LNK-01  | Server mapping                   | All 480 options independently map to the expected reserved-example destination; IDs/targets unique                                                                   | Pass (unit only)                                            |
| LNK-02  | Safe public view                 | Page 3 displays movie, quality and provider, not stored target or internal link/database ID                                                                          | Pass                                                        |
| LNK-03  | Exact selection                  | Simulated approved policy result matches each expected fixture target; no live redirect/request                                                                      | Pass (unit only)                                            |
| LNK-04  | Invalid URL corpus               | Non-HTTPS, userinfo, unsafe ports/characters/traversal and lookalike hosts are rejected                                                                              | Pass                                                        |
| LNK-05  | Disabled or unknown selection    | Disabled button/message and 410 route; unknown selection and old ID routes return 404; no Location                                                                   | Pass                                                        |
| LNK-06  | Injected destination             | Query targets cannot override the server mapping or create an external redirect                                                                                      | Pass                                                        |
| LNK-07  | Prototype activation             | Hard-disabled global switch, placeholder authorization and native disabled Continue                                                                                  | Pass                                                        |
| LNK-08  | Navigation                       | Homepage → detail → selected quality → Page 3 → explicit and browser Back                                                                                            | Pass                                                        |
| LNK-09  | Isolated demo CRUD               | Add/edit/disable/enable/delete/reset affect only tab-session demo, not public pages or server mappings                                                               | Pass                                                        |
| LNK-10  | Demo URL handling                | Test destination is validated then discarded; invalid/non-approved host rejected                                                                                     | Pass                                                        |
| LNK-11  | Payload privacy                  | Selected served HTML, client JS and actual navigation RSC contain no known fixture IDs or targets; build scan covers 19 assets and 2,660 generated HTML/RSC payloads | Pass (specific fixture signatures, not general secret scan) |
| LNK-12  | Server boundary                  | Intentional client import of `server-only` module is rejected by Next's production compiler                                                                          | Pass (negative build probe)                                 |
| LNK-13  | Legacy session isolation         | v1 key is neither read, migrated nor deleted; it can remain in an older tab                                                                                          | Pass (unit)                                                 |
| LNK-14  | Browser accessibility            | No serious/critical axe violations for home/drawer/detail/handoff/manager states                                                                                     | Pass (automated only)                                       |
| LNK-15  | Responsive                       | All three pages at 320/360/390/768/1440 px; no document overflow, actions reachable                                                                                  | Pass                                                        |
| LNK-16  | Real authorized provider handoff | Real approved target, permission and approval required                                                                                                               | Not run — none supplied or activated                        |
| LNK-17  | Persisted/authenticated admin    | Server authorization, persistence and audit trail                                                                                                                    | Not run — isolated demo only                                |

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

| ID      | Scenario                                       | Expected result                                                                 | Status                                                                                          |
| ------- | ---------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| FUN-01  | Browse→search→filter→detail→approved page      | Complete journey with correct URL state and truthful destination label          | Partial                                                                                         |
| FUN-02  | Admin create→edit→approve link→publish→archive | Authorized lifecycle works; public visibility/audit correct                     | Not run                                                                                         |
| FUN-03  | Back/forward/reload/deep link                  | Search/filter/page state restored without stale private data                    | Partial — detail deep link and back-to-catalog passed; full state matrix not run                |
| FUN-04  | No results/invalid filter/data failure         | Useful recovery; no fabricated content                                          | Pass                                                                                            |
| RES-01  | 320/375/390 px mobile                          | Required two-column layout, readable metadata, no essential horizontal overflow | Pass                                                                                            |
| RES-02  | 768/1024 px tablet                             | Approved sidebar/grid behavior and accessible navigation                        | Pass                                                                                            |
| RES-03  | 1440/1920 px desktop                           | Reference density/alignment; no invented extra columns                          | Pass                                                                                            |
| RES-04  | 200% zoom/320 px reflow/landscape              | Essential content/controls available; Telegram does not obscure actions         | Partial                                                                                         |
| VIS-01  | Owner-reference comparison                     | Documented region geometry/colors/type; owner approves differences              | Executed — owner approval pending                                                               |
| VIS-02  | Locked fixture visual regression               | No unreviewed snapshot changes                                                  | Not run                                                                                         |
| A11Y-01 | Axe across public/admin states                 | No serious/critical violations; all findings reviewed                           | Partial — Chromium axe home/drawer/detail/handoff/isolated manager passed; manual audit not run |
| A11Y-02 | Keyboard/skip link/dialog/form errors          | Logical focus, visible indicator, correct announcements and focus return        | Partial — drawer/search/detail navigation keyboard checks passed; screen-reader smoke not run   |
| A11Y-03 | Contrast/reduced motion/touch targets          | Agreed accessibility thresholds met                                             | Not run                                                                                         |
| A11Y-04 | Actual screen-reader smoke                     | Record tool/version and observed core journey; not inferred from axe            | Not run                                                                                         |
| BRW-01  | Chromium engine                                | Core public/admin journeys and responsive checks pass                           | Pass                                                                                            |
| BRW-02  | Firefox engine                                 | Same scoped matrix, actual engine version recorded                              | Not run                                                                                         |
| BRW-03  | WebKit engine                                  | Same scoped matrix; not labeled real iOS Safari                                 | Not run                                                                                         |
| BRW-04  | Real Android Chrome/iOS Safari if available    | Separately recorded device/OS results or explicit blocker                       | Not run                                                                                         |

### Preview connectivity investigation (BUG-014)

- **Historical local simulated iframe:** Chromium loaded the then-current homepage, detail and former ID-based Page 3 route in a separate local iframe. No page/console/request errors or failed assets were observed. The ignored captures under `.artifacts/preview-diagnostics/` are not the actual Arena iframe and predate the privacy refinement.
- **Local owner observation:** The owner later reported that the local preview is visible. This does not establish how a separate unauthenticated public request is handled.
- **Public proxy:** A fresh unauthenticated fetch of the public preview root returned E2B's 403 “Missing traffic access token”; earlier requests for detail, former Page 3 and a static chunk produced the same response. Chromium inside the sandbox could not reach the public host (`net::ERR_CONNECTION_CLOSED`); this is not the user's browser result.
- **Actual Arena iframe request:** Its headers and platform proxy logs are inaccessible. The exact cause of the earlier grey frame and authenticated gateway behavior remain unverified; no gateway fix is claimed.

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

- **2026-11-08, Page 3 intermediate link execution:** Node 22.22.3 / Next.js 16.4.5 / Chromium via `@sparticuz/chromium`. `npm run format:check`, `npm run typecheck`, `npm run lint`, `npm run verify:static` passed (34 source files); `npm run test` passed **52/52** across 9 files; `npm run build` passed with **532 static pages**; `npx playwright test` passed **30/30** against the then-current link cases (superseded by the final table above); `npm run capture:prototype` executed; runtime `npm audit --omit=dev` reported 0 vulnerabilities. Artifacts: `.artifacts/phase2/playwright-results.json`, `prototype-360-link-top.png`, `prototype-360-link-full.png`, `prototype-360-link-continue-denied.png`, `prototype-360-link-disabled.png`, `prototype-360-admin-links.png`, `prototype-768-link-full.png`, `prototype-1440-link-full.png`, `prototype-metrics.json` (`link360`: scrollWidth 360, Continue 328×56, external anchors 0, meta refresh 0). Four first-run failures were fixed and re-tested (BUG-008…BUG-011). LNK-16/LNK-17 remain Not run; no test contacted a real external provider.

- **Final Phase 2 refinement (sandbox clock 2026-11-08):** Node 22.22.3, Next 16.4.5 and Chromium via `@sparticuz/chromium`; source based on local checkpoint `34351dd` plus the final refinement. `npm run test` and `npm run test:coverage`: **52/52** across 9 files; coverage for configured component/lib files (routes and `fixtures.ts` excluded) was 83.14% statements/77.27% branches, and `link-policy.ts` 94.82% statements/93.33% branches; `npm run build`: **532** static pages; `npx playwright test` and `npm run test:e2e`: **36/36** each (same browser suite; latter rebuilds); overlapping `npm run test:a11y`: **3/3** and `npm run test:responsive`: **19/19**. `npm run verify:static` passed for 35 source files; `npm run verify:public-boundary` passed for 19 static assets and 2,660 generated HTML/RSC payloads. An intentional client import of a `server-only` module failed with the expected Next compiler error. `npm audit --omit=dev`: **0** reported vulnerabilities. `npm run capture:prototype`, `npm run analyze:references` and `npm run compare:visual` executed; captures/metrics/logs are in `.artifacts/phase2/`. The initial screenshot run timed out waiting on offscreen lazy images; a bounded, capture-only eager-load fix passed on rerun (BUG-016). No external provider was contacted. A Markdown validator checked 18 files/24 local links with 0 failures. An initial `git diff --check` flagged two Markdown hard-break spaces; they were removed and the recheck passed. A limited staged-path/credential-pattern review of 52 staged paths found no matches; it was not a comprehensive secret scan. All tests and findings are scoped to fixtures and the sandbox, not production readiness.

- **Post-merge verification (sandbox clock 2026-11-08):** GitHub `main` and the initially clean session checkout matched merge commit `72f3ed4a4dc47c3fc0249b8b7963b93554c25c65`. Node 22.22.3 / Next 16.4.5 / Chromium via `@sparticuz/chromium`: `npm ci` succeeded with ESLint peer override warnings; `npm run build` passed with 532 pages; `npm run test` passed **52/52**; `npx playwright test` passed **36/36**, including 3 axe-tagged and 19 responsive-tagged overlapping cases; format, lint, typecheck, static verification and public-boundary scan passed (19 assets / 2,660 payloads). At 360×800 and 390×844, a fresh capture script verified homepage → detail → 480p Page 3 → explicit Back, disabled Continue and no page overflow; two initial capture-script assertions were corrected and rerun successfully. Runtime `npm audit --omit=dev` reported 0 vulnerabilities, while the full `npm audit` reported 10 moderate development-tooling findings (BUG-018). A local preview-Host request and simulated cross-port iframe passed; separate unauthenticated external fetches returned E2B 403, with actual authenticated iframe behavior unobserved (BUG-014). Sanitized logs and screenshots: `.artifacts/post-merge/`; details: `PHASE2_REPORT.md`.

Future entries must include exact command, commit, environment, counts/results and sanitized artifact path. A planned case is never marked Pass to make a phase appear complete.
