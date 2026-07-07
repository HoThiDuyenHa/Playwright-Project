import { test, expect } from '@playwright/test';
import { AdminPage } from '../pages/AdminPage';
import { PIMPage } from '../pages/pim-page';
import { LoginPage } from '../pages/login-page';

test.describe('Admin Module', () => {
  let loginPage: LoginPage;
  let adminPage: AdminPage;
  let pimPage: PIMPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    adminPage = new AdminPage(page);
    pimPage = new PIMPage(page);

    await loginPage.navigate();
    await loginPage.login('Admin', 'admin123');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('TC-ADM-01 Create a new user with ESS role @smoke', async ({ page }) => {
    const uniqueId = Date.now().toString().slice(-4);
    const empFirstName = `EmpESS_${uniqueId}`;
    const empLastName = `Test`;
    const empId = `1${uniqueId}`;
    const username = `essuser_${uniqueId}`;
    const password = `Password123!`;

    await test.step('Step 1: Create a fresh PIM employee', async () => {
      await pimPage.navigateToPIM();
      await pimPage.addEmployee(empFirstName, empLastName, '', empId);
      await expect(page).toHaveURL(/.*viewPersonalDetails/);
    });

    await test.step('Step 2: Create a system user with ESS role linked to the employee', async () => {
      await adminPage.createUser('ESS', empFirstName, 'Enabled', username, password);
      await expect(page).toHaveURL(/.*viewSystemUsers/);
    });

    await test.step('Step 3: Log out of Admin account', async () => {
      await loginPage.logout();
    });

    await test.step('Step 4: Log in as the newly created ESS user', async () => {
      await loginPage.login(username, password);
      await expect(page).toHaveURL(/.*dashboard/);
    });
  });

  test('TC-ADM-02 Create user with duplicate username @regression', async ({ page }) => {
    await test.step('Step 1: Navigate to Add User page', async () => {
      await adminPage.navigateToSystemUsers();
      await adminPage.addBtn.click();
      await page.waitForLoadState('networkidle');
    });

    await test.step('Step 2: Enter duplicate username and verify error', async () => {
      await adminPage.usernameInput.fill('Admin');
      await page.waitForTimeout(3000);
      await expect(adminPage.usernameErrorMsg).toBeVisible();
      await expect(adminPage.usernameErrorMsg).toHaveText('Already exists');
    });
  });

  test('TC-ADM-03 Disable an active user account @regression', async ({ page }) => {
    const uniqueId = Date.now().toString().slice(-4);
    const empFirstName = `EmpDis_${uniqueId}`;
    const empLastName = `Test`;
    const empId = `2${uniqueId}`;
    const username = `disuser_${uniqueId}`;
    const password = `Password123!`;

    await test.step('Setup: Create a PIM employee and enabled ESS user', async () => {
      await pimPage.navigateToPIM();
      await pimPage.addEmployee(empFirstName, empLastName, '', empId);
      await expect(page).toHaveURL(/.*viewPersonalDetails/);

      await adminPage.createUser('ESS', empFirstName, 'Enabled', username, password);
      await expect(page).toHaveURL(/.*viewSystemUsers/);
    });

    await test.step('Step 1: Search for the user, edit, and set to Disabled', async () => {
      await page.locator('.oxd-input-group:has-text("Username") input').fill(username);
      await page.locator('button[type="submit"]').click();
      await page.waitForLoadState('networkidle');

      const editBtn = page.locator('.oxd-table-card').first().locator('.bi-pencil-fill');
      await editBtn.waitFor({ state: 'visible', timeout: 15000 });
      await editBtn.click();
      await page.waitForURL(/.*saveSystemUser/);
      await page.locator('.oxd-form-loader').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});

      await adminPage.statusDropdown.click();
      await adminPage.selectOptions.filter({ hasText: 'Disabled' }).first().click();

      await adminPage.saveBtn.click();
      await expect(page).toHaveURL(/.*viewSystemUsers/);
    });

    await test.step('Step 2: Log out of Admin account', async () => {
      await loginPage.logout();
    });

    await test.step('Step 3: Attempt to log in with the disabled user', async () => {
      await loginPage.login(username, password);
      await page.waitForTimeout(3000);
      await expect(loginPage.errorMessage).toBeVisible();
    });
  });
});
