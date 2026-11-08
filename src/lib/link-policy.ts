/**
 * Pure destination policy for the intermediate link page (Page 3).
 *
 * Default deny. A destination is usable only when it is canonical HTTPS on an
 * exactly allowlisted host, and the individual link is enabled, authorized and
 * activated by the owner. No caller-supplied URL is ever accepted here: the only
 * input is a server record resolved from a known public movie and option.
 */

export const APPROVED_DESTINATION_HOSTS = ['alpha.example.com', 'beta.example.com'] as const;

export const MAX_DESTINATION_LENGTH = 2048;

const SAFE_LINK_ID = /^[a-z0-9][a-z0-9-]{3,39}$/;

export type DestinationRejectionCode =
  | 'empty'
  | 'too-long'
  | 'control-characters'
  | 'malformed'
  | 'not-https'
  | 'userinfo'
  | 'non-standard-port'
  | 'host-not-approved'
  | 'unsafe-path';

export type DestinationValidation =
  { ok: true; url: string } | { ok: false; code: DestinationRejectionCode; message: string };

const rejectionMessages: Record<DestinationRejectionCode, string> = {
  empty: 'Enter a destination URL.',
  'too-long': `Destination URLs must be ${MAX_DESTINATION_LENGTH} characters or fewer.`,
  'control-characters': 'Destination URLs must not contain control characters or spaces.',
  malformed: 'Enter a complete, absolute URL.',
  'not-https': 'Only HTTPS destinations are allowed.',
  userinfo: 'Destination URLs must not contain a username or password.',
  'non-standard-port': 'Only the default HTTPS port (443) is allowed.',
  'host-not-approved': 'This host is not on the approved destination allowlist.',
  'unsafe-path': 'The destination path contains ambiguous or traversing segments.',
};

export function isSafeLinkId(id: string): boolean {
  return SAFE_LINK_ID.test(id);
}

/** Exact-host allowlist check. Never a suffix, wildcard or subdomain match. */
export function isApprovedHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return (APPROVED_DESTINATION_HOSTS as readonly string[]).includes(host);
}

export function validateDestinationUrl(
  raw: string,
  allowlist: readonly string[] = APPROVED_DESTINATION_HOSTS,
): DestinationValidation {
  const value = raw.trim();
  const deny = (code: DestinationRejectionCode): DestinationValidation => ({
    ok: false,
    code,
    message: rejectionMessages[code],
  });

  if (value.length === 0) return deny('empty');
  if (value.length > MAX_DESTINATION_LENGTH) return deny('too-long');
  if (/[\u0000-\u001f\u007f\s\\]/.test(value)) return deny('control-characters');
  // Inspect the raw path before parsing: URL parsing silently normalizes `/../`
  // and `%2e%2e/` away, which would hide an ambiguous destination from review.
  const rawPath = value.replace(/^[a-z][a-z0-9+.-]*:\/\/[^/]*/i, '').split(/[?#]/)[0] ?? '';
  if (/%25|%2e|%2f|%5c/i.test(rawPath)) return deny('unsafe-path');
  if (rawPath.split('/').some((segment) => segment === '.' || segment === '..')) {
    return deny('unsafe-path');
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return deny('malformed');
  }

  if (url.protocol !== 'https:') return deny('not-https');
  if (url.username !== '' || url.password !== '') return deny('userinfo');
  if (url.port !== '' && url.port !== '443') return deny('non-standard-port');
  if (!allowlist.includes(url.hostname.toLowerCase())) return deny('host-not-approved');

  const path = url.pathname;
  if (/%25|%2e|%2f|%5c/i.test(path)) return deny('unsafe-path');
  if (path.split('/').some((segment) => segment === '.' || segment === '..')) {
    return deny('unsafe-path');
  }

  return { ok: true, url: url.toString() };
}

export type LinkAuthorization = 'fixture-placeholder' | 'approved';
export type LinkStatus = 'enabled' | 'disabled';

export interface PolicyLinkRecord {
  id: string;
  status: LinkStatus;
  authorization: LinkAuthorization;
  targetUrl: string;
}

export type DenialReason =
  | 'not-found'
  | 'invalid-id'
  | 'link-disabled'
  | 'unsafe-destination'
  | 'activation-disabled'
  | 'not-authorized';

export type ContinueDecision =
  { action: 'redirect'; url: string } | { action: 'deny'; reason: DenialReason; message: string };

const denialMessages: Record<DenialReason, string> = {
  'not-found': 'This link is not available.',
  'invalid-id': 'This link reference is not valid.',
  'link-disabled': 'This link has been disabled by the site administrator.',
  'unsafe-destination': 'This destination failed the approved-destination policy checks.',
  'activation-disabled':
    'External destinations are not activated in this prototype. Owner approval is required.',
  'not-authorized': 'This link has no reviewed authorization record, so it cannot be opened.',
};

export interface ContinueOptions {
  /** Owner-controlled global switch. Stays false until real destinations are approved. */
  activationEnabled: boolean;
}

/**
 * Resolve the Continue action for a stored link. The exact stored URL is returned
 * unchanged on success; nothing is read from the request, query string or headers.
 */
export function resolveContinue(
  link: PolicyLinkRecord | undefined,
  options: ContinueOptions,
): ContinueDecision {
  const deny = (reason: DenialReason): ContinueDecision => ({
    action: 'deny',
    reason,
    message: denialMessages[reason],
  });

  if (!link) return deny('not-found');
  if (!isSafeLinkId(link.id)) return deny('invalid-id');
  if (link.status !== 'enabled') return deny('link-disabled');

  const validation = validateDestinationUrl(link.targetUrl);
  if (!validation.ok) return deny('unsafe-destination');

  if (!options.activationEnabled) return deny('activation-disabled');
  if (link.authorization !== 'approved') return deny('not-authorized');

  return { action: 'redirect', url: validation.url };
}

export function denialMessage(reason: DenialReason): string {
  return denialMessages[reason];
}
