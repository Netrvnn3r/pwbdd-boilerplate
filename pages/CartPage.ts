import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
    readonly checkoutButton: Locator;
    readonly cartTotalTable: Locator;
    readonly errorAlert: Locator;

    constructor(page: Page) {
        super(page);
        this.checkoutButton = page.locator('a.btn-primary', { hasText: 'Checkout' });
        this.cartTotalTable = page.locator('.table-responsive');
        this.errorAlert = page.locator('.alert-danger');
    }

    async proceedToCheckout() {
        await this.checkoutButton.click();
    }

    async verifyErrorMessage(message: string) {
        await expect(this.errorAlert).toBeVisible();
        await expect(this.errorAlert).toContainText(message);
    }

    async verifyProductMarked(product: string, suffix: string) {
        const cell = this.page.locator('.table-responsive td.text-left', { hasText: product });
        await expect(cell).toContainText(suffix);
    }

    async verifyTotal(total: string) {
        const totalCell = this.page.locator('table.table-bordered td:has-text("Total") + td').last();
        await expect(totalCell).toContainText(total);
    }
}
