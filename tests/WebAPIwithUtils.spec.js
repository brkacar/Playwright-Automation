const { test, expect, request } = require("@playwright/test");
const {APIUtils}= require('../utils/APIUtils');
const loginPayload = { userEmail: "berasr@mailinator.com", userPassword: "P@ssw0rd" }
const orderPayload = {orders: [{ country: "Italy", productOrderedId: "6960ea76c941646b7a8b3dd5" }]}
 
let response;

test.beforeAll(async () => {

    const apiContext = await request.newContext();
    const apiUtils= new APIUtils(apiContext,loginPayload);
    response=await apiUtils.createOrder(orderPayload);

});


test('Test Place Order - with Api login and Api order', async ({ page }) => {

    page.addInitScript(value => {
        window.localStorage.setItem('token', value)
    }, response.token)

    await page.goto('/client');

    await page.getByRole("button", { name: "ORDERS" }).click();
    await page.getByText("Your Orders").waitFor();
    const rows = await page.locator("tbody tr");


    await rows.filter({ hasText: response.orderId }).getByRole("button", { name: "View" }).click();

    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(response.orderId.includes(orderIdDetails)).toBeTruthy();

})