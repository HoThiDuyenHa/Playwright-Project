import { test, expect } from '../fixtures/test-fixtures';

test.describe('Authentication Module', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('TC-AUTH-01 Login with valid credentials @smoke', async ({ page, loginPage }) => {
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

  test('TC-AUTH-02 Login with invalid password @regression', async ({ page, loginPage }) => {
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

  test('TC-AUTH-03 Login with blank username and password @regression', async ({ page, loginPage }) => {
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

  test('TC-AUTH-04 Login with username only (password blank) @regression', async ({ page, loginPage }) => {
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

  test('TC-AUTH-05 Logout from the application @sanity', async ({ page, loginPage }) => {
    await test.step('Step 1: Verify Login page is displayed', async () => {
      await expect(page).toHaveURL(/.*login/);
    });

    await test.step('Step 2: Login with valid credentials', async () => {
      await loginPage.usernameInput.fill('Admin');
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

  test('TC-AUTH-06 Forgot password with registered email @regression', async ({ page, loginPage }) => {
    await test.step('Step 1: Navigate to Forgot Password page', async () => {
      await expect(page).toHaveURL(/.*login/);
      await expect(loginPage.forgotPasswordLink).toBeVisible();
      await loginPage.forgotPasswordLink.click();
      await expect(page).toHaveURL(/.*requestPasswordResetCode/);
    });

    await test.step('Step 2: Verify Forgot Password page elements', async () => {
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
      await loginPage.resetPasswordButton.click({ noWaitAfter: true });
    });

    await test.step('Step 5: Verify password reset request is successful', async () => {
      await page.waitForURL(/.*sendPasswordReset/, { timeout: 60000 });
      await expect(page).toHaveURL(/.*sendPasswordReset/);
      await expect(page.getByText('Reset Password link sent successfully')).toBeVisible();
    });
  });

  test('TC-AUTH-07 Forgot password with unregistered email @regression', async ({ page, loginPage }) => {
    await test.step('Step 1: Navigate to Forgot Password page', async () => {
      await expect(loginPage.forgotPasswordLink).toBeVisible();
      await loginPage.forgotPasswordLink.click();
      await expect(page).toHaveURL(/.*requestPasswordResetCode/);
    });

    await test.step('Step 2: Verify Forgot Password page elements', async () => {
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.usernameInput).toBeEnabled();
      await expect(loginPage.resetPasswordButton).toBeVisible();
    });

    await test.step('Step 3: Enter unregistered username', async () => {
      await loginPage.usernameInput.fill('duyenha');
      await expect(loginPage.usernameInput).toHaveValue('duyenha');
    });

    await test.step('Step 4: Click Reset Password button', async () => {
      await loginPage.resetPasswordButton.click({ noWaitAfter: true });
    });

    await test.step('Step 5: Verify reset request is processed successfully (prevent user enumeration)', async () => {
      await page.waitForURL(/.*sendPasswordReset/, { timeout: 30000 });
      await expect(page).toHaveURL(/.*sendPasswordReset/);
      await expect(page.getByText('Reset Password link sent successfully')).toBeVisible();
    });
  });
});
