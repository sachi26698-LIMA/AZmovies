import { beforeEach, describe, expect, it } from 'vitest';
import { PROVIDER_LINKS, getLinkById } from '@/lib/link-fixtures';
import {
  EMPTY_LINK_STATE,
  LINK_STORAGE_KEY,
  applyLinkOverrides,
  createCustomLink,
  parseLinkState,
  readRawLinkState,
  resolveStoredLink,
  writeLinkState,
} from '@/lib/link-store';

beforeEach(() => {
  window.sessionStorage.clear();
});

describe('prototype link override store', () => {
  it('returns untouched fixtures when nothing is overridden', () => {
    expect(applyLinkOverrides(EMPTY_LINK_STATE)).toHaveLength(PROVIDER_LINKS.length);
    expect(resolveStoredLink(EMPTY_LINK_STATE, 'lnk-0001')).toEqual(getLinkById('lnk-0001'));
  });

  it('applies an individual edit without touching sibling links', () => {
    const state = {
      overrides: {
        'lnk-0001': { label: 'Edited label', targetUrl: 'https://beta.example.com/watch/m/custom' },
      },
      added: [],
    };
    const edited = resolveStoredLink(state, 'lnk-0001')!;
    expect(edited.label).toBe('Edited label');
    expect(edited.targetUrl).toBe('https://beta.example.com/watch/m/custom');
    expect(resolveStoredLink(state, 'lnk-0003')).toEqual(getLinkById('lnk-0003'));
  });

  it('disables and deletes individual links', () => {
    const disabled = { overrides: { 'lnk-0001': { status: 'disabled' as const } }, added: [] };
    expect(resolveStoredLink(disabled, 'lnk-0001')?.status).toBe('disabled');
    const deleted = { overrides: { 'lnk-0001': { deleted: true } }, added: [] };
    expect(resolveStoredLink(deleted, 'lnk-0001')).toBeUndefined();
    expect(applyLinkOverrides(deleted)).toHaveLength(PROVIDER_LINKS.length - 1);
  });

  it('creates unique custom links that resolve like fixtures', () => {
    const custom = createCustomLink(
      {
        movieSlug: 'the-odyssey-protocol-2',
        movieTitle: 'The Odyssey Protocol',
        kind: 'provider',
        label: 'Custom link',
        quality: '1080p',
        providerId: 'alpha',
        providerName: 'Fixture Provider Alpha',
        targetUrl: 'https://alpha.example.com/watch/custom/1080p',
        status: 'enabled',
      },
      PROVIDER_LINKS.map((link) => link.id),
    );
    expect(custom.id).toMatch(/^lnk-c\d{4}$/);
    expect(custom.authorization).toBe('fixture-placeholder');
    const state = { overrides: {}, added: [custom] };
    expect(resolveStoredLink(state, custom.id)).toEqual(custom);
    const second = createCustomLink(
      {
        movieSlug: custom.movieSlug,
        movieTitle: custom.movieTitle,
        kind: 'provider',
        label: 'Another',
        quality: '720p',
        providerId: 'beta',
        providerName: 'Fixture Provider Beta',
        targetUrl: 'https://beta.example.com/watch/custom/720p',
        status: 'enabled',
      },
      [...PROVIDER_LINKS.map((link) => link.id), custom.id],
    );
    expect(second.id).not.toBe(custom.id);
  });

  it('round-trips through session storage and ignores corrupted payloads', () => {
    writeLinkState({ overrides: { 'lnk-0001': { status: 'disabled' } }, added: [] });
    expect(readRawLinkState()).toContain('disabled');
    expect(resolveStoredLink(parseLinkState(readRawLinkState()), 'lnk-0001')?.status).toBe(
      'disabled',
    );

    window.sessionStorage.setItem(LINK_STORAGE_KEY, '{not json');
    expect(resolveStoredLink(parseLinkState(readRawLinkState()), 'lnk-0001')).toEqual(
      getLinkById('lnk-0001'),
    );

    window.sessionStorage.setItem(LINK_STORAGE_KEY, JSON.stringify({ overrides: { x: 5 } }));
    expect(resolveStoredLink(parseLinkState(readRawLinkState()), 'lnk-0001')).toEqual(
      getLinkById('lnk-0001'),
    );

    writeLinkState(EMPTY_LINK_STATE);
    expect(window.sessionStorage.getItem(LINK_STORAGE_KEY)).toBeNull();
  });
});
