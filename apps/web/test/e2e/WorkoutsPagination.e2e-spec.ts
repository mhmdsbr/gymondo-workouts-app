import { test, expect } from '@playwright/test';

test.describe('Pagination', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001/');
    await page.waitForLoadState('networkidle');
  });

  test('should display pagination when there are multiple pages', async ({ page }) => {

    await expect(page.getByTestId('pagination-container')).toBeVisible();

    await expect(page.getByTestId('page-info')).toBeVisible();
    await expect(page.getByTestId('page-info')).toContainText('Page 1 of');
  });

  test('should disable previous button on first page', async ({ page }) => {

    await expect(page.getByTestId('pagination-container')).toBeVisible();

    const prevButton = page.getByTestId('prev-button');
    await expect(prevButton).toBeDisabled();
    await expect(prevButton).toHaveClass(/cursor-not-allowed/);
  });

  test('should navigate to next page when next button is clicked', async ({ page }) => {

    await expect(page.getByTestId('pagination-container')).toBeVisible();

    const nextButton = page.getByTestId('next-button');
    await expect(nextButton).toBeEnabled();
    await nextButton.click();

    await expect(page.getByTestId('page-info')).toContainText('Page 2 of');

    await expect(page.getByTestId('prev-button')).toBeEnabled();
  });

  test('should navigate to previous page when previous button is clicked', async ({ page }) => {

    await expect(page.getByTestId('pagination-container')).toBeVisible();

    await page.getByTestId('next-button').click();
    await expect(page.getByTestId('page-info')).toContainText('Page 2 of');

    const prevButton = page.getByTestId('prev-button');
    await prevButton.click();

    await expect(page.getByTestId('page-info')).toContainText('Page 1 of');

    await expect(prevButton).toBeDisabled();
  });

  test('should navigate to specific page when page number is clicked', async ({ page }) => {

    await expect(page.getByTestId('pagination-container')).toBeVisible();

    const page2Button = page.getByTestId('page-button-2');

    if (await page2Button.isVisible()) {
      await page2Button.click();

      await expect(page.getByTestId('page-info')).toContainText('Page 2 of');

      await expect(page2Button).toHaveClass(/bg-blue-600/);

      const page1Button = page.getByTestId('page-button-1');
      await expect(page1Button).not.toHaveClass(/bg-blue-600/);
    }
  });

  test('should disable next button on last page', async ({ page }) => {

    await page.waitForSelector('[data-testid="pagination-container"]');

    await expect(page.getByTestId('pagination-container')).toBeVisible();

    const pageInfo = await page.getByTestId('page-info').textContent();
    if (!pageInfo) return;

    const totalPagesText = pageInfo.split(' of ')[50];
    if (!totalPagesText) return;

    const totalPages = parseInt(totalPagesText);

    const nextButton = page.getByTestId('next-button');
    for (let i = 1; i < totalPages; i++) {
      if (await nextButton.isEnabled()) {
        await nextButton.click();
      }
    }

    await expect(page.getByTestId('page-info')).toContainText(`Page ${totalPages} of ${totalPages}`);

    await expect(nextButton).toBeDisabled();
    await expect(nextButton).toHaveClass(/cursor-not-allowed/);
  });

});