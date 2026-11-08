import { describe, expect, it } from 'vitest';
import { MOVIES, PAGE_SIZE, filterMovies, getMovie, posterSrc } from '@/lib/fixtures';

describe('static fixture catalog', () => {
  it('provides 48 synthetic movies in pages of six', () => {
    expect(MOVIES).toHaveLength(48);
    expect(PAGE_SIZE).toBe(6);
    expect(new Set(MOVIES.map((movie) => movie.slug)).size).toBe(48);
  });

  it('filters by case-insensitive title query and category', () => {
    expect(filterMovies('aranya', null).length).toBeGreaterThan(0);
    expect(filterMovies('', 'TAMIL').every((movie) => movie.categories.includes('TAMIL'))).toBe(
      true,
    );
    expect(filterMovies('zzzz-no-fixture', null)).toEqual([]);
    expect(filterMovies('', 'ANIME')).toEqual([]);
  });

  it('uses descriptive slugs instead of synthetic record IDs and labels audio consistently', () => {
    expect(MOVIES.every((movie) => !('id' in movie))).toBe(true);
    expect(MOVIES.every((movie) => !movie.languages.includes('Multi Audio'))).toBe(true);
    const singleLanguage = MOVIES.find((movie) => movie.languages.length === 1)!;
    expect(singleLanguage.displayTitle).toContain(`${singleLanguage.languages[0]} Audio`);
    expect(singleLanguage.displayTitle).not.toMatch(/dual audio|multi audio/i);
    const twoLanguages = MOVIES.find((movie) => movie.languages.length === 2)!;
    expect(twoLanguages.displayTitle).toContain('Dual Audio');
    const threeLanguages = MOVIES.find((movie) => movie.languages.length > 2)!;
    expect(threeLanguages.displayTitle).toContain('Multi Audio');
  });

  it('resolves detail slugs and local poster paths only', () => {
    const movie = MOVIES[0]!;
    expect(getMovie(movie.slug)).toEqual(movie);
    expect(getMovie('missing-fixture')).toBeUndefined();
    expect(posterSrc(movie.poster)).toMatch(/^\/posters\/fixture-[a-z]+\.jpg$/);
  });
});
