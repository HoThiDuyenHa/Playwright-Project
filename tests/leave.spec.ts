import { test, Page } from '@playwright/test';
import { LeavePage } from '../pages/LeavePage';
import { LoginPage } from '../pages/LoginPage';
import { PIMPage } from '../pages/PIMPage';
import { getFutureWeekday } from '../utils/DateUtils';

async function createEmployeeWithEntitlement(page: Page): Promise<{ username: string; password: string; empFirstName: string; empFullName: string }> {
  const loginPage = new LoginPage(page);
  const pimPage = new PIMPage(page);
  const leavePage = new LeavePage(page);

  const empId = `EMP${Date.now().toString().slice(-4)}`;
  const empFirstName = `TestFN${Date.now().toString().slice(-4)}`;
  const empLastName = `TestLN`;
  const empFullName = `${empFirstName} ${empLastName}`;
  const username = `user${Date.now().toString().slice(-4)}`;
  const password = `Password123!`;

  await pimPage.navigateToPIM();
  await pimPage.addEmployeeWithLogin(empFirstName, empLastName, username, password, empId);
  await pimPage.verifyPersonalDetailsHeaderVisible();

  await leavePage.navigateToLeave();
  await leavePage.navigateToAddEntitlements();
  await leavePage.addEntitlement(empFullName, 'US - Personal', '10.00');

  await loginPage.logout();

  return { username, password, empFirstName, empFullName };
}

test.describe('Leave Module Testing', () => {
    let loginPage: LoginPage;
    let leave: LeavePage;
    let testUser: any;

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();
        loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login('Admin', 'admin123');
        await loginPage.verifyDashboardPageDisplayed();
        testUser = await createEmployeeWithEntitlement(page);
        await page.close();
    });

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        leave = new LeavePage(page);
        await loginPage.navigate();
    });

    test('TC-LV-01: Apply for leave with valid date range', async () => {
        const start = getFutureWeekday(1);
        const end = getFutureWeekday(2);

        await test.step('Step 1: Login as employee', async () => {
            await loginPage.login(testUser.username, testUser.password);
            await loginPage.verifyDashboardPageDisplayed();
        });

        await test.step('Step 2: Navigate to Apply Leave page', async () => {
            await leave.navigateToLeave();
        });

        await test.step('Step 3: Select leave type, input dates, and submit', async () => {
            await leave.selectLeaveType('US - Personal');
            await leave.fillLeaveForm(start, end);
            await leave.submitRequest();
        });

        await test.step('Step 4: Verify apply leave success', async () => {
            await leave.verifyToastMessageContains(/Successfully/i);
        });

        await test.step('Step 5: Verify status is Pending Approval in My Leave List', async () => {
            await leave.navigateToMyLeave();
            await leave.verifyPendingApprovalVisible();
        });
    });

    test('TC-LV-02: Apply for leave with end date before start date', async () => {
        const start = getFutureWeekday(2);
        const end = getFutureWeekday(1);

        await test.step('Step 1: Login as employee', async () => {
            await loginPage.login(testUser.username, testUser.password);
            await loginPage.verifyDashboardPageDisplayed();
        });

        await test.step('Step 2: Navigate to Apply Leave page', async () => {
            await leave.navigateToLeave();
        });

        await test.step('Step 3: Input end date before start date and submit', async () => {
            await leave.selectLeaveType('US - Personal');
            await leave.fillLeaveForm(start, end);
            await leave.submitRequest();
        });

        await test.step('Step 4: Verify error message displayed', async () => {
            await leave.verifyErrorMessageVisible();
        });
    });

    test('TC-LV-04: Admin approves a pending leave request', async () => {
        await loginPage.login(testUser.username, testUser.password);
        await loginPage.verifyDashboardPageDisplayed();
        await leave.navigateToLeave();
        await leave.selectLeaveType('US - Personal');
        await leave.fillLeaveForm(getFutureWeekday(5), getFutureWeekday(6));
        await leave.submitRequest();
        await leave.verifyToastMessageContains(/Successfully/i);
        await loginPage.logout();

        await test.step('Step 1: Login as Admin', async () => {
            await loginPage.login('Admin', 'admin123');
            await loginPage.verifyDashboardPageDisplayed();
        });

        await test.step('Step 2: Navigate to Leave List', async () => {
            await leave.navigateToLeave();
            await leave.navigateToLeaveList();
        });

        await test.step('Step 3: Filter by Employee and status Pending Approval', async () => {
            await leave.filterByEmployee(testUser.empFullName);
            await leave.selectLeaveStatus('Pending Approval');
            await leave.searchLeave();
        });

        await test.step('Step 4: Approve the request', async () => {
            await leave.approveFirstRequest();
        });

        await test.step('Step 5: Verify success toast', async () => {
            await leave.verifyToastMessageContains(/Successfully/i);
        });
    });

    test('TC-LV-05: Admin rejects a pending leave request', async () => {
        await loginPage.login(testUser.username, testUser.password);
        await loginPage.verifyDashboardPageDisplayed();
        await leave.navigateToLeave();
        await leave.selectLeaveType('US - Personal');
        await leave.fillLeaveForm(getFutureWeekday(3), getFutureWeekday(4));
        await leave.submitRequest();
        await leave.verifyToastMessageContains(/Successfully/i);
        await loginPage.logout();

        await test.step('Step 1: Login as Admin', async () => {
            await loginPage.login('Admin', 'admin123');
            await loginPage.verifyDashboardPageDisplayed();
        });

        await test.step('Step 2: Navigate to Leave List', async () => {
            await leave.navigateToLeave();
            await leave.navigateToLeaveList();
        });

        await test.step('Step 3: Filter by Employee and status Pending Approval', async () => {
            await leave.filterByEmployee(testUser.empFullName);
            await leave.selectLeaveStatus('Pending Approval');
            await leave.searchLeave();
        });

        await test.step('Step 4: Reject the request', async () => {
            await leave.rejectFirstRequest();
        });

        await test.step('Step 5: Verify success toast', async () => {
            await leave.verifyToastMessageContains(/Successfully/i);
        });
    });
});