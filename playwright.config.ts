import { defineConfig, devices } from '@playwright/test';
const base = process.env.BASE_PATH || '/MYWEBPG';
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  use: {
    baseURL: `http://127.0.0.1:4321${base.replace(/\/$/, '')}/`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4321 --ignore-lock',
    url: `http://127.0.0.1:4321${base.replace(/\/$/, '')}/`,
    reuseExistingServer: !process.env.CI,
  },
});
