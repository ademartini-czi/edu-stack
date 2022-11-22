import {test, expect} from '@playwright/test';

test('logging in and out', async ({page}) => {
  await page.goto('/');

  // Log in to an existing account.
  await page.getByRole('link', {name: 'Log In'}).click();
  await page.getByLabel('Email address').fill('rachel@remix.run');
  await page.getByLabel('Password').fill('racheliscool');
  await page.getByRole('button', {name: 'Log in'}).click();

  // Log back out.
  await page.getByRole('button', {name: 'Logout'}).click();

  // Back on logged out page.
  await expect(page.getByRole('link', {name: 'Log in'})).toBeVisible();
});
