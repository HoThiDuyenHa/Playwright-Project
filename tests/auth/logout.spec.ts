import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';

test.describe('Logout Module', () => {

  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('TC-AUTH-05 Logout from the application @sanity', async ({ page }) => {
    await test.step('Step 1: Verify Login page is displayed', async () => {
      await expect(page).toHaveURL(/.*login/);
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();

    });

    await test.step('Step 2: Login with valid credentials', async () => {
      await loginPage.usernameInput.fill('Admin');
      await expect(loginPage.usernameInput).toHaveValue('Admin');
      await loginPage.passwordInput.fill('admin123');
      await loginPage.loginButton.click();
      await expect(page).toHaveURL(/.*dashboard/);
      await expect(loginPage.userDropdown).toBeVisible();

    });

    await test.step('Step 3: Open User menu', async () => {
      await loginPage.userDropdown.click();
      await expect(loginPage.logoutLink).toBeVisible();

    });

    await test.step('Step 4: Click Logout', async () => {
      await loginPage.logoutLink.click();

    });

    await test.step('Step 5: Verify user is redirected to Login page', async () => {
      await expect(page).toHaveURL(/.*login/);
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
      await expect(loginPage.loginButton).toBeEnabled();

    });

  });

});