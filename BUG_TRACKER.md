# AZmovies — Bug and Blocker Tracker

**Phase 2:** a static fixture prototype exists and scoped tests have run. Entries below distinguish resolved prototype defects from still-open delivery blockers. No live API/database/auth/redirect behavior is claimed.

## Active delivery blockers

| ID      | Type / severity              | Observed issue                                                                                                       | Impact / gate                                          | Action and owner                                                                             | Status |
| ------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------- | ------ |
| BLK-002 | Permission / High            | TMDB permission/monetization unresolved; current terms can require a commercial agreement; terminal API probe failed | Live metadata, Phase 5                                 | Owner confirms rights/provider; approved runtime egress and credential required              | Open   |
| BLK-003 | Environment / High           | No PostgreSQL server/client or Docker found                                                                          | Real database/auth integration, Phase 3                | Owner/agent provisions approved disposable/staging PostgreSQL; no silent SQLite substitution | Open   |
| BLK-005 | Content authorization / High | No authorized external movie-page inventory/evidence supplied                                                        | Safe populated redirects, Phase 4                      | Owner supplies approved providers/links and authorization basis                              | Open   |
| BLK-006 | Deployment decision / Medium | Host/domain/database/proxy topology not selected                                                                     | Production cookies, scheduler, performance and release | Owner selects infrastructure before dependent implementation                                 | Open   |
| BLK-007 | Operational decision / High  | Admin recovery owner/MFA acceptance not confirmed                                                                    | Secure production admin, Phase 3/7                     | Owner confirms authenticator/recovery custody and emergency procedure                        | Open   |
| BLK-008 | Missing configuration / Low  | Official Telegram URL not supplied                                                                                   | Floating link activation                               | Owner supplies URL; prototype control remains inert/aria-disabled                            | Open   |
| BLK-009 | Scope clarification / Medium | Desktop density and final taxonomy/quality vocabulary still need owner acceptance                                    | UI/content acceptance                                  | Owner reviews prototype; mobile reference uses two columns and compact max-width layout      | Open   |
| BLK-010 | Approval / High              | Phase 2 visual comparison executed but owner has not approved fidelity/deviations                                    | Phase 3 entry                                          | Owner reviews live preview, comparison artifact and PHASE2_REPORT.md                         | Open   |
| BLK-011 | Missing input / Low          | User described three MOVIES4U screenshots; received primary MOVIES4U set contains two files                          | Complete primary-state coverage                        | Owner may supply the missing third capture; current match uses the available pair            | Open   |

## Resolved blockers and environment notes

| ID       | Observation                                                        | Resolution                                                                                                                                                              | Evidence                                                                                                                  |
| -------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| BLK-001  | No MOVIES4U screenshots were available in Phase 1                  | Owner supplied six references; all were inspected and mapped. Four are HDHub4u supplementary captures; two are primary MOVIES4U captures                                | `docs/references/README.md`, `.artifacts/phase2/reference-analysis.json`, `.artifacts/phase2/reference-contact-sheet.jpg` |
| BLK-004  | No system browser executable; Playwright CDN terminal probe failed | Installed `@sparticuz/chromium`; extracted bundled AL2023 NSS/NSPR libraries and removed the unstable `--single-process` flag for this sandbox; Chromium tests executed | `playwright.config.ts`, `scripts/capture-prototype.mjs`, `.artifacts/phase2/playwright-results.json`                      |
| NOTE-001 | GitHub CLI 2.23.0 does not support `gh auth status --active`       | Re-ran supported `gh auth status`, then a read-only repository API request                                                                                              | Both succeeded on 2026-11-07; no token printed and no push performed                                                      |
| NOTE-002 | jsdom lacks canvas/color engines used by some axe visual rules     | Component axe disables `color-contrast` and `label-content-name-mismatch`; Chromium axe covers visual contrast/name checks                                              | `tests/component/prototype.test.tsx`, `tests/e2e/prototype.spec.ts`                                                       |
| NOTE-003 | Reference JPEG sampling at text/edges produced misleading values   | Re-sampled flat areas and updated `scripts/analyze-references.mjs`; tokens distinguish reference samples from AA-adjusted implementation values                         | `.artifacts/phase2/reference-analysis.json`, `src/styles/globals.css`                                                     |

## Fixed prototype defects

| ID      | Title                                                             | Severity | Fix                                                                                         | Retest evidence                                                                    | Status |
| ------- | ----------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------ |
| BUG-001 | Reference pill colors failed WCAG AA white-text contrast          | Medium   | Darkened green/top-red/category-red/active-pagination tokens minimally while preserving hue | Chromium axe home/drawer/detail passed; `npx playwright test`                      | Closed |
| BUG-002 | 320 px viewport had horizontal overflow from pagination controls  | Medium   | Added narrow-viewport pagination/category sizing rules                                      | `@responsive 320px` Playwright test passed; captured `scrollWidth` equals viewport | Closed |
| BUG-003 | Category rows wrapped away from the reference three-column rhythm | Medium   | Tuned pill font/padding/gap/letter-spacing and corrected `BANGALI` label                    | Final capture metrics and comparison artifact; Playwright responsive suite passed  | Closed |

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
