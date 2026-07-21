import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Full User Journey', () => {

  test('Login -> Health Trends -> Barangay Map -> Sign Out', async ({ page }) => {
    // ============================================================
    // 1. LOGIN AS ADMIN
    // ============================================================
    await page.goto(`${BASE_URL}/login`);

    await page.selectOption('select', 'Administrator (Admin)');
    await page.fill('input[type="email"]', 'user@health.gov.ph');
    await page.fill('input[type="password"]', 'Balayan2026!');
    await page.click('button[type="submit"]');

    // Wait for redirect to masterlist (the post-login landing page)
    await page.waitForURL('**/masterlist', { timeout: 10000 });
    await expect(page.locator('text=Children Masterlist')).toBeVisible();

    // ============================================================
    // 2. NAVIGATE TO HEALTH TRENDS & TEST FILTERS
    // ============================================================
    await page.click('button:has-text("Health Trends")');
    await page.waitForURL('**/health-trends', { timeout: 10000 });

    // Verify page title renders
    await expect(page.locator('h1:has-text("Health Trends")')).toBeVisible();

    // Wait for KPI cards to load (data from API)
    await expect(page.locator('text=Total Registered')).toBeVisible({ timeout: 10000 });
    await page.locator('text=Normal').first().waitFor({ state: 'visible' });
    await page.locator('text=Stunted').first().waitFor({ state: 'visible' });
    await page.locator('text=Obese').first().waitFor({ state: 'visible' });

    // Test Barangay filter dropdown
    const barangaySelect = page.locator('select').first();
    await barangaySelect.selectOption('Brgy. Navotas');
    await page.waitForTimeout(1500);
    await expect(barangaySelect).toHaveValue('Brgy. Navotas');

    // Test Age Range filter
    const ageSelect = page.locator('select').nth(1);
    await ageSelect.selectOption('0-11 Months');
    await page.waitForTimeout(1500);
    await expect(ageSelect).toHaveValue('0-11 Months');

    // Test Status Type filter
    const statusSelect = page.locator('select').nth(2);
    await statusSelect.selectOption('Height-for-Age (HFA)');
    await page.waitForTimeout(1500);
    await expect(statusSelect).toHaveValue('hfa');

    // Verify line chart and bar graph titles are rendered
    await expect(page.locator('text=Monthly Cases Trend')).toBeVisible();
    await expect(page.locator('text=Cases by Barangay')).toBeVisible();

    // Reset filters to All for clean state
    await barangaySelect.selectOption('all');
    await ageSelect.selectOption('all');
    await statusSelect.selectOption('Weight-for-Age (WFA)');
    await page.waitForTimeout(1500);

    // ============================================================
    // 3. NAVIGATE TO BARANGAY MAP & INTERACT
    // ============================================================
    await page.click('button:has-text("Barangay Map")');
    await page.waitForURL('**/barangay-map', { timeout: 10000 });

    // Verify map page renders
    await expect(page.locator('h1:has-text("Barangay Map")')).toBeVisible();
    await expect(page.locator('text=Interactive Barangay Map')).toBeVisible();
    await expect(page.locator('text=Low Risk')).toBeVisible();
    await expect(page.locator('text=Moderate')).toBeVisible();
    await expect(page.locator('text=High Risk')).toBeVisible();

    // Wait for the map tiles to render (Leaflet)
    await page.waitForSelector('.leaflet-container', { timeout: 15000 });
    await page.waitForTimeout(2000);

    // Click on a Leaflet marker (div with class leaflet-marker-icon or custom-marker-icon)
    const markers = page.locator('.leaflet-marker-icon, .custom-marker-icon');
    await expect(markers.first()).toBeVisible({ timeout: 10000 });

    // Click the first marker to open side panel
    await markers.first().click();
    await page.waitForTimeout(1000);

    // Verify the side panel opened with barangay details
    await expect(page.locator('text=Registered Children')).toBeVisible();
    await expect(page.locator('text=Nutritional Status Breakdown')).toBeVisible();
    await expect(page.locator('text=Health Insight')).toBeVisible();

    // Close the side panel
    await page.click('button:has-text("✕")');
    await page.waitForTimeout(500);
    await expect(page.locator('text=Registered Children')).not.toBeVisible();

    // ============================================================
    // 4. SIGN OUT
    // ============================================================
    await page.click('button:has-text("Sign Out")');
    await page.waitForURL('**/login', { timeout: 10000 });

    // Verify we are back on the login page
    await expect(page.locator('h1:has-text("WeighToGO")')).toBeVisible();
    await expect(page.locator('text=Sign in to access your portal')).toBeVisible();
  });

});
