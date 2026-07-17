import { chromium } from '@playwright/test';
import { setupMockAPI } from './tests/helpers/mock-api.js';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

  console.log('Setting up mock API...');
  await setupMockAPI(page);

  console.log('Navigating to login page...');
  await page.goto('http://localhost:5173/login');

  console.log('Filling staff credentials...');
  await page.click('button:has-text("Staff Gedung")');
  await page.fill('input[type="email"]', 'staff@parkfinder.id');
  await page.fill('input[type="password"]', 'password');
  
  console.log('Submitting login form...');
  await page.click('button[type="submit"]');

  console.log('Waiting for redirect to home...');
  try {
    await page.waitForURL('http://localhost:5173/', { timeout: 5000 });
    console.log('Redirected to home. URL:', page.url());
    await page.waitForTimeout(2000);
    const content = await page.textContent('body');
    console.log('Page body text length:', content.length);
    console.log('Contains Staff Dashboard:', content.includes('Staff Dashboard'));
    console.log('Contains RSUD Abdul Moeloek:', content.includes('RSUD Abdul Moeloek'));
    console.log('Full body text first 1000 chars:', content.substring(0, 1000));
  } catch (err) {
    console.error('Failed to navigate or load:', err.message);
    console.log('Current URL:', page.url());
  }

  await browser.close();
})();
