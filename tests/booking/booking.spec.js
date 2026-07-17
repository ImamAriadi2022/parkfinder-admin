import { test, expect } from '@playwright/test';
import { loginAsSuperAdmin } from '../helpers/test-helper';
import { setupMockAPI } from '../helpers/mock-api';

test.describe('Booking Monitoring & Management Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAPI(page);
  });

  test('should load bookings list and show summary stats', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await page.goto('/bookings');
    await page.waitForURL('**/bookings');

    // Verify page title
    await expect(page.locator('h1.page-title')).toContainText('Manajemen Booking');

    // Verify statistics cards are loaded with correct values from mock-api
    // Counts: Total: 2, Active: 1, Completed: 1, Swapped: 0
    await expect(page.locator('.summary-grid .card', { hasText: 'Total' })).toContainText('2');
    await expect(page.locator('.summary-grid .card', { hasText: 'Aktif' }).first()).toContainText('1');
    await expect(page.locator('.summary-grid .card', { hasText: 'Selesai' })).toContainText('1');

    // Verify table has rows for Budi Santoso and Siti Aminah
    await expect(page.locator('table.data-table tbody')).toContainText('Budi Santoso');
    await expect(page.locator('table.data-table tbody')).toContainText('Siti Aminah');
  });

  test('should search and filter bookings list', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await page.goto('/bookings');
    await page.waitForURL('**/bookings');

    // Fill search input
    await page.fill('input[placeholder*="Cari nama"]', 'Budi');

    // Verify only Budi Santoso is visible, Siti Aminah is hidden
    await expect(page.locator('table.data-table tbody')).toContainText('Budi Santoso');
    await expect(page.locator('table.data-table tbody')).not.toContainText('Siti Aminah');

    // Reset search
    await page.fill('input[placeholder*="Cari nama"]', '');

    // Click filter tab "Selesai"
    await page.click('button.filter-tab:has-text("Selesai")');

    // Verify Siti Aminah (completed) is visible, Budi Santoso (active) is hidden
    await expect(page.locator('table.data-table tbody')).toContainText('Siti Aminah');
    await expect(page.locator('table.data-table tbody')).not.toContainText('Budi Santoso');
  });

  test('should open booking detail modal', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await page.goto('/bookings');
    await page.waitForURL('**/bookings');

    // Find Detail button for Budi Santoso and click it
    const row = page.locator('table.data-table tbody tr', { hasText: 'Budi Santoso' });
    await row.locator('button', { hasText: 'Detail' }).click();

    // Verify modal is shown
    const modal = page.locator('.modal');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('TIKET PARKIR');
    await expect(modal).toContainText('Budi Santoso');
    await expect(modal).toContainText('BE 1234 AB');
    await expect(modal).toContainText('RSUD Abdul Moeloek');

    // Close modal
    await modal.locator('button:has-text("Tutup"), button:has-text("✕")').first().click();
    await expect(modal).not.toBeVisible();
  });
});
