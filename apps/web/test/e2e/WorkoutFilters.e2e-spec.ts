import { test, expect } from '@playwright/test';

test.describe('Month Filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001/');
    await page.waitForLoadState('networkidle');
  });

  test('should filter workouts by selected month', async ({ page }) => {

    await expect(page.getByTestId('month-filter')).toBeVisible();

    await page.getByTestId('month-filter').selectOption({ index: 1 });

    await expect(page.getByTestId('active-filters-section')).toBeVisible();

    await expect(page.getByTestId('active-filters-text')).toContainText('Month:');
  });

  test('should clear month filter when clear all is clicked', async ({ page }) => {

    await page.getByTestId('month-filter').selectOption({ index: 1 });

    await page.getByTestId('clear-all-filters').click();

    await expect(page.getByTestId('month-filter')).toHaveValue('');

    await expect(page.getByTestId('active-filters-section')).not.toBeVisible();
  });

  test('should filter workouts by selected category', async ({ page }) => {

    const firstCategory = page.locator('[data-testid^="category-"]').first();
    await expect(firstCategory).toBeVisible();
    await firstCategory.click();

    await expect(page.getByTestId('active-filters-section')).toBeVisible();

    await expect(page.getByTestId('active-filters-text')).toContainText('Categories:');
  });

  test('should clear category filter when clear all is clicked', async ({ page }) => {

    const firstCategory = page.locator('[data-testid^="category-"]').first();
    await firstCategory.click();

    await page.getByTestId('clear-all-filters').click();

    await expect(firstCategory).toHaveClass(/bg-gray-100/);

    await expect(page.getByTestId('active-filters-section')).not.toBeVisible();
  });

  test('should filter workouts by both month and category', async ({ page }) => {

    await page.getByTestId('month-filter').selectOption({ index: 1 });

    const firstCategory = page.locator('[data-testid^="category-"]').first();
    await firstCategory.click();

    await expect(page.getByTestId('active-filters-section')).toBeVisible();

    const activeFiltersText = page.getByTestId('active-filters-text');
    await expect(activeFiltersText).toContainText('Month:');
    await expect(activeFiltersText).toContainText('Categories:');

    await page.getByTestId('clear-all-filters').click();

    await expect(page.getByTestId('month-filter')).toHaveValue('');
    await expect(firstCategory).toHaveClass(/bg-gray-100/);
    await expect(page.getByTestId('active-filters-section')).not.toBeVisible();
  });
});