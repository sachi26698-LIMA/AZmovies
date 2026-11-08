import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { PROVIDER_LINKS, getLinkById } from '@/lib/link-fixtures';

const firstLink = getLinkById('lnk-0001')!; // movie 1, 480p, provider Alpha, enabled
const disabledLink = PROVIDER_LINKS.find((link) => link.status === 'disabled')!;
const betaLink = getLinkById('lnk-0004')!; // same movie, 1080p HEVC, provider Beta
const otherMovieLink = getLinkById('lnk-0011')!; // second movie, 480p

test('homepage → detail → quality option → intermediate page → back', async ({ page }) => {
  await page.goto('/');
  await page.locator('article h3 a').first().click();
  await expect(page).toHaveURL(/\/movies\/[^/]+\/?$/);
  const detailUrl = page.url();

  await page.locator('ul[aria-label="Quality option placeholders"] a').first().click();
  await expect(page).toHaveURL(/\/go\/lnk-\d{4}\/?$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Continue to your selected link',
  );

  const details = page.getByRole('region', { name: 'Selected link details' });
  await expect(details).toContainText(firstLink.movieTitle);
  await expect(details).toContainText(firstLink.quality);
  await expect(details).toContainText(firstLink.providerName);
  await expect(page.getByTestId('stored-destination')).toHaveText(firstLink.targetUrl);

  const continueButton = page.getByRole('button', { name: /continue/i });
  await expect(continueButton).toBeVisible();
  await expect(continueButton).toHaveAttribute('aria-disabled', 'true');
  // The control is aria-disabled for assistive tech but still answers a real click with
  // an explanation instead of navigating. Playwright treats aria-disabled as disabled,
  // so force the pointer action the way a real user's click would land.
  await continueButton.click({ force: true });
  await expect(page.getByRole('status')).toContainText('Owner approval is required');
  await expect(page).toHaveURL(/\/go\/lnk-\d{4}\/?$/);
  expect(await page.locator('a[href^="http"]').count()).toBe(0);

  await page.getByRole('link', { name: /back to movie details/i }).click();
  await expect(page).toHaveURL(detailUrl);
});

test('each quality/provider link maps to its own unique destination', async ({ page }) => {
  await page.goto(`/go/${firstLink.id}/`);
  await expect(page.getByTestId('stored-destination')).toHaveText(firstLink.targetUrl);
  const details = page.getByRole('region', { name: 'Selected link details' });
  await expect(details).toContainText(firstLink.providerName);

  await page.goto(`/go/${betaLink.id}/`);
  await expect(page.getByTestId('stored-destination')).toHaveText(betaLink.targetUrl);
  await expect(page.getByRole('region', { name: 'Selected link details' })).toContainText(
    betaLink.providerName,
  );
  expect(betaLink.targetUrl).not.toBe(firstLink.targetUrl);

  await page.goto(`/go/${otherMovieLink.id}/`);
  await expect(page.getByTestId('stored-destination')).toHaveText(otherMovieLink.targetUrl);
  await expect(page.getByRole('region', { name: 'Selected link details' })).toContainText(
    otherMovieLink.movieTitle,
  );
});

test('query parameters cannot change the stored destination', async ({ page }) => {
  await page.goto(`/go/${firstLink.id}/?url=https://evil.example.com/&target=https://evil.com`);
  await expect(page.getByTestId('stored-destination')).toHaveText(firstLink.targetUrl);
  await expect(page.getByRole('button', { name: /continue/i })).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  expect(await page.locator('a[href^="http"]').count()).toBe(0);
});

test('disabled and unknown links show a safe state', async ({ page }) => {
  await page.goto(`/go/${disabledLink.id}/`);
  await expect(page.getByText('Disabled by administrator')).toBeVisible();
  await expect(page.getByRole('button', { name: /continue/i })).toHaveAttribute(
    'aria-disabled',
    'true',
  );

  await page.goto('/go/lnk-9999/');
  await expect(page.getByRole('heading', { name: 'Link not available' })).toBeVisible();
  expect(await page.getByTestId('stored-destination').count()).toBe(0);
});

test('continue endpoint denies safely and is not an open redirect', async ({ request }) => {
  const enabled = await request.get(`/r/${firstLink.id}/`, { maxRedirects: 0 });
  expect(enabled.status()).toBe(403);
  expect(enabled.headers()['location']).toBeUndefined();
  expect(enabled.headers()['cache-control']).toContain('no-store');
  expect(await enabled.text()).toContain('not activated in this prototype');

  const injected = await request.get(`/r/${firstLink.id}/?url=https%3A%2F%2Fevil.example.com%2F`, {
    maxRedirects: 0,
  });
  expect(injected.status()).toBe(403);
  expect(injected.headers()['location']).toBeUndefined();

  const disabled = await request.get(`/r/${disabledLink.id}/`, { maxRedirects: 0 });
  expect(disabled.status()).toBe(410);
  expect(disabled.headers()['location']).toBeUndefined();

  const unknown = await request.get('/r/lnk-9999/', { maxRedirects: 0 });
  expect(unknown.status()).toBe(404);
  expect(unknown.headers()['location']).toBeUndefined();
});

test('prototype admin configures a link independently and the public page follows', async ({
  page,
}) => {
  await page.goto('/admin/links/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Provider link configuration');
  await expect(page.getByText(/no authentication, no server write and no database/i)).toBeVisible();

  await page.getByLabel('Link label').fill('Owner approved extra page');
  await page.getByLabel('Quality / option').fill('2160p');
  await page.getByLabel(/Destination URL/i).fill('https://beta.example.com/watch/extra/2160p');
  await page.getByRole('button', { name: 'Add link' }).click();
  await expect(page.getByRole('status')).toContainText('Added link lnk-c');

  const row = page.getByRole('listitem').filter({ hasText: 'Owner approved extra page' });
  const href = await row.getByRole('link', { name: 'Open intermediate page' }).getAttribute('href');
  expect(href).toMatch(/^\/go\/lnk-c\d{4}\/?$/);

  await page.goto(href!);
  await expect(page.getByTestId('stored-destination')).toHaveText(
    'https://beta.example.com/watch/extra/2160p',
  );
  await expect(page.getByRole('region', { name: 'Selected link details' })).toContainText('2160p');

  await page.goto('/admin/links/');
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Owner approved extra page' })
    .getByRole('button', { name: 'Disable' })
    .click();
  await page.goto(href!);
  await expect(page.getByText('Disabled by administrator')).toBeVisible();

  await page.goto('/admin/links/');
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Owner approved extra page' })
    .getByRole('button', { name: 'Delete' })
    .click();
  await page.goto(href!);
  await expect(page.getByRole('heading', { name: 'Link not available' })).toBeVisible();
});

test('admin rejects a non-approved destination', async ({ page }) => {
  await page.goto('/admin/links/');
  await page.getByLabel('Link label').fill('Unsafe link');
  await page.getByLabel('Quality / option').fill('720p');
  await page.getByLabel(/Destination URL/i).fill('https://evil.example.com/watch/a');
  await page.getByRole('button', { name: 'Add link' }).click();
  // Scope to the form: the Next.js route announcer is also an alert role.
  await expect(
    page.getByRole('form', { name: 'Add a provider link' }).getByRole('alert'),
  ).toContainText('not on the approved destination allowlist');
});

test('@a11y intermediate page and link manager have no serious or critical axe violations', async ({
  page,
}) => {
  for (const path of [`/go/${firstLink.id}/`, `/go/${disabledLink.id}/`, '/admin/links/']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical'),
      path,
    ).toEqual([]);
  }
});

for (const width of [320, 768, 1440]) {
  test(`@responsive intermediate page ${width}px has no overflow and keeps Continue reachable`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/go/${firstLink.id}/`);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(width);
    await expect(page.getByRole('button', { name: /continue/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /back to movie details/i })).toBeVisible();
  });
}
