import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AdminPage } from '../pages/AdminPage';
import loginData from '../test-data/login-data.json';
import searchData from '../test-data/search-data.json';

const validLogin = loginData.find(item => item.expected === 'success');

if (!validLogin) {
  throw new Error('Không tìm thấy valid login data trong login-data.json');
}

for (const data of searchData) {
  test(`Admin Search - ${data.caseName}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const adminPage = new AdminPage(page);

    await loginPage.goto();
    await loginPage.login(validLogin.username, validLogin.password);
    await loginPage.assertLoginSuccess();

    await adminPage.open();
    await adminPage.searchByUsername(data.username);
    await adminPage.assertUserVisible(data.expectedUsername);
  });
}