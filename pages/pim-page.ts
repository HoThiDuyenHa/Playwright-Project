import { Locator, Page, expect } from '@playwright/test';

export class PIMPage {
  readonly page: Page;

  // Sidebar / Header
  readonly pimMenuItem: Locator;

  // Add Employee Page
  readonly addEmployeeBtn: Locator;
  readonly firstNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly saveBtn: Locator;
  readonly requiredValidationError: Locator;

  // Search / List Employee
  readonly employeeListTab: Locator;
  readonly searchNameInput: Locator;
  readonly searchIdInput: Locator;
  readonly searchBtn: Locator;
  readonly tableRows: Locator;
  readonly tableNoRecords: Locator;

  // Details Page
  readonly personalDetailsHeader: Locator;
  readonly jobDetailsTab: Locator;
  readonly jobTitleDropdown: Locator;
  readonly emergencyContactsTab: Locator;

  // Photo Upload
  readonly profilePhotoInput: Locator;
  readonly profilePhotoContainer: Locator;
  readonly photoUploadErrorMsg: Locator;

  // Emergency Contacts
  readonly addContactBtn: Locator;
  readonly contactNameInput: Locator;
  readonly contactRelationshipInput: Locator;
  readonly contactHomePhoneInput: Locator;

  // Edit / Delete Actions
  readonly editBtn: Locator;
  readonly deleteBtn: Locator;
  readonly yesDeleteBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    // Sidebar
    this.pimMenuItem = page.locator('a:has-text("PIM")');

    // Add Employee
    this.addEmployeeBtn = page.locator('button:has-text("Add")');
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.middleNameInput = page.locator('input[name="middleName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.employeeIdInput = page.locator('.oxd-input-group:has-text("Employee Id") input');
    this.saveBtn = page.locator('button[type="submit"]');
    this.requiredValidationError = page.locator('.oxd-input-field-error-message');

    // Search
    this.employeeListTab = page.locator('a:has-text("Employee List")');
    this.searchNameInput = page.locator('.oxd-autocomplete-text-input input');
    this.searchIdInput = page.locator('.oxd-input-group:has-text("Employee Id") input');
    this.searchBtn = page.locator('button[type="submit"]');
    this.tableRows = page.locator('.oxd-table-card');
    this.tableNoRecords = page.locator('.oxd-toast-content, .orangehrm-horizontal-padding >> text="No Records Found"');

    // Details / Edit
    this.personalDetailsHeader = page.locator('h6:has-text("Personal Details")');
    this.jobDetailsTab = page.locator('a:has-text("Job")');
    this.jobTitleDropdown = page.locator('.oxd-input-group:has-text("Job Title") .oxd-select-text');
    this.emergencyContactsTab = page.locator('a:has-text("Emergency Contacts")');

    // Photo
    this.profilePhotoInput = page.locator('input[type="file"]');
    this.profilePhotoContainer = page.locator('.employee-image, img.oxd-useravatar');
    this.photoUploadErrorMsg = page.locator('.oxd-input-field-error-message');

    // Emergency Contacts fields
    this.addContactBtn = page.locator('button:has-text("Add")').first();
    this.contactNameInput = page.locator('.oxd-input-group:has-text("Name") input');
    this.contactRelationshipInput = page.locator('.oxd-input-group:has-text("Relationship") input');
    this.contactHomePhoneInput = page.locator('.oxd-input-group:has-text("Home Telephone") input');

    // Edit/Delete buttons in the list table
    this.editBtn = page.locator('.oxd-table-cell-actions button .bi-pencil-fill');
    this.deleteBtn = page.locator('.oxd-table-cell-actions button .bi-trash');
    this.yesDeleteBtn = page.locator('button:has-text("Yes, Delete")');
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
      await this.employeeIdInput.click();
      await this.page.keyboard.press('Control+A');
      await this.page.keyboard.press('Backspace');
      await this.employeeIdInput.fill(empId);
    }
    await this.saveBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async searchEmployeeByName(name: string) {
    await this.employeeListTab.click();
    await this.searchNameInput.fill(name);
    // Wait for dropdown auto-suggest if any
    await this.page.waitForTimeout(1000);
    await this.searchBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async searchEmployeeById(empId: string) {
    await this.employeeListTab.click();
    await this.searchIdInput.fill(empId);
    await this.searchBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async deleteEmployee(empId: string) {
    await this.searchEmployeeById(empId);
    await this.deleteBtn.first().click();
    await this.yesDeleteBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async uploadPhoto(filePath: string) {
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.profilePhotoContainer.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
    await this.saveBtn.click();
  }

  async addEmergencyContact(name: string, relationship: string, phone: string) {
    await this.emergencyContactsTab.click();
    await this.addContactBtn.click();
    await this.contactNameInput.fill(name);
    await this.contactRelationshipInput.fill(relationship);
    await this.contactHomePhoneInput.fill(phone);
    await this.saveBtn.click();
  }
}
