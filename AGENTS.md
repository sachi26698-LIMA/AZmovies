# AZmovies — Agent Operating Contract

## Current checkpoint

**Phase 2: static-fixture prototype merged in PR #1; post-merge owner review pending.** The homepage, movie detail, intermediate handoff and isolated session-demo manager are on `main`. Do not begin Phase 3, add a live backend or activate external destinations without explicit owner approval.

## Read before changing anything

1. `AI_CONTEXT.md`: verified state, decisions, blockers and outstanding questions.
2. `TASKS.md` and `PROJECT_PLAN.md`: the approved scope and next gate.
3. `UI_GUIDELINES.md`: reference limitations and the visual acceptance procedure.
4. The architecture, schema, API and security documents relevant to the change.
5. `TESTING_STRATEGY.md`, `TEST_CASES.md` and `BUG_TRACKER.md`: evidence and regression obligations.
6. Inspect `git status`, the actual files and recent history. Preserve user changes.

## Non-negotiable product boundaries

- Brand is **AZmovies**. The supplied MOVIES4U screenshots are a visual reference, not a source of copied code, logos or copyrighted poster assets.
- This is a movie discovery catalog and approved external-page redirect portal. Never host, stream, embed, distribute or link to unauthorized movie downloads, torrents, magnets or piracy pages.
- An external URL is not publishable merely because it is HTTPS. Require destination allowlisting, per-link authorization evidence and administrative approval. Public users must not receive internal link/database IDs or raw stored targets; the Phase 2 manager is an isolated demo that cannot change the server mapping.
- Preserve the compact dark header, search, categories, two-column poster grid, specified metadata, pagination, sidebar and footer. Keep the existing reference-derived detail poster strip; do not add unrelated heroes, carousels, ads or download buttons. Telegram remains inert until configured and approved.
- TMDB is a candidate, not an authorized dependency yet. Its current terms require review and potentially a written commercial agreement. Keep live integration disabled until the owner confirms permission. Manual catalog operation must not depend on TMDB.

## Scope and file discipline

- Work only on the Arena session's assigned branch; do not create, rename or switch branches.
- Wait for explicit owner approval at each implementation gate. Approval of the foundation is not production-release approval.
- Inspect before editing. Never overwrite working code blindly or remove functionality without permission.
- Keep changes small and cohesive. Do not refactor unrelated modules during a feature change.
- Keep route handlers thin; validation, authorization, data access, metadata mapping and redirect policy belong in separate server modules.
- Do not introduce a UI kit or a second state/database/auth framework without a recorded decision.
- Do not reset the checkout, rewrite history or modify the repository root/.git directory.

## Secrets and external services

- Never print or commit tokens, passwords, cookies, connection strings or recovery codes. Inspect environment variable **names**, not values, unless a specific nonsecret value is needed.
- Use server environment variables and the documented configuration validator. No credentials in `NEXT_PUBLIC_*`, source, fixtures, screenshots, logs or commit messages.
- Keep `.env.example` free of usable credentials. Real environment files are ignored.
- Do not claim a service works because its package exists. Record actual authentication, read, write and network checks separately.
- Sandbox terminal egress is restricted. The web research tools are separate; their success does not establish application-server access to TMDB or a browser-download host.
- Never bypass an egress restriction with an unapproved proxy or expose a credential to obtain connectivity.

## Required development loop

1. Confirm the task's gate and acceptance criteria.
2. Inspect existing behavior and write/update the relevant test cases.
3. Implement the smallest complete change.
4. Run formatting, lint, type checks and the applicable automated tests.
5. Exercise the actual HTTP/browser boundary for integrations; mocks alone do not prove deployment behavior.
6. Check desktop/mobile, keyboard navigation and authorization boundaries where relevant.
7. Record command, date, environment, result and artifact location in `TEST_CASES.md`. Record defects in `BUG_TRACKER.md`.
8. Update affected contracts and the changelog/tasks/context before reporting completion.

## Truthful reporting

Use **Not run**, **Blocked**, **Pass**, **Fail**, or **Not applicable** with a reason. A syntax check is not an authentication test. A Chromium test is not a Safari test. A mocked TMDB response is not a live API test. A successful GitHub read is not a successful push. Never convert a target budget or proposed command into an achieved result.

## Documentation maintenance

- `AI_CONTEXT.md`: update after every meaningful phase or decision.
- `PROJECT_PLAN.md` / `TASKS.md`: update scope, dependencies and gate status together.
- `ARCHITECTURE.md`, `DATABASE_SCHEMA.md`, `API_DOCUMENTATION.md`: update in the same change as behavior/contracts.
- `UI_GUIDELINES.md`: distinguish observed screenshot facts from provisional choices.
- `SECURITY.md` / `PERFORMANCE.md`: document actual controls, measurements and remaining limitations.
- `CHANGELOG.md`: record completed changes, not aspirational features.
- Keep all local documentation links valid. Avoid generic filler and invented measurements.

## Git and preview conventions

- Use focused, meaningful commits. Stage only inspected files. Run a secret review and `git diff --check` before committing.
- Push only the session branch, and only when requested/approved; never push directly to `main`.
- Future dev servers must bind to `0.0.0.0`, accept the assigned Arena preview origin, and use relative browser API URLs. Never make browser code call a sandbox-local backend through `localhost`.
- Add only the exact assigned preview origin to development trust configuration; do not use wildcard origins or disable authentication for previews.
- Keep dependencies, build output, reports, databases and uploads out of Git unless explicitly required.

## Definition of done

The scoped behavior exists, relevant tests have actually run, visual/security regressions are checked, no unresolved critical/high defect is concealed, documentation matches reality, and the owner receives an honest statement of what remains blocked. Stop at the next approval gate.
