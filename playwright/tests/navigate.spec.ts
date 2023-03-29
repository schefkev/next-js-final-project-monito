import { test } from '@playwright/test';

test('login test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByPlaceholder('Please enter username').click();
  await page.getByPlaceholder('Please enter username').fill('Toby Emmanuel');
  await page.getByPlaceholder('Please enter password').click();
  await page.getByPlaceholder('Please enter password').fill('1234');
  await page.getByRole('button', { name: 'Login' }).click();
});
