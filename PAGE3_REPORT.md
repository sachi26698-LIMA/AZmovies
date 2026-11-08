# AZmovies — Page 3 Intermediate External Link Page Report

**Date:** 2026-11-08
**Branch:** `arena/9177d6f3-azmovies`
**Implementation commit:** `9ba92ac57f895c5798bc10ef49cda174bab9a056` (local only, not pushed)
**Status:** implemented and verified locally; **awaiting owner approval**. No GitHub push performed.
**Scope:** still the fixture-only prototype phase. No real external destination is activated.

## 1. Delivered journey

```text
Homepage  →  Movie Detail  →  selected quality/provider option
          →  /go/{linkId}/  (AZmovies intermediate page, Page 3)
          →  Continue      →  /r/{linkId}/  →  exact stored authorized URL
```

The last hop is **implemented but locked**. While owner approval is missing, `/r/{linkId}/`
returns a safe denial page with no `Location` header, and Continue explains why instead of
navigating. Nothing opens an external site in this prototype.

| Route           | Type                                                    | Purpose                                              |
| --------------- | ------------------------------------------------------- | ---------------------------------------------------- |
| `/go/{linkId}/` | SSG (480 fixture ids) + on-demand for session-added ids | Page 3 intermediate handoff screen                   |
| `/r/{linkId}/`  | Dynamic route handler                                   | Continue endpoint; fresh policy check, default deny  |
| `/admin/links/` | Static page + client fixture state                      | Prototype per-link manager (add/edit/disable/delete) |

## 2. Requirement-by-requirement result

| #   | Requirement                                                                            | Result                                                                                                                               |
| --- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Every quality/provider link has its own unique destination                             | 480 links (48 movies × 10 options); unique id **and** unique target URL per link, asserted in tests                                  |
| 2   | Clicking a quality option opens a separate AZmovies intermediate page                  | Detail option rows link to `/go/{linkId}/`; verified end-to-end                                                                      |
| 3   | Show selected movie title, quality and authorized provider name                        | All three shown, plus option label, link status, link reference and stored destination                                               |
| 4   | Prominent Continue button                                                              | Full-width 328×56 CSS px primary button at 360 px viewport                                                                           |
| 5   | Continue opens the exact original authorized URL stored for that link                  | `resolveContinue` returns the stored URL byte-for-byte; `/r/{linkId}` 303s to it when unlocked. Locked in the prototype (see §4)     |
| 6   | Back to Movie Details option                                                           | Present on every Page 3 state; returns to the exact source detail page                                                               |
| 7   | Admin can add, edit, disable and delete individual provider links                      | `/admin/links/` prototype manager; all four operations verified in browser tests                                                     |
| 8   | Each link independently configurable                                                   | Per-link label, quality, provider, destination and status; editing/disabling one never changes another (asserted)                    |
| 9   | Validate destination URLs; approved HTTPS only                                         | Shared `validateDestinationUrl` policy used by the admin form, Page 3 and `/r/`                                                      |
| 10  | Prevent open redirects; never accept redirect URLs from query parameters               | Only an opaque path id is read. `?url=`/`?target=` are ignored on both `/go/` and `/r/` (asserted)                                   |
| 11  | No automatic redirects, fake countdowns, misleading download buttons or forced pop-ups | User-initiated only; no timers, no `meta refresh` (asserted 0), no `window.open`, chevron affordance instead of a play/download icon |
| 12  | Design consistent with the supplied visual references                                  | Reuses the approved header/drawer/footer/Telegram shell and detail-page tokens                                                       |
| 13  | Fixture data; no real external destinations without owner approval                     | Reserved `*.example.com` fixture hosts; two independent locks keep Continue inert                                                    |
| 14  | Tests for destination mapping, invalid URLs, disabled links and navigation             | 52 Vitest + 30 Chromium tests, all passing (§5)                                                                                      |
| 15  | Update AI Brain docs, architecture, testing cases and task records                     | 14 documents updated (§7)                                                                                                            |

## 3. Destination policy (default deny)

`src/lib/link-policy.ts` is the single policy module. A destination is usable only when:

- it is a complete absolute URL, at most 2048 characters, with no control characters, spaces or backslashes;
- the scheme is exactly `https:`;
- there is no username/password and no non-default port;
- the hostname is an **exact** match on the approved allowlist — never a suffix, wildcard or subdomain match;
- the path contains no `.`/`..` segments and no `%2e`, `%2f`, `%5c` or `%25` escapes (checked on the raw path _before_ URL parsing, which would otherwise normalize them away).

`resolveContinue` then requires, in order: a known link, a safe opaque id, `status = enabled`,
a policy-valid destination, owner activation, and per-link `authorization = approved`.
Denials are specific and safe: `not-found`, `invalid-id`, `link-disabled`, `unsafe-destination`,
`activation-disabled`, `not-authorized`.

`/r/{linkId}/` responses: **404** unknown/invalid id, **410** disabled link, **403** unsafe
destination / activation disabled / not authorized, **303** only when every check passes.
All responses send `Cache-Control: no-store`, `Referrer-Policy: no-referrer`,
`X-Robots-Tag: noindex, nofollow` and `X-Content-Type-Options: nosniff`.

## 4. Why Continue is inert, and exactly what unlocks it

Two independent locks are shipped engaged:

1. `EXTERNAL_ACTIVATION_ENABLED = false` in `src/lib/redirect-config.ts` — a hard-coded constant,
   never read from a query parameter, header, cookie or client input.
2. Every fixture link carries `authorization: 'fixture-placeholder'`, so even if the global switch
   were flipped, fixture links would still be denied as `not-authorized`.

To go live later, the owner must supply the authorized provider URLs and the authorization basis
per link; those values replace the reserved example hosts, the allowlist is updated to the real
approved hosts, each link is marked approved with evidence, and the activation constant is changed
in a reviewed commit. Until then the exact stored URL is displayed as **plain text, not a link**, so
the mapping can be reviewed without any risk of navigation.

## 5. Executed verification (2026-11-08)

| Command                     | Result                             | Evidence                                                                                          |
| --------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------- |
| `npm run format:check`      | Pass                               | Prettier                                                                                          |
| `npm run typecheck`         | Pass                               | `tsc --noEmit`                                                                                    |
| `npm run lint`              | Pass                               | ESLint                                                                                            |
| `npm run verify:static`     | Pass                               | `.artifacts/phase2/static-boundary.json`; 34 source files; runtime deps only next/react/react-dom |
| `npm run test`              | **52 passed** (9 files)            | Vitest unit + component                                                                           |
| `npm run build`             | Pass                               | **532 static pages** (480 Page 3 + 48 detail + home + admin + not-found)                          |
| `npx playwright test`       | **30 passed**                      | `.artifacts/phase2/playwright-results.json`                                                       |
| `npm run capture:prototype` | Executed                           | Page 3 / admin / denial / disabled captures + metrics                                             |
| `npm audit --omit=dev`      | 0 reported runtime vulnerabilities | `.artifacts/phase2/npm-audit.json`                                                                |

Browser coverage added for Page 3: full homepage→detail→quality→Page 3→back journey; per-link
unique destination mapping across two providers and two movies; query-parameter injection ignored;
disabled and unknown link states; `/r/` denial statuses with no `Location` header; admin
add/edit/disable/delete reflected on the public page; admin rejecting a non-approved host; axe with
no serious/critical violations on Page 3 (enabled + disabled) and the link manager; responsive
320/768/1440 with no overflow and Continue reachable.

Measured Page 3 metrics at 360 CSS px / DPR 3: `scrollWidth` 360 (no overflow), Continue 328×56,
`aria-disabled = true`, external anchors **0**, `meta refresh` **0**, stored destination
`https://alpha.example.com/watch/aranya-rise-of-a-legend-1/q-480`. Link manager: 10 independently
configurable links for the selected movie, one `h1`, `scrollWidth` 360.

### Preserved approved pages

Homepage geometry is unchanged (first poster row still `y = 552.5`, two 147 px columns, 26 px gap).
Detail-page layout, typography and colors are unchanged; the only behavioural change is that an
enabled quality/watch/provider row now opens its own Page 3 instead of being a dead placeholder.
All 19 pre-existing homepage/detail browser tests still pass.

## 6. Screenshots for review

| File                                                                            | State                           |
| ------------------------------------------------------------------------------- | ------------------------------- |
| `.artifacts/phase2/prototype-360-link-top.png`                                  | Page 3 above the fold           |
| `.artifacts/phase2/prototype-360-link-full.png`                                 | Page 3 full page                |
| `.artifacts/phase2/prototype-360-link-continue-denied.png`                      | Continue clicked while locked   |
| `.artifacts/phase2/prototype-360-link-disabled.png`                             | Disabled-link state             |
| `.artifacts/phase2/prototype-360-admin-links.png`                               | Link manager, full page (DPR 1) |
| `.artifacts/phase2/prototype-360-admin-links-top.png`                           | Link manager above the fold     |
| `.artifacts/phase2/prototype-768-link-full.png`, `prototype-1440-link-full.png` | Tablet/desktop Page 3           |

## 7. Documents updated

`PAGE3_REPORT.md` (this file), `AI_CONTEXT.md`, `ARCHITECTURE.md`, `API_DOCUMENTATION.md`,
`DATABASE_SCHEMA.md`, `SECURITY.md`, `UI_GUIDELINES.md`, `TASKS.md`, `TEST_CASES.md`,
`TESTING_STRATEGY.md`, `CHANGELOG.md`, `BUG_TRACKER.md`, `README.md`, `PHASE2_REPORT.md`.

## 8. Deviations and limitations to accept or amend

1. **No Page 3 reference screenshot exists.** None of the 15 supplied captures shows an intermediate
   handoff page, so its styling is derived from the approved detail-page tokens (black background,
   `#141414` panels, `#0084eb` labels/links, `#ff6b6b` warnings, shared header/footer). Please confirm
   this direction or supply a reference.
2. **Continue is inert and destinations are reserved example hosts.** Required by the "no real
   destinations without approval" rule; the live mechanism is implemented and unit-tested.
3. **The link manager is a prototype, not the real admin.** It has no authentication, no server
   write, no database and no audit history. Overrides live in `sessionStorage`
   (`azmovies.prototype.links.v1`) and vanish with the tab session. It is reachable at a public URL
   and is `noindex`; it must not be exposed in production as-is. Real CRUD, authorization and
   persistence remain Phase 3 work.
4. **Provider names are fixtures** ("Fixture Provider Alpha/Beta"), not real provider claims.
5. **`trailingSlash: true`** was enabled so the already-used `/…/` hrefs are canonical and `/r/{id}/`
   answers directly instead of issuing a 308 first. No visual change.
6. **One disabled link per movie** is seeded intentionally so the disabled state is demonstrable on
   every detail page; it is never the first option.

## 9. Not run / out of scope

Real external redirection against a live authorized provider, PostgreSQL persistence, authenticated
admin, authorization evidence workflow, audit logging, click counting, Firefox/WebKit, real devices,
screen-reader smoke and Lighthouse/Core Web Vitals are **not run** and remain later-phase work.

## 10. Approval request

Review the live preview (`/go/lnk-0001/`, `/go/lnk-0002/` disabled, `/admin/links/`) and the captures
in §6. Then either approve Page 3 as-is, request specific changes, or supply the authorized provider
URLs and approval basis so the Continue handoff can be activated in a later reviewed change.
Work stops here until that decision; nothing has been pushed to GitHub.
