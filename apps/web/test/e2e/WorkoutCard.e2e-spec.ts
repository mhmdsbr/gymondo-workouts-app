import { test, expect } from '@playwright/test';

test('all workout cards are clickable', async ({ page }) => {

  await page.goto('http://localhost:3001/');
  await page.waitForLoadState('networkidle');

  let workoutCards = page.locator('[data-testid="workout-card"]');
  let cardCount = await workoutCards.count();

  expect(cardCount).toBeGreaterThan(0);
  console.log(`Testing ${cardCount} workout cards for clickability`);

  for (let i = 0; i < cardCount; i++) {
    const card = workoutCards.nth(i);

    const workoutName: string | null = await card.locator('h3').textContent();

    await card.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/http:\/\/localhost:3001\/workouts\/[^\/]+$/);

    console.log(`✓ Card "${workoutName}" is clickable and navigates correctly`);

    if (i < cardCount - 1) {
      await page.goBack();
      await page.waitForLoadState('networkidle');
    }
  }
});