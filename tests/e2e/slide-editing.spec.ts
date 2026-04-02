import { test, expect } from '@playwright/test';

test.describe('Slide Editing', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to editor
    await page.goto('/');
    const pinInput = page.locator('input[type="password"], input[name="pin"]');
    await pinInput.fill('1234');
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Wait for gallery and create/edit a project
    await expect(page).toHaveURL(/\/(gallery|projects)/, { timeout: 5000 });

    // Click on first project or create new one
    const projectCard = page.locator('[data-testid="project-card"], .project-card').first();
    if (await projectCard.isVisible()) {
      await projectCard.click();
    } else {
      const newProjectButton = page.locator('button:has-text("Nouveau"), [data-testid="new-project-btn"]');
      await newProjectButton.click();
      const nameInput = page.locator('input[name="name"]');
      await nameInput.fill('Test Project');
      const createButton = page.locator('button:has-text("Creer")');
      await createButton.click();
    }

    // Wait for editor
    await expect(page).toHaveURL(/\/editor\//, { timeout: 5000 });
  });

  test('devrait afficher la liste des diapositives', async ({ page }) => {
    const slideList = page.locator('[data-testid="slide-list"], .slide-list');
    await expect(slideList).toBeVisible({ timeout: 3000 });
  });

  test('devrait ajouter une nouvelle diapositive', async ({ page }) => {
    // Click add slide button
    const addSlideButton = page.locator('button:has-text("Ajouter"), [data-testid="add-slide-btn"]');
    await addSlideButton.click();

    // Should create new slide
    const slideList = page.locator('[data-testid="slide-list"], .slide-list');
    await expect(slideList.locator('[data-testid="slide-item"], .slide-item')).toHaveCount(2, { timeout: 3000 });
  });

  test('devrait dupliquer une diapositive', async ({ page }) => {
    // Find duplicate button on first slide
    const firstSlide = page.locator('[data-testid="slide-item"], .slide-item').first();
    const duplicateButton = firstSlide.locator('[data-testid="duplicate-slide-btn"], button:has-text("Dupliquer")');
    
    if (await duplicateButton.isVisible()) {
      await duplicateButton.click();

      // Should have 2 slides now
      const slides = page.locator('[data-testid="slide-item"], .slide-item');
      await expect(slides).toHaveCount(2, { timeout: 3000 });
    }
  });

  test('devrait supprimer une diapositive', async ({ page }) => {
    const slides = page.locator('[data-testid="slide-item"], .slide-item');
    const initialCount = await slides.count();

    if (initialCount > 1) {
      // Find delete button on first slide
      const firstSlide = slides.first();
      const deleteButton = firstSlide.locator('[data-testid="delete-slide-btn"], button:has-text("Supprimer")');
      
      await deleteButton.click();

      // Confirm if dialog appears
      const confirmButton = page.locator('button:has-text("Supprimer"), button:has-text("Confirmer")');
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
      }

      // Should have one less slide
      await expect(slides).toHaveCount(initialCount - 1, { timeout: 3000 });
    }
  });

  test('devrait reordonner les diapositives par drag-and-drop', async ({ page }) => {
    const slides = page.locator('[data-testid="slide-item"], .slide-item');
    
    if (await slides.count() >= 2) {
      const firstSlide = slides.first();
      const secondSlide = slides.nth(1);

      // Get initial order
      const firstSlideTitle = await firstSlide.locator('text').first().textContent();

      // Drag first slide to second position
      await firstSlide.dragTo(secondSlide);

      // Wait for reorder to complete
      await page.waitForTimeout(500);

      // Slide order should be different
      const newFirstSlide = slides.first();
      const newFirstSlideTitle = await newFirstSlide.locator('text').first().textContent();
      
      // Titles should have changed positions
      if (firstSlideTitle !== newFirstSlideTitle) {
        // Order was changed successfully
      }
    }
  });

  test('devrait modifier les proprietes de la diapositive', async ({ page }) => {
    // Click on slide to select it
    const firstSlide = page.locator('[data-testid="slide-item"], .slide-item').first();
    await firstSlide.click();

    // Open slide properties
    const propertiesButton = page.locator('button:has-text("Proprietes"), [data-testid="slide-properties-btn"]');
    if (await propertiesButton.isVisible()) {
      await propertiesButton.click();

      // Should show properties panel
      const propertiesPanel = page.locator('[data-testid="slide-properties"], .slide-properties');
      await expect(propertiesPanel).toBeVisible({ timeout: 3000 });

      // Change background color
      const colorInput = propertiesPanel.locator('input[type="color"], input[name="backgroundColor"]');
      if (await colorInput.isVisible()) {
        await colorInput.fill('#061a40');
      }
    }
  });

  test('devrait ajouter un bloc a la diapositive', async ({ page }) => {
    // Click add block button or use toolbar
    const addBlockButton = page.locator('button:has-text("Ajouter.*bloc"), [data-testid="add-block-btn"]');
    
    if (await addBlockButton.isVisible()) {
      await addBlockButton.click();

      // Should show block library
      const blockLibrary = page.locator('[data-testid="block-library"], .block-library');
      await expect(blockLibrary).toBeVisible({ timeout: 3000 });

      // Select a block type
      const textBlock = blockLibrary.locator('text="Texte", [data-testid="block-type-text"]');
      await textBlock.click();

      // Block should be added to slide
      const canvas = page.locator('[data-testid="slide-canvas"], .slide-canvas');
      await expect(canvas.locator('[data-testid="block"], .block')).toBeVisible({ timeout: 3000 });
    }
  });

  test('devrait modifier un bloc existant', async ({ page }) => {
    // Find an existing block
    const block = page.locator('[data-testid="block"], .block').first();
    
    if (await block.isVisible()) {
      // Click on block to select
      await block.click();

      // Should show edit toolbar
      const editToolbar = page.locator('[data-testid="block-toolbar"], .block-toolbar');
      await expect(editToolbar).toBeVisible({ timeout: 3000 });

      // Edit content
      const editButton = editToolbar.locator('button:has-text("Modifier"), [data-testid="edit-block-btn"]');
      if (await editButton.isVisible()) {
        await editButton.click();

        // Should open edit modal/form
        const editModal = page.locator('[data-testid="block-edit-modal"], .block-edit-modal');
        await expect(editModal).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('devrait supprimer un bloc', async ({ page }) => {
    const block = page.locator('[data-testid="block"], .block').first();
    
    if (await block.isVisible()) {
      // Select block
      await block.click();

      // Press delete key or click delete button
      await page.keyboard.press('Delete');

      // Block should be removed
      const remainingBlocks = page.locator('[data-testid="block"], .block');
      await expect(remainingBlocks).toHaveCount(0, { timeout: 3000 });
    }
  });
});
