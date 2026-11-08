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

  it('uses only local descriptive paths and keeps the trailer unconfigured', () => {
    const detail = getMovieDetail('the-odyssey-protocol-2')!;
    const options = [...detail.qualityOptions, ...detail.watchOptions, ...detail.providerLinks];
    expect(options.every((link) => link.href?.startsWith('/go/'))).toBe(true);
    expect(detail.trailer.href).toBeNull();
    expect(JSON.stringify(options)).not.toMatch(/lnk-\d{4}|https?:\/\//i);
    expect(detail.screenshots.every((shot) => shot.src.startsWith('/stills/'))).toBe(true);
  });

  it('does not call a single-language fixture multi-audio', () => {
    const movie = MOVIES.find((item) => item.languages.length === 1)!;
    const detail = getMovieDetail(movie.slug)!;
    expect(detail.languageLabel).toBe(`${movie.languages[0]} / ESubs`);
    expect(detail.languageLabel).not.toContain('Multi Audio');
  });

  it('returns undefined for unknown slugs', () => {
    expect(getMovieDetail('missing-fixture')).toBeUndefined();
  });
});
