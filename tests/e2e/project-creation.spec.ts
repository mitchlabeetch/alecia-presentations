import { test, expect } from '@playwright/test';

test.describe('Project Creation', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/');
    const pinInput = page.locator('input[type="password"], input[name="pin"]');
    await pinInput.fill('1234');
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    await expect(page).toHaveURL(/\/(gallery|projects)/, { timeout: 5000 });
  });

  test('devrait creer un nouveau projet via le wizard', async ({ page }) => {
    // Click new project button
    const newProjectButton = page.locator('button:has-text("Nouveau"), [data-testid="new-project-btn"]');
    await newProjectButton.click();

    // Should open wizard/dialog
    const wizard = page.locator('[data-testid="new-project-wizard"], .wizard');
    await expect(wizard).toBeVisible({ timeout: 3000 });

    // Enter project name
    const nameInput = wizard.locator('input[name="name"], input[placeholder*="nom"]');
    await nameInput.fill('Mon Nouveau Projet');

    // Click create button
    const createButton = wizard.locator('button:has-text("Creer"), button:has-text("Creer")');
    await createButton.click();

    // Should navigate to editor
    await expect(page).toHaveURL(/\/editor\//, { timeout: 5000 });

    // Should show project name in header
    const projectTitle = page.locator('text="Mon Nouveau Projet"');
    await expect(projectTitle).toBeVisible({ timeout: 3000 });
  });

  test('devrait creer un projet depuis un modele', async ({ page }) => {
    // Click new project button
    const newProjectButton = page.locator('button:has-text("Nouveau"), [data-testid="new-project-btn"]');
    await newProjectButton.click();

    // Should show template selector
    const templateSelector = page.locator('[data-testid="template-selector"], .template-selector');
    await expect(templateSelector).toBeVisible({ timeout: 3000 });

    // Select a template
    const templateCard = templateSelector.locator('[data-testid="template-card"], .template-card').first();
    await templateCard.click();

    // Continue to wizard
    const nextButton = page.locator('button:has-text("Suivant"), button:has-text("Continuer")');
    await nextButton.click();

    // Enter project name
    const nameInput = page.locator('input[name="name"], input[placeholder*="nom"]');
    await nameInput.fill('Projet depuis Modele');

    // Create project
    const createButton = page.locator('button:has-text("Creer")');
    await createButton.click();

    // Should navigate to editor with template content
    await expect(page).toHaveURL(/\/editor\//, { timeout: 5000 });

    // Should have slides from template
    const slideList = page.locator('[data-testid="slide-list"], .slide-list');
    await expect(slideList).toBeVisible({ timeout: 3000 });
  });

  test('devrait dupliquer un projet existant', async ({ page }) => {
    // Find duplicate button on first project
    const projectCard = page.locator('[data-testid="project-card"], .project-card').first();
    const duplicateButton = projectCard.locator('button:has-text("Dupliquer"), [data-testid="duplicate-btn"]');
    
    if (await duplicateButton.isVisible()) {
      await duplicateButton.click();

      // Should create duplicate with suffix
      const duplicateName = page.locator('text=/Copie de|Project.*Copy/i');
      await expect(duplicateName).toBeVisible({ timeout: 3000 });
    }
  });

  test('devrait supprimer un projet avec confirmation', async ({ page }) => {
    // Find delete button on first project
    const projectCard = page.locator('[data-testid="project-card"], .project-card').first();
    const deleteButton = projectCard.locator('button:has-text("Supprimer"), [data-testid="delete-btn"]');
    
    if (await deleteButton.isVisible()) {
      await deleteButton.click();

      // Should show confirmation dialog
      const confirmDialog = page.locator('[data-testid="confirm-dialog"], .confirm-dialog');
      await expect(confirmDialog).toBeVisible({ timeout: 3000 });

      // Confirm deletion
      const confirmButton = confirmDialog.locator('button:has-text("Supprimer"), button:has-text("Confirmer")');
      await confirmButton.click();

      // Project should be removed
      await expect(projectCard).not.toBeVisible({ timeout: 5000 });
    }
  });

  test('devrait valider le nom du projet', async ({ page }) => {
    // Click new project button
    const newProjectButton = page.locator('button:has-text("Nouveau"), [data-testid="new-project-btn"]');
    await newProjectButton.click();

    // Try to create without name
    const createButton = page.locator('button:has-text("Creer")');
    await createButton.click();

    // Should show validation error
    const errorMessage = page.locator('text=/nom requis|entre.*nom/i');
    await expect(errorMessage).toBeVisible({ timeout: 3000 });
  });
});
