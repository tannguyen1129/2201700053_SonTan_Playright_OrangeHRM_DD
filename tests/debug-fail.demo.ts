import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import loginData from '../test-data/login-data.json';

const validLogin = loginData.find(item => item.expected === 'success');

if (!validLogin) {
  throw new Error('Không tìm thấy valid login data trong login-data.json');
}

test.use({ trace: 'on' });

test('Debug Trace - intentional fail', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(validLogin.username, validLogin.password);
  await loginPage.assertLoginSuccess();

  // Cố tình sai để tạo trace fail
  await expect(page).toHaveURL(/this-url-does-not-exist/);
});