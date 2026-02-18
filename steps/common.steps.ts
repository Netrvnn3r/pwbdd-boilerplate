import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

const { Given } = createBdd();

Given('I am on the home page', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigateTo('https://opencart.abstracta.us/');
  await expect(page).toHaveTitle(/Your Store/);
});
