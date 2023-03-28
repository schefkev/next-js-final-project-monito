import { test } from '@playwright/test';

test('login test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByPlaceholder('Type here').click();
  await page.getByPlaceholder('Type here').fill('Toby Emmanuel');
  await page.getByPlaceholder('Password here').click();
  await page.getByPlaceholder('Password here').fill('1234');
  await page.getByRole('button', { name: 'Login' }).click();
});
