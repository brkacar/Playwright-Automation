import { expect } from '@playwright/test';

export class DashboardPage {
  constructor(page) {
    this.page = page;
    this.productCards = page.locator('.card-body');
    this.productTitles = page.locator('.card-body b');
    this.cartItemList = page.locator('div li');
    this.cartButton = page.getByRole('listitem').getByRole('button', { name: 'Cart' });
    this.ordersButton = page.getByRole('button', { name: 'ORDERS' });

  }

  async addProductToCart(productName) {
    await this.productCards
      .filter({ hasText: productName })
      .getByRole('button', { name: 'Add to Cart' })
      .click();
  }

  async navigateToOrders() {
    await this.ordersButton.click();
  }


  async navigateToCart() {
    await this.cartButton.click();
  }

}
module.exports = { DashboardPage };

