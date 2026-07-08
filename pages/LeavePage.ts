import { expect, Locator, Page } from '@playwright/test';

export class LeavePage {
  readonly page: Page;
  readonly menuLeave: Locator;
  readonly fromDateInput: Locator;
  readonly toDateInput: Locator;
  readonly applyButton: Locator;
  readonly statusDropdown: Locator;
  readonly searchButton: Locator;
  readonly tableRows: Locator;
  readonly toastMessage: Locator;
  readonly errorMessage: Locator;
  readonly confirmButton: Locator;
  
  readonly applyTab: Locator;
  readonly leaveTypeDropdown: Locator;
  readonly selectOptions: Locator;
  readonly searchEmpInput: Locator;
  readonly autocompleteOptions: Locator;

  readonly entitlementEmpInput: Locator;
  readonly entitlementLeaveTypeDropdown: Locator;
  readonly entitlementInput: Locator;
  readonly entitlementSubmitButton: Locator;
  readonly entitlementConfirmButton: Locator;
  
  // Custom helpers to avoid inline selectors in methods
  readonly formLoader: Locator;
  readonly optionLocator: Locator;
  readonly approveButtonInRow: Locator;
  readonly rejectButtonInRow: Locator;
  readonly pendingApprovalText: Locator;

  // Tabs for navigation
  readonly entitlementsTab: Locator;
  readonly addEntitlementsOption: Locator;
  readonly myLeaveTab: Locator;
  readonly leaveListTab: Locator;

  constructor(page: Page) {
    this.page = page;
    
    this.menuLeave = page.getByRole('link', { name: 'Leave', exact: true });
    this.fromDateInput = page.locator('input[placeholder="yyyy-dd-mm"]').first();
    this.toDateInput = page.locator('input[placeholder="yyyy-dd-mm"]').nth(1);
    this.applyButton = page.getByRole('button', { name: 'Apply' });
    
    this.statusDropdown = page.locator('.oxd-select-text--active').first();
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.tableRows = page.locator('.oxd-table-card');
    this.toastMessage = page.locator('.oxd-toast-content').first();
    this.errorMessage = page.locator('.oxd-input-field-error-message');
    this.confirmButton = page.getByRole('button', { name: 'Yes, Approve' }); 

    this.applyTab = page.locator('.oxd-topbar-body-nav-tab', { hasText: 'Apply' });
    this.leaveTypeDropdown = page.locator('.oxd-input-group:has-text("Leave Type") .oxd-select-text');
    this.selectOptions = page.locator('.oxd-select-dropdown .oxd-select-option');
    this.searchEmpInput = page.locator('.oxd-autocomplete-text-input input');
    this.autocompleteOptions = page.locator('.oxd-autocomplete-dropdown .oxd-autocomplete-option');

    this.entitlementEmpInput = page.locator('.oxd-input-group:has-text("Employee Name") input');
    this.entitlementLeaveTypeDropdown = page.locator('.oxd-input-group:has-text("Leave Type") .oxd-select-text');
    this.entitlementInput = page.locator('.oxd-input-group:has-text("Entitlement") input');
    this.entitlementSubmitButton = page.locator('button[type="submit"]');
    this.entitlementConfirmButton = page.locator('button:has-text("Confirm"), button:has-text("Ok")');

    this.formLoader = page.locator('.oxd-form-loader');
    this.optionLocator = page.getByRole('option');
    this.approveButtonInRow = page.getByRole('button', { name: 'Approve' });
    this.rejectButtonInRow = page.getByRole('button', { name: 'Reject' });
    this.pendingApprovalText = page.getByText('Pending Approval');

    this.entitlementsTab = page.locator('.oxd-topbar-body-nav-tab', { hasText: 'Entitlements' });
    this.addEntitlementsOption = page.locator('.oxd-dropdown-menu >> text="Add Entitlements"');
    this.myLeaveTab = page.locator('.oxd-topbar-body-nav-tab', { hasText: 'My Leave' });
    this.leaveListTab = page.locator('.oxd-topbar-body-nav-tab', { hasText: 'Leave List' });
  }

  async navigateToLeave() {
    await this.menuLeave.waitFor({ state: 'visible' });
    await this.menuLeave.click();
    await this.applyTab.waitFor({ state: 'visible' });
    await this.applyTab.click();
    await this.page.waitForLoadState('networkidle');
    await this.formLoader.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }

  async navigateToAddEntitlements() {
    await this.entitlementsTab.click();
    await this.addEntitlementsOption.click();
  }

  async navigateToMyLeave() {
    await this.myLeaveTab.click();
  }

  async navigateToLeaveList() {
    await this.leaveListTab.click();
  }

  async selectLeaveType(type: string) {
    await this.page.waitForLoadState('networkidle');
    await this.formLoader.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    await this.leaveTypeDropdown.waitFor({ state: 'visible' });
    await this.leaveTypeDropdown.click();
    await this.selectOptions.filter({ hasText: type }).first().click();
  }

  async fillLeaveForm(start: string, end: string) {
    await this.fromDateInput.focus();
    await this.page.keyboard.press('Control+A');
    await this.page.keyboard.press('Backspace');
    await this.fromDateInput.fill(start);

    await this.toDateInput.focus();
    await this.page.keyboard.press('Control+A');
    await this.page.keyboard.press('Backspace');
    await this.toDateInput.fill(end);
    
    await this.page.keyboard.press('Escape');
  }

  async submitRequest() {
    await this.applyButton.click();
  }

  async filterLeaveStatus(status: string) {
    await this.page.waitForLoadState('networkidle');
    await this.formLoader.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    await this.statusDropdown.click();
    await this.optionLocator.filter({ hasText: status }).first().click();
    await this.searchButton.click();
  }

  async approveFirstRequest() {
    await this.tableRows.first().waitFor({ state: 'visible' });
    await this.tableRows.first().locator(this.approveButtonInRow).click();
  }

  async rejectFirstRequest() {
    await this.tableRows.first().waitFor({ state: 'visible' });
    await this.tableRows.first().locator(this.rejectButtonInRow).click();
  }

  async selectLeaveStatus(status: string) {
    await this.page.waitForLoadState('networkidle');
    await this.formLoader.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    await this.statusDropdown.click();
    await this.optionLocator.filter({ hasText: status }).first().click();
  }

  async searchLeave() {
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async addEntitlement(empName: string, leaveType: string, amount: string) {
    await this.page.waitForLoadState('networkidle');
    await this.formLoader.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    await this.entitlementEmpInput.fill(empName);
    await this.autocompleteOptions.filter({ hasText: empName }).first().waitFor({ state: 'visible', timeout: 8000 });
    await this.autocompleteOptions.filter({ hasText: empName }).first().click();

    await this.entitlementLeaveTypeDropdown.click();
    await this.selectOptions.filter({ hasText: leaveType }).first().waitFor({ state: 'visible', timeout: 5000 });
    await this.selectOptions.filter({ hasText: leaveType }).first().click();

    await this.entitlementInput.fill(amount);
    await this.entitlementSubmitButton.click();
    
    try {
      await this.entitlementConfirmButton.waitFor({ state: 'visible', timeout: 5000 });
      await this.entitlementConfirmButton.click();
    } catch (e) {
    }
    await this.toastMessage.waitFor({ state: 'visible', timeout: 30000 });
  }

  async filterByEmployee(empName: string) {
    await this.searchEmpInput.fill(empName);
    await this.autocompleteOptions.filter({ hasText: empName }).first().waitFor({ state: 'visible', timeout: 8000 });
    await this.autocompleteOptions.filter({ hasText: empName }).first().click();
  }

  // Verification Methods (POM assertions)
  async verifyToastMessageVisible() {
    await expect(this.toastMessage).toBeVisible();
  }

  async verifyToastMessageContains(text: string | RegExp) {
    await expect(this.toastMessage).toContainText(text);
  }

  async verifyPendingApprovalVisible() {
    await expect(this.pendingApprovalText.first()).toBeVisible();
  }

  async verifyErrorMessageVisible() {
    await expect(this.errorMessage).toBeVisible();
  }
}