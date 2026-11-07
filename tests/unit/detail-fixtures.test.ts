import { describe, expect, it } from 'vitest';
import { getMovieDetail } from '@/lib/detail-fixtures';
import { MOVIES } from '@/lib/fixtures';

describe('static detail fixtures', () => {
  it('builds required detail sections for every movie slug', () => {
    for (const movie of MOVIES) {
      const detail = getMovieDetail(movie.slug);
      expect(detail).toBeDefined();
      expect(detail!.genres.length).toBeGreaterThan(0);
      expect(detail!.cast.length).toBeGreaterThan(0);
      expect(detail!.screenshots).toHaveLength(3);
      expect(detail!.qualityOptions.length).toBeGreaterThan(0);
      expect(detail!.watchOptions.length).toBeGreaterThan(0);
      expect(detail!.related.every((item) => item.slug !== movie.slug)).toBe(true);
    }
  });

  it('keeps provider/watch/trailer links as unconfigured placeholders', () => {
    const detail = getMovieDetail('the-odyssey-protocol-2')!;
    const links = [
      ...detail.qualityOptions,
      ...detail.watchOptions,
      ...detail.providerLinks,
      detail.trailer,
    ];
    expect(links.every((link) => link.href === null)).toBe(true);
    expect(detail.screenshots.every((shot) => shot.src.startsWith('/stills/'))).toBe(true);
  });

  it('returns undefined for unknown slugs', () => {
    expect(getMovieDetail('missing-fixture')).toBeUndefined();
  });
});
