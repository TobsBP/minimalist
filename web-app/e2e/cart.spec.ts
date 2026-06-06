import { expect, test } from '@playwright/test'

test.describe('Cart page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cart')
  })

  test('renders page heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Your Cart' })).toBeVisible()
  })

  test('renders Checkout button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Checkout' })).toBeVisible()
  })

  test('renders header and footer', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'MINIMALIST' })).toBeVisible()
  })
})
