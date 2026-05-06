const { test, expect, request } = require("@playwright/test");

let token;
let orderId;

//property does not have queotes in js objects
const loginPayload = { userEmail: "berasr@mailinator.com", userPassword: "P@ssw0rd" }
const orderPayload = {orders: [{ country: "Italy", productOrderedId: "6960ea76c941646b7a8b3dd5" }]}
test.beforeAll(async () => {
    //login api
    const apiContext = await request.newContext();
    const loginResponse = await apiContext.post('https://rahulshettyacademy.com/api/ecom/auth/login',
        {
            data: loginPayload
        }
    )
    expect(loginResponse.ok()).toBeTruthy();
    const loginResponseJson = await loginResponse.json();
    token = loginResponseJson.token;
    console.log(token);

    //order api
    const orderResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
        {
            data: orderPayload,
            headers: {
                'Authorization':token,
                'Content-Type':'application/json'
            }
        }
    )
    const orderResponseJson=await orderResponse.json();
    console.log(orderResponseJson);
    orderId=orderResponseJson.orders[0];


});

test('Test Place Order - with Api login and Api order', async ({ page }) => {

    
    page.addInitScript(value => {
        window.localStorage.setItem('token', value)
    }, token)

    await page.goto('/client');

    await page.getByRole("button", { name: "ORDERS" }).click();
    await page.getByText("Your Orders").waitFor();
    const rows = await page.locator("tbody tr");


    await rows.filter({ hasText: orderId }).getByRole("button", { name: "View" }).click();

    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(orderId.includes(orderIdDetails)).toBeTruthy();

})