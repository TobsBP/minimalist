import { expect, test } from '@playwright/test'

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('renders heading and subtitle', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible()
    await expect(page.getByText('Welcome back. Please enter your details.')).toBeVisible()
  })

  test('renders email and password fields', async ({ page }) => {
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
  })

  test('renders Sign In and Continue with Google buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
    await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible()
  })

  test('renders Forgot? link', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Forgot?' })).toBeVisible()
  })

  test('renders link to signup page', async ({ page }) => {
    const signupLink = page.getByRole('link', { name: 'Sign up' })
    await expect(signupLink).toBeVisible()
    await signupLink.click()
    await expect(page).toHaveURL('/signup')
  })

  test('user can type into email and password fields', async ({ page }) => {
    await page.getByLabel('Email').fill('user@example.com')
    await page.getByLabel('Password').fill('secret123')

    await expect(page.getByLabel('Email')).toHaveValue('user@example.com')
    await expect(page.getByLabel('Password')).toHaveValue('secret123')
  })

  test('password field is masked', async ({ page }) => {
    await expect(page.getByLabel('Password')).toHaveAttribute('type', 'password')
  })
})

test.describe('Signup page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup')
  })

  test('renders heading and subtitle', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible()
    await expect(page.getByText('Join us today. Please enter your details.')).toBeVisible()
  })

  test('Sign Up button is disabled when fields are empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Sign Up' })).toBeDisabled()
  })
})
