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
    expect(
      screen.getByRole('region', { name: 'Scrollable movie screenshot gallery' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Quality options' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Watch options' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Related movies' })).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /authorized provider a/i })).not.toBeInTheDocument();
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
