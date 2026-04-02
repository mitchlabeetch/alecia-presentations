import { test, expect } from '@playwright/test';

test.describe('PIN Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('devrait afficher lecran PIN au demarrage', async ({ page }) => {
    // Wait for PIN screen to be visible
    const pinScreen = page.locator('[data-testid="pin-screen"]');
    await expect(pinScreen).toBeVisible({ timeout: 10000 });

    // Check for PIN input field
    const pinInput = page.locator('input[type="password"], input[name="pin"]');
    await expect(pinInput).toBeVisible();

    // Check for submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test('devrait accepter le PIN de la galerie', async ({ page }) => {
    // Enter valid gallery PIN
    const pinInput = page.locator('input[type="password"], input[name="pin"]');
    await pinInput.fill('1234');

    // Submit
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Should navigate to gallery
    await expect(page).toHaveURL(/\/(gallery|projects)/, { timeout: 5000 });
  });

  test('devrait rejeter un PIN invalide', async ({ page }) => {
    // Enter invalid PIN
    const pinInput = page.locator('input[type="password"], input[name="pin"]');
    await pinInput.fill('0000');

    // Submit
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Should show error message
    const errorMessage = page.locator('text=/PIN|Code|invalide/i');
    await expect(errorMessage).toBeVisible({ timeout: 3000 });

    // Should stay on PIN screen
    await expect(page).toHaveURL(/\//, { timeout: 3000 });
  });

  test('devrait verrouiller apres 3 tentatives echouees', async ({ page }) => {
    // Enter wrong PIN 3 times
    for (let i = 0; i < 3; i++) {
      const pinInput = page.locator('input[type="password"], input[name="pin"]');
      await pinInput.fill('0000');
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();
      await page.waitForTimeout(500);
    }

    // Should show locked message
    const lockedMessage = page.locator('text=/verrouill|trop de tentatives/i');
    await expect(lockedMessage).toBeVisible({ timeout: 3000 });
  });

  test('devrait afficher le champ PIN pour les projets prives', async ({ page }) => {
    // First login with valid PIN
    const pinInput = page.locator('input[type="password"], input[name="pin"]');
    await pinInput.fill('1234');
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Wait for gallery
    await expect(page).toHaveURL(/\/(gallery|projects)/, { timeout: 5000 });

    // Click on a private project (if exists)
    const privateProject = page.locator('[data-testid="private-project"], .private-project').first();
    if (await privateProject.isVisible()) {
      await privateProject.click();

      // Should show project PIN dialog
      const projectPinDialog = page.locator('[data-testid="project-pin-dialog"], .project-pin-dialog');
      await expect(projectPinDialog).toBeVisible({ timeout: 3000 });

      // Enter project PIN
      const projectPinInput = projectPinDialog.locator('input[type="password"]');
      await projectPinInput.fill('5678');

      // Submit
      const submitBtn = projectPinDialog.locator('button[type="submit"]');
      await submitBtn.click();

      // Should navigate to project editor
      await expect(page).toHaveURL(/\/editor\//, { timeout: 5000 });
    }
  });
});
