import { test, expect } from '@playwright/test';
import { RecruitmentPage } from '../pages/RecruitmentPage';
import { LoginPage } from '../pages/login-page';
import { getFutureDate } from '../utils/DateUtils';

test.describe('Recruitment Module', () => {
  let loginPage: LoginPage;
  let recruitment: RecruitmentPage;
  let validEmployeeName = '';

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    recruitment = new RecruitmentPage(page);

    await loginPage.navigate();
    await loginPage.login('Admin', 'admin123');
    await expect(page).toHaveURL(/.*dashboard/);

    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewEmployeeList');
    await page.waitForLoadState('networkidle');
    await page.locator('.oxd-table-card').first().waitFor({ state: 'visible', timeout: 30000 });
    
    const firstName = await page.locator('.oxd-table-card').first().locator('.oxd-table-cell').nth(2).innerText();
    const lastName = await page.locator('.oxd-table-card').first().locator('.oxd-table-cell').nth(3).innerText();
    validEmployeeName = `${firstName} ${lastName}`.trim();
  });

  test('TC-RC-01 Create a new job vacancy @smoke', async ({ page }) => {
    const uniqueId = Date.now().toString().slice(-4);
    const vacancyName = `Vacancy_${uniqueId}`;

    await test.step('Step 1: Create a job vacancy', async () => {
      await recruitment.createVacancy(vacancyName, 'Software Engineer', validEmployeeName);
    });

    await test.step('Step 2: Verify vacancy is created successfully (redirected to edit vacancy)', async () => {
      await expect(page).toHaveURL(/.*addJobVacancy\/\d+/);
    });

    await test.step('Step 3: Verify vacancy is visible in the list', async () => {
      await recruitment.navigateToVacancies();
      await expect(page.locator('.oxd-table-card').filter({ hasText: vacancyName }).first()).toBeVisible();
    });
  });

  test('TC-RC-02 Add a candidate to a vacancy @regression', async ({ page }) => {
    const uniqueId = Date.now().toString().slice(-4);
    const vacancyName = `Vac_${uniqueId}`;
    const candidateFirstName = `Candidate_${uniqueId}`;

    await test.step('Setup: Create a vacancy to link', async () => {
      await recruitment.createVacancy(vacancyName, 'Software Engineer', validEmployeeName);
    });

    await test.step('Step 1: Add a candidate linked to the vacancy', async () => {
      await recruitment.createCandidate(candidateFirstName, 'Test', 'test@rec.com', vacancyName);
    });

    await test.step('Step 2: Verify candidate is added successfully (redirected to candidate profile)', async () => {
      await expect(page).toHaveURL(/.*addCandidate\/\d+/);
    });

    await test.step('Step 3: Verify candidate status is Application Initiated', async () => {
      await expect(page.getByText('Application Initiated')).toBeVisible();
      await expect(recruitment.shortlistBtn).toBeVisible();
    });
  });

  test('TC-RC-03 Schedule an interview for a candidate @regression', async ({ page }) => {
    const uniqueId = Date.now().toString().slice(-4);
    const vacancyName = `Vac_${uniqueId}`;
    const candidateFirstName = `Candidate_${uniqueId}`;

    await test.step('Setup: Create candidate and shortlist them', async () => {
      await recruitment.createVacancy(vacancyName, 'Software Engineer', validEmployeeName);
      await recruitment.createCandidate(candidateFirstName, 'Test', 'test@rec.com', vacancyName);
      await recruitment.shortlistCandidate();
    });

    await test.step('Step 1: Schedule an interview for the candidate', async () => {
      await recruitment.scheduleInterview('Technical Interview', validEmployeeName, getFutureDate(3));
    });

    await test.step('Step 2: Verify interview is scheduled successfully (redirected back to candidate profile)', async () => {
      await expect(page).toHaveURL(/.*addCandidate\/\d+/);
    });

    await test.step('Step 3: Verify candidate status is Interview Scheduled', async () => {
      await expect(page.getByText('Interview Scheduled')).toBeVisible();
    });
  });
});
