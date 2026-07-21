import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './E2E',
  timeout: 60000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command: 'node app.js',
      port: 3000,
      cwd: '../backend',
      reuseExistingServer: true,
      timeout: 30000,
      stdout: 'pipe',
      stderr: 'pipe',
    },
    {
      command: 'npm run dev',
      port: 5173,
      reuseExistingServer: false,
      timeout: 30000,
    },
  ],
});
