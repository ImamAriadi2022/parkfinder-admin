import { expect } from '@playwright/test';
import { setupMockAPI } from './mock-api';

/**
 * Common test helper tasks
 */

export async function loginAsSuperAdmin(page) {
  // Setup mocking for safety
  await setupMockAPI(page);

  await page.goto('/login');

  // Verify login page title/header
  await expect(page.locator('text=Masuk ke panel monitoring ParkFinder')).toBeVisible();

  // Select Admin Parkir mode
  await page.click('button:has-text("Admin Parkir")');

  // Fill credentials
  await page.fill('input[type="email"]', 'super@parkfinder.id');
  await page.fill('input[type="password"]', 'password');

  // Submit form
  await page.click('button[type="submit"]');

  // Wait for redirect to main page (indicated by sidebar footer containing the user name)
  await page.waitForURL('**/');
  await expect(page.locator('.sidebar-footer')).toContainText('Super Admin ParkFinder');
}

export async function loginAsStaff(page) {
  // Setup mocking for safety
  await setupMockAPI(page);

  await page.goto('/login');

  // Switch role to Staff
  await page.click('button:has-text("Staff Gedung")');

  // Fill credentials
  await page.fill('input[type="email"]', 'staff@parkfinder.id');
  await page.fill('input[type="password"]', 'password');

  // Submit form
  await page.click('button[type="submit"]');

  // Wait for redirect
  await page.waitForURL('**/');
  await expect(page.locator('text=Staff Portal')).toBeVisible();
}

export async function navigateTo(page, menuText) {
  // Locate the sidebar navigation link and click it
  const sidebar = page.locator('aside, .sidebar');
  const menuItem = sidebar.locator(`text=${menuText}`);
  await menuItem.click();
}
