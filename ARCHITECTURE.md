# AZmovies — Proposed Architecture

**Status:** Phase 1 design, awaiting approval. Paths/modules/contracts below are planned; no application code or infrastructure has been created.

## 1. Architecture goals

1. Reproduce the supplied compact catalog layout without a generic template.
2. Keep public reads fast and indexable while all editorial writes remain private.
3. Make manual catalog operation independent of third-party metadata availability/licensing.
4. Treat outbound authorization as a server-enforced domain policy, not a UI convention.
5. Keep schema, validation and security decisions inspectable and testable.

## 2. Stack recommendation and reasons

| Layer | Proposed baseline | Why this fits AZmovies |
| --- | --- | --- |
| Runtime/package management | Node 22.22.3; npm 10.9.8; committed `package-lock.json` in Phase 2 | Already available; avoids introducing another package manager; Next 16.4.5 advertises Node >=20.9.0 |
| Web application | Next.js 16.4.5 App Router + React 19.3.1 | SSR for catalog/details, file-based routes, server/client separation and one deployment for site/admin/API |
| Language | Strict TypeScript 5.9.3 initially | Shared DTO validation/types; conservative toolchain choice while TS 7 support is verified |
| Styling | Global CSS reset/tokens + component CSS Modules | Exact control of the dark reference; no UI-kit visual language or utility-framework requirement |
| Database | PostgreSQL, exact hosted major pinned after provider selection | Relational taxonomy, approval records, transactions, constraints and predictable pagination |
| Data access | Drizzle ORM 0.45.4 / Drizzle Kit 0.31.11 / Postgres.js 4.1.0 candidates | Typed queries and reviewable SQL migrations without a separate backend service |
| Authentication | Better Auth 1.7.18, email/password + database sessions + two-factor plugin | Maintained credential/session primitives; closed signup and server-owned admin role; no custom crypto |
| Validation | Zod 4.6.7 candidate | Validate env, query/body DTOs and provider responses at trust boundaries |
| Images | Next Image + provider-permitted image CDN; Sharp where local optimization is needed | Responsive poster formats/sizes, reserved dimensions and controlled remote sources |
| Component/unit/API logic | Vitest 5.1.0, Vite 8.3.6, React plugin 6.2.1, Testing Library, jsdom | Fast isolated tests; compatible engine/peer metadata observed, installation not yet tested |
| Browser/accessibility | Playwright 1.65.0 + axe Playwright 4.14.0 candidates | Real functional, viewport, keyboard and browser-engine checks |
| Quality | ESLint 9.39.4 with Next rules, Prettier 3.9.10, strict `tsc` | Stable lint baseline satisfying Next's >=9 peer requirement; formatting/type gates |
| Performance | Lighthouse CI plus HTTP/database timings | Separate lab browser metrics from server/database evidence |

Versions were read from npm metadata on 2026-11-07, not installed or integration-tested. Phase 2 must resolve a single compatible lockfile, audit it and record the actual chosen versions. Do not blindly upgrade everything or mix the listed candidates with incompatible plugins.

## 3. Alternatives considered

- **Vite SPA + Express:** viable, but requires separate SSR/SEO and API deployment work for a relatively small editorial catalog.
- **Astro content site:** efficient reads, but the authenticated CRUD/import workflows would add a second interactive application boundary.
- **WordPress/theme:** fast editorial setup, but reference fidelity, custom redirect authorization and a tightly tested TypeScript codebase are harder to keep controlled.
- **Tailwind/shadcn/MUI:** useful in other products; rejected here because the brief prioritizes matching a specific existing layout, not adopting a recognizable component theme.
- **SQLite:** attractive locally, but switching dialects would weaken PostgreSQL constraint/query/auth integration evidence. Use real PostgreSQL in integration/staging instead.
- **Handwritten auth:** rejected in favor of a maintained auth library and explicit application authorization policy.
- **Prisma:** viable; Drizzle is preferred for lightweight SQL-visible queries and migration review. This is a project choice, not a claim that Prisma is inadequate.

## 4. System boundaries

```text
Visitor browser
  -> Next.js public pages / public read API
  -> catalog query service -> PostgreSQL (published records only)
  -> /r/{linkId} -> fresh redirect policy/approval check -> authorized HTTPS page

Admin browser
  -> private admin pages / admin API
  -> server session + admin authorization + origin/CSRF checks
  -> editorial service -> transaction + audit -> PostgreSQL
  -> optional metadata job service -> provider adapter -> permitted metadata API

Public rendering never calls the metadata API or reads admin secrets.
```

### Proposed module tree (not created)

```text
src/
  app/
    (public)/                 # home, categories, search, movie details
    admin/                    # private editorial pages
    api/movies/               # published catalog read contracts
    api/categories/           # active navigation taxonomy
    api/languages/            # supported navigation languages
    api/health/               # minimal liveness/readiness
    api/auth/[...all]/        # Better Auth handler, restricted configuration
    api/admin/                # protected write/read endpoints
    api/internal/             # scheduler endpoint only if approved
    r/[linkId]/               # validated external redirect
  proxy.ts                    # optimistic navigation checks, not sole authorization
  components/
    layout/                   # header, category strip, sidebar, footer, Telegram
    movies/                   # poster card, grid, metadata, pagination
    admin/                    # forms, review controls, status feedback
  server/
    auth/                     # Better Auth config, session/admin guards, bootstrap
    catalog/                  # queries, filters, lifecycle, taxonomy
    redirects/                # URL normalization, destination policy, approval checks
    metadata/                 # provider interface, DTO mapping, jobs, refresh/purge
    audit/                    # redacted append-only audit writer
    config/                   # validated server environment
    db/                       # client, schema, migrations, transaction helpers
  lib/                        # pure shared formatting/validation; no server secrets
  styles/                     # tokens/reset and scoped component styling
public/                       # owned brand/static assets only; no bulk movie media
 tests/
  unit/ component/ integration/ e2e/ accessibility/ performance/
 docs/references/              # owner-supplied screenshots when available
```

Exact endpoint behavior and enabled auth paths are owned by `API_DOCUMENTATION.md`.

## 5. Rendering and client state

- Public catalog/detail pages render on the server from local published records. Metadata availability does not control page rendering.
- Search is a GET form with URL parameters; filters/pagination are shareable and usable without client-side routing.
- Client components are limited to search debounce/enhancement, category overflow/navigation, admin forms and necessary feedback.
- No global client store is planned. URL state, server data and local form state cover the requirements.
- Draft/archived movies return no public data. Admin pages and responses use `private, no-store`.
- Public HTML/API caching may use a short shared TTL (initial proposal 60 seconds) only where the host supports it; publication/archive/link revocation invalidates affected tags. Redirect authorization itself is never served from a stale cached decision.
- Skeletons preserve final geometry; errors never expose SQL, credentials or provider response bodies.

## 6. Authentication and authorization

- Better Auth handles password hashing and database-backed sessions. Its documented default is Node-native scrypt; inspect/tune the pinned implementation rather than inventing an alternate hash format.
- `disableSignUp` closes public registration. Bootstrap is a local/server-only command using owner-supplied secrets, not an HTTP setup endpoint.
- Application role is server-owned (`input: false`), default non-admin; bootstrap explicitly grants the initial admin role.
- Every admin page, mutation and private read validates the session and admin role at the server/data boundary. Cookie-presence checks in `proxy.ts` only improve navigation.
- Initial policy: one admin, 8-hour absolute session, no sliding refresh or cookie session cache, revocation on password reset and other-session revocation on password change.
- TOTP MFA is required before production editorial access. Recovery codes are owner-held; no insecure email reset is enabled without a verified mail/recovery design.
- Use exact trusted origins, secure HTTP-only cookies and persistent/database-backed rate limits. Proxy IP headers are trusted only according to the actual deployment topology.

See `SECURITY.md` for threat controls and mandatory negative tests.

## 7. Catalog and taxonomy rules

- Movies begin as drafts; publication validates required metadata and approved links where applicable.
- Editorial collections such as Bollywood are explicit assignments, not guessed from language.
- Original/spoken languages and displayed language editions are distinct. “Hindi dubbed” requires editorial evidence.
- Quality is optional editorial metadata, not a download/file claim. TMDB must not be treated as a source of BluRay/WEB-DL quality.
- Search is bounded and parameterized; initial target is 10,000 records, 24 items/page, stable release/publish ordering.
- Archive instead of destructive deletion is the default. Audit records survive editorial changes.

## 8. Metadata integration boundary

Planned interface responsibilities: search by title/provider ID, fetch details, normalize to an AZmovies draft DTO, refresh existing provider-linked records, and purge expired provider content. The provider adapter is replaceable; the catalog schema is not a raw API response dump.

**TMDB is conditional.** Current terms require attribution, limit caching to six months, and require a commercial agreement for covered traffic/revenue-generating destination sites. [1](https://www.themoviedb.org/api-terms-of-use) The owner must confirm the appropriate permission before live use. FAQ branding guidance is available separately. [1](https://developer.themoviedb.org/docs/faq)

- Keep credentials server-only; fix the provider base URL in code rather than accepting an arbitrary URL alongside the token.
- Public requests read the database, not TMDB. Admin preview/import and scheduled jobs are the only live-call paths.
- Proposed timeout: 5 seconds; at most one retry for transient 429/5xx with jitter and respect for `Retry-After`; no retry on permission/validation errors.
- Store source ID, sync/expiry times and editorial field locks. Imports never overwrite locked fields or approve external links.
- Scheduled refresh is host-dependent and authenticated; no secret-bearing client scheduler.
- Use rights-cleared synthetic fixtures in tests. Do not commit live TMDB payloads/posters as a workaround for missing permission/egress.
- If permission or connectivity is absent, mark live integration blocked; manual CRUD remains fully supported.

## 9. External redirect architecture

1. Admin registers an exact HTTPS destination host and optional path-prefix boundary.
2. Admin attaches a movie link with authorization evidence and requests approval.
3. A separate approval action records approver/time; imported or newly entered links are pending by default.
4. Public UI exposes only an opaque `/r/{linkId}` URL for a published movie.
5. At click time, recheck movie status, link approval/expiry/revocation and active destination policy; reject credentials, non-HTTPS schemes, unexpected ports/hosts and malformed paths.
6. Return a fresh 303 response with `Cache-Control: no-store` and a restrictive referrer policy. Never accept a caller-supplied target URL.
7. Revocation takes effect without waiting for page-cache expiry. Availability checks do not auto-authorize a changed destination.

A domain being legitimate does not authorize every page on it. Per-link evidence remains necessary. No file-download, torrent, magnet, embedded player or shortener destination is allowed.

## 10. Configuration, deployment and operations

- Validate configuration at server startup. `BETTER_AUTH_URL` is the canonical origin; extra trusted origins are explicit, including the exact assigned Arena preview origin in development.
- Browser API requests use relative paths. Dev server binds to `0.0.0.0`; production uses HTTPS and the selected host's documented proxy trust rules.
- Start with one Node deployment and managed PostgreSQL. No Redis, message queue, microservices or object-storage service is required until measured demand justifies one.
- Phase 2 preview is fixture-only. Database-backed previews require an approved reachable database and separately scoped credentials.
- Hosting/database/domain are unresolved. Scheduler, image CDN access, connection pooling, backup retention and CI browser downloads must be verified on the chosen host.
- Apply reviewed migrations before serving new code; use expand/contract changes and backups for destructive migrations. Never run development reset/seed commands in production.
- Log request IDs, route/status/duration and sanitized job/error codes. Never log passwords, cookies, tokens, full connection strings or authorization evidence containing private information.
- Monitor uptime, 5xx rate, DB latency, admin login failures, redirect denials, import failures and stale content. Define alert recipient/retention with the owner before release.

## 11. Architecture acceptance

No framework choice is considered validated until Phase 2 installs/builds it. No auth/data design is considered validated until real PostgreSQL/HTTP tests run. No external integration is considered permitted or reachable until the respective evidence exists. Architecture changes must update the schema/API/security/tests documents together.
