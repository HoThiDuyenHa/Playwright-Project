import { Locator, Page } from '@playwright/test';

export class PIMPage {
  readonly page: Page;
  readonly pimMenuItem: Locator;
  readonly addEmployeeBtn: Locator;
  readonly firstNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly saveBtn: Locator;
  readonly requiredValidationError: Locator;
  readonly employeeListTab: Locator;
  readonly searchNameInput: Locator;
  readonly searchIdInput: Locator;
  readonly searchBtn: Locator;
  readonly tableRows: Locator;
  readonly tableNoRecords: Locator;
  readonly personalDetailsHeader: Locator;
  readonly jobDetailsTab: Locator;
  readonly jobTitleDropdown: Locator;
  readonly emergencyContactsTab: Locator;
  readonly profilePhotoInput: Locator;
  readonly profilePhotoContainer: Locator;
  readonly photoUploadErrorMsg: Locator;
  readonly addContactBtn: Locator;
  readonly contactNameInput: Locator;
  readonly contactRelationshipInput: Locator;
  readonly contactHomePhoneInput: Locator;
  readonly editBtn: Locator;
  readonly deleteBtn: Locator;
  readonly yesDeleteBtn: Locator;
  readonly createLoginDetailsCheckbox: Locator;
  readonly createLoginDetailsSwitch: Locator;
  readonly loginUsernameInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginConfirmPasswordInput: Locator;
  readonly toastMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pimMenuItem = page.locator('a:has-text("PIM")');
    this.addEmployeeBtn = page.locator('button:has-text("Add")');
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.middleNameInput = page.locator('input[name="middleName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.employeeIdInput = page.locator('.oxd-input-group:has-text("Employee Id") input');
    this.saveBtn = page.locator('button[type="submit"]');
    this.requiredValidationError = page.locator('.oxd-input-field-error-message');
    this.employeeListTab = page.locator('a:has-text("Employee List")');
    this.searchNameInput = page.locator('.oxd-input-group:has-text("Employee Name") .oxd-autocomplete-text-input input');
    this.searchIdInput = page.locator('.oxd-input-group:has-text("Employee Id") input');
    this.searchBtn = page.locator('button[type="submit"]');
    this.tableRows = page.locator('.oxd-table-card');
    this.tableNoRecords = page.locator('.oxd-toast-content, .orangehrm-horizontal-padding >> text="No Records Found"').first();
    this.personalDetailsHeader = page.locator('h6:has-text("Personal Details")');
    this.jobDetailsTab = page.locator('a:has-text("Job")');
    this.jobTitleDropdown = page.locator('.oxd-input-group:has-text("Job Title") .oxd-select-text');
    this.emergencyContactsTab = page.locator('a:has-text("Emergency Contacts")');
    this.profilePhotoInput = page.locator('input[type="file"]');
    this.profilePhotoContainer = page.locator('.orangehrm-edit-employee-image img.employee-image');
    this.photoUploadErrorMsg = page.locator('.oxd-input-field-error-message');
    this.addContactBtn = page.locator('button:has-text("Add")').first();
    this.contactNameInput = page.locator('.oxd-input-group:has-text("Name") input');
    this.contactRelationshipInput = page.locator('.oxd-input-group:has-text("Relationship") input');
    this.contactHomePhoneInput = page.locator('.oxd-input-group:has-text("Home Telephone") input');
    this.editBtn = page.locator('.oxd-table-cell-actions button .bi-pencil-fill');
    this.deleteBtn = page.locator('.oxd-table-cell-actions button .bi-trash');
    this.yesDeleteBtn = page.locator('button:has-text("Yes, Delete")');
    this.createLoginDetailsCheckbox = page.locator('.oxd-switch-wrapper input[type="checkbox"]');
    this.createLoginDetailsSwitch = page.locator('.oxd-switch-input');
    this.loginUsernameInput = page.locator('.oxd-input-group:has-text("Username") input');
    this.loginPasswordInput = page.locator('input[type="password"]').first();
    this.loginConfirmPasswordInput = page.locator('input[type="password"]').nth(1);
    this.toastMessage = page.locator('.oxd-toast-content');
  }

  async navigateToPIM() {
    await this.pimMenuItem.click();
    await this.page.waitForLoadState('networkidle');
  }

  async addEmployee(firstName: string, lastName: string, middleName = '', empId = '') {
    await this.addEmployeeBtn.click();
    await this.firstNameInput.fill(firstName);
    if (middleName) await this.middleNameInput.fill(middleName);
    await this.lastNameInput.fill(lastName);
    if (empId) {
      await this.employeeIdInput.fill(empId);
    }
    await this.saveBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async searchEmployeeByName(name: string) {
    await this.employeeListTab.click();
    await this.searchNameInput.fill(name);
    await this.page.waitForTimeout(1000);
    await this.searchBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async searchEmployeeById(empId: string) {
    await this.employeeListTab.click();
    await this.page.waitForURL(/.*viewEmployeeList/, { timeout: 30000 });
    await this.searchIdInput.fill(empId);
    await this.searchBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async deleteEmployee(empId: string) {
    await this.page.waitForTimeout(2000);
    await this.searchEmployeeById(empId);
    await this.deleteBtn.first().waitFor({ state: 'visible', timeout: 30000 });
    await this.deleteBtn.first().click();
    await this.yesDeleteBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async uploadPhoto(filePath: string) {
    await this.profilePhotoContainer.waitFor({ state: 'visible', timeout: 30000 });
    await this.profilePhotoContainer.click();
    await this.page.waitForURL(/.*viewPhotograph/, { timeout: 30000 });
    await this.profilePhotoInput.waitFor({ state: 'attached', timeout: 30000 });
    await this.profilePhotoInput.setInputFiles(filePath);
    await this.saveBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async addEmergencyContact(name: string, relationship: string, phone: string) {
    await this.emergencyContactsTab.click();
    await this.addContactBtn.click();
    await this.contactNameInput.fill(name);
    await this.contactRelationshipInput.fill(relationship);
    await this.contactHomePhoneInput.fill(phone);
    await this.saveBtn.click();
  }

  async addEmployeeWithLogin(firstName: string, lastName: string, username: string, password: string, empId = '') {
    await this.addEmployeeBtn.click();
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    if (empId) {
      await this.employeeIdInput.focus();
      await this.page.keyboard.press('Control+A');
      await this.page.keyboard.press('Backspace');
      await this.employeeIdInput.fill(empId);
    }
    await this.createLoginDetailsSwitch.click();

    const usernameInput = this.page.locator('.oxd-input-group:has(label:has-text("Username")) input');
    await usernameInput.waitFor({ state: 'visible', timeout: 10000 });
    await usernameInput.fill(username);
    await this.loginPasswordInput.fill(password);
    await this.loginConfirmPasswordInput.fill(password);
    await this.saveBtn.click();
  }

  async selectJobTitleByIndex(index: number) {
    await this.jobTitleDropdown.click();
    await this.page.locator('.oxd-select-dropdown .oxd-select-option').nth(index).click();
  }
}
