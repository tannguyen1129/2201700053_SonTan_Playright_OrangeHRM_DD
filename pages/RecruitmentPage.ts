import { expect, Locator, Page } from '@playwright/test';

type CandidateInput = {
  caseName: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  emailPrefix: string;
  contactNo?: string;
  keywords?: string;
  notes?: string;
  vacancy?: string;
};

export class RecruitmentPage {
  readonly page: Page;
  readonly recruitmentMenu: Locator;
  readonly addButton: Locator;
  readonly saveButton: Locator;
  readonly toastMessage: Locator;
  readonly mainTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.recruitmentMenu = page.getByRole('link', { name: 'Recruitment' });
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.toastMessage = page.locator('.oxd-toast');
    this.mainTitle = page.locator('.orangehrm-main-title');
  }

  private inputByLabel(label: string): Locator {
    return this.page.locator(
      `xpath=//label[normalize-space()='${label}']/ancestor::div[contains(@class,'oxd-input-group')]//input`
    );
  }

  private dropdownByLabel(label: string): Locator {
    return this.page.locator(
      `xpath=//label[normalize-space()='${label}']/ancestor::div[contains(@class,'oxd-input-group')]//div[contains(@class,'oxd-select-text-input')]`
    );
  }

  async openCandidates() {
    await this.recruitmentMenu.click();
    await expect(this.page).toHaveURL(/recruitment/);
  }

  async clickAddCandidate() {
    await this.addButton.click();
    await expect(this.mainTitle).toContainText(/Add Candidate/i);
  }

  async selectDropdownByLabel(label: string, optionText?: string) {
    await this.dropdownByLabel(label).click();

    const dropdownOptions = this.page.locator('.oxd-select-dropdown .oxd-select-option');

    if (optionText && optionText.trim()) {
      await this.page
        .locator('.oxd-select-dropdown')
        .getByText(optionText, { exact: true })
        .click();
    } else {
      await dropdownOptions.first().click();
    }
  }

  buildUniqueEmail(emailPrefix: string): string {
    return `${emailPrefix}+${Date.now()}@example.com`;
  }

  async addCandidate(candidate: CandidateInput) {
    const uniqueEmail = this.buildUniqueEmail(candidate.emailPrefix);

    await this.page.locator('input[name="firstName"]').fill(candidate.firstName);

    if (candidate.middleName) {
      await this.page.locator('input[name="middleName"]').fill(candidate.middleName);
    }

    await this.page.locator('input[name="lastName"]').fill(candidate.lastName);

    await this.selectDropdownByLabel('Vacancy', candidate.vacancy);

    await this.inputByLabel('Email').fill(uniqueEmail);

    if (candidate.contactNo) {
      await this.inputByLabel('Contact Number').fill(candidate.contactNo);
    }

    if (candidate.keywords) {
      await this.inputByLabel('Keywords').fill(candidate.keywords);
    }

    if (candidate.notes) {
      await this.page.locator('textarea').fill(candidate.notes);
    }

    await this.saveButton.click();

    await expect(this.toastMessage).toContainText(/Success/i);
    await expect(this.page.locator('input[name="firstName"]')).toHaveValue(candidate.firstName);
    await expect(this.page.locator('input[name="lastName"]')).toHaveValue(candidate.lastName);
    await expect(this.inputByLabel('Email')).toHaveValue(uniqueEmail);
  }
}