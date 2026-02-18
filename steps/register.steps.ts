import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { HomePage } from '../pages/HomePage';

const { Given, When, Then } = createBdd();

When('I navigate to the Register page', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigateToRegister();
});

When('I fill in the registration details with {string}, {string}, {string}, {string}, {string}, {string}', async ({ page }, firstName, lastName, email, telephone, password, subscribe) => {
  const registerPage = new RegisterPage(page);
  const randomId = Math.floor(Math.random() * 10000);
  const finalEmail = email.includes('random') ? `testuser${randomId}@example.com` : email;

  await registerPage.fillRegistrationForm({
    firstName: firstName,
    lastName: lastName,
    email: finalEmail,
    telephone: telephone,
    password: password,
    subscribe: subscribe === 'yes'
  });
});

When('I agree to the Privacy Policy', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  await registerPage.selectPrivacyPolicy();
});

When('I submit the registration form', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  await registerPage.submitForm();
});

Then('I should see a success message indicating account creation', async ({ page }) => {
  await expect(page.locator('#content')).toContainText('Congratulations! Your new account has been successfully created!');
});
