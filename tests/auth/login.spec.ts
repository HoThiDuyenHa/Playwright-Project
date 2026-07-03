import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';

test.describe('Login Module', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('TC-AUTH-01 Login with valid credentials @smoke', async ({ page }) => {
    await test.step('Step 1: Verify Login page is displayed', async () => {
      await expect(page).toHaveURL(/.*login/);
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.usernameInput).toBeEnabled();
      await expect(loginPage.usernameInput).toHaveAttribute('placeholder', 'Username');
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeEnabled();
      await expect(loginPage.passwordInput).toHaveAttribute('placeholder', 'Password');
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
      await expect(loginPage.loginButton).toBeVisible();
      await expect(loginPage.loginButton).toBeEnabled();
    });

    await test.step('Step 2: Enter valid Username and Password', async () => {
      await loginPage.usernameInput.fill('Admin');
      await expect(loginPage.usernameInput).toHaveValue('Admin');
      await loginPage.passwordInput.fill('admin123');
    });

    await test.step('Step 3: Click Login button', async () => {
      await loginPage.loginButton.click();
    });

    await test.step('Step 4: Verify user is redirected to Dashboard', async () => {
      await expect(page).toHaveURL(/.*dashboard/);
      await expect(loginPage.userDropdown).toBeVisible();
    });

  });

  test('TC-AUTH-02 Login with invalid password @regression', async ({ page }) => {
    await test.step('Step 1: Verify Login page is displayed', async () => {
      await expect(page).toHaveURL(/.*login/);
    });

    await test.step('Step 2: Enter valid Username and invalid Password', async () => {
      await loginPage.usernameInput.fill('Admin');
      await expect(loginPage.usernameInput).toHaveValue('Admin');
      await loginPage.passwordInput.fill('wrongpassword');
    });

    await test.step('Step 3: Click Login button', async () => {
      await loginPage.loginButton.click();
    });

    await test.step('Step 4: Verify login is unsuccessful', async () => {
      await expect(page).toHaveURL(/.*login/);
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toHaveText('Invalid credentials');
      await expect(loginPage.loginButton).toBeVisible();
    });

  });

  test('TC-AUTH-03 Login with blank username and password @regression', async ({ page }) => {

    await test.step('Step 1: Verify Login page is displayed', async () => {
      await expect(page).toHaveURL(/.*login/);
    });

    await test.step('Step 2: Leave Username and Password blank', async () => {
      await expect(loginPage.usernameInput).toHaveValue('');
      await expect(loginPage.passwordInput).toHaveValue('');
    });

    await test.step('Step 3: Click Login button', async () => {
      await loginPage.loginButton.click();
    });

    await test.step('Step 4: Verify validation messages are displayed', async () => {
      await expect(loginPage.requiredError).toHaveCount(2);
      await expect(loginPage.requiredError.nth(0)).toHaveText('Required');
      await expect(loginPage.requiredError.nth(1)).toHaveText('Required');
      await expect(page).toHaveURL(/.*login/);
    });

  });

  test('TC-AUTH-04 Login with username only (password blank) @regression', async ({ page }) => {
    await test.step('Step 1: Verify Login page is displayed', async () => {
      await expect(page).toHaveURL(/.*login/);
    });

    await test.step('Step 2: Enter Username only', async () => {
      await loginPage.usernameInput.fill('Admin');
      await expect(loginPage.usernameInput).toHaveValue('Admin');
      await expect(loginPage.passwordInput).toHaveValue('');
    });

    await test.step('Step 3: Click Login button', async () => {
      await loginPage.loginButton.click();
    });

    await test.step('Step 4: Verify Password field displays Required validation', async () => {
      await expect(loginPage.requiredError).toHaveCount(1);
      await expect(loginPage.requiredError.first()).toHaveText('Required');
      await expect(page).toHaveURL(/.*login/);
    });

  });

});