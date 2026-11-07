# AZmovies — Performance Plan and Budgets

**Status:** targets and procedures only. No Lighthouse, browser, load, image or database performance measurement has run. Do not quote these numbers as achieved results.

## 1. Workload assumptions

Initial benchmark: 10,000 synthetic published movies, 24 cards/page, representative category/language/year distributions, mixed long titles and missing posters. Two-column poster pages can be image-heavy even with a small JavaScript bundle. Confirm actual catalog size/image rights with the owner before capacity commitments.

The current workspace has 2 CPUs and approximately 3.8 GiB RAM. It is suitable for functional checks and preliminary profiling, not a production capacity claim. Repeat release benchmarks on the selected staging host.

## 2. Proposed budgets

| Metric                          | Initial target                                          | Measurement conditions                                                                                            |
| ------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| LCP                             | <=2.5 s at p75                                          | Mobile home/detail, production build, declared network/CPU profile; field p75 separately when real traffic exists |
| CLS                             | <=0.1 at p75                                            | Reserved poster/metadata/navigation geometry, stable fonts                                                        |
| INP                             | <=200 ms at p75                                         | Real-user/interaction evidence when available; Lighthouse lab TBT is not reported as INP                          |
| Public route initial JavaScript | <=180 KiB compressed                                    | Home/detail route-owned/compressed transfer, excluding images; exact accounting recorded                          |
| Initial critical CSS            | <=35 KiB compressed                                     | No UI framework or unused theme payload                                                                           |
| Poster transfer                 | <=60 KiB per displayed card as a practical target       | Correct responsive size/format; exceptions documented for detailed artwork                                        |
| Font transfer                   | <=60 KiB total, or system font                          | Only reference-approved/local font files; no remote font dependency                                               |
| Warm catalog API                | p95 <=300 ms                                            | 10k records, declared pool/concurrency, no upstream metadata call                                                 |
| Warm catalog DB query           | p95 <=100 ms                                            | EXPLAIN/ANALYZE reviewed; cold connection reported separately                                                     |
| Warm search/filter API          | p95 <=500 ms                                            | Worst approved combined filters and literal/Unicode cases                                                         |
| Admin save                      | p95 <=500 ms excluding upstream import                  | Transaction/audit included; no false success on failure                                                           |
| Lighthouse                      | Performance >=90; accessibility/best practices/SEO >=95 | Version/profile/URL recorded; manual accessibility still required                                                 |
| Staging browse load             | <1% errors under initial 50-reader/60-second scenario   | Exact host/data/pool recorded; adjust only with evidence and owner approval                                       |

Budgets are provisional until the first actual build/reference measurement. Any relaxation needs a recorded reason, impact and owner acceptance; do not weaken a test just to turn it green.

## 3. Poster and asset strategy

- Use Next Image responsive `sizes` derived from the final two-column/main-sidebar geometry; do not download original posters for cards.
- Prefer AVIF/WebP where permitted and supported, with appropriate quality and a stable fallback. Preserve the agreed poster ratio and explicit dimensions/aspect ratio.
- Prioritize only the likely LCP poster; eager-load the small initial visible set and lazy-load below-fold cards. Avoid marking all 24 images high priority.
- Use a lightweight local neutral fallback. No large base64 placeholder payload or layout-shifting spinner replacement.
- Cache licensed/provider images according to permission; restrict remote hosts to the approved provider CDN. Never turn the app into an arbitrary image-fetch proxy.
- TMDB assets are not permitted merely because the URL is reachable. Current permission/egress blockers apply to images as well as metadata. Use owned synthetic placeholders until resolved.
- Self-host only approved brand/font assets; subset fonts if needed. Do not copy MOVIES4U assets.
- Track actual bytes per viewport and cold/warm cache. Keep bulk media, screenshots and performance traces out of Git.

## 4. Application/database strategy

- Server-render public pages from local data. No TMDB request in the visitor request path.
- Keep client components small; no global state library, carousel, analytics suite or animation dependency without a demonstrated need.
- Use bounded pagination/counts, fixed sort mappings and indexes from `DATABASE_SCHEMA.md`. Inspect query plans before adding caches.
- Configure a small initial PostgreSQL pool appropriate to the host; do not multiply connections per component/request.
- Use short public cache TTL/tag invalidation only after testing draft isolation and publish/archive behavior. Admin and redirect decisions remain uncached.
- Measure N+1 queries in card/category/language hydration; batch reads where needed.
- Import/refresh jobs have concurrency, timeout, retry and payload bounds. Schedule off peak where possible; never let a backlog block public reads.
- Avoid expensive server-side availability checks on every page render. Redirect click policy is a local database check; external link health review is separate and bounded.

## 5. Measurement procedure after implementation

1. Build production output and record commit/dependency/Node/database versions and bundle accounting.
2. Seed the synthetic 10k dataset in an isolated environment; verify counts/distribution.
3. Capture cold/warm home/category/search/detail runs at agreed mobile/desktop viewports. Record Lighthouse version and exact throttling; run enough repetitions to expose variance rather than cherry-pick one result.
4. Capture network waterfalls, image bytes, font behavior, layout shifts and route JavaScript. Identify the actual LCP element.
5. Run representative API/DB timings with low concurrency first; record warm/cold pools and query plans. Then run the declared staging load scenario.
6. Inspect CPU/memory/connection counts and metadata job behavior. The 2-CPU sandbox result must be labeled as such.
7. Check keyboard/interaction responsiveness and reduced-motion behavior. Do not derive field INP from a lab-only score.
8. Store sanitized summaries and artifact locations in `TEST_CASES.md`; open defects for failed budgets.
9. After any image/query/cache change, rerun affected measurements and regression checks.
10. When deployed, collect privacy-conscious real-user Web Vitals only if the owner approves the analytics approach; no third-party tracker is implicitly authorized.

## 6. Current evidence and blockers

- Phase 2 posters are original synthetic JPEGs optimized to 480×720, quality 82/mozjpeg, approximately 46–97 KB each; poster geometry is reserved with `aspect-ratio` and the first row uses priority loading.
- Static production build passed with 51 prerendered pages; no database or live provider is involved.
- PERF-03 is **Partial**: local asset optimization and reserved geometry are implemented; cold/warm cache and invalidation measurements are not run.
- PERF-01, PERF-02, PERF-04 and PERF-05: **Not run**. No Lighthouse/Core Web Vitals score, 10k-catalog benchmark, staging load result or production capacity is claimed.
- Chromium execution is available through `@sparticuz/chromium`; Firefox/WebKit and real-device lab runs remain blocked/not provisioned.
- Real DB benchmarks remain blocked by absent/provision-pending PostgreSQL. Provider image measurements remain blocked by permission and application egress.
