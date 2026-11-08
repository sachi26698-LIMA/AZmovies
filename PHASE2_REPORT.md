# AZmovies — Phase 2 Prototype and Post-Merge Verification Report

- **Status:** PR #1 merged into `main`; post-merge verification is recorded below. **Owner approval remains required before Phase 3.**
- **Merge commit:** `72f3ed4a4dc47c3fc0249b8b7963b93554c25c65`.
- **Verification branch:** `arena/252d03ee-azmovies`, initially clean and at the exact same commit and tree as GitHub `main`.
- **Evidence:** Fresh post-merge logs and captures are under ignored `.artifacts/post-merge/`. The pre-merge observations and prior-session artifact paths below are historical; ignored artifacts do not travel with Git.

## Post-merge verification

### Baseline and application

GitHub reports [PR #1](https://github.com/sachi26698-LIMA/AZmovies/pull/1) as **MERGED** into `main`, with merge commit `72f3ed4a4dc47c3fc0249b8b7963b93554c25c65`. The GitHub API reported the same SHA for `main` at verification time. Before any documentation changes, the fixed session branch was at that commit, `git status --porcelain --untracked-files=all` was empty, and `git diff origin/main` was empty; both refs had tree object `007c66329177902e48ed225b74ffbf114458bdf9`. The session did **not** switch to or check out `main`: its clean checkout was identical to the verified main snapshot. Subsequent documentation edits are on the session branch only and do not change remote `main`.

After `npm ci` from the committed lockfile, `npm run build` generated **532** static pages. The resulting production app was started with `npm run start -- --port 3000`, listening on `0.0.0.0:3000`, and returned HTTP 200 locally. No application or UI source code was changed during this verification.

### Fresh mobile screenshots and navigation

Chromium captured the current main build at **360×800** and **390×844** CSS pixels, device-pixel ratio 1. The actual first-movie journey was followed at each width: homepage → `Aranya: Rise of a Legend` detail → its `480p` selection on Page 3 → the explicit Back link to the same detail page. Page 3 displayed the matching movie, quality and fixture provider; Continue was natively disabled. Both journeys passed without page errors, and each page's document width equaled the viewport width.

The viewport overview is `.artifacts/post-merge/mobile-overview.png`. Individual viewport and full-page captures, respectively, are:

| Page           | 360 px                                                         | 390 px                                                         |
| -------------- | -------------------------------------------------------------- | -------------------------------------------------------------- |
| Homepage       | `page1-home-360-viewport.png`, `page1-home-360-full.png`       | `page1-home-390-viewport.png`, `page1-home-390-full.png`       |
| Movie detail   | `page2-detail-360-viewport.png`, `page2-detail-360-full.png`   | `page2-detail-390-viewport.png`, `page2-detail-390-full.png`   |
| Page 3 handoff | `page3-handoff-360-viewport.png`, `page3-handoff-360-full.png` | `page3-handoff-390-viewport.png`, `page3-handoff-390-full.png` |

All filenames in this table are under `.artifacts/post-merge/`. Metrics and paths are in `mobile-navigation-metrics.json`. These are fresh screenshots of the local production build, not captures of the authenticated Arena iframe. The capture-only script eagerly loaded offscreen images without changing app code. Two initial capture-harness assertions failed: a homepage card's display text included extra metadata, and a route change briefly showed a loading fallback. The script was corrected to compare the canonical title and wait for the handoff heading; the final capture and navigation run passed at both widths.

### Tests and dependency observations

| Post-merge command / check                                                           | Result                                                                                                                                                                                                                                                         |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run test`                                                                       | **52/52** unit/component tests passed across 9 files.                                                                                                                                                                                                          |
| `npm run build` then `npx playwright test`                                           | **36/36** Chromium browser regression tests passed against the running fresh production build. The suite includes 3 axe-tagged and 19 responsive-tagged tests; these are overlapping subsets, not additional tests.                                            |
| `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run verify:static` | Passed.                                                                                                                                                                                                                                                        |
| `npm run verify:public-boundary`                                                     | Passed: 19 static assets and 2,660 generated HTML/RSC payloads, zero failures.                                                                                                                                                                                 |
| `npm audit --omit=dev`                                                               | Passed: 0 reported runtime vulnerabilities at this execution.                                                                                                                                                                                                  |
| Full `npm audit`                                                                     | **10 moderate, 0 high/critical** findings; exit 1. The underlying [minimatch advisory](https://github.com/advisories/GHSA-g3hv-75wg-m249) affects the development tooling dependency graph. No dependency updates were made in this verification; see BUG-018. |
| `npm ci`                                                                             | Succeeded with existing ESLint peer-range override warnings; lint still passed. No lockfile changes were made.                                                                                                                                                 |

Logs, JSON results and audit reports are in `.artifacts/post-merge/`. These results do not replace production security testing or testing in Firefox, WebKit or on physical devices.

### Separate preview 403 investigation

- The local production app returned **200** with both a normal local request and a request carrying the assigned preview `Host`/`Origin` and an iframe fetch hint. The inspected local response had no `X-Frame-Options` or CSP header. A simulated cross-origin iframe on a different local port loaded the homepage and visible search; it is **not** the real Arena iframe.
- The separate web fetch tool, without credentials, received E2B **403 “Missing traffic access token”** for the public preview root, movie detail and Page 3. A direct in-sandbox `curl` to the public hostname failed during TLS setup with exit 35 and HTTP 000, so it did not establish public access from inside the sandbox.
- [E2B's private-sandbox documentation](https://docs.e2b.dev/network/restrict-public-access) states that requests to a private sandbox without its traffic access token receive 403. The observed public response is consistent with that documented gateway policy, not evidence of an app route failure. The session cannot inspect the actual Arena iframe request, authentication propagation or proxy logs, so authenticated preview behavior and any fix remain **unverified**.
- No token was requested, logged or embedded, and no network, authentication, proxy or UI restrictions were relaxed. If an authenticated Arena preview fails, platform owners should investigate the authorized proxy-to-sandbox credential flow; do not make the sandbox public as a workaround. See BUG-014.

**Gate:** Wait for explicit owner approval before Phase 3. The merge and these checks do not constitute production readiness or approval to activate external destinations.

## 1. Scope delivered (pre-merge implementation)

- **Page 1:** Refined the MOVIES4U-inspired category sizing, color, spacing and poster proportions without changing the existing structure. Search, category filtering, pagination, drawer, footer and the two-column grid remain fixture-based.
- **Page 2:** Refined reference-derived title, metadata, quality rows and spacing; the three synthetic screenshot images form a continuous vertical stack. Audio labels distinguish single-, dual- and multi-language fixtures; they are not claims of real availability.
- **Page 3:** Detail options open a descriptive movie/option URL. The page displays the selected movie, quality and provider, a disabled Continue button and Back to Movie Details. Internal link IDs, database references and stored destination URLs are not serialized to the public page.
- **Manager:** At the owner's direction, `/admin/links/` is an isolated browser-session demo. Add, edit, disable, enable, delete and reset are independent demo controls; they do **not** change public pages or server mappings. The test-destination field is validated and then discarded.

All content is synthetic. There is no live movie API, database, authentication, production admin, live provider integration or activated external redirect. The manager is public and unauthenticated and must not be treated as a production admin.

## 2. References and visual review

The supplied reference manifest is `docs/references/README.md`: two primary MOVIES4U homepage screenshots, four supplementary homepage screenshots, and nine detail screenshots. The user described three primary homepage and four detail screenshots; the received counts differ. No Page 3 reference was supplied, so its styling derives from the detail tokens and requires owner review.

At a 360 CSS-pixel viewport, measured against the primary homepage reference:

| Region                      | Reference estimate       | Final prototype measurement |
| --------------------------- | ------------------------ | --------------------------- |
| Special button height       | approximately 36 px      | 36 px                       |
| Regular category row height | approximately 34.3 px    | approximately 35 px         |
| First poster top            | approximately y=533.3 px | y=532.5 px                  |
| Poster/card width           | approximately 146.3 px   | 146.5 px                    |
| Column gap                  | approximately 27.3 px    | 27 px                       |

The reference and prototype do not use identical content or branding, so these measurements are not a pixel-perfect score. At 360 px the detail gallery has equal `scrollHeight` and `clientHeight` of 544 px, indicating a continuous page stack rather than a nested scroll container. Page 3's Continue control measures 328×56 px and is disabled.

Fresh captures were generated for all three pages at **320, 360, 390, 768 and 1440 px**. Home/detail/Page 3 captures and the 360 px gallery/options were visually inspected. Automated document-width checks found no horizontal overflow at those widths; the homepage and related-movie grids retain two columns.

Key ignored review artifacts:

- `.artifacts/phase2/comparison-primary-top.png` and `comparison-detail-top.png` — aligned 360 px reference comparisons.
- `.artifacts/phase2/prototype-360-detail-gallery.png` and `prototype-360-detail-options.png` — detail sections.
- `.artifacts/phase2/prototype-{320,360,390,768,1440}-link-responsive.png` and corresponding `-detail-responsive.png` — handoff and detail viewport captures.
- `.artifacts/phase2/prototype-320-full.png`, `prototype-360-full.png`, `prototype-390-full.png`, `prototype-768-full.png`, `prototype-1440-full.png` — homepage captures.
- `.artifacts/phase2/prototype-metrics.json` — exact capture dimensions and geometry.

### Deliberate differences requiring acceptance

1. AZmovies branding and original synthetic posters/stills replace reference branding and copyrighted imagery.
2. Green/red category colors and detail highlights are adjusted for contrast; the reference's unsafe promotions, betting ads and download links are not reproduced.
3. Telegram/app/footer actions are inert; “How To Watch?” replaces download wording. Empty categories remain honest empty fixture states.
4. Page 3 has no supplied reference, external Continue is disabled, and the manager is an unauthenticated **demo**, not a real admin.
5. Desktop uses a compact centered layout rather than inventing more poster columns. Only two primary MOVIES4U homepage captures were supplied.

## 3. Destination privacy and flow

`src/lib/link-catalog.ts` contains safe public descriptions. The 480 synthetic records (48 movies × 10 options), internal IDs and reserved-example destination URLs live in `src/lib/link-fixtures.ts`, marked `server-only`. Page 3 constructs a minimal explicit view model. The Continue route resolves a known movie/option on the server, ignores caller-supplied targets and applies the HTTPS/exact-host policy. `EXTERNAL_ACTIVATION_ENABLED` is hard-coded false and every record is an unapproved fixture placeholder.

Unit tests independently checked the expected server-side destination for **all 480** quality/watch/provider selections. Simulated activation is a pure unit-policy test only: no real provider is contacted. Browser checks cover homepage → detail → selected quality → Page 3, the explicit Back link and browser Back, disabled selections, unknown/legacy paths, query injection, demo isolation and invalid test URLs. Disabled routes return 410 and unknown routes return 404; enabled fixture Continue requests return 403, without a `Location` header.

A production-build scan checked **19 client static assets and 2,660 generated HTML/RSC payloads** for known fixture IDs and target signatures. Browser tests also inspected served HTML, JavaScript and navigation RSC payloads. An intentional negative build probe verified that Next rejects a client component importing a `server-only` module. These are scoped fixture regression checks, **not** a general secret scan or penetration test.

The new demo uses a separate v2 session key. Older v1 session data is deliberately not read, migrated or deleted and may remain in an existing tab until that session ends; it is not used to configure the new demo or public pages.

## 4. Executed checks

Environment: Node 22.22.3, Next.js 16.4.5, Chromium via `@sparticuz/chromium`, one Playwright worker. The screenshot script forces lazy images to load only in its capture browser; application lazy loading is unchanged.

| Command / procedure                                                                 | Actual result                                                                                                                                                                                                                             |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run format:check`, `npm run lint`, `npm run typecheck`                         | Pass                                                                                                                                                                                                                                      |
| Markdown/link validation and `git diff --check`                                     | Pass; 18 Markdown files, 24 local links, 0 failures. An initial diff check flagged two Markdown hard-break spaces; these were removed and the check passed.                                                                               |
| Staged path/limited secret-pattern review                                           | Pass; 52 staged paths, no targeted token/private-key patterns or ignored artifact paths found. This is not a comprehensive secret scan.                                                                                                   |
| `npm run verify:static`                                                             | Pass; 35 source files, runtime dependencies limited to Next/React                                                                                                                                                                         |
| `npm run test`                                                                      | **52/52** Vitest unit/component tests across 9 files                                                                                                                                                                                      |
| `npm run test:coverage`                                                             | **52/52**; configured component/lib scope: 83.14% statements and 77.27% branches; `link-policy.ts`: 94.82% statements and 93.33% branches. Routes and `fixtures.ts` are outside this configured coverage scope; no threshold is enforced. |
| `npm run build`                                                                     | Pass; Next reported **532** generated static pages                                                                                                                                                                                        |
| `npm run verify:public-boundary`                                                    | Pass; 19 static assets and 2,660 generated HTML/RSC payloads                                                                                                                                                                              |
| `npx playwright test` and `npm run test:e2e`                                        | Each passed **36/36** Chromium tests; `test:e2e` also rebuilt the app                                                                                                                                                                     |
| `npm run test:a11y`                                                                 | **3/3** overlapping axe-tagged tests; no serious/critical violations in covered states                                                                                                                                                    |
| `npm run test:responsive`                                                           | **19/19** overlapping responsive-tagged tests                                                                                                                                                                                             |
| `npm run analyze:references`, `npm run capture:prototype`, `npm run compare:visual` | Executed; captures, comparison images and metrics generated                                                                                                                                                                               |
| `npm audit --omit=dev`                                                              | 0 reported runtime vulnerabilities at execution time                                                                                                                                                                                      |
| `server-only` negative build probe                                                  | Expected compiler rejection observed                                                                                                                                                                                                      |

The first screenshot attempt timed out after 600 seconds waiting on offscreen lazy images. The capture-only loader was corrected with a bounded wait, and the complete rerun passed in approximately 40 seconds (BUG-016). The overlapping test subsets are not additional unique tests. Full command logs, browser JSON and boundary reports are ignored artifacts under `.artifacts/phase2/`.

## 5. Preview and remaining limitations

- The owner reported the local preview is visible. The updated local production server binds to `0.0.0.0:3000` and served the final test suite. The owner should confirm the refreshed preview visually.
- Separately, a fresh **unauthenticated external** request to the E2B public preview returned 403 “Missing traffic access token.” The actual Arena iframe request headers and proxy logs are unavailable. This does not prove the cause of the earlier grey frame or an authenticated gateway fix; see BUG-014. No proxy access restrictions were weakened.
- Firefox, WebKit, real Android/iOS devices, actual screen readers, Lighthouse/Core Web Vitals, load testing, database/auth/API integration and production security testing were **not run**. Automated axe is not a complete accessibility audit.
- The public demo manager lacks authentication, persistence and audit. Real provider authorization evidence, deployment topology, admin recovery/MFA, metadata permission and PostgreSQL remain later-phase blockers.

## 6. Approval gate

Please review the refreshed preview and the two comparison images. **Approve Phase 2 and the stated deviations, or request specific changes.** Do not advance to Phase 3 or activate real destinations without explicit owner approval and separately reviewed authorized provider URLs/evidence.
