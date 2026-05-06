import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { capitalize } from '../utils/Helpers.js';
import { ClientApp } from '../test-data/credentials.js';
import { saveCreatedUser } from '../utils/userStore.js';

const { POManager } = require('../pages/ClientApp/POManager.js');
const dataset = JSON.parse(JSON.stringify(require("../test-data/created-users.json")));
const products=[ 'ADIDAS ORIGINAL', 'ZARA COAT 3', 'iphone 13 pro' ];

for (let i = 0; i < 10; i++) {  //register new users
    test(`Register user ${i}`, async ({ page }) => {  // only for user creation 
        const poManager = new POManager(page);
        const registerPage = poManager.RegisterPage()
        const loginPage = poManager.LoginPage();

        const email = faker.internet.email().replace(/@.*/, '@mailinator.com');
        const gender = faker.person.sex();
        const password = faker.internet.password({ length: 12 });

        await page.goto('/client');
        await loginPage.registerHereLink.click();
        await registerPage.fillRegistration({
            firstName: faker.person.firstName(gender),
            lastName: faker.person.lastName(gender),
            email,
            mobile: faker.string.numeric(10),
            role: 'Engineer',
            gender: capitalize(gender),
            password,
        });
        await registerPage.signUpButton.click();
        await registerPage.expectAccountCreated();
        await registerPage.loginLink.click();

        const user = {
            username: email,
            password: password,
        };

        await saveCreatedUser(user);

    });
}

for (const data of dataset){
test(`Test login only ${data.username}`, async ({ page }) => {
    const poManager = new POManager(page);
    const loginPage = poManager.LoginPage();

    await loginPage.login(data.username, data.password);
    await loginPage.productTitles.first().waitFor();
    const titles = await loginPage.productTitles.allTextContents();
    console.log(titles);
});
}

for (const data of dataset){

test.only(`E2E test for ordering product by ${data.username}`, async ({ page }) => {

    const product=products[Math.floor(Math.random()*products.length)];
    const poManager = new POManager(page);
    const loginPage = poManager.LoginPage();

    await page.goto('/client');
    await loginPage.login(data.username, data.password);

    const dashboardPage = poManager.DashboardPage();
    await dashboardPage.productTitles.first().waitFor();
    await dashboardPage.addProductToCart(product);
    await dashboardPage.navigateToCart(); 

    const cartPage = poManager.CartPage();
    await cartPage.cartItemList.first().waitFor();
    await expect(page.getByText(product)).toBeVisible();
    await cartPage.checkoutButton.click();


    const ordersReviewPage = poManager.OrdersReviewPage();
    await ordersReviewPage.selectCountry('Italy');
    await expect(ordersReviewPage.userNameLabel).toHaveText(data.username);
    await ordersReviewPage.placeOrderButton.click();
    await expect(ordersReviewPage.orderConfirmation).toBeVisible();

    const orderId = await ordersReviewPage.getOrderId();
    console.log(orderId);

    await dashboardPage.navigateToOrders();
    const ordersHistoryPage = poManager.OrdersHistoryPage();
    await ordersHistoryPage.searchOrderAndSelect(orderId);
    expect(orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();

});
}

/*
test('Test End to End - Initial version - no pom', async ({ page }) => {

    const products = page.locator(".card-body");
    const productName = 'ZARA COAT 3';

    await page.goto('https://rahulshettyacademy.com/client');

    await page.locator('#userEmail').fill(ClientApp.username);
    await page.locator('#userPassword').fill(ClientApp.password);
    await page.locator('#login').click();
    //await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor()
    const titles = await page.locator(".card-body b").allTextContents();
    console.log(titles);
    const count = await products.count();

    for (let i = 0; i < count; ++i) {
        if (await products.nth(i).locator("b").textContent() === productName) {

            await products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }
    //await page.pause();

    await page.locator("[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor();

    const bool = await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
    expect(await bool).toBeTruthy();

    await page.locator("text=Checkout").click();
    await page.locator("[placeholder*='Country']").pressSequentially("ita", { delay: 100 });
    const dropdown = page.locator(".ta-results");
    await dropdown.waitFor();
    const optionsCount = await dropdown.locator("button").count();
    for (let i = 0; i < optionsCount; ++i) {
        const text = await dropdown.locator("button").nth(i).textContent();
        if (text === " Italy") {
            await dropdown.locator("button").nth(i).click();
            break;
        }

    };
    await expect(page.locator(".user__name label")).toHaveText(email);
    await page.locator(".action__submit").click();
    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");

    const text = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    const orderId=text.split("|")[1].trim();
    console.log(orderId);

    await page.getByRole("button", { name: "ORDERS" }).click();
    await page.locator("tbody").waitFor();
    const rows = await page.locator("tbody tr");


    for (let i = 0; i < await rows.count(); ++i) {
        const rowOrderId = await rows.nth(i).locator("th").textContent();
        if (orderId.includes(rowOrderId)) {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }
    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(orderId.includes(orderIdDetails)).toBeTruthy();

})
*/