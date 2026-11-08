# AZmovies — Security and Content Authorization

**Phase 2 status:** static fixture prototype only. `npm run verify:static` passed; no API/database/auth/external redirect is implemented; Telegram/app/footer controls are inert; pages are marked noindex. Runtime `npm audit --omit=dev` reported 0 vulnerabilities at execution time. Production headers, auth, CSRF, redirect policy and secret-scanning gates below remain future requirements, not completed production claims.

**Status:** required design controls, not implemented or audited. No production security claim is made in Phase 1. The GitHub repository is public; protect credentials and private content accordingly.

## 1. Assets and trust boundaries

Protect admin credentials/sessions/MFA secrets, database access, metadata credentials, editorial/audit data, authorized-link evidence, site availability and visitors following outbound links. Trust boundaries are browser→HTTP handler, handler→database, admin→metadata provider, visitor→external destination, GitHub→deployment and proxy→application.

The application is an information/redirect portal. It must not become a file host, streaming proxy, piracy index or arbitrary URL forwarder.

## 2. Admin authentication and authorization

- Use the pinned Better Auth library for password hashing, credential verification and database sessions. Its documented default is Node-native scrypt; inspect the actual parameters/implementation during Phase 3 and benchmark within the 2-CPU environment. Do not invent a homegrown hash/session format.
- Public sign-up disabled in auth configuration and verified by HTTP tests. No internet-accessible “first user becomes admin” setup route.
- Initial admin is provisioned by an owner-controlled server command. Role is server-owned, cannot be supplied by signup/profile/movie input, and defaults to non-admin.
- Passwords: proposed minimum 12, maximum 128 characters; reject empty/oversized inputs before expensive verification; generic authentication errors; no password in logs.
- Require authenticator-based MFA before production admin access, with owner-held recovery codes. An unenrolled admin may reach only the enrollment/security area, not editorial APIs. Exact library enforcement must be tested.
- Sessions: proposed 8-hour absolute lifetime, refresh disabled, cookie session cache disabled, current-session revocation on logout and other-session revocation on password change. Enable session revocation on any approved reset flow.
- Cookies: Secure in HTTPS environments, HttpOnly, appropriate SameSite=Lax policy and host-only scope where possible. Verify actual Set-Cookie attributes in the deployed context; do not weaken production to make a preview work.
- No email password reset until a verified mail provider, token handling and owner recovery process are approved. Emergency recovery is an authenticated hosting/database operation that revokes sessions and audits the reset.
- Every admin page/API/service mutation checks a valid session and admin authorization. Cookie presence in Next proxy is only an optimistic redirect. Never rely on hidden UI or client role state.

## 3. CSRF, origins, proxies and abuse

- Same-origin JSON/forms; validate Origin/Sec-Fetch-Site and library CSRF protections on sensitive mutations. Reject missing/untrusted origins where required rather than allowing a fallback.
- Trust only exact canonical application origins and the exact assigned development preview origin. `BETTER_AUTH_TRUSTED_ORIGINS` is not a wildcard list.
- Configure proxy IP detection from the actual host topology. Strip/replace untrusted forwarding headers at the edge; never accept the first arbitrary `X-Forwarded-For` value as authenticated identity.
- Enable persistent/shared auth rate limiting in all deployed environments. Proposed sign-in ceiling: 5 attempts per 15 minutes per trusted IP, plus account-level throttling/progressive delay to reduce distributed guessing. Library IP limits alone are not an account-lockout policy.
- Avoid permanent lockout from attacker-supplied usernames; use bounded temporary delays and monitoring. Tune with executed tests and owner-approved availability tradeoffs.
- Admin writes have request-size, rate and timeout limits. TMDB preview/import endpoints have separate bounds. Return sanitized 429/503 responses with appropriate retry guidance.
- Do not use in-memory counters as the only production control across processes/instances.

## 4. Input, output and database safety

- Zod validation at every query/body/param/env/provider boundary; fixed sort/filter allowlists; bounded pagination and string lengths.
- Drizzle parameterization/SQL templates with bound values; no string-concatenated SQL. Database constraints back up service validation.
- Movie synopsis and labels are plain text. React escaping is the default; no `dangerouslySetInnerHTML`, user HTML, SVG upload or template injection.
- Reject mass assignment of role, status, approval, creator, provider sync fields and audit data. Use explicit DTOs and optimistic versions.
- Admin forms/actions are transactional where metadata/taxonomy/audit must agree. Failed audit writes must not silently report a successful sensitive action.
- Public errors do not reveal draft existence, credentials, SQL, stack traces or upstream bodies. Log a request ID and sanitized error code instead.

## 5. External redirect policy — default deny

A redirect is publishable only when all of these hold:

1. Movie is published; link is approved, unexpired and not revoked.
2. Exact destination host policy is active and has recorded evidence.
3. Per-link authorization evidence has been reviewed by an admin; approval actor/time are recorded.
4. URL parses as canonical HTTPS, no username/password, standard/default port only, no control characters, bounded length and exact allowlisted hostname.
5. Path matches the approved segment-boundary prefix where configured. Reject ambiguous/double-encoded traversal; do not make allowlist decisions with string suffix checks.
6. Caller cannot supply/override the target through query, body, headers or an open-return URL.

Use opaque `/r/{linkId}` lookups and fresh checks at click time. Return 303 with `Cache-Control: no-store` and restrictive referrer policy. Missing/denied links get a safe error page, not a fallback redirect. UI external links use `noopener noreferrer` when opening a new tab.

Do not permit wildcard subdomains, URL shorteners, user-controlled hosting paths, HTTP, `javascript:`, `data:`, `file:`, magnets, torrent files or direct movie downloads. An official provider's domain does not authorize every user-generated path on that domain.

Initial implementation does not fetch arbitrary admin URLs. If a later availability checker follows redirects, every hop must be validated, DNS answers must be public and connections pinned appropriately; timeouts/response sizes/hop counts are bounded. A changed final destination requires review, never automatic approval. The redirect route itself only redirects; it does not proxy content.

The Telegram URL is separately restricted to HTTPS and the exact `t.me` host (or an owner-approved official alternative), with a safe path. An unset value hides the control.

### Implemented Page 3 controls and their limits (2026-11-08)

Enforced in code and covered by tests: exact-host allowlist (no suffix/wildcard/subdomain matching);
HTTPS only; no userinfo; default port only; no control characters/backslashes; 2048-character bound;
raw-path rejection of `.`/`..`/`%2e`/`%2f`/`%5c`/`%25` before URL normalization; opaque id validation;
enabled-status check; per-link authorization check; hard-coded owner activation switch set to `false`.
`/r/{linkId}/` answers 404/410/403 with no `Location` header while locked, and sends `no-store`,
`no-referrer`, `noindex` and `nosniff`. Neither `/go/` nor `/r/` reads a destination from query,
headers, cookies or body. No auto-redirect, countdown, pop-up or `meta refresh` exists.

**Known prototype limitation — must not ship to production as-is:** `/admin/links/` is a public,
unauthenticated fixture editor backed by `sessionStorage`. It cannot write to a server or activate a
destination, and it is `noindex`, but it is not access-controlled. Real admin authentication,
server-side authorization, persistence, per-link evidence and audit logging are later-phase
requirements (BLK-014).

## 6. Content and metadata permission

- Never host, distribute, embed or link to unauthorized copyrighted movie downloads. No download counts, fake players or “download now” calls to action.
- Owner supplies authorization basis for external movie pages. Keep evidence private and review periodically; provide a revocation/takedown workflow.
- Use only owned/licensed branding and permitted posters. Do not copy MOVIES4U code/logos or commit scraped media.
- TMDB live use is blocked pending appropriate permission. Current terms require a commercial agreement for covered traffic/revenue-driving destination websites, limit caching to six months and require attribution. [1](https://www.themoviedb.org/api-terms-of-use)
- If approved, use the required current notice: “This website uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.” Use an approved, unmodified logo less prominently than AZmovies in the credits/footer area. FAQ branding guidance must also be followed. [1](https://developer.themoviedb.org/docs/faq)
- Do not use TMDB content to train/validate an ML system or build a chatbot. The project brain is development documentation, not such a feature.
- On permission termination, stop calls and purge provider content/caches as required. Synthetic test fixtures must not contain scraped licensed content.

These are engineering controls, not a legal opinion or blanket copyright compliance certification. Owner/legal review is a release gate.

## 7. Secrets and GitHub hygiene

- Real values live in host/local secret storage, never chat, source, screenshots, fixtures or commits. `.env.example` contains empty secret fields and nonsecret local defaults only.
- No secret uses a `NEXT_PUBLIC_*` name. Keep metadata/admin/database modules server-only and prevent accidental client imports.
- Bootstrap password is supplied temporarily without putting it in command arguments/history; remove it from runtime configuration after provisioning. Never seed a known password.
- Ignore `.env*` except the example, keys/certificates, database dumps, coverage/traces and browser reports. Traces/screenshots can contain cookies or private content.
- Before commit: inspect staged diff, search for credential patterns, run the approved secret scanner and `git diff --check`. Phase 1 executes only the checks explicitly recorded in `TEST_CASES.md`.
- Existing GitHub authentication was verified without printing its token. Authentication/read access does not imply a push occurred.
- Use least-privilege deployment/database roles, protected production secrets, reviewed dependency updates and restricted GitHub write access. Do not put tokens in remote URLs.
- Suspected exposure: revoke/rotate first, remove from active deployments, inspect Git history/artifacts, purge as appropriate, then record a sanitized incident note. Rewriting history alone does not revoke a leaked secret.

## 8. Headers and browser protections

Plan and verify in the actual Next/deployment setup:

- HTTPS/HSTS at production edge after subdomain policy review.
- Content-Security-Policy compatible with Next's required scripts/styles, preferably nonce-based; no production `unsafe-eval`, wildcard script sources or unnecessary third-party scripts.
- `frame-ancestors 'none'` and appropriate framing denial in production. Development may allow only the exact Arena preview/parent origins required for embedding; never carry that exception into production.
- `X-Content-Type-Options: nosniff`, deliberate Referrer-Policy, restrictive Permissions-Policy and no CORS access to private APIs.
- Restrict image/connect sources to the application and approved metadata image CDN. No arbitrary remote image fetch endpoint.
- Cookies, CSP, auth origins and trusted proxy settings need real preview/staging tests; a config file alone is not evidence.

## 9. Logging, retention and recovery

- Log route/status/duration/request ID, admin actor/action and sanitized job/redirect denial codes. Avoid query strings containing credentials, raw request bodies and full private URLs.
- Better Auth may store session IP/user-agent fields; restrict access, define retention and document this in the privacy notice before release.
- Aggregate redirect counts without visitor identifiers. Define audit/auth/job retention with the owner.
- Encrypt backups, restrict access and test restore. Emergency admin reset revokes all sessions and rotates affected secrets.
- Monitor login spikes, authorization failures, unsafe redirect attempts, import failures and unusual write volume. Alert recipient and incident owner remain unresolved.

## 10. Mandatory security release tests

Closed signup; default/assigned role isolation; anonymous/non-admin/admin matrix; MFA challenge and recovery; forged/expired/revoked sessions; cookie flags; password change/reset revocation; CSRF/origin/proxy spoofing; rate-limit persistence; SQL/XSS/mass assignment; draft/cache leakage; unsafe URL corpus and per-link approval/revocation; headers/CSP; secret/dependency scans; backup restore and emergency recovery.

All application security tests are **Not run** in Phase 1. A scan finding no obvious secret is not a penetration test or a guarantee. Track defects and retest fixes through `TEST_CASES.md` and `BUG_TRACKER.md`.
