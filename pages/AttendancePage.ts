import { Locator, Page } from '@playwright/test';

export class AttendancePage {
  readonly page: Page;
  readonly menuTime: Locator;
  readonly navAttendanceTab: Locator;
  readonly navPunchInOutOption: Locator;
  readonly pageTitle: Locator;
  readonly noteTextarea: Locator;
  readonly inButton: Locator;
  readonly outButton: Locator;
  readonly toastMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuTime = page.getByRole('link', { name: 'Time' });
    this.navAttendanceTab = page.locator('.oxd-topbar-body-nav-tab', { hasText: 'Attendance' });
    this.navPunchInOutOption = page.locator('.oxd-dropdown-menu >> text="Punch In/Out"');
    this.pageTitle = page.locator('.orangehrm-main-title');
    this.noteTextarea = page.locator('textarea');
    this.inButton = page.getByRole('button', { name: 'In' });
    this.outButton = page.getByRole('button', { name: 'Out' });
    this.toastMessage = page.locator('.oxd-toast-content').first();
  }

  async navigateToPunchInOut() {
    await this.menuTime.waitFor({ state: 'visible' });
    await this.menuTime.click();
    await this.navAttendanceTab.waitFor({ state: 'visible' });
    await this.navAttendanceTab.click();
    await this.navPunchInOutOption.waitFor({ state: 'visible' });
    await this.navPunchInOutOption.click();
    await this.page.waitForLoadState('networkidle');
  }

  async isPunchedIn(): Promise<boolean> {
    await this.page.waitForLoadState('networkidle');
    const title = await this.pageTitle.innerText();
    return title.trim() === 'Punch Out';
  }

  async punchIn(note: string) {
    await this.noteTextarea.fill(note);
    await this.inButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async punchOut(note: string) {
    await this.noteTextarea.fill(note);
    await this.outButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async ensurePunchedOut() {
    await this.navigateToPunchInOut();
    if (await this.isPunchedIn()) {
      await this.punchOut('System auto punch out');
      await this.toastMessage.waitFor({ state: 'visible', timeout: 15000 });
      await this.page.waitForTimeout(2000);
    }
  }

  async ensurePunchedIn() {
    await this.navigateToPunchInOut();
    if (!(await this.isPunchedIn())) {
      await this.punchIn('System auto punch in');
      await this.toastMessage.waitFor({ state: 'visible', timeout: 15000 });
      await this.page.waitForTimeout(2000);
    }
  }
}
