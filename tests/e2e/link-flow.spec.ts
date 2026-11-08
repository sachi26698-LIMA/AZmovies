import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { MOVIES } from '@/lib/fixtures';
import { PUBLIC_LINKS, continuePath, intermediatePath } from '@/lib/link-catalog';

const firstMovie = MOVIES[0]!;
const movieLinks = PUBLIC_LINKS.filter((link) => link.movieSlug === firstMovie.slug);
const firstLink = movieLinks.find((link) => link.kind === 'quality' && link.status === 'enabled')!;
const disabledLink = movieLinks.find((link) => link.status === 'disabled')!;

const pathFor = (link: (typeof PUBLIC_LINKS)[number]) =>
  intermediatePath(link.movieSlug, link.optionSlug);
const continueFor = (link: (typeof PUBLIC_LINKS)[number]) =>
  continuePath(link.movieSlug, link.optionSlug);

test('homepage → movie details → selected quality → Page 3 → explicit and browser Back', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('article h3 a').first().click();
  await expect(page).toHaveURL(new RegExp(`/movies/${firstMovie.slug}/?$`));
  const detailUrl = page.url();
  await page.locator('ul[aria-label="Quality option placeholders"] a').first().click();
  await expect(page).toHaveURL(new RegExp(`${pathFor(firstLink)}$`));
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Continue to your selected link',
  );
  const details = page.getByRole('region', { name: 'Selected link details' });
  await expect(details).toContainText(firstLink.movieTitle);
  await expect(details).toContainText(firstLink.quality);
  await expect(details).toContainText(firstLink.providerName);
  await expect(page.getByRole('button', { name: /^continue/i })).toBeDisabled();
  await expect(
    page.getByText(/external destinations are disabled in this prototype/i),
  ).toBeVisible();
  await page.getByRole('link', { name: /back to movie details/i }).click();
  await expect(page).toHaveURL(detailUrl);
  await page.goBack();
  await expect(page).toHaveURL(new RegExp(`${pathFor(firstLink)}$`));
  await page.goBack();
  await expect(page).toHaveURL(detailUrl);
});

test('every quality option opens the matching safe server-backed selection', async ({
  page,
  request,
}) => {
  const choices = movieLinks.filter((link) => link.kind === 'quality');
  expect(choices).toHaveLength(6);
  for (const link of choices) {
    const response = await page.goto(pathFor(link));
    expect(response?.status(), pathFor(link)).toBe(200);
    const details = page.getByRole('region', { name: 'Selected link details' });
    await expect(details).toContainText(link.movieTitle);
    await expect(details).toContainText(link.quality);
    await expect(details).toContainText(link.providerName);
    await expect(page.getByRole('button', { name: /^continue/i })).toBeDisabled();
    expect(page.url()).not.toMatch(/lnk-\d{4}/);
    const denied = await request.get(continueFor(link), { maxRedirects: 0 });
    expect(denied.status()).toBe(link.status === 'disabled' ? 410 : 403);
    expect(denied.headers()['location']).toBeUndefined();
  }
});

test('invalid, disabled and legacy internal-ID links fail safely', async ({ page, request }) => {
  await page.goto(`/movies/${firstMovie.slug}/`);
  const disabledOption = page
    .locator('ul[aria-label="Quality option placeholders"] button')
    .filter({ hasText: disabledLink.label });
  await expect(disabledOption).toBeDisabled();

  await page.goto(pathFor(disabledLink));
  await expect(page.getByText('This option is currently unavailable.')).toBeVisible();
  await expect(page.getByRole('button', { name: /^continue/i })).toBeDisabled();

  const invalid = await page.goto(`/go/${firstMovie.slug}/not-a-choice/`);
  expect(invalid?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: /fixture not found/i })).toBeVisible();
  const invalidContinue = await request.get(`/r/${firstMovie.slug}/not-a-choice/`, {
    maxRedirects: 0,
  });
  expect(invalidContinue.status()).toBe(404);
  expect(invalidContinue.headers()['location']).toBeUndefined();
  expect((await request.get('/go/lnk-0001/', { maxRedirects: 0 })).status()).toBe(404);
  expect((await request.get('/r/lnk-0001/', { maxRedirects: 0 })).status()).toBe(404);
});

test('query parameters cannot change the server mapping or trigger a redirect', async ({
  page,
  request,
}) => {
  await page.goto(`${pathFor(firstLink)}?url=https://evil.example.com/&target=https://evil.com`);
  await expect(page.getByRole('region', { name: 'Selected link details' })).toContainText(
    firstLink.quality,
  );
  await expect(page.getByRole('button', { name: /^continue/i })).toBeDisabled();
  expect(await page.locator('a[href^="http"]').count()).toBe(0);
  const injected = await request.get(
    `${continueFor(firstLink)}?url=https%3A%2F%2Fevil.example.com%2F`,
    { maxRedirects: 0 },
  );
  expect(injected.status()).toBe(403);
  expect(injected.headers()['location']).toBeUndefined();
  expect(injected.headers()['cache-control']).toContain('no-store');
});

test('public HTML and served JavaScript do not expose server fixture targets or internal IDs', async ({
  request,
}) => {
  const paths = ['/', `/movies/${firstMovie.slug}/`, pathFor(firstLink), '/admin/links/'];
  const scripts = new Set<string>();
  for (const path of paths) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    expect(html, path).not.toMatch(/lnk-\d{4}|https?:\/\/(?:alpha|beta)\.example\.com\//i);
    expect(html, path).not.toContain('Stored destination');
    expect(html, path).not.toContain('Link reference');
    for (const match of html.matchAll(/<script[^>]+src="([^"]+\.js(?:\?[^"]*)?)"/g)) {
      if (match[1]?.startsWith('/_next/static/')) scripts.add(match[1]);
    }
  }
  expect(scripts.size).toBeGreaterThan(0);
  for (const src of scripts) {
    const response = await request.get(src);
    expect(response.status(), src).toBe(200);
    const body = await response.text();
    expect(body, src).not.toContain('lnk-');
    expect(body, src).not.toMatch(/https?:\/\/(?:alpha|beta)\.example\.com\//i);
    expect(body, src).not.toContain('q-720-hevc');
  }
});

test('client navigation RSC payloads do not expose server records or destinations', async ({
  page,
}) => {
  const payloads: Array<Promise<string>> = [];
  const observedPaths = new Set<string>();
  page.on('response', (response) => {
    const path = new URL(response.url()).pathname;
    const isTarget = path === `/movies/${firstMovie.slug}/` || path === pathFor(firstLink);
    if (isTarget && response.headers()['content-type']?.includes('text/x-component')) {
      observedPaths.add(path);
      payloads.push(response.text());
    }
  });

  await page.goto('/');
  await page.locator('article h3 a').first().click();
  await page.locator('ul[aria-label="Quality option placeholders"] a').first().click();
  await expect(page).toHaveURL(new RegExp(`${pathFor(firstLink)}$`));
  await expect.poll(() => observedPaths.size).toBe(2);
  for (const payload of await Promise.all(payloads)) {
    expect(payload).not.toMatch(
      /lnk-|fixture-\d{3}|https?:\/\/(?:alpha|beta)\.example\.com\/|q-(?:480|720-hevc|720-x264|1080-hevc|1080-x264|hq-1080)/i,
    );
  }
});

test('isolated manager drafts do not expose a stored URL or change public pages', async ({
  page,
}) => {
  await page.goto('/admin/links/');
  await expect(page.getByText(/do not change the public pages or server mappings/i)).toBeVisible();
  const firstRow = page
    .getByRole('region', { name: 'Provider links' })
    .getByRole('listitem')
    .first();
  await firstRow.getByRole('button', { name: 'Disable' }).click();
  await expect(firstRow).toContainText('Disabled');

  const testUrl = 'https://beta.example.com/watch/demo/2160p';
  await page.getByLabel('Link label').fill('Extra demo page');
  await page.getByLabel('Quality / option').fill('2160p');
  await page.getByLabel(/Test destination URL/i).fill(testUrl);
  await page.getByRole('button', { name: 'Add link' }).click();
  const row = page.getByRole('listitem').filter({ hasText: 'Extra demo page' });
  await expect(row).toContainText('Draft only; no public page');
  await expect(row).not.toContainText(testUrl);
  expect(
    await page.evaluate(() => window.sessionStorage.getItem('azmovies.prototype.link-demo.v2')),
  ).not.toContain(testUrl);

  await page.goto(pathFor(firstLink));
  await expect(
    page.getByText('External destinations are disabled in this prototype.'),
  ).toBeVisible();
  await expect(page.getByText('This option is currently unavailable.')).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'Selected link details' })).toContainText(
    firstLink.quality,
  );
});

test('manager rejects a non-approved test URL', async ({ page }) => {
  await page.goto('/admin/links/');
  await page.getByLabel('Link label').fill('Unsafe link');
  await page.getByLabel('Quality / option').fill('720p');
  await page.getByLabel(/Test destination URL/i).fill('https://evil.example.com/watch/a');
  await page.getByRole('button', { name: 'Add link' }).click();
  await expect(
    page.getByRole('form', { name: 'Add a provider link' }).getByRole('alert'),
  ).toContainText('not on the approved destination allowlist');
});

test('@a11y intermediate and isolated manager have no serious or critical axe violations', async ({
  page,
}) => {
  for (const path of [pathFor(firstLink), pathFor(disabledLink), '/admin/links/']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.filter(
        (violation) => violation.impact === 'serious' || violation.impact === 'critical',
      ),
      path,
    ).toEqual([]);
  }
});

for (const width of [320, 360, 390, 768, 1440]) {
  test(`@responsive Page 3 at ${width}px has no overflow and keeps actions reachable`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(pathFor(firstLink));
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width,
    );
    await expect(page.getByRole('button', { name: /^continue/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /back to movie details/i })).toBeVisible();
  });
}
