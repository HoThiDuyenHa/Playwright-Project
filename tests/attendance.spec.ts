import { test } from '@playwright/test';
import { AttendancePage } from '../pages/AttendancePage';
import { LoginPage } from '../pages/LoginPage';

test.describe('Attendance Module', () => {
  let loginPage: LoginPage;
  let attendance: AttendancePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    attendance = new AttendancePage(page);

    await loginPage.navigate();
    await loginPage.login('Admin', 'admin123');
    await loginPage.verifyDashboardPageDisplayed();
  });

  test('TC-ATT-01 Punch in without prior punch out @smoke', async () => {
    await test.step('Setup: Ensure punched out state', async () => {
      await attendance.ensurePunchedOut();
    });

    await test.step('Step 1: Navigate to Punch In/Out page', async () => {
      await attendance.navigateToPunchInOut();
    });

    await test.step('Step 2: Punch in with a note', async () => {
      await attendance.punchIn('TC-ATT-01 Test Punch In');
    });

    await test.step('Step 3: Verify success message is displayed', async () => {
      await attendance.verifyToastMessageVisible();
      await attendance.verifyToastMessageContains(/Successfully/i);
    });

    await test.step('Step 4: Verify title is Punch Out and Out button is visible', async () => {
      await attendance.verifyPageTitle('Punch Out');
      await attendance.verifyOutButtonVisible();
    });
  });

  test('TC-ATT-02 Punch out after punching in @smoke', async () => {
    await test.step('Setup: Ensure punched in state', async () => {
      await attendance.ensurePunchedIn();
    });

    await test.step('Step 1: Navigate to Punch In/Out page', async () => {
      await attendance.navigateToPunchInOut();
    });

    await test.step('Step 2: Punch out with a note', async () => {
      await attendance.punchOut('TC-ATT-02 Test Punch Out');
    });

    await test.step('Step 3: Verify success message is displayed', async () => {
      await attendance.verifyToastMessageVisible();
      await attendance.verifyToastMessageContains(/Successfully/i);
    });

    await test.step('Step 4: Verify title returns to Punch In and In button is visible', async () => {
      await attendance.verifyPageTitle('Punch In');
      await attendance.verifyInButtonVisible();
    });

    await test.step('Step 5: Verify attendance record displays calculated duration', async () => {
      await attendance.navigateToMyAttendanceRecord();
      await attendance.verifyCalculatedDurationNotEmpty();
    });
  });

  test('TC-ATT-03 Punch in when already punched in @regression', async () => {
    await test.step('Setup: Ensure punched in state', async () => {
      await attendance.ensurePunchedIn();
    });

    await test.step('Step 1: Navigate to Punch In page while punched in', async () => {
      await attendance.navigateToPunchInOut();
    });

    await test.step('Step 2: Verify duplicate punch in is blocked (Punch Out interface shown)', async () => {
      await attendance.verifyPageTitle('Punch Out');
      await attendance.verifyOutButtonVisible();
      await attendance.verifyInButtonNotVisible();
    });
  });
});
