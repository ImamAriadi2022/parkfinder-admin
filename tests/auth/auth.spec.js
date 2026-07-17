import { test, expect } from '@playwright/test';
import { setupMockAPI } from '../helpers/mock-api';

test.describe('Authentication Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Setup Mock APIs before each test
    await setupMockAPI(page);
  });

  test('should display login page and switch roles correctly', async ({ page }) => {
    await page.goto('/login');

    // Check header
    await expect(page.locator('text=Masuk ke panel monitoring ParkFinder')).toBeVisible();

    // Check default mode is Admin
    const adminToggle = page.locator('button:has-text("Admin Parkir")');
    await expect(adminToggle).toBeVisible();

    // Switch to Staff mode
    await page.click('button:has-text("Staff Gedung")');
    // The description should update
    await expect(page.locator('text=Monitoring 1 gedung')).toBeVisible();

    // Switch back to Admin mode
    await page.click('button:has-text("Admin Parkir")');
    await expect(page.locator('text=Kelola gedung dan akun')).toBeVisible();
  });

  test('should show validation error when fields are empty', async ({ page }) => {
    await page.goto('/login');

    // Click login button immediately
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('text=Email dan password wajib diisi')).toBeVisible();
  });

  test('should show error message for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill wrong credentials
    await page.fill('input[type="email"]', 'wrong@parkfinder.id');
    await page.fill('input[type="password"]', 'wrongpass');

    await page.click('button[type="submit"]');

    // Should show backend error
    await expect(page.locator('text=Email atau password salah')).toBeVisible();
  });

  test('should login successfully as Super Admin and redirect to dashboard', async ({ page }) => {
    await page.goto('/login');

    // Fill valid credentials
    await page.fill('input[type="email"]', 'super@parkfinder.id');
    await page.fill('input[type="password"]', 'password');

    await page.click('button[type="submit"]');

    // Verify redirected to dashboard and toast notification
    await page.waitForURL('**/');
    await expect(page.locator('h1.page-title:has-text("Dashboard")')).toBeVisible();
    await expect(page.locator('.sidebar-footer')).toContainText('Super Admin ParkFinder');
  });

  test('should logout successfully', async ({ page }) => {
    await page.goto('/login');

    // Login first
    await page.fill('input[type="email"]', 'super@parkfinder.id');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');

    // Wait for page load
    await page.waitForURL('**/');
    
    // Find logout button (often in sidebar or header)
    await page.click('button[title="Logout"]');

    // Wait for redirect to login
    await page.waitForURL('**/login');
    await expect(page.locator('text=Masuk ke panel monitoring ParkFinder')).toBeVisible();
  });
});
