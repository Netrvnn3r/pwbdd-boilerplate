import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchPage extends BasePage {
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly contentContainer: Locator;

    constructor(page: Page) {
        super(page);
        this.searchInput = page.locator('input[name="search"]');
        this.searchButton = page.locator('#search button');
        this.contentContainer = page.locator('#content');
    }

    async selectProduct(productName: string) {
        const productLink = this.page.locator(`div.product-thumb h4 a`, { hasText: productName });
        const exactLink = productLink.filter({ hasText: new RegExp(`^${productName}$`) });

        if (await exactLink.count() > 0) {
            await exactLink.first().click();
        } else {
            await productLink.first().click();
        }
    }
}
