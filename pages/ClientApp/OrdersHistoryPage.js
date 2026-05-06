class OrdersHistoryPage {
    constructor(page) {
        this.page = page;
        this.ordersTable = page.locator("tbody");
        this.rows = page.locator("tbody tr");
        this.orderdIdDetails = page.locator(".col-text");
    }
    async searchOrderAndSelect(orderId) {

        await this.rows.filter({ hasText: orderId })
            .getByRole('button', { name: 'View' }).click();

    }


    async expectOrderDetailsContains(orderId) {
        const orderIdDetails = await this.orderDetails.textContent();
        expect(orderId.includes(orderIdDetails)).toBeTruthy();
    }

    async getOrderId() {
        return await this.orderdIdDetails.textContent();
    }

}
module.exports = { OrdersHistoryPage };
