export class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailField = page.locator('#userEmail');
    this.passwordField = page.locator('#userPassword');
    this.loginButton = page.locator('#login');
    this.productTitles = page.locator('.card-body b');
    this.registerHereLink = page.getByText('Register here');
  }

  async login(username, password) {
    await this.page.goto('/client');
    await this.emailField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }
}
module.exports = {LoginPage};