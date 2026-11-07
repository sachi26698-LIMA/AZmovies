# AZmovies — Task and Approval Queue

**Current gate:** Phase 1 foundation review. **Website implementation is paused pending explicit owner approval.**

## Phase 1 — foundation

- [x] Inspect repository, original README, branch, history and worktree.
- [x] Inspect runtime/package manager/Git/GitHub/database/browser capabilities.
- [x] Verify GitHub authentication and read-only repository access without exposing tokens.
- [x] Record actual terminal egress limitations separately from web research access.
- [x] Confirm no reference screenshots are available; do not invent a visual inspection.
- [x] Research stack/metadata/auth constraints and recommend a modular architecture.
- [x] Create the 14 new brain documents and expand the inspected README.
- [x] Define phased roadmap, schema/API/security contracts and UI/test/performance procedures.
- [x] Prepare `.gitignore`, safe `.env.example` and inspected-runtime `.nvmrc`.
- [x] Execute and record final foundation file/link/ignore/secret/diff checks.
- [ ] Create a focused local foundation commit after validation; report actual hash.
- [ ] Deliver Phase 1 report and stop for approval.

No application dependencies, pages, endpoints, migrations or app tests have been created. No GitHub push is planned without a separate request/approval.

## Immediate owner inputs

1. Approve or amend the stack and Phase 2 scope (Q-02).
2. Attach desktop/mobile references and clarify two-column desktop behavior (Q-01/Q-03).
3. Confirm authorized destination providers/evidence and content/quality/language vocabulary (Q-04/Q-08).
4. Confirm monetization/TMDB permission or choose another licensed provider (Q-05).
5. Select host/domain/PostgreSQL and an approved browser-test environment (Q-06).
6. Provide the official Telegram URL through appropriate configuration, not an invented channel (Q-07).
7. Confirm admin owner, MFA and recovery custody (Q-09).
8. Confirm catalog scale, import cadence and poster rights (Q-10).

Inputs 1/2 gate the proposed visual phase; the others gate their dependent phases and need not block nonvisual tooling setup if the owner explicitly scopes that exception.

## Phase 2 — awaiting approval

- [ ] Reinspect worktree/new references and record approved decisions.
- [ ] Scaffold Next.js/TypeScript with a reviewed lockfile and actual compatibility checks.
- [ ] Add strict format/lint/typecheck/component-test/build scripts.
- [ ] Establish reference-approved CSS tokens and owned/synthetic assets.
- [ ] Build fixture-only header/search/categories/two-column grid/sidebar/pagination/footer/Telegram treatment.
- [ ] Build fixture detail/loading/empty/error states without live external movie actions.
- [ ] Add component/accessibility tests and deterministic viewport captures.
- [ ] Resolve browser execution blocker and run scoped tests.
- [ ] Compare with actual references, record differences and obtain visual approval.
- [ ] Update context/architecture/UI/tests/changelog; stop at Phase 3 gate.

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
- [ ] Implement fresh opaque redirect checks and safe failure behavior.
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
