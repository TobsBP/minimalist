import { expect, test } from '@playwright/test'

test.describe('Cart page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cart')
  })

  test('renders page heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Your Cart' })).toBeVisible()
  })

  test('renders initial cart items', async ({ page }) => {
    await expect(page.getByText('Concrete Vase')).toBeVisible()
    await expect(page.getByText('Machined Pen')).toBeVisible()
  })

  test('renders summary section with subtotal', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Summary' })).toBeVisible()
    await expect(page.getByText('Subtotal')).toBeVisible()
    await expect(page.getByText('Shipping')).toBeVisible()
  })

  test('initial subtotal is correct (45 + 85×2 = $215.00)', async ({ page }) => {
    const totalElements = page.getByText('$215.00')
    await expect(totalElements.first()).toBeVisible()
  })

  test('increase quantity updates subtotal', async ({ page }) => {
    // Concrete Vase starts at qty 1 ($45). Increasing adds $45 → total $260.
    const increaseButtons = page.getByRole('button', { name: 'Increase quantity' })
    await increaseButtons.first().click()

    await expect(page.getByText('$260.00').first()).toBeVisible()
  })

  test('decrease quantity updates subtotal', async ({ page }) => {
    // Machined Pen starts at qty 2 ($85 each). Decreasing → qty 1 → total $130.
    const decreaseButtons = page.getByRole('button', { name: 'Decrease quantity' })
    await decreaseButtons.nth(1).click()

    await expect(page.getByText('$130.00').first()).toBeVisible()
  })

  test('decreasing quantity to 0 removes the item', async ({ page }) => {
    // Concrete Vase is at qty 1. Clicking minus once removes it.
    const decreaseButtons = page.getByRole('button', { name: 'Decrease quantity' })
    await decreaseButtons.first().click()

    await expect(page.getByText('Concrete Vase')).not.toBeVisible()
  })

  test('remove button deletes the item', async ({ page }) => {
    const removeButtons = page.getByRole('button', { name: 'Remove' })
    await removeButtons.first().click()

    await expect(page.getByText('Concrete Vase')).not.toBeVisible()
  })

  test('shows empty cart message when all items are removed', async ({ page }) => {
    const removeButtons = page.getByRole('button', { name: 'Remove' })
    await removeButtons.first().click()
    await removeButtons.first().click()

    await expect(page.getByText('Your cart is empty.')).toBeVisible()
  })

  test('renders Checkout button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Checkout' })).toBeVisible()
  })

  test('renders header and footer', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'MINIMALIST' })).toBeVisible()
  })
})
