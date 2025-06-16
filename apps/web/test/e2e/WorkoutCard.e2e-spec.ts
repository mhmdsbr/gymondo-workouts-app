import { test, expect } from '@playwright/test';

test('all workout cards are clickable', async ({ page }) => {

  console.log('Navigating to homepage...');
  await page.goto('http://localhost:3001/');

  await expect(page.locator('[data-testid="workouts-loaded"]')).toBeVisible();

  const workoutCards = page.locator('[data-testid="workout-card"]');
  await expect(workoutCards).not.toHaveCount(0);

  const cardCount = await workoutCards.count();

  for (let i = 0; i < cardCount; i++) {
    const card = workoutCards.nth(i);
    const workoutName = await card.locator('h3').textContent();

    await Promise.all([
      page.waitForNavigation(),
      card.click()
    ]);

    await expect(page).toHaveURL(/http:\/\/localhost:3001\/workouts\/[^\/]+$/);
    console.log(`✓ Card "${workoutName}" navigated successfully`);

    if (i < cardCount - 1) {
      await Promise.all([
        page.waitForNavigation(),
        page.goBack()
      ]);
      await expect(page.locator('[data-testid="workouts-loaded"]')).toBeVisible();
    }
  }
});