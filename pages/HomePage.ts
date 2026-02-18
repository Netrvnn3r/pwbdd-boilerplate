import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly myAccountDropdown: Locator;
    readonly registerLink: Locator;
    readonly loginLink: Locator;
    readonly cartButton: Locator;
    readonly navMenu: Locator;
    readonly heroCarousel: Locator;
    readonly featuredSection: Locator;
    readonly footer: Locator;
    readonly featuredProductCards: Locator;

    constructor(page: Page) {
        super(page);
        this.searchInput = page.locator("input[name='search']");
        this.searchButton = page.locator("#search button");
        this.myAccountDropdown = page.locator("a[title='My Account']");
        this.registerLink = page.locator("ul.dropdown-menu-right a", { hasText: 'Register' });
        this.loginLink = page.locator("ul.dropdown-menu-right a", { hasText: 'Login' });
        this.cartButton = page.locator("#cart button");
        this.navMenu = page.locator("#menu .navbar-collapse");
        this.heroCarousel = page.locator("#slideshow0");
        this.featuredSection = page.locator("h3", { hasText: 'Featured' });
        this.footer = page.locator("footer");
        this.featuredProductCards = page.locator(".product-layout");
    }

    async searchForProduct(productName: string) {
        await this.searchInput.fill(productName);
        await this.searchButton.click();
    }

    async navigateToRegister() {
        await this.myAccountDropdown.click();
        await this.registerLink.click();
    }

    async getNavMenuItems(): Promise<string[]> {
        const items = await this.page.locator("#menu .nav > li > a").all();
        const texts: string[] = [];
        for (const item of items) {
            const text = await item.textContent();
            if (text) texts.push(text.trim());
        }
        return texts;
    }

    async getFeaturedProductLinks(): Promise<{ name: string; href: string }[]> {
        const cards = await this.page.locator(".product-layout h4 a").all();
        const products: { name: string; href: string }[] = [];
        for (const card of cards) {
            const name = (await card.textContent())?.trim() ?? '';
            const href = (await card.getAttribute('href')) ?? '';
            if (name && href) products.push({ name, href });
        }
        return products;
    }
}
