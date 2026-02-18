import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchPage } from '../pages/SearchPage';
import { ProductPage } from '../pages/ProductPage';

const { Given, When, Then } = createBdd();

When('I search for {string}', async ({ page }, query: string) => {
  const homePage = new HomePage(page);
  await homePage.searchForProduct(query);
});

When('I select the product {string} from search results', async ({ page }, productName: string) => {
  const searchPage = new SearchPage(page);
  await searchPage.selectProduct(productName);
});

When('I set the quantity to {string}', async ({ page }, qty: string) => {
  const productPage = new ProductPage(page);
  await productPage.setQuantity(qty);
});

When('I click add to cart', async ({ page }) => {
  const productPage = new ProductPage(page);
  await productPage.addToCart();
});

Then('I should see a success message {string}', async ({ page }, message: string) => {
  const productPage = new ProductPage(page);
  await productPage.verifySuccessMessage();
  await expect(productPage.successAlert).toContainText(message.split(':')[0]);
});
