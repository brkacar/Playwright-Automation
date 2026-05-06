const { test, expect, request } = require('@playwright/test');
const { APIUtils } = require('../utils/APIUtils');
const loginPayload = { userEmail: "berasr@mailinator.com", userPassword: "P@ssw0rd" };
const orderPayload = {orders: [{ country: "Italy", productOrderedId: "6960ea76c941646b7a8b3dd5" }]};
const fakePayLoadOrder = { data: [], message: "No Orders" };
 
let response;
test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const apiUtils = new APIUtils(apiContext, loginPayload);
  response = await apiUtils.createOrder(orderPayload);
 
})
 
 
//create order is success
test('Intercept api call with body of no order', async ({ page }) => {
  page.addInitScript(value => {
 
    window.localStorage.setItem('token', value);
  }, response.token);
  await page.goto("/client");
 
 
  await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
    async route => {
      const response = await page.request.fetch(route.request());
      let body = JSON.stringify(fakePayLoadOrder);
      route.fulfill(
        {
          response,
          body, 
 
        });
      //intercepting response -APi response-> { playwright fakeresponse}->browser->render data on front end
    });
 
  await page.locator("button[routerlink*='myorders']").click();
  await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*")
 
  console.log(await page.locator(".mt-4").textContent());
 
 
 
});