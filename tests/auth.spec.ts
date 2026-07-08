import { test } from '../fixtures/test-fixtures';

test.describe('Authentication Module', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('TC-AUTH-01 Login with valid credentials @smoke', async ({ loginPage }) => {
    await test.step('Step 1: Verify Login page is displayed', async () => {
      await loginPage.verifyLoginPageDisplayed();
    });

    await test.step('Step 2: Enter valid Username and Password', async () => {
      await loginPage.usernameInput.fill('Admin');
      await loginPage.verifyUsernameInputWithValue('Admin');
      await loginPage.passwordInput.fill('admin123');
    });

    await test.step('Step 3: Click Login button', async () => {
      await loginPage.loginButton.click();
    });

    await test.step('Step 4: Verify user is redirected to Dashboard', async () => {
      await loginPage.verifyDashboardPageDisplayed();
    });
  });

  test('TC-AUTH-02 Login with invalid password @regression', async ({ loginPage }) => {
    await test.step('Step 1: Verify Login page is displayed', async () => {
      await loginPage.verifyLoginPageDisplayed();
    });

    await test.step('Step 2: Enter valid Username and invalid Password', async () => {
      await loginPage.usernameInput.fill('Admin');
      await loginPage.verifyUsernameInputWithValue('Admin');
      await loginPage.passwordInput.fill('wrongpassword');
    });

    await test.step('Step 3: Click Login button', async () => {
      await loginPage.loginButton.click();
    });

    await test.step('Step 4: Verify login is unsuccessful', async () => {
      await loginPage.verifyLoginUnsuccessful();
    });
  });

  test('TC-AUTH-03 Login with blank username and password @regression', async ({ loginPage }) => {
    await test.step('Step 1: Verify Login page is displayed', async () => {
      await loginPage.verifyLoginPageDisplayed();
    });

    await test.step('Step 2: Leave Username and Password blank', async () => {
      await loginPage.verifyUsernameInputWithValue('');
      await loginPage.verifyPasswordInputWithValue('');
    });

    await test.step('Step 3: Click Login button', async () => {
      await loginPage.loginButton.click();
    });

    await test.step('Step 4: Verify validation messages are displayed', async () => {
      await loginPage.verifyBlankValidationMessages();
    });
  });

  test('TC-AUTH-04 Login with username only (password blank) @regression', async ({ loginPage }) => {
    await test.step('Step 1: Verify Login page is displayed', async () => {
      await loginPage.verifyLoginPageDisplayed();
    });

    await test.step('Step 2: Enter Username only', async () => {
      await loginPage.usernameInput.fill('Admin');
      await loginPage.verifyUsernameInputWithValue('Admin');
      await loginPage.verifyPasswordInputWithValue('');
    });

    await test.step('Step 3: Click Login button', async () => {
      await loginPage.loginButton.click();
    });

    await test.step('Step 4: Verify Password field displays Required validation', async () => {
      await loginPage.verifyPasswordRequiredValidation();
    });
  });

  test('TC-AUTH-05 Logout from the application @sanity', async ({ loginPage }) => {
    await test.step('Step 1: Verify Login page is displayed', async () => {
      await loginPage.verifyLoginPageDisplayed();
    });

    await test.step('Step 2: Login with valid credentials', async () => {
      await loginPage.usernameInput.fill('Admin');
      await loginPage.passwordInput.fill('admin123');
      await loginPage.loginButton.click();
      await loginPage.verifyDashboardPageDisplayed();
    });

    await test.step('Step 3: Open User menu', async () => {
      await loginPage.userDropdown.click();
      await loginPage.logoutLink.waitFor({ state: 'visible' });
    });

    await test.step('Step 4: Click Logout', async () => {
      await loginPage.logoutLink.click();
    });

    await test.step('Step 5: Verify user is redirected to Login page', async () => {
      await loginPage.verifyLogoutSuccess();
    });
  });

  test('TC-AUTH-06 Forgot password with registered email @regression', async ({ loginPage }) => {
    await test.step('Step 1: Navigate to Forgot Password page', async () => {
      await loginPage.verifyLoginPageDisplayed();
      await loginPage.verifyForgotPasswordLinkVisible();
      await loginPage.forgotPasswordLink.click();
      await loginPage.verifyForgotPasswordPageDisplayed();
    });

    await test.step('Step 2: Verify Forgot Password page elements', async () => {
      await loginPage.verifyForgotPasswordPageElements();
    });

    await test.step('Step 3: Enter registered username', async () => {
      await loginPage.usernameInput.fill('Admin');
      await loginPage.verifyUsernameInputWithValue('Admin');
    });

    await test.step('Step 4: Click Reset Password button', async () => {
      await loginPage.resetPasswordButton.click({ noWaitAfter: true });
    });

    await test.step('Step 5: Verify password reset request is successful', async () => {
      await loginPage.verifyPasswordResetSuccess();
    });
  });

  test('TC-AUTH-07 Forgot password with unregistered email @regression', async ({ loginPage }) => {
    await test.step('Step 1: Navigate to Forgot Password page', async () => {
      await loginPage.verifyForgotPasswordLinkVisible();
      await loginPage.forgotPasswordLink.click();
      await loginPage.verifyForgotPasswordPageDisplayed();
    });

    await test.step('Step 2: Verify Forgot Password page elements', async () => {
      await loginPage.verifyForgotPasswordPageElements();
    });

    await test.step('Step 3: Enter unregistered username', async () => {
      await loginPage.usernameInput.fill('duyenha');
      await loginPage.verifyUsernameInputWithValue('duyenha');
    });

    await test.step('Step 4: Click Reset Password button', async () => {
      await loginPage.resetPasswordButton.click({ noWaitAfter: true });
    });

    await test.step('Step 5: Verify reset request is processed successfully (prevent user enumeration)', async () => {
      await loginPage.verifyPasswordResetSuccess();
    });
  });
});
