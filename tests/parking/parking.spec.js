import { test, expect } from '@playwright/test';
import { loginAsSuperAdmin, navigateTo } from '../helpers/test-helper';
import { setupMockAPI } from '../helpers/mock-api';

test.describe('Parking Area & Slot Management Tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupMockAPI(page);
  });

  test('should load parking areas and display slots when selected', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await navigateTo(page, 'Gedung Parkir');
    await page.waitForURL('**/parkings');

    // Verify areas list is visible
    await expect(page.locator('.card', { hasText: 'Daftar Area' }).locator('text=RSUD Abdul Moeloek')).toBeVisible();
    await expect(page.locator('.card', { hasText: 'Daftar Area' }).locator('text=Stasiun Tanjung Karang')).toBeVisible();

    // Select "RSUD Abdul Moeloek"
    await page.click('.card:has-text("Daftar Area") >> text=RSUD Abdul Moeloek');

    // Verify slots of RSUD Abdul Moeloek are listed in the table on the right
    // Slots in mock-api: A-01, A-02, B-01
    await expect(page.locator('table.data-table tbody')).toContainText('A-01');
    await expect(page.locator('table.data-table tbody')).toContainText('A-02');
  });

  test('should allow adding a new parking area', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await navigateTo(page, 'Gedung Parkir');
    await page.waitForURL('**/parkings');

    // Click "+ Tambah Area"
    await page.click('text=Tambah Area');

    // Fill form
    await page.fill('input[placeholder="Gedung A"]', 'Mall Kartini');
    await page.fill('input[placeholder="Jl. Contoh No. 1"]', 'Jl. Kartini No. 4, Bandar Lampung');
    await page.fill('input[placeholder="3"]', '4');
    await page.fill('input[placeholder="admin.area@parkfinder.id"]', 'malka@parkfinder.id');

    // Submit
    await page.click('form button[type="submit"]');

    // Verify success toast and new area in the list
    await expect(page.locator('text=Area parkir baru berhasil ditambahkan!')).toBeVisible();
    await expect(page.locator('text=Mall Kartini')).toBeVisible();
  });

  test('should allow adding a new slot with auto-generated Sensor ID', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await navigateTo(page, 'Gedung Parkir');
    await page.waitForURL('**/parkings');

    // Select "RSUD Abdul Moeloek"
    await page.click('.card:has-text("Daftar Area") >> text=RSUD Abdul Moeloek');

    // Click "+ Tambah Slot"
    await page.click('text=Tambah Slot');

    // Fill slot form details
    await page.fill('form input[type="number"]', '1');
    await page.fill('form input[placeholder="A-02"]', 'A-03');

    // Verify Sensor ID is auto-generated (SENSOR-area-1-1-A03)
    const sensorInput = page.locator('form input[readonly]');
    await expect(sensorInput).toHaveValue('SENSOR-AREA1-1-A03');

    // Submit
    await page.click('form button[type="submit"]');

    // Verify success toast and slot in the table
    await expect(page.locator('text=Slot parkir baru berhasil ditambahkan!')).toBeVisible();
    await expect(page.locator('table.data-table tbody')).toContainText('A-03');
  });

  test('should allow editing slot status', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await navigateTo(page, 'Gedung Parkir');
    await page.waitForURL('**/parkings');

    // Select "RSUD Abdul Moeloek"
    await page.click('.card:has-text("Daftar Area") >> text=RSUD Abdul Moeloek');

    // Find row for A-01 (available) and click "Maintenance" quick action
    const row = page.locator('table.data-table tbody tr', { hasText: 'A-01' });
    const maintenanceBtn = row.locator('button', { hasText: 'Maintenance' });
    await maintenanceBtn.click();

    // Verify success toast
    await expect(page.locator('text=Status slot parkir berhasil diubah!').first()).toBeVisible();

    // Status badge in that row should change to Maintenance
    await expect(row.locator('.badge')).toContainText('Maintenance');

    // Click "Aktifkan" to make it available again
    const activateBtn = row.locator('button', { hasText: 'Aktifkan' });
    await activateBtn.click();
    await expect(page.locator('text=Status slot parkir berhasil diubah!').first()).toBeVisible();
    await expect(row.locator('.badge')).toContainText('Tersedia');
  });

  test('should allow deleting a slot', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await navigateTo(page, 'Gedung Parkir');
    await page.waitForURL('**/parkings');

    // Select "RSUD Abdul Moeloek"
    await page.click('.card:has-text("Daftar Area") >> text=RSUD Abdul Moeloek');

    const row = page.locator('table.data-table tbody tr', { hasText: 'B-01' });
    const deleteBtn = row.locator('button.btn-danger');

    // Intercept dialog confirmation
    page.once('dialog', dialog => dialog.accept());
    await deleteBtn.click();

    // Verify success toast and slot is removed
    await expect(page.locator('text=Slot parkir berhasil dihapus!')).toBeVisible();
    await expect(page.locator('table.data-table tbody')).not.toContainText('B-01');
  });
});
