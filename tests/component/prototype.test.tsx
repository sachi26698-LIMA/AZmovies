import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe, { type AxeResults } from 'axe-core';
import { describe, expect, it, vi } from 'vitest';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/layout/SearchBar';
import { CategoryButtons } from '@/components/layout/CategoryButtons';
import { SideDrawer } from '@/components/layout/SideDrawer';
import { Footer } from '@/components/layout/Footer';
import { TelegramFloating } from '@/components/layout/TelegramFloating';
import { MovieCard } from '@/components/movies/MovieCard';
import { MovieGrid } from '@/components/movies/MovieGrid';
import { Pagination, paginationItems } from '@/components/movies/Pagination';
import { EmptyCatalog, ErrorCatalog, LoadingCatalog } from '@/components/movies/CatalogStates';
import { PrototypeHome } from '@/components/PrototypeHome';
import { MOVIES } from '@/lib/fixtures';

async function expectNoAxeViolations(container: HTMLElement) {
  let results: AxeResults | null = null;
  await act(async () => {
    results = await axe.run(container, {
      rules: {
        region: { enabled: false },
        'landmark-one-main': { enabled: false },
        // jsdom has no canvas/color engine; Chromium axe covers these visual checks below.
        'color-contrast': { enabled: false },
        'label-content-name-mismatch': { enabled: false },
      },
    });
  });
  expect((results as unknown as AxeResults).violations).toEqual([]);
}

describe('header and search', () => {
  it('renders AZmovies branding and accessible controls', async () => {
    const onOpenMenu = vi.fn();
    const { container } = render(<Header onOpenMenu={onOpenMenu} />);
    expect(screen.getByRole('link', { name: 'AZmovies home' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
    expect(onOpenMenu).toHaveBeenCalledOnce();
    await expectNoAxeViolations(container);
  });

  it('submits a labeled bounded search query', async () => {
    const onSubmit = vi.fn();
    const onChange = vi.fn();
    const { rerender } = render(<SearchBar value="" onChange={onChange} onSubmit={onSubmit} />);
    const input = screen.getByRole('searchbox', { name: 'Search movies, series, hindi' });
    expect(input).toHaveAttribute('maxlength', '80');
    await userEvent.type(input, 'odia');
    expect(onChange).toHaveBeenLastCalledWith('a');
    rerender(<SearchBar value="odia" onChange={onChange} onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(onSubmit).toHaveBeenLastCalledWith('odia');
  });
});

describe('categories and drawer', () => {
  it('exposes category state and keeps unconfigured actions inert', async () => {
    const onSelect = vi.fn();
    const { container } = render(<CategoryButtons activeCategory="TAMIL" onSelect={onSelect} />);
    expect(screen.getByRole('button', { name: 'TAMIL' })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(screen.getByRole('button', { name: 'HINDI' }));
    expect(onSelect).toHaveBeenCalledWith('HINDI');
    expect(screen.getByRole('button', { name: 'JOIN TELEGRAM' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(screen.queryByRole('link', { name: 'DOWNLOAD APP' })).not.toBeInTheDocument();
    await expectNoAxeViolations(container);
  });

  it('opens a modal drawer, traps focus and closes on Escape', async () => {
    const onClose = vi.fn();
    render(<SideDrawer open onClose={onClose} onNavigate={vi.fn()} onSearch={vi.fn()} />);
    const dialog = screen.getByRole('dialog', { name: 'Site navigation' });
    expect(within(dialog).getByRole('searchbox', { name: 'Search here' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });
});

describe('movie cards and grid', () => {
  it('renders required metadata and an internal fixture detail link', async () => {
    const movie = MOVIES[0]!;
    const { container } = render(<MovieCard movie={movie} />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(movie.displayTitle);
    expect(screen.getByAltText(`${movie.title} fixture poster`)).toBeInTheDocument();
    expect(screen.getAllByRole('link')[0]).toHaveAttribute('href', `/movies/${movie.slug}/`);
    await expectNoAxeViolations(container);
  });

  it('renders a semantic two-column fixture grid', () => {
    render(<MovieGrid movies={MOVIES.slice(0, 6)} />);
    expect(screen.getByRole('region', { name: 'Latest releases' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(6);
  });
});

describe('pagination', () => {
  it('builds reference-style first/middle/last page items', () => {
    expect(paginationItems(1, 8)).toEqual([1, 2, 3, 'ellipsis', 8]);
    expect(paginationItems(5, 8)).toEqual([1, 'ellipsis', 5, 'ellipsis', 8]);
    expect(paginationItems(8, 8)).toEqual([1, 'ellipsis', 6, 7, 8]);
    expect(paginationItems(1, 1)).toEqual([]);
  });

  it('marks the current page and navigates next', async () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={8} onPageChange={onPageChange} />);
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});

describe('footer, Telegram and states', () => {
  it('renders footer without active external destinations', async () => {
    const { container } = render(<Footer />);
    expect(screen.getByText(/2026 ©/)).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    await expectNoAxeViolations(container);
  });

  it('does not invent a Telegram destination when unset', () => {
    render(<TelegramFloating href={null} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Telegram link not configured in this prototype' }),
    ).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders empty, loading and error states with recovery controls', async () => {
    const onReset = vi.fn();
    const { rerender } = render(<EmptyCatalog onReset={onReset} />);
    await userEvent.click(screen.getByRole('button', { name: 'Reset filters' }));
    expect(onReset).toHaveBeenCalledOnce();
    rerender(<LoadingCatalog />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading fixtures');
    rerender(<ErrorCatalog onRetry={vi.fn()} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Preview unavailable');
  });
});

describe('static home prototype', () => {
  it('filters fixtures locally and resets an empty search', async () => {
    render(<PrototypeHome />);
    const input = screen.getByRole('searchbox', { name: 'Search movies, series, hindi' });
    await userEvent.type(input, 'zzzz-no-fixture');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(screen.getByRole('status')).toHaveTextContent('No fixture matches');
    await userEvent.click(screen.getByRole('button', { name: 'Reset filters' }));
    expect(screen.getAllByRole('article')).toHaveLength(6);
  });

  it('has no serious automated accessibility violations in jsdom', async () => {
    const { container } = render(<PrototypeHome />);
    await expectNoAxeViolations(container);
  });
});
