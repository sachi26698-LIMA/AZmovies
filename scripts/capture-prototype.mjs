import { chromium as playwrightChromium } from '@playwright/test';
import chromium, { inflate, setupLambdaEnvironment } from '@sparticuz/chromium';
import { mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const out = '.artifacts/phase2';
mkdirSync(out, { recursive: true });
const baseURL = process.env.PROTOTYPE_URL ?? 'http://127.0.0.1:3000';
const executablePath = await chromium.executablePath();
await inflate(join(process.cwd(), 'node_modules/@sparticuz/chromium/bin/al2023.tar.br'));
setupLambdaEnvironment(join(tmpdir(), 'al2023', 'lib'));
const browser = await playwrightChromium.launch({
  executablePath,
  args: chromium.args.filter((arg) => arg !== '--single-process'),
  headless: true,
});

async function settled(page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images).map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              img.addEventListener('load', resolve, { once: true });
              img.addEventListener('error', resolve, { once: true });
            }),
      ),
    );
  });
}

async function metrics(page) {
  return page.evaluate(() => {
    const rect = (selector) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    };
    const grid = document.querySelector('[aria-label="Latest releases"] ul');
    const cards = Array.from(document.querySelectorAll('[aria-label="Latest releases"] li')).slice(
      0,
      2,
    );
    const cardRects = cards.map((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    });
    return {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        dpr: window.devicePixelRatio,
      },
      header: rect('header > div'),
      search: rect('input[type="search"]'),
      firstCategory: rect('nav[aria-label="Movie categories"] button'),
      gridColumns: grid ? getComputedStyle(grid).gridTemplateColumns : null,
      gridGap: grid ? getComputedStyle(grid).gap : null,
      firstCards: cardRects,
      posterFrame: rect('article span'),
      pagination: rect('nav[aria-label="Catalog pagination"]'),
      footer: rect('footer'),
      telegram: rect('button[aria-label^="Telegram"]'),
      scrollWidth: document.documentElement.scrollWidth,
    };
  });
}

const context360 = await browser.newContext({
  viewport: { width: 360, height: 722 },
  deviceScaleFactor: 3,
  reducedMotion: 'reduce',
});
const page360 = await context360.newPage();
await page360.goto(baseURL);
await settled(page360);
await page360.screenshot({ path: `${out}/prototype-360-top.png` });
await page360.screenshot({ path: `${out}/prototype-360-full.png`, fullPage: true });
const metrics360 = await metrics(page360);
await page360.getByRole('button', { name: 'Open navigation' }).click();
await page360.screenshot({ path: `${out}/prototype-360-drawer.png` });
await page360.keyboard.press('Escape');
await page360.locator('article h3 a').first().click();
await settled(page360);
await page360.screenshot({ path: `${out}/prototype-360-detail-top.png` });
await page360.screenshot({ path: `${out}/prototype-360-detail.png`, fullPage: true });
await page360
  .getByRole('region', { name: 'Scrollable movie screenshot gallery' })
  .scrollIntoViewIfNeeded();
await settled(page360);
await page360.screenshot({ path: `${out}/prototype-360-detail-gallery.png` });
await page360.locator('#quality-options').scrollIntoViewIfNeeded();
await settled(page360);
await page360.screenshot({ path: `${out}/prototype-360-detail-options.png` });
const detailMetrics = await page360.evaluate(() => {
  const gallery = document.querySelector('[aria-label="Scrollable movie screenshot gallery"]');
  return {
    url: location.pathname,
    scrollWidth: document.documentElement.scrollWidth,
    galleryScrollHeight: gallery?.scrollHeight ?? 0,
    galleryClientHeight: gallery?.clientHeight ?? 0,
    relatedCards: document.querySelectorAll('[aria-label="Related movies"] article').length,
    externalLinks: document.querySelectorAll('a[href^="http"]').length,
  };
});
// Page 3: read the disabled option id from the detail page, then follow the real
// journey into the intermediate link page instead of deep-linking to a guessed id.
const disabledLinkId = await page360
  .locator('ul[aria-label="Quality option placeholders"] button[aria-disabled="true"]')
  .first()
  .getAttribute('data-link-id');
await page360.locator('ul[aria-label="Quality option placeholders"] a').first().click();
await settled(page360);
await page360.screenshot({ path: `${out}/prototype-360-link-top.png` });
await page360.screenshot({ path: `${out}/prototype-360-link-full.png`, fullPage: true });
const linkMetrics = await page360.evaluate(() => {
  const button = Array.from(document.querySelectorAll('button')).find((el) =>
    el.textContent?.includes('Continue'),
  );
  const rect = button?.getBoundingClientRect();
  return {
    url: location.pathname,
    scrollWidth: document.documentElement.scrollWidth,
    storedDestination: document.querySelector('[data-testid="stored-destination"]')?.textContent,
    continueAriaDisabled: button?.getAttribute('aria-disabled') ?? null,
    continueRect: rect ? { width: Math.round(rect.width), height: Math.round(rect.height) } : null,
    externalLinks: document.querySelectorAll('a[href^="http"]').length,
    metaRefresh: document.querySelectorAll('meta[http-equiv="refresh"]').length,
  };
});
// The Continue control is aria-disabled but explains itself on click; force the
// pointer action so the captured state shows the real denial message.
await page360.getByRole('button', { name: /continue/i }).click({ force: true });
await settled(page360);
await page360.screenshot({ path: `${out}/prototype-360-link-continue-denied.png` });
if (disabledLinkId) {
  await page360.goto(`${baseURL}/go/${disabledLinkId}/`);
  await settled(page360);
  await page360.screenshot({ path: `${out}/prototype-360-link-disabled.png`, fullPage: true });
}
await page360.goto(`${baseURL}/admin/links/`);
await settled(page360);
await page360.screenshot({ path: `${out}/prototype-360-admin-links-top.png` });
const adminMetrics = await page360.evaluate(() => ({
  url: location.pathname,
  scrollWidth: document.documentElement.scrollWidth,
  configurableLinks: document.querySelectorAll('[aria-label="Provider links"] > ul > li').length,
  headings: document.querySelectorAll('h1').length,
  documentHeight: document.documentElement.scrollHeight,
}));
await context360.close();

// The link manager is ~3900 CSS px tall; at DPR 3 the stitched full-page image
// repeats a segment in this headless shell, so capture the long page at DPR 1.
const contextAdmin = await browser.newContext({
  viewport: { width: 360, height: 722 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
});
const pageAdmin = await contextAdmin.newPage();
await pageAdmin.goto(`${baseURL}/admin/links/`);
await settled(pageAdmin);
await pageAdmin.screenshot({ path: `${out}/prototype-360-admin-links.png`, fullPage: true });
await contextAdmin.close();

const linkCaptures = [];
for (const width of [768, 1440]) {
  const context = await browser.newContext({
    viewport: { width, height: 1024 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto(`${baseURL}/go/lnk-0001/`);
  await settled(page);
  await page.screenshot({ path: `${out}/prototype-${width}-link-full.png`, fullPage: true });
  linkCaptures.push({
    width,
    scrollWidth: await page.evaluate(() => document.documentElement.scrollWidth),
  });
  await context.close();
}

const captures = [];
for (const [name, width, height, dpr] of [
  ['390', 390, 844, 3],
  ['768', 768, 1024, 1],
  ['1440', 1440, 900, 1],
]) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: dpr,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto(baseURL);
  await settled(page);
  await page.screenshot({ path: `${out}/prototype-${name}-full.png`, fullPage: true });
  captures.push({ name, width, height, dpr, metrics: await metrics(page) });
  await context.close();
}

await browser.close();
const report = {
  capturedAt: new Date().toISOString(),
  baseURL,
  browser: 'Chromium via @sparticuz/chromium',
  primary360: metrics360,
  detail360: detailMetrics,
  link360: linkMetrics,
  admin360: adminMetrics,
  disabledLinkId,
  linkCaptures,
  captures,
};
writeFileSync(`${out}/prototype-metrics.json`, JSON.stringify(report, null, 2));
console.log(`Captured prototype screenshots and metrics in ${out}`);
