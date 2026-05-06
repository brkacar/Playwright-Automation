import { expect } from '@playwright/test';

export class OrdersReviewPage {
  constructor(page) {
    this.page = page;
    this.userNameLabel = page.locator('.user__name label');
    this.placeOrderButton = page.getByText('PLACE ORDER');
    this.orderConfirmation = page.getByText('Thankyou for the order.');
    this.countrySelect = page.locator("[placeholder*='Country']");
    this.orderId = page.locator(".em-spacer-1 .ng-star-inserted");
  }


  async selectCountry(countryName) {
    await this.countrySelect.pressSequentially(countryName.slice(0, 3).toLowerCase(), { delay: 100 });
    await this.page.getByRole('button', { name: countryName }).click();
  }

  async getOrderId() {
    const text = await this.orderId.innerText();
    return text.split('|')[1].trim();
  }


}

module.exports = { OrdersReviewPage };
