import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: process.env.npm_lifecycle_event === 'test:demo' ? 90000 : 30000,
  expect: { timeout: 10000 },
  reporter: [['list'], ['html', { open: 'never' }], ['json', { outputFile: 'test-results/results.json' }]],
  use: {
    launchOptions: { slowMo: Number(process.env.SLOW_MO || (process.env.npm_lifecycle_event === 'test:demo' ? 800 : 0)) },
    baseURL: process.env.BASE_URL || 'https://verzel-store.qa-test-verzel-store.workers.dev',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
