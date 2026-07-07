import { Locator, Page } from '@playwright/test';

export class RecruitmentPage {
  readonly page: Page;
  readonly menuRecruitment: Locator;
  readonly tabVacancies: Locator;
  readonly tabCandidates: Locator;
  readonly addBtn: Locator;
  readonly saveBtn: Locator;
  readonly formLoader: Locator;

  readonly vacancyNameInput: Locator;
  readonly vacancyJobTitleDropdown: Locator;
  readonly vacancyHiringManagerInput: Locator;
  readonly selectOptions: Locator;
  readonly autocompleteOptions: Locator;

  readonly candidateFirstName: Locator;
  readonly candidateLastName: Locator;
  readonly candidateEmail: Locator;
  readonly candidateVacancyDropdown: Locator;

  readonly shortlistBtn: Locator;
  readonly scheduleBtn: Locator;
  readonly transitionSaveBtn: Locator;

  readonly interviewTitleInput: Locator;
  readonly interviewerInput: Locator;
  readonly interviewDateInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuRecruitment = page.getByRole('link', { name: 'Recruitment', exact: true });
    this.tabVacancies = page.locator('.oxd-topbar-body-nav-tab', { hasText: 'Vacancies' });
    this.tabCandidates = page.locator('.oxd-topbar-body-nav-tab', { hasText: 'Candidates' });
    this.addBtn = page.locator('button:has-text("Add")');
    this.saveBtn = page.locator('button[type="submit"]');
    this.formLoader = page.locator('.oxd-form-loader');

    this.vacancyNameInput = page.locator('.oxd-input-group:has-text("Vacancy Name") input');
    this.vacancyJobTitleDropdown = page.locator('.oxd-input-group:has-text("Job Title") .oxd-select-text');
    this.vacancyHiringManagerInput = page.locator('.oxd-input-group:has-text("Hiring Manager") input');
    this.selectOptions = page.locator('.oxd-select-dropdown .oxd-select-option');
    this.autocompleteOptions = page.locator('.oxd-autocomplete-dropdown .oxd-autocomplete-option');

    this.candidateFirstName = page.locator('input[name="firstName"]');
    this.candidateLastName = page.locator('input[name="lastName"]');
    this.candidateEmail = page.locator('.oxd-input-group:has-text("Email") input');
    this.candidateVacancyDropdown = page.locator('.oxd-input-group:has-text("Vacancy") .oxd-select-text');

    this.shortlistBtn = page.locator('button:has-text("Shortlist")');
    this.scheduleBtn = page.locator('button:has-text("Schedule Interview")');
    this.transitionSaveBtn = page.locator('.orangehrm-card-container button[type="submit"]');

    this.interviewTitleInput = page.locator('.oxd-input-group:has-text("Interview Title") input');
    this.interviewerInput = page.locator('.oxd-input-group:has-text("Interviewer") input');
    this.interviewDateInput = page.locator('.oxd-date-input input');
  }

  async navigateToVacancies() {
    await this.menuRecruitment.waitFor({ state: 'visible' });
    await this.menuRecruitment.click();
    await this.tabVacancies.waitFor({ state: 'visible' });
    await this.tabVacancies.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToCandidates() {
    await this.menuRecruitment.waitFor({ state: 'visible' });
    await this.menuRecruitment.click();
    await this.tabCandidates.waitFor({ state: 'visible' });
    await this.tabCandidates.click();
    await this.page.waitForLoadState('networkidle');
  }

  async createVacancy(name: string, jobTitle: string, managerName: string) {
    await this.navigateToVacancies();
    await this.addBtn.click();
    await this.page.waitForLoadState('networkidle');
    await this.formLoader.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});

    await this.vacancyNameInput.fill(name);
    await this.vacancyJobTitleDropdown.click();
    await this.selectOptions.filter({ hasText: jobTitle }).first().click();

    const searchKey = managerName.split(' ')[0];
    await this.vacancyHiringManagerInput.fill(searchKey);
    await this.page.waitForTimeout(3000);
    await this.autocompleteOptions.first().click();

    await this.saveBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async createCandidate(firstName: string, lastName: string, email: string, vacancyName: string) {
    await this.navigateToCandidates();
    await this.addBtn.click();
    await this.page.waitForLoadState('networkidle');
    await this.formLoader.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});

    await this.candidateFirstName.fill(firstName);
    await this.candidateLastName.fill(lastName);
    await this.candidateEmail.fill(email);

    await this.candidateVacancyDropdown.waitFor({ state: 'visible' });
    await this.candidateVacancyDropdown.click();
    await this.selectOptions.filter({ hasText: vacancyName }).first().click();

    await this.saveBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async shortlistCandidate() {
    await this.shortlistBtn.waitFor({ state: 'visible', timeout: 30000 });
    await this.shortlistBtn.click();
    
    await this.page.waitForURL(/.*changeCandidateVacancyStatus/);
    await this.page.locator('textarea').waitFor({ state: 'visible', timeout: 15000 });
    await this.formLoader.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    
    await this.transitionSaveBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async scheduleInterview(title: string, interviewerName: string, date: string) {
    await this.scheduleBtn.waitFor({ state: 'visible', timeout: 30000 });
    await this.scheduleBtn.click();

    await this.page.locator('h6:has-text("Schedule Interview")').waitFor({ state: 'visible', timeout: 15000 });
    await this.interviewTitleInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.formLoader.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});

    await this.interviewTitleInput.fill(title);
    const searchKey = interviewerName.split(' ')[0];
    await this.interviewerInput.fill(searchKey);
    await this.page.waitForTimeout(3000);
    await this.autocompleteOptions.first().click();

    await this.interviewDateInput.fill(date);
    await this.page.keyboard.press('Escape');

    await this.saveBtn.click();
    await this.page.waitForLoadState('networkidle');
  }
}
