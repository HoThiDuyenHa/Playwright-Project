import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { PIMPage } from '../pages/pim-page';
import * as path from 'path';

test.describe('PIM Module', () => {
  let loginPage: LoginPage;
  let pimPage: PIMPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    pimPage = new PIMPage(page);

    // Login as Admin
    await loginPage.navigate();
    await loginPage.login('Admin', 'admin123');
    await expect(page).toHaveURL(/.*dashboard/);

    // Navigate to PIM
    await pimPage.navigateToPIM();
  });

  test('TC-PIM-01 Add a new employee with all required fields @smoke', async ({ page }) => {
    const empId = `EMP${Date.now().toString().slice(-4)}`;
    await test.step('Step 1: Create a new employee', async () => {
      await pimPage.addEmployee('John', 'Doe', 'M', empId);
    });

    await test.step('Step 2: Verify employee details page loads', async () => {
      await expect(pimPage.personalDetailsHeader).toBeVisible();
    });

    await test.step('Step 3: Verify employee appears in the employee list', async () => {
      await pimPage.searchEmployeeById(empId);
      await expect(pimPage.tableRows.first()).toContainText('John');
      await expect(pimPage.tableRows.first()).toContainText('Doe');
    });
  });

  test('TC-PIM-02 Add employee without first name @regression', async () => {
    await test.step('Step 1: Attempt to add employee without first name', async () => {
      await pimPage.addEmployeeBtn.click();
      await pimPage.lastNameInput.fill('Doe');
      await pimPage.saveBtn.click();
    });

    await test.step('Step 2: Verify required validation prevents saving', async () => {
      await expect(pimPage.requiredValidationError).toBeVisible();
      await expect(pimPage.requiredValidationError).toHaveText('Required');
    });
  });

  test('TC-PIM-03 Search employee by exact name @regression', async () => {
    await test.step('Step 1: Search employee by exact name John Doe', async () => {
      await pimPage.searchEmployeeByName('John Doe');
    });

    await test.step('Step 2: Verify matching employee is shown', async () => {
      await expect(pimPage.tableRows.first()).toContainText('John');
    });
  });
});
