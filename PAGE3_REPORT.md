# AZmovies — Page 3 Handoff Report

**Status:** Static fixture prototype tested locally; owner approval pending. No active external destination, database, authentication or production admin. This report supersedes the earlier ID-based Page 3 implementation.

## 1. Journey and routes

```text
Homepage → movie detail → enabled quality/watch/provider choice
  → /go/{movieSlug}/{optionSlug}/  (safe intermediate page)
  → disabled Continue in prototype mode
  → Back to Movie Details or browser Back
```

| Route                           | Current behavior                                                                                                                                                               |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/movies/{slug}/`               | Displays local fixture details and descriptive option links; disabled options are native disabled buttons.                                                                     |
| `/go/{movieSlug}/{optionSlug}/` | Renders movie, selected quality, provider, a disabled Continue button and Back. Unknown selectors return 404; disabled fixtures show an unavailable state.                     |
| `/r/{movieSlug}/{optionSlug}/`  | Resolves the known selection on the server and denies while activation is off: 403 for enabled fixtures, 410 for disabled, 404 for unknown. No denial has a `Location` header. |
| `/admin/links/`                 | Isolated session-demo CRUD; not authenticated, persisted or connected to server mappings.                                                                                      |

No countdown, automatic redirect, external movie anchor, fake download button or popup was added. There is no Page 3 screenshot reference; the style is derived from the supplied detail-page tokens.

## 2. Privacy and destination policy

Public route selectors describe a movie and option; they are not internal link/database IDs. `src/lib/link-catalog.ts` provides public-safe labels. The 480 synthetic records and reserved-example destination URLs live in `src/lib/link-fixtures.ts`, which imports Next's `server-only` marker. Page 3 explicitly constructs a safe view model rather than passing the server record to a client component. The public fixture movie shape also no longer carries synthetic record IDs.

The server resolves a destination from the known selection, not a query parameter, header, cookie or request body. Policy rejects non-HTTPS URLs, host lookalikes, userinfo, nonstandard ports, control characters and ambiguous/traversing encoded paths. Responses from the route include `no-store`, `no-referrer`, `noindex` and `nosniff` headers.

External activation is independently blocked by the hard-coded false global switch and each record's `fixture-placeholder` authorization. Future activation would require explicit owner approval, individually authorized providers/URLs and a reviewed security implementation. No real redirect was exercised here.

## 3. Isolated manager decision

The owner chose to retain the existing manager as a session demo rather than expose actual server records. It lists safe fixture descriptions and supports add/edit/disable/enable/delete/reset within the tab. The test-destination input is validated against the example policy and discarded; it is not persisted as a destination. Demo edits do not alter any public page, server mapping or activation setting. The UI states these limitations explicitly.

The v2 demo does not read, migrate or delete the old v1 session key. An old tab can therefore retain historical v1 data until its session ends, but the new UI does not consume that data. The unauthenticated demo must not ship as a production admin; real authentication, persistence, authorization evidence and audit are future work.

## 4. Actual verification

- **52/52** Vitest unit/component tests passed. Independent expected mappings were checked for all **480** fixture options; the activation-on result is a pure unit simulation only.
- **36/36** Playwright Chromium tests passed, including homepage → detail → Page 3 → explicit/browser Back, all six first-movie quality options, disabled/unknown/legacy routes, query injection, session isolation and safe HTML/JS/navigation-RSC checks.
- Overlapping subsets: **3/3** axe-tagged tests and **19/19** responsive-tagged tests passed. Automated axe found no serious/critical violations in the covered home, drawer, detail, handoff and manager states; it is not a complete accessibility audit.
- `npm run build` passed with **532** generated static pages. `npm run verify:public-boundary` scanned **19** static assets and **2,660** generated HTML/RSC payloads for known synthetic fixture ID/target patterns and passed. An intentional client import of a `server-only` module was rejected by Next's compiler.
- Captures and width checks ran at **320, 360, 390, 768 and 1440 px**. At 360 px Page 3 has no document overflow, a 328×56 px disabled Continue control, no external anchors and no meta refresh. Results and images are under `.artifacts/phase2/`.

The signature scan is not a general-purpose secret scanner, and these sandbox checks do not establish production security or real-provider authorization. Firefox/WebKit, real devices and actual screen-reader testing were not run.

## 5. Preview and approval

The owner confirmed that the local preview is visible. A separate unauthenticated external request to the public preview still returned E2B 403 “Missing traffic access token.” The actual Arena iframe request and gateway logs cannot be observed here; no authenticated gateway fix or cause for the earlier grey frame is claimed (BUG-014).

Please review Page 3 and the isolated manager with the [final Phase 2 report](PHASE2_REPORT.md). Approve the complete Phase 2 prototype or request specific changes. The agent must stop before Phase 3 and must not push or activate external destinations without explicit approval.
