import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
await mkdir('artifacts', { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-swiftshader'] })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
const errors = [], failed = []
page.on('pageerror', error => { errors.push(error.stack); console.log('BROWSER ERROR', error.stack) })
page.on('response', response => { if (response.status() >= 400) failed.push({ url: response.url(), status: response.status() }) })
page.on('requestfailed', request => failed.push({ url: request.url(), error: request.failure() }))
await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
await page.getByRole('button', { name: 'Explore my world' }).waitFor({ timeout: 55000 }).catch(() => {})
await page.waitForTimeout(3000)
await page.screenshot({ path: 'artifacts/welcome.png' })
console.log('WELCOME', await page.locator('.loading-note').textContent())
if (await page.getByRole('button', { name: 'Explore my world' }).count() && await page.getByRole('button', { name: 'Explore my world' }).isEnabled()) {
  await page.getByRole('button', { name: 'Explore my world' }).click()
  await page.waitForTimeout(3500)
  await page.screenshot({ path: 'artifacts/journey.png' })
  await page.getByRole('button', { name: 'Travel forward' }).click()
  await page.waitForTimeout(2000)
  await page.screenshot({ path: 'artifacts/journey-moved.png' })
}
console.log('ERRORS', JSON.stringify(errors)); console.log('REQUESTS', JSON.stringify(failed))
await writeFile('artifacts/browser-report.json', JSON.stringify({ errors, failed }, null, 2))
await browser.close()
