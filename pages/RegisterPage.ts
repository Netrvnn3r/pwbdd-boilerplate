import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly telephoneInput: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly subscribeYesRadio: Locator;
    readonly subscribeNoRadio: Locator;
    readonly privacyPolicyCheckbox: Locator;
    readonly continueButton: Locator;

    constructor(page: Page) {
        super(page);
        this.firstNameInput = page.locator("#input-firstname");
        this.lastNameInput = page.locator("#input-lastname");
        this.emailInput = page.locator("#input-email");
        this.telephoneInput = page.locator("#input-telephone");
        this.passwordInput = page.locator("#input-password");
        this.confirmPasswordInput = page.locator("#input-confirm");
        this.subscribeYesRadio = page.locator("input[name='newsletter'][value='1']");
        this.subscribeNoRadio = page.locator("input[name='newsletter'][value='0']");
        this.privacyPolicyCheckbox = page.locator("input[name='agree']");
        this.continueButton = page.locator("input.btn-primary");
    }


    async navigateToRegisterPage() {
        await this.page.goto('https://opencart.abstracta.us/index.php?route=account/register');
    }

    async fillRegistrationForm(userData: any) {
        await this.firstNameInput.fill(userData.firstName);
        await this.lastNameInput.fill(userData.lastName);
        await this.emailInput.fill(userData.email);
        await this.telephoneInput.fill(userData.telephone);
        await this.passwordInput.fill(userData.password);
        await this.confirmPasswordInput.fill(userData.password);

        if (userData.subscribe) {
            await this.subscribeYesRadio.check();
        } else {
            await this.subscribeNoRadio.check();
        }
    }

    async selectPrivacyPolicy() {
        await this.privacyPolicyCheckbox.check();
    }

    async submitForm() {
        await this.continueButton.click();
    }
}
