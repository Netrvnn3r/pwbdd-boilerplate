import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
    features: 'features/*.feature',
    steps: 'steps/*.steps.ts',
});

export default defineConfig({
    testDir,
    reporter: 'html',
    use: {
        headless: true,
        screenshot: 'on',
        trace: 'on-first-retry',
        ignoreHTTPSErrors: true,
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});
