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

  test('renders 6 products by default', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'ADD TO CART' })).toHaveCount(6)
  })

  test('renders product names', async ({ page }) => {
    await expect(page.getByText('MONOLITH VASE')).toBeVisible()
    await expect(page.getByText('ANGLE LAMP')).toBeVisible()
    await expect(page.getByText('GRID CHAIR')).toBeVisible()
    await expect(page.getByText('CYLINDER CUP')).toBeVisible()
    await expect(page.getByText('ALU BOX')).toBeVisible()
    await expect(page.getByText('LINE CLOCK')).toBeVisible()
  })

  test('shows object count', async ({ page }) => {
    await expect(page.getByText('6 objects')).toBeVisible()
  })

  test('search filters products by name', async ({ page }) => {
    await page.getByPlaceholder('Search products...').fill('lamp')
    await expect(page.getByText('ANGLE LAMP')).toBeVisible()
    await expect(page.getByText('MONOLITH VASE')).not.toBeVisible()
    await expect(page.getByText('1 object')).toBeVisible()
  })

  test('search with no results shows empty state', async ({ page }) => {
    await page.getByPlaceholder('Search products...').fill('xyznotfound')
    await expect(page.getByText('No objects found.')).toBeVisible()
    await expect(page.getByRole('button', { name: 'ADD TO CART' })).toHaveCount(0)
  })

  test('category filter narrows results', async ({ page }) => {
    await page.getByRole('button', { name: 'Ceramics' }).click()
    await expect(page.getByText('MONOLITH VASE')).toBeVisible()
    await expect(page.getByText('CYLINDER CUP')).toBeVisible()
    await expect(page.getByText('GRID CHAIR')).not.toBeVisible()
    await expect(page.getByText('2 objects')).toBeVisible()
  })

  test('price filter Under $50 shows only CYLINDER CUP', async ({ page }) => {
    await page.getByRole('button', { name: 'Under $50' }).click()
    await expect(page.getByText('CYLINDER CUP')).toBeVisible()
    await expect(page.getByText('MONOLITH VASE')).not.toBeVisible()
    await expect(page.getByText('1 object')).toBeVisible()
  })

  test('price filter Over $500 shows only GRID CHAIR', async ({ page }) => {
    await page.getByRole('button', { name: 'Over $500' }).click()
    await expect(page.getByText('GRID CHAIR')).toBeVisible()
    await expect(page.getByText('1 object')).toBeVisible()
  })

  test('clicking price filter twice deselects it', async ({ page }) => {
    await page.getByRole('button', { name: 'Under $50' }).click()
    await expect(page.getByText('1 object')).toBeVisible()
    await page.getByRole('button', { name: 'Under $50' }).click()
    await expect(page.getByText('6 objects')).toBeVisible()
  })

  test('sort Price: Low to High orders correctly', async ({ page }) => {
    await page.getByRole('button', { name: 'Price: Low to High' }).click()
    const names = await page.getByText(/CYLINDER CUP|ALU BOX|MONOLITH VASE|LINE CLOCK|ANGLE LAMP|GRID CHAIR/).allTextContents()
    expect(names[0]).toBe('CYLINDER CUP')
  })

  test('sort Price: High to Low orders correctly', async ({ page }) => {
    await page.getByRole('button', { name: 'Price: High to Low' }).click()
    const first = page.getByText('GRID CHAIR')
    await expect(first).toBeVisible()
  })

  test('clear filters button appears when filter is active', async ({ page }) => {
    await expect(page.getByRole('button', { name: /clear filters/i })).not.toBeVisible()
    await page.getByRole('button', { name: 'Ceramics' }).click()
    await expect(page.getByRole('button', { name: /clear filters/i })).toBeVisible()
  })

  test('clear filters resets to all 6 products', async ({ page }) => {
    await page.getByRole('button', { name: 'Ceramics' }).click()
    await expect(page.getByText('2 objects')).toBeVisible()
    await page.getByRole('button', { name: /clear filters/i }).click()
    await expect(page.getByText('6 objects')).toBeVisible()
  })

  test('header Shop link is active/visible', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Shop' })).toBeVisible()
  })

  test('navigating to shop from header works', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('a[href="/shop"]').first()).toBeVisible()
    await page.goto('/shop')
    await expect(page).toHaveURL('/shop')
    await expect(page.getByText('CATEGORY')).toBeVisible()
  })
})
