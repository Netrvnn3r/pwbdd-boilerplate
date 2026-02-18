import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
    readonly quantityInput: Locator;
    readonly addToCartButton: Locator;
    readonly successAlert: Locator;
    readonly cartLinkInAlert: Locator;
    readonly availabilityItem: Locator;

    constructor(page: Page) {
        super(page);
        this.quantityInput = page.locator('#input-quantity');
        this.addToCartButton = page.locator('#button-cart');
        this.successAlert = page.locator('.alert-success');
        this.cartLinkInAlert = page.locator('.alert-success a', { hasText: 'shopping cart' });
        this.availabilityItem = page.locator('li', { hasText: 'Availability:' });
    }

    async setQuantity(qty: string) {
        await this.quantityInput.fill(qty);
    }

    async addToCart() {
        await this.addToCartButton.click({ force: true });
    }

    async verifySuccessMessage() {
        const alert = this.successAlert.first();
        await expect(alert).toBeAttached({ timeout: 10000 });
        await this.page.evaluate(() => window.scrollTo(0, 0));
        await expect(alert).toBeVisible({ timeout: 10000 });
        await expect(alert).toContainText('Success: You have added');
    }

    async verifyAvailability(status: string) {
        await expect(this.availabilityItem).toContainText(status);
    }

    async proceedToCart() {
        await this.cartLinkInAlert.click();
    }
}
