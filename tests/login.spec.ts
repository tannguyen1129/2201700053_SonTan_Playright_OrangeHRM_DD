import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import loginData from '../test-data/login-data.json';

for (const data of loginData) {
  test(`Login - ${data.caseName}`, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(data.username, data.password);

    if (data.expected === 'success') {
      await loginPage.assertLoginSuccess();
    } else {
      await loginPage.assertLoginFailed();
    }
  });
}