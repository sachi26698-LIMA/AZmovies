import { describe, expect, it } from 'vitest';
import { MOVIES } from '@/lib/fixtures';
import {
  LINK_TEMPLATES,
  PUBLIC_LINKS,
  getPublicLinksForMovie,
  intermediatePath,
} from '@/lib/link-catalog';
import {
  PROVIDER_LINKS,
  getLinkById,
  getLinkForOption,
  getLinksForMovie,
} from '@/lib/link-fixtures';
import {
  APPROVED_DESTINATION_HOSTS,
  resolveContinue,
  validateDestinationUrl,
} from '@/lib/link-policy';
import { getMovieDetail } from '@/lib/detail-fixtures';

// Independent expectations for every public choice and its server-only fixture target.
const expectedMappings = [
  ['480p', 'alpha.example.com', 'watch', 'q-480'],
  ['720p-10bit-hevc', 'alpha.example.com', 'watch', 'q-720-hevc'],
  ['720p-x264', 'alpha.example.com', 'watch', 'q-720-x264'],
  ['1080p-10bit-hevc', 'beta.example.com', 'watch', 'q-1080-hevc'],
  ['1080p-x264', 'beta.example.com', 'watch', 'q-1080-x264'],
  ['1080p-hq', 'beta.example.com', 'watch', 'q-hq-1080'],
  ['watch-online', 'alpha.example.com', 'watch', 'watch-online'],
  ['watch-4k', 'beta.example.com', 'watch', 'watch-4k'],
  ['provider-a', 'alpha.example.com', 'provider', 'provider-a'],
  ['provider-b', 'beta.example.com', 'provider', 'provider-b'],
] as const;

describe('server-only provider link fixtures', () => {
  it('maps every movie and quality/watch/provider choice to the exact independent fixture destination', () => {
    expect(PROVIDER_LINKS).toHaveLength(MOVIES.length * expectedMappings.length);
    for (const movie of MOVIES) {
      for (const [option, host, section, targetKey] of expectedMappings) {
        const link = getLinkForOption(movie.slug, option);
        expect(link, `${movie.slug}/${option}`).toBeDefined();
        const expected = `https://${host}/${section}/${movie.slug}/${targetKey}`;
        expect(link!.targetUrl).toBe(expected);
        // Unit-only simulation: no actual redirect or external request is made.
        expect(
          resolveContinue(
            { ...link!, status: 'enabled', authorization: 'approved' },
            { activationEnabled: true },
          ),
        ).toEqual({ action: 'redirect', url: expected });
      }
    }
  });

  it('gives every record a unique server ID and a unique destination', () => {
    expect(new Set(PROVIDER_LINKS.map((link) => link.id)).size).toBe(PROVIDER_LINKS.length);
    expect(new Set(PROVIDER_LINKS.map((link) => link.targetUrl)).size).toBe(PROVIDER_LINKS.length);
    for (const link of PROVIDER_LINKS) {
      expect(validateDestinationUrl(link.targetUrl).ok).toBe(true);
      expect(APPROVED_DESTINATION_HOSTS).toContain(new URL(link.targetUrl).hostname);
      expect(link.authorization).toBe('fixture-placeholder');
    }
  });

  it('keeps one disabled link per movie and the first option enabled', () => {
    for (const movie of MOVIES) {
      const links = getLinksForMovie(movie.slug);
      expect(links).toHaveLength(LINK_TEMPLATES.length);
      expect(links.filter((link) => link.status === 'disabled')).toHaveLength(1);
      expect(links[0]?.status).toBe('enabled');
    }
  });

  it('resolves only known selectors and keeps internal lookup separate', () => {
    const first = PROVIDER_LINKS[0]!;
    expect(getLinkById(first.id)).toEqual(first);
    expect(getLinkForOption(first.movieSlug, first.optionSlug)).toEqual(first);
    expect(getLinkForOption(first.movieSlug, 'does-not-exist')).toBeUndefined();
    expect(getLinkForOption('https://evil.example.com', '480p')).toBeUndefined();
  });

  it('exposes only descriptive local paths and safe data to public detail props', () => {
    expect(JSON.stringify(PUBLIC_LINKS)).not.toMatch(/lnk-\d{4}|https?:\/\//i);
    for (const movie of MOVIES) {
      const links = getPublicLinksForMovie(movie.slug);
      expect(links).toHaveLength(expectedMappings.length);
      const detail = getMovieDetail(movie.slug)!;
      const options = [...detail.qualityOptions, ...detail.watchOptions, ...detail.providerLinks];
      expect(options).toHaveLength(expectedMappings.length);
      for (const option of options) {
        expect(option.href).toBe(intermediatePath(movie.slug, option.optionSlug));
      }
      expect(JSON.stringify(detail)).not.toMatch(/lnk-\d{4}|https?:\/\//i);
      expect(detail.trailer.href).toBeNull();
    }
  });
});
