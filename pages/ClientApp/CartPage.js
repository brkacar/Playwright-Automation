const { test, expect } = require('@playwright/test');

class CartPage {
    constructor(page) {
        this.page = page;
        this.productCards = page.locator('.card-body');
        this.productTitles = page.locator('.card-body b');
        this.cartButton = page.getByRole('listitem').getByRole('button', { name: 'Cart' });
        this.cartItemList = page.locator('div li');
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    }
}

module.exports = { CartPage };