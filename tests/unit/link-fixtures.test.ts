import { describe, expect, it } from 'vitest';
import { MOVIES } from '@/lib/fixtures';
import {
  LINK_TEMPLATES,
  PROVIDERS,
  PROVIDER_LINKS,
  getLinkById,
  getLinkForOption,
  getLinksForMovie,
  intermediatePath,
} from '@/lib/link-fixtures';
import { APPROVED_DESTINATION_HOSTS, validateDestinationUrl } from '@/lib/link-policy';
import { getMovieDetail } from '@/lib/detail-fixtures';

describe('provider link fixtures', () => {
  it('gives every movie its own link per quality/watch/provider option', () => {
    expect(PROVIDER_LINKS).toHaveLength(MOVIES.length * LINK_TEMPLATES.length);
    for (const movie of MOVIES) {
      const links = getLinksForMovie(movie.slug);
      expect(links).toHaveLength(LINK_TEMPLATES.length);
      expect(new Set(links.map((link) => link.optionKey)).size).toBe(LINK_TEMPLATES.length);
    }
  });

  it('uses a unique id and a unique destination for every individual link', () => {
    expect(new Set(PROVIDER_LINKS.map((link) => link.id)).size).toBe(PROVIDER_LINKS.length);
    expect(new Set(PROVIDER_LINKS.map((link) => link.targetUrl)).size).toBe(PROVIDER_LINKS.length);
  });

  it('stores only valid HTTPS destinations on approved fixture hosts', () => {
    for (const link of PROVIDER_LINKS) {
      const result = validateDestinationUrl(link.targetUrl);
      expect(result.ok).toBe(true);
      expect(APPROVED_DESTINATION_HOSTS).toContain(new URL(link.targetUrl).hostname);
      expect(PROVIDERS.map((provider) => provider.id)).toContain(link.providerId);
    }
  });

  it('keeps exactly one disabled link per movie and never the first option', () => {
    for (const movie of MOVIES) {
      const links = getLinksForMovie(movie.slug);
      const disabled = links.filter((link) => link.status === 'disabled');
      expect(disabled).toHaveLength(1);
      expect(disabled[0]?.optionKey).not.toBe(LINK_TEMPLATES[0]?.key);
    }
  });

  it('never marks a fixture link as authorized for real redirection', () => {
    expect(PROVIDER_LINKS.every((link) => link.authorization === 'fixture-placeholder')).toBe(true);
  });

  it('resolves links by opaque id and rejects unknown ids', () => {
    const first = PROVIDER_LINKS[0]!;
    expect(getLinkById(first.id)).toEqual(first);
    expect(intermediatePath(first.id)).toBe(`/go/${first.id}/`);
    expect(getLinkById('lnk-9999')).toBeUndefined();
    expect(getLinkById('https://alpha.example.com/watch')).toBeUndefined();
    expect(getLinkForOption(first.movieSlug, first.optionKey)?.id).toBe(first.id);
    expect(getLinkForOption(first.movieSlug, 'does-not-exist')).toBeUndefined();
  });

  it('wires every detail option to its own intermediate link without external hrefs', () => {
    const detail = getMovieDetail('the-odyssey-protocol-2')!;
    const options = [...detail.qualityOptions, ...detail.watchOptions, ...detail.providerLinks];
    expect(options).toHaveLength(LINK_TEMPLATES.length);
    expect(options.every((option) => option.href === null)).toBe(true);
    expect(new Set(options.map((option) => option.linkId)).size).toBe(options.length);
    for (const option of options) {
      expect(option.linkId).toBeTruthy();
      expect(getLinkById(option.linkId!)?.movieSlug).toBe(detail.movie.slug);
    }
    expect(detail.trailer.linkId).toBeNull();
  });
});
