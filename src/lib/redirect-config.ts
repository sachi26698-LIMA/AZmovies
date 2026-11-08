/**
 * Owner-controlled activation switch for external destinations.
 *
 * Phase 2/Page 3 prototype rule: no real external destination may be activated
 * without explicit owner approval, so this is a hard-coded `false`. It is not read
 * from a query parameter, header, cookie or client input. Flipping it later is a
 * reviewed code/config change paired with authorized per-link evidence.
 */
export const EXTERNAL_ACTIVATION_ENABLED = false;

export const REDIRECT_ACTIVATION_NOTICE =
  'Continue is disabled and no external destination is opened. The owner must approve authorized provider URLs first.';
