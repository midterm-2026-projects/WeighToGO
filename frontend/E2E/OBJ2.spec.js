import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Admin Masterlist & Health Reports Journey', () => {

  test('Login -> Masterlist (filters, pagination, modal) -> Health Reports (filters, print) -> Sign Out', async ({ page }) => {
    // ============================================================
    // 1. LOGIN AS ADMIN
    // ============================================================
    await page.goto(`${BASE_URL}/login`);

    await page.selectOption('select', 'Administrator (Admin)');
    await page.fill('input[type="email"]', 'user@health.gov.ph');
    await page.fill('input[type="password"]', 'Balayan2026!');
    await page.click('button[type="submit"]');

    // ============================================================
    // 2. NAVIGATE TO MASTERLIST & TEST FILTERS
    // ============================================================
    await page.click('button:has-text("Masterlist")');
    await page.waitForURL('**/masterlist', { timeout: 10000 });

    // Verify page title renders
    await expect(page.locator('h1:has-text("Children Masterlist")')).toBeVisible();

    // Wait for table to load
    await expect(page.locator('text=Total Registered')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('th:has-text("Purok")')).toBeVisible();
    await expect(page.locator('th:has-text("Barangay")')).toBeVisible();
    await expect(page.locator('th:has-text("Parent")')).toBeVisible();
    await expect(page.locator('th:has-text("Child Name")')).toBeVisible();

    // --- Test Barangay filter ---
    const barangaySelect = page.locator('select').first();
    await barangaySelect.selectOption('Brgy. Navotas');
    await page.waitForTimeout(1500);
    await expect(barangaySelect).toHaveValue('Brgy. Navotas');

    // Reset
    await barangaySelect.selectOption('All');
    await page.waitForTimeout(1000);

    // --- Test Age filter ---
    const ageSelect = page.locator('select').nth(1);
    await ageSelect.selectOption('0-11 Months');
    await page.waitForTimeout(1500);
    await expect(ageSelect).toHaveValue('0-11 Months');

    // Reset
    await ageSelect.selectOption('All');
    await page.waitForTimeout(1000);

    // --- Test Status filter ---
    const statusSelect = page.locator('select').nth(2);
    await statusSelect.selectOption('Normal');
    await page.waitForTimeout(1500);
    await expect(statusSelect).toHaveValue('Normal');

    // Reset
    await statusSelect.selectOption('All');
    await page.waitForTimeout(1000);

    // --- Test combined filters ---
    await barangaySelect.selectOption('Brgy. Navotas');
    await ageSelect.selectOption('12-23 Months');
    await page.waitForTimeout(1500);

    // Reset all
    await barangaySelect.selectOption('All');
    await ageSelect.selectOption('All');
    await page.waitForTimeout(1000);

    // ============================================================
    // 3. TEST PAGINATION
    // ============================================================
    // Check if pagination controls exist (only visible when > 10 records)
    const nextButton = page.locator('button:has-text("Next")');
    const prevButton = page.locator('button:has-text("Previous")');

    if (await nextButton.isVisible()) {
      // Click Next
      await nextButton.click();
      await page.waitForTimeout(500);

      // Verify "Showing" text updated
      await expect(page.locator('text=/Showing \\d+/')).toBeVisible();

      // Click Previous to go back
      await prevButton.click();
      await page.waitForTimeout(500);

      // Verify we're back on page 1
      await expect(prevButton).toBeDisabled();
    }

    // ============================================================
    // 4. TEST ROW CLICK -> MODAL
    // ============================================================
    // Wait for table rows to render and click Manage on the first row if present
    await page.waitForSelector('tbody tr');
    const rowCount = await page.locator('tbody tr').count();
    console.log('E2E: masterlist rowCount', rowCount);
    if (rowCount === 0) {
      console.warn('No rows in masterlist - skipping modal checks');
    } else {
      // log buttons in the first row to diagnose selector issues
      const firstRowButtons = await page.locator('tbody tr').first().locator('button').allTextContents();
      console.log('E2E: first row buttons', firstRowButtons);
      const firstRowHtml = await page.locator('tbody tr').first().innerHTML();
      console.log('E2E: firstRow HTML', firstRowHtml);

      // If the table shows the no-results placeholder, skip modal checks
      if (firstRowHtml.includes('No matching child records found')) {
        console.warn('Masterlist contains no records - skipping modal checks');
      } else {
        let manageButton = page.locator('button:has-text("Manage")').first();
        if ((await manageButton.count()) === 0) {
          // fallback to the first button in the row
          manageButton = page.locator('tbody tr').first().locator('button').first();
        }
        await expect(manageButton).toBeVisible({ timeout: 5000 });
        await manageButton.click();
        await page.waitForTimeout(500);
      await expect(manageButton).toBeVisible({ timeout: 5000 });
      await manageButton.click();
      await page.waitForTimeout(500);

      // Verify modal opens with child details
      await expect(page.locator('text=Parent / Caregiver')).toBeVisible();
      await expect(page.locator('text=Nutritional Status')).toBeVisible();

      // Verify modal shows child info fields
      await expect(page.locator('text=Gender')).toBeVisible();
      await expect(page.getByText('Weight', { exact: true })).toBeVisible();
      await expect(page.locator('text=Height')).toBeVisible();

        // Close the modal by clicking the X button
        await page.locator('.fixed button svg').first().click();
        await page.waitForTimeout(500);

        // Verify modal is closed
        await expect(page.locator('text=Parent / Caregiver')).not.toBeVisible();
      }
    }

    // ============================================================
    // 5. NAVIGATE TO HEALTH REPORTS & TEST FILTERS
    // ============================================================
    await page.click('button:has-text("Health Reports")');
    await page.waitForURL('**/health-reports', { timeout: 10000 });

    // Verify page title renders
    await expect(page.locator('h1:has-text("Health Reports")')).toBeVisible();
    await expect(page.locator('text=Operation Timbang')).toBeVisible();

    // Wait for table to load
    await expect(page.locator('th:has-text("Barangay")')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('th:has-text("Total Registered")')).toBeVisible();

    // --- Test Barangay filter ---
    const hrBarangaySelect = page.locator('select').first();
    await hrBarangaySelect.selectOption('Brgy. Navotas');
    await page.waitForTimeout(1500);
    await expect(hrBarangaySelect).toHaveValue('Brgy. Navotas');

    // Reset
    await hrBarangaySelect.selectOption('all');
    await page.waitForTimeout(1000);

    // --- Test Print Report button ---
    const printButton = page.locator('button:has-text("Print Report")');
    await expect(printButton).toBeVisible();

    // ============================================================
    // 6. SIGN OUT
    // ============================================================
    await page.click('button:has-text("Sign Out")');
    await page.waitForURL('**/login', { timeout: 10000 });

    // Verify we are back on the login page
    await expect(page.locator('h1:has-text("WeighToGO")')).toBeVisible();
    await expect(page.locator('text=Sign in to access your portal')).toBeVisible();
  });

});
