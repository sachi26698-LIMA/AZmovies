import { beforeEach, describe, expect, it } from 'vitest';
import { PUBLIC_LINKS } from '@/lib/link-catalog';
import {
  EMPTY_LINK_STATE,
  LINK_STORAGE_KEY,
  applyLinkOverrides,
  createCustomLink,
  demoKeyFor,
  parseLinkState,
  readRawLinkState,
  resolveDemoLink,
  writeLinkState,
} from '@/lib/link-store';

beforeEach(() => {
  window.sessionStorage.clear();
});

const first = PUBLIC_LINKS[0]!;
const firstKey = demoKeyFor(first);

describe('isolated prototype link demo store', () => {
  it('starts with public-only fixture descriptions and no server records', () => {
    expect(applyLinkOverrides(EMPTY_LINK_STATE)).toHaveLength(PUBLIC_LINKS.length);
    expect(resolveDemoLink(EMPTY_LINK_STATE, firstKey)).toMatchObject(first);
    expect(JSON.stringify(applyLinkOverrides(EMPTY_LINK_STATE))).not.toMatch(
      /lnk-\d{4}|https?:\/\//,
    );
  });

  it('edits, disables and deletes one demo option without changing the public catalog', () => {
    const state = {
      overrides: { [firstKey]: { label: 'Edited demo', status: 'disabled' as const } },
      added: [],
    };
    expect(resolveDemoLink(state, firstKey)).toMatchObject({
      label: 'Edited demo',
      status: 'disabled',
    });
    expect(PUBLIC_LINKS[0]).toEqual(first);
    const deleted = { overrides: { [firstKey]: { deleted: true } }, added: [] };
    expect(resolveDemoLink(deleted, firstKey)).toBeUndefined();
    expect(applyLinkOverrides(deleted)).toHaveLength(PUBLIC_LINKS.length - 1);
  });

  it('creates independent session drafts, not public routes', () => {
    const input = {
      movieSlug: first.movieSlug,
      movieTitle: first.movieTitle,
      kind: 'provider' as const,
      label: 'Custom demo',
      quality: '2160p',
      providerId: 'alpha',
      providerName: 'Fixture Provider Alpha',
      status: 'enabled' as const,
      hasValidatedDraft: true,
    };
    const custom = createCustomLink(input, []);
    const second = createCustomLink(input, [custom.demoKey]);
    expect(custom.demoKey).not.toBe(second.demoKey);
    expect(custom.draftOnly).toBe(true);
    expect(resolveDemoLink({ overrides: {}, added: [custom] }, custom.demoKey)).toEqual(custom);
  });

  it('strips unexpected URL fields and never persists a test destination', () => {
    const testUrl = 'https://alpha.example.com/watch/typed-by-user';
    const custom = createCustomLink(
      {
        movieSlug: first.movieSlug,
        movieTitle: first.movieTitle,
        kind: 'provider',
        label: 'Draft',
        quality: '720p',
        providerId: 'alpha',
        providerName: 'Fixture Provider Alpha',
        status: 'enabled',
        hasValidatedDraft: true,
      },
      [],
    );
    const parsed = parseLinkState(
      JSON.stringify({
        overrides: { [firstKey]: { label: 'Edited', targetUrl: testUrl } },
        added: [{ ...custom, targetUrl: testUrl }],
      }),
    );
    writeLinkState(parsed);
    expect(readRawLinkState()).not.toContain(testUrl);
    expect(readRawLinkState()).not.toContain('targetUrl');
    expect(resolveDemoLink(parsed, custom.demoKey)?.label).toBe('Draft');
  });

  it('does not read, migrate or erase old session data', () => {
    const legacyKey = 'azmovies.prototype.links.v1';
    const legacyValue = JSON.stringify({ overrides: { 'lnk-0001': { status: 'disabled' } } });
    window.sessionStorage.setItem(legacyKey, legacyValue);
    expect(readRawLinkState()).toBe('');
    writeLinkState({ overrides: { [firstKey]: { status: 'enabled' } }, added: [] });
    expect(window.sessionStorage.getItem(legacyKey)).toBe(legacyValue);
  });

  it('round-trips safe state and ignores corrupted payloads', () => {
    writeLinkState({ overrides: { [firstKey]: { status: 'disabled' } }, added: [] });
    expect(resolveDemoLink(parseLinkState(readRawLinkState()), firstKey)?.status).toBe('disabled');
    window.sessionStorage.setItem(LINK_STORAGE_KEY, '{not json');
    expect(parseLinkState(readRawLinkState())).toEqual(EMPTY_LINK_STATE);
    writeLinkState(EMPTY_LINK_STATE);
    expect(window.sessionStorage.getItem(LINK_STORAGE_KEY)).toBeNull();
  });
});
