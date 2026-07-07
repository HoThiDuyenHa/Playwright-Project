import { test, expect, Page } from '@playwright/test';
import { LeavePage } from '../pages/LeavePage';
import { LoginPage } from '../pages/login-page';
import { PIMPage } from '../pages/pim-page';
import { getFutureDate } from '../utils/DateUtils';

async function createEmployeeWithEntitlement(page: Page): Promise<{ username: string; password: string; empFirstName: string; empFullName: string }> {
  const loginPage = new LoginPage(page);
  const pimPage = new PIMPage(page);
  const leavePage = new LeavePage(page);

  const uniqueId = Date.now().toString().slice(-4);
  const empId = `1${uniqueId}`;
  const username = `emp_${uniqueId}`;
  const password = 'Password123!';
  const empFirstName = `Test${uniqueId}`;
  const empLastName = `Employee${uniqueId}`;
  const empFullName = `${empFirstName} ${empLastName}`;

  await pimPage.navigateToPIM();
  await pimPage.addEmployeeWithLogin(empFirstName, empLastName, username, password, empId);
  await page.locator('h6:has-text("Personal Details")').waitFor({ state: 'visible', timeout: 30000 });

  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/leave/addLeaveEntitlement');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  await leavePage.addEntitlement(empFullName, 'CAN - Bereavement', '10');

  await loginPage.logout();

  return { username, password, empFirstName, empFullName };
}

async function ensurePendingLeaveRequest(page: Page): Promise<string> {
  const loginPage = new LoginPage(page);
  const leavePage = new LeavePage(page);

  const { username, password, empFirstName } = await createEmployeeWithEntitlement(page);

  await loginPage.login(username, password);
  await page.waitForTimeout(2000);

  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/leave/applyLeave');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  await leavePage.selectLeaveType('CAN - Bereavement');
  await leavePage.fillLeaveForm('2026-15-11', '2026-16-11');
  await leavePage.submitRequest();
  await leavePage.toastMessage.waitFor({ state: 'visible', timeout: 30000 });

  await loginPage.logout();

  await loginPage.login('Admin', 'admin123');
  await expect(page).toHaveURL(/.*dashboard/);

  return empFirstName;
}

test.describe('Leave Module Testing', () => {
    let leave: LeavePage;
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        leave = new LeavePage(page);
        loginPage = new LoginPage(page);
        await page.goto('https://opensource-demo.orangehrmlive.com/');
        await page.getByPlaceholder('Username').fill('Admin');
        await page.getByPlaceholder('Password').fill('admin123');
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page).toHaveURL(/.*dashboard/);
    });

    test('TC-LV-01: Apply for leave with valid date range', async ({ page }) => {
        let credentials = { username: '', password: '' };
        await test.step('Setup: Create employee and assign entitlements', async () => {
            const result = await createEmployeeWithEntitlement(page);
            credentials = { username: result.username, password: result.password };
            await loginPage.login(credentials.username, credentials.password);
            await expect(page).toHaveURL(/.*dashboard/);
        });
        await test.step('Step 1: Navigate to Leave page', async () => {
            await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/leave/applyLeave');
        });
        await test.step('Step 2: Select Leave Type', async () => {
            await leave.selectLeaveType('CAN - Bereavement');
        });
        await test.step('Step 3: Fill Leave Form', async () => {
            await leave.fillLeaveForm(getFutureDate(1), getFutureDate(5));
        });
        await test.step('Step 4: Submit Request', async () => {
            await leave.submitRequest();
            await expect(leave.toastMessage).toBeVisible();
        });
        await test.step('Step 5: Verify request status is Pending Approval', async () => {
            await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/leave/viewMyLeaveList');
            await expect(leave.page.getByText('Pending Approval').first()).toBeVisible();
        });
    });

    test('TC-LV-02: Apply for leave with end date before start date', async ({ page }) => {
        let credentials = { username: '', password: '' };
        await test.step('Setup: Create employee and assign entitlements', async () => {
            const result = await createEmployeeWithEntitlement(page);
            credentials = { username: result.username, password: result.password };
            await loginPage.login(credentials.username, credentials.password);
            await expect(page).toHaveURL(/.*dashboard/);
        });
        await test.step('Step 1: Navigate to Leave page', async () => {
            await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/leave/applyLeave');
        });
        await test.step('Step 2: Select Leave Type', async () => {
            await leave.selectLeaveType('CAN - Bereavement');
        });
        await test.step('Step 3: Fill Leave Form with invalid dates', async () => {
            await leave.fillLeaveForm(getFutureDate(5), getFutureDate(2));
        });
        await test.step('Step 4: Submit Request', async () => {
            await leave.submitRequest();
        });
        await test.step('Step 5: Verify error message is visible', async () => {
            await expect(leave.errorMessage).toBeVisible();
        });
    });

    test('TC-LV-04: Admin approves a pending leave request', async ({ page }) => {
        let empName = '';
        await test.step('Setup: Ensure pending leave request exists', async () => {
            empName = await ensurePendingLeaveRequest(page);
        });
        await test.step('Step 1: Navigate to Leave List', async () => {
            await page.goto('/web/index.php/leave/viewLeaveList');
            await page.waitForLoadState('networkidle');
        });
        await test.step('Step 2: Filter by Employee Name and Pending Status', async () => {
            await leave.filterByEmployee(empName);
            await leave.selectLeaveStatus('Pending Approval');
            await leave.searchLeave();
        });
        await test.step('Step 3: Approve request', async () => {
            await leave.approveFirstRequest();
        });
        await test.step('Step 4: Verify success toast message', async () => {
            await expect(leave.toastMessage).toContainText(/Successfully/i);
        });
    });

    test('TC-LV-05: Admin rejects a pending leave request', async ({ page }) => {
        let empName = '';
        await test.step('Setup: Ensure pending leave request exists', async () => {
            empName = await ensurePendingLeaveRequest(page);
        });
        await test.step('Step 1: Navigate to Leave List', async () => {
            await page.goto('/web/index.php/leave/viewLeaveList');
            await page.waitForLoadState('networkidle');
        });
        await test.step('Step 2: Filter by Employee Name and Pending Status', async () => {
            await leave.filterByEmployee(empName);
            await leave.selectLeaveStatus('Pending Approval');
            await leave.searchLeave();
        });
        await test.step('Step 3: Reject request', async () => {
            await leave.rejectFirstRequest();
        });
        await test.step('Step 4: Verify success toast message', async () => {
            await expect(leave.toastMessage).toContainText(/Successfully/i);
        });
    });
});