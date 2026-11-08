# AZmovies — Planned API Contract

**Status:** the catalog/auth/admin API contracts below are planned, not implemented. Phase 2 does implement a locked fixture handoff route and intermediate page, documented in §3. Static-boundary testing verified `/api/movies` returns 404; no external movie link is active. Examples are synthetic, not live provider data.

## 1. General conventions

- Same-origin Next.js Route Handlers; browser code uses relative URLs.
- JSON UTF-8; timestamps ISO 8601 UTC; public selectors are descriptive lowercase slugs. Internal link/database IDs, targets and authorization evidence stay server-side.
- Validate query/body/params with shared Zod schemas. Unknown write fields are rejected, not silently elevated into privileges.
- Public reads expose published movies and approved public link actions only. Authorization evidence, target URLs, user records, provider credentials and job internals stay private.
- Admin endpoints validate a live session, admin role, origin/CSRF and request size on the server. Proxy cookie checks are not sufficient.
- Limit JSON bodies initially to 64 KiB; no upload endpoint is planned. Limit search to 80 characters and page size to 50.
- Error envelope:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Review the highlighted fields.",
    "fields": { "release_year": "Enter a valid release year." },
    "requestId": "synthetic-request-id"
  }
}
```

Do not return stack traces, SQL, provider bodies, password validity details or secrets. Use 400 malformed input, 401 no session, 403 insufficient permission/origin failure, 404 unavailable resource, 409 stale version/duplicate, 413 oversized body, 422 invalid state, 429 rate limit, 502/504 sanitized upstream failure, 503 unavailable dependency.

## 2. Public catalog

### `GET /api/movies`

Query parameters:

| Name     | Contract                                                                                            |
| -------- | --------------------------------------------------------------------------------------------------- |
| q        | Optional trimmed title search, max 80 chars                                                         |
| category | Optional active category slug                                                                       |
| language | Optional supported language code; verified display language unless owner approves another semantics |
| year     | Optional integer within agreed release-year range                                                   |
| quality  | Optional allowlisted quality label                                                                  |
| sort     | `recent` default, `title`, `year_desc`; fixed server mapping                                        |
| page     | Positive integer, default 1; bounded after catalog-size review                                      |
| pageSize | Default 24, max 50; reference may change default before approval                                    |

Filters combine with AND. Empty/missing optional values are equivalent. Invalid values return a validation error rather than an unbounded query. Stable recent order is `published_at DESC, id DESC`; other sorts include an ID tie-breaker.

Synthetic response:

```json
{
  "data": [
    {
      "slug": "sample-film",
      "title": "Sample Film",
      "releaseYear": 2024,
      "languageLabels": ["English"],
      "qualityLabel": null,
      "poster": null,
      "categories": ["fictional-collection"]
    }
  ],
  "pagination": { "page": 1, "pageSize": 24, "totalItems": 1, "totalPages": 1 },
  "filters": {
    "q": null,
    "category": null,
    "language": null,
    "year": null,
    "quality": null,
    "sort": "recent"
  }
}
```

Out-of-range pages return an empty data array with truthful pagination, or a documented 404 UI treatment; choose one behavior in Phase 4 and test it. No draft count or private metadata leaks through totals.

### `GET /api/movies/{slug}`

Returns a published movie's factual metadata, poster information and approved external-action descriptors. Draft/archived/missing slugs all return the same public 404 shape. A future authorized action exposes descriptive movie/option paths, provider label and territory/expiry caveats, never internal link/database IDs, evidence or raw destination details.

### `GET /api/categories` and `GET /api/languages`

Return active navigation entries with slug/code, label and order. Do not expose empty private taxonomies. Category membership is editorial; language navigation does not imply a regional film industry.

### `GET /api/health/live` and `GET /api/health/ready`

Liveness returns only process status. Readiness checks required local dependencies and returns a minimal `ok`/`degraded` state; optional metadata provider outage must not mark manual catalog operation unavailable. Do not expose DSNs, hostnames, versions or exception details. Restrict readiness at the host if deployment requires it.

## 3. External redirect

### `GET /r/{movieSlug}/{optionSlug}/` (future activation contract)

Not a JSON API and not an arbitrary redirect parameter.

- Resolve known descriptive selectors; load the internal movie/link/destination in one consistent server-side policy check.
- Require published movie, approved unexpired link, active exact destination and safe canonical HTTPS target.
- Success: 303 to stored target, `Cache-Control: no-store`, restrictive referrer policy; aggregate anonymous count if implemented.
- Missing/revoked/unapproved/expired/unsafe links: safe 404 or 410 page without leaking private target/evidence. Choose stable semantics during Phase 4.
- Never redirect to a query/header/body-supplied URL. Never proxy movie content or downloads.
- A change to the target invalidates approval. A destination availability check cannot silently reauthorize it.

The UI may open this route in a new tab with `noopener noreferrer` and an accessible indication. Telegram is a separately validated owner-configured HTTPS link, not a movie redirect record.

### Implemented prototype behaviour (final Phase 2)

`GET /go/{movieSlug}/{optionSlug}/` renders only movie title, selected quality, provider and Continue state. The Continue button is natively disabled. Invalid selections return 404; disabled selections show an unavailable message. No internal link/database ID or stored destination is serialized to the public page. Query-supplied destinations are ignored.

`GET /r/{movieSlug}/{optionSlug}/` resolves a known selection server-side and is locked:

| Condition                                 | Status                                                  | Location header           |
| ----------------------------------------- | ------------------------------------------------------- | ------------------------- |
| Unknown selector                          | 404                                                     | none                      |
| Disabled fixture                          | 410                                                     | none                      |
| Unsafe destination or activation disabled | 403                                                     | none                      |
| All future approval gates pass            | 303 in policy design only; unreachable in the prototype | approved stored HTTPS URL |

Responses send `Cache-Control: no-store, max-age=0`, `Referrer-Policy: no-referrer`, `X-Robots-Tag: noindex, nofollow` and `X-Content-Type-Options: nosniff`. Query parameters, headers, cookies and bodies are never read as a destination.

`/admin/links/` is an **isolated unauthenticated session demo**, not an admin API or persisted editor. Its test URL is validated and discarded; changes never alter public pages or server records. The private admin contracts in §5 remain unimplemented.

## 4. Authentication endpoints

Mounted by Better Auth under `/api/auth/*`; exact enabled paths are generated from the pinned configuration. Do not create a parallel custom login/session API.

| Endpoint                                            | Planned policy                                                                                   |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `POST /api/auth/sign-in/email`                      | Email/password; generic failure; persistent rate limit; MFA challenge when enrolled/required     |
| Better Auth two-factor challenge/verification paths | Required for enrolled admin; exact library contract recorded after installation; no bypass route |
| `POST /api/auth/sign-out`                           | Revoke current session and clear cookie                                                          |
| `GET /api/auth/get-session`                         | Minimal current session; no credential fields; private/no-store                                  |
| `POST /api/auth/change-password`                    | Authenticated, fresh-session requirements, current password, revoke other sessions               |
| `POST /api/auth/sign-up/email`                      | Disabled; must not create a user regardless of supplied role                                     |
| Social login/public reset/verification routes       | Not enabled without an approved provider/recovery design                                         |

Admin bootstrap and emergency recovery are controlled server commands, not public endpoints. Password policy proposed: 12–128 characters, no composition theater, library-managed slow hash. Session proposed: 8-hour absolute expiry, no remember-me extension, secure HTTP-only cookie. Library endpoints and cookie/CSRF behavior require actual HTTP tests.

## 5. Private admin contracts

All routes below require admin authorization and write-origin protection. Lists are bounded/paginated; no unlimited export.

| Method/path                             | Purpose                                           | Important rules                                                                            |
| --------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `GET /api/admin/movies`                 | Search draft/published/archived editorial records | Explicit status filter; private no-store                                                   |
| `POST /api/admin/movies`                | Create manual draft                               | Server sets creator/status/version; no supplied approval/role fields                       |
| `GET /api/admin/movies/{id}`            | Editorial detail                                  | Include provenance/locks; exclude unrelated auth secrets                                   |
| `PATCH /api/admin/movies/{id}`          | Edit metadata/taxonomy                            | `If-Match` version required; 428 if absent, 409 if stale; cannot approve links implicitly  |
| `POST /api/admin/movies/{id}/publish`   | Publish valid draft                               | Transactionally validate required fields; set server publish time; invalidate public cache |
| `POST /api/admin/movies/{id}/archive`   | Remove from public catalog                        | Preserve record/audit; immediate public-cache invalidation                                 |
| `GET/POST /api/admin/categories`        | List/create taxonomy                              | Unique slug; audited changes                                                               |
| `PATCH /api/admin/categories/{id}`      | Rename/reorder/deactivate                         | No destructive deletion of referenced history by default                                   |
| `GET/POST /api/admin/languages`         | Manage supported display vocabulary               | Valid codes/labels; no inferred dubbing                                                    |
| `GET/POST /api/admin/destinations`      | Review exact outbound destination policy          | Evidence required; inactive on creation                                                    |
| `PATCH /api/admin/destinations/{id}`    | Edit/activate/deactivate policy                   | Versioned audited action; deactivation affects clicks immediately                          |
| `GET/POST /api/admin/movies/{id}/links` | List/submit external-page link                    | New links pending; canonical target must match destination policy                          |
| `PATCH /api/admin/links/{id}`           | Edit link metadata/target                         | Material target change clears approval and returns to pending                              |
| `POST /api/admin/links/{id}/approve`    | Approve submitted link                            | Evidence, exact policy and fresh admin session required; record approver/time              |
| `POST /api/admin/links/{id}/revoke`     | Revoke link                                       | Immediate denial; reason/audit required                                                    |
| `GET /api/admin/audit-logs`             | Bounded security/editorial history                | Redacted fields only; admin-only                                                           |

Movie create/edit DTO includes title, optional original title/synopsis/release date/year, language/category assignments, optional quality/poster fields and editorial locks. Server-owned fields (creator, status, publication time, provider sync time, approval) cannot be mass-assigned.

Synthetic create request:

```json
{
  "title": "Sample Film",
  "releaseYear": 2024,
  "originalLanguageCode": "en",
  "displayLanguageCodes": ["en"],
  "categoryIds": [],
  "qualityLabel": null,
  "synopsis": "Synthetic fixture used to demonstrate the contract."
}
```

A create returns 201 with the draft DTO and version/ETag. A stale update must not overwrite a newer edit. Archive/publish/approve actions return the new representation or a documented action result, never a false success after a failed transaction.

## 6. Metadata endpoints (conditional phase)

These routes remain disabled until provider permission and credentials are confirmed.

| Method/path                           | Purpose                                                                                              |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `POST /api/admin/metadata/preview`    | Validated provider ID/title query; normalized temporary result, no persistence                       |
| `POST /api/admin/metadata/import`     | Create/idempotently reuse import job; imported movie is draft                                        |
| `POST /api/admin/movies/{id}/refresh` | Queue refresh respecting editorial locks                                                             |
| `GET /api/admin/import-jobs`          | Paginated job status                                                                                 |
| `GET /api/admin/import-jobs/{id}`     | Sanitized job result/error code                                                                      |
| `POST /api/internal/metadata/refresh` | Optional host-scheduler endpoint, authenticated with a dedicated server secret; not browser-callable |

Provider selection is fixed by server configuration, not an arbitrary base URL/token supplied by the client. Bound query length/result count/job concurrency. Use 202 for accepted jobs. Duplicate active requests return the existing job where appropriate. Provider failures never auto-publish, alter locks or authorize redirects.

If TMDB is approved, use its permitted API and attribution rules; no live response examples are committed before permission. The current terms are a release dependency, not a footnote. [1](https://www.themoviedb.org/api-terms-of-use)

## 7. Caching, concurrency and abuse controls

- Admin/auth/job/audit responses: `Cache-Control: private, no-store`.
- Public catalog reads: only published DTOs; proposed shared `s-maxage=60, stale-while-revalidate=300` when the host supports correct invalidation. Search may remain uncached.
- Use tag/path invalidation on publish/archive/edit and fresh redirect checks on every click.
- Movie/link/category edits use optimistic versions; imports use idempotency/duplicate-active constraints.
- Initial admin write limit proposal: 60/minute per authenticated admin plus host-level IP protection; login policy uses stricter persistent limits and progressive delay. Tune from actual tests, not assumed traffic.
- Return `Retry-After` on controlled 429 responses where appropriate. Do not trust arbitrary client forwarding headers.
- Request size, timeout, pagination and upstream retry bounds are mandatory.

## 8. Contract validation obligations

Phase 1 status is **Not run** for every endpoint. Later tests must cover actual status codes/headers/cookies, DTO stripping, invalid inputs, role/session boundaries, CSRF/origin, stale versions, transaction failure, cache isolation, safe redirects and provider outage behavior. Update this document with the exact enabled Better Auth paths and any approved contract changes before reporting completion.
