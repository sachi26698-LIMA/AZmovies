import { act, render, screen, within } from '@testing-library/react';
import axe, { type AxeResults } from 'axe-core';
import { describe, expect, it } from 'vitest';
import {
  IntermediateLinkPrototype,
  type HandoffSummary,
} from '@/components/links/IntermediateLinkPrototype';
import { PUBLIC_LINKS, continuePath } from '@/lib/link-catalog';

const link = PUBLIC_LINKS.find((item) => item.status === 'enabled')!;
const summary: HandoffSummary = {
  movieSlug: link.movieSlug,
  movieTitle: link.movieTitle,
  quality: link.quality,
  providerName: link.providerName,
  continueHref: continuePath(link.movieSlug, link.optionSlug),
  canContinue: false,
  continueMessage: 'External destinations are disabled in this prototype.',
};

describe('public intermediate link page', () => {
  it('shows only the movie, quality, provider and continue information', () => {
    const { container } = render(<IntermediateLinkPrototype selection={summary} />);
    const details = screen.getByRole('region', { name: 'Selected link details' });
    expect(within(details).getByText(link.movieTitle)).toBeInTheDocument();
    expect(within(details).getByText(link.quality)).toBeInTheDocument();
    expect(within(details).getByText(link.providerName)).toBeInTheDocument();
    expect(within(details).getAllByRole('term')).toHaveLength(3);
    expect(container.textContent).not.toMatch(
      /link reference|stored destination|lnk-\d{4}|https?:\/\//i,
    );
    expect(document.querySelectorAll('a[href^="http"]')).toHaveLength(0);
    expect(screen.getByRole('link', { name: /back to movie details/i })).toHaveAttribute(
      'href',
      expect.stringMatching(new RegExp(`^/movies/${link.movieSlug}/?$`)),
    );
  });

  it('uses a genuinely disabled Continue button and an internal-only form action', () => {
    render(<IntermediateLinkPrototype selection={summary} />);
    const button = screen.getByRole('button', { name: /continue/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAccessibleDescription(/disabled in this prototype/i);
    expect(button.closest('form')).toHaveAttribute('action', summary.continueHref);
  });

  it('explains an individually disabled option without exposing internal details', () => {
    render(
      <IntermediateLinkPrototype
        selection={{ ...summary, continueMessage: 'This option is currently unavailable.' }}
      />,
    );
    expect(screen.getByText('This option is currently unavailable.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue/i })).toBeDisabled();
    expect(screen.queryByText(/link reference|stored destination/i)).not.toBeInTheDocument();
  });

  it('has no serious jsdom axe violations outside canvas-dependent visual rules', async () => {
    const { container } = render(<IntermediateLinkPrototype selection={summary} />);
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
