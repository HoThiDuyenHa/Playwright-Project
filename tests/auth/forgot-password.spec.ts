import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';

test.describe('Forgot Password Module', () => {

  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('TC-AUTH-06 Forgot password with registered email @regression', async ({ page }) => {
    await test.step('Step 1: Navigate to Forgot Password page', async () => {
      await expect(page).toHaveURL(/.*login/);
      await expect(loginPage.forgotPasswordLink).toBeVisible();
      await loginPage.forgotPasswordLink.click();
      await expect(page).toHaveURL(/.*requestPasswordResetCode/);

    });

    await test.step('Step 2: Verify Forgot Password page', async () => {
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.usernameInput).toBeEnabled();
      await expect(loginPage.usernameInput).toHaveAttribute('placeholder', 'Username');
      await expect(loginPage.resetPasswordButton).toBeVisible();
      await expect(loginPage.resetPasswordButton).toBeEnabled();
      await expect(loginPage.cancelButton).toBeVisible();

    });

    await test.step('Step 3: Enter registered username', async () => {
      await loginPage.usernameInput.fill('Admin');
      await expect(loginPage.usernameInput).toHaveValue('Admin');

    });

    await test.step('Step 4: Click Reset Password button', async () => {
      await loginPage.resetPasswordButton.click();

    });

    await test.step('Step 5: Verify password reset request is successful', async () => {
      await expect(page).toHaveURL(/.*sendPasswordReset/);
      await expect(page.getByText('Reset Password link sent successfully')).toBeVisible();
    });

  });

  test('TC-AUTH-07 Forgot password with unregistered email @regression', async ({ page }) => {
    await test.step('Step 1: Navigate to Forgot Password page', async () => {
      await expect(loginPage.forgotPasswordLink).toBeVisible();
      await loginPage.forgotPasswordLink.click();
      await expect(page).toHaveURL(/.*requestPasswordResetCode/);
    });

    await test.step('Step 2: Verify Forgot Password page', async () => {
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.usernameInput).toBeEnabled();
      await expect(loginPage.resetPasswordButton).toBeVisible();

    });

    await test.step('Step 3: Enter unregistered username', async () => {
      await loginPage.usernameInput.fill('duyenha');
      await expect(loginPage.usernameInput).toHaveValue('duyenha');

    });

    await test.step('Step 4: Click Reset Password button', async () => {
      await loginPage.resetPasswordButton.click();

    });

    await test.step('Step 5: Verify error message is displayed', async () => {
      await expect(page.getByText(/email not found|not found|invalid/i)).toBeVisible();
    });
  });
});