import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe, { type AxeResults } from 'axe-core';
import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { IntermediateLinkPrototype } from '@/components/links/IntermediateLinkPrototype';
import { PROVIDER_LINKS, getLinkById } from '@/lib/link-fixtures';
import { EMPTY_LINK_STATE, writeLinkState } from '@/lib/link-store';

const enabledLink = PROVIDER_LINKS.find((link) => link.status === 'enabled')!;
const disabledLink = PROVIDER_LINKS.find((link) => link.status === 'disabled')!;

beforeEach(() => {
  writeLinkState(EMPTY_LINK_STATE);
  window.sessionStorage.clear();
});

describe('intermediate link page (Page 3)', () => {
  it('shows the selected movie, quality, provider and exact stored destination', () => {
    render(<IntermediateLinkPrototype linkId={enabledLink.id} />);
    const details = screen.getByRole('region', { name: 'Selected link details' });
    expect(
      within(details).getByText(enabledLink.movieTitle, { selector: 'h2' }),
    ).toBeInTheDocument();
    expect(within(details).getByText(enabledLink.quality)).toBeInTheDocument();
    expect(within(details).getByText(enabledLink.providerName)).toBeInTheDocument();
    expect(screen.getByTestId('stored-destination')).toHaveTextContent(enabledLink.targetUrl);
    expect(screen.getByRole('link', { name: /back to movie details/i }).getAttribute('href')).toBe(
      `/movies/${enabledLink.movieSlug}`,
    );
    expect(document.querySelectorAll('a[href^="http"]')).toHaveLength(0);
  });

  it('offers a prominent Continue control that stays inert while activation is off', async () => {
    const user = userEvent.setup();
    render(<IntermediateLinkPrototype linkId={enabledLink.id} />);
    const continueButton = screen.getByRole('button', { name: /continue/i });
    expect(continueButton).toHaveAttribute('aria-disabled', 'true');
    expect(continueButton).toHaveAccessibleDescription(/not activated in this prototype/i);
    await user.click(continueButton);
    expect(screen.getByRole('status')).toHaveTextContent(/owner approval is required/i);
    expect(window.location.pathname).toBe('/');
  });

  it('renders the disabled state for an individually disabled link', () => {
    render(<IntermediateLinkPrototype linkId={disabledLink.id} />);
    expect(screen.getByText('Disabled by administrator')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue/i })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(screen.getByText(/disabled by the site administrator/i)).toBeInTheDocument();
  });

  it('treats deleted and unknown links as unavailable without showing a destination', () => {
    writeLinkState({ overrides: { [enabledLink.id]: { deleted: true } }, added: [] });
    const { unmount } = render(<IntermediateLinkPrototype linkId={enabledLink.id} />);
    expect(screen.getByRole('heading', { name: 'Link not available' })).toBeInTheDocument();
    expect(screen.queryByTestId('stored-destination')).not.toBeInTheDocument();
    unmount();
    render(<IntermediateLinkPrototype linkId="lnk-9999" />);
    expect(screen.getByRole('heading', { name: 'Link not available' })).toBeInTheDocument();
  });

  it('reflects an individual prototype edit without changing sibling links', () => {
    writeLinkState({
      overrides: {
        [enabledLink.id]: {
          quality: '2160p REMUX',
          providerName: 'Fixture Provider Beta',
          targetUrl: 'https://beta.example.com/watch/edited/2160p',
        },
      },
      added: [],
    });
    render(<IntermediateLinkPrototype linkId={enabledLink.id} />);
    expect(screen.getByText('2160p REMUX')).toBeInTheDocument();
    expect(screen.getByTestId('stored-destination')).toHaveTextContent(
      'https://beta.example.com/watch/edited/2160p',
    );
    expect(getLinkById(enabledLink.id)?.targetUrl).toBe(enabledLink.targetUrl);
  });

  it('has no serious jsdom axe violations outside canvas-dependent visual rules', async () => {
    const { container } = render(<IntermediateLinkPrototype linkId={enabledLink.id} />);
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
