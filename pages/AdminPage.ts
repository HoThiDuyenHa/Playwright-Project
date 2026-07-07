import { Locator, Page } from '@playwright/test';

export class AdminPage {
  readonly page: Page;
  readonly menuAdmin: Locator;
  readonly addBtn: Locator;
  readonly saveBtn: Locator;
  readonly formLoader: Locator;

  readonly roleDropdown: Locator;
  readonly statusDropdown: Locator;
  readonly employeeNameInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;

  readonly selectOptions: Locator;
  readonly autocompleteOptions: Locator;
  readonly usernameErrorMsg: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuAdmin = page.getByRole('link', { name: 'Admin', exact: true });
    this.addBtn = page.locator('button:has-text("Add")');
    this.saveBtn = page.locator('button[type="submit"]');
    this.formLoader = page.locator('.oxd-form-loader');

    this.roleDropdown = page.locator('.oxd-input-group:has-text("User Role") .oxd-select-text');
    this.statusDropdown = page.locator('.oxd-input-group:has-text("Status") .oxd-select-text');
    this.employeeNameInput = page.locator('.oxd-input-group:has-text("Employee Name") input');
    this.usernameInput = page.locator('.oxd-input-group:has-text("Username") input');
    this.passwordInput = page.locator('.oxd-input-group:has-text("Password") input[type="password"]').first();
    this.confirmPasswordInput = page.locator('.oxd-input-group:has-text("Confirm Password") input[type="password"]');

    this.selectOptions = page.locator('.oxd-select-dropdown .oxd-select-option');
    this.autocompleteOptions = page.locator('.oxd-autocomplete-dropdown .oxd-autocomplete-option');
    this.usernameErrorMsg = page.locator('.oxd-input-group:has-text("Username") .oxd-input-field-error-message');
  }

  async navigateToSystemUsers() {
    await this.menuAdmin.waitFor({ state: 'visible' });
    await this.menuAdmin.click();
    await this.page.waitForLoadState('networkidle');
  }

  async createUser(role: 'ESS' | 'Admin', employeeName: string, status: 'Enabled' | 'Disabled', username: string, pass: string) {
    await this.navigateToSystemUsers();
    await this.addBtn.click();
    await this.page.waitForLoadState('networkidle');
    await this.formLoader.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});

    await this.roleDropdown.click();
    await this.selectOptions.filter({ hasText: role }).first().click();

    await this.employeeNameInput.fill(employeeName.split(' ')[0]);
    await this.page.waitForTimeout(3000);
    await this.autocompleteOptions.first().click();

    await this.statusDropdown.click();
    await this.selectOptions.filter({ hasText: status }).first().click();

    await this.usernameInput.fill(username);
    await this.passwordInput.fill(pass);
    await this.confirmPasswordInput.fill(pass);

    await this.saveBtn.click();
    await this.page.waitForLoadState('networkidle');
  }
}
