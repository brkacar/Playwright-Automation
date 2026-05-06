const { RegisterPage } = require('./RegisterPage');
const { LoginPage } = require('./LoginPage');
const { DashboardPage } = require('./DashboardPage');
const { OrdersHistoryPage } = require('./OrdersHistoryPage');
const { OrdersReviewPage } = require('./OrdersReviewPage');
const { CartPage } = require('./CartPage');


class POManager {




    constructor(page) {
        this.page = page;
        this.registerPage = new RegisterPage(this.page);
        this.loginPage = new LoginPage(this.page);
        this.dashboardPage = new DashboardPage(this.page);
        this.ordersHistoryPage = new OrdersHistoryPage(this.page);
        this.ordersReviewPage = new OrdersReviewPage(this.page);
        this.cartPage = new CartPage(this.page);
    }

    RegisterPage(){
        return this.registerPage;
    }

    LoginPage() {
        return this.loginPage;
    }

    CartPage() {
        return this.cartPage;
    }

    DashboardPage() {
        return this.dashboardPage;
    }

    OrdersHistoryPage() {
        return this.ordersHistoryPage;
    }

    OrdersReviewPage() {
        return this.ordersReviewPage;
    }
}
module.exports = { POManager };