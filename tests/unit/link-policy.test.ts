import { describe, expect, it } from 'vitest';
import {
  APPROVED_DESTINATION_HOSTS,
  MAX_DESTINATION_LENGTH,
  isApprovedHost,
  isSafeLinkId,
  resolveContinue,
  validateDestinationUrl,
  type PolicyLinkRecord,
} from '@/lib/link-policy';
import { EXTERNAL_ACTIVATION_ENABLED } from '@/lib/redirect-config';
import { getLinkById } from '@/lib/link-fixtures';

const valid = 'https://alpha.example.com/watch/movie-slug-1/q-480';

function record(overrides: Partial<PolicyLinkRecord> = {}): PolicyLinkRecord {
  return {
    id: 'lnk-0001',
    status: 'enabled',
    authorization: 'approved',
    targetUrl: valid,
    ...overrides,
  };
}

describe('destination URL validation', () => {
  it('accepts a canonical HTTPS URL on an exactly approved host', () => {
    const result = validateDestinationUrl(valid);
    expect(result).toEqual({ ok: true, url: valid });
    expect(validateDestinationUrl('https://beta.example.com:443/provider/a').ok).toBe(true);
    expect(validateDestinationUrl('https://ALPHA.example.com/watch/a').ok).toBe(true);
  });

  it('rejects unsafe or non-approved destinations with a specific code', () => {
    const cases: Array<[string, string]> = [
      ['', 'empty'],
      ['   ', 'empty'],
      ['http://alpha.example.com/watch/a', 'not-https'],
      ['javascript:alert(1)', 'not-https'],
      ['data:text/html,<script>alert(1)</script>', 'not-https'],
      ['file:///etc/passwd', 'not-https'],
      ['//alpha.example.com/watch/a', 'malformed'],
      ['/watch/a', 'malformed'],
      ['not a url', 'control-characters'],
      ['https://alpha.example.com/watch/a b', 'control-characters'],
      ['https://alpha.example.com/\u0000watch', 'control-characters'],
      ['https://alpha.example.com\\@evil.example.com/', 'control-characters'],
      ['https://user:pass@alpha.example.com/watch/a', 'userinfo'],
      ['https://alpha.example.com:8443/watch/a', 'non-standard-port'],
      ['https://evil.example.com/watch/a', 'host-not-approved'],
      ['https://alpha.example.com.evil.com/watch/a', 'host-not-approved'],
      ['https://notalpha.example.com/watch/a', 'host-not-approved'],
      ['https://sub.alpha.example.com/watch/a', 'host-not-approved'],
      ['https://127.0.0.1/watch/a', 'host-not-approved'],
      ['https://localhost/watch/a', 'host-not-approved'],
      ['https://[::1]/watch/a', 'host-not-approved'],
      ['https://alpha.example.com/../../admin', 'unsafe-path'],
      ['https://alpha.example.com/%2e%2e/admin', 'unsafe-path'],
      ['https://alpha.example.com/%252e%252e/admin', 'unsafe-path'],
      ['https://alpha.example.com/watch%2fadmin', 'unsafe-path'],
      [`https://alpha.example.com/${'a'.repeat(MAX_DESTINATION_LENGTH)}`, 'too-long'],
    ];
    for (const [input, code] of cases) {
      const result = validateDestinationUrl(input);
      expect(result.ok, input).toBe(false);
      if (!result.ok) expect(result.code, input).toBe(code);
    }
  });

  it('allowlists exact hosts only, never suffixes or wildcards', () => {
    expect(APPROVED_DESTINATION_HOSTS).toEqual(['alpha.example.com', 'beta.example.com']);
    expect(isApprovedHost('alpha.example.com')).toBe(true);
    expect(isApprovedHost('ALPHA.EXAMPLE.COM')).toBe(true);
    expect(isApprovedHost('evilalpha.example.com')).toBe(false);
    expect(isApprovedHost('alpha.example.com.evil.com')).toBe(false);
    expect(isApprovedHost('*.example.com')).toBe(false);
  });

  it('validates opaque link ids', () => {
    expect(isSafeLinkId('lnk-0001')).toBe(true);
    expect(isSafeLinkId('lnk-c0001')).toBe(true);
    expect(isSafeLinkId('https://evil.example.com')).toBe(false);
    expect(isSafeLinkId('../admin')).toBe(false);
    expect(isSafeLinkId('a')).toBe(false);
  });
});

describe('continue decision', () => {
  it('maps an approved activated link to its exact stored destination', () => {
    const link = record({ targetUrl: 'https://beta.example.com/provider/movie-2/provider-b' });
    expect(resolveContinue(link, { activationEnabled: true })).toEqual({
      action: 'redirect',
      url: link.targetUrl,
    });
  });

  it('keeps two links on the same movie independent', () => {
    const a = record({ id: 'lnk-0001', targetUrl: 'https://alpha.example.com/watch/m/q-480' });
    const b = record({ id: 'lnk-0002', targetUrl: 'https://beta.example.com/watch/m/q-1080-x264' });
    const decisionA = resolveContinue(a, { activationEnabled: true });
    const decisionB = resolveContinue(b, { activationEnabled: true });
    expect(decisionA).toEqual({ action: 'redirect', url: a.targetUrl });
    expect(decisionB).toEqual({ action: 'redirect', url: b.targetUrl });
    expect(decisionA).not.toEqual(decisionB);
  });

  it('denies disabled, unknown, unsafe and unauthorized links', () => {
    expect(resolveContinue(undefined, { activationEnabled: true })).toMatchObject({
      action: 'deny',
      reason: 'not-found',
    });
    expect(
      resolveContinue(record({ id: 'https://evil.example.com' }), { activationEnabled: true }),
    ).toMatchObject({ action: 'deny', reason: 'invalid-id' });
    expect(
      resolveContinue(record({ status: 'disabled' }), { activationEnabled: true }),
    ).toMatchObject({ action: 'deny', reason: 'link-disabled' });
    expect(
      resolveContinue(record({ targetUrl: 'http://alpha.example.com/a' }), {
        activationEnabled: true,
      }),
    ).toMatchObject({ action: 'deny', reason: 'unsafe-destination' });
    expect(
      resolveContinue(record({ targetUrl: 'https://evil.example.com/a' }), {
        activationEnabled: true,
      }),
    ).toMatchObject({ action: 'deny', reason: 'unsafe-destination' });
    expect(
      resolveContinue(record({ authorization: 'fixture-placeholder' }), {
        activationEnabled: true,
      }),
    ).toMatchObject({ action: 'deny', reason: 'not-authorized' });
  });

  it('denies everything while owner activation is off, which is the shipped default', () => {
    expect(EXTERNAL_ACTIVATION_ENABLED).toBe(false);
    expect(resolveContinue(record(), { activationEnabled: false })).toMatchObject({
      action: 'deny',
      reason: 'activation-disabled',
    });
    for (const id of ['lnk-0001', 'lnk-0004', 'lnk-0480']) {
      const link = getLinkById(id)!;
      expect(
        resolveContinue(link, { activationEnabled: EXTERNAL_ACTIVATION_ENABLED }),
      ).toMatchObject({ action: 'deny' });
    }
  });

  it('does not resolve a caller-supplied target through the internal lookup', () => {
    // This lookup is server-only; public routes use descriptive movie/option selectors.
    expect(getLinkById('lnk-0001?url=https://evil.example.com')).toBeUndefined();
    expect(getLinkById('https://evil.example.com')).toBeUndefined();
    const link = getLinkById('lnk-0001')!;
    const decision = resolveContinue(link, { activationEnabled: true });
    expect(decision).toMatchObject({ action: 'deny', reason: 'not-authorized' });
    // Even an activated fixture link returns its own stored URL, never an injected one.
    const activated = resolveContinue(
      { ...link, authorization: 'approved' },
      { activationEnabled: true },
    );
    expect(activated).toEqual({ action: 'redirect', url: link.targetUrl });
  });
});
