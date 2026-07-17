import { test, expect } from '@playwright/test';
import { loginAsSuperAdmin, loginAsStaff, navigateTo } from '../helpers/test-helper';
import { setupMockAPI } from '../helpers/mock-api';

test.describe('Navigation & Routing Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAPI(page);
  });

  test('should navigate to all main pages for Super Admin', async ({ page }) => {
    // Login as Super Admin
    await loginAsSuperAdmin(page);

    // Navigate to Gedung Parkir
    await navigateTo(page, 'Gedung Parkir');
    await page.waitForURL('**/parkings');
    await expect(page.locator('h1.page-title')).toContainText('Gedung Parkir');

    // Navigate to Staff Parkir
    await navigateTo(page, 'Staff Parkir');
    await page.waitForURL('**/staff');
    await expect(page.locator('h1.page-title')).toContainText('Staff Parkir');

    // Navigate to Data Pengguna
    await navigateTo(page, 'Data Pengguna');
    await page.waitForURL('**/users');
    await expect(page.locator('h1.page-title')).toContainText('Data Pengguna');

    // Navigate to Profil
    await navigateTo(page, 'Profil');
    await page.waitForURL('**/profile');
    await expect(page.locator('.page-title')).toContainText('Profil');
  });

  test('should restrict navigation items for Staff role', async ({ page }) => {
    // Login as Staff
    await loginAsStaff(page);

    // Verify staff has local dashboard header
    await expect(page.locator('text=Staff Portal')).toBeVisible();

    // Verify staff sidebar does NOT show Super Admin specific tabs
    const sidebar = page.locator('aside, .sidebar');
    await expect(sidebar.locator('text=Staff Parkir')).not.toBeVisible();
    await expect(sidebar.locator('text=Data Pengguna')).not.toBeVisible();
  });
});
