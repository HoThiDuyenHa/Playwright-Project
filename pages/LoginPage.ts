import { expect, Locator, Page } from '@playwright/test';

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
  readonly successResetMessage: Locator;

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
    this.resetPasswordButton = page.locator('button[type="submit"].orangehrm-forgot-password-button--reset');
    this.cancelButton = page.locator('button[type="button"].orangehrm-forgot-password-button--cancel');
    this.successResetMessage = page.getByText('Reset Password link sent successfully');
  }

  async navigate() {
    await this.page.goto('/web/index.php/auth/login');
    await this.page.waitForLoadState('networkidle');
  }

  async login(user: string, pass: string) {
    await this.usernameInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
  }

  async logout() {
    await this.userDropdown.click();
    await this.logoutLink.click();
    await this.page.waitForURL(/.*login/, { timeout: 30000 });
    await this.page.waitForLoadState('networkidle');
  }

  async verifyLoginPageDisplayed() {
    await expect(this.page).toHaveURL(/.*login/);
    await expect(this.usernameInput).toBeVisible();
    await expect(this.usernameInput).toBeEnabled();
    await expect(this.usernameInput).toHaveAttribute('placeholder', 'Username');
    await expect(this.passwordInput).toBeVisible();
    await expect(this.passwordInput).toBeEnabled();
    await expect(this.passwordInput).toHaveAttribute('placeholder', 'Password');
    await expect(this.passwordInput).toHaveAttribute('type', 'password');
    await expect(this.loginButton).toBeVisible();
    await expect(this.loginButton).toBeEnabled();
  }

  async verifyDashboardPageDisplayed() {
    await expect(this.page).toHaveURL(/.*dashboard/);
    await expect(this.userDropdown).toBeVisible();
  }

  async verifyUsernameInputWithValue(value: string) {
    await expect(this.usernameInput).toHaveValue(value);
  }

  async verifyPasswordInputWithValue(value: string) {
    await expect(this.passwordInput).toHaveValue(value);
  }

  async verifyLoginUnsuccessful() {
    await expect(this.page).toHaveURL(/.*login/);
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toHaveText('Invalid credentials');
    await expect(this.loginButton).toBeVisible();
  }

  async verifyBlankValidationMessages() {
    await expect(this.requiredError).toHaveCount(2);
    await expect(this.requiredError.nth(0)).toHaveText('Required');
    await expect(this.requiredError.nth(1)).toHaveText('Required');
    await expect(this.page).toHaveURL(/.*login/);
  }

  async verifyPasswordRequiredValidation() {
    await expect(this.requiredError).toHaveCount(1);
    await expect(this.requiredError.first()).toHaveText('Required');
    await expect(this.page).toHaveURL(/.*login/);
  }

  async verifyLogoutSuccess() {
    await expect(this.page).toHaveURL(/.*login/);
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    await expect(this.loginButton).toBeEnabled();
  }

  async verifyForgotPasswordLinkVisible() {
    await expect(this.forgotPasswordLink).toBeVisible();
  }

  async verifyForgotPasswordPageDisplayed() {
    await expect(this.page).toHaveURL(/.*requestPasswordResetCode/);
  }

  async verifyForgotPasswordPageElements() {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.usernameInput).toBeEnabled();
    await expect(this.usernameInput).toHaveAttribute('placeholder', 'Username');
    await expect(this.resetPasswordButton).toBeVisible();
    await expect(this.resetPasswordButton).toBeEnabled();
    await expect(this.cancelButton).toBeVisible();
  }

  async verifyPasswordResetSuccess() {
    await this.page.waitForURL(/.*sendPasswordReset/, { timeout: 60000 });
    await expect(this.page).toHaveURL(/.*sendPasswordReset/);
    await expect(this.successResetMessage).toBeVisible();
  }
}