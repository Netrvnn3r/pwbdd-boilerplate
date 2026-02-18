import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
    readonly guestCheckoutRadio: Locator;
    readonly step1ContinueButton: Locator;

    readonly firstnameInput: Locator;
    readonly lastnameInput: Locator;
    readonly emailInput: Locator;
    readonly telephoneInput: Locator;
    readonly address1Input: Locator;
    readonly cityInput: Locator;
    readonly postcodeInput: Locator;
    readonly countrySelect: Locator;
    readonly regionSelect: Locator;
    readonly step2GuestContinueButton: Locator;
    readonly step2RegisteredContinueButton: Locator;

    readonly step4ContinueButton: Locator;

    readonly termsCheckbox: Locator;
    readonly step5ContinueButton: Locator;

    readonly confirmOrderButton: Locator;

    constructor(page: Page) {
        super(page);

        this.guestCheckoutRadio = page.locator('input[value="guest"]');
        this.step1ContinueButton = page.locator('#button-account');

        this.firstnameInput = page.locator('#input-payment-firstname');
        this.lastnameInput = page.locator('#input-payment-lastname');
        this.emailInput = page.locator('#input-payment-email');
        this.telephoneInput = page.locator('#input-payment-telephone');
        this.address1Input = page.locator('#input-payment-address-1');
        this.cityInput = page.locator('#input-payment-city');
        this.postcodeInput = page.locator('#input-payment-postcode');
        this.countrySelect = page.locator('#input-payment-country');
        this.regionSelect = page.locator('#input-payment-zone');
        this.step2GuestContinueButton = page.locator('#button-guest');
        this.step2RegisteredContinueButton = page.locator('#button-payment-address');

        this.step4ContinueButton = page.locator('#button-shipping-method');

        this.termsCheckbox = page.locator('input[name="agree"]');
        this.step5ContinueButton = page.locator('#button-payment-method');

        this.confirmOrderButton = page.locator('#button-confirm');
    }

    async selectGuestCheckout() {
        await this.guestCheckoutRadio.check();
        await this.step1ContinueButton.click();
    }

    async fillBillingDetails(details: any) {
        if (await this.page.locator('input[name="payment_address"][value="existing"]').isVisible()) {
            await this.page.locator('input[name="payment_address"][value="existing"]').check();
            await this.step2RegisteredContinueButton.click();
            return;
        }

        const fillIfVisible = async (locator: Locator, value: string) => {
            try {
                await locator.waitFor({ state: 'visible', timeout: 2000 });
                await locator.fill(value);
            } catch (e) {
            }
        };

        await fillIfVisible(this.firstnameInput, details.firstName);
        await fillIfVisible(this.lastnameInput, details.lastName);
        await fillIfVisible(this.emailInput, details.email);
        await fillIfVisible(this.telephoneInput, details.telephone);

        await this.address1Input.fill(details.address1);
        await this.cityInput.fill(details.city);
        await this.postcodeInput.fill(details.postCode);

        await this.countrySelect.selectOption({ label: details.country });

        await expect(async () => {
            const count = await this.regionSelect.locator('option').count();
            expect(count).toBeGreaterThan(1);
        }).toPass({ timeout: 10000 });

        await expect(this.regionSelect).toBeEnabled();
        await this.page.waitForTimeout(1000);

        if (details.region) {
             await this.regionSelect.selectOption({ label: details.region });
        } else {
             await this.regionSelect.selectOption({ value: '3513' });
        }

        if (await this.step2GuestContinueButton.isVisible()) {
            await this.step2GuestContinueButton.click();
        } else {
            await this.step2RegisteredContinueButton.click();
        }
  }

  async proceedToPaymentMethod() {
    while (true) {
        if (await this.page.locator('.alert.alert-danger').isVisible()) {
            const warning = await this.page.locator('.alert.alert-danger').textContent();
            throw new Error(`Checkout Error Alert: ${warning}`);
        }

        if (await this.page.locator('#collapse-payment-address .text-danger').isVisible()) {
             throw new Error('Step 2 (Billing Details) Validation Error detected.');
        }

        if (await this.page.locator('#collapse-shipping-method .text-danger').isVisible()) {
             throw new Error('Step 4 (Delivery Method) Validation Error detected.');
        }

        const nextStep = await this.page.waitForSelector(
            '#button-shipping-address:visible, #button-shipping-method:visible, #button-payment-method:visible',
            { state: 'visible', timeout: 30000 }
        );

        const id = await nextStep.getAttribute('id');

        if (id === 'button-payment-method') {
            break;
        }

        if (id === 'button-shipping-address') {
             if (await this.page.locator('input[name="shipping_address"][value="existing"]').isVisible()) {
                 await this.page.locator('input[name="shipping_address"][value="existing"]').check();
             }
        }

        await nextStep.scrollIntoViewIfNeeded();
        const isDisabled = await nextStep.getAttribute('disabled');
        if (isDisabled) {
            throw new Error(`Step button ${id} is disabled`);
        }

        await nextStep.click();

        try {
            await nextStep.waitForElementState('hidden', { timeout: 5000 });
        } catch (e) {
        }

        await this.page.waitForTimeout(1000);
    }
  }

    async agreeToTermsAndContinue() {
        await this.termsCheckbox.check();
        await this.step5ContinueButton.click();
    }

    async verifyOrderTotals(subTotal: string, shipping: string, total: string) {
        const table = this.page.locator('.table-bordered:visible').last();
        await expect(table).toBeVisible();

        await expect(this.page.locator('td:has-text("Total")').last()).toBeVisible();

        await expect(this.page.locator('td:has-text("Sub-Total") + td').last()).toContainText(subTotal);

        if (shipping !== 'N/A' && shipping !== '') {
            await expect(this.page.locator('td:has-text("Flat Shipping Rate") + td').last()).toContainText(shipping);
        }

        await expect(this.page.locator('td:has-text("Total") + td').last()).toContainText(total);
    }

    async confirmOrder() {
        await this.confirmOrderButton.click();
    }
}
