import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RecruitmentPage } from '../pages/RecruitmentPage';
import loginData from '../test-data/login-data.json';
import candidateData from '../test-data/candidate-data.json';

const validLogin = loginData.find(item => item.expected === 'success');

if (!validLogin) {
  throw new Error('Không tìm thấy valid login data trong login-data.json');
}

for (const candidate of candidateData) {
  test(`Recruitment - ${candidate.caseName}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const recruitmentPage = new RecruitmentPage(page);

    await loginPage.goto();
    await loginPage.login(validLogin.username, validLogin.password);
    await loginPage.assertLoginSuccess();

    await recruitmentPage.openCandidates();
    await recruitmentPage.clickAddCandidate();
    await recruitmentPage.addCandidate(candidate);
  });
}