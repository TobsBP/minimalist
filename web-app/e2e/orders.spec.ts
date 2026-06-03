import { expect, test } from '@playwright/test'

test.describe('Orders page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/orders')
  })

  test('renders page heading and subtitle', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible()
    await expect(page.getByText('Manage and track your recent activity.')).toBeVisible()
  })

  test('renders Filter and Help buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /filter/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /help/i })).toBeVisible()
  })

  test('renders all three orders', async ({ page }) => {
    await expect(page.getByText('#ORD-2024-88A1')).toBeVisible()
    await expect(page.getByText('#ORD-2024-77B2')).toBeVisible()
    await expect(page.getByText('#ORD-2024-12C9')).toBeVisible()
  })

  test('renders status badges for each order', async ({ page }) => {
    await expect(page.getByText('Pending')).toBeVisible()
    await expect(page.getByText('Shipped')).toBeVisible()
    await expect(page.getByText('Delivered')).toBeVisible()
  })

  test('renders order totals', async ({ page }) => {
    await expect(page.getByText('$245.00')).toBeVisible()
    await expect(page.getByText('$85.50')).toBeVisible()
    await expect(page.getByText('$1,200.00')).toBeVisible()
  })

  test('clicking a pending order expands items', async ({ page }) => {
    await page.getByText('#ORD-2024-88A1').click()

    await expect(page.getByText('Items in Shipment')).toBeVisible()
    await expect(page.getByText('Ceramic Pour-Over Cone')).toBeVisible()
    await expect(page.getByText('Heavy Canvas Tote')).toBeVisible()
  })

  test('pending order shows Track Package button when expanded', async ({ page }) => {
    await page.getByText('#ORD-2024-88A1').click()

    await expect(page.getByRole('button', { name: /track package/i })).toBeVisible()
  })

  test('clicking a shipped order expands its items', async ({ page }) => {
    await page.getByText('#ORD-2024-77B2').click()

    await expect(page.getByText('Items in Shipment')).toBeVisible()
    await expect(page.getByText('Archival Notebook — Blank')).toBeVisible()
  })

  test('clicking a delivered order shows delivery date', async ({ page }) => {
    await page.getByText('#ORD-2024-12C9').click()

    await expect(page.getByText(/delivered on sep 05, 2024/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /view invoice/i })).toBeVisible()
  })

  test('clicking an expanded order collapses it', async ({ page }) => {
    await page.getByText('#ORD-2024-88A1').click()
    await expect(page.getByText('Items in Shipment')).toBeVisible()

    await page.getByText('#ORD-2024-88A1').click()
    await expect(page.getByText('Items in Shipment')).not.toBeVisible()
  })

  test('only one order is expanded at a time', async ({ page }) => {
    await page.getByText('#ORD-2024-88A1').click()
    await page.getByText('#ORD-2024-77B2').click()

    // First order's items should be hidden, second order's items visible
    await expect(page.getByText('Ceramic Pour-Over Cone')).not.toBeVisible()
    await expect(page.getByText('Archival Notebook — Blank')).toBeVisible()
  })

  test('renders pagination controls', async ({ page }) => {
    await expect(page.getByText('Page 1 of 4')).toBeVisible()
    await expect(page.getByRole('button', { name: /prev/i })).toBeDisabled()
    await expect(page.getByRole('button', { name: /next/i })).toBeVisible()
  })
})
