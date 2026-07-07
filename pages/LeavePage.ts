import { Locator, Page } from '@playwright/test';

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
  }

  async navigateToLeave() {
    await this.menuLeave.waitFor({ state: 'visible' });
    await this.menuLeave.click();
    await this.applyTab.waitFor({ state: 'visible' });
    await this.applyTab.click();
    await this.page.waitForLoadState('networkidle');
    await this.page.locator('.oxd-form-loader').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }

  async selectLeaveType(type: string) {
    await this.page.waitForLoadState('networkidle');
    await this.page.locator('.oxd-form-loader').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
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
    await this.page.locator('.oxd-form-loader').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    await this.statusDropdown.click();
    await this.page.getByRole('option', { name: status, exact: true }).click();
    await this.searchButton.click();
  }

  async approveFirstRequest() {
    await this.tableRows.first().waitFor({ state: 'visible' });
    const approveBtn = this.tableRows.first().getByRole('button', { name: 'Approve' });
    await approveBtn.click();
  }

  async rejectFirstRequest() {
    await this.tableRows.first().waitFor({ state: 'visible' });
    const rejectBtn = this.tableRows.first().getByRole('button', { name: 'Reject' });
    await rejectBtn.click();
  }

  async selectLeaveStatus(status: string) {
    await this.page.waitForLoadState('networkidle');
    await this.page.locator('.oxd-form-loader').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    await this.statusDropdown.click();
    await this.page.getByRole('option', { name: status, exact: true }).click();
  }

  async searchLeave() {
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async addEntitlement(empName: string, leaveType: string, amount: string) {
    await this.page.waitForLoadState('networkidle');
    await this.page.locator('.oxd-form-loader').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    await this.entitlementEmpInput.fill(empName);
    await this.page.waitForTimeout(3000);
    await this.autocompleteOptions.first().click();

    await this.entitlementLeaveTypeDropdown.click();
    await this.page.waitForTimeout(1000);
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
    await this.page.waitForTimeout(2000);
    if (await this.autocompleteOptions.count() > 0) {
      await this.autocompleteOptions.first().click();
    }
  }
}