import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CartPage } from '../pages/CartPage';
import { ProductPage } from '../pages/ProductPage';
import { HomePage } from '../pages/HomePage';
import { SearchPage } from '../pages/SearchPage';
import { RegisterPage } from '../pages/RegisterPage';

const { Given, When, Then } = createBdd();

Given('I register a new account', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.navigateToRegisterPage();

    const randomId = Math.floor(Math.random() * 100000);
    const user = {
        firstName: 'Test',
        lastName: 'User',
        email: `testuser${randomId}@example.com`,
        telephone: '1234567890',
        password: 'password123',
        subscribe: false,
        privacyPolicy: true
    };

    await registerPage.fillRegistrationForm(user);
    await registerPage.selectPrivacyPolicy();
    await registerPage.submitForm();
    await expect(page).toHaveURL(/.*success/);
    await page.goto('https://opencart.abstracta.us/');
});

Given('I have added a {string} to my cart', async ({ page }, product: string) => {
  const homePage = new HomePage(page);
  await homePage.navigateTo('https://opencart.abstracta.us/');
  await homePage.searchForProduct(product);

  const searchPage = new SearchPage(page);
  await searchPage.selectProduct(product);

  const productPage = new ProductPage(page);
  await productPage.addToCart();
  await productPage.verifySuccessMessage();
});

Given('I proceed to checkout from the cart page', async ({ page }) => {
  const productPage = new ProductPage(page);
  if (await productPage.successAlert.isVisible()) {
      await productPage.proceedToCart();
  } else {
      await page.goto('https://opencart.abstracta.us/index.php?route=checkout/cart');
  }

  const cartPage = new CartPage(page);
  await cartPage.proceedToCheckout();
});

When('I select Guest Checkout', async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);
  await expect(checkoutPage.guestCheckoutRadio).toBeVisible();
  await checkoutPage.selectGuestCheckout();
});

When('I fill in the billing details with {string}, {string}, {string}, {string}, {string}, {string}, {string}, {string}, {string}', async ({ page }, firstName, lastName, email, telephone, address, city, postCode, country, region) => {
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.fillBillingDetails({
    firstName: firstName,
    lastName: lastName,
    email: email,
    telephone: telephone,
    address1: address,
    city: city,
    postCode: postCode,
    country: country,
    region: region
  });
});

When('I proceed through delivery details', async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.proceedToPaymentMethod();
});

When('I accept the terms and conditions', async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.agreeToTermsAndContinue();
});

When('I verify the order details with {string}, {string}, {string}', async ({ page }, subTotal, shipping, total) => {
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.verifyOrderTotals(subTotal, shipping, total);
});

When('I confirm the order', async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.confirmOrder();
});

Then('I should see the order confirmation page', async ({ page }) => {
  await expect(page).toHaveTitle('Your order has been placed!');
  await expect(page.locator('#content h1')).toHaveText('Your order has been placed!');
});

When('I select the product {string} from the results', async ({ page }, product: string) => {
    const searchPage = new SearchPage(page);
    await searchPage.selectProduct(product);
});

Then('I should see the product availability as {string}', async ({ page }, availability: string) => {
    const productPage = new ProductPage(page);
    await productPage.verifyAvailability(availability);
});

When('I add the product to the cart', async ({ page }) => {
    const productPage = new ProductPage(page);
    await productPage.addToCart();
});

When('I navigate to the cart page', async ({ page }) => {
    const productPage = new ProductPage(page);
    try {
        await productPage.proceedToCart();
    } catch (e) {
        await page.goto('https://opencart.abstracta.us/index.php?route=checkout/cart');
    }
});

Then('I should see the error message {string}', async ({ page }, message: string) => {
    const cartPage = new CartPage(page);
    await cartPage.verifyErrorMessage(message);
});

Then('I should see the product {string} marked with {string}', async ({ page }, product: string, suffix: string) => {
    const cartPage = new CartPage(page);
    await cartPage.verifyProductMarked(product, suffix);
});

Then('I verify the cart total is {string}', async ({ page }, total: string) => {
    const cartPage = new CartPage(page);
    await cartPage.verifyTotal(total);
});
