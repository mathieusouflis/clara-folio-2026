import { expect, test } from '@playwright/test'

test('loads the homepage without browser errors', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', (error) => pageErrors.push(error.message))

  const response = await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' })

  expect(response?.status()).toBe(200)
  await expect(page).toHaveTitle('Clara Baptista — Graphic Designer Paris')
  const main = page.getByRole('main')
  await expect(main).toBeVisible()
  await expect(main.getByRole('heading', { name: 'Portfolio', exact: true })).toBeVisible()

  if (process.env.PLAYWRIGHT_USE_PRODUCTION === 'true') {
    // CI seeds a showcased project so streamed HTTP 200 responses cannot hide
    // a server rendering failure while populating its media relationship.
    const projectImage = main.locator('img[alt="Project image"]').first()
    await expect(projectImage).toBeAttached()
    await expect(projectImage).toHaveAttribute('src', /\S+/)
  }

  expect(pageErrors).toEqual([])
})
