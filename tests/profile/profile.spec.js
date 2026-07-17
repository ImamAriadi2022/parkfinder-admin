import { test, expect } from '@playwright/test';
import { loginAsSuperAdmin, navigateTo } from '../helpers/test-helper';
import { setupMockAPI } from '../helpers/mock-api';

test.describe('Profile & Settings Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAPI(page);
  });

  test('should display profile details', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await navigateTo(page, 'Profil');
    await page.waitForURL('**/profile');

    // Check profile details are loaded correctly
    await expect(page.locator('h1.page-title')).toContainText('Profil');
    await expect(page.locator('.card').locator('text=Super Admin ParkFinder').first()).toBeVisible();
    await expect(page.locator('.card').locator('text=super@parkfinder.id').first()).toBeVisible();
  });

  test('should show validation warnings when changing password', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await navigateTo(page, 'Profil');
    await page.waitForURL('**/profile');

    // Click submit with empty form
    await page.click('button[type="submit"]:has-text("Simpan Password Baru")');

    // Warning for missing current password
    await expect(page.locator('text=Masukkan password saat ini')).toBeVisible();

    // Fill current password
    await page.fill('input[placeholder="Masukkan password saat ini"]', 'password');

    // Fill new password with less than 6 chars
    await page.fill('input[placeholder="Password baru"]', '123');
    await page.click('button[type="submit"]:has-text("Simpan Password Baru")');
    await expect(page.locator('text=Password baru minimal 6 karakter')).toBeVisible();

    // Fill new password >= 6 chars, but mismatch confirm
    await page.fill('input[placeholder="Password baru"]', 'newpassword123');
    await page.fill('input[placeholder="Ulangi password baru"]', 'mismatch');
    await page.click('button[type="submit"]:has-text("Simpan Password Baru")');
    await expect(page.locator('text=Konfirmasi password baru tidak cocok')).toBeVisible();
  });

  test('should successfully change password with valid data', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await navigateTo(page, 'Profil');
    await page.waitForURL('**/profile');

    // Fill valid data
    await page.fill('input[placeholder="Masukkan password saat ini"]', 'password');
    await page.fill('input[placeholder="Password baru"]', 'newpassword123');
    await page.fill('input[placeholder="Ulangi password baru"]', 'newpassword123');

    // Submit
    await page.click('button[type="submit"]:has-text("Simpan Password Baru")');

    // Verify success toast
    await expect(page.locator('text=Password berhasil diperbarui!')).toBeVisible();

    // Fields should be cleared
    await expect(page.locator('input[placeholder="Masukkan password saat ini"]')).toHaveValue('');
    await expect(page.locator('input[placeholder="Password baru"]')).toHaveValue('');
    await expect(page.locator('input[placeholder="Ulangi password baru"]')).toHaveValue('');
  });
});
