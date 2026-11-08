# AZmovies — Final Phase 2 Prototype Report

- **Status:** Final local refinement complete; **owner approval is pending**.
- **Branch:** `arena/9177d6f3-azmovies` · No GitHub push.
- **Evidence timestamp:** sandbox clock 2026-11-08; test logs and captures are under ignored `.artifacts/phase2/`.

## 1. Scope delivered

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
