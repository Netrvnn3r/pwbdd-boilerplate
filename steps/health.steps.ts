import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';

const { Given, When, Then } = createBdd();

Then('the {string} should be visible', async ({ page }, elementName: string) => {
  const homePage = new HomePage(page);
  let locator: import('@playwright/test').Locator;

  switch (elementName) {
    case 'Search Bar':
      locator = homePage.searchInput;
      break;
    case 'My Account':
    case 'My Account menu':
      locator = homePage.myAccountDropdown;
      break;
    case 'Shopping Cart':
    case 'Shopping Cart button':
      locator = homePage.cartButton;
      break;
    case 'Navigation Menu':
      locator = homePage.navMenu;
      break;
    case 'Hero Carousel':
      locator = homePage.heroCarousel;
      break;
    case 'Featured Section':
      locator = homePage.featuredSection;
      break;
    case 'Footer':
      locator = homePage.footer;
      break;
    default:
      throw new Error(`Element "${elementName}" not defined in step mapping`);
  }

  await expect(locator).toBeVisible();
});

Then('the navigation menu should contain {string}', async ({ page }, category: string) => {
  const homePage = new HomePage(page);
  const navItems = await homePage.getNavMenuItems();
  const found = navItems.some(item => item.includes(category));
  expect(found, `Navigation menu should contain "${category}". Found: ${navItems.join(', ')}`).toBe(true);
});

Then('all featured products should display a name and price', async ({ page }) => {
  const cards = await page.locator('.product-layout').all();
  expect(cards.length, 'Featured section should have at least one product').toBeGreaterThan(0);

  for (const card of cards) {
    const name = card.locator('h4 a');
    const price = card.locator('.price');
    await expect(name, 'Each featured product should have a visible name').toBeVisible();
    await expect(price, 'Each featured product should have a visible price').toBeVisible();
    const nameText = (await name.textContent())?.trim();
    expect(nameText, 'Product name should not be empty').toBeTruthy();
  }
});

Then('each featured product should navigate to a valid product page with availability info', async ({ page }) => {
  const homePage = new HomePage(page);
  const homeUrl = page.url();

  const products = await homePage.getFeaturedProductLinks();
  expect(products.length, 'There should be at least one featured product').toBeGreaterThan(0);

  for (const product of products) {
    await page.goto(product.href);
    await page.waitForLoadState('domcontentloaded');

    const productPage = new ProductPage(page);

    await expect(page.locator('#content h1'), `Product "${product.name}" should have a visible h1 heading`).toBeVisible();
    const heading = (await page.locator('#content h1').textContent())?.trim();
    expect(heading, `Product "${product.name}" heading should not be empty`).toBeTruthy();

    await expect(page.locator('#content ul.list-unstyled h2').first(), `Product "${product.name}" should display a price`).toBeVisible();

    const availabilityLocator = productPage.availabilityItem.first();
    await expect(availabilityLocator, `Product "${product.name}" should display availability`).toBeVisible();
    const availability = (await availabilityLocator.textContent())?.trim();
    expect(availability, `Product "${product.name}" availability should not be empty`).toBeTruthy();

    await page.goto(homeUrl);
    await page.waitForLoadState('domcontentloaded');
  }
});

When('I retrieve all footer hyperlinks', async ({ page }) => {
});

Then('all footer links should be valid and return a 200 OK status', async ({ page }) => {
  const homePage = new HomePage(page);
  const links = await homePage.getFooterLinks();
  const urls: string[] = [];

  for (const link of links) {
    const href = await link.getAttribute('href');
    if (href && !href.startsWith('mailto:') && !href.startsWith('javascript:')) {
      if (href.includes('opencart.abstracta.us') || href.startsWith('/')) {
        urls.push(href);
      }
    }
  }

  console.log(`Checking ${urls.length} footer links...`);

  for (const url of urls) {
    try {
      const response = await page.request.get(url);
      expect(response.status(), `Link ${url} should return 200`).toBe(200);
    } catch (e) {
      console.error(`Failed to check ${url}: ${e}`);
      throw e;
    }
  }
});
