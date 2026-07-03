import { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly requiredError: Locator;
  readonly userDropdown: Locator;
  readonly logoutLink: Locator;
  readonly forgotPasswordLink: Locator;
  readonly resetPasswordButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator("input[name='username']");
    this.passwordInput = page.locator("input[name='password']");
    this.loginButton = page.locator("button[type='submit'].orangehrm-login-button");
    this.errorMessage = page.locator("div[role='alert'] .oxd-alert-content-text");
    this.requiredError = page.locator("span.oxd-input-field-error-message");
    this.userDropdown = page.locator(".oxd-userdropdown");
    this.logoutLink = page.locator("text=Logout");
    this.forgotPasswordLink = page.locator("p.orangehrm-login-forgot-header");
    this.resetPasswordButton = page.locator( 'button[type="submit"].orangehrm-forgot-password-button--reset');
    this.cancelButton = page.locator('button[type="button"].orangehrm-forgot-password-button--cancel');
  }

  async navigate() {
    await this.page.goto('/web/index.php/auth/login');
  }

  async login(user: string, pass: string) {
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
  }

  async logout() {
    await this.userDropdown.click();
    await this.logoutLink.click();
  }
}