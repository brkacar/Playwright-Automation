import { expect } from '@playwright/test';

export class RegisterPage {
  constructor(page) {
    this.page = page;
    this.firstNameField = page.locator('#firstName');
    this.lastNameField = page.locator('#lastName');
    this.emailField = page.locator('#userEmail');
    this.mobileField = page.locator('#userMobile');
    this.roleSelect = page.getByRole('combobox');
    this.genderRadio = (gender) => page.locator(`input[value='${gender}']`);
    this.passwordField = page.locator('#userPassword');
    this.confirmPasswordField = page.locator('#confirmPassword');
    this.checkbox = page.locator("//input[@type='checkbox']");
    this.signUpButton = page.locator('#login');
    this.accountCreatedMessage = page.locator('.headcolor');
    this.loginLink = page.getByText('Login');
  }

  async fillRegistration({ firstName, lastName, email, mobile, role, gender, password }) {
    await this.firstNameField.fill(firstName);
    await this.lastNameField.fill(lastName);
    await this.emailField.fill(email);
    await this.mobileField.fill(mobile);
    await this.roleSelect.selectOption(role);
    await this.genderRadio(gender).check();
    await this.passwordField.fill(password);
    await this.confirmPasswordField.fill(password);
    await this.checkbox.check();
  }

  async expectAccountCreated() {
    await expect(this.accountCreatedMessage).toContainText('Account Created Successfully');
  }
}

module.exports = {RegisterPage};
