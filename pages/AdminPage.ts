import { expect, Locator, Page } from '@playwright/test';

export class AdminPage {
  readonly page: Page;
  readonly adminMenu: Locator;
  readonly searchButton: Locator;
  readonly resultRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.adminMenu = page.getByRole('link', { name: 'Admin' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resultRows = page.locator('.oxd-table-card');
  }

  private inputByLabel(label: string): Locator {
    return this.page.locator(
      `xpath=//label[normalize-space()='${label}']/ancestor::div[contains(@class,'oxd-input-group')]//input`
    );
  }

  async open() {
    await this.adminMenu.click();
    await expect(this.page).toHaveURL(/admin/);
    await expect(this.searchButton).toBeVisible();
  }

  async searchByUsername(username: string) {
    await this.inputByLabel('Username').fill(username);
    await this.searchButton.click();
  }

  async assertUserVisible(username: string) {
    await expect(this.resultRows.first()).toBeVisible();
    await expect(this.resultRows.first()).toContainText(username);
  }
}