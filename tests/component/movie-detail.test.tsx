import { render, screen } from '@testing-library/react';
import axe, { type AxeResults } from 'axe-core';
import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MovieDetailPrototype } from '@/components/movies/MovieDetailPrototype';
import { getMovieDetail } from '@/lib/detail-fixtures';

describe('movie detail prototype', () => {
  it('renders shared shell and required static detail sections', () => {
    const detail = getMovieDetail('the-odyssey-protocol-2')!;
    render(<MovieDetailPrototype detail={detail} />);
    expect(screen.getByRole('link', { name: 'AZmovies home' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Trending movies' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Fixture Preview');
    expect(screen.getByRole('region', { name: 'Detailed movie information' })).toHaveTextContent(
      'Director:',
    );
    expect(screen.getByRole('region', { name: 'Movie screenshot gallery' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Quality options' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Watch options' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Related movies' })).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    // Page 3 flow: options now open an internal intermediate page, never an external host.
    const providerOption = screen.getByRole('link', { name: /fixture provider a/i });
    expect(providerOption.getAttribute('href')).toMatch(
      /^\/go\/the-odyssey-protocol-2\/provider-a\/?$/,
    );
    expect(document.querySelectorAll('a[href^="http"]')).toHaveLength(0);
  });

  it('does not claim multi-audio or dubbing for a single-language fixture', () => {
    const detail = getMovieDetail('the-great-indian-comedy-night-5')!;
    render(<MovieDetailPrototype detail={detail} />);
    expect(screen.getByRole('list', { name: 'Release date and genres' })).not.toHaveTextContent(
      /dual audio|multi audio/i,
    );
    const info = screen.getByRole('region', { name: 'Detailed movie information' });
    expect(info).not.toHaveTextContent(/dubbed/i);
    expect(info).toHaveTextContent('Hindi');
  });

  it('has no serious jsdom axe violations outside canvas-dependent visual rules', async () => {
    const detail = getMovieDetail('the-odyssey-protocol-2')!;
    const { container } = render(<MovieDetailPrototype detail={detail} />);
    let results: AxeResults | null = null;
    await act(async () => {
      results = await axe.run(container, {
        rules: {
          region: { enabled: false },
          'landmark-one-main': { enabled: false },
          'color-contrast': { enabled: false },
          'label-content-name-mismatch': { enabled: false },
        },
      });
    });
    expect((results as unknown as AxeResults).violations).toEqual([]);
  });
});
