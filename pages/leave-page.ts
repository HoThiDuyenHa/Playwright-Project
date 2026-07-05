import { Locator, Page } from '@playwright/test';

export class LeavePage {
  readonly page: Page;

  // Sidebar
  readonly leaveMenuItem: Locator;

  // Apply Leave
  readonly applyTab: Locator;
  readonly leaveTypeDropdown: Locator;
  readonly leaveTypeOption: Locator;
  readonly fromDateInput: Locator;
  readonly toDateInput: Locator;
  readonly applyBtn: Locator;
  readonly leaveBalanceText: Locator;
  readonly validationErrorMsg: Locator;

  // Leave List (Admin Approval)
  readonly leaveListTab: Locator;
  readonly employeeNameSearchInput: Locator;
  readonly searchBtn: Locator;
  readonly approveBtn: Locator;
  readonly rejectBtn: Locator;
  readonly statusText: Locator;

  // My Leave (Employee Cancel)
  readonly myLeaveTab: Locator;
  readonly cancelBtn: Locator;

  // Entitlements
  readonly entitlementsDropdown: Locator;
  readonly viewEntitlementsTab: Locator;
  readonly entitlementTableRows: Locator;

  constructor(page: Page) {
    this.page = page;

    // Sidebar
    this.leaveMenuItem = page.locator('a:has-text("Leave")');

    // Apply
    this.applyTab = page.locator('a:has-text("Apply")');
    this.leaveTypeDropdown = page.locator('.oxd-input-group:has-text("Leave Type") .oxd-select-text');
    this.leaveTypeOption = page.locator('.oxd-select-dropdown .oxd-select-option >> nth=1'); // First actual option after select
    this.fromDateInput = page.locator('.oxd-input-group:has-text("From Date") input');
    this.toDateInput = page.locator('.oxd-input-group:has-text("To Date") input');
    this.applyBtn = page.locator('button[type="submit"]');
    this.leaveBalanceText = page.locator('.orangehrm-leave-balance-value'); // Balance container
    this.validationErrorMsg = page.locator('.oxd-input-field-error-message');

    // Leave List
    this.leaveListTab = page.locator('a:has-text("Leave List")');
    this.employeeNameSearchInput = page.locator('.oxd-autocomplete-text-input input');
    this.searchBtn = page.locator('button[type="submit"]');
    this.approveBtn = page.locator('button:has-text("Approve"), button:has-text("Approve")');
    this.rejectBtn = page.locator('button:has-text("Reject"), button:has-text("Reject")');
    this.statusText = page.locator('.oxd-table-cell >> text=/Pending|Approved|Rejected|Cancelled/');

    // My Leave
    this.myLeaveTab = page.locator('a:has-text("My Leave")');
    this.cancelBtn = page.locator('button:has-text("Cancel")');

    // Entitlements
    this.entitlementsDropdown = page.locator('.oxd-topbar-body-nav-tab:has-text("Entitlements")');
    this.viewEntitlementsTab = page.locator('a:has-text("My Entitlements")');
    this.entitlementTableRows = page.locator('.oxd-table-card');
  }

  async navigateToLeave() {
    await this.leaveMenuItem.click();
    await this.page.waitForLoadState('networkidle');
  }

  async applyLeave(fromDate: string, toDate: string) {
    await this.applyTab.click();
    await this.leaveTypeDropdown.click();
    await this.leaveTypeOption.click();
    
    // Clear and fill From Date
    await this.fromDateInput.click();
    await this.page.keyboard.press('Control+A');
    await this.page.keyboard.press('Backspace');
    await this.fromDateInput.fill(fromDate);

    // Clear and fill To Date
    await this.toDateInput.click();
    await this.page.keyboard.press('Control+A');
    await this.page.keyboard.press('Backspace');
    await this.toDateInput.fill(toDate);
    
    // Click header to close calendar popup if opened
    await this.page.locator('h6').first().click();

    await this.applyBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async approveLeaveRequest(employeeName: string) {
    await this.leaveListTab.click();
    await this.employeeNameSearchInput.fill(employeeName);
    await this.page.waitForTimeout(1000);
    await this.searchBtn.click();
    await this.approveBtn.first().click();
    await this.page.waitForLoadState('networkidle');
  }

  async rejectLeaveRequest(employeeName: string) {
    await this.leaveListTab.click();
    await this.employeeNameSearchInput.fill(employeeName);
    await this.page.waitForTimeout(1000);
    await this.searchBtn.click();
    await this.rejectBtn.first().click();
    await this.page.waitForLoadState('networkidle');
  }

  async cancelLeaveRequest() {
    await this.myLeaveTab.click();
    await this.cancelBtn.first().click();
    await this.page.waitForLoadState('networkidle');
  }

  async viewMyEntitlements() {
    await this.entitlementsDropdown.click();
    await this.viewEntitlementsTab.click();
    await this.page.waitForLoadState('networkidle');
  }
}
