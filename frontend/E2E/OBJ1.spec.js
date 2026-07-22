import { test, expect } from '@playwright/test';

test.describe('BNS Masterlist and Monthly Report Journey', () => {
  test('BNS login, register child, assess child, and view monthly report', async ({ page }) => {
    page.on('console', (msg) => console.log('PAGE CONSOLE', msg.type(), msg.text()));
    page.on('pageerror', (err) => console.log('PAGE ERROR', err.message));
    page.on('requestfailed', (request) => console.log('REQUEST FAILED', request.url(), request.failure()?.errorText));
    const uniqueId = Date.now();
    const childName = `E2E Child ${uniqueId}`;
    const parentName = `Parent ${uniqueId}`;
    const birthdate = '2020-06-15';

    // 1. Login as Barangay Nutrition Scholar
    await page.goto('/login');

    await page.selectOption('select', 'Barangay Nutrition Scholar');
    await page.fill('input[type="email"]', 'bns@health.gov.ph');
    await page.fill('input[type="password"]', 'BNSBalayan2026!');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*\/bns\/masterlist$/i, { timeout: 15000 });
    await expect(page.locator('h1:has-text("Children Masterlist")')).toBeVisible();
    await expect(page.locator('button:has-text("+ Add New Child")')).toBeVisible();

    // 2. Register a new child
    await page.click('button:has-text("+ Add New Child")');
    await expect(page.locator('text=Register New Child')).toBeVisible();

    await page.fill('input[name="name"]', childName);
    await page.selectOption('select[name="gender"]', 'Female');
    await page.fill('input[name="birthdate"]', birthdate);
    await page.fill('input[name="parent_name"]', parentName);
    await page.selectOption('select[name="purok"]', 'Purok 1');

    await page.click('button:has-text("Save")');
    await expect(page.locator('text=Register New Child')).not.toBeVisible({ timeout: 10000 });

    const childRow = page.locator('tbody tr', { hasText: childName }).first();
    console.log('CHILD ROW COUNT:', await page.locator('tbody tr').count());
    console.log('CHILD ROW HTML:', await childRow.innerHTML());
    await expect(childRow).toBeVisible({ timeout: 20000 });
    const manageButton = childRow.locator('button:has-text("Manage")');
    await expect(manageButton).toBeVisible({ timeout: 15000 });
    await expect(childRow.locator('text=Pending')).toBeVisible();

    // 3. Assess the registered child
    await manageButton.click();
    await expect(page.locator('div.fixed')).toHaveCount(1, { timeout: 20000 });
    await expect(page.locator('text=Parent / Caregiver')).toBeVisible({ timeout: 20000 });

    await page.click('button:has-text("Monthly Assessment")');
    await expect(page.locator('text=New Monthly Assessment')).toBeVisible();

    await page.fill('input#weight', '9.0');
    await page.fill('input#height', '70.0');
    await page.click('button:has-text("Compute Nutritional Status")');
    await expect(page.locator('text=Computed Results')).toBeVisible({ timeout: 10000 });

    // Submit assessment and wait for backend response
    const putPromise = page.waitForResponse(resp => resp.url().includes('/api/children') && resp.request().method() === 'PUT', { timeout: 30000 });
    await page.click('button:has-text("Submit Assessment")');
    const putResp = await putPromise;
    if (!putResp.ok()) throw new Error('Assessment PUT request failed: ' + putResp.status());

    await expect(page.locator('text=Parent / Caregiver')).not.toBeVisible({ timeout: 15000 });

    const assessedRow = page.locator('tbody tr', { hasText: childName }).first();
    await expect(assessedRow).toBeVisible({ timeout: 30000 });

    // 4. Navigate to Monthly Report and verify assessed child presence
    await page.click('button:has-text("Monthly Report")');
    await expect(page).toHaveURL(/\/monthly-report$/, { timeout: 15000 });
    await expect(page.locator('h1:has-text("Monthly Barangay Report")')).toBeVisible();
    await expect(page.locator('text=Total Registered')).toBeVisible();

    await expect(page.locator('tbody tr', { hasText: childName })).toBeVisible({ timeout: 20000 });
  });
});
