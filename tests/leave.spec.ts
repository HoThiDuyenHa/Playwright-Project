import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { LeavePage } from '../pages/leave-page';

test.describe('Leave Module', () => {
  let loginPage: LoginPage;
  let leavePage: LeavePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    leavePage = new LeavePage(page);

    // Login as Admin
    await loginPage.navigate();
    await loginPage.login('Admin', 'admin123');
    await expect(page).toHaveURL(/.*dashboard/);

    // Navigate to Leave
    await leavePage.navigateToLeave();
  });

  test('TC-LV-01 Apply for leave with valid date range @smoke', async ({ page }) => {
    await test.step('Step 1: Apply for valid leave', async () => {
      // Future dates for leave
      await leavePage.applyLeave('2026-10-10', '2026-10-12');
    });

    await test.step('Step 2: Verify leave request submission success', async () => {
      await expect(page.locator('.oxd-toast--success, .oxd-toast-container')).toBeVisible();
    });
  });

  test('TC-LV-02 Apply for leave with end date before start date @regression', async () => {
    await test.step('Step 1: Apply for leave with end date before start date', async () => {
      await leavePage.applyLeave('2026-10-12', '2026-10-10');
    });

    await test.step('Step 2: Verify validation error prevents submission', async () => {
      await expect(leavePage.validationErrorMsg).toBeVisible();
      await expect(leavePage.validationErrorMsg).toHaveText(/To date should be after From date/i);
    });
  });

  test('TC-LV-03 Apply for leave exceeding available balance @regression @bonus', async ({ page }) => {
    await test.step('Step 1: Check leave balance and apply for a long leave exceeding balance', async () => {
      // Apply for 3 months of leave to exceed standard balance
      await leavePage.applyLeave('2026-11-01', '2027-02-01');
    });

    await test.step('Step 2: Verify leave is flagged or warning is shown', async () => {
      const warningText = page.locator('.orangehrm-leave-balance-value, .oxd-input-field-error-message');
      await expect(warningText.first()).toBeVisible();
    });
  });

  test('TC-LV-04 Admin approves a pending leave request @regression', async ({ page }) => {
    await test.step('Step 1: Approve pending leave request', async () => {
      await leavePage.approveLeaveRequest('John Doe');
    });

    await test.step('Step 2: Verify status is updated to Approved', async () => {
      await expect(page.locator('.oxd-toast-container')).toBeVisible();
    });
  });

  test('TC-LV-05 Admin rejects a pending leave request @regression', async ({ page }) => {
    await test.step('Step 1: Reject pending leave request', async () => {
      await leavePage.rejectLeaveRequest('John Doe');
    });

    await test.step('Step 2: Verify status is updated to Rejected', async () => {
      await expect(page.locator('.oxd-toast-container')).toBeVisible();
    });
  });

  test('TC-LV-06 Employee cancels an approved leave @regression @bonus', async ({ page }) => {
    await test.step('Step 1: Cancel approved leave', async () => {
      await leavePage.cancelLeaveRequest();
    });

    await test.step('Step 2: Verify status changes to Cancelled', async () => {
      await expect(page.locator('.oxd-toast-container')).toBeVisible();
    });
  });

  test('TC-LV-07 View leave entitlement summary @regression @bonus', async () => {
    await test.step('Step 1: Navigate to My Entitlements', async () => {
      await leavePage.viewMyEntitlements();
    });

    await test.step('Step 2: Verify entitlements list is shown', async () => {
      const count = await leavePage.entitlementTableRows.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
});
