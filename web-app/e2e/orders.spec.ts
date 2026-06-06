import { expect, test } from '@playwright/test'

test.describe('Orders page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/orders')
  })

  test('renders page heading and subtitle', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible()
    await expect(page.getByText('Manage and track your recent activity.')).toBeVisible()
  })
})
