import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly dashboardHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('.oxd-alert-content-text');
    this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard' });
  }

async goto() {
  await this.page.goto('/web/index.php/auth/login', {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await expect(this.usernameInput).toBeVisible();
}
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async assertLoginSuccess() {
    await expect(this.page).toHaveURL(/dashboard/);
    await expect(this.dashboardHeading).toBeVisible();
  }

  async assertLoginFailed() {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(/Invalid credentials/i);
  }
}