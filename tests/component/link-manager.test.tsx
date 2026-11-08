import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { LinkManagerPrototype } from '@/components/links/LinkManagerPrototype';
import { MOVIES } from '@/lib/fixtures';
import { getPublicLinksForMovie } from '@/lib/link-catalog';
import { EMPTY_LINK_STATE, LINK_STORAGE_KEY, writeLinkState } from '@/lib/link-store';

const movie = MOVIES[0]!;

beforeEach(() => {
  writeLinkState(EMPTY_LINK_STATE);
  window.sessionStorage.clear();
});

function rows() {
  return within(screen.getByRole('region', { name: 'Provider links' })).getAllByRole('listitem');
}

describe('isolated provider link manager demo', () => {
  it('lists safe fixture descriptions with independent demo controls', () => {
    const { container } = render(<LinkManagerPrototype />);
    expect(rows()).toHaveLength(getPublicLinksForMovie(movie.slug).length);
    expect(screen.getAllByRole('button', { name: 'Edit' })).toHaveLength(rows().length);
    expect(screen.getAllByRole('button', { name: 'Delete' })).toHaveLength(rows().length);
    expect(
      screen.getByText(/do not change the public pages or server mappings/i),
    ).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/lnk-\d{4}|https?:\/\//i);
  });

  it('adds an isolated draft while discarding the tested URL', async () => {
    const user = userEvent.setup();
    render(<LinkManagerPrototype />);
    const before = rows().length;
    const testUrl = 'https://beta.example.com/watch/extra/2160p';
    await user.type(screen.getByLabelText('Link label'), 'Extra demo page');
    await user.type(screen.getByLabelText('Quality / option'), '2160p');
    await user.type(screen.getByLabelText(/Test destination URL/i), testUrl);
    await user.click(screen.getByRole('button', { name: 'Add link' }));
    expect(rows()).toHaveLength(before + 1);
    expect(screen.getByRole('status')).toHaveTextContent(/Added a demo option/);
    expect(rows()[before]?.textContent).toContain('Session draft only');
    expect(rows()[before]?.textContent).not.toContain(testUrl);
    expect(window.sessionStorage.getItem(LINK_STORAGE_KEY)).not.toContain(testUrl);
    expect(screen.getByLabelText(/Test destination URL/i)).toHaveValue('');
  });

  it('rejects invalid and non-approved test destinations', async () => {
    const user = userEvent.setup();
    render(<LinkManagerPrototype />);
    const before = rows().length;
    await user.type(screen.getByLabelText('Link label'), 'Bad link');
    await user.type(screen.getByLabelText('Quality / option'), '720p');
    const urlField = screen.getByLabelText(/Test destination URL/i);

    await user.type(urlField, 'http://alpha.example.com/watch/a');
    await user.click(screen.getByRole('button', { name: 'Add link' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Only HTTPS destinations are allowed.');

    await user.clear(urlField);
    await user.type(urlField, 'https://alpha.example.com.evil.com/watch/a');
    await user.click(screen.getByRole('button', { name: 'Add link' }));
    expect(screen.getByRole('alert')).toHaveTextContent(
      /not on the approved destination allowlist/i,
    );
    expect(rows()).toHaveLength(before);
  });

  it('disables, re-enables, edits, deletes and resets independently in the demo', async () => {
    const user = userEvent.setup();
    render(<LinkManagerPrototype />);
    const original = getPublicLinksForMovie(movie.slug)[0]!;
    await user.click(within(rows()[0]!).getByRole('button', { name: 'Disable' }));
    expect(within(rows()[0]!).getByText('Disabled')).toBeInTheDocument();
    expect(getPublicLinksForMovie(movie.slug)[0]?.status).toBe(original.status);

    await user.click(within(rows()[0]!).getByRole('button', { name: 'Enable' }));
    await user.click(within(rows()[0]!).getByRole('button', { name: 'Edit' }));
    const editForm = screen.getByRole('form', { name: 'Edit demo option' });
    const labelField = within(editForm).getByLabelText('Link label');
    await user.clear(labelField);
    await user.type(labelField, 'Renamed demo option');
    expect(within(editForm).getByLabelText(/Test destination URL/i)).toHaveValue('');
    await user.click(within(editForm).getByRole('button', { name: 'Save link' }));
    expect(within(rows()[0]!).getByRole('heading')).toHaveTextContent('Renamed demo option');
    expect(getPublicLinksForMovie(movie.slug)[0]?.label).toBe(original.label);

    const countAfterEdit = rows().length;
    await user.click(within(rows()[0]!).getByRole('button', { name: 'Delete' }));
    expect(rows()).toHaveLength(countAfterEdit - 1);
    await user.click(screen.getByRole('button', { name: 'Reset to fixtures' }));
    expect(rows()).toHaveLength(getPublicLinksForMovie(movie.slug).length);
  });
});
