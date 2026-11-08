import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { LinkManagerPrototype } from '@/components/links/LinkManagerPrototype';
import { MOVIES } from '@/lib/fixtures';
import { getLinksForMovie } from '@/lib/link-fixtures';
import { EMPTY_LINK_STATE, writeLinkState } from '@/lib/link-store';

const movie = MOVIES[0]!;

beforeEach(() => {
  writeLinkState(EMPTY_LINK_STATE);
  window.sessionStorage.clear();
});

function rows() {
  return within(screen.getByRole('region', { name: 'Provider links' })).getAllByRole('listitem');
}

describe('prototype provider link manager', () => {
  it('lists every link of the selected movie with independent controls', () => {
    render(<LinkManagerPrototype />);
    expect(rows()).toHaveLength(getLinksForMovie(movie.slug).length);
    expect(screen.getAllByRole('button', { name: 'Edit' }).length).toBe(rows().length);
    expect(screen.getAllByRole('button', { name: 'Delete' }).length).toBe(rows().length);
    expect(
      screen.getByText(/no authentication, no server write and no database/i),
    ).toBeInTheDocument();
  });

  it('adds an individually configured link with a validated HTTPS destination', async () => {
    const user = userEvent.setup();
    render(<LinkManagerPrototype />);
    const before = rows().length;
    await user.type(screen.getByLabelText('Link label'), 'Extra authorized page');
    await user.type(screen.getByLabelText('Quality / option'), '2160p');
    await user.type(
      screen.getByLabelText(/Destination URL/i),
      'https://beta.example.com/watch/extra/2160p',
    );
    await user.click(screen.getByRole('button', { name: 'Add link' }));
    expect(rows()).toHaveLength(before + 1);
    expect(screen.getByRole('status')).toHaveTextContent(/Added link lnk-c\d{4}/);
    expect(rows()[before]?.textContent).toContain('https://beta.example.com/watch/extra/2160p');
  });

  it('rejects invalid and non-approved destinations and creates nothing', async () => {
    const user = userEvent.setup();
    render(<LinkManagerPrototype />);
    const before = rows().length;
    await user.type(screen.getByLabelText('Link label'), 'Bad link');
    await user.type(screen.getByLabelText('Quality / option'), '720p');
    const urlField = screen.getByLabelText(/Destination URL/i);

    await user.type(urlField, 'http://alpha.example.com/watch/a');
    await user.click(screen.getByRole('button', { name: 'Add link' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Only HTTPS destinations are allowed.');

    await user.clear(urlField);
    await user.type(urlField, 'https://alpha.example.com.evil.com/watch/a');
    await user.click(screen.getByRole('button', { name: 'Add link' }));
    expect(screen.getByRole('alert')).toHaveTextContent(
      /not on the approved destination allowlist/i,
    );

    await user.clear(urlField);
    await user.type(urlField, 'javascript:alert(1)');
    await user.click(screen.getByRole('button', { name: 'Add link' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Only HTTPS destinations are allowed.');
    expect(rows()).toHaveLength(before);
  });

  it('disables, re-enables, edits and deletes a single link', async () => {
    const user = userEvent.setup();
    render(<LinkManagerPrototype />);
    const firstRow = rows()[0]!;
    const linkLabel = within(firstRow).getByRole('heading').textContent!;

    await user.click(within(firstRow).getByRole('button', { name: 'Disable' }));
    expect(within(rows()[0]!).getByText('Disabled')).toBeInTheDocument();
    expect(within(rows()[2]!).getByText('Enabled')).toBeInTheDocument();

    await user.click(within(rows()[0]!).getByRole('button', { name: 'Enable' }));
    expect(within(rows()[0]!).getByText('Enabled')).toBeInTheDocument();

    await user.click(within(rows()[0]!).getByRole('button', { name: 'Edit' }));
    const editForm = screen.getByRole('form', { name: /^Edit lnk-/ });
    const labelField = within(editForm).getByLabelText('Link label');
    await user.clear(labelField);
    await user.type(labelField, 'Renamed option');
    await user.click(within(editForm).getByRole('button', { name: 'Save link' }));
    expect(within(rows()[0]!).getByRole('heading')).toHaveTextContent('Renamed option');
    expect(within(rows()[2]!).getByRole('heading')).not.toHaveTextContent('Renamed option');
    expect(linkLabel).not.toBe('Renamed option');

    const countAfterEdit = rows().length;
    await user.click(within(rows()[0]!).getByRole('button', { name: 'Delete' }));
    expect(rows()).toHaveLength(countAfterEdit - 1);
    expect(screen.getByRole('status')).toHaveTextContent(/Deleted link/);

    await user.click(screen.getByRole('button', { name: 'Reset to fixtures' }));
    expect(rows()).toHaveLength(getLinksForMovie(movie.slug).length);
  });
});
