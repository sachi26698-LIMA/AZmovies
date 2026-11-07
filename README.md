# AZmovies

A professionally crafted movie discovery catalog and **authorized external-page redirect portal**, with a private editorial admin.

> **Project status: Phase 1 — foundation only.** Documentation and repository preparation are complete; no website, API implementation, database migration or application test suite exists yet. Website implementation awaits owner approval. The referenced screenshots were not available in the checkout, so no screenshot match is claimed.

## Product boundaries

AZmovies is not a hosting, streaming or download service. It must never distribute or link to unauthorized copyrighted movie downloads. External movie links require explicit authorization and validation. The brand is AZmovies; MOVIES4U is a visual reference only.

Planned public interface:

- Compact dark header and branding, search and horizontal category navigation.
- Two-column movie poster grid with title, release year, language and quality.
- Pagination, sidebar navigation, footer and an owner-configured floating Telegram link.
- Movie detail pages, category/language filtering and responsive layouts.

Planned private interface:

- Secure admin login with closed registration and MFA.
- Manual movie/category management and draft/review/publish workflow.
- Authorized destination/link review.
- Optional permitted metadata import and refresh, independent of manual operation.

## Recommended foundation

Next.js App Router, React and strict TypeScript; hand-authored CSS Modules; PostgreSQL with Drizzle; Better Auth; Vitest/Testing Library and Playwright/axe/Lighthouse. See [ARCHITECTURE.md](ARCHITECTURE.md) for boundaries and tradeoffs. These are proposed choices, not installed dependencies.

**Metadata permission is unresolved.** TMDB is a candidate only. Its current terms can require a written commercial agreement for a traffic-driving discovery site. Live integration stays disabled until the owner confirms appropriate permission. Manual catalog functionality is the fallback.

## Verified development environment

Inspected on 2026-11-07: Node 22.22.3, npm 10.9.8, Git 2.39.5 and GitHub CLI 2.23.0. GitHub authentication and a read-only repository API request succeeded. No push is claimed. PostgreSQL/Docker and browser executables were not installed. Application-server probes to TMDB and the Playwright browser CDN failed; browser/live-provider testing is not yet verified.

The repository started with only a short README. There is no runnable app or installation command yet. Commands listed in the testing/architecture documents are **planned scripts**, not currently available functionality.

## Project brain

| Document | Purpose |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Agent rules, scope gates and truthful reporting contract |
| [AI_CONTEXT.md](AI_CONTEXT.md) | Verified project memory, decisions and unresolved inputs |
| [PROJECT_PLAN.md](PROJECT_PLAN.md) | Seven-phase roadmap, dependencies and acceptance gates |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Proposed stack, modules, request/data flows and deployment |
| [UI_GUIDELINES.md](UI_GUIDELINES.md) | Reference inventory, provisional tokens and visual matching |
| [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) | Proposed relational model, constraints and migration policy |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | Planned HTTP contracts; nothing implemented yet |
| [SECURITY.md](SECURITY.md) | Auth, authorization, redirect, secret and content safeguards |
| [TESTING_STRATEGY.md](TESTING_STRATEGY.md) | Required layers, environments and evidence rules |
| [TEST_CASES.md](TEST_CASES.md) | Traceable cases and actual execution status |
| [BUG_TRACKER.md](BUG_TRACKER.md) | Defects and foundation blockers, not invented application bugs |
| [PERFORMANCE.md](PERFORMANCE.md) | Budgets, image strategy and measurement procedure |
| [CHANGELOG.md](CHANGELOG.md) | Completed, dated project changes |
| [TASKS.md](TASKS.md) | Phase checklist and immediate approval queue |
| README.md | Entry point and current status |

## Repository preparation

- `.gitignore` excludes secrets, dependencies, builds, test artifacts and local data.
- `.env.example` names future configuration without usable credentials.
- `.nvmrc` records the inspected Node runtime for later setup.
- Work belongs on `arena/9177d6f3-azmovies`; do not push directly to `main`.
- The GitHub repository is public. Do not add real environment files, movie media, database dumps or credentials. A reuse licence has not been selected by the owner.

## Next action

Owner review is requested for the stack, missing screenshots, two-column behavior, authorized destinations, metadata permission, admin recovery and hosting/database choices. After explicit Phase 2 approval, initialize tooling and build the reference-matched visual shell with fixtures and tests. Do not begin that work merely because this README exists.
