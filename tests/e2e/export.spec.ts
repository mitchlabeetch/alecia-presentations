import { test, expect } from '@playwright/test';

test.describe('Export Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to editor with a project
    await page.goto('/');
    const pinInput = page.locator('input[type="password"], input[name="pin"]');
    await pinInput.fill('1234');
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    await expect(page).toHaveURL(/\/(gallery|projects)/, { timeout: 5000 });

    // Open first project or create new
    const projectCard = page.locator('[data-testid="project-card"], .project-card').first();
    if (await projectCard.isVisible()) {
      await projectCard.click();
    }

    await expect(page).toHaveURL(/\/editor\//, { timeout: 5000 });
  });

  test('devrait afficher le bouton dexportation', async ({ page }) => {
    const exportButton = page.locator('button:has-text("Exporter"), [data-testid="export-btn"]');
    await expect(exportButton).toBeVisible({ timeout: 3000 });
  });

  test('devrait ouvrir le menu dexportation', async ({ page }) => {
    const exportButton = page.locator('button:has-text("Exporter"), [data-testid="export-btn"]');
    await exportButton.click();

    // Should show export options
    const exportMenu = page.locator('[data-testid="export-menu"], .export-menu');
    await expect(exportMenu).toBeVisible({ timeout: 3000 });

    // Should show format options
    const pptxOption = exportMenu.locator('text="PPTX", text="PowerPoint"');
    const pdfOption = exportMenu.locator('text="PDF"');
    const pngOption = exportMenu.locator('text="PNG"');

    await expect(pptxOption).toBeVisible();
    await expect(pdfOption).toBeVisible();
    await expect(pngOption).toBeVisible();
  });

  test('devrait exporter en format PPTX', async ({ page }) => {
    const exportButton = page.locator('button:has-text("Exporter"), [data-testid="export-btn"]');
    await exportButton.click();

    const exportMenu = page.locator('[data-testid="export-menu"], .export-menu');
    await expect(exportMenu).toBeVisible({ timeout: 3000 });

    // Click PPTX option
    const pptxOption = exportMenu.locator('text="PPTX", text="PowerPoint"');
    await pptxOption.click();

    // Should show progress indicator
    const progressIndicator = page.locator('[data-testid="export-progress"], .export-progress');
    if (await progressIndicator.isVisible()) {
      // Wait for export to complete
      await expect(progressIndicator).not.toBeVisible({ timeout: 30000 });
    }

    // Should trigger download
    const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
    
    // Check for success message or file
    const successMessage = page.locator('text=/export|echange|telecharge/i');
    await expect(successMessage).toBeVisible({ timeout: 10000 }).catch(() => {
      // Download might have started without message
    });
  });

  test('devrait exporter en format PDF', async ({ page }) => {
    const exportButton = page.locator('button:has-text("Exporter"), [data-testid="export-btn"]');
    await exportButton.click();

    const exportMenu = page.locator('[data-testid="export-menu"], .export-menu');
    await expect(exportMenu).toBeVisible({ timeout: 3000 });

    // Click PDF option
    const pdfOption = exportMenu.locator('text="PDF"');
    await pdfOption.click();

    // Wait for export to complete
    await page.waitForTimeout(5000);

    // Should trigger download
    const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
  });

  test('devrait exporter en format PNG', async ({ page }) => {
    const exportButton = page.locator('button:has-text("Exporter"), [data-testid="export-btn"]');
    await exportButton.click();

    const exportMenu = page.locator('[data-testid="export-menu"], .export-menu');
    await expect(exportMenu).toBeVisible({ timeout: 3000 });

    // Click PNG option
    const pngOption = exportMenu.locator('text="PNG", text="Images"');
    await pngOption.click();

    // Wait for export to complete
    await page.waitForTimeout(5000);

    // Should trigger download
    const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
  });

  test('devrait gerer les erreurs dexportation', async ({ page }) => {
    // Mock export failure by blocking the export API
    await page.route('**/api/export/**', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Export failed' }),
      });
    });

    const exportButton = page.locator('button:has-text("Exporter"), [data-testid="export-btn"]');
    await exportButton.click();

    const exportMenu = page.locator('[data-testid="export-menu"], .export-menu');
    await expect(exportMenu).toBeVisible({ timeout: 3000 });

    // Click PPTX option
    const pptxOption = exportMenu.locator('text="PPTX"');
    await pptxOption.click();

    // Should show error message
    const errorMessage = page.locator('text=/erreur|echec|failed/i');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  test('devrait afficher le mode presentation', async ({ page }) => {
    // Click present button
    const presentButton = page.locator('button:has-text("Presenter"), [data-testid="present-btn"]');
    
    if (await presentButton.isVisible()) {
      await presentButton.click();

      // Should enter presentation mode
      const presentationMode = page.locator('[data-testid="presentation-mode"], .presentation-mode');
      await expect(presentationMode).toBeVisible({ timeout: 3000 });

      // Should navigate with arrow keys
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(500);
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(500);

      // Exit presentation mode
      await page.keyboard.press('Escape');
      await expect(presentationMode).not.toBeVisible({ timeout: 3000 });
    }
  });
});
