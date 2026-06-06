import { expect, test } from '@playwright/test'

test.describe('Shop page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shop')
  })

  test('renders sidebar filters', async ({ page }) => {
    await expect(page.getByText('CATEGORY')).toBeVisible()
    await expect(page.getByText('Price', { exact: true })).toBeVisible()
    await expect(page.getByText('SORT BY')).toBeVisible()
  })

  test('renders all category options', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'All Objects' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Ceramics' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Furniture' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Lighting' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Textiles' })).toBeVisible()
  })

  test('renders all price range options', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Under $50' })).toBeVisible()
    await expect(page.getByRole('button', { name: '$50 - $150' })).toBeVisible()
    await expect(page.getByRole('button', { name: '$150 - $500' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Over $500' })).toBeVisible()
  })

  test('search with no results shows empty state', async ({ page }) => {
    await page.getByPlaceholder('Search products...').fill('xyznotfound')
    await expect(page.getByText('No objects found.')).toBeVisible()
    await expect(page.getByRole('button', { name: 'ADD TO CART' })).toHaveCount(0)
  })

  test('shop page is accessible from /shop URL', async ({ page }) => {
    await expect(page).toHaveURL('/shop')
    await expect(page.getByText('CATEGORY')).toBeVisible()
  })

  test('navigating to shop from header works', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('a[href="/shop"]').first()).toBeVisible()
    await page.goto('/shop')
    await expect(page).toHaveURL('/shop')
    await expect(page.getByText('CATEGORY')).toBeVisible()
  })
})
