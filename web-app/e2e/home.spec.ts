import { expect, test } from '@playwright/test'

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders hero section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /objects that earn their place/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /shop collection/i })).toBeVisible()
  })

  test('renders new arrivals grid with 4 products', async ({ page }) => {
    const section = page.getByText('New Arrivals')
    await expect(section).toBeVisible()

    await expect(page.getByText('Concrete Vase')).toBeVisible()
    await expect(page.getByText('Machined Pen')).toBeVisible()
    await expect(page.getByText('Ceramic Pour-Over')).toBeVisible()
    await expect(page.getByText('Archival Notebook')).toBeVisible()
  })

  test('renders shop by category section with 3 categories', async ({ page }) => {
    await expect(page.getByText('Shop by Category')).toBeVisible()
    await expect(page.getByRole('link', { name: /objects/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /tools/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /materials/i })).toBeVisible()
  })

  test('renders journal teaser section', async ({ page }) => {
    await expect(page.getByText(/on restraint/i)).toBeVisible()
    await expect(page.getByRole('link', { name: /read more/i })).toBeVisible()
  })

  test('header shows MINIMALIST logo linking to home', async ({ page }) => {
    const logo = page.getByRole('link', { name: 'MINIMALIST' })
    await expect(logo).toBeVisible()
    await expect(logo).toHaveAttribute('href', '/')
  })

  test('clicking shop collection navigates to /shop', async ({ page }) => {
    await page.getByRole('link', { name: /shop collection/i }).click()
    await expect(page).toHaveURL('/shop')
  })
})
