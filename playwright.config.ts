import { defineConfig, devices } from '@playwright/test';
import chromium, { inflate, setupLambdaEnvironment } from '@sparticuz/chromium';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const executablePath = await chromium.executablePath();
// The sandbox is not detected as Amazon Linux 2023, so extract the bundled NSS/NSPR
// libraries explicitly and expose them to the Chromium child process.
await inflate(join(process.cwd(), 'node_modules/@sparticuz/chromium/bin/al2023.tar.br'));
setupLambdaEnvironment(join(tmpdir(), 'al2023', 'lib'));

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [['list'], ['json', { outputFile: '.artifacts/phase2/playwright-results.json' }]],
  outputDir: 'test-results',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run start -- --port 3000',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          executablePath,
          // --single-process is a Lambda workaround; in this sandbox it makes repeated
          // Playwright contexts flaky. The multi-process headless shell is stable here.
          args: chromium.args.filter((arg) => arg !== '--single-process'),
        },
      },
    },
  ],
});
