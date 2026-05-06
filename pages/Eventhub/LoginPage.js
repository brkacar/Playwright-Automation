import { expect } from '@playwright/test';
import eventsTestData from '../../test-data/events-data.json' with { type: 'json' };

const { EVENT_BASE_URL } = eventsTestData;

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.url = `${EVENT_BASE_URL}/admin/events`;
    this.usernameField = page.getByPlaceholder('you@email.com');
    this.passwordField = page.getByLabel('Password');
    this.loginButton = page.locator('#login-btn');
    this.successLink = page.getByRole('link', { name: 'Browse Events →' });
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async login(username, password) {
    await this.goto();
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();
    await expect(this.successLink).toBeVisible();
  }
}
