# AZmovies — Task and Approval Queue

**Current gate:** Phase 2 static visual prototype review after PR #1 merged. **Phase 3 is blocked until the owner explicitly approves the prototype and the documented deviations.**

## Post-merge verification

- [x] Verify PR #1 merged and the initially clean session checkout matched `main` at merge commit `72f3ed4`.
- [x] Rebuild/start the merged production app, rerun 52/52 unit/component and 36/36 Chromium browser tests, and capture the three-page journey at 360/390 px.
- [x] Investigate the separate unauthenticated preview 403 and record the limits of local iframe and gateway observations.
- [x] Record the post-merge results and full-vs-runtime dependency audit distinction in `PHASE2_REPORT.md`.
- [ ] Review the moderate development-tooling audit advisory and its compatible remediation without silently changing the lockfile (BUG-018).
- [ ] Obtain explicit owner approval before any Phase 3 work.

The “no push” notes below describe the pre-merge checkpoints when they were recorded.

## Phase 1 — foundation

- [x] Inspect repository, original README, branch, history and worktree.
- [x] Inspect runtime/package manager/Git/GitHub/database/browser capabilities.
- [x] Verify GitHub authentication and read-only repository access without exposing tokens.
- [x] Record actual terminal egress limitations separately from web research access.
- [x] Confirm reference availability honestly; Phase 1 had no screenshots to inspect.
- [x] Research stack/metadata/auth constraints and recommend a modular architecture.
- [x] Create the brain documents and expand the inspected README.
- [x] Define phased roadmap, schema/API/security contracts and UI/test/performance procedures.
- [x] Prepare `.gitignore`, safe `.env.example` and inspected-runtime `.nvmrc`.
- [x] Execute and record foundation file/link/ignore/secret/diff checks.
- [x] Create local foundation commits `13ad936` and `de0e2bf`; no push.

## Phase 2 — static fixture-based visual prototype

- [x] Reinspect worktree and owner-supplied references; record the actual six-file mapping in `docs/references/README.md`.
- [x] Install Next.js/TypeScript toolchain with a resolved npm lockfile and actual compatibility checks.
- [x] Add strict format/lint/typecheck/unit/component/build/static-boundary scripts.
- [x] Extract reference color/geometry observations into `scripts/analyze-references.mjs` and `.artifacts/phase2/reference-analysis.json`.
- [x] Create measured global tokens and reusable layout/movie components.
- [x] Build fixture-only header/search/categories/two-column grid/drawer/pagination/footer/Telegram treatment.
- [x] Build fixture detail, not-found, loading, empty and error surfaces without live external movie actions.
- [x] Generate original synthetic posters and optimize them to local 480×720 JPEG assets.
- [x] Resolve Chromium execution through `@sparticuz/chromium`; record the sandbox library/flag workarounds.
- [x] Execute final Vitest unit/component tests: 52/52 passed.
- [x] Execute final Chromium functional/accessibility/responsive suite: 36/36 passed; overlapping axe and responsive subsets passed 3/3 and 19/19.
- [x] Capture all three pages at 320/360/390/768/1440 widths, plus drawer and detail gallery/options states.
- [x] Execute aligned primary-top and detail-top visual comparisons and record metrics/deviations; owner visual approval remains pending.
- [x] Inspect all nine new movie-detail references and record the four-vs-nine count mismatch as BLK-012.
- [x] Refine the static movie detail page: trending strip, title/info/chips, poster, continuous screenshot stack, local quality/watch/provider choices, related movies and shared footer.
- [x] Generate and optimize three original synthetic 960×540 cinematic stills for the detail gallery.
- [x] Test homepage→detail→back navigation, detail toolbar search, detail accessibility and detail responsive overflow.
- [x] Update context/architecture/UI/tests/changelog/bug tracker and create local Phase 2 commits `3f0120d`, `f1edf53` and detail checkpoint `39f1262`; no push.
- [ ] Obtain owner approval of the prototype, contrast/safety deviations and remaining empty category states before Phase 3.

## Phase 2 increment — Page 3 intermediate external link page

- [x] Review the existing Phase 2 homepage/detail work before changing anything.
- [x] Keep all 480 synthetic option records, internal IDs and destination URLs in a `server-only` inventory.
- [x] Use descriptive `/go/{movieSlug}/{optionSlug}/` and `/r/{movieSlug}/{optionSlug}/` selectors, with a minimal safe Page 3 summary and no raw destination or internal ID in public payloads.
- [x] Keep Continue natively disabled; offer explicit and browser Back navigation.
- [x] Validate exact HTTPS hosts and reject unsafe paths; ignore query/header/body targets.
- [x] Keep activation off with independent global and per-link fixture locks.
- [x] Keep the owner's chosen isolated session-demo manager with add/edit/disable/enable/delete/reset; validate and discard test-destination input, with no public/server mapping changes.
- [x] Test all 480 mappings in unit simulations and run the full browser, accessibility, responsive, HTML/RSC/JS and session-isolation checks.
- [x] Inspect 19 client static assets and 2,660 generated HTML/RSC files; prove Next rejects an intentional client import of a `server-only` module.
- [x] Capture and compare Page 1/2/3 at requested widths; document the separate public proxy 403 honestly.
- [x] Update the project brain, task/test/bug records and Phase 2 reports locally; no push.
- [ ] Obtain owner approval of Page 3 and its disclosed deviations.
- [ ] Receive authorized provider URLs plus per-link evidence before any real destination is activated.

## Immediate owner inputs

1. Approve or request changes to the Phase 2 homepage and movie-detail visual match using `.artifacts/phase2/comparison-primary-top.png`, `.artifacts/phase2/comparison-detail-top.png` and the live preview.
2. Accept or amend the documented safety/accessibility deviations: AZmovies branding, synthetic posters, inert Telegram/app/footer controls, “How To Watch?” wording, darkened AA pill colors and the derived Page 3 design with disabled Continue and isolated unauthenticated demo manager.
3. Optionally supply the missing third MOVIES4U screenshot; the received primary MOVIES4U set contains two files, not three.
4. Before Phase 3: provision approved PostgreSQL, confirm admin owner/MFA/recovery custody and confirm authorized destination/content policy.
5. Before Phase 4/5: supply official Telegram URL, authorized external-link inventory (including detail quality/watch provider URLs) and metadata permission/provider decision.

## Phase 3 — persistence/admin/auth

- [ ] Provision approved disposable/staging PostgreSQL.
- [ ] Generate/review auth and catalog migrations; verify real apply/status/restore behavior.
- [ ] Implement closed-signup Better Auth, server-owned admin role and controlled bootstrap.
- [ ] Implement/test MFA, session/cookie/CSRF/proxy/rate-limit/recovery policy.
- [ ] Implement manual movie/taxonomy CRUD, versioning, lifecycle and audit.
- [ ] Implement destination policy and per-link evidence/approval/revocation.
- [ ] Execute API/auth/database/negative security tests; update docs; stop for approval.

## Phase 4 — public catalog/redirects

- [ ] Connect published catalog/detail/search/filter/pagination to PostgreSQL.
- [ ] Implement fresh server-side redirect checks behind descriptive selectors, keeping internal IDs and stored targets private.
- [ ] Configure validated official Telegram link.
- [ ] Execute functional/responsive/accessibility/redirect/cache-isolation tests.
- [ ] Record reference regression evidence; stop for approval.

## Phase 5 — conditional metadata automation

- [ ] Confirm provider permission/licence, attribution, egress and server-only credential.
- [ ] Implement adapter/strict mapping/admin preview/import/jobs.
- [ ] Preserve editorial locks and unknown language/quality honesty.
- [ ] Add refresh/expiry/purge and approved scheduler authentication.
- [ ] Run mocks and actual permitted provider smoke tests; stop for approval.

## Phase 6 — hardening

- [ ] Execute Chromium/Firefox/WebKit and available real-device matrices.
- [ ] Complete keyboard/zoom/screen-reader/accessibility checks.
- [ ] Execute security/secret/dependency/header/cache tests.
- [ ] Measure 10k-catalog DB/API/browser/load budgets in staging.
- [ ] Perform backup/restore and recovery drills; resolve critical/high defects.
- [ ] Link actual evidence and obtain staging acceptance.

## Phase 7 — release

- [ ] Obtain explicit production-release approval.
- [ ] Configure production secrets/origins/proxy/HTTPS/MFA/backup/monitoring.
- [ ] Apply reviewed migrations and deploy the approved commit.
- [ ] Run actual production smoke/regression checks and safe-link review.
- [ ] Record rollback/recovery operations, known limitations and final handover.

Task completion means the work and required evidence exist. A checked documentation task is not a checked implementation/testing task.
