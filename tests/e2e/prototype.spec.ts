import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const widths = [320, 375, 390, 768, 1024, 1440, 1920];

test('home renders the required static prototype regions', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'AZmovies home' })).toBeVisible();
  await expect(page.getByRole('searchbox', { name: 'Search movies, series, hindi' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Movie categories' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Latest releases' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Catalog pagination' })).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
  await expect(page.locator('article')).toHaveCount(6);
});

test('local search, category filtering and pagination work without APIs', async ({ page }) => {
  const externalRequests: string[] = [];
  page.on('request', (request) => {
    const url = request.url();
    if (!url.startsWith('http://127.0.0.1:3000') && !url.startsWith('data:')) {
      externalRequests.push(url);
    }
  });

  await page.goto('/');
  const search = page.getByRole('searchbox', { name: 'Search movies, series, hindi' });
  await search.fill('zzzz-no-fixture');
  await search.press('Enter');
  await expect(page.getByRole('status')).toContainText('No fixture matches');
  await page.getByRole('button', { name: 'Reset filters' }).click();
  await page.getByRole('button', { name: 'TAMIL', exact: true }).click();
  await expect(page.getByRole('button', { name: 'TAMIL', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.locator('article').first()).toBeVisible();
  await page.getByRole('button', { name: 'TAMIL', exact: true }).click();
  await page.getByRole('button', { name: 'Next page' }).click();
  await expect(page.getByRole('button', { name: 'Page 2' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  expect(externalRequests).toEqual([]);
});

test('drawer is keyboard operable and returns focus', async ({ page }) => {
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Open navigation' });
  await menu.click();
  const dialog = page.getByRole('dialog', { name: 'Site navigation' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('searchbox', { name: 'Search here' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(menu).toBeFocused();
});

test('fixture detail navigation renders required sections and returns home', async ({ page }) => {
  await page.goto('/');
  await page.locator('article h3 a').first().click();
  await expect(page).toHaveURL(/\/movies\/[^/]+\/?$/);
  await expect(page.getByRole('region', { name: 'Trending movies' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Fixture Preview');
  await expect(page.getByRole('region', { name: 'Detailed movie information' })).toContainText(
    'Director:',
  );
  const gallery = page.getByRole('region', { name: 'Scrollable movie screenshot gallery' });
  await expect(gallery).toBeVisible();
  expect(await gallery.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true);
  await expect(page.getByRole('region', { name: 'Quality options' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Watch options' })).toBeVisible();
  await expect(
    page.locator('ul[aria-label="Authorized provider placeholders"] button').first(),
  ).toHaveAttribute('aria-disabled', 'true');
  await expect(page.getByRole('region', { name: 'Related movies' })).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
  expect(await page.locator('a[href^="http"]').count()).toBe(0);
  await page.getByRole('link', { name: /back to catalog/i }).click();
  await expect(page).toHaveURL('/');
});

test('detail toolbar search returns to the homepage fixture search', async ({ page }) => {
  await page.goto('/movies/the-odyssey-protocol-2');
  const search = page.getByRole('searchbox', { name: 'Search here' });
  await search.fill('zzzz-no-fixture');
  await search.press('Enter');
  await expect(page).toHaveURL(/\/\?q=zzzz-no-fixture/);
  await expect(page.getByRole('searchbox', { name: 'Search movies, series, hindi' })).toHaveValue(
    'zzzz-no-fixture',
  );
  await expect(page.getByRole('status')).toContainText('No fixture matches');
});

for (const width of [320, 768, 1440]) {
  test(`@responsive detail ${width}px has no page overflow and keeps related grid`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/movies/the-odyssey-protocol-2');
    const metrics = await page.evaluate(() => {
      const grid = document.querySelector('[aria-label="Related movies"] ul');
      const rects = Array.from(grid?.querySelectorAll(':scope > li') ?? [])
        .slice(0, 2)
        .map((item) => {
          const rect = item.getBoundingClientRect();
          return { x: rect.x, y: rect.y };
        });
      const [first, second] = rects;
      return {
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        relatedTwoColumns: Boolean(
          first && second && Math.abs(first.y - second.y) < 1 && second.x > first.x,
        ),
      };
    });
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth);
    expect(metrics.relatedTwoColumns).toBe(true);
    await expect(page.getByRole('link', { name: 'AZmovies home' })).toBeVisible();
  });
}

test('static boundary: no catalog API or external movie links are exposed', async ({ page }) => {
  const response = await page.goto('/api/movies');
  expect(response?.status()).toBe(404);
  await page.goto('/');
  const externalLinks = await page.locator('a[href^="http"]').count();
  expect(externalLinks).toBe(0);
  await expect(
    page.getByRole('button', { name: 'Telegram link not configured in this prototype' }),
  ).toHaveAttribute('aria-disabled', 'true');
});

test('@a11y home and drawer have no serious or critical axe violations', async ({ page }) => {
  await page.goto('/');
  const homeResults = await new AxeBuilder({ page }).analyze();
  expect(
    homeResults.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical'),
  ).toEqual([]);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  const drawerResults = await new AxeBuilder({ page }).analyze();
  expect(
    drawerResults.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical'),
  ).toEqual([]);
});

test('@a11y fixture detail has no serious or critical axe violations', async ({ page }) => {
  await page.goto('/');
  await page.locator('article h3 a').first().click();
  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical'),
  ).toEqual([]);
});

for (const width of widths) {
  test(`@responsive ${width}px keeps two poster columns without page overflow`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.locator('article h3 a').first().waitFor();
    const metrics = await page.evaluate(() => {
      const grid = document.querySelector('[aria-label="Latest releases"] ul');
      const style = grid ? getComputedStyle(grid) : null;
      return {
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        columns: style?.gridTemplateColumns ?? '',
      };
    });
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth);
    expect(metrics.columns.split(' ').filter(Boolean)).toHaveLength(2);
    await expect(page.getByRole('link', { name: 'AZmovies home' })).toBeVisible();
  });
}

test('@responsive 320px reflow and landscape keep essential controls available', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  await expect(page.getByRole('searchbox', { name: 'Search movies, series, hindi' })).toBeVisible();
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('dialog', { name: 'Site navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(page.getByRole('link', { name: 'AZmovies home' })).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth,
  );
  expect(overflow).toBe(true);
});
