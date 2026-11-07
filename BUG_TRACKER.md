# AZmovies — Bug and Blocker Tracker

**Phase 1:** no application behavior exists, so no application defects or fixes are claimed. The entries below are verified delivery blockers/decisions, not invented runtime bugs.

## Active delivery blockers

| ID | Type / severity | Observed issue | Impact / gate | Action and owner | Status |
| --- | --- | --- | --- | --- | --- |
| BLK-001 | Missing input / High | No MOVIES4U screenshots were available to inspect | Exact UI matching, Phase 2 visual exit | Owner attaches desktop/mobile references; agent records dimensions/states | Open |
| BLK-002 | Permission / High | TMDB permission/monetization unresolved; current terms can require a commercial agreement; terminal API probe failed | Live metadata, Phase 5 | Owner confirms rights/provider; approved runtime egress and credential required | Open |
| BLK-003 | Environment / High | No PostgreSQL server/client or Docker found | Real database/auth integration, Phase 3 | Owner/agent provisions approved disposable/staging PostgreSQL; no silent SQLite substitution | Open |
| BLK-004 | Environment / High | No browser executable; Playwright CDN terminal probe failed | Visual/E2E/cross-browser execution, Phase 2/6 | Verify approved browser source or CI runner and actual launches | Open |
| BLK-005 | Content authorization / High | No authorized external movie-page inventory/evidence supplied | Safe populated redirects, Phase 4 | Owner supplies approved providers/links and authorization basis | Open |
| BLK-006 | Deployment decision / Medium | Host/domain/database/proxy topology not selected | Production cookies, scheduler, performance and release | Owner selects infrastructure before dependent implementation | Open |
| BLK-007 | Operational decision / High | Admin recovery owner/MFA acceptance not confirmed | Secure production admin, Phase 3/7 | Owner confirms authenticator/recovery custody and emergency procedure | Open |
| BLK-008 | Missing configuration / Low | Official Telegram URL not supplied | Floating link activation | Owner supplies URL; otherwise keep control hidden | Open |
| BLK-009 | Scope clarification / Medium | Two-column desktop behavior, taxonomy and quality vocabulary lack reference confirmation | UI/content acceptance | Owner resolves with screenshots and label list | Open |

## Resolved environment notes

| ID | Observation | Resolution | Evidence |
| --- | --- | --- | --- |
| NOTE-001 | GitHub CLI 2.23.0 does not support `gh auth status --active` | Re-ran supported `gh auth status`, then a read-only repository API request | Both succeeded on 2026-11-07; no token printed and no push performed |

This is a tooling-version workaround, not an application bug fix or GitHub write test.

## Defect workflow

When implementation begins, record each defect with:

```text
ID: BUG-###
Title:
Opened / owner:
Severity: Critical / High / Medium / Low
Environment and commit:
Preconditions/test data:
Reproduction steps:
Expected:
Actual:
Evidence (sanitized):
Related test case:
Fix summary:
Retest command/date/result:
Status: Open / In progress / Fixed-awaiting-retest / Closed / Blocked
```

Do not include credentials, session cookies, private authorization evidence or unauthorized movie URLs. Link a regression case before closing a fix. “Fixed” without a retest is not “Closed.” Blockers remain visible in phase reports until their required evidence/input exists.
